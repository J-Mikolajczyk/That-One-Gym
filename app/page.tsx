'use client';
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  const [query, setQuery] = useState('');
  type Gym = {
    id: string | number;
    name: string;
    city: string;
  };

  const [suggestions, setSuggestions] = useState<Gym[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim()) {
        try {
          const res = await fetch(`/api/search-gyms?q=${encodeURIComponent(query)}`);
          if (!res.ok) throw new Error('API failed');
          const data = await res.json();
          setSuggestions(data);
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
      <main className="relative flex flex-col text-white w-full text-center items-center flex-grow justify-center">
        <div className="absolute inset-0 bg-black/70 z-0" />
        
        <div className="relative z-10 flex flex-col gap-8 items-center w-3/5 pb-20">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">No more guessing. Search gyms by the equipment you want to train with - verified by lifters like you.</h1>
          <form className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by city, ZIP, or gym name..."
              className="h-15 bg-neutral-800 p-2 rounded-lg w-full max-w-150 min-w-80"
            />
            {showDropdown && (
              <ul className="absolute top-full left-0 w-full bg-white shadow-md rounded-lg mt-2 text-black z-20 max-h-60 overflow-y-auto">
                {suggestions.length > 0 ? (
                  suggestions.map((gym) => (
                    <li
                      key={gym.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelect(gym)}
                    >
                      {gym.name} — {gym.city}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-sm text-gray-500">
                    No gyms found.
                    <button
                      className="ml-2 text-blue-600 underline"
                      onClick={(e) => {
                        e.preventDefault();
                        if (session) {
                          window.location.href = '/gyms/add';
                        } else {
                          signIn(); 
                        }
                      }}
                    >
                      Add one?
                    </button>
                  </li>
                )}
              </ul>
            )}
          </form>
        </div>
      </main>

      <footer className="relative w-full text-center text-gray-400 text-sm py-4">
        <div className="absolute inset-0 bg-black/70 z-0" />

        <div className="relative z-10">
          &copy; {new Date().getFullYear()} That One Gym. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

