# MUBU 기능/요구사항 정리 (Toss Mini / Web 공통 기준)

## 1. 서비스 개요 (발췌)

- Web-first 도구형 가격 비교 서비스 (Toss MiniApp + 일반 웹/앱)
- 이미지 촬영/업로드 → AI 상품/가격 인식 → 한국 최저가 비교 → 외부 쇼핑 링크
- 상태 저장 최소화, 인증은 환경별 분리(Toss 식별 vs 향후 자체/OAuth)

## 2. 환경별 기능 범위

- Toss MiniApp: 이미지 입력, AI 인식, 가격 비교, 절약 금액/요약, 외부 링크. (회원/결제/이력 없음)
- 독립 웹/앱: 동일 핵심 기능 + 향후 회원/이력/구독/제한 관리 확장 가능.

## 3. 사용자 플로우 (요약)

```
촬영/업로드 → AI 인식 → 한국 최저가 조회 → 가격 차이 계산 → 결과 요약/절약 금액 → 외부 링크
Toss: 카메라/웹뷰, Web/App: 브라우저/디바이스 카메라
```

## 4. API 시퀀스 (요약)

```
이미지 업로드 → imageId 발급
AI 인식(imageId) → 상품명/가격/통화
한국 최저가 조회 → 가격 비교 → 결과 표시 → 외부 링크 이동
```

## 5. 기능/요구사항 매핑 (CSV 기반)

- F-01 상품 이미지 입력 (TOSS/공통/독립앱)
  - R-01 카메라 촬영 (권한 안내)
  - R-02 앨범 업로드 (파일 ≤1MB 권장 안내)
  - R-03 업로드 후 분석 시작 가능 (미선택 시 버튼 비활성)
  - R-04 업로드 로딩/재시도 안내
- F-02 상품 정보 인식
  - R-01 상품명 인식 (실패 시 수동 입력 UI)
  - R-02 브랜드 인식 (없으면 빈 값)
  - R-03 가격 인식 (실패 시 수동 입력 UI)
  - R-04 통화 식별 (없으면 기본 통화 선택 UI)
  - R-05 응답 5초 이내 목표, 타임아웃 시 재시도/수동 입력 유도
- F-03 가격 비교
  - R-01 한국 최저가 조회 (네이버 우선)
  - R-02 현지 가격 원화 환산 (실시간 환율)
  - R-03 가격 차 계산(절약 금액) — 핵심 가치 지표
- F-04 결과 요약
  - R-01 요약 화면 제공
  - R-02 직관적 문구(0원 차이 처리 포함)
- F-05 사용자 입력 보정
  - R-01 AI 인식 결과 수정 가능
- F-06 비교 기록 (TOSS/독립앱)
  - R-01 비교 기록 저장 (Toss 정책 준수, 추후)
  - R-02 누적 절약 금액 표시 (추후)
- F-07 과금 관리 (독립앱, 추후)
  - R-01 무료 사용 월 N회 제한/광고 충전
  - R-02 구독 결제 시 무제한

## 6. API 명세 매핑 (CSV 기반)

- 이미지 업로드: `POST /api/images/upload` → { imageId, imageUrl }
- AI 인식: `POST /api/ai/recognize` (imageId) → { productName, brand, price, currency }
- 한국 최저가 조회: `GET /api/price/korea?productName=...` → { minPrice, platform }
- 가격 차이 계산: `POST /api/price/compare` → { localPrice, currency, koreaPrice } → { diff, currency, isCheaperInKorea }
- 결과 요약: `POST /api/result/summary` → { summary, savedAmount }
- 외부 링크: `GET /api/external/link?productName=...` → { platform, url }
- 기록 저장(추후): `POST /api/history/save`
- 누적 절약 조회(추후): `GET /api/history/summary?userId=...`
- Toss 사용자 식별: `GET /api/toss/user`
- 헬스체크/버전: `GET /api/health`, `GET /api/version`

## 7. 현재 백엔드 구현 정합성 (대비)

- 업로드/AI/요약/외부링크는 현재 구현과 일치 (`/api/price/compare-with-image`, `/api/price/result/summary`, `/api/price/external/link`)
- 환율: Frankfurter 실시간 KRW 변환 적용 → F-03-R-02 충족
- CORS: Toss 도메인/로컬 허용 완료
- 이미지 제한: 10MB 설정 (CSV의 1MB 요구는 권장 UX로 안내 필요)
- imageId 만료: 30분 in-memory 만료 처리
- 기록/과금/회원: 미구현(추후)

## 8. 프론트 요구 포인트 (Toss/비Toss 공통)

- 이미지 입력: Toss 카메라 vs 파일 업로드 분기, 10MB 사전 검증(권장 1MB 안내)
- AI 가격 인식 실패 시: 수동 입력/수정 UI 제공
- 환율/가격 비교: 항상 백엔드 환율 변환, `priceSource`로 AI/USER 표시
- 성능: AI 응답 5초 목표, 지연 시 재시도/수동 입력 유도 메시지
- 외부 링크: Toss 브라우저 vs 새 창 분기
- 상태 미저장 전제: 필요 시 로컬/세션 수준 최소 저장, 서버 영구 저장 없음(현 단계)

## 9. Toss Mini / Web / 독립앱 재사용 가이드

- 플랫폼 감지: `window.Toss` 존재 여부로 Toss 분기, 나머지는 공통 코드 유지
- 네비/브라우저: Toss 브라우저 open vs `window.open`
- 인증: Toss 식별만 사용, 독립 환경 확장 시 OAuth/자체 인증을 모듈로 추가
- 결제/이력/과금: 독립 앱 단계에서만 플러그인처럼 붙일 수 있게 별도 모듈화
