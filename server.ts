import "dotenv/config";
import express, { Express } from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { createServer as createViteServer } from "vite";

import { connectDB, isConnected, connectionError } from "./server/db";
import authRoutes from "./server/routes/authRoutes";
import journalRoutes from "./server/routes/journalRoutes";
import goalRoutes from "./server/routes/goalRoutes";
import roadmapRoutes from "./server/routes/roadmapRoutes";
import resourceRoutes from "./server/routes/resourceRoutes";
import snippetRoutes from "./server/routes/snippetRoutes";
import analyticsRoutes from "./server/routes/analyticsRoutes";

export const app: Express = express();

let appInitialized = false;
let initPromise: Promise<void> | null = null;

export async function initializeApp(): Promise<void> {
  if (appInitialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const isProduction = process.env.NODE_ENV === "production";

      await connectDB();

      app.use(
        helmet({
          contentSecurityPolicy: false,
          crossOriginEmbedderPolicy: false,
        })
      );

      app.use(
        cors({
          origin: true,
          credentials: true,
        })
      );

      app.use(express.json({ limit: "10mb" }));
      app.use(express.urlencoded({ extended: true, limit: "10mb" }));
      app.use(cookieParser());

      app.use("/api", (req, res, next) => {
        if (req.path === "/health") return next();

        if (!isConnected) {
          return res.status(503).json({
            success: false,
            message:
              connectionError ||
              "Service Unavailable: Database not connected.",
          });
        }

        next();
      });

      app.use("/api/auth", authRoutes);
      app.use("/api/journal", journalRoutes);
      app.use("/api/goals", goalRoutes);
      app.use("/api/roadmaps", roadmapRoutes);
      app.use("/api/resources", resourceRoutes);
      app.use("/api/snippets", snippetRoutes);
      app.use("/api/analytics", analyticsRoutes);

      app.get("/api/health", (req, res) => {
        res.json({
          success: isConnected,
          status: isConnected ? "healthy" : "disconnected",
          error: connectionError,
          timestamp: new Date(),
        });
      });

      if (!isProduction) {
        console.log(
          "⚡ Running in DEVELOPMENT mode. Mounting Vite Dev middleware..."
        );

        try {
          const vite = await createViteServer({
            server: {
              middlewareMode: true,
            },
            appType: "spa",
          });

          app.use(vite.middlewares);
        } catch (error) {
          console.warn(
            "⚠️ Vite middleware failed:",
            error
          );
        }
      } else {
        console.log("📦 Serving production build...");

        const distPath = path.join(process.cwd(), "dist");

        app.use(express.static(distPath));

        app.get("*", (req, res) => {
          res.sendFile(path.join(distPath, "index.html"));
        });
      }

      appInitialized = true;
    } catch (error) {
      console.error("Failed to initialize application:", error);
      appInitialized = false;
      initPromise = null;
      throw error;
    }
  })();

  return initPromise;
}

export async function startServer() {
  await initializeApp();

  const HOST = process.env.HOST || "0.0.0.0";
  const PORT = Number(process.env.PORT) || 3000;

  const listen = (port: number) => {
    const server = app.listen(port, HOST, () => {
      console.log(`🚀 DevJournal running at http://${HOST}:${port}`);
    });

    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        const nextPort = port + 1;

        console.warn(
          `⚠️ Port ${port} is in use. Trying ${nextPort}...`
        );

        if (nextPort <= port + 10) {
          listen(nextPort);
          return;
        }

        console.error("❌ No available ports found.");
        process.exit(1);
      }

      console.error(error);
      process.exit(1);
    });
  };

  listen(PORT);
}

let initStarted = false;

app.use(async (req, res, next) => {
  if (!initStarted) {
    initStarted = true;

    try {
      await initializeApp();
    } catch (error) {
      console.error(error);
      return res.status(503).json({
        error: "Application initialization failed",
      });
    }
  }

  next();
});

startServer().catch((error) => {
  console.error("Fatal Server Boot Error:", error);
  process.exit(1);
});

export default app;