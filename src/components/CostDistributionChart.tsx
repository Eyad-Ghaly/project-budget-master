import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CostDistributionChartProps {
  data: { name: string; value: number }[];
}

const COLORS = [
  'hsl(210, 80%, 55%)',
  'hsl(38, 90%, 55%)',
  'hsl(142, 60%, 45%)',
  'hsl(280, 60%, 55%)',
  'hsl(0, 72%, 55%)',
  'hsl(180, 60%, 45%)',
  'hsl(320, 60%, 55%)',
];

export function CostDistributionChart({ data }: CostDistributionChartProps) {
  return (
    <div className="glass-panel rounded-xl p-5">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
        Cost Distribution
      </h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid hsl(220, 14%, 85%)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'hsl(220, 20%, 12%)',
              }}
              formatter={(value: number) => new Intl.NumberFormat('en-US').format(value)}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', color: 'hsl(215, 15%, 55%)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
