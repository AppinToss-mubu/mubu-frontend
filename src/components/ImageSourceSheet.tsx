interface ImageSourceSheetProps {
  open: boolean;
  onClose: () => void;
  onPickCamera: () => void;
  onPickAlbum: () => void;
  showCamera?: boolean;
}

export function ImageSourceSheet({
  open,
  onClose,
  onPickCamera,
  onPickAlbum,
  showCamera = true,
}: ImageSourceSheetProps) {
  if (!open) return null;

  return (
    <div className="sheetOverlay" role="dialog" aria-modal="true">
      <div className="sheetBackdrop" onClick={onClose} />
      <div className="sheet">
        <div className="sheetHandle" />
        <div className="sheetTitle">사진 가져오기</div>

        <div className="sheetButtons">
          {showCamera && (
            <button className="sheetButton" type="button" onClick={onPickCamera}>
              카메라 촬영
            </button>
          )}
          <button className="sheetButtonAlt" type="button" onClick={onPickAlbum}>
            앨범에서 사진 선택
          </button>
          <button className="sheetButtonSecondary" type="button" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

