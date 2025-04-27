import { useEffect, useMemo, useState } from 'react';
import { round10 } from '@/utils/decimalAdjust';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

type ChartDataPoint = {
  name: string,
  value: string
};

interface BarChartProps {
  data?: {
    [year: string]: Array<ChartDataPoint>;
  };
  title?: string;
};

function BarChart({ data = {}, title = 'Overview' }: BarChartProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [activeIndex, setActiveIndex] = useState<number | null | undefined>(null);
  const [disable, setDisable] = useState(false);
  const barColor = "#D9C9C5"; 
  
  const years = useMemo(() => {
    return Object.keys(data).sort((a, b) => parseInt(b) - parseInt(a));
  }, [data]);

  const { hasNegativeValues, minValue, maxValue, isEmpty } = useMemo(() => {
    if (!data || !data[selectedYear] || data[selectedYear].length === 0 || 
        data[selectedYear].every(item => parseFloat(item.value) == 0)) {
      return {
        hasNegativeValues: false,
        minValue: 0,
        maxValue: 0,
        isEmpty: true
      };
    }
    
    const values = data[selectedYear].map(item => Number(item.value));
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    return {
      hasNegativeValues: min < 0,
      minValue: min,
      maxValue: max,
      isEmpty: false
    };
  }, [data, selectedYear]);
  
  useEffect(() => {
    setDisable(isEmpty);
  }, [isEmpty]);

  const handlePrevYear = () => {
    const currentIndex = years.indexOf(selectedYear.toString());
    if (currentIndex < years.length - 1) {
      setSelectedYear(parseInt(years[currentIndex + 1]));
    }
  };

  const handleNextYear = () => {
    const currentIndex = years.indexOf(selectedYear.toString());
    if (currentIndex > 0) {
      setSelectedYear(parseInt(years[currentIndex - 1]));
    }
  };

  const hasPrevYear = years.indexOf(selectedYear.toString()) < years.length - 1;
  const hasNextYear = years.indexOf(selectedYear.toString()) > 0;

  return (
    <div className="w-full max-w-[720px] bg-green-500 rounded-xl outline-2 outline-green-300 inline-flex flex-col justify-start items-start">
      <div className="self-stretch p-6 flex flex-row justify-between items-center">
        <div className="text-start text-beige-100 text-xl font-bold leading-normal">{title}</div>
        <div className="flex items-center">
          <button 
            onClick={handlePrevYear}
            disabled={!hasPrevYear}
            className={`text-beige-100 mr-2 p-1 rounded hover:bg-midnight ${!hasPrevYear ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <FiChevronLeft size={24} />
          </button>
          <div className="text-beige-100 text-xl font-bold px-2">{selectedYear}</div>
          <button 
            onClick={handleNextYear}
            disabled={!hasNextYear}
            className={`text-beige-100 ml-2 p-1 rounded hover:bg-midnight ${!hasNextYear ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <FiChevronRight size={24} />
          </button>
        </div>
      </div>
      { disable ? (
        <div className='w-full h-full flex text-4xl mb-10 text-beige-100 justify-center items-center'>No sales data for {selectedYear}</div>
      ) : (
        <div className="w-full h-96 px-2 sm:px-6 pb-6">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={data[selectedYear]}
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
                stroke='#253140'
              />
              <YAxis 
                tick={{ fill: '#D9C9C5', fontSize: 12, fontFamily: 'Satoshi' }}
                tickFormatter={(value) => `${value}c`}
                width={40}
                domain={[
                  hasNegativeValues ? round10(minValue * 1.1,2) : 0,
                  maxValue > 0 ? round10(maxValue * 1.1, 2) : 10
                ]}
                stroke='#253140'
              />
              {hasNegativeValues && (
                <ReferenceLine y={0} stroke="#62C7AB" strokeWidth={2} />
              )}
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
      )}
    </div>
  );
}

export default BarChart;