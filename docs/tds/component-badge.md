# TDS Badge

**래퍼 파일**: `src/components/tds/TDSBadge.tsx`
**상태**: 구현 완료

## 설명
항목의 상태를 빠르게 인식할 수 있도록 강조하는 라벨 컴포넌트.

## Props

| 속성 | 기본값 | 타입 | 설명 |
|------|--------|------|------|
| variant* | - | "fill" \| "weak" | 스타일 |
| size* | - | "xsmall" \| "small" \| "medium" \| "large" | 크기 |
| color* | - | "blue" \| "teal" \| "green" \| "red" \| "yellow" \| "elephant" | 색상 |

## variant

### fill (강조)
채도가 높아 시각적으로 강렬하고 눈에 띄는 디자인. 주요 항목 강조에 적합.

### weak (약한)
채도가 낮아 시각적으로 덜 눈에 띄는 디자인.

## 사용 예시

```tsx
<Badge size="small" color="green" variant="fill">
  절약
</Badge>

<Badge size="xsmall" color="blue" variant="weak">
  최저가
</Badge>

<Badge size="xsmall" color="red" variant="fill">
  비싸요
</Badge>
```

## MUBU 앱 적용 계획
- Result 페이지: 절약 금액 표시 (green fill)
- Result 페이지: "최저가" 라벨 (blue weak)
- Dashboard: 비교 결과 상태 표시
