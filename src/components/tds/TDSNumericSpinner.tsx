import { isTossEnvironment } from "../../utils/env";
import { useTDS } from "../../utils/tds";

interface TDSNumericSpinnerProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "tiny" | "small" | "medium" | "large";
  disabled?: boolean;
  decreaseAriaLabel?: string;
  increaseAriaLabel?: string;
  style?: React.CSSProperties;
  className?: string;
}

const tdsSizes = {
  tiny: { button: 24, fontSize: 13, gap: 8 },
  small: { button: 28, fontSize: 14, gap: 10 },
  medium: { button: 32, fontSize: 15, gap: 12 },
  large: { button: 40, fontSize: 18, gap: 16 },
};

export function TDSNumericSpinner({
  value,
  onChange,
  min = 0,
  max = 999,
  size = "medium",
  disabled = false,
  decreaseAriaLabel = "상품 수량 줄이기",
  increaseAriaLabel = "상품 수량 늘리기",
  style,
  className,
}: TDSNumericSpinnerProps) {
  const isToss = isTossEnvironment();
  const { tds, ready: tdsReady } = useTDS();

  if (isToss && tdsReady && tds?.NumericSpinner) {
    const { NumericSpinner } = tds;
    return (
      <NumericSpinner
        size={size}
        number={value}
        onNumberChange={onChange}
        minNumber={min}
        maxNumber={max}
        disable={disabled}
        decreaseAriaLabel={decreaseAriaLabel}
        increaseAriaLabel={increaseAriaLabel}
      />
    );
  }

  const sizeConfig = tdsSizes[size];

  const handleDecrease = () => {
    if (!disabled && value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (!disabled && value < max) {
      onChange(value + 1);
    }
  };

  const containerStyle: React.CSSProperties = isToss
    ? {
        display: "inline-flex",
        alignItems: "center",
        gap: sizeConfig.gap,
        padding: "4px 8px",
        borderRadius: 999,
        backgroundColor: "#F2F4F6",
        ...style,
      }
    : {
        display: "inline-flex",
        alignItems: "center",
        gap: sizeConfig.gap,
        padding: "8px 16px",
        borderRadius: 24,
        backgroundColor: "var(--bg)",
        border: "1px solid var(--border)",
        ...style,
      };

  const buttonBaseStyle: React.CSSProperties = {
    width: sizeConfig.button,
    height: sizeConfig.button,
    borderRadius: "50%",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: sizeConfig.fontSize,
    fontWeight: 500,
    transition: "background-color 0.15s, opacity 0.15s",
  };

  const buttonStyleToss = (isDisabled: boolean): React.CSSProperties => ({
    ...buttonBaseStyle,
    backgroundColor: isDisabled ? "#E5E8EB" : "#FFFFFF",
    color: isDisabled ? "#B0B8C1" : "#191F28",
    cursor: isDisabled ? "not-allowed" : "pointer",
    boxShadow: isDisabled ? "none" : "0 1px 2px rgba(0,0,0,0.08)",
  });

  const buttonStyleWeb = (isDisabled: boolean): React.CSSProperties => ({
    ...buttonBaseStyle,
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    color: isDisabled ? "var(--muted)" : "var(--fg)",
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.5 : 1,
  });

  const numberStyle: React.CSSProperties = isToss
    ? {
        minWidth: 32,
        textAlign: "center",
        fontSize: sizeConfig.fontSize + 2,
        fontWeight: 700,
        color: disabled ? "#B0B8C1" : "#191F28",
      }
    : {
        minWidth: 24,
        textAlign: "center",
        fontSize: sizeConfig.fontSize + 2,
        fontWeight: 700,
        color: "var(--fg)",
      };

  const isDecreaseDisabled = disabled || value <= min;
  const isIncreaseDisabled = disabled || value >= max;

  return (
    <div className={className} style={containerStyle}>
      <button
        onClick={handleDecrease}
        disabled={isDecreaseDisabled}
        aria-label={decreaseAriaLabel}
        style={isToss ? buttonStyleToss(isDecreaseDisabled) : buttonStyleWeb(isDecreaseDisabled)}
      >
        −
      </button>
      <span style={numberStyle} aria-live="polite">
        {value}
      </span>
      <button
        onClick={handleIncrease}
        disabled={isIncreaseDisabled}
        aria-label={increaseAriaLabel}
        style={isToss ? buttonStyleToss(isIncreaseDisabled) : buttonStyleWeb(isIncreaseDisabled)}
      >
        +
      </button>
    </div>
  );
}

export default TDSNumericSpinner;
