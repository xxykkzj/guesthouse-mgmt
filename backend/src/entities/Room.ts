import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Bed } from "./Bed";
import { StayLog } from "./StayLog";

export enum RoomType {
  STANDARD = "standard",
  DELUXE = "deluxe",
  SUITE = "suite",
  DORM = "dorm"
}

export enum RoomStatus {
  AVAILABLE = "available",
  OCCUPIED = "occupied",
  MAINTENANCE = "maintenance",
  CLEANING = "cleaning"
}

@Entity()
export class Room {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  roomNumber: string;

  @Column({
    type: "enum",
    enum: RoomType,
    default: RoomType.STANDARD
  })
  type: RoomType;

  @Column()
  floor: number;

  @Column({
    type: "enum",
    enum: RoomStatus,
    default: RoomStatus.AVAILABLE
  })
  status: RoomStatus;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  pricePerNight: number;

  @Column()
  maxOccupancy: number;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Bed, bed => bed.room)
  beds: Bed[];

  @OneToMany(() => StayLog, stayLog => stayLog.room)
  stayLogs: StayLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 