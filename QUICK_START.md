# 🚀 빠른 시작 (5분)

## 1️⃣ 설치

```bash
npm install --legacy-peer-deps
```

## 2️⃣ 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 열기

## 3️⃣ 대시보드 사용

### 좌측 패널 - 검색 조건 입력
- **질문**: "한국 해운사의 최근 동향은?" 입력
- **시작일**: 달력에서 선택
- **종료일**: 달력에서 선택
- **최소 유사도**: 슬라이더 조정 (기본값 0.5)
- **최대 기사 수**: 숫자 입력 (기본값 15)

### 우측 패널 - 결과 보기
- "📊 리포트 생성하기" 버튼 클릭
- 로딩 스피너 표시 (잠시 기다리기)
- 마크다운 형식의 리포트 자동 표시

## 🔌 n8n 연동 (선택사항)

### 현재 상태
- ✅ 대시보드 완성 (모의 응답)
- ⏳ n8n 연동 가능

### 연동 3단계

1. **n8n 웹훅 생성**
   - n8n 에디터에서 Webhook 노드 추가
   - URL 복사

2. **환경 변수 설정**
   ```
   .env.local 파일 생성:
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/...
   ```

3. **API 업데이트**
   - `app/api/generate-report/route.ts` 수정
   - `example-n8n-integration.ts` 참고

상세 가이드: `N8N_INTEGRATION.md`

## 📂 주요 파일

| 파일 | 용도 |
|------|------|
| `components/ResearchDashboard.tsx` | 메인 대시보드 |
| `app/api/generate-report/route.ts` | API 엔드포인트 |
| `app/page.tsx` | 홈 페이지 |
| `app/globals.css` | 전역 스타일 |

## 🎨 주요 기능

- ✅ 반응형 디자인 (모바일/태블릿/데스크톱)
- ✅ 날짜 선택기
- ✅ 슬라이더 & 숫자 입력
- ✅ 로딩 상태 표시
- ✅ 마크다운 렌더링
- ✅ 에러 처리
- ✅ TypeScript

## 🔧 커맨드

```bash
# 개발 서버 (자동 새로고침)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드된 버전 실행
npm start

# 린트 확인
npm run lint
```

## ⚠️ 주의사항

- `--legacy-peer-deps` 플래그 필수 (React 19와의 호환성)
- 환경 변수는 `.env.local`에 저장 (git 무시)
- 브라우저 콘솔에서 에러 확인 가능 (F12)

## 📋 체크리스트

- [ ] `npm install --legacy-peer-deps` 완료
- [ ] `npm run dev` 실행 성공
- [ ] `http://localhost:3000` 접속 확인
- [ ] 폼 입력 후 결과 표시 확인
- [ ] n8n 연동 준비 (선택사항)

## 📞 문제 해결

**포트 이미 사용 중?**
```bash
npm run dev -- -p 3001
```

**의존성 문제?**
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

**캐시 문제?**
```bash
npm run build
npm start
```

## 📚 문서

- `README.md` - 전체 프로젝트 설명
- `SETUP_GUIDE.md` - 상세 설정 가이드
- `N8N_INTEGRATION.md` - n8n 연동 가이드

---

**준비 완료!** 🎉

이제 대시보드를 사용할 수 있습니다.
