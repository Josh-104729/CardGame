import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { PersonInfo, RoomInfo, GameLog, RoomLogInfo } from "../entities";

// Load environment variables before reading them
dotenv.config();

const HOST = process.env.HOST;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;

// Validate required environment variables
if (!HOST || !USER || !PASSWORD || !DATABASE) {
  const missing: string[] = [];
  if (!HOST) missing.push('HOST');
  if (!USER) missing.push('USER');
  if (!PASSWORD) missing.push('PASSWORD');
  if (!DATABASE) missing.push('DATABASE');
  
  console.error('Missing required environment variables:', missing.join(', '));
  console.error('Please create a .env file in the backend directory with the following variables:');
  console.error('HOST=localhost');
  console.error('USER=your_db_user');
  console.error('PASSWORD=your_db_password');
  console.error('DATABASE=your_database_name');
  process.exit(1);
}

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

