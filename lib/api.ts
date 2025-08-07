import { SuburbData } from '@/types/suburb';

export async function fetchSuburbData(suburbName: string): Promise<SuburbData> {
  const res = await fetch(`/api/suburb/${suburbName}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch data for suburb: ${suburbName}`);
  }
  const data = await res.json();
  return data;
}
