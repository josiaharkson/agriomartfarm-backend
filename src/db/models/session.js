import mongoose from "mongoose";

export class SessionModel {
 constructor() {
  this.define();
 }

 define() {
  this.model = mongoose.model("Session", new mongoose.Schema({
   sessionId: String
  }));
 }

 // Invalidate a session using custom session id
 invalidate(sessionId) {
  return Promise.resolve(
   this.model.create({ sessionId })
  );
 }

 // Check if session is invalid in which case user has to sign another token
 async isInvalid(sessionId) {
  const m = await this.model.findOne({ sessionId });
  return Promise.resolve(!!m);
 }
}
