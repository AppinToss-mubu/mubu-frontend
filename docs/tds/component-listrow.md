# TDS ListRow

**래퍼 파일**: `src/components/tds/TDSListRow.tsx`
**상태**: 구현 완료

## Props

### TDSListRow
| 속성 | 기본값 | 타입 | 설명 |
|------|--------|------|------|
| contents* | - | ReactNode | 내용 |
| left | - | ReactNode | 좌측 요소 |
| right | - | ReactNode | 우측 요소 |
| onClick | - | () => void | 클릭 핸들러 |
| withArrow | false | boolean | 화살표 표시 |
| border | "indented" | "indented" \| "none" | 하단 보더 |
| verticalPadding | "medium" | "small" \| "medium" \| "large" \| "xlarge" | 상하 패딩 |
| horizontalPadding | "medium" | "small" \| "medium" | 좌우 패딩 |
| disabled | false | boolean | 비활성 |

### TDSListRow.Texts
| 속성 | 기본값 | 타입 | 설명 |
|------|--------|------|------|
| top* | - | string | 상단 텍스트 |
| bottom | - | string | 하단 텍스트 |
| type | "1RowTypeA" | "1RowTypeA" \| "2RowTypeA" | 행 타입 |

## TDS 스타일 스펙

### 패딩
| verticalPadding | px |
|----------------|-----|
| small | 8 |
| medium | 12 |
| large | 16 |
| xlarge | 24 |

| horizontalPadding | px |
|-------------------|-----|
| small | 20 |
| medium | 24 |

### Texts 스타일
- top: fontSize 16 (st10), fontWeight 500, color #191F28 (grey900)
- bottom: fontSize 14 (st11), color #8B95A1 (grey500), marginTop 4

### 보더
- indented: 1px solid #F2F4F6 (grey100)

### 화살표
- color: #B0B8C1 (grey400)
- SVG chevron-right 16x16
