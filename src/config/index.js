import express from "express";
import logger from "morgan";
import fileUpload from "express-fileupload";
import { cors } from "../middlewares";
import router from "../routes";

export default (app) => {
 app.use(express.json());
 app.use(
  express.urlencoded({
   extended: false,
  })
 );
 app.use(logger("dev"));
 app.use(cors("*"));
 app.use(fileUpload());
 app.use("/api", router);
 return app;
};
