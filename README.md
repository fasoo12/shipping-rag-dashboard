# 🚢 해운/물류 AI 리서치 대시보드

Next.js, Shadcn UI, Tailwind CSS를 사용하여 만든 현대적인 AI 기반 해운/물류 분석 대시보드입니다.

## ✨ 기능

- **검색 폼**: 직관적인 UI로 분석 조건 입력
  - 질문 텍스트 입력
  - 시작일/종료일 날짜 선택기
  - 최소 유사도 슬라이더 (0.0 ~ 1.0)
  - 최대 기사 수량 입력

- **AI 리포트 생성**: `/api/generate-report` 엔드포인트로 POST 요청

- **마크다운 렌더링**: 결과를 깔끔한 마크다운 형식으로 표시

- **반응형 디자인**: 모바일부터 데스크톱까지 완벽하게 지원

- **로딩 상태**: 스피너 애니메이션으로 요청 진행 중 표시

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하세요.

### 빌드

```bash
npm run build
npm start
```

## 📁 프로젝트 구조

```
.
├── app/
│   ├── api/
│   │   └── generate-report/
│   │       └── route.ts          # API 엔드포인트
│   ├── globals.css               # 전역 스타일
│   ├── layout.tsx                # 루트 레이아웃
│   └── page.tsx                  # 홈 페이지
├── components/
│   ├── ResearchDashboard.tsx      # 메인 대시보드 컴포넌트
│   └── ui/                        # Shadcn UI 컴포넌트들
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── card.tsx
│       ├── slider.tsx
│       ├── calendar.tsx
│       ├── datepicker.tsx
│       └── popover.tsx
├── lib/
│   └── utils.ts                  # 유틸리티 함수
├── package.json
├── tailwind.config.ts            # Tailwind 설정
├── tsconfig.json                 # TypeScript 설정
└── README.md
```

## 🔧 주요 기술 스택

- **Next.js 16.2**: React 기반 풀스택 프레임워크
- **React 19**: 최신 React 라이브러리
- **TypeScript**: 타입 안전성
- **Tailwind CSS 3.4**: 유틸리티 기반 CSS
- **Shadcn UI**: 고품질 UI 컴포넌트
- **React Markdown**: 마크다운 렌더링
- **Lucide React**: 아이콘
- **Date-fns**: 날짜 처리

## 🔌 API 통합 (n8n)

### 현재 상태
- API 엔드포인트: `POST /api/generate-report`
- 요청 페이로드:
  ```json
  {
    "question": "사용자 질문",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "minSimilarity": 0.5,
    "maxArticles": 15
  }
  ```

### n8n 웹훅 연동 방법

1. **n8n Workflow 수정**
   - 기존 Form Trigger 제거
   - Webhook 노드 추가 (Method: POST)
   - n8n에서 생성된 웹훅 URL 복사

2. **대시보드 설정**
   - `app/api/generate-report/route.ts`의 주석 부분 수정
   - n8n 웹훅 URL로 POST 요청 전송
   ```typescript
   // TODO: n8n 웹훅 URL로 교체
   const n8nWebhookUrl = "https://your-n8n-instance.com/webhook/your-webhook-path";
   const n8nResponse = await fetch(n8nWebhookUrl, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(payload),
   });
   ```

3. **응답 처리**
   - n8n Respond to Webhook 노드로 리포트 반환
   - 마크다운 형식의 리포트 텍스트 포함

## 📋 응답 형식

n8n에서 반환되는 응답:
```json
{
  "report": "# 분석 리포트\n\n## 주요 내용\n..."
}
```

## 🎨 디자인 특징

- **신뢰감 있는 색상**: 파란색과 회색의 조합
- **깔끔한 레이아웃**: 좌측 검색 폼, 우측 결과 영역
- **반응형 그리드**: 작은 화면에서는 스택 레이아웃
- **부드러운 애니메이션**: 로딩 스피너, 팝오버 애니메이션
- **접근성**: ARIA 레이블, 적절한 대비

## 🛠️ 커스터마이징

### 테마 색상 변경
`app/globals.css`의 `:root` 섹션에서 CSS 변수 수정:
```css
--primary: 221 83% 53%; /* 기본 파란색 */
--accent: 142.1 70.6% 45.3%; /* 강조 색상 */
```

### API 응답 처리
`components/ResearchDashboard.tsx`의 `handleGenerateReport` 함수 수정

### 유효성 검사 추가
Form 제출 전 추가 검증 로직 구현 가능

## 📝 라이센스

MIT

## 👨‍💻 개발자

Claude Code를 통해 생성된 프로젝트
