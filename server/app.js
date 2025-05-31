import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

// Importing routes and error handler
import userRouter from "./routes/userRoutes.js";
import requestRouter from "./routes/requestRoutes.js";
import globalErrorHandler from "./controllers/errorController.js";

dotenv.config({ path: "./config.env" });

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
  })
);

// Set security-related HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://js.stripe.com"],
        connectSrc: ["'self'", "ws://127.0.0.1:*"], // For local dev (WebSocket)
      },
    },
  })
);

// Log requests in development mode
if (process.env.NODE_ENV?.trim() === "development") {
  app.use(morgan("dev"));
}

// Limit repeated requests from the same IP
const limiter = rateLimit({
  max: 200, // Max requests per windowMs
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Parse incoming requests with JSON or URL-encoded payloads
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser()); // Parse cookies from incoming requests

// Custom middleware to log request time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Mount route handlers
app.use("/api/v1/users", userRouter);
app.use("/api/v1/requests", requestRouter);

// Global error handling middleware
app.use(globalErrorHandler);

// Export the app for use in server.js
export default app;
