import { Request, Response } from "express";
import AppDataSource from "../config/database";
import { Room, RoomStatus, RoomType } from "../entities/Room";

const roomRepository = AppDataSource.getRepository(Room);

export class RoomController {
  // Get all rooms
  static async getAllRooms(req: Request, res: Response) {
    try {
      const rooms = await roomRepository.find({
        relations: ["beds"],
        order: { roomNumber: "ASC" }
      });
      
      return res.status(200).json(rooms);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get room by id
  static async getRoomById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      
      const room = await roomRepository.findOne({
        where: { id },
        relations: ["beds", "stayLogs", "stayLogs.guest"]
      });
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      return res.status(200).json(room);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Create room
  static async createRoom(req: Request, res: Response) {
    try {
      const { roomNumber, type, floor, status, pricePerNight, maxOccupancy, description } = req.body;
      
      // Check if room number already exists
      const existingRoom = await roomRepository.findOne({ where: { roomNumber } });
      if (existingRoom) {
        return res.status(400).json({ message: "Room number already exists" });
      }
      
      const room = new Room();
      room.roomNumber = roomNumber;
      room.type = type || RoomType.STANDARD;
      room.floor = floor;
      room.status = status || RoomStatus.AVAILABLE;
      room.pricePerNight = pricePerNight;
      room.maxOccupancy = maxOccupancy;
      room.description = description;
      
      await roomRepository.save(room);
      
      return res.status(201).json(room);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update room
  static async updateRoom(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { roomNumber, type, floor, status, pricePerNight, maxOccupancy, description, isActive } = req.body;
      
      const room = await roomRepository.findOne({ where: { id } });
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      // Check if room number already exists (if updating room number)
      if (roomNumber && roomNumber !== room.roomNumber) {
        const existingRoom = await roomRepository.findOne({ where: { roomNumber } });
        if (existingRoom) {
          return res.status(400).json({ message: "Room number already exists" });
        }
      }
      
      room.roomNumber = roomNumber || room.roomNumber;
      room.type = type || room.type;
      room.floor = floor || room.floor;
      room.status = status || room.status;
      room.pricePerNight = pricePerNight || room.pricePerNight;
      room.maxOccupancy = maxOccupancy || room.maxOccupancy;
      room.description = description !== undefined ? description : room.description;
      room.isActive = isActive !== undefined ? isActive : room.isActive;
      
      await roomRepository.save(room);
      
      return res.status(200).json(room);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Delete room
  static async deleteRoom(req: Request, res: Response) {
    try {
      const id = req.params.id;
      
      const room = await roomRepository.findOne({ 
        where: { id },
        relations: ["stayLogs"]
      });
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      // Check if room has active stays
      const hasActiveStays = room.stayLogs.some(stayLog => 
        stayLog.status === "booked" || stayLog.status === "checked_in"
      );
      
      if (hasActiveStays) {
        return res.status(400).json({ message: "Cannot delete room with active stays" });
      }
      
      // Soft delete by marking as inactive
      room.isActive = false;
      await roomRepository.save(room);
      
      return res.status(200).json({ message: "Room deactivated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get available rooms
  static async getAvailableRooms(req: Request, res: Response) {
    try {
      const { checkInDate, checkOutDate, roomType } = req.query;
      
      if (!checkInDate || !checkOutDate) {
        return res.status(400).json({ message: "Check-in and check-out dates are required" });
      }
      
      const queryBuilder = roomRepository.createQueryBuilder("room")
        .leftJoinAndSelect("room.beds", "bed")
        .where("room.isActive = :isActive", { isActive: true })
        .andWhere("room.status = :status", { status: RoomStatus.AVAILABLE });
        
      if (roomType) {
        queryBuilder.andWhere("room.type = :roomType", { roomType });
      }
      
      // Exclude rooms with overlapping stay dates
      queryBuilder.andWhere(`
        room.id NOT IN (
          SELECT DISTINCT room.id FROM room
          INNER JOIN stay_log ON stay_log.roomId = room.id
          WHERE stay_log.status IN ('booked', 'checked_in')
          AND (
            (stay_log.checkInDate <= :checkOutDate AND stay_log.checkOutDate >= :checkInDate)
          )
        )
      `, { 
        checkInDate: new Date(checkInDate as string),
        checkOutDate: new Date(checkOutDate as string) 
      });
      
      const availableRooms = await queryBuilder.getMany();
      
      return res.status(200).json(availableRooms);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
} 