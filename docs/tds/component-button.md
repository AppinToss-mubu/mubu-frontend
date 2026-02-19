# TDS Button

**래퍼 파일**: `src/components/tds/TDSButton.tsx`
**상태**: 구현 완료

## Props

| 속성 | 기본값 | 타입 | 설명 |
|------|--------|------|------|
| children* | - | ReactNode | 버튼 텍스트 |
| onClick | - | () => void | 클릭 핸들러 |
| disabled | false | boolean | 비활성 |
| loading | false | boolean | 로딩 상태 |
| color | "primary" | "primary" \| "dark" \| "danger" \| "light" | 색상 |
| variant | "fill" | "fill" \| "weak" | 스타일 |
| size | "xlarge" | "small" \| "medium" \| "large" \| "xlarge" | 크기 |
| display | "inline" | "inline" \| "block" \| "full" | 너비 |

## TDS 색상 매핑

| color | variant=fill | variant=weak |
|-------|-------------|-------------|
| primary | bg: #3182F6 (blue500), fg: #FFFFFF | bg: rgba(49,130,246,0.12), fg: #3182F6 |
| dark | bg: #191F28 (grey900), fg: #FFFFFF | bg: rgba(25,31,40,0.08), fg: #191F28 |
| danger | bg: #F04452 (red500), fg: #FFFFFF | bg: rgba(240,68,82,0.12), fg: #F04452 |
| light | bg: #FFFFFF, fg: #191F28 | bg: rgba(255,255,255,0.2), fg: #FFFFFF |

## 크기 매핑

| size | padding | fontSize | borderRadius |
|------|---------|----------|-------------|
| small | 8px 12px | 13 (t7) | 8 |
| medium | 10px 16px | 14 (st11) | 10 |
| large | 12px 20px | 15 (t6) | 12 |
| xlarge | 16px 24px | 16 (st10) | 14 |

## 기타 스타일
- fontWeight: 600 (semibold)
- disabled opacity: 0.4
- transition: opacity 0.2s, transform 0.1s
