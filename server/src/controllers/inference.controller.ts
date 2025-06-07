import { Request, Response, NextFunction, RequestHandler } from "express";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

export const handleImageInference:RequestHandler  = async (req: Request,
  res: Response,
  next: NextFunction): Promise<void> => {
  try {
    const file = (req as any).file;

  if (!file) {
    res.status(400).json({ error: "Image file is required" });
  }
    const formData = new FormData();
    const filePath = path.resolve(file.path);

    formData.append("file", fs.createReadStream(filePath));

    const response = await axios.post("http://localhost:8000/api/image", formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    // Optional: delete temp file after sending
    fs.unlinkSync(filePath);

    res.status(200).json(response.data);
  } catch (err) {
    console.error("Error forwarding image to FastAPI:", err);
    res.status(500).json({ error: "Inference failed" });
    next(err);
  }
};
