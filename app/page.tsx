'use client';
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const { data: session } = useSession();

  const [query, setQuery] = useState('');
  type Gym = {
    id: string | number;
    name: string;
    address: {
      city?: string;
      state?: string;
      zip?: string;
      line1?: string;
      line2?: string;
    };
  };

  const [zip, setZip] = useState('');
  const [radius, setRadius] = useState(10);
  type EquipmentKey = 'freeWeights' | 'powerRacks' | 'cableMachines' | 'dumbbells';
  const [equipment, setEquipment] = useState<Record<EquipmentKey, boolean>>({
    freeWeights: false,
    powerRacks: false,
    cableMachines: false,
    dumbbells: false,
  });
  const [is247, setIs247] = useState(false);


  const [suggestions, setSuggestions] = useState<Gym[]>([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

   const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

  
  const addGym = () => {
    if (session) {
      window.location.href = '/gyms/add';
    } else {
      signIn();
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      try {
        const equipmentParams = Object.entries(equipment)
          .filter(([_, value]) => value)
          .map(([key]) => `${encodeURIComponent(key)}=true`)
          .join('&');

        const params = new URLSearchParams();
        if (query.trim()) params.append('q', query.trim());
        if (zip) params.append('zip', zip);
        if (radius) params.append('radius', radius.toString());
        if (equipmentParams) params.append(equipmentParams, '');
        if (is247) params.append('is247', 'true');

        const url = `/api/gyms?${params.toString()}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        setSuggestions(data.response || []);
      } catch (err) {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, zip, radius, equipment, is247]);

  const handleSelect = (gym: Gym) => {
    window.location.href = `/gyms/${gym.id}`;
  };

  return (
    <div
      className="flex flex-col items-center min-h-screen overflow-hidden"
      style={{
        backgroundImage: "url('/images/landing.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/70 z-0" />
      <header className="w-full text-white font-bold z-1 text-2xl p-10">
        That One Gym
      </header>
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-40
          bg-black text-white font-bold flex flex-col p-8 gap-6
          transition-transform duration-300 ease-in-out
          ${isMobile ? 'w-full' : 'w-1/4'}
          ${
            showFilterMenu
              ? 'translate-x-0'
              : isMobile
              ? '-translate-x-full'
              : '-translate-x-full'
          }
        `}
        style={{ height: '100vh' }}
        aria-hidden={!showFilterMenu}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Filters</h2>
          <button
            onClick={() => setShowFilterMenu(false)}
            className="text-gray-400 hover:text-white text-3xl leading-none"
            aria-label="Close filter menu"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold" htmlFor="zip-input">
            ZIP Code
          </label>
          <input
            id="zip-input"
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="bg-neutral-800 p-2 rounded text-white w-full"
            placeholder="Enter ZIP code"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="radius-range" className="text-sm font-semibold">
            Radius: {radius} mi
          </label>
          <input
            id="radius-range"
            type="range"
            min={1}
            max={50}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full"
          />
        </div>
        {Object.entries(equipment).map(([key, value]) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={value}
              onChange={() =>
                setEquipment((prev) => ({
                  ...prev,
                  [key as EquipmentKey]: !prev[key as EquipmentKey],
                }))
              }
              className="cursor-pointer"
            />
            {key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (s) => s.toUpperCase())}
          </label>
        ))}
        <label key={"is247"} className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={is247}
              onChange={() =>
                setIs247(!is247)
              }
              className="cursor-pointer"
            />
            24/7
          </label>
        
      </aside>

      <main 
        className={`z-1 flex flex-col text-white text-center flex-grow gap-8 w-3/5 min-w-80 transition-transform duration-300 ${
          showFilterMenu ? 'translate-x-[20%]' : 'translate-x-0'
        }`}>
          <form className="relative flex flex-col justify-center items-center w-full">
            <div className="relative w-full gap-2">
              <div className='w-full flex justify-center items-center gap-2'>
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (suggestions.length === 1) {
                        handleSelect(suggestions[0]);
                      }
                    }
                  }}
                  placeholder="Search by gym name or start adding filters..."
                  className="h-15 bg-neutral-800 p-2 rounded-lg w-9/10"
                />
                <button
                  type="button"
                  className="flex items-center justify-center h-15 bg-neutral-800 p-2 hover:bg-neutral-700 rounded-lg w-1/10 cursor-pointer transition-colors duration-200"
                  onClick={() => {setShowFilterMenu(!showFilterMenu)}}
                >
                  <Image src="/filter_icon.svg" alt="Filter" width={20} height={20} />
                </button>

              </div>
            </div>
          </form>
          
          <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((gym) => (
              <div
                key={gym.id}
                className="flex flex-col items-center justify-center h-30 p-4 bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors duration-200"
                onClick={() => handleSelect(gym)}
              >
                <p>{gym.name}</p>
                <p>{gym.address.line1}</p>
                <p>{gym.address.line2}</p>
                <p>{gym.address.city}, {gym.address.state} {gym.address.zip}</p>
              </div>
            ))}

            {(query.trim() || zip || equipment.cableMachines || equipment.dumbbells || equipment.freeWeights || equipment.powerRacks || is247) && (
              <div
                className="flex flex-col items-center justify-center h-30 p-4 bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors duration-200"
                onClick={() => addGym()}
              >
                <p>Can&apos;t find what you&apos;re looking for?</p>
                <p>Add a gym here</p>
              </div>
            )}
          </div>

          { !query.trim() && !zip && !equipment.cableMachines && !equipment.dumbbells && !equipment.freeWeights && !equipment.powerRacks && !is247 &&

            <h1 className="mt-15 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">No more guessing. Search gyms by the equipment you want to train with - verified by lifters like you.</h1>
          }
          
      </main>

      <footer className="w-full text-center text-gray-400 text-sm py-4 z-1">
          &copy; {new Date().getFullYear()} That One Gym. All rights reserved.
      </footer>
    </div>
  );
}

