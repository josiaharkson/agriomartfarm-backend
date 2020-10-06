import mongoose from "mongoose";

// Model for farm products farmer has for distribution
export class ProductModel {
 constructor() {
  this.define();
 }

 define() {
  this.model = mongoose.model(
   "Product",
   new mongoose.Schema({
    name: {
     type: String,
     required: true,
    },
    farm: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Farm",
     required: true,
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

 findAllProducts() {
  return Promise.resolve(this.model.find({}));
 }

 findById(_id) {
  return Promise.resolve(this.model.findById(_id));
 }

 findByFarmId(farm) {
  return Promise.resolve(this.model.find({ farm }));
 }

 updateProduct(id, body) {
  return Promise.resolve(
   this.model.findByIdAndUpdate(id, body, {
    new: true,
   })
  );
 }

 deleteSingleRecord(_id) {
  return Promise.resolve(this.model.deleteOne({ _id }));
 }

 deleteAllRecords(farmId) {
  return Promise.resolve(this.model.deleteMany({ farmId }));
 }
}
