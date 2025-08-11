'use client';

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  TooltipItem
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

interface PopulationChartProps {
  years: string[];
  populationValues: (number | undefined)[];
  carValues: (number | undefined)[];
}

function toBase100(values: (number | undefined)[]): number[] {
  const base = values.find(v => typeof v === 'number' && v > 0) ?? 1;
  return values.map(v =>
    typeof v === 'number' && v > 0 ? (v / base) * 100 : NaN
  );
}

export default function PopulationChart({
  years,
  populationValues,
  carValues
}: PopulationChartProps) {
  const popIdx = toBase100(populationValues);
  const carIdx = toBase100(carValues);

  return (
    <Line
      data={{
        labels: years,
        datasets: [
          {
            label: 'Population',
            data: popIdx,
            fill: false,
            borderColor: 'rgb(59,130,246)',
            tension: 0.3,
            pointRadius: 3,
            spanGaps: true
          },
          {
            label: 'Vehicle registrations',
            data: carIdx,
            fill: false,
            borderColor: 'rgb(34,197,94)',
            tension: 0.3,
            pointRadius: 3,
            spanGaps: true
          }
        ]
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (ctx: TooltipItem<'line'>) => {
                const i = ctx.dataIndex;
                if (ctx.datasetIndex === 0) {
                  const raw = populationValues[i];
                  return raw != null
                    ? `Population: ${raw.toLocaleString()} actual`
                    : '';
                } else {
                  const raw = carValues[i];
                  return raw != null
                    ? `Vehicles (VIC): ${raw.toLocaleString()} actual`
                    : '';
                }
              },
              footer: () => 'Index base = first non-zero value in each series'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            title: { display: true, text: 'Index (base = 100)' }
          }
        }
      } as ChartOptions<'line'>}
    />
  );
}