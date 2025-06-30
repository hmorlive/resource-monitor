
const DEFAULT_THRESHOLD_COLORS = {
  low: "bg-emerald-500",
  mid: "bg-amber-500",
  high: "bg-red-500",
};

function LineGauge({ label, icon = () => null, value, unit, thresholdColors = DEFAULT_THRESHOLD_COLORS, width = "" }) {
  const calculateColor = (value) => {
    if (value < 50) return thresholdColors.low;
    if (value < 80) return thresholdColors.mid;
    return thresholdColors.high;
  };

  const Icon = icon;

  return (
    <div className={`flex flex-col items-center rounded-lg px-2 w-full gap-1 ${width}`}>
      <h2 className="text-xs font-extrabold flex gap-1 items-center justify-center">
        <Icon />
        {label}
      </h2>
      <div className="relative w-32 h-1 overflow-hidden bg-black bg-opacity-60 rounded-full shadow shadow-zinc-600">
        {/* Gauge Fill */}
        <div
          className={`absolute top-0 left-0 w-full h-full origin-bottom transition-all duration-300 ${calculateColor(value)}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
      <div className="rounded-t-full flex items-center justify-center text-gray-200">
        <span className="text-xs flex font-semibold">{unit ? unit : `${value}%`}</span>
      </div>
    </div>
  );
}

const calculateGaugeValue = (temp) => {
  if (temp <= MIN_TEMP) return 0; // Below minimum, set to 0%
  if (temp >= MAX_TEMP) return 100; // Above maximum, set to 100%

  // Normalize the temperature to a percentage
  return ((temp - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)) * 100;
};

export default LineGauge;