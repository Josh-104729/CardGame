import "reflect-metadata";
import { DataSource } from "typeorm";
import { PersonInfo, RoomInfo, GameLog, RoomLogInfo } from "../entities";

const HOST = process.env.HOST;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;

// Force IPv4 if HOST is 'localhost' to avoid IPv6 connection issues
const dbHost = (HOST === 'localhost' || HOST === '::1') ? '127.0.0.1' : HOST;

export const AppDataSource = new DataSource({
  type: "mysql",
  host: dbHost,
  port: 3306,
  username: USER,
  password: PASSWORD,
  database: DATABASE,
  synchronize: false, // Set to false in production - we manage migrations manually
  logging: false,
  entities: [PersonInfo, RoomInfo, GameLog, RoomLogInfo],
  migrations: [],
  subscribers: [],
});

