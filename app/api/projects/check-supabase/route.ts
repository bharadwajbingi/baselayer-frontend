import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    // Try fetching 1 row from any table you know exists
    const { data, error } = await supabase.from("Project").select("*").limit(1);

    if (error) {
      return NextResponse.json(
        { success: false, message: "Supabase access failed", error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Supabase access OK", data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: (err as Error).message },
      { status: 500 }
    );
  }
}
