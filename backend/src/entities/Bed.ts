import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Room } from "./Room";
import { StayLog } from "./StayLog";

export enum BedType {
  SINGLE = "single",
  DOUBLE = "double",
  QUEEN = "queen",
  KING = "king",
  BUNK = "bunk"
}

export enum BedStatus {
  AVAILABLE = "available",
  OCCUPIED = "occupied",
  MAINTENANCE = "maintenance"
}

@Entity()
export class Bed {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  bedNumber: string;

  @Column({
    type: "enum",
    enum: BedType,
    default: BedType.SINGLE
  })
  type: BedType;

  @Column({
    type: "enum",
    enum: BedStatus,
    default: BedStatus.AVAILABLE
  })
  status: BedStatus;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  additionalPricePerNight: number;

  @ManyToOne(() => Room, room => room.beds)
  room: Room;

  @OneToMany(() => StayLog, stayLog => stayLog.bed)
  stayLogs: StayLog[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 