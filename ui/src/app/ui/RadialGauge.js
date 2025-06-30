const RadialGauge = ({
  value = 0,
  unit = "",
  icon: Icon = () => null,
  size = 50,
  thresholdColors = {
    low: "#22c55e", // green-500
    mid: "#facc15", // yellow-400
    high: "#ef4444", // red-500
  },
}) => {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const safeValue = Number.isFinite(value) ? value : 0;
  const progress = Math.min(100, Math.max(0, safeValue));
  const offset = circumference - (progress / 100) * circumference;

  const color = getColor(progress, thresholdColors);

  return (
    <div className="flex flex-col items-center justify-center text-xs">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            stroke="#1f2937" // gray-700
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 gap-[1px] flex flex-col items-center justify-center text-white text-[0.6rem] font-light">
          <Icon className="text-base" />
          <span>{Number.isFinite(value) ? unit : "N/A"}</span>
        </div>
      </div>
    </div>
  );
};

function getColor(value, colors) {
  if (value < 50) return colors.low;
  if (value < 80) return colors.mid;
  return colors.high;
}

export default RadialGauge;