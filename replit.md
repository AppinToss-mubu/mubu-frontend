# MUBU Frontend

React + TypeScript 가격 비교 웹 애플리케이션 (Vite 기반)

## Overview

해외에서 발견한 상품의 가격을 한국 최저가와 비교해주는 서비스입니다.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Routing**: React Router DOM

## Project Structure

```
src/
├── api/              # API 클라이언트
│   ├── price.ts      # 가격 비교 API 함수
│   └── types.ts      # API 타입 정의
├── components/       # 재사용 컴포넌트
│   ├── AppShell.tsx  # 앱 레이아웃 (네비게이션 포함)
│   ├── ImageSourceSheet.tsx  # 이미지 선택 시트
│   └── ...
├── hooks/            # 커스텀 훅
│   ├── usePriceCompare.ts    # 가격 비교 API 훅
│   ├── useRecentComparisons.ts  # 최근 비교 내역
│   └── useToss.ts    # Toss SDK 연동
├── pages/
│   ├── Home.tsx      # 홈 (이미지 업로드)
│   ├── Analyzing.tsx # 분석 중 로딩 화면
│   ├── PriceConfirm.tsx  # AI 감지 가격 확인/수정
│   ├── Result.tsx    # 최종 비교 결과
│   └── Dashboard.tsx # 최근 비교 목록
├── store/
│   └── priceStore.ts # Zustand 상태 관리
└── utils/
    └── env.ts        # 환경 감지
```

## User Flow

1. **Home** → 상품 촬영 버튼 클릭
2. **ImageSourceSheet** → 업로드/촬영 선택
3. **Analyzing** → AI 분석 로딩
4. **PriceConfirm** → 감지된 가격 확인/수정
5. **Result** → 가격 비교 결과 (수량 조절 가능)

## Backend Connection

API 기본 URL: `http://localhost:8080`

환경변수로 변경 가능:
```
VITE_API_BASE_URL=https://your-backend.com
```

## Development

```bash
npm run dev
```

포트 5000에서 실행됩니다.

## TDS 참조 문서

`docs/tds/` 폴더에 TDS 공식 스펙 정리본이 있습니다.

### 파운데이션
- `docs/tds/foundation-colors.md` - 색상 토큰 (Grey, Blue, Red, Green 등)
- `docs/tds/foundation-typography.md` - 폰트 체계 (t1~st13 토큰)

### 기존 래퍼 컴포넌트 (8개, src/components/tds/)
- Button, BottomSheet, Loader, TextField, NumericSpinner, ListRow, BottomNav, BottomCTA

### 추가 컴포넌트 문서 (6개)
- Toast, Dialog (AlertDialog + ConfirmDialog), Badge, Skeleton, Top, Tab

## Recent Changes

- 2026-01-28: TDS 환경별 분기 적용 완료
  - 모든 페이지에서 `isTossEnvironment()` 체크로 환경 분기
  - Toss 환경: TDS 스타일 적용
  - 일반 웹: 기존 원본 스타일 유지
  
  **TDS 래퍼 컴포넌트** (`src/components/tds/`):
  - TDSButton, TDSBottomSheet, TDSLoader, TDSTextField
  - TDSNumericSpinner, TDSListRow, TDSBottomNav, TDSBottomCTA
  
  **환경 분기 적용된 페이지**:
  - Home.tsx (메인 버튼, 최근 비교 리스트)
  - Analyzing.tsx (로딩, 에러 버튼)
  - PriceConfirm.tsx (버튼, 입력 필드)
  - Result.tsx (수량 스피너, 버튼)
  - Dashboard.tsx (리스트)
  - Profile.tsx (버튼)
  - AppShell.tsx (하단 네비게이션)
  - ImageSourceSheet.tsx (바텀시트, 버튼)

- 2026-01-28: UI 전면 개편 (스크린샷 기준 디자인)
  - Result 페이지: 수량 선택기, 가격 비교 테이블, 절약 금액 표시
  - PriceConfirm 페이지: 이미지 상단 배치, 통화 기호 표시
  - Analyzing 페이지: 분석 플로우에 추가
  - ImageSourceSheet: 업로드/촬영 탭 UI

- 2026-02-19: TDS 공식 스펙 문서화 및 래퍼 컴포넌트 확장
  - `docs/tds/` 에 16개 참조 문서 작성 (Colors, Typography, 14 components)
  - TDSBottomCTA에 `color` prop 추가 (dark/primary 선택 가능)
  - 신규 TDS 래퍼 컴포넌트 5개 추가:
    - TDSToast (성공/에러/정보 피드백)
    - TDSDialog (AlertDialog + ConfirmDialog)
    - TDSBadge (상태 라벨)
    - TDSSkeleton (로딩 플레이스홀더)
    - TDSTop (페이지 헤더)

- 2026-02-19: 광고 수익화 인프라 구축
  - `docs/toss-ads-guide.md` - 토스 인앱 광고 SDK 종합 레퍼런스
  - `docs/mubu-ad-strategy.md` - MUBU 광고 전략 (광고+제휴 커머스 수익 모델)
  - `src/pages/AdGate.tsx` - 전면 광고 게이트 페이지 (Toss 전용)
    - 매 비교마다 광고 시청 → 결과 확인 (횟수 제한/구독 없음)
    - @cursor-todo: simulateAdFlow() → GoogleAdMob SDK 호출로 교체
  - `src/components/AdBannerSlot.tsx` - 배너 광고 슬롯 (Result 페이지 하단, Toss 전용)
  - 라우팅: Analyzing → AdGate(Toss) 또는 PriceConfirm(웹) 환경 분기
  - 수익 모델: 전면 광고 + 배너 광고 + 쿠팡 파트너스 (유료 구독 없음)

- 2026-02-19: AdGate UI 리디자인 + Cursor 인수인계 문서 갱신
  - AdGate: TDSConfirmDialog → 풀스크린 안내 화면으로 변경
    - 체크 아이콘 + 안내 텍스트 + 피처 카드 2개 (광고 시청 / 결과 확인)
    - 로딩/재생중/실패 상태별 전용 UI
    - 하단 CTA 버튼 + "다음에 할게요" 텍스트 버튼
  - `docs/cursor-handoff.md` 갱신:
    - 테스트 광고 ID (ait-ad-test-interstitial-id, ait-ad-test-rewarded-id)
    - 카메라/앨범 SDK 이미 useToss.ts에 구현 완료 확인
    - `npm install @apps-in-toss/web-framework` 후 바로 동작
    - 작업 체크리스트 + 유저 플로우 정리

- 2026-02-19: 광고 중복 로드 충돌 수정
  - Analyzing.tsx에서 광고 사전 로드 코드 제거 (중복 load 충돌 방지)
  - AdGate에서만 load → show 순차 호출하도록 변경
  - AdGate 광고 실패 시 3초 카운트다운 후 자동 결과 페이지 이동 추가
  - cursor-handoff.md에 디버깅 팁 섹션 추가
