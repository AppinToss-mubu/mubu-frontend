# 프론트엔드 개발 기준 가이드

> **목적**: Toss MiniApp과 일반 웹 환경 모두에서 동작하는 프론트엔드 개발 기준 정리
> **최종 업데이트**: 2025-01-XX

### 백엔드 상태 (업데이트)

- CORS: `WebConfig`에서 `allowedOriginPatterns`로 로컬 + Toss 도메인 허용 완료
- 환율: Frankfurter 실시간 환율 연동 완료 (`ExchangeRateService`)
- 이미지 크기: `application.yml`에 10MB 제한 설정
- imageId 만료: `PriceCompareResultStore`에서 30분 만료 처리 및 에러 메시지 반환

프론트 유의 사항:
- 환율 변환은 항상 백엔드에서 처리, `priceSource`만 명시해 전송
- 업로드 전 10MB 사전 검증 권장

---

## 📋 목차

1. [전체 아키텍처](#전체-아키텍처)
2. [환경별 기능 분기](#환경별-기능-분기)
3. [상태 관리 전략](#상태-관리-전략)
4. [라우팅 구조](#라우팅-구조)
5. [백엔드 API 연동](#백엔드-api-연동)
6. [Toss SDK 통합](#toss-sdk-통합)
7. [개발 체크리스트](#개발-체크리스트)

---

## 전체 아키텍처

### 기술 스택

```
React 19 + TypeScript + Vite
├── 상태 관리
│   ├── @tanstack/react-query (서버 상태)
│   └── zustand (UI 상태)
├── 라우팅
│   └── react-router-dom
└── Toss SDK
    └── window.Toss (런타임 감지)
```

### 프로젝트 구조

```
src/
├── api/              # API 클라이언트
│   ├── price.ts      # 가격 비교 API
│   └── types.ts      # API 타입 정의
├── hooks/            # 커스텀 훅
│   ├── useToss.ts    # Toss SDK 래퍼
│   └── usePriceCompare.ts
├── store/            # Zustand 스토어
│   ├── priceStore.ts # 가격 비교 UI 상태
│   └── envStore.ts   # 환경 감지 상태
├── pages/            # 페이지 컴포넌트
│   ├── Home.tsx      # 메인 (이미지 업로드)
│   ├── Result.tsx    # 결과 페이지 (/result/:imageId)
│   └── NotFound.tsx
├── components/       # 공통 컴포넌트
│   ├── ImageUpload.tsx
│   ├── PriceInput.tsx
│   └── SummaryCard.tsx
└── utils/            # 유틸리티
    └── env.ts        # 환경 감지
```

---

## 환경별 기능 분기

### 핵심 원칙

> **"Toss 환경에서만 가능한 기능은 분기 처리, 공통 기능은 동일하게 동작"**

### 환경 감지

```typescript
// src/utils/env.ts
export const isTossEnvironment = (): boolean => {
  return (
    typeof window !== "undefined" && typeof (window as any).Toss !== "undefined"
  );
};

export const getEnvironment = (): "toss" | "web" => {
  return isTossEnvironment() ? "toss" : "web";
};
```

### 기능별 분기 매트릭스

| 기능           | Toss 환경          | 일반 웹 환경 | 구현 위치                     |
| -------------- | ------------------ | ------------ | ----------------------------- |
| 이미지 촬영    | Toss 카메라 API    | 파일 업로드  | `components/ImageUpload.tsx`  |
| 이미지 업로드  | 동일 API           | 동일 API     | `api/price.ts`                |
| 가격 입력      | Toss 키보드 (선택) | 일반 input   | `components/PriceInput.tsx`   |
| 결과 표시      | 동일 UI            | 동일 UI      | `pages/Result.tsx`            |
| 외부 링크 열기 | Toss 브라우저      | 새 창        | `components/ExternalLink.tsx` |

---

## 상태 관리 전략

### 역할 분리

#### 1. React Query (서버 상태)

```typescript
// 서버에서 가져오는 데이터
- compare-with-image 응답
- summary 응답
- external link
```

**사용 예시:**

```typescript
// src/hooks/usePriceCompare.ts
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCompareWithImage = () => {
  return useMutation({
    mutationFn: (file: File) => compareWithImageAPI(file),
  });
};

export const useSummary = (imageId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["summary", imageId],
    queryFn: () => getSummaryAPI(imageId),
    enabled,
  });
};
```

#### 2. Zustand (UI 상태)

```typescript
// 클라이언트에서만 관리하는 상태
- imageId (라우팅 파라미터와 동기화)
- localPrice (사용자 입력)
- currency (선택된 통화)
- priceSource ('AI' | 'USER')
```

**사용 예시:**

```typescript
// src/store/priceStore.ts
import { create } from "zustand";

interface PriceStore {
  imageId: string | null;
  localPrice: number | null;
  currency: string;
  priceSource: "AI" | "USER";
  setImageId: (id: string) => void;
  setLocalPrice: (price: number) => void;
  setCurrency: (currency: string) => void;
  setPriceSource: (source: "AI" | "USER") => void;
}

export const usePriceStore = create<PriceStore>((set) => ({
  imageId: null,
  localPrice: null,
  currency: "JPY",
  priceSource: "USER",
  setImageId: (id) => set({ imageId: id }),
  setLocalPrice: (price) => set({ localPrice: price }),
  setCurrency: (currency) => set({ currency }),
  setPriceSource: (source) => set({ priceSource: source }),
}));
```

---

## 라우팅 구조

### 라우트 정의

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/result/:imageId" element={<Result />} />
  <Route path="*" element={<NotFound />} />
</Routes>;
```

### 플로우 다이어그램

```
[1] Home 페이지
    ↓
    이미지 업로드 (Toss 카메라 or 파일 선택)
    ↓
[2] POST /api/price/compare-with-image
    ↓
    응답: { imageId, aiText, productName, lowestPrice, ... }
    ↓
[3] navigate(`/result/${imageId}`)
    ↓
[4] Result 페이지
    ↓
    현지 가격 입력 (localPrice + currency)
    ↓
[5] POST /api/price/result/summary
    Body: { imageId, localPrice, currency, priceSource }
    ↓
    응답: { summary, savedAmount, localPriceKrw, koreaPrice }
    ↓
[6] 요약 표시 + 외부 링크 버튼
    ↓
[7] GET /api/price/external/link?productName=...
    ↓
    네이버 쇼핑 링크 열기
```

---

## 백엔드 API 연동

### API 엔드포인트 정리

#### 1. 이미지 기반 가격 비교

```typescript
POST /api/price/compare-with-image
Content-Type: multipart/form-data

Request:
  file: File

Response:
{
  imageId: string;
  aiText: string;
  productName: string;
  lowestPrice: number;
  mallName: string;
  link: string;
  image: string;
}
```

#### 2. 결과 요약

```typescript
POST /api/price/result/summary
Content-Type: application/json

Request:
{
  imageId: string;
  localPrice: number;
  currency: string;  // 'JPY', 'USD', 'CNY', etc.
  priceSource: 'AI' | 'USER';
}

Response:
{
  summary: string;        // "한국에서 사면 8,200원 절약!"
  savedAmount: number;    // 절약 금액 (KRW)
  localPriceKrw: number; // 현지 가격 환산 (KRW)
  koreaPrice: number;    // 한국 최저가
}
```

#### 3. 외부 쇼핑 링크

```typescript
GET /api/price/external/link?productName={productName}

Response: string (URL)
```

### API 클라이언트 구현

```typescript
// src/api/price.ts
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const compareWithImageAPI = async (
  file: File
): Promise<PriceCompareResult> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/price/compare-with-image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("가격 비교 실패");
  }

  return response.json();
};

export const getSummaryAPI = async (
  imageId: string,
  localPrice: number,
  currency: string,
  priceSource: "AI" | "USER"
): Promise<PriceCompareSummaryResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/price/result/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageId, localPrice, currency, priceSource }),
  });

  if (!response.ok) {
    throw new Error("요약 생성 실패");
  }

  return response.json();
};

export const getExternalLinkAPI = async (
  productName: string
): Promise<string> => {
  const response = await fetch(
    `${API_BASE_URL}/api/price/external/link?productName=${encodeURIComponent(
      productName
    )}`
  );

  if (!response.ok) {
    throw new Error("링크 조회 실패");
  }

  return response.text();
};
```

---

## Toss SDK 통합

### 원칙

> **"Toss SDK는 런타임에만 감지하고, 타입 시스템에 강하게 결합하지 않는다"**

### Toss SDK 래퍼

```typescript
// src/hooks/useToss.ts
export const useToss = () => {
  const isAvailable =
    typeof window !== "undefined" &&
    typeof (window as any).Toss !== "undefined";

  const openCamera = async (): Promise<File | null> => {
    if (!isAvailable) {
      return null;
    }

    try {
      const Toss = (window as any).Toss;
      const result = await Toss.camera.open({
        // Toss SDK 옵션
      });

      // Toss 응답을 File 객체로 변환
      return convertTossImageToFile(result);
    } catch (error) {
      console.error("Toss 카메라 오픈 실패:", error);
      return null;
    }
  };

  const openBrowser = (url: string) => {
    if (!isAvailable) {
      window.open(url, "_blank");
      return;
    }

    const Toss = (window as any).Toss;
    Toss.browser.open(url);
  };

  return {
    isAvailable,
    openCamera,
    openBrowser,
  };
};
```

### 이미지 업로드 컴포넌트

```typescript
// src/components/ImageUpload.tsx
import { useToss } from "../hooks/useToss";

export const ImageUpload = () => {
  const { isAvailable, openCamera } = useToss();
  const [file, setFile] = useState<File | null>(null);

  const handleTossCamera = async () => {
    const result = await openCamera();
    if (result) {
      setFile(result);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div>
      {isAvailable ? (
        <button onClick={handleTossCamera}>카메라로 촬영</button>
      ) : (
        <input type="file" accept="image/*" onChange={handleFileSelect} />
      )}
    </div>
  );
};
```

---

## 개발 체크리스트

### 필수 구현 항목

#### 1. 환경 감지

- [ ] `utils/env.ts` - Toss 환경 감지 함수
- [ ] `hooks/useToss.ts` - Toss SDK 래퍼 훅
- [ ] 모든 Toss 전용 기능에 분기 처리

#### 2. 상태 관리

- [ ] `@tanstack/react-query` 설치 및 설정
- [ ] `zustand` 설치 및 설정
- [ ] `store/priceStore.ts` - UI 상태 스토어
- [ ] `hooks/usePriceCompare.ts` - API 훅

#### 3. API 연동

- [ ] `api/price.ts` - API 클라이언트 함수
- [ ] `api/types.ts` - API 타입 정의
- [ ] 에러 핸들링 구현

#### 4. 라우팅

- [ ] `react-router-dom` 설치 및 설정
- [ ] `/` - Home 페이지
- [ ] `/result/:imageId` - Result 페이지
- [ ] 404 페이지

#### 5. 컴포넌트

- [ ] `ImageUpload.tsx` - 환경별 이미지 업로드
- [ ] `PriceInput.tsx` - 가격 입력 (환경별 분기)
- [ ] `SummaryCard.tsx` - 요약 표시
- [ ] `ExternalLink.tsx` - 외부 링크 열기

#### 6. 페이지

- [ ] `Home.tsx` - 메인 페이지
- [ ] `Result.tsx` - 결과 페이지
- [ ] `NotFound.tsx` - 404 페이지

### 검증 체크리스트

#### Toss 환경

- [ ] Toss 카메라로 이미지 촬영 가능
- [ ] 촬영한 이미지로 가격 비교 API 호출 성공
- [ ] 결과 페이지에서 가격 입력 가능
- [ ] 요약 API 호출 성공
- [ ] 외부 링크가 Toss 브라우저로 열림

#### 일반 웹 환경

- [ ] 파일 업로드로 이미지 선택 가능
- [ ] 선택한 이미지로 가격 비교 API 호출 성공
- [ ] 결과 페이지에서 가격 입력 가능
- [ ] 요약 API 호출 성공
- [ ] 외부 링크가 새 창으로 열림

#### 공통

- [ ] 모든 API 호출 에러 핸들링
- [ ] 로딩 상태 표시
- [ ] 빈 값 처리 (imageId 없음, 가격 없음 등)
- [ ] 반응형 디자인 (모바일/데스크톱)

---

## 백엔드 연동 검증

### API 호출 순서 검증

```
✅ [1] POST /api/price/compare-with-image
   → imageId 반환 확인

✅ [2] POST /api/price/result/summary
   → imageId로 기존 결과 조회 가능 확인
   → 환율 변환 정확도 확인

✅ [3] GET /api/price/external/link
   → productName으로 링크 반환 확인
```

### 백엔드 누락 체크

#### ⚠️ 발견된 누락 사항

1. **CORS 설정 누락** ❌

   - 현재 상태: CORS 설정이 없음
   - 영향: 프론트엔드에서 API 호출 시 CORS 에러 발생 가능
   - 해결 필요: `@CrossOrigin` 또는 `WebMvcConfigurer` 설정 추가
   - 우선순위: **높음** (프론트 개발 시작 전 필수)

2. **환율 서비스 제한** ⚠️

   - 현재 상태: 고정 환율만 지원 (JPY, USD만)
   - 코드 위치: `ExchangeRateService.java`
   - 지원 통화: JPY (0.92), USD (1350)
   - 미지원 통화: CNY, EUR 등
   - 해결 필요: 실제 환율 API 연동 또는 추가 통화 지원
   - 우선순위: **중간** (초기에는 JPY/USD만 사용 가능)

3. **에러 응답 형식** ✅

   - 현재 상태: `ApiErrorResponse`로 통일됨
   - 형식: `{ "message": "에러 메시지" }`
   - 프론트에서 파싱 가능: ✅

4. **이미지 크기 제한** ❓

   - 현재 상태: 명시적 제한 없음
   - 확인 필요: Spring Boot 기본 제한 확인
   - 권장: 프론트에서 사전 검증 (예: 10MB 이하)

5. **imageId 유효기간** ❓
   - 현재 상태: `PriceCompareResultStore` (In-memory)
   - 확인 필요: 저장 기간 및 만료 처리
   - 권장: 만료된 imageId에 대한 명확한 에러 응답

#### 백엔드 수정 필요 사항

##### 1. CORS 설정 추가 (필수)

```java
// src/main/java/com/example/mubu/config/WebConfig.java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "http://localhost:5173",  // Vite 기본 포트
                    "https://your-frontend-domain.com"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

또는 컨트롤러 레벨:

```java
@CrossOrigin(origins = {"http://localhost:5173", "https://your-frontend-domain.com"})
@RestController
@RequestMapping("/api/price")
public class PriceCompareController {
    // ...
}
```

##### 2. 환율 서비스 확장 (선택)

```java
// ExchangeRateService.java에 추가
case "CNY" -> (int) (amount * 190);
case "EUR" -> (int) (amount * 1450);
// 등등...
```

또는 실제 환율 API 연동 (예: 한국은행 API, ExchangeRate-API 등)

##### 3. 이미지 크기 제한 명시

```yaml
# application.yml
spring:
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB
```

##### 4. imageId 만료 처리 개선

```java
// PriceCompareResultStore에 만료 시간 추가
// 또는 만료된 imageId 조회 시 명확한 에러 메시지
```

---

## 다음 단계

### 우선순위 1: 핵심 기능 구현

1. 환경 감지 및 Toss SDK 래퍼
2. API 클라이언트 및 타입 정의
3. 상태 관리 설정 (React Query + Zustand)
4. 기본 라우팅 구조

### 우선순위 2: 페이지 구현

1. Home 페이지 (이미지 업로드)
2. Result 페이지 (가격 입력 + 요약 표시)
3. 에러 처리 및 로딩 상태

### 우선순위 3: UX 개선

1. 반응형 디자인
2. 애니메이션 및 전환 효과
3. 접근성 개선

---

## 참고 사항

### 환경 변수

```env
# .env.development
VITE_API_BASE_URL=http://localhost:8080

# .env.production
VITE_API_BASE_URL=https://api.mubu.com
```

### 타입 정의 예시

```typescript
// src/api/types.ts
export interface PriceCompareResult {
  imageId: string;
  aiText: string;
  productName: string;
  lowestPrice: number;
  mallName: string;
  link: string;
  image: string;
}

export interface PriceCompareSummaryRequest {
  imageId: string;
  localPrice: number;
  currency: string;
  priceSource: "AI" | "USER";
}

export interface PriceCompareSummaryResponse {
  summary: string;
  savedAmount: number;
  localPriceKrw: number;
  koreaPrice: number;
}
```

---

**이 문서는 프론트엔드 개발의 기준이 되며, 구현 과정에서 발견된 백엔드 누락 사항은 즉시 문서에 반영해야 합니다.**
