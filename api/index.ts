import type { VercelRequest, VercelResponse } from "@vercel/node";
import { app, initializeApp } from "../server";

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Ensure app is initialized before handling the request
    await initializeApp();

    // Now call the Express app to handle the request
    return new Promise<void>((resolve, reject) => {
      app(req as any, res as any);

      // Ensure the response completes
      if (res.writableEnded) {
        resolve();
      } else {
        res.on("finish", () => resolve());
        res.on("close", () => resolve());
      }
    });
  } catch (error) {
    console.error("[API Handler] Error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal Server Error",
        code: "INIT_FAILED",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
};
