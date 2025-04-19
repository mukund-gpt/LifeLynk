import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
// import mongoSanitize from "express-mongo-sanitize";
// import xss from "xss-clean";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import requestRotuer from "./routes/requestRoutes.js";

// import { fileURLToPath } from "url"
dotenv.config({ path: "./config.env" });

// const AppError = require("./utils/appError");
// const globalErrorHandler = require("./controllers/errorController");

const app = express();

// Enable CORS with specific configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust as per your frontend URL
    credentials: true,
  })
);

// Global Middlewares
app.use(helmet());

// Security headers for Content Security Policy
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://js.stripe.com"],
        connectSrc: ["'self'", "ws://127.0.0.1:*"], // Allow WebSocket for HMR
      },
    },
  })
);
// Development logging
if (process.env.NODE_ENV.trim() === "development") {
  app.use(morgan("dev"));
}

// Rate limiting requests to API
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parsers and data sanitization
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
// app.use(mongoSanitize());
// app.use(xss());

// Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`Request Time: ${req.requestTime}`);
  next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/requests", requestRotuer);

// Error handling for routes that don't exist
// app.all("*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
// });

// Error handling middleware
// app.use(globalErrorHandler);

export default app;
