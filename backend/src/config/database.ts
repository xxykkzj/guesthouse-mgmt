import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Room } from "../entities/Room";
import { Bed } from "../entities/Bed";
import { Guest } from "../entities/Guest";
import { StayLog } from "../entities/StayLog";
import { Payment } from "../entities/Payment";

dotenv.config();

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "guesthouse",
  password: process.env.DB_PASS || "guesthouse123",
  database: process.env.DB_NAME || "guesthouse_db",
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  entities: [Room, Bed, Guest, StayLog, Payment],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
});

export default AppDataSource; 