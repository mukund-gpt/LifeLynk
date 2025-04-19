import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});

if (!process.env.DATABASE) {
  throw new Error("DATABASE environment variable is not defined");
}
// console.log(process.env.DATABASE_PASSWORD);
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
).replace("<USERNAME>", process.env.DATABASE_USERNAME);
// console.log(DB);
// if you want to use localdata base then replace db with process.env.LOCAL_DATABASE and declare this config file
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log("DB connection successful!");
  });

// Server setup
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

//To handle any promise rejection
process.on("unhandledRejection", (err) => {
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
