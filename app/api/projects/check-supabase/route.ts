// pages/api/check-supabase.ts
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Try fetching 1 row from any table you know exists
    const { data, error } = await supabase.from("Project").select("*").limit(1);

    if (error) {
      res
        .status(500)
        .json({ success: false, message: "Supabase access failed", error });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Supabase access OK", data });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
}
