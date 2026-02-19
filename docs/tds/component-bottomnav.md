# TDS BottomNav

**래퍼 파일**: `src/components/tds/TDSBottomNav.tsx`
**상태**: 구현 완료

## Props

| 속성 | 기본값 | 타입 | 설명 |
|------|--------|------|------|
| items* | - | NavItem[] | 네비 항목 배열 |
| centerAction | - | CenterAction | 중앙 FAB 버튼 |

### NavItem
```ts
{
  id: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
  onClick: () => void;
}
```

## TDS 스타일 스펙

### 네비게이션 바
- position: fixed, bottom: 0
- height: 76
- backgroundColor: #FFFFFF
- borderTop: 1px solid #F2F4F6 (grey100)
- padding: 8px 24px calc(8px + env(safe-area-inset-bottom))
- zIndex: 100

### 네비 아이템
- 라벨 fontSize: 11 (st13 근사)
- active fontWeight: 600, color: #191F28 (grey900)
- inactive fontWeight: 400, color: #8B95A1 (grey500)
- 아이콘: 22x22
- minWidth: 60

### FAB (중앙 액션 버튼)
- width/height: 56
- borderRadius: 999
- backgroundColor: #3182F6 (blue500)
- color: #FFFFFF
- boxShadow: 0 4px 12px rgba(49,130,246,0.4)
- transform: translateY(-18px)
