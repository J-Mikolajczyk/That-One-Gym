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

  const [suggestions, setSuggestions] = useState<Gym[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim()) {
        try {
          const res = await fetch(`/api/gyms?q=${encodeURIComponent(query)}`);
          if (!res.ok) throw new Error('API failed');
          const data = await res.json();
          setSuggestions(data.response || []);
        } catch (err) {
          setSuggestions([]);
        } finally {
          setShowDropdown(true);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);


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
      <main className="relative flex flex-col text-white w-full text-center items-center flex-grow justify-center">
        
        <div className="relative z-10 flex flex-col gap-8 items-center w-3/5 min-w-80 pb-20">
          <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold">No more guessing. Search gyms by the equipment you want to train with - verified by lifters like you.</h1>
          <form className="relative w-full min-w-80 flex flex-col gap-1.5 justify-center items-center">
            <div className="relative w-full gap-2">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (suggestions.length === 1) {
                      handleSelect(suggestions[0]);
                    } else if (suggestions.length > 1) {
                      // Open filter menu and show gyms on side?
                    }
                  }
                }}
                placeholder="Search by city, ZIP, or gym name..."
                className="h-15 bg-neutral-800 p-2 rounded-lg w-full"
              />
              {showDropdown && (
                <ul className="absolute w-full bg-neutral-800 mt-1 max-h-60 overflow-y-auto rounded-lg z-50">
                  {suggestions.map((gym) => (
                    <li
                      key={gym.id}
                      className="text-left p-2 h-10 hover:bg-neutral-700 transition-colors duration-200 mb-1 cursor-pointer"
                      onClick={() => handleSelect(gym)}
                    >
                      {gym.name} - {gym.address.city}, {gym.address.state} {gym.address.zip}
                    </li>
                  ))}
                  <li
                    className="text-left p-2 h-10 hover:bg-neutral-700 transition-colors duration-200 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      if (session) {
                        window.location.href = '/gyms/add';
                      } else {
                        signIn(); 
                      }
                    }}
                  >
                    {suggestions.length === 0 ? (
                      '+ No gyms found. ' + (session ? 'Add a gym' : 'Sign in to add a gym')
                    ) : (
                      session ? 'Can\'t find it? Add a gym' : 'Sign in to add a gym'
                    )}
                  </li>
                </ul>
              )}
            </div>
          </form>
        </div>
      </main>

      <footer className="relative w-full text-center text-gray-400 text-sm py-4 z-10">
          &copy; {new Date().getFullYear()} That One Gym. All rights reserved.
      </footer>
    </div>
  );
}

