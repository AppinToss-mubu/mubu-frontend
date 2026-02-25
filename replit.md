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

- 2026-02-19: 광고 SDK / 권한 / TDS 디자인 일괄 개선
  - **AdGate.tsx**: `isAppsInTossAdMobLoaded()` 사전 체크, JSON.stringify 에러 로그, 에러 메시지 UI 표시, TDSLoader 사용, TDS 토큰 전면 적용
  - **useToss.ts**: `getPermission()` → `openPermissionDialog()` 권한 플로우 추가 (카메라 + 앨범 모두), `notDetermined` 상태에서도 권한 대화상자 표시
  - **TDS 디자인 일관성 강화** (모든 페이지):
    - Home: 제목/본문 TDS 색상 토큰, 에러 메시지 red500, 전체보기 링크 blue500
    - ImageSourceSheet: 아이콘 컨테이너 TDS 스타일 (E8F3FF bg, blue500 stroke)
    - PriceConfirm: 흰색 배경, F9FAFB 카드, E5E8EB 셀렉트 보더, SVG 닫기 버튼
    - Result: 가격 그리드 흰색 bg, 절약 섹션 TDS 색상 (blue500/green500), 에러 red500
    - Analyzing: 기존 TDS 스타일 유지
  - TDS 색상 토큰 정리: grey900(#191F28), grey500(#8B95A1), grey400(#B0B8C1), blue500(#3182F6), red500(#F04452), green500(#03B26C)

- 2026-02-19: TDS v2 동적 import() 마이그레이션 (require → dynamic import)
  - **핵심 변경**: `require('@toss/tds-mobile')` → `useTDS()` 훅 기반 동적 `import()` 패턴
  - **이유**: `@toss/tds-mobile`은 비-Toss 환경에서 import 시 에러 throw → ESM import 불가
  - **새 유틸리티**: `src/utils/tds.ts` - 중앙집중 TDS 로더 (동적 import + 캐시 + React 훅)
  - **Vite 설정**: `optimizeDeps.exclude`로 TDS 패키지 사전번들링 방지
  - **적용 파일**: Home, Analyzing, AdGate, PriceConfirm, Result, ImageSourceSheet
  - **패턴**: `useTDS()` 훅 → `{ tds, colors, ready }` → `if (isToss && tdsReady)` 가드 → 컴포넌트 구조분해
  - **비-Toss 환경**: 기존 원본 스타일 100% 유지, 콘솔 에러 없음
  - **기존 TDS 래퍼 컴포넌트** (`src/components/tds/`): AppShell의 TDSBottomNav만 사용 중, 나머지는 레거시

- 2026-02-19: Toss 앱 실기기 테스트 후 UI/UX 버그 수정
  - **PriceConfirm.tsx**: 통화 선택을 Menu.Dropdown → BottomSheet + BottomSheet.Select로 교체 (스크롤 독립적 팝업 UI)
  - **Result.tsx**: TDS NumericSpinner 동작 불가 → TDSNumericSpinner 래퍼 컴포넌트로 교체
  - **Result.tsx**: 절약 섹션 레이아웃 개선 (subtitleTop "총 절약" + title 금액 + subtitleBottom 설명)
  - **ImageSourceSheet.tsx**: Button 배열 CTA → BottomSheet.DoubleCTA로 교체 (TDS 공식 패턴)
  - **useToss.ts**: 권한 로직 확인 완료 (getPermission → openPermissionDialog 플로우, 캐시 후 재팝업 없음 정상)

- 2026-02-19: TDS NumericSpinner 네이티브 연동 수정
  - **원인**: TDS API는 `onNumberChange`/`number` prop인데 `onChange`/`value`로 호출하여 미동작
  - **TDSNumericSpinner.tsx**: Toss 환경에서 네이티브 NumericSpinner를 올바른 prop(`number`, `onNumberChange`, `minNumber`, `maxNumber`, `disable`)으로 호출
  - 비-Toss 환경: 커스텀 HTML 버튼 폴백 유지

- 2026-02-19: 안드로이드 폰트 크기 & 버튼 텍스트 조정
  - `index.css`: `-webkit-text-size-adjust: 100%` 추가 (안드로이드 WV 텍스트 자동 확대 방지)
  - 버튼 폰트 사이즈 1px씩 축소 (16→15 CTA, 15→14 쌍 버튼, 14→13 보조 버튼)

- 2026-02-19: 토스 미니앱 출시 체크리스트 대응
  - **광고 사전 로딩**: `src/utils/adPreloader.ts` 신규 모듈. Analyzing에서 API 성공 후 광고 사전 load → AdGate에서 show만 호출
  - **제스처 확대/축소 비활성화**: `index.html` viewport에 `user-scalable=no, maximum-scale=1.0` 추가
  - **내비게이션 바 중복 확인**: TDS 경로에서 자체 헤더/뒤로가기 없음 → 토스 내비바와 중복 없음 확인
  - **데이터 영속성**: `recentComparisons.ts` sessionStorage → localStorage 변경 (앱 종료 후 재진입 시 유지)

- 2026-02-25: Claude Code 인수인계 문서 작성
  - `docs/claude-code-handoff.md` — 프로젝트 전체 현황 종합 문서
  - 프로젝트 개요, 기술 스택, 구조, 유저 플로우, 환경 분기, TDS 연동, 광고 SDK, API 엔드포인트, 디자인 현황, TODO 정리
  - 디자인 반려 대응을 위한 화면별 개선 포인트 상세 기술
  - `docs/cursor-handoff.md` 광고 플로우 설명 최신화 (adPreloader 기반 플로우 반영)
