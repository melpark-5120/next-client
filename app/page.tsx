'use client';

import { useState } from 'react';
import Map from '@/components/Map';
import InfoPanel from '@/components/InfoPanel';
import Header from '@/components/Header';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [selectedSuburb, setSelectedSuburb] = useState<string | null>(null);
  const [switchScreen, setSwitchScreen] = useState(false);

  return (
    <main>
      <div className="absolute top-4 right-4 z-30">
        <Button
          variant='outline'
          onClick={() => setSwitchScreen((prev) => !prev)}
        >
          Switch Sides
        </Button>
      </div>
        <Header/>
      <div className={cn("flex flex-col lg:flex-row h-screen pt-16", switchScreen ? 'flex-col-reverse lg:flex-row-reverse' : '')}>
        <div className="w-full lg:w-1/2 h-[400px] lg:h-full">
          <Map selectedSuburb={selectedSuburb} setSelectedSuburb={setSelectedSuburb} />
        </div>

        <div className="w-full lg:w-1/2 h-full overflow-y-auto">
          <InfoPanel suburbName={selectedSuburb} />
        </div>
      </div>
    </main>
  );
}
