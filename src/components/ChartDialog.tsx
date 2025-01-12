import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { X } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDialogProps {
  onClose: () => void;
  data: string[][];
  selectedRange: { startRow: number; startCol: number; endRow: number; endCol: number } | null;
}

export function ChartDialog({ onClose, data, selectedRange }: ChartDialogProps) {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');

  if (!selectedRange) return null;

  const { startRow, startCol, endRow, endCol } = selectedRange;
  
  // Extract labels (first row or column)
  const labels = data[startRow].slice(startCol, endCol + 1);
  
  // Extract data (remaining rows)
  const datasets = [];
  for (let i = startRow + 1; i <= endRow; i++) {
    datasets.push({
      label: `Series ${i - startRow}`,
      data: data[i].slice(startCol, endCol + 1).map(val => Number(val) || 0),
      borderColor: `hsl(${(i - startRow) * 60}, 70%, 50%)`,
      backgroundColor: `hsla(${(i - startRow) * 60}, 70%, 50%, 0.5)`,
    });
  }

  const chartData = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Data Visualization',
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[800px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Chart Visualization</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Type
          </label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as 'line' | 'bar' | 'pie')}
            className="w-full border rounded p-2"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>

        <div className="h-[400px]">
          {chartType === 'line' && <Line options={options} data={chartData} />}
          {chartType === 'bar' && <Bar options={options} data={chartData} />}
          {chartType === 'pie' && <Pie data={chartData} />}
        </div>
      </div>
    </div>
  );
}