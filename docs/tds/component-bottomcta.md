# TDS BottomCTA

**래퍼 파일**: `src/components/tds/TDSBottomCTA.tsx`
**상태**: 구현 완료

## 구성

### TDSBottomCTA.Single
| 속성 | 기본값 | 타입 | 설명 |
|------|--------|------|------|
| children* | - | ReactNode | 버튼 텍스트 |
| onClick | - | () => void | 클릭 핸들러 |
| disabled | false | boolean | 비활성 |
| fixed | true | boolean | 하단 고정 |
| background | "default" | "default" \| "none" | 배경 |
| hasSafeAreaPadding | true | boolean | safe area |
| topAccessory | - | ReactNode | 상단 부가 요소 |

### TDSBottomCTA.Double
| 속성 | 기본값 | 타입 | 설명 |
|------|--------|------|------|
| leftButton* | - | ReactNode | 좌측 버튼 |
| rightButton* | - | ReactNode | 우측 버튼 |
| 나머지 | Single과 동일 | | |

## TDS 스타일 스펙

### 컨테이너
- padding: 12px 24px
- paddingBottom: max(20px, env(safe-area-inset-bottom))
- background: linear-gradient(to top, #FFFFFF 60%, transparent)
- zIndex: 100

### Single 버튼
- width: 100%
- padding: 16px 24px
- borderRadius: 16
- 기본 bg: #191F28 (grey900), color: #FFFFFF
- disabled bg: #E5E8EB (grey200), color: #8B95A1 (grey500)
- fontSize: 17 (t5)
- fontWeight: 600 (semibold)

### Double 버튼
- grid: 1fr 1fr, gap 8
