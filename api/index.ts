import type { VercelRequest, VercelResponse } from "@vercel/node";
import { app, initializeApp } from "../server";

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Initialize app on first request
    await initializeApp();

    // Call Express app handler
    // Express app works as a request handler in serverless
    app(req as any, res as any);
  } catch (error) {
    console.error("[Serverless Handler] Unhandled error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
};
