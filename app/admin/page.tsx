'use client';
import { notFound } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Admin() {
  const { data: session, status } = useSession();

  const [adminData, setAdminData] = useState<{ users: any[]; gyms: any[] }>({ users: [], gyms: [] });

  if (!session || session.user.role !== 'admin') {
    return notFound();
  }

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetch("/api/admin")
        .then(res => res.json())
        .then(data => setAdminData(data));
    }
  }, [status, session]);

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
        That One Gym
      </header>
      <main className="z-1 flex flex-col text-white w-full text-center items-center flex-grow px-4">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="flex w-full justify-around">
          <div className="flex flex-col w-4/9 gap-2">
            <h2 className="text-xl font-semibold">Users</h2>
            <div className="overflow-auto w-full">
              <table className="w-full text-left border-collapse border border-neutral-500 bg-neutral-700 text-white rounded-lg overflow-hidden">
                <thead className="bg-neutral-800">
                  <tr>
                    <th className="p-2 border border-neutral-500">Name</th>
                    <th className="p-2 border border-neutral-500">Email</th>
                    <th className="p-2 border border-neutral-500">Role</th>
                    <th className="p-2 border border-neutral-500">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {adminData.users.map((user, index) => (
                    <tr key={index} className="hover:bg-neutral-600">
                      <td className="p-2 border border-neutral-500">{user.name}</td>
                      <td className="p-2 border border-neutral-500">{user.email}</td>
                      <td className="p-2 border border-neutral-500">{user.role}</td>
                      <td className="p-2 border border-neutral-500">{new Date(user.created_at).toLocaleString('en-US')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col w-4/9 gap-2">
            <h2 className="text-xl font-semibold">Gyms</h2>
            <div className="overflow-auto w-full">
              <table className="w-full text-left border-collapse border border-neutral-500 bg-neutral-700 text-white rounded-lg overflow-hidden">
                <thead className="bg-neutral-800">
                  <tr>
                    <th className="p-2 border border-neutral-500">Name</th>
                    <th className="p-2 border border-neutral-500">Address</th>
                    <th className="p-2 border border-neutral-500">Created By</th>
                    <th className="p-2 border border-neutral-500">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {adminData.gyms.map((gym, index) => {
                    const creator = adminData.users.find(user => user.id === gym.created_by);
                    return (
                      <tr key={index} className="hover:bg-neutral-600">
                        <td className="p-2 border border-neutral-500">{gym.name}</td>
                        <td className="p-2 border border-neutral-500">
                          {gym.address.line1}<br />
                          {gym.address.city}, {gym.address.state} {gym.address.zip}
                        </td>
                        <td className="p-2 border border-neutral-500">{creator?.name || "Unknown"}</td>
                        <td className="p-2 border border-neutral-500">{new Date(gym.updated_at).toLocaleString('en-US')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
