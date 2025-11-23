import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity("room_info")
@Index("idx_creator", ["creator"])
@Index("idx_status", ["status"])
export class RoomInfo {
  @PrimaryGeneratedColumn()
  room_id!: number;

  @Column({ type: "varchar", length: 255 })
  creator!: string;

  @Column({ type: "int", nullable: true })
  bonus?: number;

  @Column({ type: "int", nullable: true })
  fee?: number;

  @Column({ type: "int", nullable: true })
  size?: number;

  @Column({ type: "int", default: 0 })
  members!: number;

  @Column({ 
    type: "int", 
    default: 0,
    comment: "0=Waiting, 1=Full, 2=Playing, 3=Closed"
  })
  status!: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  created_at?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  updated_at?: string;
}

