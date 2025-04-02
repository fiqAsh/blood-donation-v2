import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";

//routes
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import bankRoute from "./routes/bank.route.js";
import searchFilterRoute from "./routes/searchFilter.route.js";
import messageRoute from "./routes/message.route.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
app.use("/api/bank", bankRoute);
app.use("/api/searchFilter", searchFilterRoute);
app.use("/api/message", messageRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  connectDB();
});
