const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";

export interface PopulationRow {
  gccsa_name: string | null;
  sa4_code: number | null;
  sa4_name: string | null;
  sa3_code: number | null;
  sa3_name: string | null;
  sa2_code: number;                
  sa2_name: string;

  population_2001: number | null;
  population_2002: number | null;
  population_2003: number | null;
  population_2004: number | null;
  population_2005: number | null;
  population_2006: number | null;
  population_2007: number | null;
  population_2008: number | null;
  population_2009: number | null;
  population_2010: number | null;
  population_2011: number | null;
  population_2012: number | null;
  population_2013: number | null;
  population_2014: number | null;
  population_2015: number | null;
  population_2016: number | null;
  population_2017: number | null;
  population_2018: number | null;
  population_2019: number | null;
  population_2020: number | null;
  population_2021: number | null;

  identifier: number | null;
  percentage: number | null;
  area_km2: number | null;
  population_density: number | null;
}

export interface VehicleRegistrationRow {
  state_name: string;
  registrations_2016_2017_num: number | null;
  registrations_2016_2017_percent: number | null;
  registrations_2017_2018_num: number | null;
  registrations_2017_2018_percent: number | null;
  registrations_2018_2019_num: number | null;
  registrations_2018_2019_percent: number | null;
  registrations_2019_2020_num: number | null;
  registrations_2019_2020_percent: number | null;
  registrations_2020_2021_num: number | null;
  registrations_2020_2021_percent: number | null;
}

export async function fetchAllPopulation(): Promise<PopulationRow[]> {
  const res = await fetch(`${API_BASE}/api/population`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch population");
  return res.json();
}

export async function fetchAllSuburbs(): Promise<PopulationRow[]> {
  const res = await fetch(`${API_BASE}/api/suburbs`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch suburbs");
  return res.json();
}

export async function fetchPopulationBySA2Name(sa2Name: string): Promise<PopulationRow[]> {
  const res = await fetch(`${API_BASE}/api/population/${encodeURIComponent(sa2Name)}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch population for SA2: ${sa2Name}`);
  return res.json();
}

export async function fetchVehicleRegistrations(): Promise<VehicleRegistrationRow[]> {
  const res = await fetch(`${API_BASE}/api/vehicle`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch vehicle registrations");
  return res.json();
}
