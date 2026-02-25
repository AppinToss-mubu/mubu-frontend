# MUBU (무부) - 해외 가격 비교 서비스

해외 여행 중 발견한 상품을 촬영하면, AI가 한국 가격과 비교해주는 서비스입니다.

## 주요 기능

- 상품 사진 촬영/업로드로 AI 가격 분석
- 현지 가격 vs 한국 가격 실시간 비교
- 다양한 통화 지원 (THB, JPY, USD, EUR 등 12종)
- 최근 비교 기록 관리

## 기술 스택

- **프레임워크**: React 18 + TypeScript + Vite
- **상태 관리**: Zustand, React Query
- **라우팅**: React Router v7
- **UI**: Toss Design System (TDS Mobile v2)
- **배포**: 토스 앱인토스 미니앱 + 웹 환경 동시 지원

## 실행 방법

```bash
# 의존성 설치
npm install

# 웹 개발 서버
npm run dev

# 토스 시뮬레이터 개발 서버
npm run dev:toss

# 빌드
npm run build          # 웹
npm run build:toss     # 토스 미니앱 (.ait)
```

## 프로젝트 구조

```
src/
  pages/        # 페이지 컴포넌트 (Home, Result, PriceConfirm 등)
  components/   # 공통 컴포넌트 (AppShell, TDS 래퍼 등)
  hooks/        # 커스텀 훅 (useToss, useRecentComparisons 등)
  store/        # Zustand 스토어
  utils/        # 유틸리티 (환경 감지, TDS 로더, 광고 등)
```
