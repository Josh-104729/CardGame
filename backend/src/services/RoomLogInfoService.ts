import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { RoomLogInfo } from "../entities/RoomLogInfo";

export class RoomLogInfoService {
  private repository: Repository<RoomLogInfo>;

  constructor() {
    this.repository = AppDataSource.getRepository(RoomLogInfo);
  }

  async create(logData: Partial<RoomLogInfo>): Promise<RoomLogInfo> {
    const log = this.repository.create(logData);
    return await this.repository.save(log);
  }
}

