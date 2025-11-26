import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { PersonInfo } from "../entities/PersonInfo";

export class PersonInfoService {
  private repository: Repository<PersonInfo>;

  constructor() {
    this.repository = AppDataSource.getRepository(PersonInfo);
  }

  async findByUsername(username: string): Promise<PersonInfo | null> {
    return await this.repository.findOne({
      where: { username }
    });
  }

  async create(userData: Partial<PersonInfo>): Promise<PersonInfo> {
    const user = this.repository.create(userData);
    return await this.repository.save(user);
  }

  async update(username: string, updateData: Partial<PersonInfo>): Promise<void> {
    await this.repository.update({ username }, updateData);
  }

  async updateBounty(username: string, bounty: number): Promise<void> {
    await this.repository.update({ username }, { bounty });
  }
}

