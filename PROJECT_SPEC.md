# MUBU (무부) - 전체 프로젝트 스펙

> 이 문서는 Claude Chat, Cowork, Code 등 어느 환경에서든 컨텍스트로 활용할 수 있는 전체 프로젝트 명세입니다.

## 1. 프로젝트 개요

**MUBU(무부)**는 토스 앱인토스(Apps in Toss) 미니앱으로, 해외 여행 중 발견한 상품을 촬영하면 AI가 상품을 인식하고 한국 최저가와 비교해주는 서비스입니다.

### 핵심 가치
- **사진 한 장**으로 해외 상품의 한국 가격을 즉시 확인
- 실시간 환율 반영, 12개 통화 지원
- 수량별 총액 비교로 대량 구매 의사결정 지원

### 현재 상태
- 백엔드: Fly.io 배포 완료 (도쿄 리전)
- 프론트엔드: .ait 빌드 완료, 토스 심사 검토 요청됨 (버전 20260225-11)
- 단계: MVP 완성 → 유지보수/개선 단계

---

## 2. 기술 스택

### Backend (mubu)
| 구분 | 기술 |
|------|------|
| 언어/프레임워크 | Java 17, Spring Boot 3.2.1, Gradle 8.7 |
| AI 이미지 분석 | Google Gemini 2.0 Flash |
| 쇼핑 검색 | Naver Shopping API |
| 환율 | Frankfurter API (ECB 데이터) |
| API 문서 | Springdoc OpenAPI 3.0 (Swagger UI) |
| 배포 | Fly.io, Docker 멀티스테이지 빌드 |

### Frontend (mubu-frontend)
| 구분 | 기술 |
|------|------|
| 프레임워크 | React 18.3.1, TypeScript 5.9.3, Vite 7.2.4 |
| 라우팅 | React Router v7.12.0 |
| 서버 상태 | TanStack React Query 5.90.19 |
| UI 상태 | Zustand 5.0.10 |
| 디자인 시스템 | @toss/tds-mobile v2.2.1 |
| 토스 SDK | @apps-in-toss/web-framework v1.9.1 |
| 스타일링 | @emotion/react, CSS Variables |
| 빌드/배포 | granite CLI (.ait 빌드) |

---

## 3. 아키텍처

### 시스템 구성
```
[토스 앱] → [MUBU Frontend (미니앱 WebView)]
                    │
                    ▼ REST API
            [MUBU Backend (Fly.io)]
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
    [Gemini AI] [Naver API] [Frankfurter API]
```

### 백엔드 레이어
```
Controller (REST API 진입점)
    └── FacadeService (Toss UX 단일 진입점)
            └── CoreService (오케스트레이션)
                    ├── AiAnalyzeService → GeminiClient
                    ├── NaverShoppingService → NaverShoppingClient
                    └── ExchangeRateService → Frankfurter API
```

### 프론트엔드 레이어
```
App.tsx (Router)
    └── AppShell (Layout + BottomNav)
            └── Pages (Home, Analyzing, AdGate, PriceConfirm, Result, Dashboard, Profile)
                    ├── TDS Wrappers (components/tds/) - 토스/웹 듀얼 렌더링
                    ├── Hooks (useToss, usePriceCompare, useRecentComparisons)
                    ├── Store (Zustand priceStore)
                    └── API Client (api/price.ts → React Query)
```

---

## 4. 사용자 플로우

```
[Home] 상품 촬영하기 버튼
   │
   ▼
[ImageSourceSheet] 카메라/앨범 선택
   │
   ▼
[Analyzing] AI 분석 중 (로딩 + 광고 프리로드)
   │
   ├── (토스) → [AdGate] 인터스티셜 광고
   │                │
   │                ▼
   └── (웹) ──→ [PriceConfirm] 감지된 가격 확인/수정
                    │
                    ▼
                [Result] 가격 비교 결과
                    │  - 현지단가 vs 한국단가
                    │  - 수량 조절 (1~999)
                    │  - 절약 금액
                    │  - 한국가격 보기 / 구매함
                    │
                    ▼
                [Home] 또는 [Dashboard] 기록 확인
```

---

## 5. API 명세

### 5-1. 이미지 기반 가격 비교 (메인 API)
```
POST /api/price/compare-with-image
Content-Type: multipart/form-data
```
**Request**: `file` (이미지, 최대 10MB), `imageId` (선택, UUID)

**Response**:
```json
{
  "imageId": "uuid-string",
  "aiText": "상품명: Pocky Strawberry\n가격: 35 THB\nsearchKeywordKr: 포키 딸기",
  "productName": "포키 딸기맛 과자",
  "lowestPrice": 1800,
  "mallName": "쿠팡",
  "link": "https://www.coupang.com/...",
  "image": "https://image.coupang.com/...",
  "localPrice": 35,
  "localCurrency": "THB"
}
```

### 5-2. 가격 비교 결과 요약
```
POST /api/price/result/summary
Content-Type: application/json
```
**Request**:
```json
{
  "imageId": "uuid-string",
  "localPrice": 35,
  "currency": "THB",
  "priceSource": "AI"  // or "USER"
}
```
**Response**:
```json
{
  "summary": "한국에서 사면 542원 절약!",
  "savedAmount": 542,
  "localPriceKrw": 2342,
  "koreaPrice": 1800
}
```

### 5-3. 외부 쇼핑 링크
```
GET /api/price/external/link?productName=포키 딸기
```
**Response**: URL 문자열

---

## 6. 페이지별 기능 명세

### Home (`/`)
- 인사 메시지: "안녕하세요 여행자님"
- CTA: "상품 촬영하기" → ImageSourceSheet 오픈
- 최근 비교 목록 (최대 3개, 더보기 → Dashboard)

### Analyzing (`/analyzing`)
- 로딩 스피너 + 회전 상태 메시지 (3개 텍스트, 2초 간격)
- API 호출: `compare-with-image`
- 광고 프리로드 (토스 환경)
- 실패 시 재시도 버튼, 429 Rate Limit 감지

### AdGate (`/ad-gate/:imageId`) - 토스 전용
- 분석 완료 메시지
- 인터스티셜 광고 표시 (GoogleAdMob)
- 광고 실패 시 3초 카운트다운 → 자동 스킵

### PriceConfirm (`/price-confirm/:imageId`)
- AI 감지 가격 표시 (통화 심볼 + 금액)
- "맞아요" → 결과로 이동
- "수정" → BottomSheet에서 통화 선택 + 금액 직접 입력

### Result (`/result/:imageId`)
- 4개 가격 카드: 현지단가, 한국단가, 현지총액(KRW 환산), 한국총액
- 수량 스피너 (1~999)
- 절약 금액 표시 (양수: 현지 저렴 / 음수: 한국 저렴)
- 한국가격 보기 (토스 브라우저/웹 링크)
- 한국 검색 결과 없을 시 안내 카드

### Dashboard (`/dashboard`)
- 최근 비교 기록 리스트 (최대 20개, localStorage)
- 각 항목: 상품명, 날짜, 절약 금액 배지

### Profile (`/profile`)
- 로그인 미구현 안내 (스텁 페이지)

---

## 7. 핵심 기술 구현

### AI 이미지 분석 (Gemini 2.0 Flash)
- 구조화된 프롬프트로 상품명/가격/통화/한국어 검색 키워드 추출
- 429 Rate Limit 대응: 지수 백오프 재시도 (5s → 10s → 15s, 최대 3회)
- 요청 간 2초 Burst Control

### 네이버 쇼핑 3단계 Fallback 검색
1. 전체 키워드 관련도순(sim) 검색 + 첫 단어 관련성 필터
2. 2단어 축소 재검색
3. 영문 브랜드명 + 한글 상품 유형 조합 Fallback

### 환율 변환
- Frankfurter API (ECB 데이터) 실시간 변환
- VND, TWD 등 미지원 통화: 고정 환율 Fallback
- 이미 KRW면 변환 스킵

### 토스/웹 듀얼 렌더링
- `isTossEnvironment()`: window.Toss, User-Agent, granite dev server, 글로벌 변수 4가지 신호 확인
- TDS 컴포넌트 래퍼: 토스면 실제 TDS, 웹이면 HTML/CSS Fallback
- 카메라/앨범: 토스면 SDK(`openCamera`, `fetchAlbumPhotos`), 웹이면 `<input type="file">`

### 광고 시스템
- Analyzing 페이지에서 `preloadAd()` 호출 → 광고 미리 로드
- AdGate에서 `showAppsInTossAdMob()` → 프리로드된 광고 표시
- 글로벌 상태 머신: idle → loading → ready → showing → dismissed
- 로드 타임아웃 10초, 준비 대기 타임아웃 15초

### 데이터 영속성
- 백엔드: In-Memory ConcurrentHashMap (30분 TTL) - DB 미사용
- 프론트엔드: localStorage (`mubu.recentComparisons.v1`, 최대 20개)

---

## 8. 배포 정보

### Backend (Fly.io)
- URL: `https://mubu.fly.dev`
- 리전: Tokyo (nrt)
- VM: Shared CPU 1코어, 1GB RAM
- Auto-stop: suspend (비용 최적화, scale-to-zero)
- Docker 멀티스테이지 빌드 (Gradle 8.7-JDK17 → Eclipse Temurin 17-JRE)

### Frontend (토스 앱인토스)
- 빌드: `npm run build:toss` → granite build → .ait 파일
- 배포: 토스 콘솔에서 버전 등록 → 심사 요청
- 앱 이름: "무부", 앱 ID: mubu
- 권한: 카메라(access), 사진첩(read)

### 환경 변수
**Backend** (Fly.io secrets):
```
GEMINI_API_KEY, NAVER_CLIENT_ID, NAVER_CLIENT_SECRET
```
**Frontend** (.env):
```
VITE_API_BASE_URL=https://mubu.fly.dev
```

---

## 9. 지원 통화

| 코드 | 국가 | 심볼 | 환율 소스 |
|------|------|------|-----------|
| THB | 태국 | ฿ | Frankfurter |
| JPY | 일본 | ¥ | Frankfurter |
| USD | 미국 | $ | Frankfurter |
| EUR | 유럽 | € | Frankfurter |
| CNY | 중국 | ¥ | Frankfurter |
| SGD | 싱가포르 | S$ | Frankfurter |
| VND | 베트남 | ₫ | Fallback (0.057) |
| PHP | 필리핀 | ₱ | Frankfurter |
| IDR | 인도네시아 | Rp | Frankfurter |
| HKD | 홍콩 | HK$ | Frankfurter |
| TWD | 대만 | NT$ | Fallback (44.0) |
| AUD | 호주 | A$ | Frankfurter |

---

## 10. 알려진 제한사항 / 개선 여지

### 현재 제한사항
- DB 없음 → 서버 재시작 시 비교 결과 캐시 소멸 (30분 TTL 인메모리)
- 로그인 미구현 → 사용자별 기록 관리 불가
- 네이버 쇼핑 의존 → 검색 결과 품질이 키워드에 좌우됨
- VND/TWD 고정 환율 → 주기적 업데이트 필요
- 콜드 스타트 → Fly.io suspend 모드로 첫 요청 시 지연

### 잠재 개선 포인트
- Redis/DB 도입으로 결과 영속화
- 토스 로그인 연동 → 사용자별 비교 기록 동기화
- 다중 쇼핑몰 검색 (쿠팡, 11번가 등 직접 연동)
- 즐겨찾기/알림 기능
- 바코드/QR 스캔 지원
- 오프라인 모드 (최근 결과 캐싱)
