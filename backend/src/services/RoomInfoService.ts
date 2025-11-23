import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { RoomInfo } from "../entities/RoomInfo";

export class RoomInfoService {
  private repository: Repository<RoomInfo>;

  constructor() {
    this.repository = AppDataSource.getRepository(RoomInfo);
  }

  async findById(roomId: number): Promise<RoomInfo | null> {
    return await this.repository.findOne({
      where: { room_id: roomId }
    });
  }

  async findByCreatorAndStatus(creator: string, status: number): Promise<RoomInfo | null> {
    return await this.repository.findOne({
      where: { creator, status }
    });
  }

  async create(roomData: Partial<RoomInfo>): Promise<RoomInfo> {
    const room = this.repository.create(roomData);
    return await this.repository.save(room);
  }

  async update(roomId: number, updateData: Partial<RoomInfo>): Promise<void> {
    await this.repository.update({ room_id: roomId }, updateData);
  }

  async searchRooms(
    searchKey: string,
    pageSize: number,
    pageNum: number
  ): Promise<{ rooms: RoomInfo[]; total: number }> {
    const queryBuilder = this.repository
      .createQueryBuilder("room_info")
      .where("room_info.status < :status", { status: 3 })
      .andWhere(
        "(room_info.creator LIKE :search OR CAST(room_info.room_id AS CHAR) LIKE :search)",
        { search: `%${searchKey}%` }
      )
      .orderBy("room_info.room_id", "DESC")
      .skip(pageNum * pageSize)
      .take(pageSize);

    const [rooms, total] = await queryBuilder.getManyAndCount();
    return { rooms, total };
  }
}

