---
name: appintoss-skill
description: >-
  토스 앱인토스(Apps in Toss) 미니앱 개발 A-to-Z 스킬.
  프로젝트 생성부터 SDK 연동, 인앱광고, 인앱결제, 딥링크, 공유, 화면 이동, 
  토스 로그인, 토스 페이, 햅틱, 권한, 저장소, WebView 속성, 빌드, QA, 심사, 배포까지 전 과정을 다룬다.
  앱인토스, 토스 미니앱, @apps-in-toss/web-framework, bedrock, 
  인앱광고(AdMob), 인앱결제(IAP), 딥링크, 공유, 토스 로그인, 토스 페이,
  NavigationBar, 화면 이동, 라이프사이클, 콘솔, 심사, QA, 배포, 
  React Native, Unity WebGL 등이 언급되면 반드시 이 스킬을 참조할 것.
  TDS 컴포넌트 관련은 tds-skill을 함께 참조할 것.
---

# AppinToss A-to-Z Skill

토스 미니앱 개발의 전체 파이프라인을 안내한다. 이 스킬은 tds-skill과 함께 사용하는 것이 권장된다.

## 프로젝트 타입

앱인토스 미니앱은 3가지 개발 방식을 지원한다.

| 타입 | 프레임워크 | SDK 패키지 | 대상 |
|---|---|---|---|
| WebView | React + Vite/Next.js | `@apps-in-toss/web-framework` | 일반 서비스 앱 (mubu 등) |
| React Native | React Native | `@apps-in-toss/react-native` | 네이티브 성능 필요 (애니핏 등) |
| Unity WebGL | Unity + Vite wrapper | `@apps-in-toss/web-framework` | 게임 앱 |

프로젝트 타입에 따라 참조할 reference가 다르다. 상세 SDK 문서는 `references/sdk-full.md`를 참조한다.

---

## 1. 프로젝트 초기 설정

### WebView 기반

```sh
# 앱인토스 CLI로 프로젝트 생성
npx @apps-in-toss/create-app my-mini-app
cd my-mini-app
npm install
```

필수 설정 파일:
- `bedrock.config.ts` — 앱 설정 (primaryColor, 라우팅 등)
- `package.json` — `@apps-in-toss/web-framework` 포함
- TDS Provider 설정 — `TDSMobileAITProvider` (tds-skill 참조)

### React Native 기반

```sh
npx @apps-in-toss/create-rn-app my-rn-app
cd my-rn-app
npm install
```

### 환경 변수 설정

```sh
# React Native의 경우
npm install  # npm
yarn install  # yarn
pnpm install  # pnpm
```

Android/iOS 환경설정은 `references/sdk-full.md`의 환경설정 섹션을 참조한다.

---

## 2. 핵심 SDK 기능

### 2-1. 인앱 광고 (AdMob)

광고는 load → show 2단계로 동작한다. 반드시 load가 성공한 후 show를 호출한다.

```jsx
import { GoogleAdMob } from '@apps-in-toss/web-framework';

// 1단계: 광고 로드
const cleanup = GoogleAdMob.loadAppsInTossAdMob({
  options: { adGroupId: '<AD_GROUP_ID>' },
  onEvent: (event) => {
    if (event.type === 'loaded') {
      cleanup();
      // 2단계: 광고 표시
      GoogleAdMob.showAppsInTossAdMob({
        options: { adGroupId: '<AD_GROUP_ID>' },
        onEvent: (event) => {
          // 'show', 'impression', 'clicked', 'userEarnedReward', 'dismissed' 등
        },
        onError: (error) => console.error(error),
      });
    }
  },
  onError: (error) => console.error(error),
});
```

광고 유형: 전면 광고, 보상형 광고, 배너 광고(v2)
버전: v1.0 (레거시), v2.0 (통합 SDK) — 신규 앱은 v2.0 사용

상세 이벤트 타입, 옵션 객체는 `references/sdk-full.md`를 참조한다.

### 2-2. 인앱 결제 (IAP)

```jsx
import { createOneTimePurchaseOrder } from '@apps-in-toss/web-framework';

// 단건 결제
const result = await createOneTimePurchaseOrder({
  // 결제 옵션
});
```

결제 흐름: 결제 생성 → 결제 인증 → 결제 실행 → (필요시) 환불
정기결제: `createSubscriptionPurchaseOrder` 사용

### 2-3. 토스 페이 (Checkout)

```jsx
import { checkoutPayment } from '@apps-in-toss/web-framework';

const result = await checkoutPayment({
  // CheckoutPaymentOptions
});
```

### 2-4. 공유 기능

```jsx
import { share } from '@apps-in-toss/web-framework';

// 기본 공유
share({ title: '공유 제목', text: '공유 내용', url: 'https://...' });
```

공유 리워드(바이럴): `contactsViral` API 사용
토스앱 공유 링크: `getTossShareLink` API 사용

### 2-5. 화면 이동 & 딥링크

```jsx
import { navigate } from '@apps-in-toss/web-framework';

// 미니앱 내 화면 이동
navigate('/next-page');

// 외부 링크
// 자사 앱 설치/외부 링크 가이드라인 참조
```

### 2-6. 토스 로그인

```jsx
import { appLogin } from '@apps-in-toss/web-framework';

// 인가 코드 받기
const authCode = await appLogin();
```

마이그레이션 가이드: 기존 로그인 → `appLogin` 전환 시 `references/sdk-full.md` 참조

### 2-7. 기타 SDK API

| 기능 | API | 설명 |
|---|---|---|
| 햅틱 진동 | `haptic` | 진동 타입 옵션 지원 |
| 위치 정보 | `getCurrentLocation`, `useLocation` | 권한 요청 자동 처리 |
| 클립보드 | `getClipboardText`, `setClipboardText` | 읽기/쓰기 |
| 카메라 | `openCamera` | 사진 촬영 |
| 앨범 | `fetchAlbumPhotos` | 앨범 접근 |
| 연락처 | `fetchContacts` | 연락처 접근 |
| 파일 저장 | `saveFile` | 파일 다운로드 |
| Storage | `Storage` | 로컬 저장소 |
| 화면 캡처 차단 | `preventScreenCapture` | 보안 |
| 화면 방향 | `setScreenOrientation` | 가로/세로 |
| 화면 켜짐 | `keepScreenOn` | 항상 켜짐 |
| OG 이미지 | 메타 태그 설정 | 공유 시 미리보기 |
| 쿼리 파라미터 | URL 쿼리 활용 | 화면 간 데이터 전달 |
| Sentry | 에러 모니터링 | 설정 가이드 참조 |
| Firebase | 분석/푸시 | 연동 가이드 참조 |

---

## 3. WebView 속성 제어

WebView 기반 앱에서 토스앱의 WebView 속성을 제어할 수 있다.

```jsx
// NavigationBar, 스와이프 백, Safe Area 등
```

사용 가능한 속성: NavigationBar 표시/숨김, iOS 스와이프 설정, 화면 보임 여부, 화면 복귀 후 코드 실행 등

상세는 `references/sdk-full.md`를 참조한다.

---

## 4. QA & 테스트

### 테스트 환경

| 환경 | 설명 |
|---|---|
| 시뮬레이터 | iOS Simulator / Android Emulator |
| 샌드박스 앱 | 토스 샌드박스 앱 설치 후 테스트 |
| 실기기 | USB 디버깅 연결 |

### QA 진행 순서

1. 로컬 개발 서버에서 시뮬레이터/실기기 테스트
2. 샌드박스 환경에서 SDK 기능 통합 테스트
3. 콘솔에서 QA 빌드 배포 후 내부 테스트

Android 환경설정 (SDK, ADB, 에뮬레이터)과 iOS 환경설정은 `references/sdk-full.md`를 참조한다.

---

## 5. 콘솔 & 배포

### 콘솔에서 앱 등록

앱인토스 개발자 콘솔에서 앱을 등록하고 관리한다.

### mTLS 인증서

API 통신에 필요한 인증서 발급:
1. 콘솔에서 앱 선택
2. 인증서 다운로드 및 보관
3. API 요청 시 인증서 설정

### 심사 & 반려 방지 체크리스트

| 항목 | 확인 사항 |
|---|---|
| UI | TDS 컴포넌트만 사용했는가? (tds-skill 참조) |
| 디자인 | 토스 디자인 가이드라인 준수 (피그마 Mobile UI Kit) |
| 접근성 | aria-label, alt 텍스트 등 접근성 속성 |
| 외부 링크 | 자사 앱 설치/외부 링크 가이드라인 준수 |
| 권한 | 필요한 권한만 최소한으로 요청 |
| 성능 | 로딩 시간, 메모리 사용량 최적화 |
| 결제 | 결제 흐름 정상 동작 확인 |
| 광고 | 광고 가이드라인 준수 |

### 전환 점검

출시 전 최종 전환 점검 항목은 `references/sdk-full.md`의 전환 점검 섹션을 참조한다.

---

## 6. AI 도구 연동

### MCP 서버 (Cursor / Claude Code)

```sh
# 설치 (macOS)
brew tap toss/tap && brew install ax

# Claude Code에서 MCP 연결
claude mcp add --transport stdio apps-in-toss ax mcp start

# Cursor에서 .cursor/mcp.json
{
  "mcpServers": {
    "apps-in-toss": {
      "command": "ax",
      "args": ["mcp", "start"]
    }
  }
}
```

### Apps In Toss Skills (Claude Code Plugin)

```sh
/plugin marketplace add toss/apps-in-toss-skills
/plugin install knowlege-skills@apps-in-toss-skills
```

### 공식 문서 URL

| 유형 | URL |
|---|---|
| 기본 문서 | `https://developers-apps-in-toss.toss.im/llms.txt` |
| 전체 문서 (Full) | `https://developers-apps-in-toss.toss.im/llms-full.txt` |
| 예제 전용 | `https://developers-apps-in-toss.toss.im/tutorials/examples.md` |
| TDS WebView | `https://tossmini-docs.toss.im/tds-mobile/llms-full.txt` |
| TDS React Native | `https://tossmini-docs.toss.im/tds-react-native/llms-full.txt` |

---

## 7. Unity WebGL (게임 앱 전용)

Unity WebGL 앱은 Vite로 감싸서 배포한다.

1. Vite 프로젝트 생성
2. 앱인토스 SDK 설치
3. Unity WebGL 빌드 결과물 복사
4. 앱인토스 배포환경 구성
5. 정적 사이트 빌드 및 배포

관련 가이드: Addressable, AssetBundle, AutoStreaming, EmscriptenGLX, 커스텀 로딩 화면, 파티클 최적화, 해상도 설정, 메모리 최적화, 런타임 성능 최적화, 디버깅/예외 처리, 게임 시작 속도 향상, 첫 씬 시작 최적화

상세는 `references/sdk-full.md`를 참조한다.

---

## 참조 문서 안내

이 SKILL.md는 전체 파이프라인의 요약이다. 각 기능의 정확한 시그니처, 파라미터, 이벤트 타입, 에러 처리 등은 아래 reference에서 확인한다.

| 파일 | 내용 |
|---|---|
| `references/sdk-full.md` | 앱인토스 SDK 전체 API 레퍼런스 (60,000줄+) |
| tds-skill | TDS 컴포넌트 사용법 (별도 스킬로 분리) |

Claude는 SDK API의 정확한 시그니처나 옵션이 필요할 때 반드시 `references/sdk-full.md`를 읽어야 한다.

---

## 빠른 시작 체크리스트

새 미니앱 프로젝트를 시작할 때 이 순서를 따른다:

1. [ ] 프로젝트 타입 결정 (WebView / React Native / Unity)
2. [ ] 프로젝트 scaffolding (`create-app` 또는 `create-rn-app`)
3. [ ] TDS Provider 설정 (tds-skill 참조)
4. [ ] bedrock.config.ts 설정 (primaryColor 등)
5. [ ] 페이지/화면 라우팅 구성
6. [ ] SDK 기능 연동 (광고, 결제, 공유 등 필요한 것)
7. [ ] 테스트 환경 구성 (시뮬레이터/샌드박스)
8. [ ] QA 진행
9. [ ] 콘솔에 앱 등록 & 심사 제출
10. [ ] 출시
