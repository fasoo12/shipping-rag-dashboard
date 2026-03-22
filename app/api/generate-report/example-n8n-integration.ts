/**
 * n8n 웹훅 통합 예시
 * 이 파일은 실제 route.ts를 수정할 때 참고하는 용도입니다.
 */

import { NextRequest, NextResponse } from "next/server";

// n8n 웹훅 URL (환경 변수에서 읽기)
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL ||
  "https://your-n8n-instance.com/webhook/shipping-rag-report";

// n8n API 키 (선택사항)
const N8N_API_KEY = process.env.N8N_API_KEY;

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

    // 입력 검증
    if (!question || !startDate || !endDate) {
      return NextResponse.json(
        { error: "필수 필드가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 추가 검증 (선택사항)
    if (new Date(startDate) > new Date(endDate)) {
      return NextResponse.json(
        { error: "시작일이 종료일보다 늦을 수 없습니다." },
        { status: 400 }
      );
    }

    // HTTP 헤더 구성
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // API 키가 있으면 추가
    if (N8N_API_KEY) {
      headers["X-API-Key"] = N8N_API_KEY;
      // 또는 Basic Auth
      // const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');
      // headers["Authorization"] = `Basic ${basicAuth}`;
    }

    console.log("Sending request to n8n webhook:", {
      url: N8N_WEBHOOK_URL,
      payload: { question, startDate, endDate, minSimilarity, maxArticles },
    });

    // n8n 웹훅으로 POST 요청 전송
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        question,
        startDate,
        endDate,
        minSimilarity,
        maxArticles,
      }),
      // 타임아웃 설정 (120초)
      signal: AbortSignal.timeout(120000),
    });

    console.log("n8n response status:", n8nResponse.status);

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error("n8n API error:", errorText);
      throw new Error(
        `n8n API Error: ${n8nResponse.status} ${n8nResponse.statusText}`
      );
    }

    const data = await n8nResponse.json();
    console.log("n8n response data:", data);

    // 응답 형식에 따라 처리
    // n8n의 Respond to Webhook에서 { "report": "..." } 형식으로 반환한다고 가정
    const report = data.report ||
      data.text ||
      data.result ||
      JSON.stringify(data);

    return NextResponse.json({
      status: "success",
      report,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Report generation error:", error);

    // 에러 메시지 구성
    let errorMessage = "리포트 생성 중 오류가 발생했습니다.";

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = "요청 시간 초과 (120초). n8n 워크플로우 실행 시간을 확인하세요.";
      } else {
        errorMessage = `오류: ${error.message}`;
      }
    } else if (error instanceof TypeError) {
      errorMessage = "n8n 웹훅에 연결할 수 없습니다. URL을 확인하세요.";
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * 환경 변수 예시 (.env.local)
 *
 * N8N_WEBHOOK_URL=https://n8n.example.com/webhook/shipping-rag-report
 * N8N_API_KEY=your-secret-api-key (선택사항)
 */

/**
 * n8n 워크플로우 구조 예시
 *
 * 1. Webhook 노드
 *    - Method: POST
 *    - Path: /shipping-rag-report
 *
 * 2. Function 노드 (데이터 검증 및 변환)
 *    - Input: $json에서 question, startDate, endDate 등 추출
 *
 * 3. OpenAI/Claude 노드 (LLM으로 리포트 생성)
 *    - Prompt: 사용자 질문 기반으로 마크다운 리포트 생성
 *
 * 4. Respond to Webhook 노드
 *    - Response Body:
 *      {
 *        "report": "{{ $json.text }}"
 *      }
 */

/**
 * 테스트 명령어
 *
 * curl -X POST http://localhost:3000/api/generate-report \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "question": "한국 해운사의 최근 동향은?",
 *     "startDate": "2024-01-01",
 *     "endDate": "2024-12-31",
 *     "minSimilarity": 0.5,
 *     "maxArticles": 15
 *   }'
 */
