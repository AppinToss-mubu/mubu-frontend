# 토스 인앱 광고 연동 가이드

> MUBU 프로젝트용 종합 레퍼런스. 매번 복붙할 필요 없이 이 문서 참고.

---

## 1. 광고 유형

| 유형 | 설명 | 용도 |
|------|------|------|
| **전면형 (Interstitial)** | 화면 전체를 덮는 광고. 화면 전환 시점에 노출 | MUBU: 분석 완료 → PriceConfirm 전환 시 |
| **보상형 (Rewarded)** | 사용자가 선택해서 시청, 보상 제공 | MUBU: 비교 횟수 제한 해제, 추가 기능 잠금 해제 |

---

## 2. SDK API 레퍼런스

### 2-1. 광고 불러오기: `loadAppsInTossAdMob`

```typescript
import { GoogleAdMob } from '@apps-in-toss/web-framework';

const AD_GROUP_ID = '<콘솔에서 발급받은 광고 그룹 ID>';

const cleanup = GoogleAdMob.loadAppsInTossAdMob({
  options: {
    adGroupId: AD_GROUP_ID,
  },
  onEvent: (event) => {
    switch (event.type) {
      case 'loaded':
        console.log('광고 로드 성공', event.data);
        cleanup();
        break;
    }
  },
  onError: (error) => {
    console.error('광고 불러오기 실패', error);
    cleanup?.();
  },
});
```

**핵심 포인트:**
- 페이지 진입 시 **미리 로드** 필수 (로드 안 하고 show 호출하면 에러)
- `isSupported()` 체크 먼저 해야 함 (일반 웹에서는 지원 안 됨)
- iOS: 앱 추적 모드 켜져 있으면 로드 안 됨 → 해제 후 시도

### 2-2. 광고 보여주기: `showAppsInTossAdMob`

```typescript
GoogleAdMob.showAppsInTossAdMob({
  options: {
    adGroupId: AD_GROUP_ID,
  },
  onEvent: (event) => {
    switch (event.type) {
      case 'show':        // 광고 컨텐츠 보여짐
      case 'requested':   // 노출 요청 완료
      case 'impression':  // 광고 노출 (수익 카운트)
      case 'clicked':     // 광고 클릭
      case 'dismissed':   // 광고 닫힘 → 여기서 다음 화면 이동!
      case 'failedToShow': // 보여주기 실패
        break;
      case 'userEarnedReward': // 보상형 광고 전용
        console.log(event.data.unitType, event.data.unitAmount);
        break;
    }
  },
  onError: (error) => {
    console.error('광고 보여주기 실패', error);
  },
});
```

**핵심 포인트:**
- `load → show → (다음 load) → show` 순서로 동작
- 한 번에 1개의 광고만 로드됨
- `dismissed` 이벤트에서 다음 페이지로 네비게이션
- `show` 호출 전에 반드시 `loaded` 이벤트 받은 상태여야 함

---

## 3. 테스트용 광고 ID

| 유형 | 테스트 ID |
|------|-----------|
| 전면형 | `ait-ad-test-interstitial-id` |
| 보상형 | `ait-ad-test-rewarded-id` |

> **주의:** 개발 중에는 반드시 테스트 ID 사용. 운영 ID로 테스트하면 제재.
> 샌드박스에서는 인앱 광고 기능 미지원 → 실기기 테스트 필요.

---

## 4. 콘솔 설정 절차

**앱인토스 콘솔 (https://console.toss.im 등)**

1. **약관 동의** — 대표관리자 계정으로 진행
   - 콘솔 → 워크스페이스 → 미니앱 → 인앱광고 → 약관 확인하기

2. **정산 정보 입력** — 영업일 2~3일 소요 (검토 필요)
   - 콘솔 → 워크스페이스 → 정보 탭 → 정산 정보 등록
   - 예금주명 = 통장 사본 기재 이름과 동일해야 함

3. **광고 그룹 생성** — 약관 + 정산 검토 완료 후
   - 콘솔 → 미니앱 → 인앱광고 → 광고 그룹 생성하기
   - 설정 항목: 광고 그룹 이름, 광고 유형(전면/리워드), 보상 설정(리워드만)
   - 생성 후 **광고 그룹 ID** 발급 (구글 등록까지 최대 2시간)
   - 이 ID를 코드에서 `adGroupId`로 사용

4. **성과 확인**
   - 콘솔 → 미니앱 → 인앱광고 2.0 → 성과/정산 내역
   - eCPM = 1,000회 노출당 수익
   - 정산: 1~말일 수익 → 익월 1일 업데이트 → 해당 월 말일 입금

---

## 5. QA 체크리스트

| 구분 | 체크 항목 |
|------|-----------|
| 사전 로드 | 화면 진입 시 사전 로드 수행되는지 |
| 기본 연동 | 로드 완료 후 지연 없이 재생 |
| | 광고 종료 시 미니앱 화면 정상 복귀 |
| | 광고 재생 중 앱 사운드 일시 정지 |
| | 복귀 후 사운드 정상 재개 |
| | 광고 도중 닫았을 때 예외 없이 복귀 |
| 보상형 | 시청 완료 이벤트에서만 보상 지급 |
| | 중복 보상 방지 로직 동작 |
| 안정성 | 광고 빈도 제한·쿨다운 적용 |
| | **핵심 플로우 차단 노출 없음 (결제/가입/로그인 중)** |
| | 가로/세로 전환, 백그라운드 복귀 정상 |
| | 네트워크 실패 시 재시도/대체 흐름 |
| | 메모리/CPU 급증, 크래시 없음 |
| 로그/정산 | 노출/완료/보상 이벤트 로그 수집 |

---

## 6. Cursor에서 해야 할 작업 (Replit에서 불가)

> `@apps-in-toss/web-framework` SDK는 npm 패키지이므로 Mac/Cursor에서 설치 및 연동해야 함

| 작업 | 설명 |
|------|------|
| SDK 설치 | `npm install @apps-in-toss/web-framework` (SDK 1.0.3 이상) |
| `GoogleAdMob` import | `import { GoogleAdMob } from '@apps-in-toss/web-framework'` |
| `loadAppsInTossAdMob` 호출 | Analyzing 페이지 진입 시 사전 로드 |
| `showAppsInTossAdMob` 호출 | 광고 게이트 페이지에서 광고 표시 |
| `isSupported()` 체크 | 일반 웹에서는 광고 skip하는 분기 |
| 실기기 테스트 | 샌드박스 미지원 → 실단말에서 테스트 |
| 콘솔에서 adGroupId 발급 | 광고 그룹 생성 후 ID 코드에 적용 |

---

## 7. Replit에서 할 수 있는 작업

| 작업 | 설명 |
|------|------|
| 광고 게이트 UI 컴포넌트 | "광고를 시청하면 가격 비교 결과를 볼 수 있어요" 바텀시트/전면 화면 |
| 광고 배너 슬롯 컴포넌트 | Result 하단 배너 영역 |
| 비교 횟수 제한 로직 | 로그인/비로그인/유료 분기 구조 |
| 라우팅 변경 | `/analyzing` → `/ad-gate/:imageId` → `/price-confirm/:imageId` |
| PriceConfirm 출처 숨김 | 광고 시청 전 "쿠팡" 노출 방지 |
| 환경 분기 | `isTossEnvironment()` → 광고 노출 / 일반 웹 → skip |
