'use client';

import { useState } from 'react';
import Map from '@/components/Map';
import InfoPanel from '@/components/InfoPanel';

export default function HomePage() {
  const [selectedSuburb, setSelectedSuburb] = useState<string | null>(null);

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="w-full lg:w-1/2 h-[400px] lg:h-full">
        <Map selectedSuburb={selectedSuburb} setSelectedSuburb={setSelectedSuburb} />
      </div>

      <div className="w-full lg:w-1/2 h-full overflow-y-auto">
        <InfoPanel suburbName={selectedSuburb} />
      </div>
    </div>
  );
}
