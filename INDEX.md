# 📚 해운/물류 AI 리서치 대시보드 - 문서 인덱스

프로젝트의 모든 문서와 파일을 한눈에 보기 위한 가이드입니다.

## 🚀 빠른 시작 (5분)

👉 **[QUICK_START.md](./QUICK_START.md)** - 가장 먼저 읽기!
- 설치 방법 (1줄)
- 서버 실행 (1줄)
- 대시보드 사용법 (3단계)

## 📖 상세 문서

### 1️⃣ 프로젝트 개요
- **[README.md](./README.md)** (종합 설명)
  - 프로젝트 소개
  - 주요 기능
  - 프로젝트 구조
  - 기술 스택
  - 배포 방법

### 2️⃣ 설치 및 설정
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** (상세 가이드)
  - 설치 방법
  - 개발 환경 구성
  - 프로젝트 구조 설명
  - 주요 기능 상세 설명
  - 커스터마이징 방법
  - 배포 가이드
  - 문제 해결

### 3️⃣ n8n 웹훅 통합
- **[N8N_INTEGRATION.md](./N8N_INTEGRATION.md)** (통합 가이드)
  - n8n 워크플로우 설정
  - Webhook 노드 구성
  - LLM 프롬프트 예시
  - API 라우트 수정 방법
  - 환경 변수 설정
  - 보안 설정
  - 테스트 방법
  - 문제 해결

## 📁 핵심 파일 위치

### 대시보드 UI
```
components/
├── ResearchDashboard.tsx      ← 메인 대시보드 컴포넌트
└── ui/                        ← Shadcn UI 컴포넌트들
    ├── button.tsx             ← 버튼
    ├── input.tsx              ← 텍스트 입력
    ├── label.tsx              ← 라벨
    ├── card.tsx               ← 카드 레이아웃
    ├── slider.tsx             ← 슬라이더
    ├── datepicker.tsx         ← 날짜 선택기
    ├── calendar.tsx           ← 달력
    └── popover.tsx            ← 팝오버
```

### 백엔드 API
```
app/
├── api/
│   └── generate-report/
│       ├── route.ts                          ← API 엔드포인트 (현재)
│       └── example-n8n-integration.ts        ← n8n 통합 예시
├── page.tsx                  ← 홈 페이지
├── layout.tsx                ← 루트 레이아웃
└── globals.css               ← 전역 스타일
```

### 설정 파일
```
├── package.json              ← 의존성 관리
├── tsconfig.json             ← TypeScript 설정 (자동 수정됨)
├── tailwind.config.ts        ← Tailwind CSS 설정
├── next.config.ts            ← Next.js 설정
└── postcss.config.js         ← PostCSS 설정
```

### 문서
```
├── QUICK_START.md            ← 이 파일! 5분 시작 가이드
├── README.md                 ← 프로젝트 전체 설명
├── SETUP_GUIDE.md            ← 상세 설정 및 배포
├── N8N_INTEGRATION.md        ← n8n 연동 방법
└── INDEX.md                  ← 문서 인덱스
```

## 🔍 상황별 필독서

### "지금 바로 시작하고 싶어!"
1. [QUICK_START.md](./QUICK_START.md) (5분)
2. `npm install --legacy-peer-deps`
3. `npm run dev`

### "상세하게 설정하고 싶어"
1. [README.md](./README.md) - 전체 이해
2. [SETUP_GUIDE.md](./SETUP_GUIDE.md) - 상세 설정
3. UI 커스터마이징 섹션 참고

### "n8n과 연동하고 싶어"
1. [N8N_INTEGRATION.md](./N8N_INTEGRATION.md) - 단계별 가이드
2. `app/api/generate-report/example-n8n-integration.ts` - 코드 예시
3. `.env.local` 파일에 `N8N_WEBHOOK_URL` 설정

### "문제가 생겼어"
1. [QUICK_START.md](./QUICK_START.md) - "문제 해결" 섹션
2. [SETUP_GUIDE.md](./SETUP_GUIDE.md) - "🐛 문제 해결" 섹션
3. [N8N_INTEGRATION.md](./N8N_INTEGRATION.md) - "🐛 문제 해결" 섹션

### "배포하고 싶어"
1. [README.md](./README.md) - 배포 섹션
2. [SETUP_GUIDE.md](./SETUP_GUIDE.md) - "🚀 배포" 섹션
3. Vercel/자체 서버 선택 후 진행

## 🛠️ 컴포넌트 사용법

### 버튼
```typescript
import { Button } from "@/components/ui/button";

<Button onClick={handleClick}>
  클릭
</Button>
```

### 입력
```typescript
import { Input } from "@/components/ui/input";

<Input
  type="text"
  placeholder="입력..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### 날짜 선택기
```typescript
import { DatePicker } from "@/components/ui/datepicker";

<DatePicker
  value={date}
  onChange={setDate}
  placeholder="날짜 선택"
/>
```

### 슬라이더
```typescript
import { Slider } from "@/components/ui/slider";

<Slider
  min={0}
  max={1}
  step={0.01}
  value={similarity}
  onChange={(e) => setSimilarity(e.target.value)}
/>
```

### 카드
```typescript
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
  </CardHeader>
  <CardContent>
    내용
  </CardContent>
</Card>
```

더 많은 예시는 [SETUP_GUIDE.md](./SETUP_GUIDE.md#-ui-컴포넌트) 참고

## 📊 API 문서

### POST /api/generate-report

**요청:**
```json
{
  "question": "string (필수)",
  "startDate": "YYYY-MM-DD (필수)",
  "endDate": "YYYY-MM-DD (필수)",
  "minSimilarity": "0.0-1.0 (선택, 기본: 0.5)",
  "maxArticles": "1-100 (선택, 기본: 15)"
}
```

**응답 (성공):**
```json
{
  "status": "success",
  "report": "# 마크다운 형식 리포트\n\n..."
}
```

**응답 (오류):**
```json
{
  "error": "에러 메시지"
}
```

더 자세한 내용은 [SETUP_GUIDE.md](./SETUP_GUIDE.md#-api-요청응답) 참고

## 🔐 환경 변수

### 필수 설정 (n8n 연동 시)
```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/shipping-rag-report
```

### 선택 설정
```env
N8N_API_KEY=your-secret-key
DEBUG=true
LOG_LEVEL=debug
```

자세한 내용은 [N8N_INTEGRATION.md](./N8N_INTEGRATION.md#-환경-변수) 참고

## ✅ 완성도

### 프론트엔드 ✅
- [x] 반응형 레이아웃
- [x] 검색 폼 (텍스트, 날짜, 슬라이더, 숫자)
- [x] 로딩 상태
- [x] 마크다운 렌더링
- [x] 에러 처리
- [x] 모바일 최적화

### 백엔드 ✅
- [x] API 엔드포인트
- [x] 입력 검증
- [x] 모의 응답
- [x] 에러 처리
- [x] n8n 통합 준비

### 배포 ✅
- [x] TypeScript 컴파일
- [x] 번들 최적화
- [x] SEO 메타데이터
- [x] 환경 변수 관리

## 📦 의존성

| 패키지 | 버전 | 용도 |
|--------|------|------|
| next | 15.1.0 | 프레임워크 |
| react | 18.3.0 | UI |
| typescript | 5.x | 타입 안전성 |
| tailwindcss | 3.4 | 스타일링 |
| react-markdown | 9.0 | 마크다운 |
| lucide-react | 0.293 | 아이콘 |
| date-fns | 3.0 | 날짜 처리 |

전체 목록은 `package.json` 참고

## 🎯 마일스톤

- ✅ v0.1.0 (현재) - 기본 대시보드 완성
- 📋 v0.2.0 (예정) - n8n 통합 완료
- 📋 v0.3.0 (예정) - 다양한 분석 옵션 추가
- 📋 v0.4.0 (예정) - 사용자 계정 & 저장 기능

## 🤝 커뮤니티

- 📧 이메일: support@example.com
- 🐛 버그 리포트: GitHub Issues
- 💡 기능 제안: GitHub Discussions

## 📄 라이센스

MIT License - 자유롭게 사용, 수정, 배포 가능

---

## 🗺️ 네비게이션

| 이동 | 링크 |
|------|------|
| ⬅️ 뒤로 | 브라우저 뒤로 가기 |
| 🏠 홈 | [QUICK_START.md](./QUICK_START.md) |
| 📖 문서 | 이 페이지 |
| ⚙️ 설정 | [SETUP_GUIDE.md](./SETUP_GUIDE.md) |
| 🔌 연동 | [N8N_INTEGRATION.md](./N8N_INTEGRATION.md) |

---

**마지막 업데이트**: 2026-03-22
**문서 버전**: 0.1.0
