import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      question,
      startDate,
      endDate,
      minSimilarity,
      maxArticles,
    } = body;

    // Validation
    if (!question || !startDate || !endDate) {
      return NextResponse.json(
        { error: "필수 필드가 누락되었습니다." },
        { status: 400 }
      );
    }

    // Get n8n webhook URL from environment variable
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
      return NextResponse.json(
        { error: "n8n 웹훅 URL이 설정되지 않았습니다. N8N_WEBHOOK_URL 환경 변수를 확인하세요." },
        { status: 500 }
      );
    }

    // Prepare payload to send to n8n
    const payload = {
      question,
      startDate,
      endDate,
      minSimilarity,
      maxArticles,
    };

    console.log("📤 n8n 웹훅으로 요청 전송:", {
      url: n8nWebhookUrl,
      payload,
    });

    // Send POST request to n8n webhook
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(120000), // 120초 타임아웃
    });

    console.log("📥 n8n 응답 상태:", n8nResponse.status);

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error("❌ n8n API 오류:", errorText);
      return NextResponse.json(
        { error: `n8n 처리 실패: ${n8nResponse.status} ${n8nResponse.statusText}` },
        { status: n8nResponse.status }
      );
    }

    const responseText = await n8nResponse.text();
    console.log("📄 n8n 응답 텍스트:", responseText);

    let n8nData;
    try {
      n8nData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error("❌ JSON 파싱 실패:", e);
      n8nData = {};
    }

    console.log("✅ n8n 응답 데이터:", n8nData);

    // Extract report from various possible fields
    const report =
      n8nData.report ||
      n8nData.html_report ||
      n8nData.text ||
      n8nData.output ||
      n8nData.message ||
      JSON.stringify(n8nData);

    if (!report || report === "{}") {
      console.warn("⚠️ n8n에서 빈 응답을 받음. Respond to Webhook 노드의 Response Body를 확인하세요.");
    }

    // Forward n8n response to client
    return NextResponse.json({
      report,
      status: "success",
    });
  } catch (error) {
    console.error("❌ 리포트 생성 오류:", error);

    let errorMessage = "리포트 생성 중 오류가 발생했습니다.";

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = "요청 시간 초과 (120초). n8n 워크플로우 실행 시간을 확인하세요.";
      } else {
        errorMessage = `오류: ${error.message}`;
      }
    } else if (error instanceof TypeError) {
      errorMessage = "n8n 웹훅에 연결할 수 없습니다. 네트워크와 URL을 확인하세요.";
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
