import { Router } from "express";
import {
  createLicence,
  deleteLicense,
  getLicense,
  updateLicense,
  licenseIsPremium,
} from "../controller/licenseController";
import { authenticateToken } from "../middlewares/authenticationToken";
import { restaurantLicense } from "../middlewares/restaurantLicense";

const router = Router();

router.get("/get", authenticateToken, getLicense);
router.post("/create", authenticateToken, createLicence);
router.put("/update/:id", authenticateToken, updateLicense);
router.delete("/delete/:id", authenticateToken, deleteLicense);
router.get(
  "/isPremium",
  authenticateToken,
  restaurantLicense,
  licenseIsPremium
);

export default router;
