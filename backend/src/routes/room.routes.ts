import { Router } from "express";
import { RoomController } from "../controllers/RoomController";

const router = Router();
const roomController = new RoomController();

router.post("/create_room", (req, res) => {
  const io = req.app.get("io");
  roomController.createRoom(req, res, io);
});

router.post("/get_rooms", (req, res) => roomController.getRooms(req, res));

export default router;

