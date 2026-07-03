"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CategoryDistributionChartProps {
  data: { name: string; count: number }[];
}

const COLORS = [
  "oklch(0.55 0.22 265)",
  "oklch(0.55 0.15 165)",
  "oklch(0.65 0.2 40)",
  "oklch(0.6 0.2 320)",
  "oklch(0.6 0.18 200)",
  "oklch(0.577 0.245 27)",
];

export function CategoryDistributionChart({
  data,
}: CategoryDistributionChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
        No questions created yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={(entry: { name?: string; count?: number }) =>
            `${entry.name}: ${entry.count}`
          }
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 13,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
