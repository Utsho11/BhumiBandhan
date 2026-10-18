import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import router from "./app/routes";
import { notFound } from "./app/middlewares/notFound";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import config from "./config";

const app: Application = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "অনুরোধের সীমা অতিক্রম করেছে, অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।",
  },
});

const allowedOrigins = [config.clientUrl, "http://localhost:3000", "http://127.0.0.1:3000"];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app") ||
      config.env !== "production"
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Error: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiLimiter);

app.get("/", (_req, res) => {
  res.json({
    project: "BhumiBandhan (ভূমি-বন্ধন)",
    description: "Smart Land Tech Protocol for Unified Land Verification & E-Governance in Bangladesh",
    status: "Active & Healthy",
    version: "1.0.0",
    hackathon: "LandTech 2026 (DIU CSE & Law)",
    apiEndpoints: {
      parcels: "/api/parcels",
      verify: "/api/verify",
      mutation: "/api/mutation",
      liens: "/api/liens",
      auth: "/api/auth",
    },
  });
});

app.use("/api", router);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
