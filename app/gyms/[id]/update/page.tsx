'use client';

import { useEffect, useState, FormEvent } from 'react';
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { notFound, useParams, useRouter } from 'next/navigation';

type Gym = {
  id: string;
  name: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };
  is_24_7: boolean;
  power_racks: boolean;
  cable_machines: boolean;
  deadlift_platforms: boolean;
  barbells: boolean;
  dumbbells: boolean;
  treadmills: boolean;
  claimed_by: string | null;
};

export default function UpdateGymPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [gym, setGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const [form, setForm] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    is_24_7: false,
    power_racks: false,
    cable_machines: false,
    deadlift_platforms: false,
    barbells: false,
    dumbbells: false,
    treadmills: false,
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/gyms/${encodeURIComponent(id as string)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Gym not found');
        const data = await res.json();
        setGym(data);
        setForm({
          name: data.name || '',
          line1: data.address.line1 || '',
          line2: data.address.line2 || '',
          city: data.address.city || '',
          state: data.address.state || '',
          zip: data.address.zip || '',
          is_24_7: data.is_24_7,
          power_racks: data.power_racks,
          cable_machines: data.cable_machines,
          deadlift_platforms: data.deadlift_platforms,
          barbells: data.barbells,
          dumbbells: data.dumbbells,
          treadmills: data.treadmills,
        });
      })
      .catch(() => {
        setMessage({ type: 'error', text: 'Failed to load gym data.' });
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) {
    return notFound();
  }

  if (!session) {
    return (
      <div
        className="flex flex-col min-h-screen p-10"
        style={{
          backgroundImage: "url('/images/landing.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70 z-0" />
        <Link href="/" className="absolute top-4 left-4 text-white z-10 text-3xl font-bold hover:underline">
          That One Gym
        </Link>
        <div className="flex flex-col items-center justify-center my-auto z-10">
          <h1 className="text-white text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center">Please sign in to update a gym</h1>
          <button
            onClick={() => signIn()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
          className="flex flex-col min-h-screen items-center justify-center text-3xl"
          style={{
            backgroundImage: "url('/images/landing.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
        <div className="absolute inset-0 bg-black/70 z-0" />
        <p className='z-1'>Loading gym data...</p>
      </div>
    );
  }

  if (!gym) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center text-white">
        <h1 className="text-3xl mb-4">Gym not found</h1>
        <Link href="/" className="underline text-blue-400">Go back home</Link>
      </div>
    );
  }

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await fetch(`/api/gyms/${encodeURIComponent(id as string)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',},
        body: JSON.stringify({
          name: form.name,
          address: {
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            zip: form.zip,
          },
          is_24_7: form.is_24_7,
          power_racks: form.power_racks,
          cable_machines: form.cable_machines,
          deadlift_platforms: form.deadlift_platforms,
          barbells: form.barbells,
          dumbbells: form.dumbbells,
          treadmills: form.treadmills,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.log(err.error);
        throw new Error(err.error);
      }

      setMessage({ type: 'success', text: 'Gym updated successfully!' });

    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage({ type: 'error', text: error.message || 'Something went wrong.' });
      } else {
        setMessage({ type: 'error', text: 'Something went wrong.' });
      }
    }
  }

  return (
    <div
      className="flex flex-col min-h-screen p-5 sm:p-10 lg:p-20 justify-start relative"
      style={{
        backgroundImage: "url('/images/landing.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/70 z-0" />
      <Link href={`/gyms/${id}`} className="absolute top-4 left-4 z-11 text-white underline hover:text-gray-300">
        &larr; Back to Gym Details
      </Link>

      <div className="z-10 w-full max-w-3xl mx-auto bg-black bg-opacity-70 p-8 rounded-lg text-white">
        <h1 className="text-4xl mb-6 font-bold">Update Gym: {gym.name}</h1>

        {message && (
          <div
            className={`mb-4 px-4 py-2 rounded ${
              message.type === 'error' ? 'bg-red-600' : 'bg-green-600'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col">
            Gym Name
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleInputChange}
              required
              className="mt-1 rounded px-3 py-2 border-1 border-neutral-600"
            />
          </label>

          <fieldset className="p-2 rounded">
            <legend className="text-lg font-semibold">Address</legend>

            <label className="flex flex-col mb-2">
              Line 1
              <input
                name="line1"
                type="text"
                value={form.line1}
                onChange={handleInputChange}
                required
                className="mt-1 rounded px-3 py-2 border-1 border-neutral-600"
              />
            </label>

            <label className="flex flex-col mb-2">
              Line 2 (optional)
              <input
                name="line2"
                type="text"
                value={form.line2}
                onChange={handleInputChange}
                className="mt-1 rounded px-3 py-2 border-1 border-neutral-600"
              />
            </label>

            <label className="flex flex-col mb-2">
              City
              <input
                name="city"
                type="text"
                value={form.city}
                onChange={handleInputChange}
                required
                className="mt-1 rounded px-3 py-2 border-1 border-neutral-600"
              />
            </label>

            <label className="flex flex-col mb-2">
              State
              <input
                name="state"
                type="text"
                value={form.state}
                onChange={handleInputChange}
                required
                className="mt-1 rounded px-3 py-2 border-1 border-neutral-600"
              />
            </label>

            <label className="flex flex-col mb-2">
              Zip
              <input
                name="zip"
                type="text"
                value={form.zip}
                onChange={handleInputChange}
                required
                className="mt-1 rounded px-3 py-2 border-1 border-neutral-600"
              />
            </label>
          </fieldset>

          <fieldset className="border border-gray-600 p-4 rounded">
            <legend className="text-lg font-semibold mb-2">Features</legend>

            {[
              { label: 'Open 24/7', name: 'is_24_7' },
              { label: 'Power Racks', name: 'power_racks' },
              { label: 'Cable Machines', name: 'cable_machines' },
              { label: 'Deadlift Platforms', name: 'deadlift_platforms' },
              { label: 'Barbells', name: 'barbells' },
              { label: 'Dumbbells', name: 'dumbbells' },
              { label: 'Treadmills', name: 'treadmills' },
            ].map(({ label, name }) => (
              <label key={name} className="inline-flex items-center gap-2 mb-2 mr-2">
                <input
                  type="checkbox"
                  name={name}
                  checked={form[name as keyof typeof form] as boolean}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5"
                />
                {label}
              </label>
            ))}
          </fieldset>

          <button
            type="submit"
            className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 transition-colors rounded font-semibold"
          >
            Update Gym
          </button>
        </form>
      </div>

      {gym.claimed_by === null && (
        <footer className="z-10 text-center text-neutral-400 sm:text-xl mt-10">
          This gym hasn&apos;t been claimed yet.<br />
          <a
            href="mailto:contact@thatonegym.com"
            target="_mailto:contact@thatonegym.com"
            className="underline hover:text-white"
          >
            Contact us
          </a> if you are the owner and would like to claim it.
        </footer>
      )}
    </div>
  );
}
