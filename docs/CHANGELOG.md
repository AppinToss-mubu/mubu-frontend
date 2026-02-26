# Changelog

All notable changes to this project will be documented in this file.

## [1.0.3] - 2026-02-27

### Removed
- 결과 페이지 AD 배너 슬롯(회색 placeholder) 제거

## [1.0.2] - 2026-02-27

### Improved
- 분석 중 로딩 화면 스피너 크기 개선 (토스: Loader scale 1.4배, 웹: 80→100px)
- 홈 화면 레이아웃 개선 (Hero 패딩/타이포그래피 확대, 최근 비교 타이틀 t5→t3)
- 홈 화면 빈 상태 UI 추가 (비교 기록 없을 때 안내 메시지)

### Added
- 결과 페이지 공유하기 버튼 (토스: SDK share, 웹: navigator.share → clipboard fallback)

## [1.0.1] - 2026-02-26

### Fixed
- 결과 페이지 절약 금액 +/- 부호 및 텍스트 반전 버그 수정 (토스: 텍스트 반대, 웹: 부호 반대)

## [1.0.0] - 2026-02-25

### Released
- MVP 출시 (토스 앱인토스 미니앱)
- 사진 촬영/앨범 선택 → AI 분석 → 한국 최저가 비교 플로우
- 토스/웹 듀얼 렌더링 (TDS 컴포넌트 + 웹 Fallback)
- 인터스티셜 광고 (AdMob) 연동
- 가격 확인/수정 페이지
- 수량 조절 기능
- 최근 비교 기록 (localStorage, 최대 20개)
- 12개 통화 지원 (THB, JPY, USD, EUR, CNY, SGD, VND, PHP, IDR, HKD, TWD, AUD)
