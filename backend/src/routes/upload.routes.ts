import { Router } from "express";
import { UploadController } from "../controllers/UploadController";

const router = Router();
const uploadController = new UploadController();

router.post("/upload", (req, res) => uploadController.upload(req, res));

export default router;

