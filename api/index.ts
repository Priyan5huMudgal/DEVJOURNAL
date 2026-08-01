import type { VercelRequest, VercelResponse } from "@vercel/node";
import { app, initializeApp } from "../server";

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    console.log(
      `[${new Date().toISOString()}] Incoming request: ${req.method} ${req.url}`,
    );

    // Ensure app is initialized
    console.log("Initializing app...");
    await initializeApp();
    console.log("App initialized successfully");

    // Call the Express app as middleware/handler
    console.log("Routing request through Express app");
    app(req as any, res as any);

    // Wait for response to complete in serverless environment
    if (!res.writableEnded) {
      await new Promise<void>((resolve) => {
        res.on("finish", resolve);
        res.on("close", resolve);
      });
    }
  } catch (error) {
    console.error("[API Handler] Fatal initialization error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
};
