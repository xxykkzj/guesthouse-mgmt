// Room Types
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

export interface Room {
  id: string;
  roomNumber: string;
  type: RoomType;
  floor: number;
  status: RoomStatus;
  pricePerNight: number;
  maxOccupancy: number;
  description?: string;
  isActive: boolean;
  beds: Bed[];
  createdAt: string;
  updatedAt: string;
}

// Bed Types
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

export interface Bed {
  id: string;
  bedNumber: string;
  type: BedType;
  status: BedStatus;
  additionalPricePerNight?: number;
  roomId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Guest Types
export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  idType?: string;
  idNumber?: string;
  isVIP: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// StayLog Types
export enum StayStatus {
  BOOKED = "booked",
  CHECKED_IN = "checked_in",
  CHECKED_OUT = "checked_out",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show"
}

export interface StayLog {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  status: StayStatus;
  roomId: string;
  room: Room;
  bedId?: string;
  bed?: Bed;
  guestId: string;
  guest: Guest;
  guestCount: number;
  totalAmount: number;
  specialRequests?: string;
  notes?: string;
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

// Payment Types
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

export interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  paymentDate: string;
  guestId: string;
  stayLogId: string;
  notes?: string;
  receiptNumber?: string;
  createdAt: string;
  updatedAt: string;
} 