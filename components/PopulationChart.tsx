"use client";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

const years = [
  "2001",
  "2002",
  "2003",
  "2004",
  "2005",
  "2006",
  "2007",
  "2008",
  "2009",
  "2010",
  "2011",
  "2012",
  "2013",
  "2014",
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
];

const population = [
  3830, 3782, 3751, 3721, 3700, 3685, 3730, 3769, 3806, 3861, 3902, 4008, 4103,
  4184, 4269, 4367, 4446, 4522, 4655, 4777, 4901,
];

export default function PopulationChart() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="col-span-2">
        <p className="text-neutral-500">Population Growth in</p>
        <p className="text-xl font-bold">Longford - Loch Sport</p>
      </div>
      <div className="flex flex-col items-center justify-center bg-neutral-200 rounded-2xl p-6">
        <p>Population Growth</p>
        <div className="flex items-end font-bold">
          <p className="text-2xl">34</p>
          <p>%</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-neutral-200 rounded-2xl p-6">
        <p>Blabla Idk what should be here</p>
        <div className="flex items-end font-bold">
          <p className="text-2xl">34</p>
          <p>%</p>
        </div>
      </div>
      <Line
        data={{
          labels: years,
          datasets: [
            {
              label: "Population (Longford - Loch Sport)",
              data: population,
              fill: true,
              pointRadius: 3,
              tension: 0.3,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top" as const,
            },
            tooltip: {
              mode: "index" as const,
              intersect: false,
            },
          },
          scales: {
            y: {
              beginAtZero: false,
            },
          },
        }}
      />
    </div>
  );
}
