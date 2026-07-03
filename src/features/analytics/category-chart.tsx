'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface CategoryChartProps {
  data: { name: string; accuracy: number }[]
}

export function CategoryChart({ data }: CategoryChartProps) {
  const getColor = (accuracy: number) => {
    if (accuracy >= 80) return 'oklch(0.55 0.15 165)' // green-ish accent
    if (accuracy >= 60) return 'oklch(0.55 0.22 265)' // primary
    return 'oklch(0.577 0.245 27.325)' // destructive
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
        <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value: number) => [`${value}%`, 'Accuracy']}
          contentStyle={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 13,
          }}
        />
        <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={getColor(entry.accuracy)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}