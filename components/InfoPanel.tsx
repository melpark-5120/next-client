"use client";

import { Card } from "@/components/ui/card";
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
import { useEffect, useMemo, useState } from "react";
import StatCard from "./StatCard";
import PopulationChart from "./PopulationChart";
import {
  fetchPopulationBySA2Name,
  fetchVehicleRegistrations,
  PopulationRow,
  VehicleRegistrationRow,
} from "@/lib/api";
import { Car } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

interface InfoPanelProps {
  suburbName: string | null;
}

export default function InfoPanel({ suburbName }: InfoPanelProps) {
  // const [data, setData] = useState<SuburbData | null>(null);
  const [loading, setLoading] = useState(false);
  const [populationRow, setPopulationRow] = useState<PopulationRow | null>(
    null
  );
  const [vehicleVic, setVehicleVic] = useState<VehicleRegistrationRow | null>(
    null
  );

  const [loadErr, setLoadErr] = useState<string | null>(null);

  useEffect(() => {
    if (!suburbName) return;

    const ac = new AbortController();
    setLoading(true);
    setLoadErr(null);

    (async () => {
      try {
        const popArr = await fetchPopulationBySA2Name(suburbName);
        setPopulationRow(popArr?.[0] ?? null);

        if (popArr?.[0]) {
          if (vehicleVic === null) {
            const vehicleArr = await fetchVehicleRegistrations();

            const vic = vehicleArr[0];
            setVehicleVic(vic ?? null);
          }
        } else {
          setVehicleVic(null);
        }
      } catch (e) {
        if (!(e instanceof DOMException && e.name === "AbortError")) {
          setLoadErr(e instanceof Error ? e.message : String(e));
        }
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [suburbName]);

  // 异步请求 suburb 数据
  // useEffect(() => {
  //   if (!suburbName) return;
  //   setLoading(true);
  //   fetch(`/api/suburb/${suburbName}`)
  //     .then((res) => res.json())
  //     .then((json) => setData(json))
  //     .finally(() => setLoading(false));
  // }, [suburbName]);

  // // 当前人口（默认取2025年），增长率（相较2021年）
  // const currentPopulation = data.population_by_year["2025"];
  // const previousPopulation = data.population_by_year["2021"];
  // const growthRate = (
  //   ((currentPopulation - previousPopulation) / previousPopulation) *
  //   100
  // ).toFixed(1);

  // // 构建折线图用的数据
  // const years = Object.keys(data.population_by_year);
  // const populationValues = years.map((year) => data.population_by_year[year]);
  // const carValues = years.map((year) => data.car_ownership_by_year[year]);

  const populationByYear = useMemo<Record<string, number>>(() => {
    if (!populationRow) return {};
    const out: Record<string, number> = {};
    Object.keys(populationRow).forEach((k) => {
      if (k.startsWith("population_")) {
        const year = k.split("_")[1];
        const val =
          ((populationRow as unknown as Record<string, unknown>)[
            k
          ] as number) || null;
        console.log("YEAR", year);
        console.log("VALUE", val);
        if (year && typeof val === "number") out[year] = val;
      }
    });
    return out;
  }, [populationRow]);

  const carByYear = useMemo<Record<string, number | null>>(() => {
    const map: Record<string, number | null> = {};
    if (!vehicleVic) return map;

    // Grab keys like registrations_2016_2017_num -> year "2017"
    for (const [key, val] of Object.entries(vehicleVic)) {
      const m = key.match(/^registrations_(\d{4})_(\d{4})_num$/);
      if (m) {
        const calendarYear = m[2]; // the second year in the FY range
        map[calendarYear] =
          typeof val === "number" ? val : val == null ? null : Number(val);
      }
    }
    return map;
  }, [vehicleVic]);

  const years = useMemo<string[]>(() => {
    // Use population years as the master list; sort ascending
    return Object.keys(populationByYear)
      .map((n) => Number(n))
      .filter((n) => !Number.isNaN(n))
      .sort((a, b) => a - b)
      .map((n) => String(n));
  }, [populationByYear]);

  const populationValues = years.map((y) => populationByYear[y] ?? null) as (
    | number
    | null
  )[];
  const carValues = years.map((y) => (carByYear[y] ?? null) as number | null);

  const latestYear = years[years.length - 1];
  const baselineYear = years.includes("2016") ? "2016" : years[0];
  const currentPopulation = populationByYear[latestYear];
  const previousPopulation = populationByYear[baselineYear];
  const growthRate =
    typeof currentPopulation === "number" &&
    typeof previousPopulation === "number"
      ? (
          ((currentPopulation - previousPopulation) / previousPopulation) *
          100
        ).toFixed(1)
      : "—";

  if (!suburbName) {
    return (
      <div className="p-4 pt-24 flex flex-col items-center space-y-4 text-center">
        <div className="flex items-center space-x-2 text-emerald-500">
          <Car
            className="size-16"
          />
          <h1 className="text-5xl font-bold mt-4">Melgrow</h1>
        </div>
        <h2 className="text-2xl my-5">
          Gain insight to Melbourne&apos;s population and vehicle
          <br />
          ownership and see how YOU can contribute!
        </h2>
        <p className="text-gray-500">Please select a suburb on the map.</p>
      </div>
    );
  }

  if (loading || !populationRow || !vehicleVic) {
    return (
      <div className="p-4">
        <p>Loading data for {suburbName}...</p>
      </div>
    );
  }

  if (!loading && (!populationRow || !currentPopulation)) {
    return (
      <div className="p-4">
        <p>No population data available for {suburbName}.</p>
      </div>
    );
  }

  if (loadErr) {
    <div className="p-4">
      <p>Error loading data for {suburbName}.</p>
    </div>  
  }

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <h2 className="text-2xl font-semibold">{populationRow.sa2_name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Population (2025)"
          value={currentPopulation.toLocaleString()}
        />
        <StatCard
          title="Population growth since 2021"
          value={`${growthRate}%`}
          color={
            typeof growthRate === "string" && parseFloat(growthRate) > 0
              ? "text-green-600"
              : "text-red-600"
          }
        />
      </div>

      {/* 折线图区域 */}
      <Card>
        <PopulationChart
          years={years}
          populationValues={populationValues as number[]}
          carValues={carValues as number[]}
        />
      </Card>
    </div>
  );
}
