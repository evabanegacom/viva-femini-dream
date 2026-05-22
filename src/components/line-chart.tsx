import { ChartPoint } from "@/types/health-report-types";

function LineChart({
  data,
}: {
  data: ChartPoint[];
}) {
  const w = 620;
  const h = 180;

  const padL = 28;
  const padR = 16;
  const padT = 12;
  const padB = 32;

  const chartW = w - padL - padR;
  const chartH = h - padT - padB;

  const max = 10;

  const yGridLines = [0, 2, 4, 6, 8, 10];

  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-32 text-xs text-muted-foreground italic">
        No flow data recorded for this period.
      </div>
    );
  }

  const stepX =
    data.length > 1
      ? chartW / (data.length - 1)
      : chartW;

  // FIXED: use flowIntensity instead of object directly
  const pts = data.map((item, i) => [
    padL + i * stepX,
    padT +
      chartH -
      (item.flowIntensity / max) * chartH,
  ] as const);

  const path = pts
    .map((p, i) =>
      i === 0
        ? `M${p[0]},${p[1]}`
        : `L${p[0]},${p[1]}`
    )
    .join(" ");

  const area = `
    ${path}
    L${pts[pts.length - 1][0]},${padT + chartH}
    L${pts[0][0]},${padT + chartH}
    Z
  `;

  // FIXED: labels now come from item.date
  const labels = data.map((item) => {
    return new Date(item.date).toLocaleDateString(
      "en-US",
      {
        month: "2-digit",
        day: "2-digit",
      }
    );
  });

  const labelEvery = Math.max(
    1,
    Math.floor(data.length / 5)
  );

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-auto"
    >
      <defs>
        <linearGradient
          id="chartGrad"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="#F36F56"
            stopOpacity="0.18"
          />
          <stop
            offset="100%"
            stopColor="#F36F56"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>

      {/* Y gridlines + labels */}
      {yGridLines.map((y) => {
        const cy =
          padT +
          chartH -
          (y / max) * chartH;

        return (
          <g key={y}>
            <line
              x1={padL}
              x2={w - padR}
              y1={cy}
              y2={cy}
              stroke="#f0e8ee"
              strokeWidth="1"
              strokeDasharray="3 4"
            />

            <text
              x={padL - 4}
              y={cy + 3.5}
              textAnchor="end"
              fontSize="8"
              fill="#b0a0aa"
            >
              {y}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <path
        d={area}
        fill="url(#chartGrad)"
      />

      {/* Line */}
      <path
        d={path}
        fill="none"
        stroke="#FB3179"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Dots */}
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r="3.5"
          fill="white"
          stroke="#FB3179"
          strokeWidth="1.8"
        />
      ))}

      {/* X-axis labels */}
      {data.map((_, i) => {
        if (
          i % labelEvery !== 0 &&
          i !== data.length - 1
        ) {
          return null;
        }

        return (
          <text
            key={i}
            x={padL + i * stepX}
            y={h - 6}
            textAnchor="middle"
            fontSize="8"
            fill="#b0a0aa"
          >
            {labels[i]}
          </text>
        );
      })}
    </svg>
  );
}

export default LineChart;