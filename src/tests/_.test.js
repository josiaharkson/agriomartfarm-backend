import { expect } from "chai";
import debug from "debug";
import chalk from "chalk";
import request from "supertest";
import { User } from "../db";
import app from "..";

const ROOT = "/api";
const tokens = {};
let singleFarmId = "";

const log = debug("test");

describe("ALL TESTS", () => {
 describe("USER TESTS", () => {
  before((done) => {
   User.model.deleteMany({}).then(() => {
    done();
   });
  });
  it("should register new user", (done) => {
   const requestBody = {
    firstName: "Silas",
    lastName: "Paulus",
    password: "thisistestpassword",
    email: "s_paulus@agromart.com",
    userType: "farm"
   };

   request(app)
    .post(ROOT + "/user/register")
    .send(requestBody)
    .end((err, res) => {
     log(chalk.bgGray(chalk.blue(JSON.stringify(res.body, null, 2))));
     tokens.user1 = res.body.response.token;
     expect(res.status).to.be.eql(201);
     done(err);
    });
  });
  it("should log user in", (done) => {
   const requestBody = {
    email: "s_paulus@agromart.com",
    password: "thisistestpassword"
   };

   request(app)
    .post(ROOT + "/user/login")
    .send(requestBody)
    .end((err, res) => {
     log(chalk.bgWhiteBright(chalk.magentaBright(JSON.stringify(res.body, null, 2))));
     tokens.user1 = res.body.response.token;
     expect(res.status).to.be.eql(200);
     done(err);
    });
  });
  it("should get authenticated user", (done) => {
   request(app)
    .get(ROOT + "/user/authenticated")
    .set("Authorization", `Bearer ${tokens.user1}`)
    .end((err, res) => {
     log(chalk.bgMagentaBright(chalk.whiteBright(JSON.stringify(res.body, null, 2))));
     expect(res.status).to.be.eql(200);
     done(err);
    });
  });
  it("should update user details", (done) => {
   request(app)
    .patch(ROOT + "/user/update")
    .set("Authorization", `Bearer ${tokens.user1}`)
    .send({ password: "thisistestpasswordnumber2" })
    .end((err, res) => {
     log(chalk.bgRedBright(chalk.yellowBright(JSON.stringify(res.body, null, 2))));
     expect(res.status).to.be.eql(200);
     done(err);
    });
  });
 });
 describe("FARM TESTS", () => {
  it("should add farm to the database", (done) => {
   request(app)
    .post(ROOT + "/farm/add")
    .set("Authorization", `Bearer ${tokens.user1}`)
    .send({ name: "Almundia farms", latitude: 0, longitude: 3 })
    .end((err, res) => {
     singleFarmId = res.body.response._id;
     log(chalk.bgBlackBright(chalk.greenBright(JSON.stringify(res.body, null, 2))));
     expect(res.status).to.be.eql(201);
     done(err);
    });
  });
  it("should get farm by its id", (done) => {
   request(app)
    .get(ROOT + "/farm/get/" + singleFarmId)
    .end((err, res) => {
     log(chalk.bgWhiteBright(chalk.redBright(JSON.stringify(res.body, null, 2))));
     expect(res.status).to.be.eql(200);
     done(err);
    });
  });
  // eslint-disable-next-line max-len
  // This is to test and affirm that only users with a farmer's privilege can access specific endpoints
  it("should register a user with a role other than a farmer's", (done) => {
   const requestBody = {
    firstName: "Bernoulli",
    lastName: "Schwartz",
    email: "bschwartz@agromart.com",
    password: "bernoullischwartz",
    userType: "inv"
   };

   request(app)
    .post(ROOT + "/user/register")
    .send(requestBody)
    .end((err, res) => {
     tokens.user2 = res.body.response.token;
     expect(res.status).to.be.eql(201);
     done(err);
    });
  });
  it("should respond with a 400 if user with a different role tries to add a farm", (done) => {
   request(app)
    .post(ROOT + "/farm/add")
    .set("Authorization", `Bearer ${tokens.user2}`)
    .send({ name: "McStanley Tomato Farm", latitude: 0, longitude: 0 })
    .end((err, res) => {
     log(chalk.bgBlue(chalk.gray(JSON.stringify(res.body, null, 2))));
     expect(res.status).to.be.eql(400);
     done(err);
    });
  });
  it("should update a farm by its id", (done) => {
   request(app)
    .patch(ROOT + "/farm/update/" + singleFarmId)
    .set("Authorization", `Bearer ${tokens.user1}`)
    .send({ name: "Calgary Farm" })
    .end((err, res) => {
     log(chalk.bgRedBright(chalk.blueBright(JSON.stringify(res.body, null, 2))));
     expect(res.status).to.be.eql(200);
     done(err);
    });
  });
  it("should get all farms", (done) => {
   request(app)
    .get(ROOT + "/farm/all")
    .end((err, res) => {
     log(chalk.bgGray(chalk.whiteBright(JSON.stringify(res.body, null, 2))));
     expect(res.status).to.be.eql(200);
     done(err);
    });
  });
  it("should get all farms with paging and limiting applied", (done) => {
   request(app)
    .get(ROOT + "/farm/all?page=1&limit=1")
    .end((err, res) => {
     log(chalk.bgBlack(chalk.blueBright(JSON.stringify(res.body, null, 2))));
     expect(res.status).to.be.eql(200);
     done(err);
    });
  });
 });
});
