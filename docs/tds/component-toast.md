# TDS Toast

**래퍼 파일**: `src/components/tds/TDSToast.tsx`
**상태**: 구현 완료 (간소화 버전)

## 설명
사용자가 작업을 완료했거나 이벤트가 발생했을 때 피드백을 제공하는 컴포넌트.
화면 상단이나 하단에 짧은 시간 동안 표시된 뒤 자동으로 사라짐.

## Props

| 속성 | 기본값 | 타입 | 설명 |
|------|--------|------|------|
| open* | - | boolean | 열림 상태 |
| position* | - | "top" \| "bottom" | 위치 |
| text* | - | string | 메시지 |
| leftAddon | - | ReactNode | 좌측 아이콘/로티 |
| button | - | ReactNode | 버튼 (bottom만) |
| duration | 3000 | number | 자동 닫힘 시간(ms) |
| onClose | - | () => void | 닫힐 때 콜백 |
| onExited | - | () => void | 완전히 사라진 후 콜백 |
| higherThanCTA | false | boolean | CTA 위에 표시 |
| aria-live | "polite" | "assertive" \| "polite" | 접근성 |

## 하위 컴포넌트

### Toast.Icon
| 속성 | 타입 | 설명 |
|------|------|------|
| name* | string | 아이콘 이름 (예: "icn-success-color") |

### Toast.Button
| 속성 | 타입 | 설명 |
|------|------|------|
| children* | string | 버튼 텍스트 |
| onClick | () => void | 클릭 핸들러 |

### Toast.Lottie
| 속성 | 타입 | 설명 |
|------|------|------|
| src* | string | 로티 JSON URL |

## 사용 예시

```tsx
<Toast
  position="top"
  open={isOpen}
  text="가격 비교가 완료되었어요"
  leftAddon={<Toast.Icon name="icn-success-color" />}
  duration={3000}
  onClose={() => setIsOpen(false)}
/>
```

## MUBU 앱 적용 계획
- 분석 실패/성공 알림
- 복사 완료 알림
- 에러 피드백
