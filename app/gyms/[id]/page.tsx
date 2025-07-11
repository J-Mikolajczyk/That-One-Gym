import Link from "next/link";

import { notFound } from "next/navigation";

export default async function GymsPage({ params }: {params: Promise<{ id: string }>}) {

  const id = (await params)?.id;

  const res = await fetch(`${process.env.NEXTAUTH_URL || ""}/api/gyms/${encodeURIComponent(id)}`);

  if (!res.ok) {
    notFound();
  }

  const gym = await res.json();

  console.log(gym);

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
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            {gym.name || id}
          </h1>
          <h1 >
            {gym.address.line1} {gym.address.line2}
          </h1>
          <h1>
            {gym.address.city}, {gym.address.state} {gym.address.zip}
          </h1>
          <br />
          <h1>
            <span className={gym.is_24_7 ? "text-green-600" : "text-red-600"}>
              {gym.is_24_7 ? "✔" : "✘"}
            </span>{" "}
            24/7
          </h1>
          <h1>
            <span className={gym.power_racks ? "text-green-600" : "text-red-600"}>
              {gym.power_racks ? "✔" : "✘"}
            </span>{" "}
            Power Racks
          </h1>
          <h1>
            <span className={gym.cable_machines ? "text-green-600" : "text-red-600"}>
              {gym.cable_machines ? "✔" : "✘"}
            </span>{" "}
            Cable Machines
          </h1>
          <h1>
            <span className={gym.deadlift_platforms ? "text-green-600" : "text-red-600"}>
              {gym.deadlift_platforms ? "✔" : "✘"}
            </span>{" "}
            Deadlift Platforms
          </h1>
          <h1>
            <span className={gym.barbells ? "text-green-600" : "text-red-600"}>
              {gym.barbells ? "✔" : "✘"}
            </span>{" "}
            Barbells
          </h1>
          <h1>
            <span className={gym.dumbbells ? "text-green-600" : "text-red-600"}>
              {gym.dumbbells ? "✔" : "✘"}
            </span>{" "}
            Dumbbells
          </h1>
          <h1>
            <span className={gym.treadmills ? "text-green-600" : "text-red-600"}>
              {gym.treadmills ? "✔" : "✘"}
            </span>{" "}
            Treadmills
          </h1>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl">
            See an inaccuracy? Update this gym <Link className="underline" href={`/gyms/${id}/update`}>here!</Link>
          </h1>
        </main>
      </div>
      {
          gym.claimed_by === null &&
          <footer className="z-1 text-sm text-center text-neutral-400 sm:text-xl">
            This gym hasn&apos;t been claimed yet.<br/><a href="mailto:contact@thatonegym.com" target="_mailto:contact@thatonegym.com" className="underline hover:text-white">Contact us</a> if you are the owner and would like to claim it.
          </footer>
      }
      
    </div>
  );
}
