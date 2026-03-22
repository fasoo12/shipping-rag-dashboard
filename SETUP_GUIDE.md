# 🚀 해운/물류 AI 리서치 대시보드 - 설정 가이드

완성된 Next.js 대시보드를 바로 시작할 수 있는 가이드입니다.

## ⚡ 빠른 시작 (5분)

### 1. 의존성 설치

```bash
cd POSTGRES_RAG
npm install --legacy-peer-deps
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 3. 대시보드 사용

- **좌측 패널**: 검색 조건 입력
  - 질문 입력
  - 날짜 범위 선택
  - 슬라이더로 유사도 조정
  - 기사 수량 설정

- **우측 패널**: 결과 표시
  - 마크다운 렌더링된 리포트
  - 스크롤 가능한 영역

## 📁 프로젝트 구조

```
POSTGRES_RAG/
├── app/
│   ├── api/
│   │   └── generate-report/route.ts      # API 엔드포인트
│   ├── layout.tsx                        # 루트 레이아웃
│   ├── page.tsx                          # 홈 페이지
│   └── globals.css                       # 전역 스타일
├── components/
│   ├── ResearchDashboard.tsx             # 메인 컴포넌트
│   └── ui/                               # Shadcn UI 컴포넌트
├── lib/
│   └── utils.ts                          # 유틸리티
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

## 🎯 주요 기능

### ✅ 구현된 기능

- [x] 반응형 대시보드 UI (모바일/태블릿/데스크톱)
- [x] 검색 폼 (텍스트, 날짜, 슬라이더, 숫자)
- [x] 로딩 상태 (스피너 애니메이션)
- [x] 마크다운 렌더링
- [x] 오류 처리 및 메시지
- [x] 깔끔한 현대식 디자인
- [x] TypeScript 타입 안전성
- [x] SEO 최적화

## 🔌 n8n 통합

현재 상태: **모의 응답** (실제 n8n 연동 전)

실제 n8n 워크플로우와 연결하려면:

### 단계 1: n8n 워크플로우 생성

```
Webhook (POST) → 데이터 검증 → LLM → Respond to Webhook
```

상세 가이드는 `N8N_INTEGRATION.md` 참고

### 단계 2: 대시보드 API 업데이트

`app/api/generate-report/route.ts` 수정:

```typescript
// 현재 (모의 응답)
const mockReport = `...`;
return NextResponse.json({ report: mockReport.trim() });

// 변경할 부분 (n8n 연동)
const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
```

자세한 내용은 `N8N_INTEGRATION.md` → **Step 4** 참고

### 단계 3: 환경 변수 설정

`.env.local` 생성:

```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/shipping-rag-report
```

## 🛠️ 주요 기술

| 항목 | 버전 | 용도 |
|------|------|------|
| Next.js | 15.1.0 | 풀스택 프레임워크 |
| React | 18.3.0 | UI 라이브러리 |
| TypeScript | 5.x | 타입 안전성 |
| Tailwind CSS | 3.4 | 스타일링 |
| Shadcn UI | Latest | UI 컴포넌트 |
| React Markdown | 9.0 | 마크다운 렌더링 |
| Lucide React | 0.293 | 아이콘 |

## 🎨 UI 컴포넌트

### 제공되는 컴포넌트

- **Button**: 다양한 스타일 (default, outline, ghost, link)
- **Input**: 텍스트 입력
- **Label**: 폼 라벨
- **Card**: 카드 컨테이너 (Header, Title, Description, Content, Footer)
- **Slider**: 범위 슬라이더 (0~1)
- **DatePicker**: 날짜 선택기
- **Calendar**: 달력 팝오버

### 사용 예시

```typescript
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function MyComponent() {
  const [date, setDate] = useState<Date>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>제목</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DatePicker value={date} onChange={setDate} />
        <Button onClick={handleClick}>클릭</Button>
      </CardContent>
    </Card>
  );
}
```

## 📋 폼 검증

### 현재 검증 규칙

```typescript
- 질문 (필수): 빈 문자열 불가
- 시작일 (필수): 선택 필수
- 종료일 (필수): 선택 필수
- 유사도 (선택): 0.0 ~ 1.0 (기본: 0.5)
- 기사 수 (선택): 1 ~ 100 (기본: 15)
```

### 커스터마이징

`components/ResearchDashboard.tsx`의 `handleGenerateReport` 함수에서 검증 로직 추가:

```typescript
// 날짜 순서 확인
if (params.startDate > params.endDate) {
  setError("시작일이 종료일보다 늦을 수 없습니다.");
  return;
}

// 최소 글자 수
if (params.question.length < 5) {
  setError("질문은 최소 5자 이상이어야 합니다.");
  return;
}
```

## 🌐 API 요청/응답

### 요청 형식

```bash
POST /api/generate-report
Content-Type: application/json

{
  "question": "한국 해운사의 최근 동향은?",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "minSimilarity": 0.5,
  "maxArticles": 15
}
```

### 응답 형식

```json
{
  "status": "success",
  "report": "# 분석 리포트\n\n## 주요 내용\n..."
}
```

## 🚀 배포

### Vercel 배포

```bash
# 로그인
vercel login

# 배포
vercel deploy

# 프로덕션 배포
vercel deploy --prod
```

### 환경 변수 설정

Vercel 대시보드:
1. Settings → Environment Variables
2. `N8N_WEBHOOK_URL` 추가
3. 재배포

## 📊 빌드 및 성능

### 빌드 결과

```
Route                                 Size  First Load JS
┌ ○ /                              90.8 kB         193 kB
├ ○ /_not-found                      995 B         103 kB
└ ƒ /api/generate-report             123 B         102 kB

✓ Compiled successfully
✓ Generating static pages (5/5)
```

### 최적화

- 정적 페이지 사전 생성 (SSG)
- 자동 코드 분할
- 이미지 최적화
- CSS 최소화

## 🔧 커스터마이징

### 색상 테마 변경

`app/globals.css`:

```css
:root {
  --primary: 221 83% 53%;        /* 파란색 */
  --accent: 142.1 70.6% 45.3%;   /* 초록색 */
  /* ... 기타 변수 ... */
}
```

### 폰트 변경

`app/layout.tsx`:

```typescript
import { Inter, Noto_Sans_KR } from "next/font/google";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={notoSansKr.className}>
        {children}
      </body>
    </html>
  );
}
```

### API 엔드포인트 추가

```typescript
// app/api/custom-endpoint/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  // 로직 처리
  return NextResponse.json({ result: "..." });
}
```

## 🐛 문제 해결

### 빌드 오류: "Cannot find module"

```bash
# 캐시 삭제
rm -rf .next node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### 개발 서버 포트 점유

```bash
# 다른 포트로 실행
npm run dev -- -p 3001
```

### 날짜 선택기 안 열림

- 브라우저 개발자 도구 콘솔에서 오류 확인
- `@radix-ui` 라이브러리 버전 확인

## 📚 문서

| 문서 | 내용 |
|------|------|
| README.md | 프로젝트 개요 |
| N8N_INTEGRATION.md | n8n 웹훅 연동 상세 가이드 |
| SETUP_GUIDE.md | 이 파일 |

## 💡 팁

### 개발 중 핫 리로드

```bash
npm run dev
# 파일 저장 시 자동으로 브라우저 새로고침
```

### TypeScript 오류 확인

```bash
npx tsc --noEmit
```

### 번들 크기 분석

```bash
npm run build
# .next/static 디렉토리 확인
```

## ✅ 체크리스트

배포 전 확인사항:

- [ ] `npm run build` 성공
- [ ] 환경 변수 설정 완료
- [ ] n8n 웹훅 URL 확인
- [ ] 모바일 브라우저에서 테스트
- [ ] 폼 검증 확인
- [ ] 에러 처리 확인
- [ ] API 응답 시간 확인
- [ ] SEO 메타데이터 확인

## 📞 지원

문제 발생 시:

1. `N8N_INTEGRATION.md` → 문제 해결 섹션 확인
2. 브라우저 개발자 도구 (F12) 콘솔 확인
3. Next.js 로그 확인

---

**마지막 업데이트**: 2026-03-22
**버전**: 0.1.0
