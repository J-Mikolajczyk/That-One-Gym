'use client';
import { useEffect, useState } from 'react';
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, notFound } from 'next/navigation';
import { Gym } from '@/app/types/admin';

export default function UpdateGymPage() {
  const { id } = useParams();
  const { data: session, update } = useSession();
  const [gym, setGym] = useState<Gym | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (session && !session.user?.id) {
      update();
    }
  }, [session, update]);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const res = await fetch(
        `${process.env.NEXTAUTH_URL || ""}/api/gyms/${encodeURIComponent(Array.isArray(id) ? id[0] : id)}`
      );
      if (!res.ok) {
        return notFound();
      }
      const gym = await res.json();
      setGym(gym);
    };
    fetchData();
  }, [id]);

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
        <Link href="/" className="absolute top-4 left-4 text-white z-10 text-3xl font-bold">
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

  return (
    <div
      className="flex flex-col h-screen w-screen p-10 lg:p-20 justify-between"
      style={{
        backgroundImage: "url('/images/landing.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/70 z-0" />
      <div className="z-1 text-2xl sm:text-3xl md:text-4xl lg:text-4xl">
        <main className="flex flex-col flex-grow gap-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl">
            Updating {gym?.name}
          </h1>
        </main>
      </div>
      {
        gym?.claimed_by === null &&
        <footer className="z-1 text-sm text-center text-neutral-400 sm:text-xl">
          This gym hasn&apos;t been claimed yet.<br /><a href="mailto:contact@thatonegym.com" target="_mailto:contact@thatonegym.com" className="underline hover:text-white">Contact us</a> if you are the owner and would like to claim it.
        </footer>
      }
    </div>
  );
}