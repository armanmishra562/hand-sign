import { Router } from "express";
import { upload } from "../middleware/upload.middleware";
import { handleImageInference } from "../controllers/inference.controller";

const router = Router();

router.post("/image", upload.single("file"), handleImageInference);

export default router;
