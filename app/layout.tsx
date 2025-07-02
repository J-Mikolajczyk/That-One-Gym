import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth"
import SessionProvider from "./components/SessionProvider"

export const metadata: Metadata = {
  title: "That One Gym",
  description: "A gym search app built with Next.js and Tailwind CSS",
};



export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
