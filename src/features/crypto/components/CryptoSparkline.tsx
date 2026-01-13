import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import { useId } from "react";

export function CryptoSparkline({ prices }: { prices: number[] }) {
  const id = useId();

  const oldest = prices[0];
  const latest = prices[prices.length - 1];
  const color = latest > oldest ? "#16a34a" : latest < oldest ? "#dc2626" : "#9ca3af";

  const data = prices.map((price, index) => ({ index, price }));

  let yMin = 0, yMax = 1;

  if (prices.length > 0) {
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const pad = (maxPrice - minPrice) * 0.12;
    yMin = minPrice - pad;
    yMax = maxPrice + pad;
  }


  return (
    <div className="w-40 h-10">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`sparkline-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={[yMin, yMax]} />
          <Area
            type="monotone"
            dataKey="price"
            dot={false}
            activeDot={false}
            stroke={color}
            strokeWidth={2}
            fill={`url(#sparkline-${id})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

