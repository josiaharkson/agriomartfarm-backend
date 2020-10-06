import { Router } from "express";
import { ProductController } from "../controller";
import { Auth, Farm } from "../middlewares";

const router = Router();

router.post(
 "/add/:farmId",
 Auth.hasToken,
 Auth.hasRole("farm"),
 ProductController.addProduct
);

router.get("/getall", ProductController.getAllProducts);
router.get("/:farmId", ProductController.getProducts);
router.get("/single/:id", ProductController.getProduct);
router.get("/stats/:id", ProductController.getProductStat);
router.patch(
 "/update/:farmId/:id",
 Auth.hasToken,
 Auth.hasRole("farm"),
 Farm.getFarm,
 ProductController.updateProduct
);

export default router;
