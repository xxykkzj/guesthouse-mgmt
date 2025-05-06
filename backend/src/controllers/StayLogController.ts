import { Request, Response } from "express";
import AppDataSource from "../config/database";
import { StayLog, StayStatus } from "../entities/StayLog";
import { Room, RoomStatus } from "../entities/Room";
import { Bed, BedStatus } from "../entities/Bed";
import { Guest } from "../entities/Guest";
import { v4 as uuidv4 } from "uuid";

const stayLogRepository = AppDataSource.getRepository(StayLog);
const roomRepository = AppDataSource.getRepository(Room);
const bedRepository = AppDataSource.getRepository(Bed);
const guestRepository = AppDataSource.getRepository(Guest);

export class StayLogController {
  // Get all stay logs
  static async getAllStayLogs(req: Request, res: Response) {
    try {
      const stayLogs = await stayLogRepository.find({
        relations: ["room", "bed", "guest", "payments"],
        order: { createdAt: "DESC" }
      });
      
      return res.status(200).json(stayLogs);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get stay log by id
  static async getStayLogById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      
      const stayLog = await stayLogRepository.findOne({
        where: { id },
        relations: ["room", "bed", "guest", "payments"]
      });
      
      if (!stayLog) {
        return res.status(404).json({ message: "Stay log not found" });
      }
      
      return res.status(200).json(stayLog);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Create stay log (booking)
  static async createStayLog(req: Request, res: Response) {
    try {
      const { roomId, bedId, guestId, checkInDate, checkOutDate, guestCount, totalAmount, specialRequests, notes } = req.body;
      
      // Validate check-in/out dates
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      
      if (checkIn >= checkOut) {
        return res.status(400).json({ message: "Check-out date must be after check-in date" });
      }
      
      // Validate room availability
      const room = await roomRepository.findOne({
        where: { id: roomId },
        relations: ["stayLogs"]
      });
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      if (room.status !== RoomStatus.AVAILABLE) {
        return res.status(400).json({ message: "Room is not available" });
      }
      
      // Check for overlapping bookings
      const existingBookings = room.stayLogs.filter(stayLog => 
        (stayLog.status === StayStatus.BOOKED || stayLog.status === StayStatus.CHECKED_IN) &&
        stayLog.checkInDate <= checkOut &&
        stayLog.checkOutDate >= checkIn
      );
      
      if (existingBookings.length > 0) {
        return res.status(400).json({ message: "Room is already booked for these dates" });
      }
      
      // Validate bed if provided
      let bed = null;
      if (bedId) {
        bed = await bedRepository.findOne({
          where: { id: bedId, room: { id: roomId } }
        });
        
        if (!bed) {
          return res.status(404).json({ message: "Bed not found or not in the specified room" });
        }
        
        if (bed.status !== BedStatus.AVAILABLE) {
          return res.status(400).json({ message: "Bed is not available" });
        }
      }
      
      // Validate guest
      const guest = await guestRepository.findOne({ where: { id: guestId } });
      
      if (!guest) {
        return res.status(404).json({ message: "Guest not found" });
      }
      
      // Create stay log
      const stayLog = new StayLog();
      stayLog.checkInDate = checkIn;
      stayLog.checkOutDate = checkOut;
      stayLog.status = StayStatus.BOOKED;
      stayLog.room = room;
      if (bed) stayLog.bed = bed;
      stayLog.guest = guest;
      stayLog.guestCount = guestCount;
      stayLog.totalAmount = totalAmount;
      stayLog.specialRequests = specialRequests;
      stayLog.notes = notes;
      
      await stayLogRepository.save(stayLog);
      
      // Update room and bed status if necessary
      room.status = RoomStatus.OCCUPIED;
      await roomRepository.save(room);
      
      if (bed) {
        bed.status = BedStatus.OCCUPIED;
        await bedRepository.save(bed);
      }
      
      return res.status(201).json(stayLog);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update stay log
  static async updateStayLog(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { status, checkInDate, checkOutDate, guestCount, totalAmount, specialRequests, notes } = req.body;
      
      const stayLog = await stayLogRepository.findOne({
        where: { id },
        relations: ["room", "bed", "guest"]
      });
      
      if (!stayLog) {
        return res.status(404).json({ message: "Stay log not found" });
      }
      
      if (checkInDate) stayLog.checkInDate = new Date(checkInDate);
      if (checkOutDate) stayLog.checkOutDate = new Date(checkOutDate);
      if (guestCount) stayLog.guestCount = guestCount;
      if (totalAmount) stayLog.totalAmount = totalAmount;
      if (specialRequests !== undefined) stayLog.specialRequests = specialRequests;
      if (notes !== undefined) stayLog.notes = notes;
      
      // Update status and handle room/bed status changes
      if (status && status !== stayLog.status) {
        stayLog.status = status;
        
        if (status === StayStatus.CHECKED_IN) {
          stayLog.room.status = RoomStatus.OCCUPIED;
          await roomRepository.save(stayLog.room);
          
          if (stayLog.bed) {
            stayLog.bed.status = BedStatus.OCCUPIED;
            await bedRepository.save(stayLog.bed);
          }
        } else if (status === StayStatus.CHECKED_OUT || status === StayStatus.CANCELLED) {
          // Check if room has other active stays
          const otherActiveStays = await stayLogRepository.count({
            where: {
              room: { id: stayLog.room.id },
              id: { not: stayLog.id },
              status: StayStatus.CHECKED_IN
            }
          });
          
          if (otherActiveStays === 0) {
            stayLog.room.status = RoomStatus.AVAILABLE;
            await roomRepository.save(stayLog.room);
          }
          
          if (stayLog.bed) {
            stayLog.bed.status = BedStatus.AVAILABLE;
            await bedRepository.save(stayLog.bed);
          }
        }
      }
      
      await stayLogRepository.save(stayLog);
      
      return res.status(200).json(stayLog);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Check-in process
  static async checkIn(req: Request, res: Response) {
    try {
      const id = req.params.id;
      
      const stayLog = await stayLogRepository.findOne({
        where: { id },
        relations: ["room", "bed", "guest"]
      });
      
      if (!stayLog) {
        return res.status(404).json({ message: "Stay log not found" });
      }
      
      if (stayLog.status !== StayStatus.BOOKED) {
        return res.status(400).json({ message: `Cannot check in. Current status: ${stayLog.status}` });
      }
      
      stayLog.status = StayStatus.CHECKED_IN;
      
      stayLog.room.status = RoomStatus.OCCUPIED;
      await roomRepository.save(stayLog.room);
      
      if (stayLog.bed) {
        stayLog.bed.status = BedStatus.OCCUPIED;
        await bedRepository.save(stayLog.bed);
      }
      
      await stayLogRepository.save(stayLog);
      
      return res.status(200).json(stayLog);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Check-out process
  static async checkOut(req: Request, res: Response) {
    try {
      const id = req.params.id;
      
      const stayLog = await stayLogRepository.findOne({
        where: { id },
        relations: ["room", "bed", "guest", "payments"]
      });
      
      if (!stayLog) {
        return res.status(404).json({ message: "Stay log not found" });
      }
      
      if (stayLog.status !== StayStatus.CHECKED_IN) {
        return res.status(400).json({ message: `Cannot check out. Current status: ${stayLog.status}` });
      }
      
      // Check if payment is complete
      const totalPaid = stayLog.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
      
      if (totalPaid < Number(stayLog.totalAmount)) {
        return res.status(400).json({ 
          message: "Cannot check out until payment is complete",
          amountDue: Number(stayLog.totalAmount) - totalPaid
        });
      }
      
      stayLog.status = StayStatus.CHECKED_OUT;
      
      // Check if room has other active stays
      const otherActiveStays = await stayLogRepository.count({
        where: {
          room: { id: stayLog.room.id },
          id: { not: stayLog.id },
          status: StayStatus.CHECKED_IN
        }
      });
      
      if (otherActiveStays === 0) {
        stayLog.room.status = RoomStatus.AVAILABLE;
        await roomRepository.save(stayLog.room);
      }
      
      if (stayLog.bed) {
        stayLog.bed.status = BedStatus.AVAILABLE;
        await bedRepository.save(stayLog.bed);
      }
      
      await stayLogRepository.save(stayLog);
      
      return res.status(200).json(stayLog);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Cancel booking
  static async cancelBooking(req: Request, res: Response) {
    try {
      const id = req.params.id;
      
      const stayLog = await stayLogRepository.findOne({
        where: { id },
        relations: ["room", "bed"]
      });
      
      if (!stayLog) {
        return res.status(404).json({ message: "Stay log not found" });
      }
      
      if (stayLog.status !== StayStatus.BOOKED) {
        return res.status(400).json({ message: `Cannot cancel. Current status: ${stayLog.status}` });
      }
      
      stayLog.status = StayStatus.CANCELLED;
      
      // Check if room has other active stays
      const otherActiveStays = await stayLogRepository.count({
        where: {
          room: { id: stayLog.room.id },
          id: { not: stayLog.id },
          status: StayStatus.CHECKED_IN
        }
      });
      
      if (otherActiveStays === 0) {
        stayLog.room.status = RoomStatus.AVAILABLE;
        await roomRepository.save(stayLog.room);
      }
      
      if (stayLog.bed) {
        stayLog.bed.status = BedStatus.AVAILABLE;
        await bedRepository.save(stayLog.bed);
      }
      
      await stayLogRepository.save(stayLog);
      
      return res.status(200).json(stayLog);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
} 