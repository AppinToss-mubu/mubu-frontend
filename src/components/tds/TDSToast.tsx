import { useState, useEffect, useCallback } from "react";
import { isTossEnvironment } from "../../utils/env";

interface TDSToastProps {
  open: boolean;
  position?: "top" | "bottom";
  text: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
  higherThanCTA?: boolean;
}

export function TDSToast({
  open,
  position = "top",
  text,
  type = "info",
  duration = 3000,
  onClose,
  higherThanCTA = false,
}: TDSToastProps) {
  const isToss = isTossEnvironment();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      setExiting(false);
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setExiting(false);
      const timer = setTimeout(handleClose, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, handleClose]);

  if (!visible) return null;

  const iconMap = {
    success: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#03B26C" />
        <path d="M8 12l3 3 5-5" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    error: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#F04452" />
        <path d="M12 8v4m0 4h.01" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    info: null,
  };

  const bottomOffset = higherThanCTA ? 100 : 24;

  const containerStyle: React.CSSProperties = isToss
    ? {
        position: "fixed",
        left: 20,
        right: 20,
        [position === "top" ? "top" : "bottom"]:
          position === "top" ? 20 : bottomOffset,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "14px 20px",
        borderRadius: 16,
        backgroundColor: "#191F28",
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: 500,
        lineHeight: 1.5,
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        transform: exiting
          ? `translateY(${position === "top" ? "-20px" : "20px"})`
          : "translateY(0)",
        opacity: exiting ? 0 : 1,
        transition: "transform 0.3s ease, opacity 0.3s ease",
        animation: `tds-toast-in-${position} 0.3s ease`,
      }
    : {
        position: "fixed",
        left: 20,
        right: 20,
        [position === "top" ? "top" : "bottom"]:
          position === "top" ? 20 : bottomOffset,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "14px 20px",
        borderRadius: 12,
        backgroundColor: "rgba(0,0,0,0.85)",
        color: "#ffffff",
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.5,
        opacity: exiting ? 0 : 1,
        transition: "opacity 0.3s ease",
      };

  return (
    <>
      <div style={containerStyle}>
        {iconMap[type]}
        <span style={{ flex: 1 }}>{text}</span>
      </div>
      <style>{`
        @keyframes tds-toast-in-top {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes tds-toast-in-bottom {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default TDSToast;
