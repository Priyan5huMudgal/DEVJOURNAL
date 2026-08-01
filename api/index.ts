import type { VercelRequest, VercelResponse } from "@vercel/node";
import { app } from "../server";

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Call Express app as a standard Node.js request handler
    // TypeScript requires casting to handle the slight type mismatch
    return app(req as any, res as any);
  } catch (error) {
    console.error("[API] Handler Error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal Server Error",
        code: "HANDLER_ERROR",
      });
    }
  }
};
