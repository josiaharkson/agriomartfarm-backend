import { Router } from "express";
import { UserController } from "../controller";
import { Auth } from "../middlewares";

const router = Router();

router.post(
 "/register",
 //  Auth.checkIfkeysPresent(["email", "password", "firstName", "lastName"]),
 //  Auth.checkIfEmailInUse,
 Auth.ValidateRegisterBody,
 UserController.register
);
router.post("/login", UserController.signIn);
router.get("/authenticated", Auth.hasToken, UserController.getUserWithSession);
router.patch("/update", Auth.hasToken, UserController.updateUserDetails);
router.get("/logout", Auth.hasToken, UserController.logUserOut);

export default router;
