import { Router } from "express";
import authRoutes from "./auth.routes";
import roomRoutes from "./room.routes";
import uploadRoutes from "./upload.routes";

const router = Router();

router.use("/", authRoutes);
router.use("/", roomRoutes);
router.use("/", uploadRoutes);

export default router;

