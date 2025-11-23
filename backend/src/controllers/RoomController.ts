import { Request, Response } from "express";
import { RoomInfoService } from "../services/RoomInfoService";
import { RoomLogInfoService } from "../services/RoomLogInfoService";
import { T } from "../constants/texts";
import {
  CreateRoomRequest,
  GetRoomsRequest,
  CreateRoomResponse,
  GetRoomsResponse,
} from "../types";

export class RoomController {
  private roomInfoService: RoomInfoService;
  private roomLogInfoService: RoomLogInfoService;

  constructor() {
    this.roomInfoService = new RoomInfoService();
    this.roomLogInfoService = new RoomLogInfoService();
  }

  async createRoom(req: Request<{}, CreateRoomResponse, CreateRoomRequest>, res: Response<CreateRoomResponse>, io: any): Promise<void> {
    try {
      const { creator, bonus, fee, size, status } = req.body;

      const existingRoom = await this.roomInfoService.findByCreatorAndStatus(creator, 0);

      const new_result: CreateRoomResponse = {
        msg: "",
        roomID: -1,
      };

      if (existingRoom) {
        new_result.variant = "warning";
        new_result.msg = T.CREATE_ROOM_DUPLICATE;
        new_result.roomID = -1;
        res.send(new_result);
        return;
      }

      const create_at = new Date().toISOString();
      await this.roomInfoService.create({
        creator,
        bonus,
        fee,
        size,
        status,
        created_at: create_at,
        updated_at: create_at,
        members: 0,
      });

      const createdRoom = await this.roomInfoService.findByCreatorAndStatus(creator, 0);

      if (!createdRoom) {
        throw new Error("Room creation failed");
      }

      new_result.variant = "success";
      new_result.msg = T.CREATE_ROOM_SUCCESS;
      new_result.roomID = createdRoom.room_id;

      await this.roomLogInfoService.create({
        creator,
        bonus,
        fee,
        size,
        status,
        created_at: create_at,
        updated_at: create_at,
        members: 1,
      });

      io.sockets.emit("room_refetch");
      res.send(new_result);
    } catch (err) {
      console.error("Create room error:", err);
      res.status(500).send({
        variant: "error",
        msg: "Server error",
        roomID: -1,
      });
    }
  }

  async getRooms(req: Request<{}, GetRoomsResponse, GetRoomsRequest>, res: Response<GetRoomsResponse>): Promise<void> {
    try {
      const { search_key = "", pgSize = 5, pgNum = 1 } = req.body;
      const pageSize = pgSize || 5;
      const pageNum = parseInt(pgNum.toString()) - 1;

      const { rooms, total } = await this.roomInfoService.searchRooms(
        search_key,
        pageSize,
        pageNum
      );

      res.send({
        data: rooms,
        total: [{ total_cnt: total }],
      });
    } catch (err) {
      console.error("Get rooms error:", err);
      res.status(500).send({
        data: [],
        total: [{ total_cnt: 0 }],
      });
    }
  }
}

