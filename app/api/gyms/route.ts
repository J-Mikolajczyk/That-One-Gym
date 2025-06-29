import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // This is a placeholder for the GET request handler.
  // Fetch gyms from the database.
  // For now, it just returns a simple JSON response.
  return new Response(JSON.stringify({ message: "gyms route works" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gymName, address, userId } = body;

    if (!gymName || !address || !address.line1 || !address.city || !address.state || !address.zip || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { line1, line2, city, state, zip } = address;
    const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/; 
    const cityRegex = /^[a-zA-Z\s]{2,}$/; 
    const stateRegex = /^[A-Z]{2}$/; 
    const zipRegex = /^\d{5}(-\d{4})?$/;

    if (
      !addressRegex.test(line1) ||
      (line2 && !addressRegex.test(line2)) ||
      !cityRegex.test(city) ||
      !stateRegex.test(state) ||
      !zipRegex.test(zip)
    ) {
    return new Response(
        JSON.stringify({ error: "Invalid address format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Save the gym to the database

    return new Response(
      JSON.stringify({ message: "Gym added successfully", gymName, address }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error adding gym:", error);
    return new Response(
      JSON.stringify({ error: "Failed to add gym" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}