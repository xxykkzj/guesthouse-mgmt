import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Room } from "./Room";
import { Bed } from "./Bed";
import { Guest } from "./Guest";
import { Payment } from "./Payment";

export enum StayStatus {
  BOOKED = "booked",
  CHECKED_IN = "checked_in",
  CHECKED_OUT = "checked_out",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show"
}

@Entity()
export class StayLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "timestamp" })
  checkInDate: Date;

  @Column({ type: "timestamp" })
  checkOutDate: Date;

  @Column({
    type: "enum",
    enum: StayStatus,
    default: StayStatus.BOOKED
  })
  status: StayStatus;

  @ManyToOne(() => Room, room => room.stayLogs)
  room: Room;

  @ManyToOne(() => Bed, bed => bed.stayLogs, { nullable: true })
  bed: Bed;

  @ManyToOne(() => Guest, guest => guest.stayLogs)
  guest: Guest;

  @Column()
  guestCount: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ nullable: true })
  specialRequests: string;

  @Column({ nullable: true })
  notes: string;

  @OneToMany(() => Payment, payment => payment.stayLog)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 