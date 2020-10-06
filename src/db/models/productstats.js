import mongoose from "mongoose";

export class ProductStatsModel {
 constructor() {
  this.define();
 }

 define() {
  this.model = mongoose.model("ProductStats", new mongoose.Schema({
   product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    unique: true
   },
   quantity: {
    type: Number,
    default: 1
   },
   sold: {
    type: Number,
    default: 0
   }
  }));
 }

 addRecord(body) {
  return Promise.resolve(
   this.model.create(body)
  );
 }

 findByProductId(product) {
  return Promise.resolve(
   this.model.findOne({ product })
  );
 }

 updateRecordByProductId(product, u) {
  return Promise.resolve(
   this.model.findOneAndUpdate({ product }, u, {
    new: true
   })
  );
 }
}
