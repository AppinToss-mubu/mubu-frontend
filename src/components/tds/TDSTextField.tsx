/**
 * TDS 스타일 TextField 래퍼
 * - Toss 환경: TDS TextField 스타일 적용
 * - 일반 웹: 기존 스타일 유지
 */

import { isTossEnvironment } from "../../utils/env";

interface TDSTextFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  help?: string;
  prefix?: string;
  suffix?: string;
  hasError?: boolean;
  disabled?: boolean;
  variant?: "box" | "line" | "big" | "hero";
  labelOption?: "appear" | "sustain";
  inputMode?: "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url";
  type?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function TDSTextField({
  value,
  onChange,
  placeholder,
  label,
  help,
  prefix,
  suffix,
  hasError = false,
  disabled = false,
  variant = "box",
  labelOption = "sustain",
  inputMode = "text",
  type = "text",
  style,
  className,
}: TDSTextFieldProps) {
  const isToss = isTossEnvironment();
  const showLabel = labelOption === "sustain" || (labelOption === "appear" && value);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  };

  const labelStyle: React.CSSProperties = isToss
    ? {
        fontSize: 14,
        fontWeight: 500,
        color: hasError ? "#F04452" : "#8B95A1",
        transition: "color 0.2s",
      }
    : {
        fontSize: 13,
        color: hasError ? "#ef4444" : "var(--muted)",
      };

  const inputWrapperStyle: React.CSSProperties = isToss
    ? {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: variant === "box" ? "14px 16px" : variant === "line" ? "14px 0" : "16px",
        borderRadius: variant === "box" ? 12 : variant === "line" ? 0 : 16,
        border: variant === "line" 
          ? "none" 
          : `1px solid ${hasError ? "#F04452" : disabled ? "#E5E8EB" : "#E5E8EB"}`,
        borderBottom: variant === "line" 
          ? `1px solid ${hasError ? "#F04452" : disabled ? "#E5E8EB" : "#E5E8EB"}` 
          : undefined,
        backgroundColor: disabled ? "#F2F4F6" : "#FFFFFF",
        transition: "border-color 0.2s, background-color 0.2s",
      }
    : {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "14px 16px",
        borderRadius: 12,
        border: `1px solid ${hasError ? "#ef4444" : "var(--border)"}`,
        backgroundColor: disabled ? "var(--card)" : "var(--bg)",
      };

  const inputStyle: React.CSSProperties = isToss
    ? {
        flex: 1,
        border: "none",
        outline: "none",
        backgroundColor: "transparent",
        fontSize: variant === "big" || variant === "hero" ? 24 : 16,
        fontWeight: variant === "big" || variant === "hero" ? 600 : 400,
        color: disabled ? "#8B95A1" : "#191F28",
        padding: 0,
        width: "100%",
        boxSizing: "border-box" as const,
      }
    : {
        flex: 1,
        border: "none",
        outline: "none",
        backgroundColor: "transparent",
        fontSize: 18,
        color: disabled ? "var(--muted)" : "var(--fg)",
        padding: 0,
        width: "100%",
        boxSizing: "border-box" as const,
      };

  const affixStyle: React.CSSProperties = isToss
    ? {
        fontSize: 16,
        color: "#8B95A1",
        flexShrink: 0,
      }
    : {
        fontSize: 16,
        color: "var(--muted)",
        flexShrink: 0,
      };

  const helpStyle: React.CSSProperties = isToss
    ? {
        fontSize: 13,
        color: hasError ? "#F04452" : "#8B95A1",
        marginTop: 4,
      }
    : {
        fontSize: 12,
        color: hasError ? "#ef4444" : "var(--muted)",
        marginTop: 4,
      };

  return (
    <div className={className} style={{ ...containerStyle, ...style }}>
      {label && showLabel && <label style={labelStyle}>{label}</label>}
      <div style={inputWrapperStyle}>
        {prefix && <span style={affixStyle}>{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          inputMode={inputMode}
          style={inputStyle}
        />
        {suffix && <span style={affixStyle}>{suffix}</span>}
      </div>
      {help && <div style={helpStyle}>{help}</div>}
    </div>
  );
}

export default TDSTextField;
