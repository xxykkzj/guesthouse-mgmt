import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Guest } from "./Guest";
import { StayLog } from "./StayLog";

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded"
}

export enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
  PAYPAL = "paypal",
  WECHAT = "wechat",
  ALIPAY = "alipay"
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  transactionId: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  status: PaymentStatus;

  @Column({
    type: "enum",
    enum: PaymentMethod,
    default: PaymentMethod.CREDIT_CARD
  })
  method: PaymentMethod;

  @Column({ type: "timestamp" })
  paymentDate: Date;

  @ManyToOne(() => Guest, guest => guest.payments)
  guest: Guest;

  @ManyToOne(() => StayLog, stayLog => stayLog.payments)
  stayLog: StayLog;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  receiptNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 