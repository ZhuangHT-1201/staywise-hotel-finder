import { useId } from "react";
import { useLanguage } from "../i18n";

function buildPath(points, width, height, padding) {
  if (!points.length) return "";
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = Math.max(1, max - min);
  const step = (width - padding * 2) / Math.max(1, points.length - 1);

  return points
    .map((point, index) => {
      const x = padding + step * index;
      const y = height - padding - ((point - min) / range) * (height - padding * 2);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function PriceChart({ values, compact = false, labels = [] }) {
  const { bi } = useLanguage();
  const gradientId = useId().replaceAll(":", "");
  const width = 680;
  const height = compact ? 94 : 224;
  const padding = compact ? 8 : 26;
  const path = buildPath(values, width, height, padding);
  const areaPath = path
    ? `${path} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`
    : "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const average = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  const avgY =
    height -
    padding -
    ((average - min) / Math.max(1, max - min)) * (height - padding * 2);
  const lastX = width - padding;
  const lastY =
    height -
    padding -
    ((values.at(-1) - min) / Math.max(1, max - min)) * (height - padding * 2);

  return (
    <div className={`price-chart ${compact ? "price-chart--compact" : ""}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`价格走势，最低 ¥${min}，最高 ¥${max}`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff715b" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#ff715b" stopOpacity="0" />
          </linearGradient>
        </defs>

        {!compact && (
          <g className="chart-grid">
            {[0.25, 0.5, 0.75].map((ratio) => (
              <line
                key={ratio}
                x1={padding}
                x2={width - padding}
                y1={padding + (height - padding * 2) * ratio}
                y2={padding + (height - padding * 2) * ratio}
              />
            ))}
            <line
              className="chart-average"
              x1={padding}
              x2={width - padding}
              y1={avgY}
              y2={avgY}
            />
          </g>
        )}

        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path className="chart-line" d={path} />
        <circle className="chart-endpoint-halo" cx={lastX} cy={lastY} r="9" />
        <circle className="chart-endpoint" cx={lastX} cy={lastY} r="4.5" />
      </svg>

      {!compact && (
        <div className="chart-axis">
          <span>{labels[0]}</span>
          <span>{bi("近 14 天均价", "14-day average")} ¥{average}</span>
          <span>{labels.at(-1)}</span>
        </div>
      )}
    </div>
  );
}

