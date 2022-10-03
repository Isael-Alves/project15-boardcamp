import { Router } from "express";
import {
  getCustomers,
  postCustomers,
  putCustomers,
  getCustomersId,
} from "../controllers/customers.Controllers.js";
import { customersMiddlewares, updateCustomersMiddlewares } from "../middlewares/customers.Middlewares.js";

const router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomersId);
router.post("/customers", customersMiddlewares, postCustomers);
router.put("/customers/:id", updateCustomersMiddlewares, putCustomers);

export default router;
