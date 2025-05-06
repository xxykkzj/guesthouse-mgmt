import { Router } from "express";
import { RoomController } from "../controllers/RoomController";

const router = Router();

// Get all rooms
router.get("/", RoomController.getAllRooms);

// Get available rooms
router.get("/available", RoomController.getAvailableRooms);

// Get room by id
router.get("/:id", RoomController.getRoomById);

// Create new room
router.post("/", RoomController.createRoom);

// Update room
router.put("/:id", RoomController.updateRoom);

// Delete room
router.delete("/:id", RoomController.deleteRoom);

export default router; 