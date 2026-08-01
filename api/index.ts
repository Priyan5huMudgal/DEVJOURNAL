import type { VercelRequest, VercelResponse } from "@vercel/node";
import { app } from "../server";

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // The app middleware will handle initialization on first request
    return app(req, res);
  } catch (error) {
    console.error("API Handler Error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
