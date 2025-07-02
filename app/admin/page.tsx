'use client';
import { useSession } from 'next-auth/react';
import { notFound } from 'next/navigation';

export default function Admin() {
  const { data: session } = useSession();

  if(session?.user.role !== 'admin') {
    return notFound();
  } else {
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
        Admin Dashboard
      </header>
      <main className="relative flex flex-col text-white w-full text-center items-center flex-grow justify-center">
        
        
      </main>

    </div>
    )
  }
}

