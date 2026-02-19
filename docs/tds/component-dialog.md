# TDS Dialog (AlertDialog + ConfirmDialog)

**래퍼 파일**: `src/components/tds/TDSDialog.tsx`
**상태**: 구현 완료 (간소화 버전)

## AlertDialog vs ConfirmDialog

| 타입 | 버튼 | 용도 |
|------|------|------|
| AlertDialog | 단일 확인 버튼 | 알림 확인 (작업 완료, 상태 변경) |
| ConfirmDialog | 취소 + 확인 | 사용자 선택 (중요 액션 확인) |

---

## AlertDialog Props

| 속성 | 기본값 | 타입 | 설명 |
|------|--------|------|------|
| open | - | boolean | 표시 여부 |
| title | - | ReactNode | 제목 |
| description | - | ReactNode | 설명 (선택) |
| alertButton | - | ReactNode | 확인 버튼 |
| closeOnDimmerClick | true | boolean | 외부 클릭 닫기 |
| closeOnBackEvent | true | boolean | 뒤로가기 닫기 |
| onClose | - | () => void | 닫힐 때 콜백 |
| onEntered | - | () => void | 완전히 열린 후 |
| onExited | - | () => void | 완전히 닫힌 후 |

### AlertDialog.Title
| 속성 | 기본값 | 값 |
|------|--------|-----|
| typography | t4 | fontSize 20, lineHeight 29 |
| fontWeight | bold | 700 |
| color | adaptive.grey800 | #333D4B |

### AlertDialog.Description
| 속성 | 기본값 | 값 |
|------|--------|-----|
| typography | t6 | fontSize 15, lineHeight 22.5 |
| fontWeight | medium | 500 |
| color | adaptive.grey600 | #6B7684 |

### AlertDialog.AlertButton
| 속성 | 기본값 | 값 |
|------|--------|-----|
| color | colors.blue500 | #3182F6 |
| fontWeight | bold | 700 |
| size | medium | |

### 사용 예시
```tsx
<AlertDialog
  open={open}
  title={<AlertDialog.Title>분석이 완료되었어요</AlertDialog.Title>}
  description={<AlertDialog.Description>결과를 확인해보세요.</AlertDialog.Description>}
  alertButton={<AlertDialog.AlertButton onClick={() => setOpen(false)}>확인</AlertDialog.AlertButton>}
  onClose={() => setOpen(false)}
/>
```

---

## ConfirmDialog Props

| 속성 | 기본값 | 타입 | 설명 |
|------|--------|------|------|
| open | - | boolean | 표시 여부 |
| title | - | ReactNode | 제목 |
| description | - | ReactNode | 설명 (선택) |
| cancelButton | - | ReactNode | 취소 버튼 |
| confirmButton | - | ReactNode | 확인 버튼 |
| closeOnDimmerClick | true | boolean | 외부 클릭 닫기 |
| onClose | - | () => void | 닫힐 때 콜백 |

### ConfirmDialog.CancelButton
| 속성 | 기본값 | 값 |
|------|--------|-----|
| type | "dark" | grey900 계열 |
| style | "weak" | 약한 배경 |
| size | "large" | |

### ConfirmDialog.ConfirmButton
| 속성 | 기본값 | 값 |
|------|--------|-----|
| size | "large" | Button 컴포넌트 확장 |

### 사용 예시
```tsx
<ConfirmDialog
  open={open}
  title={<ConfirmDialog.Title>비교 기록을 삭제할까요?</ConfirmDialog.Title>}
  description={<ConfirmDialog.Description>삭제하면 되돌릴 수 없어요.</ConfirmDialog.Description>}
  cancelButton={<ConfirmDialog.CancelButton onClick={() => setOpen(false)}>아니오</ConfirmDialog.CancelButton>}
  confirmButton={<ConfirmDialog.ConfirmButton onClick={handleDelete}>삭제하기</ConfirmDialog.ConfirmButton>}
  onClose={() => setOpen(false)}
/>
```

## MUBU 앱 적용 계획
- 비교 기록 삭제 확인 (ConfirmDialog)
- 권한 요청 알림 (AlertDialog)
- 에러 상세 안내 (AlertDialog)
