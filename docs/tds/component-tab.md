# TDS Tab

**래퍼 파일**: 참고용 (하단 네비와 별개)
**상태**: 문서 정리 완료

## 설명
여러 콘텐츠를 한 화면에서 전환할 수 있는 탭 컴포넌트.

## Props

### Tab
| 속성 | 기본값 | 타입 | 설명 |
|------|--------|------|------|
| children* | - | ReactNode | Tab.Item 배열 |
| onChange* | - | (index, key?) => void | 선택 변경 핸들러 |
| size | "large" | "large" \| "small" | 크기 |
| fluid | false | boolean | 유동 너비 + 스크롤 |
| itemGap | - | number | 아이템 간격(px) |
| ariaLabel | - | string | 접근성 라벨 |

### Tab.Item
| 속성 | 기본값 | 타입 | 설명 |
|------|--------|------|------|
| selected* | - | boolean | 선택 상태 |
| redBean | false | boolean | 업데이트 표시 빨간 점 |

## 접근성
- role="tablist" (컨테이너)
- role="tab" (각 아이템)
- aria-selected 자동 업데이트

## 사용 예시

```tsx
function TabExample() {
  const [selected, setSelected] = useState(0);

  return (
    <Tab size="large" onChange={(index) => setSelected(index)}>
      <Tab.Item selected={selected === 0}>전체</Tab.Item>
      <Tab.Item selected={selected === 1}>최근</Tab.Item>
      <Tab.Item selected={selected === 2}>즐겨찾기</Tab.Item>
    </Tab>
  );
}
```

## MUBU 앱 적용 계획
- Dashboard 페이지에서 비교 내역 필터링
- 참고: 하단 네비게이션은 TDSBottomNav 사용 (Tab과 별개)
