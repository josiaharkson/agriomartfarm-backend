import { Router } from "express";
import { FarmController } from "../controller";
import { Auth } from "../middlewares";

const router = Router();

router.post("/add", Auth.hasToken, Auth.hasRole("farm"), FarmController.add);
router.get("/all/byUser", Auth.hasToken, Auth.hasRole("farm"), FarmController.getAllFarmsByAuthenticatedUser);
router.get("/all", FarmController.getAllFarms);
router.get("/get/:id", FarmController.getFarmById);
router.patch("/update/:id", Auth.hasToken, Auth.hasRole("farm"), FarmController.updateFarm);
router.delete("/delete/single/:id", Auth.hasToken, Auth.hasRole("farm"), FarmController.deleteSingleFarm);
router.delete("/delete/all", Auth.hasToken, Auth.hasRole("farm"), FarmController.deleteAllFarmsByUser);

export default router;
