# TDS Loader

**래퍼 파일**: `src/components/tds/TDSLoader.tsx`
**상태**: 구현 완료

## Props

| 속성 | 기본값 | 타입 | 설명 |
|------|--------|------|------|
| size | "medium" | "small" \| "medium" \| "large" | 크기 |
| type | "primary" | "primary" \| "dark" \| "light" | 색상 타입 |
| label | - | string | 라벨 텍스트 |

## TDS 스타일 스펙

### 크기
| size | px |
|------|-----|
| small | 20 |
| medium | 32 |
| large | 48 |

### 색상
| type | HEX | TDS 토큰 |
|------|-----|----------|
| primary | #3182F6 | blue500 |
| dark | #191F28 | grey900 |
| light | #FFFFFF | - |

### 스피너
- border: 3px solid {color}20 (20% 투명)
- borderTopColor: {color}
- animation: spin 1s linear infinite

### 라벨
- fontSize: 15 (t6)
- fontWeight: 500 (medium)
- color: #191F28 (grey900)
- textAlign: center
- lineHeight: 1.6
- whiteSpace: pre-line
