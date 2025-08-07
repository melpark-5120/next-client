'use client';

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
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
  populationValues: number[];
  carValues: number[];
}

export default function PopulationChart({
  years,
  populationValues,
  carValues
}: PopulationChartProps) {
  return (
    <Line
      data={{
        labels: years,
        datasets: [
          {
            label: 'Population',
            data: populationValues,
            fill: false,
            borderColor: 'rgb(59,130,246)',
            tension: 0.3,
            pointRadius: 3
          },
          {
            label: 'Car Ownership',
            data: carValues,
            fill: false,
            borderColor: 'rgb(34,197,94)',
            tension: 0.3,
            pointRadius: 3
          }
        ]
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          y: { beginAtZero: false }
        }
      }}
    />
  );
}
