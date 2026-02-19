import { isTossEnvironment } from "../../utils/env";

interface TDSBadgeProps {
  children: React.ReactNode;
  color: "blue" | "teal" | "green" | "red" | "yellow" | "elephant";
  variant: "fill" | "weak";
  size?: "xsmall" | "small" | "medium" | "large";
  style?: React.CSSProperties;
}

const colorMap = {
  blue: { fill: { bg: "#3182F6", fg: "#FFFFFF" }, weak: { bg: "#E8F3FF", fg: "#3182F6" } },
  teal: { fill: { bg: "#18A5A5", fg: "#FFFFFF" }, weak: { bg: "#EDF8F8", fg: "#18A5A5" } },
  green: { fill: { bg: "#03B26C", fg: "#FFFFFF" }, weak: { bg: "#F0FAF6", fg: "#03B26C" } },
  red: { fill: { bg: "#F04452", fg: "#FFFFFF" }, weak: { bg: "#FFEEEE", fg: "#F04452" } },
  yellow: { fill: { bg: "#FFC342", fg: "#191F28" }, weak: { bg: "#FFF9E7", fg: "#E45600" } },
  elephant: { fill: { bg: "#8B95A1", fg: "#FFFFFF" }, weak: { bg: "#F2F4F6", fg: "#6B7684" } },
};

const sizeMap = {
  xsmall: { padding: "2px 6px", fontSize: 11, borderRadius: 4 },
  small: { padding: "3px 8px", fontSize: 12, borderRadius: 6 },
  medium: { padding: "4px 10px", fontSize: 13, borderRadius: 8 },
  large: { padding: "5px 12px", fontSize: 14, borderRadius: 8 },
};

export function TDSBadge({
  children,
  color,
  variant,
  size = "small",
  style,
}: TDSBadgeProps) {
  const isToss = isTossEnvironment();
  const colorStyle = colorMap[color][variant];
  const sizeStyle = sizeMap[size];

  if (!isToss) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: sizeStyle.padding,
          fontSize: sizeStyle.fontSize,
          borderRadius: sizeStyle.borderRadius,
          backgroundColor: colorStyle.bg,
          color: colorStyle.fg,
          fontWeight: 600,
          lineHeight: 1,
          ...style,
        }}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        borderRadius: sizeStyle.borderRadius,
        backgroundColor: colorStyle.bg,
        color: colorStyle.fg,
        fontWeight: 600,
        lineHeight: 1,
        letterSpacing: -0.2,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export default TDSBadge;
