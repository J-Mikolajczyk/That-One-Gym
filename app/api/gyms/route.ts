import { supabase } from "@/app/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") || "";
  const gyms = await supabase.from("gyms").select("*").ilike("name", `%${query}%`).limit(10);
  const { data, error } = gyms;

  console.log(error);
  if (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch gyms" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } else if (!data || data.length === 0) {
    return new Response(JSON.stringify({ data: "No gyms found" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req: NextRequest) {

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const body = await req.json();
    const { gymName, address, userId } = body;

    if (!gymName || !address || !address.line1 || !address.city || !address.state || !address.zip || !userId)  {
      console.log("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate the address format
    const addressRegex = { 
      line1: /^[a-zA-Z0-9\s,.'-]{3,}$/,
      city: /^[a-zA-Z\s]{2,}$/,
      state: /^[A-Z]{2}$/,
      zip: /^\d{5}(-\d{4})?$/,
    };
    if (
      !addressRegex.line1.test(address.line1) ||
      !addressRegex.city.test(address.city) ||
      !addressRegex.state.test(address.state) ||
      !addressRegex.zip.test(address.zip)
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid address format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    // Check if the gym already exists
    const { data: existingGym, error: existingGymError } = await supabase
      .from("gyms")
      .select("*")
      .eq("name", gymName)
      .maybeSingle();

    if (existingGymError) {
      return new Response(
        JSON.stringify({ error: "Failed to check existing gyms" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    if (existingGym) {
      return new Response(
        JSON.stringify({ error: "Gym already exists" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    // Insert the new gym into the database
    const { data: newGym, error: insertError } = await supabase
      .from("gyms")
      .insert([
        {
          name: gymName,
          address: {
            line1: address.line1,
            city: address.city,
            state: address.state,
            zip: address.zip,
          },
          created_by: userId,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting gym:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to add gym" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Gym added successfully", gymName, address }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: {error} }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}