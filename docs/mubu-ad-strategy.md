# MUBU 광고 전략 설계서

> Toss 미니앱 전용 광고 수익 모델 — 전면 광고 + 배너 광고 + 제휴 커머스

---

## 1. 유저 플로우

```
Home (촬영 버튼)
  → ImageSourceSheet (업로드/촬영 선택)
    → Analyzing (AI 분석 로딩)
      → [Toss] AdGate (전면 광고 시청)
      → PriceConfirm (상품명 + 가격 확인/수정)
        → Result (가격 비교 + 배너 광고 + 쿠팡 링크)
```

### 환경별 분기

| 환경 | 광고 | 플로우 |
|------|------|--------|
| Toss 미니앱 | 매 비교마다 전면 광고 | Analyzing → AdGate → PriceConfirm → Result |
| 일반 웹 | 없음 | Analyzing → PriceConfirm → Result |

---

## 2. 수익 모델 (3가지)

### 1) 전면 광고 (Toss 전용)

**위치:** Analyzing 완료 → PriceConfirm 진입 전  
**방식:** 매 비교마다 전면 광고 1회 시청 (횟수 제한 없음, 구독 없음)

**플로우:**
1. 분석 완료 → TDSConfirmDialog: "광고를 시청하면 가격 비교 결과를 볼 수 있어요"
2. "결과 보기" 클릭 → 전면 광고 로드 → 재생 → 완료 → PriceConfirm 이동
3. "닫기" 클릭 → 홈으로 돌아감 (결과 못 봄)

**구현:**
- `src/pages/AdGate.tsx` — 전면 광고 게이트 페이지
- @cursor-todo: `GoogleAdMob.loadAppsInTossAdMob` → `showAppsInTossAdMob` 실제 SDK 연결

**UI 구조:**
```
┌─────────────────────────┐
│                         │
│   분석이 완료되었어요!    │
│                         │
│  ┌───────────────────┐  │
│  │                   │  │
│  │  광고를 시청하면    │  │
│  │  가격 비교 결과를   │  │
│  │  볼 수 있어요      │  │
│  │                   │  │
│  │ [닫기] [결과 보기]  │  │
│  └───────────────────┘  │
│                         │
└─────────────────────────┘
```

### 2) 배너 광고 (Toss 전용)

**위치:** Result 페이지 하단 (가격 비교 결과 아래, 면책 문구 위)  
**방식:** 비침습적 배너 광고 슬롯

**구현:**
- `src/components/AdBannerSlot.tsx` — 배너 광고 슬롯 (Toss 환경에서만 렌더)
- @cursor-todo: 토스 인앱 광고는 전면형/보상형만 제공 → 배너는 향후 확장용 자리

### 3) 제휴 커머스 (쿠팡 파트너스)

**위치:** Result 페이지 — "한국가격 보기" / "구매함" 버튼  
**방식:** 쿠팡 파트너스 제휴 링크 → 사용자 구매 시 수수료 수익

**핵심:**
- PriceConfirm에서 출처(쿠팡) 표시를 축소 (12px, opacity 0.6)하여 직접 검색 유도 최소화
- Result 페이지의 쿠팡 링크 버튼이 실질적 수익 발생 포인트

---

## 3. 설계 원칙

- **유료 구독 없음** — 토스 결제 연동 불필요
- **횟수 제한 없음** — 광고 시청만으로 무제한 사용
- **로그인 불필요** — 비로그인 상태로 자유롭게 비교
- **Toss 환경 전용** — 일반 웹에서는 광고 없이 무료 사용

---

## 4. 작업 분류

### Replit에서 완료 (UI 구조 + 로직)

| # | 작업 | 파일 | 상태 |
|---|------|------|------|
| 1 | AdGate 페이지 컴포넌트 | `src/pages/AdGate.tsx` | 완료 |
| 2 | AdBannerSlot 컴포넌트 | `src/components/AdBannerSlot.tsx` | 완료 |
| 3 | 라우팅 변경 | `src/App.tsx` | 완료 |
| 4 | Analyzing → AdGate 환경 분기 | `src/pages/Analyzing.tsx` | 완료 |
| 5 | PriceConfirm 출처 스타일 조정 | `src/pages/PriceConfirm.tsx` | 완료 |

### Cursor (Mac)에서 할 것 (SDK 연동)

| # | 작업 | 상세 |
|---|------|------|
| 1 | `@apps-in-toss/web-framework` 설치 | `npm install @apps-in-toss/web-framework` (SDK 1.0.3+) |
| 2 | AdGate에 실제 SDK 호출 연결 | `loadAppsInTossAdMob` → `showAppsInTossAdMob` |
| 3 | 콘솔에서 광고 그룹 생성 + adGroupId 발급 | 전면형 1개 |
| 4 | 실기기 테스트 | 샌드박스 미지원 → 실단말 필수 |

---

## 5. 구글 애드몹 정책 준수

- 토스 인앱광고는 **구글 애드몹 광고 정책**을 따름
- 핵심 플로우 (결제/가입/로그인) 중에는 광고 노출 금지
- 사용자에게 과도한 광고 노출 금지 (매 비교 1회만)
- 광고 재생 중 앱 사운드 일시 정지

---

## 6. 수익 예상

```
전면 광고 (매 비교 시)
  → eCPM 기반 수익 (1,000회 노출당 수익)
  → 예: eCPM 60,000원 × 일 300회 노출 = 18,000원/일

배너 광고 (Result 페이지)
  → 추가 노출 수익 (향후 확장)

쿠팡 파트너스
  → "한국가격 보기" / "구매함" 클릭 → 쿠팡 링크
  → 구매 시 수수료 수익
```
