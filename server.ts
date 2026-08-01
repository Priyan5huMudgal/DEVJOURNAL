import "dotenv/config";
import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { createServer as createViteServer } from "vite";
import serverless from "serverless-http";

import { connectDB, isConnected, connectionError } from "./server/db";
import authRoutes from "./server/routes/authRoutes";
import journalRoutes from "./server/routes/journalRoutes";
import goalRoutes from "./server/routes/goalRoutes";
import roadmapRoutes from "./server/routes/roadmapRoutes";
import resourceRoutes from "./server/routes/resourceRoutes";
import snippetRoutes from "./server/routes/snippetRoutes";
import analyticsRoutes from "./server/routes/analyticsRoutes";

export const app = express();
let appInitialized = false;

async function initializeApp() {
  if (appInitialized) return app;

  const isVercel = Boolean(process.env.VERCEL);
  const startedFromBuiltServer =
    process.argv[1]?.endsWith("dist/server.cjs") ||
    process.argv[1]?.includes("dist/server.cjs");
  const isProduction =
    process.env.NODE_ENV === "production" ||
    isVercel ||
    (process.env.NODE_ENV === undefined && startedFromBuiltServer);

  await connectDB();

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
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
          connectionError || "Service Unavailable: Database not connected.",
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
      "⚡ Running in DEVELOPMENT mode. Mounting Vite Dev middleware...",
    );
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log(
      "📦 Running in PRODUCTION mode. Serving pre-compiled static files...",
    );
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  appInitialized = true;
  return app;
}

export async function startServer() {
  await initializeApp();

  const HOST = process.env.HOST || "0.0.0.0";
  const requestedPort = Number(process.env.PORT) || 3000;

  const startListening = (port: number) => {
    const server = app.listen(port, HOST, () => {
      console.log(`🚀 DevJournal Server running at http://${HOST}:${port}`);
      console.log(`👉 Preview mode enabled via Vite.`);
    });

    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE" && port === requestedPort) {
        const fallbackPort = port + 1;
        console.warn(`Port ${port} is busy. Retrying on ${fallbackPort}...`);
        startListening(fallbackPort);
        return;
      }

      console.error("Fatal Server Boot Error:", error);
      process.exit(1);
    });
  };

  startListening(requestedPort);
}

let cachedHandler: any;
export async function getHandler() {
  await initializeApp();
  if (!cachedHandler) {
    cachedHandler = serverless(app);
  }
  return cachedHandler;
}

export const handler = async (req: any, res: any) => {
  const wrapped = await getHandler();
  return wrapped(req, res);
};

if (!process.env.VERCEL) {
  startServer().catch((error) => {
    console.error("Fatal Server Boot Error:", error);
    process.exit(1);
  });
}
