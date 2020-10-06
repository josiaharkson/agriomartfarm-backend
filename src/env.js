import dotenv from "dotenv";

dotenv.config();

export class Environment {
 static JWT_SECRET = process.env.JWT_SECRET;

 static DB = {
  development: process.env.MONGO_URI,
  production: process.env.PROD_MONGO_URI,
  test: process.env.MONGO_TEST_URI
 };
}
