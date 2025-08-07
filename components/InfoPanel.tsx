'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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
import { useEffect, useState } from 'react';
import StatCard from './StatCard';
import PopulationChart from './PopulationChart'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

// 定义数据类型
interface SuburbData {
  name: string;
  population_by_year: Record<string, number>;
  car_ownership_by_year: Record<string, number>;
}

interface InfoPanelProps {
  suburbName: string | null;
}

export default function InfoPanel({ suburbName }: InfoPanelProps) {
  const [data, setData] = useState<SuburbData | null>(null);
  const [loading, setLoading] = useState(false);

  // 异步请求 suburb 数据
  useEffect(() => {
    if (!suburbName) return;
    setLoading(true);
    fetch(`/api/suburb/${suburbName}`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .finally(() => setLoading(false));
  }, [suburbName]);

  if (!suburbName) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Please select a suburb on the map.</p>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="p-4">
        <p>Loading data for {suburbName}...</p>
      </div>
    );
  }

  // 当前人口（默认取2025年），增长率（相较2021年）
  const currentPopulation = data.population_by_year['2025'];
  const previousPopulation = data.population_by_year['2021'];
  const growthRate = (
    ((currentPopulation - previousPopulation) / previousPopulation) *
    100
  ).toFixed(1);

  // 构建折线图用的数据
  const years = Object.keys(data.population_by_year);
  const populationValues = years.map((year) => data.population_by_year[year]);
  const carValues = years.map((year) => data.car_ownership_by_year[year]);

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <h2 className="text-2xl font-semibold">{data.name}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard title="Population (2025)" value={currentPopulation.toLocaleString()} />
        <StatCard title="Growth since 2021" value={`+${growthRate}%`} color="text-green-600" />
      </div>

      {/* 折线图区域 */}
      <Card>
        <PopulationChart
            years={years}
            populationValues={populationValues}
            carValues={carValues}
        />
      </Card>
    </div>
  );
}
