'use client';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { fetchAllSuburbs } from '@/lib/api';
import { Combobox } from './ui/combobox';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface MapProps {
  selectedSuburb: string | null;
  setSelectedSuburb: (suburb: string) => void;
}

export default function Map({ selectedSuburb, setSelectedSuburb }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [hoveredSuburb, setHoveredSuburb] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [suburbQuery, setSuburbQuery] = useState<string>('');
  const [suburbList, setSuburbList] = useState<string[]>([]);

  const suburbListFiltered = useMemo(() => {
    return suburbList?.filter((suburb) =>
      suburb.toLowerCase().includes(suburbQuery.toLowerCase())
    );
  }, [suburbList, suburbQuery]);

  useEffect(() => {
    const fetchSuburbs = async () => {
      const suburbs = await fetchAllSuburbs();
      setSuburbList(suburbs.map((a) => a.sa2_name));
    };

    fetchSuburbs();
  }, []);

  // 初始化地图，仅执行一次
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [144.9631, -37.8136],
      zoom: 13,
      minZoom: 10,
      maxZoom: 17,
    });

    mapRef.current = map;

    map.on('load', () => {
      setLoading(false);

      // 加载GeoJSON数据
      map.addSource('suburbs', {
        type: 'geojson',
        data: '/SA2_2021_AUST_GDA2020_SIM.json',
      });

      // 填充图层
      map.addLayer({
        id: 'suburbs-fill',
        type: 'fill',
        source: 'suburbs',
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'name'], selectedSuburb ?? ''],
            '#3b82f6',
            ['==', ['get', 'name'], hoveredSuburb ?? ''],
            '#a5b4fc',
            '#e5e7eb',
          ],
          'fill-opacity': 0.6,
        },
      });

      // 边界图层
      map.addLayer({
        id: 'suburbs-outline',
        type: 'line',
        source: 'suburbs',
        paint: {
          'line-color': '#6b7280',
          'line-width': 1,
        },
      });

      // hover
      map.on('mousemove', 'suburbs-fill', (e) => {
        const suburb = e.features?.[0]?.properties?.name;
        if (suburb && suburb !== hoveredSuburb) {
          setHoveredSuburb(suburb);
        }
      });

      map.on('mouseleave', 'suburbs-fill', () => {
        setHoveredSuburb(null);
      });

      // click only updates selected
      map.on('click', 'suburbs-fill', (e) => {
        const suburb = e.features?.[0]?.properties?.name;
        if (suburb) {
          setSelectedSuburb(suburb);
        }
      });

      // double-click复位
      map.on('dblclick', () => {
        map.flyTo({ center: [144.9631, -37.8136], zoom: 13 });
      });
    });

    return () => {
      map.remove();
    };
  }, []); // ✅ 仅初始化时执行

  // 响应 state 更新填充颜色（selected & hover）
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !map.getLayer('suburbs-fill')) return;

    try {
      map.setPaintProperty('suburbs-fill', 'fill-color', [
        'case',
        ['==', ['get', 'name'], selectedSuburb ?? ''],
        '#10b981',
        ['==', ['get', 'name'], hoveredSuburb ?? ''],
        '#d0fae5',
        '#e5e7eb',
      ]);
    } catch (err) {
      console.warn('Failed to update fill-color', err);
    }
  }, [selectedSuburb, hoveredSuburb]); // ✅ 每次更新都刷新颜色

  return (
    <div className="relative w-full h-full">
      <div className='absolute flex items-center gap-4 z-10 top-6 left-6 bg-white pl-4 p-1 rounded shadow text-sm text-gray-800'>
        <Search/>
        <Combobox
          options={suburbListFiltered.map((suburb) => ({ value: suburb, label: suburb }))}
          placeholder="Select suburb..."
          emptyText="No suburb found."
          value={selectedSuburb || undefined}
          onChange={setSelectedSuburb}
        />
      </div>
      {loading && (
        <div className="absolute z-10 top-6 left-6 bg-white px-3 py-8 rounded shadow text-sm text-gray-800">
          Loading Map...
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
