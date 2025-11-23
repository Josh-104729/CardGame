import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity("room_log_info")
@Index("idx_creator", ["creator"])
export class RoomLogInfo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  creator!: string;

  @Column({ type: "int", nullable: true })
  bonus?: number;

  @Column({ type: "int", nullable: true })
  fee?: number;

  @Column({ type: "int", nullable: true })
  size?: number;

  @Column({ type: "int", nullable: true })
  status?: number;

  @Column({ type: "int", nullable: true })
  members?: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  created_at?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  updated_at?: string;
}

