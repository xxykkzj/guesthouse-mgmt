import { Router } from "express";
import { StayLogController } from "../controllers/StayLogController";

const router = Router();

// Get all stay logs
router.get("/", StayLogController.getAllStayLogs);

// Get stay log by id
router.get("/:id", StayLogController.getStayLogById);

// Create new stay log (booking)
router.post("/", StayLogController.createStayLog);

// Update stay log
router.put("/:id", StayLogController.updateStayLog);

// Check-in process
router.put("/:id/checkin", StayLogController.checkIn);

// Check-out process
router.put("/:id/checkout", StayLogController.checkOut);

// Cancel booking
router.put("/:id/cancel", StayLogController.cancelBooking);

export default router; 