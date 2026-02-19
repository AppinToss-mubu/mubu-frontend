# TDS BottomSheet

**래퍼 파일**: `src/components/tds/TDSBottomSheet.tsx`
**상태**: 구현 완료

## Props

| 속성 | 기본값 | 타입 | 설명 |
|------|--------|------|------|
| open* | - | boolean | 열림 상태 |
| onClose* | - | () => void | 닫기 핸들러 |
| header | - | ReactNode | 헤더 제목 |
| headerDescription | - | ReactNode | 헤더 설명 |
| children* | - | ReactNode | 내용 |
| cta | - | ReactNode | 하단 CTA 버튼 |

## TDS 스타일 스펙

### 시트 컨테이너
- backgroundColor: #FFFFFF
- borderTopLeftRadius / borderTopRightRadius: 24
- boxShadow: 0 -4px 24px rgba(0,0,0,0.12)
- maxHeight: 80vh

### 드래그 핸들
- width: 36, height: 4
- backgroundColor: #E5E8EB (grey200)
- borderRadius: 2
- margin: 8px auto 0

### 딤(dimmer)
- backgroundColor: rgba(0,0,0,0.5)

### 헤더
- padding: 20px 20px 0
- 제목: fontSize 18 (st9), fontWeight 700, color #191F28 (grey900)

### 닫기 버튼
- SVG X 아이콘 24x24
- stroke: #8B95A1 (grey500)

### 콘텐츠
- padding: 16px 20px 32px
