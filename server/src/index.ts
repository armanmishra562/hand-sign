import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";

// routes
import healthRouter from "./routes/health";
import inferenceRouter from "./routes/inference.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// health check
app.use("/api/health", healthRouter);
app.use("/api/inference", inferenceRouter);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
