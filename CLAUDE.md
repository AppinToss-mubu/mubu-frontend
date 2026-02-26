# MUBU Frontend - Claude Context

## 프로젝트 개요
**MUBU(무부)** 프론트엔드 - 해외 쇼핑 가격 비교 토스 미니앱
- 토스 앱인토스(Apps in Toss) 미니앱 + 웹 동시 지원
- 사진 촬영 → AI 분석 → 한국 최저가 비교 → 결과 표시

## 현재 상태
- **토스 앱인토스 출시 완료**
- **백엔드 운영 중**: Fly.io (mubu.fly.dev)
- **단계**: 실서비스 유지보수/개선

## 기술 스택
| 구분 | 기술 |
|------|------|
| 프레임워크 | React 18.3.1 + TypeScript 5.9.3 |
| 빌더 | Vite 7.2.4 |
| 라우팅 | React Router v7.12.0 |
| 서버 상태 | React Query (TanStack Query) 5.90.19 |
| UI 상태 | Zustand 5.0.10 |
| UI 시스템 | @toss/tds-mobile v2.2.1 (토스 디자인 시스템) |
| 토스 SDK | @apps-in-toss/web-framework v1.9.1 |
| 스타일링 | @emotion/react + CSS Variables |
| 빌드/배포 | granite CLI (토스 미니앱 빌드) |

## 사용자 플로우
```
Home → 사진촬영/앨범선택 → Analyzing(AI 분석 중)
  → AdGate(광고, 토스만) → PriceConfirm(가격 확인/수정) → Result(결과)
```

## 라우팅
| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | Home | 랜딩, CTA, 최근 비교 목록 |
| `/analyzing` | Analyzing | AI 분석 로딩, 광고 프리로드 |
| `/ad-gate/:imageId` | AdGate | 인터스티셜 광고 (토스 전용) |
| `/price-confirm/:imageId` | PriceConfirm | AI 감지 가격 확인/수정 |
| `/result/:imageId` | Result | 가격 비교 결과, 수량 조절, 절약 금액 |
| `/dashboard` | Dashboard | 최근 비교 기록 (최대 20개) |
| `/profile` | Profile | 프로필 (로그인 미구현) |

## 핵심 구현 포인트

### 토스/웹 듀얼 렌더링
- `isTossEnvironment()` (utils/env.ts)로 환경 감지
- 토스: TDS 컴포넌트 + 네이티브 카메라/앨범 + AdMob 광고
- 웹: HTML/CSS Fallback + `<input type="file">` + 광고 스킵

### TDS 래퍼 컴포넌트 (components/tds/)
- TDSButton, TDSBottomSheet, TDSListRow, TDSBottomNav 등
- 토스 환경이면 실제 TDS, 아니면 웹 Fallback 렌더링
- 동적 import로 TDS 미설치 환경에서도 에러 없음

### 광고 시스템 (utils/adPreloader.ts)
- Analyzing 페이지에서 광고 프리로드 시작
- AdGate 페이지에서 인터스티셜 광고 표시
- 실패 시 3초 카운트다운 후 자동 스킵

### 상태 관리
- **priceStore** (Zustand): imageId, localPrice, currency, priceSource, compareResult, pendingFile
- **React Query**: API 호출 캐싱 (usePriceCompare.ts)
- **localStorage**: 최근 비교 기록 (mubu.recentComparisons.v1, 최대 20개)

## API 연동
- Base URL: `VITE_API_BASE_URL` 환경변수 (기본값: http://localhost:8080)
- `POST /api/price/compare-with-image` → FormData (file + imageId)
- `POST /api/price/result/summary` → JSON (imageId, localPrice, currency, priceSource)
- `GET /api/price/external/link?productName=` → 쇼핑 링크

## 주요 파일 위치
- 페이지: `src/pages/`
- TDS 래퍼: `src/components/tds/`
- API 클라이언트: `src/api/price.ts`
- 훅: `src/hooks/` (useToss, usePriceCompare, useRecentComparisons)
- 스토어: `src/store/priceStore.ts`
- 환경 감지: `src/utils/env.ts`
- 광고: `src/utils/adPreloader.ts`
- 토스 빌드 설정: `granite.config.ts`
- 테마/CSS 변수: `src/index.css`

## 빌드 명령어
```bash
npm run dev          # 웹 개발 (포트 5000)
npm run dev:toss     # 토스 시뮬레이터 (granite dev)
npm run build        # 웹 빌드
npm run build:toss   # 토스 .ait 빌드
```

## 토스 권한
- 카메라 접근 (camera: access)
- 사진첩 읽기 (photos: read)

## 지원 통화 (12종)
THB, JPY, USD, EUR, CNY, SGD, VND, PHP, IDR, HKD, TWD, AUD

## 작업 시 주의사항
- TDS 컴포넌트는 토스 심사 기준이므로 UI 수정 시 TDS 우선 사용
- `isTossEnvironment()` 분기가 많으므로 양쪽 테스트 필요
- 광고 프리로드 타이밍이 UX에 영향 → Analyzing 페이지에서 시작
- localStorage 키 변경 시 기존 사용자 데이터 유실 주의
- .claude/skills/ 에 appintoss-skill, tds-skill 참조 문서 있음

## 유지보수 워크플로우

### GitHub Issues 기반 작업
- 라벨: `bug`, `enhancement`, `infra`
- 이슈 하나 = 브랜치 하나 = PR 하나

### 브랜치 규칙
- `fix/#이슈번호-간단설명` (버그)
- `feat/#이슈번호-간단설명` (기능)
- `improve/#이슈번호-간단설명` (개선)

### 커밋 메시지
- `fix: 설명 (#이슈번호)`
- `feat: 설명 (#이슈번호)`
- `improve: 설명 (#이슈번호)`

### 필수 규칙
- **작업 완료 시 `docs/CHANGELOG.md`에 변경 내역 추가** (날짜 + 카테고리 + 설명)
- 작업 시작/완료 시 아래 "현재 작업 상태" 섹션 업데이트
- 백엔드 관련 레포: `mubu/`

## 현재 작업 상태
- 진행 중: 없음
- 다음: 사용자 피드백 기반 버그 수정 및 기능 개선
- 블로커: 없음
