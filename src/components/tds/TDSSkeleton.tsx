import { isTossEnvironment } from "../../utils/env";

interface TDSSkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: number;
  pattern?: "text" | "circle" | "card" | "listItem";
  repeat?: number;
  style?: React.CSSProperties;
}

export function TDSSkeleton({
  width = "100%",
  height = 16,
  borderRadius = 8,
  pattern,
  repeat = 1,
  style,
}: TDSSkeletonProps) {
  const isToss = isTossEnvironment();
  const bgColor = isToss ? "#F2F4F6" : "var(--card, #f3f4f6)";

  if (pattern === "circle") {
    const size = typeof height === "number" ? height : 48;
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: bgColor,
          animation: "tds-skeleton-pulse 1.5s ease-in-out infinite",
          ...style,
        }}
      />
    );
  }

  if (pattern === "listItem") {
    return (
      <>
        {Array.from({ length: repeat }).map((_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: isToss ? "12px 24px" : "12px 20px",
              borderBottom: i < repeat - 1
                ? `1px solid ${isToss ? "#F2F4F6" : "var(--border, #f3f4f6)"}`
                : "none",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: bgColor,
                flexShrink: 0,
                animation: "tds-skeleton-pulse 1.5s ease-in-out infinite",
              }}
            />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  width: "60%",
                  height: 14,
                  borderRadius: 4,
                  backgroundColor: bgColor,
                  animation: "tds-skeleton-pulse 1.5s ease-in-out infinite",
                  animationDelay: "0.1s",
                }}
              />
              <div
                style={{
                  width: "40%",
                  height: 12,
                  borderRadius: 4,
                  backgroundColor: bgColor,
                  animation: "tds-skeleton-pulse 1.5s ease-in-out infinite",
                  animationDelay: "0.2s",
                }}
              />
            </div>
          </div>
        ))}
        <style>{`
          @keyframes tds-skeleton-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </>
    );
  }

  if (pattern === "card") {
    return (
      <>
        <div
          style={{
            width,
            height: typeof height === "number" ? height : 120,
            borderRadius: isToss ? 16 : 12,
            backgroundColor: bgColor,
            animation: "tds-skeleton-pulse 1.5s ease-in-out infinite",
            ...style,
          }}
        />
        <style>{`
          @keyframes tds-skeleton-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          style={{
            width,
            height,
            borderRadius,
            backgroundColor: bgColor,
            animation: "tds-skeleton-pulse 1.5s ease-in-out infinite",
            animationDelay: `${i * 0.1}s`,
            marginBottom: i < repeat - 1 ? 8 : 0,
            ...style,
          }}
        />
      ))}
      <style>{`
        @keyframes tds-skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}

export default TDSSkeleton;
