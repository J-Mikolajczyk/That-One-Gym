import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex items-center justify-between w-full max-w-4xl">
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800">
          That One Gym
        </Link>
        <nav className="flex gap-4">
          <a href="#features" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            Features
          </a>
          <a href="#pricing" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            Pricing
          </a>
          <a href="#contact" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            Contact
          </a>
        </nav>
      </header>

      <main className="max-w-4xl text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to That One Gym</h1>
        <p className="text-lg text-gray-400 mb-8">
          Your ultimate destination for finding the best gyms near you.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Get Started
        </button>
      </main>

      <footer className="text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} That One Gym. All rights reserved.
      </footer>
        
    </div>
  );
}
