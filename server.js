import "dotenv/config";
import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { createServer as createViteServer } from "vite";
import { connectDB, isConnected, connectionError } from "./server/db.js";
import authRoutes from "./server/routes/authRoutes.js";
import journalRoutes from "./server/routes/journalRoutes.js";
import goalRoutes from "./server/routes/goalRoutes.js";
import roadmapRoutes from "./server/routes/roadmapRoutes.js";
import resourceRoutes from "./server/routes/resourceRoutes.js";
import snippetRoutes from "./server/routes/snippetRoutes.js";
import analyticsRoutes from "./server/routes/analyticsRoutes.js";
const app = express();
let appInitialized = false;
let initPromise = null;
async function initializeApp() {
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
          timestamp: /* @__PURE__ */ new Date(),
        });
      });
      if (!isProduction) {
        console.log(
          "\u26A1 Running in DEVELOPMENT mode. Mounting Vite Dev middleware...",
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
          console.warn("\u26A0\uFE0F Vite middleware failed:", error);
        }
      } else {
        console.log("\u{1F4E6} Serving production build...");
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
async function startServer() {
  await initializeApp();
  const HOST = process.env.HOST || "0.0.0.0";
  const PORT = Number(process.env.PORT) || 3e3;
  const listen = (port) => {
    const server = app.listen(port, HOST, () => {
      console.log(`\u{1F680} DevJournal running at http://${HOST}:${port}`);
    });
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        const nextPort = port + 1;
        console.warn(
          `\u26A0\uFE0F Port ${port} is in use. Trying ${nextPort}...`,
        );
        if (nextPort <= port + 10) {
          listen(nextPort);
          return;
        }
        console.error("\u274C No available ports found.");
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
var server_default = app;
export { app, server_default as default, initializeApp, startServer };
