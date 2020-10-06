import mongoose from "mongoose";
import { Encrypt } from "../../helpers";

export class AuthModel {
 constructor() {
  this.define();
 }

 define() {
  const schema = new mongoose.Schema({
   firstName: {
    type: String,
    required: true
   },
   lastName: {
    type: String,
    required: true
   },
   email: {
    type: String,
    required: true,
    unique: true
   },
   password: {
    type: String,
    required: true
   },
   userType: {
    type: String,
    match: /(cons|ret|farm|inv|who|trans)/g
   }
  });

  // Add save pre-hook
  schema.pre("save", function callback(next) {
   const doc = this;
   if (doc.isModified("password"))
    doc.password = Encrypt.hashPw(doc.password);
   next();
  });

  this.model = mongoose.model("User", schema);
 }

 create(body) {
  return Promise.resolve(
   this.model.create(body)
  );
 }

 findByEmail(email) {
  return Promise.resolve(
   this.model.findOne({ email })
  );
 }

 findById(_id) {
  return Promise.resolve(
   this.model.findById(_id)
  );
 }

 findAll() {
  return Promise.resolve(
   this.model.find()
  );
 }

 findByIdAndUpdate(_id, update) {
  return Promise.resolve(
   this.model.findByIdAndUpdate(_id, update, { new: true })
  );
 }
}
