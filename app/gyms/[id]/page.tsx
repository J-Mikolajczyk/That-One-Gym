import Link from "next/link";
import { notFound } from "next/navigation";

function Feature({ available, label }: { available: boolean; label: string }) {
  return (
    <p className="flex items-center gap-2">
      <span
        className={available ? "text-green-600" : "text-red-600"}
        style={{ fontFamily: "Arial, sans-serif" }} // prevent emoji font
      >
        {available ? "✔" : "✘"}
      </span>
      {label}
    </p>
  );
}

export default async function GymsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXTAUTH_URL || ""}/api/gyms/${encodeURIComponent(id)}`);

  if (!res.ok) notFound();

  const gym = await res.json();

  return (
    <div
      className="flex flex-col min-h-screen p-5 sm:p-10 relative"
      style={{
        backgroundImage: "url('/images/landing.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/70 z-[0]" />
      <header className="w-full text-white font-bold z-[1] text-2xl mb-4 sm:mb-8 relative">
        <Link href="/">That One Gym</Link>
      </header>

      <main className="flex flex-col flex-grow gap-1 text-white z-[1] text-xl sm:text-2xl md:text-3xl lg:text-4xl h-full pb-5">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
          {gym.name || id}
        </h1>

        <p>
          {gym.address.line1} {gym.address.line2}
        </p>
        <p>
          {gym.address.city}, {gym.address.state} {gym.address.zip}
        </p>

        <Feature available={gym.is_24_7} label="24/7" />
        <Feature available={gym.power_racks} label="Power Racks" />
        <Feature available={gym.cable_machines} label="Cable Machines" />
        <Feature available={gym.deadlift_platforms} label="Deadlift Platforms" />
        <Feature available={gym.barbells} label="Barbells" />
        <Feature available={gym.dumbbells} label="Dumbbells" />
        <Feature available={gym.treadmills} label="Treadmills" />

        {gym.claimed_by === null && <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mt-auto">
          See an inaccuracy? Update this gym{" "}
          <Link className="underline" href={`/gyms/${id}/update`}>
            here!
          </Link>
        </p>}
      </main>

      {gym.claimed_by === null && (
        <footer className="z-[1] text-sm text-center text-neutral-400 sm:text-xl mt-4">
          This gym hasn&apos;t been claimed yet.
          <br />
          <a
            href="mailto:contact@thatonegym.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            Contact us
          </a>{" "}
          if you are the owner and would like to claim it.
        </footer>
      )}
    </div>
  );
}
