import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { StayLog } from "./StayLog";
import { Payment } from "./Payment";

@Entity()
export class Guest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ nullable: true })
  idType: string;

  @Column({ nullable: true })
  idNumber: string;

  @Column({ default: false })
  isVIP: boolean;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => StayLog, stayLog => stayLog.guest)
  stayLogs: StayLog[];

  @OneToMany(() => Payment, payment => payment.guest)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 