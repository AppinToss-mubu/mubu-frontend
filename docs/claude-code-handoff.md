# MUBU — Claude Code 인수인계 문서

> 최종 업데이트: 2026-02-25
> 현황: 토스 미니앱 검수 반려 (디자인 사유) → 디자인 개선 후 재제출 필요

---

## 1. 프로젝트 개요

**MUBU (무부)** 는 해외에서 발견한 상품의 가격을 한국 최저가와 비교해주는 토스 미니앱입니다.

**핵심 플로우:**
1. 사용자가 해외 매장에서 상품 사진을 찍음
2. AI (Gemini)가 상품명 + 현지 가격 + 통화를 자동 추출
3. 네이버 쇼핑 API로 한국 최저가 검색
4. 환율 변환 후 절약 금액 계산 → 결과 표시

**타겟:** 해외 여행 중인 한국인 쇼핑객
**수익 모델:** 전면 광고 (매 비교마다) + 배너 광고 (결과 페이지) + 쿠팡 파트너스 제휴 링크

---

## 2. 기술 스택

### 프론트엔드 (이 저장소)
| 항목 | 기술 |
|------|------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 7 |
| State | Zustand |
| Data Fetching | TanStack React Query |
| Routing | React Router DOM 7 |
| Design System | @toss/tds-mobile (Toss Design System) |
| 광고 SDK | @apps-in-toss/web-framework (GoogleAdMob) |
| 배포 | 토스 미니앱 콘솔 (.ait 번들) |

### 백엔드 (별도 저장소)
| 항목 | 기술 |
|------|------|
| Framework | Java Spring Boot |
| AI | Google Gemini API (이미지 → 상품 정보 추출) |
| 쇼핑 검색 | Naver Shopping API (한국 최저가) |
| 환율 | Frankfurter API (실시간 환율) |
| CORS | `*.apps.tossmini.com`, `*.private-apps.tossmini.com` 허용 완료 |

---

## 3. 프로젝트 구조

```
src/
├── api/
│   ├── price.ts              # API 클라이언트 (3개 엔드포인트)
│   └── types.ts              # API 타입 정의
│
├── components/
│   ├── AppShell.tsx           # 앱 레이아웃 (헤더 + 하단 네비)
│   ├── ImageSourceSheet.tsx   # 촬영/앨범 선택 바텀시트
│   ├── AdBannerSlot.tsx       # 배너 광고 슬롯 (현재 빈 플레이스홀더)
│   ├── ExternalLink.tsx       # 외부 링크 컴포넌트
│   ├── ImageUpload.tsx        # 이미지 업로드 (레거시)
│   ├── PriceInput.tsx         # 가격 입력 (레거시)
│   ├── SummaryCard.tsx        # 요약 카드 (레거시)
│   └── tds/                   # TDS 래퍼 컴포넌트 (14개)
│       ├── index.ts
│       ├── TDSBadge.tsx
│       ├── TDSBottomCTA.tsx
│       ├── TDSBottomNav.tsx
│       ├── TDSBottomSheet.tsx
│       ├── TDSButton.tsx
│       ├── TDSDialog.tsx
│       ├── TDSListRow.tsx
│       ├── TDSLoader.tsx
│       ├── TDSNumericSpinner.tsx
│       ├── TDSSkeleton.tsx
│       ├── TDSTextField.tsx
│       ├── TDSToast.tsx
│       └── TDSTop.tsx
│
├── hooks/
│   ├── usePriceCompare.ts     # React Query 기반 가격 비교 훅
│   ├── useRecentComparisons.ts # 최근 비교 내역 (localStorage)
│   ├── useTheme.ts            # 다크모드 토글
│   └── useToss.ts             # 토스 SDK 연동 (카메라, 앨범, 권한)
│
├── pages/
│   ├── Home.tsx               # 메인 (촬영 버튼 + 최근 비교)
│   ├── Analyzing.tsx          # AI 분석 로딩 + 광고 사전 로딩
│   ├── AdGate.tsx             # 전면 광고 게이트 (Toss 전용)
│   ├── PriceConfirm.tsx       # AI 감지 가격 확인/수정
│   ├── Result.tsx             # 최종 비교 결과 (수량 조절)
│   ├── Dashboard.tsx          # 최근 비교 전체 목록
│   ├── Profile.tsx            # 프로필 (로그인 미구현)
│   └── NotFound.tsx           # 404
│
├── store/
│   ├── priceStore.ts          # Zustand 상태 (비교 데이터)
│   └── envStore.ts            # 환경 설정 스토어
│
├── utils/
│   ├── env.ts                 # isTossEnvironment() 환경 감지
│   ├── tds.ts                 # useTDS() 훅 (동적 import + 캐시)
│   ├── adPreloader.ts         # 광고 사전 로딩 유틸
│   └── recentComparisons.ts   # localStorage 비교 내역 관리
│
├── App.tsx                    # 라우터 설정
├── main.tsx                   # 진입점
├── App.css                    # 앱 스타일
└── index.css                  # 글로벌 CSS 변수 (라이트/다크)

docs/
├── tds/                       # TDS 공식 스펙 참조 문서 (16개)
├── cursor-handoff.md          # SDK 연동 작업 체크리스트
├── mubu-ad-strategy.md        # 광고 수익 전략
└── toss-ads-guide.md          # 토스 인앱 광고 레퍼런스
```

---

## 4. 유저 플로우

### Toss 환경 (미니앱)
```
Home (촬영 버튼)
  → ImageSourceSheet (BottomSheet.DoubleCTA: 앨범/촬영)
    → openCamera SDK 또는 fetchAlbumPhotos SDK
      → Analyzing (AI 분석 + 광고 사전 로딩)
        → AdGate (전면 광고 show)
          → 광고 완료 / 실패(3초 카운트다운)
            → PriceConfirm (AI 감지 가격 확인 or 수동 입력)
              → Result (가격 비교 결과 + 수량 조절 + 쿠팡 링크)
```

### 일반 웹 환경
```
Home (촬영 버튼)
  → ImageSourceSheet (HTML input file/capture)
    → Analyzing (AI 분석)
      → PriceConfirm (AdGate 스킵)
        → Result
```

---

## 5. 환경 분기 패턴

모든 페이지는 **Toss/웹 환경을 런타임에 분기**합니다.

### 감지 함수: `src/utils/env.ts`
```ts
isTossEnvironment(): boolean
// 체크 순서:
// 1. window.Toss 객체
// 2. User-Agent (AppsInToss, TossApp, TossMiniApp)
// 3. URL (localhost:8081, granite)
// 4. 전역 변수 (__TOSS__, AppsInToss)
```

### TDS 로딩: `src/utils/tds.ts`
```ts
const { tds, colors, ready } = useTDS();
// - Toss 환경에서만 @toss/tds-mobile 동적 import
// - 비-Toss: tds={}, colors={}, ready=false
// - 캐시됨 (한 번만 로드)
```

### 각 페이지의 분기 패턴:
```tsx
function SomePage() {
  const isToss = isTossEnvironment();
  const { tds, colors, ready: tdsReady } = useTDS();

  // Toss 환경 UI
  if (isToss && tdsReady) {
    const { Button, Top, ListRow } = tds;
    const { adaptive } = colors;
    return (/* TDS 컴포넌트 사용 UI */);
  }

  // 일반 웹 UI
  return (/* CSS 변수 기반 원본 UI */);
}
```

---

## 6. TDS (Toss Design System) 연동

### 패키지
- `@toss/tds-mobile` — UI 컴포넌트 (Button, Top, ListRow, BottomSheet 등)
- `@toss/tds-colors` — 색상 토큰 (adaptive.grey900, blue500 등)
- `@toss/tds-mobile-ait` — 미니앱 전용 래퍼

### Vite 설정
```ts
// vite.config.ts
optimizeDeps: {
  exclude: ["@toss/tds-mobile", "@toss/tds-colors"],
  // 비-Toss 환경에서 사전 번들링 시 에러 방지
}
```

### 주의사항
- **정적 import 금지**: `@toss/tds-mobile`은 비-Toss 환경에서 import 시 에러를 throw함
- 반드시 `useTDS()` 훅의 동적 import 패턴 사용
- TDS 컴포넌트의 prop 이름이 일반 React와 다름 (예: NumericSpinner → `number`, `onNumberChange`)

### 래퍼 컴포넌트 (`src/components/tds/`)
AppShell의 `TDSBottomNav`만 활발히 사용 중. 나머지는 레거시이며 대부분의 페이지에서 `useTDS()` 훅으로 직접 TDS 컴포넌트를 가져다 씀.

### 참조 문서
`docs/tds/` 폴더에 TDS 공식 스펙 정리본 16개:
- 파운데이션: Colors, Typography
- 컴포넌트: Button, BottomSheet, BottomCTA, BottomNav, Loader, TextField, NumericSpinner, ListRow, Toast, Dialog, Badge, Skeleton, Top, Tab

---

## 7. 광고 SDK 연동

### 전면형 광고 (구현 완료)

**플로우:**
1. `Analyzing.tsx` — API 성공 후 `preloadAd()` 호출 (사전 load 시작)
2. `AdGate.tsx` — 사전 load가 완료됐으면 즉시 `showAppsInTossAdMob()`, 아직 로딩 중이면 대기 후 show
3. 사전 load가 실패했으면 AdGate에서 재시도 load → show

**핵심:** load는 `adPreloader.ts`에서 중앙 관리. AdGate는 show만 담당. 중복 load 방지를 위해 pendingPromise 패턴 사용.

| 파일 | 역할 |
|------|------|
| `src/utils/adPreloader.ts` | 광고 사전 로딩 (load + 상태 머신: idle→loading→loaded/failed) |
| `src/pages/Analyzing.tsx` | API 성공 후 `preloadAd()` 호출 (L62-66) |
| `src/pages/AdGate.tsx` | 광고 표시 (show) + 실패 시 3초 카운트다운 자동 이동 |

- 테스트 광고 ID: `ait-ad-test-interstitial-id`
- 실서비스 전환 시: 콘솔에서 광고 그룹 생성 → `adPreloader.ts`의 `AD_GROUP_ID` 교체
- **규칙:** 한 번에 1개만 load 가능. `load → show → (다음 load)` 순서 필수

### 배너 광고 (미구현 — 플레이스홀더)

| 파일 | 현황 |
|------|------|
| `src/components/AdBannerSlot.tsx` | 빈 슬롯 (AD 텍스트만 표시, 50px) |

**TODO:** 새 TossAds 배너 API로 교체 필요
- `TossAds.initialize()` → 앱 최상위에서 1회 호출
- `TossAds.attachBanner(adGroupId, domElement, options)` → 배너 부착
- 높이 96px 권장, width 100%
- `isSupported()` 체크 필수 (토스 앱 5.241.0 미만 미지원)
- import: `@apps-in-toss/web-framework`에서 `TossAds`

---

## 8. API 엔드포인트 (백엔드)

**Base URL:** `VITE_API_BASE_URL` 환경변수 또는 기본값 `http://localhost:8080`

### 8-1. 이미지 기반 가격 비교
```
POST /api/price/compare-with-image
Content-Type: multipart/form-data

Body:
  - file: 이미지 파일
  - imageId: 클라이언트 생성 UUID

Response (200):
{
  "imageId": "uuid",
  "aiText": "AI 원본 텍스트",
  "productName": "상품명",
  "lowestPrice": 12900,          // 한국 최저가 (KRW)
  "mallName": "네이버 쇼핑몰명",
  "link": "https://...",          // 네이버 쇼핑 링크
  "image": "https://...",         // 상품 이미지 URL
  "localPrice": 980,             // AI 추출 현지 가격 (선택)
  "localCurrency": "JPY"         // AI 추출 통화 (선택)
}

Response (400 — 한국 가격 못 찾은 경우):
{
  "productName": "상품명",       // 있으면 부분 결과로 처리
  "aiText": "...",
  "localPrice": 980,
  "localCurrency": "JPY",
  "message": "한국 최저가를 찾을 수 없습니다"  // 에러 메시지
}
// 프론트 처리: productName이 있으면 lowestPrice=0으로 Result까지 진행
// productName이 없으면 throw Error(message)

에러 응답 공통 형식:
{
  "message": "에러 설명 문자열"
}
// 프론트에서 json.message로 에러 메시지 추출
```

### 8-2. 가격 비교 요약
```
POST /api/price/result/summary
Content-Type: application/json

Body:
{
  "imageId": "uuid",
  "localPrice": 980,
  "currency": "JPY",
  "priceSource": "AI" | "USER"
}

Response:
{
  "summary": "한국에서 사면 8,200원 절약!",
  "savedAmount": 8200,
  "localPriceKrw": 9100,
  "koreaPrice": 12900
}
```

### 8-3. 외부 쇼핑 링크
```
GET /api/price/external/link?productName={상품명}

Response: 쿠팡 파트너스 URL (text/plain)
```

---

## 9. 디자인 현황 및 반려 대응

### 현재 디자인 접근 방식
- **Toss 환경:** TDS 컴포넌트 (Button, Top, ListRow 등) + 하드코딩 inline 스타일
- **웹 환경:** CSS 변수 (`var(--bg)`, `var(--fg)` 등) + inline 스타일
- **다크모드:** CSS 변수 기반 (`html[data-theme="dark"]`)

### TDS 색상 토큰 사용 현황
```
grey900: #191F28 (주요 텍스트)
grey800: 서브 텍스트
grey600: 보조 텍스트
grey500: #8B95A1 (placeholder)
grey400: #B0B8C1 (비활성)
blue500: #3182F6 (강조, 링크)
red500:  #F04452 (에러)
green500: #03B26C (절약 표시)
```

### 주요 디자인 포인트
1. **모든 스타일이 inline으로 작성됨** — CSS 파일 분리 필요할 수 있음
2. **TDS 컴포넌트와 커스텀 스타일이 혼재** — 일관성 부족 가능
3. **하드코딩 색상값** — TDS adaptive 토큰과 하드코딩 hex가 섞여 있음
4. **AppShell 헤더** — Toss 내비바와 별도로 "MUBU" 헤더 + 다크모드 토글이 있음

### 디자인 개선이 필요한 화면별 상세

**Home.tsx (Toss 경로)**
- Top + Button + ListHeader 사용 중
- ListHeader 대신 ListRow 사용이 더 적합할 수 있음
- "최근비교" 섹션의 레이아웃 검토 필요

**PriceConfirm.tsx (Toss 경로)**
- Post.H1 타이틀 + 커스텀 카드 레이아웃
- 통화 선택: BottomSheet.Select 사용 (정상)
- TextField.Clearable 사용 (정상)
- 하드코딩 배경색(#F2F4F6, #F8F9FA)이 TDS adaptive 토큰 대신 사용됨

**Result.tsx (Toss 경로)**
- ListRow + TDSNumericSpinner + Top.LowerCTA 사용
- 가격 그리드(현지단가/한국단가)가 커스텀 div로 구현됨 — TDS ListRow 등으로 대체 가능
- 하드코딩 색상 다수: #F9FAFB, #191F28, #8B95A1 등

**AdGate.tsx (Toss 전용)**
- Asset.Image + Text + Button 사용
- 풀스크린 레이아웃 (정상)

**AppShell.tsx (Toss 경로)**
- 커스텀 헤더("MUBU" + 다크모드 토글 버튼) 존재
- TDSBottomNav 사용 (정상)
- 토스 네이티브 내비바와 커스텀 헤더가 동시에 표시될 수 있음 — 확인 필요

**공통 개선 포인트**
- inline 스타일에 하드코딩된 hex 색상을 TDS adaptive 토큰으로 교체
- 여백/패딩이 TDS 가이드라인(4px 단위)과 일치하는지 확인
- 폰트 사이즈가 TDS typography 토큰(t1~st13)과 매칭되는지 확인
- 터치 타겟 최소 44x44px 확보 여부 점검

---

## 10. 남은 TODO

### 필수 (출시 전)
- [ ] 디자인 반려 사유 확인 후 수정
- [ ] 배너 광고 SDK 연동 (`AdBannerSlot.tsx` → `TossAds.attachBanner()`)
- [ ] 실서비스 광고 그룹 ID 발급 후 교체 (전면형 + 배너)

### 권장
- [ ] inline 스타일 → CSS 모듈 또는 정리
- [ ] TDS adaptive 토큰 일관 적용 (하드코딩 hex 제거)
- [ ] 에러 바운더리 추가
- [ ] 레거시 컴포넌트 정리 (ImageUpload, PriceInput, SummaryCard)

### 추후
- [ ] 토스 로그인 연동
- [ ] Sentry 에러 모니터링 (선택)
- [ ] 서버사이드 비교 내역 저장 (현재 localStorage)

---

## 11. 로컬 개발 환경

```bash
# 프론트엔드
npm run dev          # Vite 개발 서버 (포트 5000)
npm run dev:toss     # granite dev (토스 시뮬레이터, 포트 8081)
npm run build        # Vite 빌드
npm run build:toss   # granite build (.ait 번들)

# 백엔드 (별도 저장소)
# Spring Boot 실행 → localhost:8080
```

### 환경변수
```
VITE_API_BASE_URL=https://your-backend.com  # 백엔드 URL (없으면 localhost:8080)
```

### 토스 앱 CORS 허용 도메인
```
https://<appName>.apps.tossmini.com          # 실서비스
https://<appName>.private-apps.tossmini.com  # QR 테스트
```

---

## 12. 주요 파일별 핵심 로직 요약

| 파일 | 핵심 로직 |
|------|-----------|
| `App.tsx` | BrowserRouter + 8개 라우트 |
| `AppShell.tsx` | Toss: 고정 헤더(MUBU) + TDSBottomNav(홈/카메라/프로필) / 웹: CSS 네비 |
| `Home.tsx` | Toss: Top+Button+ListHeader / 웹: 커스텀 카드 UI. 촬영 → Analyzing 이동 |
| `Analyzing.tsx` | API 호출(`compareWithImage`) + 성공 시 광고 사전 로딩(`preloadAd()`) → Toss: AdGate / 웹: PriceConfirm |
| `AdGate.tsx` | Toss 전용. 사전 로딩된 광고 show → dismissed 시 PriceConfirm 이동. 실패 시 3초 카운트다운 |
| `PriceConfirm.tsx` | AI 감지 가격 확인(맞아요/수정). Toss: BottomSheet.Select 통화 선택 / 웹: HTML select |
| `Result.tsx` | 가격 비교 결과. 수량 조절(Toss: TDSNumericSpinner / 웹: +/- 버튼). 절약 금액 표시. 쿠팡 링크 |
| `Dashboard.tsx` | 최근 비교 전체 목록 (localStorage 기반) |
| `Profile.tsx` | 로그인 미구현 안내 |
| `useToss.ts` | openCamera, fetchAlbumPhotos SDK 래핑. 권한 체크(getPermission → openPermissionDialog) |
| `adPreloader.ts` | 광고 사전 load. idle→loading→loaded/failed 상태 머신. 중복 호출 시 같은 Promise 반환 |
| `env.ts` | isTossEnvironment() — 4가지 방법으로 Toss 환경 감지 |
| `tds.ts` | useTDS() — @toss/tds-mobile 동적 import + 캐시 + React 훅 |
| `recentComparisons.ts` | localStorage 기반 비교 내역 CRUD. sessionStorage → localStorage 자동 마이그레이션 포함 |

---

## 13. 앱 내 기능 (콘솔 등록용)

| 한국어 | 영어 | URL |
|--------|------|-----|
| 해외쇼핑 꿀템 찾기 | Find Overseas Deals | `intoss://mubu/` |
| 쇼핑 비교 히스토리 | Shopping Comparison History | `intoss://mubu/dashboard` |

---

## 14. 광고 테스트 ID

| 유형 | 테스트 ID |
|------|-----------|
| 전면형 (현재 사용) | `ait-ad-test-interstitial-id` |
| 보상형 (미사용) | `ait-ad-test-rewarded-id` |
| 배너형 (미구현) | 콘솔에서 별도 발급 필요 |

> 개발 테스트 시 반드시 테스트 ID 사용. 실제 ID로 테스트 시 제재 가능.
