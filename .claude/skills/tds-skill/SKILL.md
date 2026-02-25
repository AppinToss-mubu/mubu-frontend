---
name: tds-skill
description: >-
  토스 디자인 시스템(TDS) 스킬. 토스 앱인토스(Apps in Toss) 미니앱 UI를 구현할 때 사용한다.
  WebView 기반(@toss/tds-mobile)과 React Native 기반(@toss/tds-react-native) 두 가지 변형을 모두 지원하며,
  프로젝트 타입에 따라 올바른 패키지·Provider·컴포넌트를 자동으로 선택한다.
  미니앱 UI, 토스 컴포넌트, TDS, 디자인 시스템, Button, ListRow, Toast, BottomSheet,
  BottomCTA, AgreementV4, Asset, Typography, Colors 등이 언급되면 반드시 이 스킬을 참조할 것.
  토스 심사 반려를 방지하기 위해 TDS 컴포넌트 사용을 강제한다.
---

# TDS (Toss Design System) Skill

토스 미니앱의 UI는 반드시 TDS 컴포넌트로 구현해야 한다. 커스텀 CSS나 외부 UI 라이브러리를 사용하면 토스 심사에서 반려될 수 있다.

## 프로젝트 타입 분기

작업 시작 전 반드시 프로젝트 타입을 확인하고, 해당하는 references 파일만 참조한다.

| 프로젝트 타입 | 참조 파일 | 대상 앱 예시 |
|---|---|---|
| WebView (웹뷰) | `references/tds-mobile.md` | mubu 등 웹 기반 미니앱 |
| React Native | `references/tds-react-native.md` | 애니핏 등 RN 기반 미니앱 |

프로젝트 타입 판별 기준:
- `package.json`에 `@toss/tds-mobile`이 있으면 → WebView
- `package.json`에 `@toss/tds-react-native`이 있으면 → React Native
- 신규 프로젝트이고 사용자가 명시하지 않으면 → 사용자에게 질문

---

## WebView 기반 (tds-mobile)

### 설치

```sh
npm install @toss/tds-mobile @toss/tds-mobile-ait @emotion/react@^11 react@^18 react-dom@^18
```

### Provider 설정 (필수)

앱 최상위에 `TDSMobileAITProvider`를 반드시 감싼다. 없으면 TDS 컴포넌트가 동작하지 않는다.

```jsx
import { TDSMobileAITProvider } from '@toss/tds-mobile-ait';

function App({ Component, pageProps }) {
  return (
    <TDSMobileAITProvider>
      <Component {...pageProps} />
    </TDSMobileAITProvider>
  );
}
```

### 주요 패키지 매핑 (최신)

구버전 패키지를 절대 사용하지 않는다.

| 사용금지 (구버전) | 사용할 것 (최신) |
|---|---|
| `@toss-design-system/mobile` | `@toss/tds-mobile` (v2) |
| `@toss-design-system/mobile-bedrock` | `@toss/tds-mobile-ait` |
| `@toss-design-system/colors` | `@toss/tds-colors` |
| `TDSMobileBedrockProvider` | `TDSMobileAITProvider` |

### v2 주요 prop 변경 (실수 방지)

v1 API를 사용하면 런타임 에러가 발생한다.

| 컴포넌트 | 변경 전 (v1) | 변경 후 (v2) |
|---|---|---|
| Button | `type="primary"` | `color="primary"` |
| Button | `style="filled"` | `variant="filled"` |
| Button | `htmlStyle={...}` | `style={...}` |
| Button | `size="tiny"` / `"big"` | `size="small"` / `"xlarge"` |
| Badge | `type` / `style` | `color` / `variant` |
| TextButton | `typography="t6"` | `size="small"` |
| Top | `subtitle1` / `subtitle2` | `subtitleTop` / `subtitleBottom` |
| BottomCTA | `TypeA` / `TypeB` | `Single` / `Double` |
| ListRow | `verticalPadding` 값 변경 | 공식 문서 참고 |

### 핵심 컴포넌트 카탈로그

상세한 props와 예제는 `references/tds-mobile.md`를 참조한다.

**레이아웃**: Flex, Stack, Spacing, Safe Area, ScrollViewInertialBackground
**텍스트/타이포**: Typography (t1~t7, st1~st13), Colors
**버튼**: Button, TextButton, IconButton
**리스트**: ListRow, ListHeader, BoardRow, TableRow
**입력**: TextField, Checkbox, SegmentedControl, Rating
**피드백**: Toast, AlertDialog, ConfirmDialog, BottomSheet
**네비게이션**: Top, BottomCTA (Single/Double), FixedBottomCTA
**동의**: AgreementV4 (Checkbox, Collapsible, IndentPushable, Group)
**미디어**: Asset (Icon, Image, Video, Lottie), BlurView
**콘텐츠**: Post (H1~H4, Paragraph, Ol, Ul, Li, Hr), Result
**기타**: Badge, Overlay, KeyboardAboveView

---

## React Native 기반 (tds-react-native)

### 설치

```sh
npm install @toss/tds-react-native @toss/tds-colors
```

### 주요 패키지 매핑 (최신)

| 사용금지 (구버전) | 사용할 것 (최신) |
|---|---|
| `@toss-design-system/react-native` | `@toss/tds-react-native` (v1) |
| `@toss-design-system/colors` | `@toss/tds-colors` |

### 핵심 컴포넌트 카탈로그

상세한 props와 예제는 `references/tds-react-native.md`를 참조한다.

**금액 표시**: AmountTop (title, subTitle, button)
**텍스트/타이포**: Typography (t1~t7, st1~st13), Txt 컴포넌트
**색상**: colors 객체 (blue500, grey600, grey900 등), 배경 색상
**버튼**: Button, TextButton (variant: clear/arrow/underline)
**리스트**: TableRow (align, leftRatio, left, right)
**콘텐츠**: Post (H1~H4, Paragraph, Ol, Ul, Li, Hr)
**피드백**: Toast (text, icon, position, duration, button)

### Typography 규칙

- Typography 토큰은 계층 구조를 가진다 (t1이 가장 크고, t7이 가장 작다)
- 절대로 폰트 크기를 하드코딩하지 않는다 — 더 큰 텍스트 모드에서 깨진다
- iOS/Android/Web 간 크기 차이는 TDS가 자동 처리한다

### Colors 사용법

```jsx
import { colors } from '@toss/tds-colors';
<View style={{ backgroundColor: colors.blue500 }} />
```

---

## 공통 규칙 (WebView & React Native 모두 적용)

### 절대 하지 말 것 (토스 심사 반려 사유)

1. TDS 컴포넌트 대신 커스텀 UI 사용 (자체 Button, Modal 등)
2. 구버전 패키지(`@toss-design-system/*`) import
3. Typography 값 하드코딩 (fontSize: 16 등)
4. TDSMobileAITProvider 누락
5. 토스 색상 시스템 무시 (임의 색상값 사용)

### 접근성 필수사항

- Checkbox에는 반드시 `aria-label` 제공 (단, "체크박스"라는 단어는 넣지 않는다)
- Button에는 의미 있는 텍스트 또는 `aria-label` 제공
- 이미지에는 `alt` 텍스트 제공

### 마이그레이션 CLI

기존 프로젝트의 구버전 패키지를 자동 변환할 때:

```sh
# import path 자동 변환
npx tds-migrate imports --path "src/**/*.{ts,tsx}"
# package.json 자동 변환
npx tds-migrate deps --path "**/package.json"
# 한번에 전체 변환
npx tds-migrate all --path "."
# 변경 전 미리보기
npx tds-migrate all --path "." --dry-run
```

---

## 참조 문서 안내

이 SKILL.md에서 다루지 못한 상세 props, 인터페이스, 예제 코드는 아래 reference 파일에서 확인한다.

| 파일 | 내용 |
|---|---|
| `references/tds-mobile.md` | WebView 전체 컴포넌트 상세 (props, 예제, 접근성) |
| `references/tds-react-native.md` | React Native 전체 컴포넌트 상세 (props, 예제) |

Claude는 컴포넌트의 정확한 props나 사용 예제가 필요할 때 해당 reference 파일을 읽어야 한다.
