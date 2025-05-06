import { Router } from "express";
import roomRoutes from "./room.routes";
import bedRoutes from "./bed.routes";
import guestRoutes from "./guest.routes";
import stayLogRoutes from "./stayLog.routes";
import paymentRoutes from "./payment.routes";

const router = Router();

router.use("/rooms", roomRoutes);
router.use("/beds", bedRoutes);
router.use("/guests", guestRoutes);
router.use("/staylogs", stayLogRoutes);
router.use("/payments", paymentRoutes);

export default router; 