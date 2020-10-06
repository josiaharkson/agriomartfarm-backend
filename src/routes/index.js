import { Router } from "express";
import userRouter from "./user";
import farmRouter from "./farm";
import productRouter from "./product";

const router = Router();

router.use("/user", userRouter);
router.use("/farm", farmRouter);
router.use("/product", productRouter);

export default router;
