import { Router } from "express";
import { getRentals, createRentals, finishRentals, deleteRentals  } from "../controllers/rentals.Controller.js";
import validationRentals from "../middlewares/rentals.Middlewares.js";

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals",validationRentals, createRentals);
router.post("/rentals/:id/return", finishRentals);
router.delete("/rentals/:id", deleteRentals);

export default router;