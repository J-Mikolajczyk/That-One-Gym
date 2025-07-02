import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const sql = neon(process.env.DATABASE_URL as string);

  const users = await sql`SELECT * FROM users ORDER BY created_at DESC`;
  const gyms = await sql`SELECT * FROM gyms ORDER BY updated_at DESC`;


  return NextResponse.json({ users, gyms });
}
