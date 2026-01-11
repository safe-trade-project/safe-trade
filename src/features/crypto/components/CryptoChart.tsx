import { useEffect, useMemo, useRef, useState, useId } from "react";
import {
  Brush,
  CartesianGrid,
  Area,
  AreaChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

type ChartPoint = {
  time: number;
  price: number;
};

type HoverPos = {
  xVal?: number;
  yVal?: number;
};

type ChartBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type BrushHandle = {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function CryptoChart({ data }: { data: ChartPoint[] }) {
  const id = useId();

  const [hoverPos, setHoverPos] = useState<HoverPos>({});

  const [mouseXLabel, setMouseXLabel] = useState<number | undefined>(undefined);
  const [mouseYValue, setMouseYValue] = useState<number | undefined>(undefined);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const chartAreaRef = useRef<ChartBox | null>(null);

  const { minPrice, maxPrice, yMin, yMax } = useMemo(() => {
    const minPrice = Math.min(...data.map((p) => p.price));
    const maxPrice = Math.max(...data.map((p) => p.price));
    const pad = (maxPrice - minPrice) * 0.12 || 1;
    return {
      minPrice,
      maxPrice,
      yMin: minPrice - pad,
      yMax: maxPrice + pad,
    };
  }, [data]);

  const updateChartBoxFromDOM = () => {
    const root = rootRef.current;
    if (!root) return;

    const svg = root.querySelector("svg");
    if (!svg) return;

    const rect = svg.querySelector("defs clipPath rect") as SVGRectElement | null;
    if (!rect) return;

    const left = Number(rect.getAttribute("x"));
    const top = Number(rect.getAttribute("y"));
    const width = Number(rect.getAttribute("width"));
    const height = Number(rect.getAttribute("height"));

    if ([left, top, width, height].every((num) => Number.isFinite(num)) && width > 0 && height > 0) {
      chartAreaRef.current = { left, top, width, height };
    }
  };

  useEffect(() => {
    updateChartBoxFromDOM();

    const root = rootRef.current;
    if (!root) return;

    const ro = new ResizeObserver(() => updateChartBoxFromDOM());
    ro.observe(root);

    return () => ro.disconnect();
  }, []);

  function yFromActiveY(activeY: number): number | undefined {
    const plot = chartAreaRef.current;
    if (!plot) return undefined;

    let yInPlot: number;

    if (activeY >= plot.top && activeY <= plot.top + plot.height) {
      yInPlot = activeY - plot.top;
    } else {
      yInPlot = activeY;
    }

    const yClamped = Math.max(0, Math.min(yInPlot, plot.height));
    const ratio = yClamped / plot.height;

    return yMax - ratio * (yMax - yMin);
  }

  function BrushHandle({ x, y, width, height }: BrushHandle) {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="#101010"
          stroke="#0A8DC7"
          strokeWidth={1}
        />
        <line x1={x + width / 2} y1={y + 6} x2={x + width / 2} y2={y + height - 6} stroke="#9ca3af" strokeWidth={2} opacity={0.7} />
        <line x1={x + width / 2 - 3} y1={y + 8} x2={x + width / 2 - 3} y2={y + height - 8} stroke="#9ca3af" strokeWidth={1} opacity={0.5} />
        <line x1={x + width / 2 + 3} y1={y + 8} x2={x + width / 2 + 3} y2={y + height - 8} stroke="#9ca3af" strokeWidth={1} opacity={0.5} />
      </g>
    );
  }

  const [brushRange, setBrushRange] = useState<{ startIndex: number; endIndex: number } | null>(null);

  const brushValues = useMemo(() => {
    const startIndex = (data[brushRange?.startIndex ?? 0]).time;
    const endIndex = (data[brushRange?.endIndex ?? data.length - 1]).time;

    return {
      start: startIndex ? new Date(startIndex).toLocaleDateString() : "ERROR: invalid range",
      end: endIndex ? new Date(endIndex).toLocaleDateString() : "ERROR: invalid range",
    };
  }, [brushRange, data]);

  const [brushWidth, setBrushWidth] = useState<number>(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const getW = () => {
      const svg = root.querySelector("svg");
      if (!svg) return;

      const brushBg = svg.querySelector(".recharts-brush > rect:nth-child(1)") as SVGRectElement | null;
      const width = brushBg?.getAttribute("width");
      const w = width ? Number(width) : NaN;

      Number.isFinite(w) && w > 0 && setBrushWidth(w);
    };

    const raf = requestAnimationFrame(getW);

    const ro = new ResizeObserver(() => getW());
    ro.observe(root);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="w-full flex flex-col" ref={rootRef}>
      <ResponsiveContainer width="100%" aspect={2}>
        <AreaChart
          data={data}
          syncId={id}
          onMouseMove={(state: unknown) => {
            if (!chartAreaRef.current) updateChartBoxFromDOM();

            const typedState = state as {
              activeTooltipIndex?: number;
              activeLabel?: number | string;
              activeCoordinate?: {
                x?: number;
                y?: number;
              }
            };

            const label = typedState.activeLabel;
            setMouseXLabel(typeof label === "number" ? label : undefined);

            const activey = typedState?.activeCoordinate?.y;
            if (typeof activey === "number") {
              const val = yFromActiveY(activey);
              setMouseYValue(val);
            } else {
              setMouseYValue(undefined);
            }

            const index = typedState.activeTooltipIndex;
            if (typeof index === "number" && data[index]) {
              setHoverPos({ xVal: data[index].time, yVal: data[index].price });
              return;
            }

            if (typeof label === "number" || typeof label === "string") {
              const timeVal = typeof label === "string" ? Number(label) : label;
              const point = data.find((d) => d.time === timeVal);
              if (point) {
                setHoverPos({ xVal: point.time, yVal: point.price });
                return;
              }
            }

            setHoverPos({});
          }}
          onMouseLeave={() => {
            setHoverPos({});
            setMouseXLabel(undefined);
            setMouseYValue(undefined);
          }}
        >
          <defs>
            <linearGradient id={`colorChart-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#05d3f2" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#000000" stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis
            dataKey="price"
            width={100}
            tickCount={40}
            textAnchor="end"
            tickFormatter={(v) => Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            domain={[yMin, yMax]}
          />
          <XAxis
            dataKey="time"
            height={85}
            angle={-55}
            textAnchor="end"
            tickFormatter={(ms) => new Date(ms).toLocaleDateString()}
          />
          <Tooltip
            cursor={false}
            wrapperStyle={{ pointerEvents: "none" }}
            contentStyle={{
              backgroundColor: "#00000099",
              border: "1px solid grey",
              borderRadius: 2,
              padding: "10px 10px",
            }}
            labelStyle={{ color: "#e5e7eb" }}
            itemStyle={{ color: "#e5e7eb" }}
            labelFormatter={(value) => `date: ${new Date(Number(value)).toLocaleString()}`}
            formatter={(value) => [`$${Number(value).toLocaleString()}`, "price"]}
          />
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
          {/*vertical={false} horizontal={false}*/}
          {hoverPos.xVal !== undefined &&
            <ReferenceLine
              x={hoverPos.xVal}
              stroke="grey"
              strokeDasharray="3 2"
            />
          }
          {mouseYValue !== undefined && (
            <ReferenceLine
              y={mouseYValue}
              stroke="grey"
              strokeDasharray="3 2"
              label={{
                position: "insideBottomLeft",
                value: `$${mouseYValue.toFixed(2)}`,
                fill: "#e5e7eb",
                fontSize: 12,
              }}
            />
          )}
          {mouseXLabel !== undefined && (
            <ReferenceLine
              x={mouseXLabel}
              stroke="transparent"
              label={{
                position: "insideBottomLeft",
                value: new Date(mouseXLabel).toLocaleString(),
                fill: "#e5e7eb",
                fontSize: 12,
              }}
            />
          )}
          {
            // (w Area)
            //activeDot={false}
          }
          <Area
            type="monotone"
            dataKey="price"
            dot={false}
            stroke="#05d3f2"
            strokeWidth={1.5}
            fill={`url(#colorChart-${id})`}
          />
          <Brush
            dataKey="time"
            height={34}
            stroke="#0A8DC7"
            fill="#0A0A0A05"
            travellerWidth={10}
            traveller={BrushHandle}
            tickFormatter={() => ""}
            onChange={(range) => {
              if (!range) return;

              setBrushRange({ startIndex: range.startIndex, endIndex: range.endIndex });
            }}
          />
          <ReferenceLine
            y={maxPrice}
            stroke="#22c55e"
            strokeDasharray="1 3"
            label={{
              value: `1Y MAX: $${maxPrice.toLocaleString()}`,
              position: "insideBottomRight",
              fill: "#22c55e",
              fontSize: 12,
            }}
          />
          <ReferenceLine
            y={minPrice}
            stroke="#f50000"
            strokeDasharray="1 3"
            label={{
              value: `1Y MIN: $${minPrice.toLocaleString()}`,
              position: "insideBottomRight",
              fill: "#f50000",
              fontSize: 12,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div style={{ width: `${brushWidth}px` }} className="ml-auto mr-1 flex items-center justify-between text-xs text-gray-300">
        <p>{brushValues.start}</p>
        <p>{brushValues.end}</p>
      </div>
    </div >
  );
}

