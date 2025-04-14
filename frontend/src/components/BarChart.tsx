import { useState } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface DataPoint {
  name: string;
  value: number;
}

interface BarChartProps {
  data?: DataPoint[];
  title?: string;
}

function BarChart({ data, title = 'Overview' }: BarChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null | undefined>(null);
  
  const barColor = "#D9C9C5"; 
  
  return (
    <div className="w-full max-w-[720px] bg-green-500 rounded-xl outline-2 outline-green-300 inline-flex flex-col justify-start items-start">
      <div className="self-stretch h-16 p-6 flex flex-col justify-center">
          <div className="text-start text-beige-100 text-xl font-bold leading-normal">{title}</div>
      </div>
      <div className="w-full h-96 px-2 sm:px-6 pb-6">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{
              top: 20,
              right: 10,
              left: 0,
              bottom: 5,
            }}
            onMouseMove={(state) => {
              if (state.isTooltipActive) {
                setActiveIndex(state.activeTooltipIndex);
              } else {
                setActiveIndex(null);
              }
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#253140" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#D9C9C5', fontSize: 12, fontFamily: 'Satoshi' }}
              tickMargin={5}
              interval="preserveStartEnd"
            />
            <YAxis 
              tick={{ fill: '#D9C9C5', fontSize: 12, fontFamily: 'Satoshi' }}
              tickFormatter={(value) => `${value}c`}
              width={40}
            />
            <Tooltip 
              cursor={{ fill: '#253140' }}
              contentStyle={{ backgroundColor: '#253140', border: '1px solid #62C7AB', borderRadius: '8px' }}
              labelStyle={{ color: '#D9C9C5' }}
              itemStyle={{ color: '#D9C9C5' }}
              formatter={(value) => [value, 'coins']}
            />
            <Bar 
              dataKey="value" 
              fill={barColor}
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BarChart;