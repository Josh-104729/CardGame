import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router = Router();
const authController = new AuthController();

router.post("/log_in", (req, res) => authController.login(req, res));
router.post("/register", (req, res) => authController.register(req, res));
router.post("/clear_tk", (req, res) => authController.clearToken(req, res));
router.post("/validate_token", (req, res) => authController.validateToken(req, res));

export default router;

