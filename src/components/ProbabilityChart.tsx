import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ProbabilityChartProps {
  probabilities?: Record<string, number> | null;
  isUncertain?: boolean;
}

const FIVE_CLASSES = [
  'No DR',
  'Mild DR',
  'Moderate DR',
  'Severe DR',
  'Proliferative DR',
];

const COLOR_MAP: Record<string, string> = {
  'No DR': '#087443',          // Healthy Green
  'Mild DR': '#F59E0B',        // Light/Soft Orange
  'Moderate DR': '#C76B00',    // Primary Orange
  'Severe DR': '#D32F2F',      // Primary Red
  'Proliferative DR': '#9B1C1C',// Deep Red
};

export const ProbabilityChart: React.FC<ProbabilityChartProps> = ({ probabilities, isUncertain }) => {
  if (!probabilities || Object.keys(probabilities).length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-xl border border-medical-border bg-medical-bg text-xs text-medical-text-muted">
        No class probabilities available from inference model.
      </div>
    );
  }

  // Ensure all 5 classes are displayed in clinical sequence
  const data = FIVE_CLASSES.map((cls) => {
    const rawVal = probabilities[cls] ?? 0;
    const pct = rawVal <= 1 ? rawVal * 100 : rawVal;
    return {
      name: cls,
      percentage: Number(pct.toFixed(1)),
      color: COLOR_MAP[cls] || '#087443',
    };
  });

  return (
    <div className="w-full space-y-2">
      {isUncertain && (
        <div className="rounded-xl border border-medorange-primary/30 bg-medorange-light p-2.5 text-xs text-medorange-dark font-medium">
          Note: Distribution does not show a clear majority class.
        </div>
      )}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 35, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              stroke="#94A3B8"
              unit="%"
              tick={{ fontSize: 11, fill: '#64748B' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#94A3B8"
              width={125}
              tick={{ fontSize: 12, fill: '#0D3B66', fontWeight: 600 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#D9E2EC',
                borderRadius: '0.75rem',
                color: '#0D3B66',
                fontSize: '12px',
                fontWeight: '600',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              }}
              formatter={(value: any) => [`${value}%`, 'Class Probability']}
            />
            <Bar dataKey="percentage" radius={[0, 6, 6, 0]} barSize={16}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
