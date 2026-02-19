# TDS Colors (색상 토큰)

패키지: `@toss/tds-colors`

```ts
import { colors } from '@toss/tds-colors';
```

## 기본 색상

### Grey
| 토큰 | HEX | 용도 |
|------|-----|------|
| grey50 | #F9FAFB | 매우 연한 배경 |
| grey100 | #F2F4F6 | 연한 배경, 구분선 |
| grey200 | #E5E8EB | 보더, 구분선 |
| grey300 | #D1D6DB | 비활성 보더 |
| grey400 | #B0B8C1 | 비활성 텍스트 |
| grey500 | #8B95A1 | 보조 텍스트 (muted) |
| grey600 | #6B7684 | 중간 텍스트 |
| grey700 | #4E5968 | 본문 텍스트 |
| grey800 | #333D4B | 강조 텍스트 |
| grey900 | #191F28 | 최상위 텍스트 (primary fg) |

### Blue (토스 블루)
| 토큰 | HEX | 용도 |
|------|-----|------|
| blue50 | #E8F3FF | 매우 연한 블루 배경 |
| blue100 | #C9E2FF | |
| blue200 | #90C2FF | |
| blue300 | #64A8FF | |
| blue400 | #4593FC | |
| **blue500** | **#3182F6** | **기본 토스 블루 (Primary)** |
| blue600 | #2272EB | |
| blue700 | #1B64DA | |
| blue800 | #1957C2 | |
| blue900 | #194AA6 | |

### Red
| 토큰 | HEX | 용도 |
|------|-----|------|
| red50 | #FFEEEE | 에러 배경 |
| red100 | #FFD4D6 | |
| red200 | #FEAFB4 | |
| red300 | #FB8890 | |
| red400 | #F66570 | |
| **red500** | **#F04452** | **에러/위험 (Danger)** |
| red600 | #E42939 | |
| red700 | #D22030 | |
| red800 | #BC1B2A | |
| red900 | #A51926 | |

### Green
| 토큰 | HEX | 용도 |
|------|-----|------|
| green50 | #F0FAF6 | 성공 배경 |
| green100 | #AEEFD5 | |
| green200 | #76E4B8 | |
| green300 | #3FD599 | |
| green400 | #15C47E | |
| **green500** | **#03B26C** | **성공 (Success)** |
| green600 | #02A262 | |

### Teal
| 토큰 | HEX | 용도 |
|------|-----|------|
| teal500 | #18A5A5 | |

### Orange
| 토큰 | HEX | 용도 |
|------|-----|------|
| orange500 | #FE9800 | 경고 |

### Yellow
| 토큰 | HEX | 용도 |
|------|-----|------|
| yellow500 | #FFC342 | |

### Purple
| 토큰 | HEX | 용도 |
|------|-----|------|
| purple500 | #A234C7 | |

### Grey Opacity
| 토큰 | 값 | 용도 |
|------|-----|------|
| greyOpacity50 | #001733, 0.02 | 매우 약한 오버레이 |
| greyOpacity100 | #022047, 0.05 | |
| greyOpacity200 | #001B37, 0.10 | |
| greyOpacity300 | #001D3A, 0.18 | |
| greyOpacity400 | #001936, 0.31 | |
| greyOpacity500 | #031832, 0.46 | |
| greyOpacity600 | #00132B, 0.58 | |
| greyOpacity700 | #031228, 0.70 | |
| greyOpacity800 | #000C1E, 0.80 | 딤(dimmer) 배경 |
| greyOpacity900 | #020913, 0.91 | |

## 배경 색상
| 토큰 | 값 |
|------|-----|
| background | #FFFFFF |
| greyBackground | grey100 (#F2F4F6) |
| layeredBackground | #FFFFFF |
| floatedBackground | #FFFFFF |

## MUBU 앱에서의 매핑

| 용도 | TDS 토큰 | HEX |
|------|----------|-----|
| 메인 텍스트 | grey900 | #191F28 |
| 보조 텍스트 | grey500 | #8B95A1 |
| 비활성 텍스트 | grey400 | #B0B8C1 |
| 기본 배경 | background | #FFFFFF |
| 카드/섹션 배경 | grey50 | #F9FAFB |
| 보더/구분선 | grey100 | #F2F4F6 |
| 입력 보더 | grey200 | #E5E8EB |
| Primary 버튼 | blue500 | #3182F6 |
| Danger/에러 | red500 | #F04452 |
| 성공/절약 | green500 | #03B26C |
| 딤(dimmer) | greyOpacity800 | rgba(0,0,0,0.5) 근사 |
