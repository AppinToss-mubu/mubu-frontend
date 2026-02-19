# TDS NumericSpinner

**래퍼 파일**: `src/components/tds/TDSNumericSpinner.tsx`
**상태**: 구현 완료

## Props

| 속성 | 기본값 | 타입 | 설명 |
|------|--------|------|------|
| value* | - | number | 현재 값 |
| onChange* | - | (value: number) => void | 변경 핸들러 |
| min | 0 | number | 최소값 |
| max | 999 | number | 최대값 |
| size | "medium" | "tiny" \| "small" \| "medium" \| "large" | 크기 |
| disabled | false | boolean | 비활성 |

## TDS 스타일 스펙

### 크기
| size | 버튼 크기 | fontSize | gap |
|------|----------|----------|-----|
| tiny | 24 | 13 (t7) | 8 |
| small | 28 | 14 (st11) | 10 |
| medium | 32 | 15 (t6) | 12 |
| large | 40 | 18 (st9) | 16 |

### 컨테이너
- backgroundColor: #F2F4F6 (grey100)
- borderRadius: 999 (pill)
- padding: 4px 8px

### 버튼
- borderRadius: 50%
- 기본 배경: #FFFFFF
- 비활성 배경: #E5E8EB (grey200)
- 기본 텍스트: #191F28 (grey900)
- 비활성 텍스트: #B0B8C1 (grey400)
- boxShadow: 0 1px 2px rgba(0,0,0,0.08)

### 숫자 표시
- fontWeight: 700 (bold)
- fontSize: sizeConfig + 2
- 기본 color: #191F28 (grey900)
- 비활성 color: #B0B8C1 (grey400)
