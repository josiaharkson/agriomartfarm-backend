import mongoose from "mongoose";

export class FarmModel {
 constructor() {
  this.define();
 }

 define() {
  this.model = mongoose.model(
   "Farm",
   new mongoose.Schema({
    name: {
     type: String,
     required: true,
    },
    latitude: {
     type: Number,
     required: true,
    },
    longitude: {
     type: Number,
     required: true,
    },
    userId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "User",
    },
    pic: {
     data: Buffer,
     contentType: String,
    },
   })
  );
 }

 create(body) {
  return Promise.resolve(this.model.create(body));
 }

 findById(_id) {
  return Promise.resolve(this.model.findById(_id));
 }

 findByUserId(userId) {
  return Promise.resolve(this.model.find({ userId }));
 }

 findByName(name) {
  return Promise.resolve(this.model.findOne({ name }));
 }

 findAllFarms() {
  return Promise.resolve(this.model.find({}));
 }

 updateFarmDetails(id, body) {
  return Promise.resolve(
   this.model.findByIdAndUpdate(id, body, {
    new: true,
   })
  );
 }

 delete(_id) {
  return Promise.resolve(this.model.findByIdAndDelete(_id));
 }
}
