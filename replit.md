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
