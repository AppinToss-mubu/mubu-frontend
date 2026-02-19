# TDS TextField

**래퍼 파일**: `src/components/tds/TDSTextField.tsx`
**상태**: 구현 완료

## Props

| 속성 | 기본값 | 타입 | 설명 |
|------|--------|------|------|
| value* | - | string | 값 |
| onChange* | - | ChangeEventHandler | 변경 핸들러 |
| placeholder | - | string | 플레이스홀더 |
| label | - | string | 라벨 |
| help | - | string | 도움말 |
| prefix | - | string | 앞쪽 텍스트 |
| suffix | - | string | 뒷쪽 텍스트 |
| hasError | false | boolean | 에러 상태 |
| disabled | false | boolean | 비활성 |
| variant | "box" | "box" \| "line" \| "big" \| "hero" | 스타일 |
| labelOption | "sustain" | "appear" \| "sustain" | 라벨 표시 |
| inputMode | "text" | 입력 모드 | |

## TDS 스타일 스펙

### variant별 스타일
| variant | padding | borderRadius | fontSize | fontWeight |
|---------|---------|-------------|----------|------------|
| box | 14px 16px | 12 | 16 (st10) | 400 |
| line | 14px 0 | 0 | 16 (st10) | 400 |
| big | 16px | 16 | 24 (st5) | 600 |
| hero | 16px | 16 | 24 (st5) | 600 |

### 색상
| 요소 | 기본 | 에러 | 비활성 |
|------|------|------|--------|
| 보더 | #E5E8EB (grey200) | #F04452 (red500) | #E5E8EB |
| 배경 | #FFFFFF | #FFFFFF | #F2F4F6 (grey100) |
| 텍스트 | #191F28 (grey900) | - | #8B95A1 (grey500) |
| 라벨 | #8B95A1 (grey500) | #F04452 (red500) | - |

### 도움말 텍스트
- fontSize: 13 (t7)
- color: #8B95A1 / 에러: #F04452
