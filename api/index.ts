import type { VercelRequest, VercelResponse } from "@vercel/node";
import { app, initializeApp } from "../server";

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Ensure app is initialized
    await initializeApp();

    // Call the Express app as middleware/handler
    // This will route the request through all registered middlewares and routes
    app(req as any, res as any);
  } catch (error) {
    console.error("[API Handler] Fatal error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
};
