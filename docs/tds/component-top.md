# TDS Top

**래퍼 파일**: `src/components/tds/TDSTop.tsx`
**상태**: 구현 완료 (간소화 버전)

## 설명
페이지 상단 헤더 컴포넌트. 타이틀, 서브타이틀, 우측 요소 등을 배치.

## Props

| 속성 | 기본값 | 타입 | 설명 |
|------|--------|------|------|
| title* | - | ReactNode | 타이틀 |
| upperGap | 24 | number | 상단 여백 |
| lowerGap | 24 | number | 하단 여백 |
| upper | - | ReactNode | 콘텐츠 상단 요소 |
| lower | - | ReactNode | 콘텐츠 하단 요소 |
| subtitleTop | - | ReactNode | 타이틀 위 서브타이틀 |
| subtitleBottom | - | ReactNode | 타이틀 아래 서브타이틀 |
| right | - | ReactNode | 우측 요소 |
| rightVerticalAlign | "center" | "center" \| "end" | 우측 수직 정렬 |

## 하위 컴포넌트

### 타이틀 계열
| 컴포넌트 | 용도 |
|----------|------|
| Top.TitleParagraph | 단순 텍스트 제목 |
| Top.TitleTextButton | 클릭 가능한 텍스트 버튼 |
| Top.TitleSelector | 화살표 포함 셀렉터 |

### 서브타이틀 계열
| 컴포넌트 | 용도 |
|----------|------|
| Top.SubtitleParagraph | 단순 부제목 |
| Top.SubtitleTextButton | 클릭 가능 부제목 |
| Top.SubtitleSelector | 셀렉터 부제목 |
| Top.SubtitleBadges | 뱃지 형태 부제목 |

### 우측 요소
| 컴포넌트 | 용도 |
|----------|------|
| Top.RightButton | 우측 버튼 |
| Top.RightAssetContent | 우측 에셋 |

### 하단 요소
| 컴포넌트 | 용도 |
|----------|------|
| Top.LowerButton | 하단 작은 버튼 |
| Top.LowerCTA | 하단 2-버튼 CTA |
| Top.LowerCTAButton | CTA 버튼 |

## 접근성
- role="heading", aria-level="1" (타이틀)
- aria-level="2" (서브타이틀)
- aria-haspopup="listbox" (Selector)

## 사용 예시

```tsx
<Top
  upperGap={0}
  title={<Top.TitleParagraph size={28}>해외 가격 비교</Top.TitleParagraph>}
  subtitleBottom={<Top.SubtitleParagraph>촬영한 상품의 한국 최저가를 찾아드려요</Top.SubtitleParagraph>}
/>
```

## MUBU 앱 적용 계획
- Home 페이지 상단 헤더
- Result 페이지 상단
- Dashboard 페이지 상단
