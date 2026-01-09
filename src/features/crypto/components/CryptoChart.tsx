import { useState } from "react";
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

export function CryptoChart({ data }: { data: ChartPoint[] }) {
  const [hoverPos, setHoverPos] = useState<HoverPos>({});

  const maxPrice = Math.max(...data.map(p => p.price));
  const minPrice = Math.min(...data.map(p => p.price));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" aspect={3}>
        <AreaChart
          data={data}
          syncId="anyId"
          onMouseMove={(state: unknown) => {
            const typedState = state as {
              activeTooltipIndex?: number;
              activeLabel?: number | string;
            };

            const index = typedState.activeTooltipIndex;
            if (typeof index === "number" && data[index]) {
              setHoverPos({ xVal: data[index].time, yVal: data[index].price });
              return;
            }

            const label = typedState.activeLabel;
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
          onMouseLeave={() => setHoverPos({})}
        >
          <defs>
            <linearGradient id="colorChart" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#05d3f2" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#000000" stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis
            dataKey="price"
            width={110}
            tickCount={40}
            textAnchor="end"
            label={{ value: 'USD', position: 'insideTopLeft' }}
          />
          <XAxis
            dataKey="time"
            height={65}
            angle={-30}
            textAnchor="end"
            label={{ position: 'bottom' }}
            tickFormatter={(ms) => new Date(ms).toLocaleDateString()}
          />
          <Tooltip
            cursor={false}
            wrapperStyle={{ pointerEvents: "none" }}
            contentStyle={{
              backgroundColor: "#000000",
              border: "1px solid grey",
              borderRadius: 10,
              padding: "10px 10px",
            }}
            labelStyle={{ color: "#e5e7eb" }}
            itemStyle={{ color: "#e5e7eb" }}
            labelFormatter={(value) => `time: ${new Date(Number(value)).toLocaleString()}`}
            formatter={(value) => [`$${Number(value).toLocaleString()}`, "price"]}
          />
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
          {/*vertical={false} horizontal={false}*/}
          {hoverPos.xVal !== undefined && (<ReferenceLine x={hoverPos.xVal} stroke="grey" />)}
          {hoverPos.yVal !== undefined && (<ReferenceLine y={hoverPos.yVal} stroke="grey" />)}
          <Area
            type="monotone"
            dataKey="price"
            dot={false}
            activeDot={false}
            stroke="#05d3f2"
            strokeWidth={1.5}
            fill="url(#colorChart)"
          />
          <Brush
            dataKey="time"
            tickFormatter={(ms) => new Date(ms).toLocaleDateString()}
            stroke="#000000"
            fill="#0A8DC7"
            travellerWidth={10}
          />
          <ReferenceLine
            y={maxPrice}
            stroke="#22c55e"
            strokeDasharray="3 3"
            label={{
              value: `1Y MAX: $${maxPrice.toLocaleString()}`,
              position: "insideTopRight",
              fill: "#22c55e",
              fontSize: 12,
            }}
          />
          <ReferenceLine
            y={minPrice}
            stroke="#f50000"
            strokeDasharray="3 3"
            label={{
              value: `1Y MIN: $${minPrice.toLocaleString()}`,
              position: "insideTopRight",
              fill: "#f50000",
              fontSize: 12,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div >
  );
}

