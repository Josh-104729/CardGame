import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity("person_info")
@Index("username", ["username"], { unique: true })
@Index("idx_signtoken", ["signtoken"])
export class PersonInfo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  full_name?: string;

  @Column({ type: "varchar", length: 255, unique: true })
  username!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "int", default: 10000 })
  bounty!: number;

  @Column({ type: "varchar", length: 500, default: "------" })
  signtoken!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  birthdate?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  gender?: string;

  @Column({ type: "int", default: 0 })
  allowedbyadmin!: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  email?: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  avatar_url?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  create_at?: string;
}

