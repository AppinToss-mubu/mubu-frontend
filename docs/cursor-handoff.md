# Cursor 인수인계 — SDK 연동 작업 목록

> Replit에서 UI 구조 + 환경 분기 + 문서화 완료. Cursor에서 SDK 패키지 설치 및 실제 API 연결 필요.

---

## 1. 패키지 설치

```bash
npm install @apps-in-toss/web-framework
```

> SDK 버전 1.0.3 이상 필요

---

## 2. 광고 SDK 연동 (AdGate)

### 파일: `src/pages/AdGate.tsx`

`handleWatchAd()` 함수 안의 `simulateAdFlow()` 호출을 실제 SDK 호출로 교체:

```typescript
import { GoogleAdMob } from '@apps-in-toss/web-framework';

const handleWatchAd = async () => {
  setAdState("loading");

  try {
    const ad = await GoogleAdMob.loadAppsInTossAdMob({
      adGroupId: 'ait-ad-test-interstitial-id', // 테스트용 ID
      type: 'interstitial',
    });

    setAdState("showing");
    ad.show();

    ad.addEventListener('dismissed', () => {
      setAdState("done");
      navigate(`/price-confirm/${imageId}`, { replace: true });
    });

    ad.addEventListener('failed', () => {
      setAdState("failed");
    });
  } catch (error) {
    console.error('광고 로드 실패:', error);
    setAdState("failed");
  }
};
```

### 테스트 광고 ID

| 타입 | 테스트 ID |
|------|-----------|
| 전면형 (interstitial) | `ait-ad-test-interstitial-id` |
| 리워드 (rewarded) | `ait-ad-test-rewarded-id` |

> 개발 테스트 시 반드시 테스트용 ID 사용. 실제 광고 ID로 테스트하면 불이익 발생 가능.

### 실서비스 전환 시

1. [토스 개발자 콘솔](https://developers-apps-in-toss.toss.im)에서 광고 그룹 생성
2. 전면형 광고 adGroupId 발급
3. `ait-ad-test-interstitial-id` → 실제 발급받은 ID로 교체

---

## 3. 카메라/앨범 SDK (이미 구현 완료)

### 파일: `src/hooks/useToss.ts`

카메라와 앨범 SDK 연동은 이미 구현되어 있음:

- `openCamera` → `@apps-in-toss/web-framework`의 `openCamera` 사용
  - `base64: true`, `maxWidth: 1080`
  - `OpenCameraPermissionError` 처리 포함
- `fetchAlbumPhotos` → `@apps-in-toss/web-framework`의 `fetchAlbumPhotos` 사용
  - `base64: true`, `maxWidth: 1080`, `maxCount: 1`
  - `FetchAlbumPhotosPermissionError` 처리 포함

> `npm install @apps-in-toss/web-framework` 후 바로 동작 예정.
> dynamic import 사용 중이라 패키지 미설치 시에도 빌드 에러 없음.

---

## 4. 환경 감지

### 파일: `src/utils/env.ts`

`isTossEnvironment()` 함수로 Toss/웹 환경 분기:
- `window.Toss` 객체 존재 여부
- User-Agent에 `TossApp` 포함 여부
- 호스트명에 `toss` 포함 여부

모든 TDS 스타일과 SDK 호출은 이 함수로 분기됨.

---

## 5. 작업 체크리스트

### 즉시 할 것

- [ ] `npm install @apps-in-toss/web-framework`
- [ ] AdGate.tsx의 `simulateAdFlow()` → 실제 `GoogleAdMob` SDK 호출로 교체
- [ ] 실기기에서 테스트 광고 ID로 전면 광고 테스트

### 추후 할 것

- [ ] 토스 콘솔에서 실제 전면형 광고 adGroupId 발급
- [ ] 테스트 ID → 실제 ID 교체
- [ ] AdBannerSlot (`src/components/AdBannerSlot.tsx`) 배너 광고 연결 (현재 빈 자리만 마련)
- [ ] 토스 로그인 연동 (별도 작업)

---

## 6. 현재 유저 플로우

```
[Toss 환경]
Home → 상품 촬영 (openCamera SDK) / 앨범 선택 (fetchAlbumPhotos SDK)
  → Analyzing (AI 분석)
    → AdGate (전면 광고 시청)
      → PriceConfirm (가격 확인/수정)
        → Result (비교 결과 + 하단 배너 광고 + 쿠팡 링크)

[일반 웹 환경]
Home → 상품 촬영 (HTML input capture) / 앨범 선택 (HTML input file)
  → Analyzing (AI 분석)
    → PriceConfirm (가격 확인/수정)
      → Result (비교 결과 + 쿠팡 링크)
```

---

## 7. 수익 모델

- **전면 광고** — 매 비교마다 1회 (Toss 전용)
- **배너 광고** — Result 페이지 하단 (Toss 전용, 향후 확장)
- **쿠팡 파트너스** — 한국가격 보기/구매함 버튼 → 제휴 링크
- 유료 구독 없음, 횟수 제한 없음, 로그인 불필요
