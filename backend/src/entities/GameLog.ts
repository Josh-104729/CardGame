import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity("game_logs")
@Index("idx_room_id", ["room_id"])
@Index("idx_username", ["username"])
export class GameLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  room_id!: number;

  @Column({ type: "varchar", length: 255 })
  username!: string;

  @Column({ type: "int", nullable: true })
  bonus?: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  create_at?: string;
}

