import {
 AuthModel,
 SessionModel,
 ProductModel,
 FarmModel,
 ProductStatsModel,
} from "./models";

export const User = new AuthModel();
export const Session = new SessionModel();
export const Product = new ProductModel();
export const Farm = new FarmModel();
export const ProductStat = new ProductStatsModel();
