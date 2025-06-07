import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";

// routes
import healthRouter from "./routes/health";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// health check
app.use("/api/health", healthRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
