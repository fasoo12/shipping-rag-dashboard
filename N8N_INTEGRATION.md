# n8n 웹훅 통합 가이드

이 가이드는 Next.js 대시보드를 n8n 워크플로우와 연동하는 방법을 설명합니다.

## 🔄 통합 아키텍처

```
[대시보드 폼] → POST /api/generate-report → [n8n 웹훅] → [LLM 분석] → [웹훅 응답] → [대시보드]
```

## 📋 Step 1: n8n 워크플로우 설정

### 1-1. Webhook 노드 생성

1. n8n 에디터에서 새 노드 추가
2. **Webhook** 노드 선택
3. 다음 설정 적용:
   - **Method**: POST
   - **Path**: `/shipping-rag-report` (또는 원하는 경로)
   - **Authentication**: None (또는 Basic Auth로 보호)

### 1-2. 웹훅 URL 복사

생성된 웹훅 URL 형식:
```
https://your-n8n-instance.com/webhook/shipping-rag-report
```

이 URL을 기억해두세요. 대시보드에서 필요합니다.

### 1-3. 기존 Form Trigger 제거

- 기존의 Form Trigger 노드는 삭제하세요
- Webhook 노드가 대신 입력을 받습니다

## 🔄 Step 2: LLM 처리 로직

Webhook 노드 다음에 다음 노드들을 연결하세요:

```
Webhook (입력 수신)
  ↓
[선택] 데이터 검증 (IF 조건)
  ↓
Function / Expression (필요시 데이터 변환)
  ↓
OpenAI / Claude / 기타 LLM (리포트 생성)
  ↓
Respond to Webhook (응답 전송)
```

### LLM 프롬프트 예시

```
당신은 해운 및 물류 시장 분석 전문가입니다.

다음 조건에 따라 마크다운 형식의 분석 리포트를 작성하세요:

질문: {{$json.question}}
분석 기간: {{$json.startDate}} ~ {{$json.endDate}}
최소 유사도: {{$json.minSimilarity}}
최대 기사 수: {{$json.maxArticles}}

리포트는 다음 구조를 따르세요:
1. 제목 및 개요
2. 주요 트렌드 (3-5개)
3. 시장 분석
4. 위험 요소 및 기회
5. 결론 및 권장사항

마크다운 형식으로 작성하고, 구체적인 통계와 사례를 포함하세요.
```

## 📤 Step 3: 응답 전송

### Respond to Webhook 노드 설정

1. 노드 이름: "Respond to Webhook"
2. **Response Body**에 다음 JSON 구조로 설정:

```json
{
  "report": "{{ $json.response_text }}"
}
```

또는 LLM 노드의 결과가 직접 문자열이면:

```json
{
  "report": "{{ $json.text }}"
}
```

### HTTP Status Code
- 성공: `200 OK`
- 오류: `400 Bad Request` 또는 `500 Internal Server Error`

## 🖥️ Step 4: 대시보드 API 설정

### 4-1. API 라우트 수정

`app/api/generate-report/route.ts`를 수정하여 n8n 웹훅으로 요청을 전송합니다:

```typescript
import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL ||
  "https://your-n8n-instance.com/webhook/shipping-rag-report";

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

    // n8n 웹훅으로 요청 전송
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        startDate,
        endDate,
        minSimilarity,
        maxArticles,
      }),
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n API Error: ${n8nResponse.statusText}`);
    }

    const data = await n8nResponse.json();

    return NextResponse.json({
      report: data.report || "결과를 생성할 수 없습니다.",
      status: "success",
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "리포트 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
```

### 4-2. 환경 변수 설정

`.env.local` 파일 생성:

```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/shipping-rag-report
```

또는 `.env.production`:

```env
N8N_WEBHOOK_URL=https://prod-n8n.your-domain.com/webhook/shipping-rag-report
```

## 🔐 Step 5: 보안 설정

### 5-1. n8n 웹훅 인증 (선택사항)

Webhook 노드에서 **Authentication** 활성화:

```
- Basic Auth
  - Username: your-username
  - Password: your-password

- Custom Headers
  - X-API-Key: your-secret-key
```

### 5-2. 대시보드에서 인증 헤더 추가

```typescript
const headers: Record<string, string> = {
  "Content-Type": "application/json",
};

// 환경 변수에서 API 키 읽기
const apiKey = process.env.N8N_API_KEY;
if (apiKey) {
  headers["X-API-Key"] = apiKey;
}

const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
  method: "POST",
  headers,
  body: JSON.stringify(payload),
});
```

## 🧪 Step 6: 테스트

### 테스트 방법

1. **로컬에서 테스트**
   ```bash
   npm run dev
   # http://localhost:3000 접속
   ```

2. **curl로 API 테스트**
   ```bash
   curl -X POST http://localhost:3000/api/generate-report \
     -H "Content-Type: application/json" \
     -d '{
       "question": "한국 해운사 동향",
       "startDate": "2024-01-01",
       "endDate": "2024-12-31",
       "minSimilarity": 0.5,
       "maxArticles": 15
     }'
   ```

3. **n8n 웹훅 테스트**
   - n8n 에디터에서 "Test Webhook" 버튼 클릭
   - 테스트 데이터 입력
   - 응답 확인

## 🐛 문제 해결

### 문제 1: 웹훅이 응답하지 않음
- **해결**: n8n 워크플로우가 활성화되어 있는지 확인
- **확인**: "Respond to Webhook" 노드가 존재하는지 확인

### 문제 2: CORS 오류
- **해결**: n8n 인스턴스의 CORS 설정 확인
- **설정**: n8n `.env` 파일에서:
  ```env
  WEBHOOK_TUNNEL_URL=https://your-n8n-domain.com
  ```

### 문제 3: 타임아웃
- **해결**: n8n 워크플로우의 실행 시간 확인
- **설정**: 대시보드의 fetch 타임아웃 증가 (기본: 30초)

```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 120000); // 120초

const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
  signal: controller.signal,
});

clearTimeout(timeoutId);
```

### 문제 4: "필드를 찾을 수 없음" 에러
- **확인**: n8n 노드 간 데이터 전달 확인
- **해결**: JSON 경로 수정 (예: `$json.text` vs `$json.response_text`)

## 📊 예시 워크플로우

```
┌─────────────────┐
│    Webhook      │ ← POST 요청 수신
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ IF 조건 검증     │ ← question, startDate, endDate 필수
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ HTTP Request    │ ← 외부 API에서 뉴스/기사 조회 (선택)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  OpenAI/Claude  │ ← 리포트 생성
│   (with memory) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Respond Webhook │ ← {"report": "..."}로 응답
└─────────────────┘
```

## 📝 환경 변수 전체 목록

```env
# n8n 웹훅 URL
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/shipping-rag-report

# 인증 (선택사항)
N8N_API_KEY=your-secret-key
N8N_USERNAME=your-username
N8N_PASSWORD=your-password

# 로깅
DEBUG=true
LOG_LEVEL=debug
```

## 🚀 배포

### Vercel에 배포할 때

1. **환경 변수 설정**
   - Vercel 대시보드 → Settings → Environment Variables
   - `N8N_WEBHOOK_URL` 추가

2. **배포**
   ```bash
   git push
   # 또는 vercel deploy
   ```

3. **확인**
   - 배포된 URL로 접속
   - 폼 제출 후 n8n 워크플로우 실행 확인

## 📚 참고 자료

- [n8n 웹훅 문서](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base-webhook/)
- [n8n Respond to Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base-respondtowebhook/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

**마지막 업데이트**: 2026-03-22
