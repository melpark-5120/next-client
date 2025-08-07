export interface SuburbData {
  name: string;
  population_by_year: Record<string, number>; // 例如：{ "2021": 1000, "2022": 1100, ... }
  car_ownership_by_year: Record<string, number>; // 同上
}
