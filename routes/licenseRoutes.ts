import { Router } from "express";
import {
  createLicence,
  deleteLicense,
  getLicense,
  updateLicense,
} from "../controller/licenseController";
import { authenticateToken } from "../middlewares/authenticationToken";

const router = Router();

router.get("/get/:id", authenticateToken, getLicense);
router.post("/create", authenticateToken, createLicence);
router.put("/update/:id", authenticateToken, updateLicense);
router.delete("/delete/:id", authenticateToken, deleteLicense);

export default router;
