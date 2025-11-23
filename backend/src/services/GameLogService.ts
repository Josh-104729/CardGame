import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { GameLog } from "../entities/GameLog";

export class GameLogService {
  private repository: Repository<GameLog>;

  constructor() {
    this.repository = AppDataSource.getRepository(GameLog);
  }

  async create(logData: Partial<GameLog>): Promise<GameLog> {
    const log = this.repository.create(logData);
    return await this.repository.save(log);
  }

  async createMultiple(logsData: Partial<GameLog>[]): Promise<void> {
    const logs = logsData.map(data => this.repository.create(data));
    await this.repository.save(logs);
  }
}

