import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config({ path: "./config.env" });

// Handle uncaught exceptions (like undefined variables)
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

if (!process.env.DATABASE) {
  throw new Error("DATABASE environment variable is not defined");
}

// Connect to MongoDB
mongoose.connect(process.env.DATABASE).then(() => {
  console.log("✅ DB connection successful!");
});

app.get("/", (req, res) => {
  return res.send("Welcome to LifeLynk API");
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`🚀 App running on port ${port}...`);
});

// Gracefully handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION 💥 Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
