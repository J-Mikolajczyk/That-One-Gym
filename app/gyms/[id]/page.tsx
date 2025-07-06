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
      className="flex flex-col h-screen w-screen p-10 lg:p-20"
      style={{
        backgroundImage: "url('/images/landing.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/70 z-0" />
      <div className="z-1 text-2xl sm:text-3xl md:text-4xl lg:text-4xl h-full">
        <main className="flex flex-col h-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            {gym.name || id}
          </h1>
          <h1 className="">
            {gym.address.line1} {gym.address.line2}
          </h1>
          <h1 className="">
            {gym.address.city}, {gym.address.state} {gym.address.zip}
          </h1>
          <br/>
          <h1 className="">
            {gym.is_24_7 ? "24/7" : ""}
          </h1>
        </main>
        {
          gym.is_claimed &&
          <footer className="text-base text-center text-neutral-400 sm:text-xl">
            See an issue with this gym? Please edit here!
          </footer>
        }
        
      </div>
    </div>
  );
}
