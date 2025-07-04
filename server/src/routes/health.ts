import { Router, Request, Response } from "express";
const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: Date.now() });
});

export default router;
