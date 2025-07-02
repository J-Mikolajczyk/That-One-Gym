'use client';
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

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
  const [radius, setRadius] = useState(1);
  const [equipment, setEquipment] = useState({
    freeWeights: false,
    powerRacks: false,
    cableMachines: false,
    dumbbells: false,
  });


  const [suggestions, setSuggestions] = useState<Gym[]>([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  
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
  }, [query, zip, radius, equipment]);

  const handleSelect = (gym: Gym) => {
    window.location.href = `/gyms/${gym.id}`;
  };

  return (
    <div
      className="flex flex-col items-center min-h-screen"
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
      <div
          className={`
            font-bold absolute flex flex-col text-white w-full md:w-1/4 left-0 bottom-0 h-8/9 pl-10 pr-10 md:pr-0 gap-4
            transform transition-transform duration-300 ease-in-out z-2
            ${showFilterMenu ? 'translate-x-0' : '-translate-x-full'}
            bg-black md:bg-transparent
          `}
        >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={() => setShowFilterMenu(false)} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <label className="text-sm">ZIP Code</label>
        <input
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          className="bg-neutral-800 p-2 rounded text-white w-full"
        />

        <label className="text-sm">Radius: {radius} mi</label>
        <input
          type="range"
          min={1}
          max={100}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full"
        />

        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.keys(equipment).map((key) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={equipment[key as keyof typeof equipment]}
                onChange={() =>
                  setEquipment((prev) => ({
                    ...prev,
                    [key]: !prev[key as keyof typeof equipment],
                  }))
                }
              />
              {key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (s) => s.toUpperCase())}
            </label>
          ))}
        </div>
      </div>

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
                  <img src="/filter_icon.svg" alt="Filter" className="w-5 h-5" />
                </button>

              </div>
            </div>
          </form>
          
          <div className="flex flex-wrap w-full justify-between gap-y-2">
            {suggestions.map((gym) => (
              <div
                key={gym.id}
                className="flex flex-col items-center justify-center w-full h-30 sm:w-[49%] lg:w-[33%] p-4 bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors duration-200"
                onClick={() => handleSelect(gym)}
              >
                <p>{gym.name}</p>
                <p>{gym.address.line1}</p>
                <p>{gym.address.line2}</p>
                <p>{gym.address.city}, {gym.address.state} {gym.address.zip}</p>
              </div>
            ))}

            {(query.trim() || zip || radius > 0 || equipment.cableMachines || equipment.dumbbells || equipment.freeWeights || equipment.powerRacks) && (
              <div
                className="flex flex-col items-center justify-center w-full h-30 sm:w-[49%] lg:w-[33%] p-4 bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors duration-200"
                onClick={() => addGym()}
              >
                <p>Can't find what you're looking for?</p>
                <p>Add a gym here</p>
              </div>
            )}
          </div>
          {!query.trim() && !zip && radius == 0 && !equipment.cableMachines && !equipment.dumbbells && !equipment.freeWeights && !equipment.powerRacks &&
              <h1 className="text-2xl sm:text-4xl md:text-4xl lg:text-5xl font-bold">
                No more guessing. Search gyms by the equipment you want to train with - verified by lifters like you.
              </h1> 
          }
          
      </main>

      <footer className="relative w-full text-center text-gray-400 text-sm py-4 z-1">
          &copy; {new Date().getFullYear()} That One Gym. All rights reserved.
      </footer>
    </div>
  );
}

