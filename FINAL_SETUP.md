# 🚀 최종 설정 가이드 - n8n 웹훅 연동 완료

## 📌 현재 상태

✅ **완성된 기능:**
- Next.js 대시보드 (프론트엔드)
- n8n 웹훅 API 연동 (백엔드)
- HTML/마크다운 렌더링
- 날짜 타이핑 가능
- 유사도 슬라이더 (기본값 0.2)

---

## ⚠️ 현재 배포 상태 (로컬 개발 모드)

### 현재 작동 방식
```
당신의 컴퓨터 (npm run dev 실행)
    ↓
http://localhost:3009 (브라우저)
    ↓
API 요청 → n8n 웹훅
    ↓
n8n에서 HTML 생성
    ↓
결과 표시
```

**문제점:**
- ❌ 당신의 컴퓨터가 꺼지면 작동 안 함
- ❌ 다른 컴퓨터에서 접속 불가 (`localhost`는 로컬만 가능)
- ❌ 24시간 운영 불가능

---

## 🌐 다른 컴퓨터에서도 가능하게 하려면 (배포 필요)

### 옵션 1: **Vercel (가장 추천)** ⭐

**장점:**
- 무료 (기본)
- Next.js 최적화
- 자동 배포
- 언제든 접속 가능
- 다른 컴퓨터에서도 접속 가능

**설정 단계:**

1. **GitHub에 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/당신계정/shipping-rag-dashboard.git
   git push -u origin main
   ```

2. **Vercel 가입 및 배포**
   - https://vercel.com 접속
   - "Import Project" → GitHub 리포지토리 선택
   - Environment Variables 설정:
     ```
     N8N_WEBHOOK_URL=https://sejinkim92.app.n8n.cloud/webhook/shipping-rag-report
     ```
   - Deploy 클릭

3. **배포 완료 후**
   - `https://your-project-name.vercel.app` 에서 접속 가능
   - 전 세계 어디서나 접속 가능
   - 당신의 컴퓨터 꺼져도 작동

---

### 옵션 2: **Railway, Render 등 (대안)**

비슷한 클라우드 호스팅 서비스들도 지원합니다.

---

### 옵션 3: **자체 서버 (고급)**

AWS, GCP, Azure 등에서 서버를 구축할 수 있지만, 복잡하고 비용이 들 수 있습니다.

---

## 📝 n8n 설정 (최종 확정)

### Respond to Webhook 노드 설정

**Response Body:**
```javascript
{{ JSON.stringify({ "report": $json.text }) }}
```

**설정 요약:**
| 항목 | 값 |
|------|-----|
| Respond with | JSON |
| Response Body | `{{ JSON.stringify({ "report": $json.text }) }}` |
| Content-Type | application/json (기본) |
| Status Code | 200 (기본) |
| 워크플로우 상태 | Active (활성화) |

---

## 🔧 환경 변수 설정

### `.env.local` (로컬 개발용)
```env
N8N_WEBHOOK_URL=https://sejinkim92.app.n8n.cloud/webhook/shipping-rag-report
```

### Vercel (배포 후)
1. Vercel 대시보시 → Settings → Environment Variables
2. `N8N_WEBHOOK_URL` 추가
3. 자동으로 재배포됨

---

## 🎯 사용 흐름

### 사용자 입력
```json
{
  "question": "SCFI의 주요 변동 원인은?",
  "startDate": "2026-02-09",
  "endDate": "2026-03-21",
  "minSimilarity": 0.2,
  "maxArticles": 30
}
```

### 대시보드 → API → n8n
```
POST /api/generate-report
```

### n8n 처리
```
1. Webhook 노드: 요청 수신
2. Code 노드: HTML 생성 (text 필드)
3. Respond to Webhook: JSON으로 응답
```

### n8n 응답
```json
{
  "report": "<html>...</html>"
}
```

### 대시보드 렌더링
```
HTML 태그 감지 → HTML로 렌더링
마크다운 감지 → 마크다운으로 렌더링
```

---

## 📋 체크리스트

### 로컬 개발 (현재)
- [x] npm run dev 실행
- [x] http://localhost:3009 접속
- [x] n8n 웹훅 연동
- [x] 데이터 반환 확인

### 배포 준비 (다음 단계)
- [ ] GitHub 리포지토리 생성
- [ ] Vercel 계정 생성
- [ ] Vercel에 배포
- [ ] 배포된 URL에서 테스트
- [ ] n8n에서 배포된 URL 요청 가능 확인

### 프로덕션 (완전 배포)
- [ ] 커스텀 도메인 설정 (선택)
- [ ] 모니터링 설정 (선택)
- [ ] 로깅 설정 (선택)

---

## 🚀 빠른 배포 (Vercel)

```bash
# 1. npm 전역 설치
npm install -g vercel

# 2. Vercel 로그인
vercel login

# 3. 배포
vercel

# 4. 환경 변수 추가
vercel env add N8N_WEBHOOK_URL
# 값 입력: https://sejinkim92.app.n8n.cloud/webhook/shipping-rag-report

# 5. 재배포
vercel deploy --prod
```

---

## 📞 n8n 웹훅 설정 확인

n8n에서 다음을 확인하세요:

1. **Webhook 노드**
   - Method: POST ✅
   - Path: `/webhook/shipping-rag-report` ✅
   - 워크플로우: Active ✅

2. **Code 노드**
   - `text` 필드에 HTML 생성 ✅

3. **Respond to Webhook**
   - Response Body: `{{ JSON.stringify({ "report": $json.text }) }}` ✅
   - Status: 200 ✅

---

## 💡 로컬 개발 vs 배포

| 항목 | 로컬 (현재) | 배포 (Vercel) |
|------|----------|-------------|
| 명령어 | npm run dev | 자동 |
| URL | http://localhost:3009 | https://xxx.vercel.app |
| 다른 컴 접속 | ❌ | ✅ |
| 24/7 작동 | ❌ | ✅ |
| 비용 | 무료 | 무료 (기본) |
| 수정 반영 | 자동 핫리로드 | GitHub push 후 자동 |

---

## 🔗 배포 후 n8n 설정 변경

배포 완료 후 n8n의 Webhook URL은 그대로 유지됩니다.
(n8n은 서버 쪽이므로 변경 불필요)

대신 대시보드 URL이 변경됩니다:
- 로컬: `http://localhost:3009`
- 배포: `https://your-project.vercel.app`

---

## ✅ 완성!

현재 모든 기능이 완벽하게 작동하고 있습니다.

**다음 단계:**
1. GitHub에 푸시
2. Vercel에 배포
3. 전 세계 어디서나 접속 가능!

질문 있으면 언제든지 물어보세요! 🚀

---

**마지막 업데이트:** 2026-03-22
**상태:** 로컬 완성, 배포 준비 완료
