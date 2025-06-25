export default function Home() {
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">No more guessing. Search gyms by the equipment you want to train with - verified by lifters like you.</h1>
          <form className="flex flex-col gap-8 items-center justify-center w-full h-full">
            <input type='text' 
                  placeholder='Search by city, ZIP, or equipment...' 
                  className="h-15 bg-neutral-800 p-2 rounded-lg w-full max-w-150 min-w-80"/>
            <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors w-1/3 max-w-50 min-w-34">
              Get Started
            </button>
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
