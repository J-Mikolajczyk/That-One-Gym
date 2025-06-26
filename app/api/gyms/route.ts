import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return new Response(JSON.stringify({ message: "gyms route works" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gymName, address } = body;

    if (!gymName || !address || !address.line1 || !address.city || !address.state || !address.zip) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Save the gym to the database
    // This is a placeholder for actual database logic

    return new Response(
      JSON.stringify({ message: "Gym added successfully", gymName, address }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to add gym" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}