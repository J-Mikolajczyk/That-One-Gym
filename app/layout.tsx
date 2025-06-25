import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "That One Gym",
  description: "A gym search app built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
