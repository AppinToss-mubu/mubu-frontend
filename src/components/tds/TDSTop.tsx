import { isTossEnvironment } from "../../utils/env";

interface TDSTopProps {
  title: string;
  subtitle?: string;
  subtitlePosition?: "top" | "bottom";
  right?: React.ReactNode;
  upperGap?: number;
  lowerGap?: number;
  titleSize?: number;
  style?: React.CSSProperties;
}

export function TDSTop({
  title,
  subtitle,
  subtitlePosition = "bottom",
  right,
  upperGap = 24,
  lowerGap = 24,
  titleSize = 24,
  style,
}: TDSTopProps) {
  const isToss = isTossEnvironment();

  const containerStyle: React.CSSProperties = {
    padding: isToss ? `${upperGap}px 24px ${lowerGap}px` : `${upperGap}px 20px ${lowerGap}px`,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    ...style,
  };

  const titleStyle: React.CSSProperties = isToss
    ? {
        fontSize: titleSize,
        fontWeight: 700,
        color: "#191F28",
        lineHeight: 1.35,
        margin: 0,
      }
    : {
        fontSize: titleSize > 24 ? 22 : titleSize,
        fontWeight: 700,
        color: "var(--fg, #191F28)",
        lineHeight: 1.35,
        margin: 0,
      };

  const subtitleStyle: React.CSSProperties = isToss
    ? {
        fontSize: 15,
        fontWeight: 500,
        color: "#8B95A1",
        lineHeight: 1.5,
        marginTop: subtitlePosition === "bottom" ? 8 : 0,
        marginBottom: subtitlePosition === "top" ? 8 : 0,
      }
    : {
        fontSize: 14,
        color: "var(--muted, #8B95A1)",
        lineHeight: 1.5,
        marginTop: subtitlePosition === "bottom" ? 6 : 0,
        marginBottom: subtitlePosition === "top" ? 6 : 0,
      };

  return (
    <div style={containerStyle}>
      <div style={{ flex: 1 }}>
        {subtitle && subtitlePosition === "top" && (
          <div style={subtitleStyle}>{subtitle}</div>
        )}
        <h1 style={titleStyle} role="heading" aria-level={1}>
          {title}
        </h1>
        {subtitle && subtitlePosition === "bottom" && (
          <div style={subtitleStyle} role="heading" aria-level={2}>
            {subtitle}
          </div>
        )}
      </div>
      {right && <div style={{ flexShrink: 0, marginLeft: 16 }}>{right}</div>}
    </div>
  );
}

export default TDSTop;
