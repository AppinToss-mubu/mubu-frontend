# TOSS 통합 가이드

> **목적**: 앱인토스(Apps in Toss) 플랫폼과 TDS(Toss Design System) 통합을 위한 종합 가이드
> **최종 업데이트**: 2025-01-28

---

## 📋 목차

1. [앱인토스 개요](#앱인토스-개요)
2. [앱인토스 개발 환경](#앱인토스-개발-환경)
3. [Toss SDK 통합](#toss-sdk-통합)
4. [TDS Mobile 적용](#tds-mobile-적용)
5. [주요 기능별 가이드](#주요-기능별-가이드)
6. [QA 체크리스트](#qa-체크리스트)
7. [현재 프로젝트 상태](#현재-프로젝트-상태)

---

## 앱인토스 개요

### 앱인토스란?

**앱인토스(Apps in Toss)**는 파트너사가 개발한 서비스를 토스 앱 내부에서 '앱인앱(App-in-App)' 형태로 노출할 수 있게 하는 플랫폼입니다.

### 주요 특징

- **3,000만 누적 토스 사용자**에게 서비스 노출 가능
- **WebView** 또는 **React Native** 기반 개발 지원
- **토스 SDK와 API** 제공으로 로그인·결제·인증 등 핵심 기능 빠른 적용
- **토스 홈 탭**에 자동 노출 및 키워드 검색 지원
- **푸시 알림, 토스 홈 광고, 프로모션** 등 마케팅 도구 제공

### 제공되는 솔루션

1. **기술 인프라**
   - WebView / React Native SDK
   - TDS (Toss Design System) 컴포넌트
   - 토스 로그인, 결제, 인증 API

2. **노출 및 트래픽**
   - 토스 홈 탭 노출
   - 키워드 검색 지원
   - 푸시 알림 발송
   - 토스 홈 광고

3. **수익화 모델**
   - 프로모션 (토스 포인트)
   - 인앱 결제
   - 리워드 광고

---

## 앱인토스 개발 환경

### 개발 방식 선택

#### 1. WebView 기반
- **장점**: 웹 기술 스택 그대로 사용 가능 (React, Vue 등)
- **빌드**: 웹 빌드 결과물을 업로드
- **현재 프로젝트**: WebView 방식 사용 중

#### 2. React Native 기반
- **장점**: 네이티브 성능, 더 많은 SDK 기능 활용 가능
- **빌드**: React Native 빌드 결과물 업로드

### 개발 서버 연결

#### 로컬 개발 서버
- Metro 서버 실행 (React Native)
- Vite/Webpack 개발 서버 (WebView)
- 샌드박스 앱에서 로컬 서버 연결 가능

#### 샌드박스 앱
- **목적**: 개발 및 테스트용 앱
- **설치**: iOS/Android 샌드박스 앱 설치
- **기능**: 로컬 서버 연결, 디버깅, 로그 확인

### 테스트 환경

#### 1. 샌드박스 앱 테스트
- 로컬 개발 서버 연결
- 실기기 권장 (네트워크 온/오프, 포그라운드↔백그라운드 전환 테스트)

#### 2. 토스 앱 테스트
- 앱 번들 생성 및 업로드
- QR 코드 스캔으로 테스트
- 피처 테스트 (특정 기능만 테스트)

---

## Toss SDK 통합

### SDK 구조

#### Granite 프레임워크 (Bedrock)
- 앱인토스의 핵심 프레임워크
- 환경 변수 설정, 공통 설정 제공
- 이벤트 제어, 화면 이동, 내비게이션 바 설정

#### 주요 SDK 기능

1. **토스 로그인**
   - `appLogin()`: 토스 로그인 실행
   - `getIsTossLoginIntegratedService()`: 로그인 연동 확인
   - 사용자 정보 조회 (`x-toss-user-key` 헤더)

2. **카메라 & 앨범**
   - `camera.open()`: 카메라 촬영
   - `album.photos()`: 앨범에서 사진 선택
   - 현재 프로젝트: `useToss` 훅으로 래핑

3. **브라우저**
   - `browser.open(url)`: 토스 앱 내 브라우저로 열기
   - 외부 링크 열 때 사용

4. **저장소**
   - `setItem(key, value)`: 값 저장
   - `getItem(key)`: 값 읽기
   - `removeItem(key)`: 값 삭제
   - `clearItems()`: 모든 항목 삭제

5. **공유**
   - `share.text()`: 텍스트 공유
   - `share.link()`: 링크 공유
   - 친구초대 리워드 연동 가능

### 현재 프로젝트 통합 상태

#### ✅ 구현 완료
- **환경 감지**: `src/utils/env.ts`
  - `isTossEnvironment()`: `window.Toss` 존재 여부 확인
  - `getEnvironment()`: "toss" | "web" 반환

- **Toss SDK 래퍼**: `src/hooks/useToss.ts`
  - `openCamera()`: Toss 카메라 API 호출 → File 객체 변환
  - `openBrowser()`: Toss 브라우저로 외부 링크 열기
  - 폴백 처리: Toss 미지원 환경에서 일반 웹 API 사용

#### ⚠️ 미구현 (향후 작업)
- 토스 로그인 연동
- 저장소 API 활용
- 공유 기능
- 프로모션 (토스 포인트)
- 인앱 결제

---

## TDS Mobile 적용

### TDS란?

**TDS (Toss Design System)**는 토스 제품을 만들 때 공통적으로 사용하는 디자인 시스템입니다.

- **수백 개의 컴포넌트와 템플릿** 제공
- **일관된 UI/UX** 보장
- **생산성 향상**: 재사용 가능한 컴포넌트로 빠른 개발

### TDS Mobile 설치

```bash
npm install @toss/tds-mobile @toss/tds-mobile-ait @emotion/react@^11 react@^18 react-dom@^18
```

### Provider 설정

```tsx
import { TDSMobileAITProvider } from '@toss/tds-mobile-ait';

function App({ Component, pageProps }) {
  return (
    <TDSMobileAITProvider>
      <Component {...pageProps} />
    </TDSMobileAITProvider>
  );
}
```

### 주요 컴포넌트

#### 1. Top (상단 헤더)
- 메인 제목, 부제목 표시
- 뒤로가기 버튼 등 내비게이션 요소

#### 2. Button
- 기본 버튼 컴포넌트
- 다양한 스타일 및 크기 지원

#### 3. Toast
- 알림 메시지 표시
- 상단/하단 위치 설정 가능
- 아이콘, 로티 애니메이션 지원

#### 4. BottomCTA
- 하단 고정 CTA 버튼
- 플로팅 형태 지원

### 현재 프로젝트 상태

#### ⚠️ 미적용
- TDS Mobile 패키지 미설치
- 현재는 커스텀 스타일로 구현
- **향후 작업**: TDS 컴포넌트로 교체 필요

---

## 주요 기능별 가이드

### 1. 토스 로그인

#### API 엔드포인트
- BaseURL: `https://apps-in-toss-api.toss.im`
- 인증: `x-toss-user-key` 헤더 필요

#### 주요 API
- `POST /api-partner/v1/apps-in-toss/oauth2/token`: 액세스 토큰 발급
- `GET /api-partner/v1/apps-in-toss/login/me`: 사용자 정보 조회
- `DELETE /api-partner/v1/apps-in-toss/oauth2/remove`: 로그아웃

#### SDK 사용법
```typescript
import { appLogin } from '@toss/bedrock';

const result = await appLogin();
// result.userKey: 사용자 식별자
```

### 2. 카메라 & 앨범

#### SDK 사용법
```typescript
// 카메라
const result = await Toss.camera.open();

// 앨범
const photos = await Toss.album.photos();
```

#### 현재 프로젝트 구현
- `useToss` 훅으로 래핑
- Toss 환경: SDK 사용
- 일반 웹: 파일 input 폴백

### 3. 브라우저

#### SDK 사용법
```typescript
Toss.browser.open(url);
```

#### 현재 프로젝트 구현
- `ExternalLink` 컴포넌트에서 사용
- 네이버 쇼핑 링크 열 때 활용

### 4. 프로모션 (토스 포인트)

#### 플로우
1. `get-key`: 프로모션 키 발급
2. `execute-promotion`: 프로모션 실행
3. `execution-result`: 실행 결과 확인

#### API 엔드포인트
- `POST /api-partner/v1/apps-in-toss/promotion/get-key`
- `POST /api-partner/v1/apps-in-toss/promotion/execute`
- `GET /api-partner/v1/apps-in-toss/promotion/execution-result`

#### 주의사항
- KEY 유효시간: 1시간
- 중복 지급 방지 필수
- 예산 소진, 종료일 경과 체크 필요

### 5. 푸시 알림

#### API 엔드포인트
- `POST /api-partner/v1/apps-in-toss/messenger/send-message`

#### 요청 형식
```json
{
  "templateSetCode": "템플릿 코드",
  "context": {
    "변수명": "값"
  }
}
```

#### 응답 형식
```json
{
  "resultType": "SUCCESS",
  "result": {
    "msgCount": 1,
    "sentPushCount": 1,
    "sentInboxCount": 0
  }
}
```

### 6. 인앱 결제

#### SDK 사용법
```typescript
import { createOneTimePurchaseOrder } from '@toss/bedrock';

const order = await createOneTimePurchaseOrder({
  productId: "상품ID"
});
```

---

## QA 체크리스트

### 공통 체크리스트

#### 사전 체크
- [ ] 계약/템플릿 승인 완료
- [ ] mTLS 적용 완료
- [ ] 테스트 계정 `x-toss-user-key` 준비

#### 안정성
- [ ] 포그라운드↔백그라운드 전환 시 상태 유지
- [ ] 가로/세로 회전 시 UI 깨짐 없음
- [ ] 메모리/CPU 급증, 크래시 없음
- [ ] 네트워크 장애 시 재시도 로직 동작

#### 에러 처리
- [ ] 타임아웃/5xx 시 지수 백오프 재시도
- [ ] 사용자 친화적 에러 메시지 표시
- [ ] 중복 요청 방지 (멱등 처리)

### 토스 로그인 QA

- [ ] 최초 진입 시 로그인 모달 노출
- [ ] 로그인 완료 후 사용자 정보 조회 성공
- [ ] 재접속 시 로그인 상태 유지
- [ ] 로그아웃 시 데이터 초기화

### 카메라/앨범 QA

- [ ] Toss 환경에서 카메라 촬영 정상 동작
- [ ] 앨범에서 사진 선택 정상 동작
- [ ] 일반 웹 환경에서 파일 업로드 폴백 동작
- [ ] 이미지 크기 제한 (10MB) 체크

### 프로모션 QA

- [ ] `get-key → execute-promotion → execution-result` 순서 정상
- [ ] 중복 지급 방지 (빠른 연속 클릭 차단)
- [ ] KEY 유효시간 (1시간) 만료 시 재시도
- [ ] 예산 소진 시 지급 차단
- [ ] 종료일 경과 시 지급 차단

### 푸시 알림 QA

- [ ] 템플릿 변수 정확히 치환
- [ ] 제목 13자, 본문 20자 권장 준수
- [ ] 수신 해제 경로 제공
- [ ] 발송 결과 응답 확인 (`msgCount`, `sentPush`, `sentInbox`)
- [ ] 중복 발송 방지 (멱등 처리, 쿨다운)

---

## 현재 프로젝트 상태

### ✅ 완료된 통합

1. **환경 감지**
   - `isTossEnvironment()` 구현
   - Toss/Web 환경 분기 처리

2. **Toss SDK 기본 통합**
   - `useToss` 훅 구현
   - 카메라 API 래핑
   - 브라우저 API 래핑
   - 폴백 처리 (일반 웹 환경)

3. **이미지 업로드**
   - Toss 카메라 / 일반 파일 업로드 분기
   - `ImageSourceSheet` 컴포넌트로 소스 선택

### ⚠️ 미구현 기능 (향후 작업)

1. **TDS Mobile 적용**
   - TDS 컴포넌트 설치 및 적용
   - 현재 커스텀 스타일 → TDS 컴포넌트로 교체

2. **토스 로그인**
   - `appLogin()` SDK 연동
   - 사용자 정보 조회 API 연동
   - 로그인 상태 관리

3. **프로모션 (토스 포인트)**
   - 프로모션 API 연동
   - 혜택탭 노출
   - 중복 지급 방지 로직

4. **푸시 알림**
   - 템플릿 등록
   - 메시지 발송 API 연동
   - 수신 해제 기능

5. **인앱 결제**
   - 상품 목록 조회
   - 결제 주문 생성
   - 결제 완료 처리

### 📝 다음 단계 작업 순서

1. **TDS Mobile 설치 및 적용** (우선순위 높음)
   - 패키지 설치
   - Provider 설정
   - 주요 컴포넌트 교체 (Button, Toast 등)

2. **토스 로그인 연동** (선택사항)
   - 사용자 인증이 필요한 경우에만

3. **프로모션 연동** (선택사항)
   - 리워드 제공이 필요한 경우

4. **푸시 알림 연동** (선택사항)
   - 사용자 재방문 유도가 필요한 경우

---

## 참고 자료

### 공식 문서
- [앱인토스 개발자센터](https://developers-apps-in-toss.toss.im/)
- [TDS Mobile 문서](https://tossmini-docs.toss.im/tds-mobile/)
- [Bedrock 프레임워크 레퍼런스](https://developers-apps-in-toss.toss.im/bedrock/reference/)

### 주요 링크
- WebView 튜토리얼: `/tutorials/webview.md`
- React Native 튜토리얼: `/tutorials/react-native.md`
- 샌드박스 앱 가이드: `/development/test/sandbox.md`
- 토스 앱 테스트: `/development/test/toss.md`

---

## 주의사항

### CORS 설정
- 백엔드 `WebConfig.java`에 Replit 도메인 추가 필요
- `https://*.replit.dev`, `https://*.repl.co` 허용

### 환경 변수
- `.env.development`: 로컬 개발용
- `.env.production`: 배포용 (주석 처리됨)
- Git에 커밋하지 않도록 `.gitignore` 설정 완료

### 빌드 및 배포
- WebView 방식: Vite 빌드 결과물 업로드
- React Native 방식: Metro 빌드 결과물 업로드
- 앱 번들 생성 후 QR 코드로 테스트

---

**마지막 업데이트**: 2025-01-28
**작성자**: AI Assistant
**프로젝트**: MUBU 가격 비교 앱
