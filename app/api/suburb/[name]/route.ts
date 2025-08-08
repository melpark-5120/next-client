import { NextRequest } from 'next/server';

export function GET(req: NextRequest) {
  const url = new URL(req.url);
  const name = url.pathname.split('/').pop() || '';

  const fakeData = {
    name: decodeURIComponent(name),
    population_by_year: {
      '2021': 27000,
      '2022': 28000,
      '2023': 29000,
      '2024': 30500,
      '2025': 32000
    },
    car_ownership_by_year: {
      '2021': 8800,
      '2022': 9400,
      '2023': 9800,
      '2024': 10200,
      '2025': 11000
    }
  };

  return new Response(JSON.stringify(fakeData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
