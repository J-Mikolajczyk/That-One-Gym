import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function GymsPage({ params }: Props) {
  const { id } = params;

  const res = await fetch(`${process.env.NEXTAUTH_URL || ""}/api/gyms/${encodeURIComponent(id)}`, {
  });

  if (!res.ok) {
    notFound(); 
  }

  const gym = await res.json();

  console.log(gym);

  return (
    <div
      className="flex flex-col h-screen w-screen p-30"
      style={{
        backgroundImage: "url('/images/landing.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/70 z-0" />
      <div className="z-1 text-2xl sm:text-4xl md:text-5xl lg:text-6xl ">
        <h1 className="text-white  font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl">{gym.name || id}</h1>
        <h1 className="text-white  font-bold">{gym.address.line1} {gym.address.line2}</h1>
        <h1 className="text-white  font-bold">{gym.address.city}, {gym.address.state} {gym.address.zip}</h1>
      </div>
    </div>
  );
}
