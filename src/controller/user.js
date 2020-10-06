import { v4 as uuid } from "uuid";
import { User, Session } from "../db";
import { JWT, Encrypt } from "../helpers";
import { ErrorResponse } from "../custom";

export class UserController {
 static async register(req, res) {
  try {
   // Create new user using request body
   const user = await User.create(req.body);

   // API response
   const response = {
    email: user.email,
    fullName: `${user.firstName} ${user.lastName}`,
    id: user._id,
    role: user.userType,
    token: JWT.sign({
     ...user.toJSON(),
     sessionId: uuid()
    })
   };

   // Send response
   res.status(201).json({
    statusCode: 201,
    response
   });
  } catch (error) {
   res.status(500).json({
    statusCode: 500,
    response: error.message
   });
  }
 }

 static async signIn(req, res) {
  try {
   // Find user using their email
   const user = await User.findByEmail(req.body.email);

   // Respond with a 404 if no user with email is found
   if (!user)
    throw new ErrorResponse(404, `User with email ${req.body.email} not found.`);

   // Respond with a 400 if password is incorrect
   if (!Encrypt.compare(req.body.password, user.password))
    throw new ErrorResponse(400, "Password is incorrect.");

   // API Response
   const response = {
    email: user.email,
    id: user._id,
    fullName: `${user.firstName} ${user.lastName}`,
    role: user.userType,
    token: JWT.sign({
     ...user.toJSON(),
     sessionId: uuid()
    })
   };

   // Send response
   res.status(200).json({
    statusCode: 200,
    response: {
     ...response,
     message: "Successfully signed user in."
    }
   });
  } catch (error) {
   res.status(error.c || 500).json({
    statusCode: error.c || 500,
    response: error.message
   });
  }
 }

 static async getUserWithSession(req, res) {
  try {
   // Get payload from modified request
   const { payload } = req;

   // Filtered payload
   const filteredPayload = {
    id: payload._id,
    email: payload.email,
    role: payload.userType,
    fullName: `${payload.firstName} ${payload.lastName}`,
    sessionId: payload.sessionId
   };

   // Send response
   res.status(200).json({
    statusCode: 200,
    response: {
     ...filteredPayload
    }
   });
  } catch (error) {
   res.status(500).json({
    statusCode: 500,
    response: error.message
   });
  }
 }

 static async updateUserDetails(req, res) {
  try {
   // Payload from request
   const { payload } = req;

   // Hash password if field is present in request body
   if (req.body.password)
    req.body.password = Encrypt.hashPw(req.body.password);

   // Find by id and update
   const user = await User.findByIdAndUpdate(payload._id, req.body);

   // Throw error if user is not found
   if (!user)
    throw new ErrorResponse(404, "User with id not found");

   // console.log(user.toJSON());

   // Invalidate former session
   const formerSession = (await Session.invalidate(payload.sessionId)).toJSON();

   // Generate new session token
   const token = JWT.sign({
    ...user.toJSON(),
    sessionId: uuid()
   });

   // API response
   const response = {
    id: user._id,
    email: user.email,
    fullName: `${user.firstName} ${user.lastName}`,
    role: user.userType,
    token,
    formerSession
   };

   // Send response
   res.status(200).json({
    statusCode: 200,
    response
   });
  } catch (error) {
   res.status(error.c || 500).json({
    statusCode: error.c || 500,
    response: error.message
   });
  }
 }

 static async logUserOut(req, res) {
  try {
   // Get payload from request
   const { payload } = req;

   // Invalidate session
   const session = await Session.invalidate(payload.sessionId);

   // Session as json
   const sessionJson = session.toJSON();

   // API response
   const response = {
    sessionId: sessionJson.sessionId,
    objectId: sessionJson._id,
    message: `Successfully signed out user with email: ${payload.email}`
   };

   // Send response
   res.status(200).json({
    statusCode: 200,
    response
   });
  } catch (error) {
   res.status(500).json({
    statusCode: 500,
    response: error.message
   });
  }
 }
}
