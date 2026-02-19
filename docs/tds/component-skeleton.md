# TDS Skeleton

**래퍼 파일**: `src/components/tds/TDSSkeleton.tsx`
**상태**: 구현 완료 (간소화 버전)

## 설명
데이터가 로드되는 동안 콘텐츠의 기본 레이아웃을 임시로 보여주는 컴포넌트.

## Props

| 속성 | 기본값 | 타입 | 설명 |
|------|--------|------|------|
| pattern | "topList" | 패턴 타입 | 레이아웃 패턴 |
| custom | - | 커스텀 배열 | 사용자 정의 패턴 |
| repeatLastItemCount | 3 | number \| "infinite" | 반복 횟수 |
| play | "show" | "show" \| "hide" | 표시 상태 |
| background | "grey" | "white" \| "grey" \| "greyOpacity100" | 배경 색 |
| height | "auto" | string \| number | 전체 높이 |

## 패턴 타입

| 패턴 | 설명 |
|------|------|
| topList | 제목 상단 리스트 |
| topListWithIcon | 제목 상단 + 아이콘 리스트 |
| amountTopList | 제목 + 부제목 상단 리스트 |
| amountTopListWithIcon | 제목 + 부제목 상단 + 아이콘 |
| subtitleList | 부제목 포함 리스트 |
| subtitleListWithIcon | 부제목 + 아이콘 리스트 |
| listOnly | 리스트만 |
| listWithIconOnly | 아이콘 리스트만 |
| cardOnly | 카드만 |

## 커스텀 패턴 타입

| 타입 | 설명 |
|------|------|
| title | 큰 스켈레톤 바 |
| subtitle | 얇은 스켈레톤 바 |
| list | 리스트 형태 |
| listWithIcon | 아이콘 + 리스트 |
| card | 카드 형태 |
| spacer(N) | N px 빈 공간 |

## 사용 예시

```tsx
<Skeleton pattern="topListWithIcon" style={{ width: '100%' }} />

<Skeleton
  custom={['title', 'subtitle', 'spacer(20)', 'listWithIcon']}
  repeatLastItemCount={3}
  style={{ width: '100%' }}
/>
```

## MUBU 앱 적용 계획
- Dashboard 로딩 시 리스트 스켈레톤
- Result 페이지 가격 정보 로딩 시
