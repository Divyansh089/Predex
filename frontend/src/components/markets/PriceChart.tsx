import { useState } from 'react';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Outcome } from '@/lib/data';

interface PriceChartProps {
  outcomes: Outcome[];
}

const timeFilters = ['1H', '6H', '1D', '1W', '1M', 'ALL'] as const;

// Generate dummy price history
const generatePriceHistory = (currentPrice: number) => {
  const data = [];
  const basePrice = currentPrice - 30;
  for (let i = 0; i < 30; i++) {
    const variance = Math.random() * 40 - 20;
    const price = Math.max(5, Math.min(95, basePrice + (i / 30) * 30 + variance));
    data.push({
      time: `Day ${i + 1}`,
      price: Math.round(price),
    });
  }
  // Ensure last point matches current price
  data[data.length - 1].price = currentPrice;
  return data;
};

export default function PriceChart({ outcomes }: PriceChartProps) {
  const [selectedTime, setSelectedTime] = useState<typeof timeFilters[number]>('1M');

  const mainOutcome = outcomes[0];
  const priceData = generatePriceHistory(mainOutcome.probability);

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        {outcomes.map((outcome, index) => (
          <div key={outcome.id} className="flex items-center gap-2">
            <div
              className={cn(
                "w-3 h-3 rounded-full",
                index === 0 ? "bg-chart-up" : index === 1 ? "bg-chart-down" : "bg-chart-neutral"
              )}
            />
            <span className="text-sm">
              {outcome.label} <span className="font-semibold">{outcome.probability}%</span>
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceData}>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `${value}%`}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value}%`, 'Price']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--chart-up))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Time Filters */}
      <div className="flex items-center justify-end gap-1 mt-4">
        {timeFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedTime(filter)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
              selectedTime === filter
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
