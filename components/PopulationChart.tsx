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
  ChartOptions,
  TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const base = values.find((v) => typeof v === "number" && v > 0) ?? 1;
  return values.map((v) =>
    typeof v === "number" && v > 0 ? (v / base) * 100 : NaN
  );
}

export default function PopulationChart({
  years,
  populationValues,
  carValues,
}: PopulationChartProps) {
  const popIdx = toBase100(populationValues);
  const carIdx = toBase100(carValues);

  console.log(carValues)

  return (
    <>
      <Tabs defaultValue="population">
        <TabsList className="">
          <TabsTrigger value="population">Population</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
        </TabsList>
        <TabsContent value="population">
          <Line
            data={{
              labels: years,
              datasets: [
                {
                  label: "Population",
                  data: populationValues,
                  fill: false,
                  borderColor: "rgb(59,130,246)",
                  tension: 0.3,
                  pointRadius: 3,
                  spanGaps: true,
                },
              ],
            }}
            options={
              {
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  tooltip: {
                    mode: "index",
                    intersect: false,
                    callbacks: {
                      label: (ctx: TooltipItem<"line">) => {
                        const i = ctx.dataIndex;
                        const raw = populationValues[i];
                        return raw != null
                          ? `Population: ${raw.toLocaleString()}`
                          : "";
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    title: { display: true, text: "Population" },
                  },
                },
              } as ChartOptions<"line">
            }
          />
        </TabsContent>
        <TabsContent value="vehicles">
          <Line
            data={{
              labels: [
                '2017',
                '2018',
                '2019',
                '2020',
                '2021',
              ],
              datasets: [
                {
                  label: "Vehicle registrations",
                  data: carValues.filter(Boolean),
                  fill: false,
                  borderColor: "rgb(34,197,94)",
                  tension: 0.3,
                  pointRadius: 3,
                  spanGaps: true,
                },
              ],
            }}
            options={
              {
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  tooltip: {
                    mode: "index",
                    intersect: false,
                    callbacks: {
                      label: (ctx: TooltipItem<"line">) => {
                        const i = ctx.dataIndex;
                        const raw = populationValues[i];
                        return raw != null
                          ? `Population: ${raw.toLocaleString()} actual`
                          : "";
                      },
                      footer: () =>
                        "Index base = first non-zero value in each series",
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    title: { display: true, text: "Vehicle Registrations" },
                  },
                },
              } as ChartOptions<"line">
            }
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
