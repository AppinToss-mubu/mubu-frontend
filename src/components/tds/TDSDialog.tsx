import { isTossEnvironment } from "../../utils/env";

interface TDSAlertDialogProps {
  open: boolean;
  title: string;
  description?: string;
  buttonText?: string;
  onClose: () => void;
}

interface TDSConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
  onClose: () => void;
  confirmDanger?: boolean;
}

function DialogOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  const isToss = isTossEnvironment();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 320,
          borderRadius: isToss ? 20 : 16,
          backgroundColor: isToss ? "#FFFFFF" : "var(--bg, #fff)",
          padding: isToss ? "28px 24px 20px" : "24px 20px 16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          animation: "tds-dialog-in 0.2s ease",
        }}
      >
        {children}
      </div>
      <style>{`
        @keyframes tds-dialog-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export function TDSAlertDialog({
  open,
  title,
  description,
  buttonText = "확인",
  onClose,
}: TDSAlertDialogProps) {
  const isToss = isTossEnvironment();

  if (!open) return null;

  return (
    <DialogOverlay onClose={onClose}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: isToss ? 20 : 18,
            fontWeight: 700,
            color: isToss ? "#333D4B" : "var(--fg, #333)",
            marginBottom: description ? 12 : 24,
            lineHeight: 1.4,
            whiteSpace: "pre-line",
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: isToss ? 15 : 14,
              fontWeight: 500,
              color: isToss ? "#6B7684" : "var(--muted, #666)",
              marginBottom: 24,
              lineHeight: 1.6,
              whiteSpace: "pre-line",
            }}
          >
            {description}
          </div>
        )}
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontSize: isToss ? 17 : 15,
            fontWeight: 700,
            color: isToss ? "#3182F6" : "var(--primary, #3182F6)",
            cursor: "pointer",
            padding: "8px 16px",
          }}
        >
          {buttonText}
        </button>
      </div>
    </DialogOverlay>
  );
}

export function TDSConfirmDialog({
  open,
  title,
  description,
  cancelText = "아니오",
  confirmText = "예",
  onCancel,
  onConfirm,
  onClose,
  confirmDanger = false,
}: TDSConfirmDialogProps) {
  const isToss = isTossEnvironment();

  if (!open) return null;

  const cancelBtnStyle: React.CSSProperties = isToss
    ? {
        flex: 1,
        padding: "14px 16px",
        borderRadius: 12,
        border: "none",
        backgroundColor: "rgba(25,31,40,0.08)",
        color: "#191F28",
        fontSize: 16,
        fontWeight: 600,
        cursor: "pointer",
      }
    : {
        flex: 1,
        padding: "12px 16px",
        borderRadius: 10,
        border: "1px solid var(--border, #ddd)",
        backgroundColor: "transparent",
        color: "var(--fg, #333)",
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
      };

  const confirmBtnStyle: React.CSSProperties = isToss
    ? {
        flex: 1,
        padding: "14px 16px",
        borderRadius: 12,
        border: "none",
        backgroundColor: confirmDanger ? "#F04452" : "#3182F6",
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: 600,
        cursor: "pointer",
      }
    : {
        flex: 1,
        padding: "12px 16px",
        borderRadius: 10,
        border: "none",
        backgroundColor: confirmDanger ? "#ef4444" : "var(--primary, #3182F6)",
        color: "#ffffff",
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
      };

  return (
    <DialogOverlay onClose={onClose}>
      <div>
        <div
          style={{
            fontSize: isToss ? 20 : 18,
            fontWeight: 700,
            color: isToss ? "#333D4B" : "var(--fg, #333)",
            marginBottom: description ? 12 : 24,
            lineHeight: 1.4,
            whiteSpace: "pre-line",
            textAlign: "center",
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: isToss ? 15 : 14,
              fontWeight: 500,
              color: isToss ? "#6B7684" : "var(--muted, #666)",
              marginBottom: 24,
              lineHeight: 1.6,
              whiteSpace: "pre-line",
              textAlign: "center",
            }}
          >
            {description}
          </div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onCancel} style={cancelBtnStyle}>
            {cancelText}
          </button>
          <button onClick={onConfirm} style={confirmBtnStyle}>
            {confirmText}
          </button>
        </div>
      </div>
    </DialogOverlay>
  );
}

export const TDSDialog = {
  Alert: TDSAlertDialog,
  Confirm: TDSConfirmDialog,
};

export default TDSDialog;
