import { Router } from "express";
import { createLicence, deleteLicense, getLicense, updateLicense } from "../controller/licenseController";


const router = Router();

router.get("/get/:id", getLicense);
router.post("/create/", createLicence);
router.put("/update/:id", updateLicense);
router.delete("/delete/:id", deleteLicense);

export default router;
