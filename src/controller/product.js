import { Product, ProductStat, Farm } from "../db";
import { ErrorResponse } from "../custom";

export class ProductController {
 static async addProduct(req, res) {
  try {
   // Parse the data recieved from the request multipart/form-data
   const body = { ...JSON.parse(req.body.data) };

   // Get Single farms by farm ID
   const farmCheck = await Farm.findById(body.farm);

   // Throw error if farm is not found
   if (!farmCheck)
    throw new ErrorResponse(404, "Farm with given id not found");

   let pic;

   // Retrieve Image file from request
   const file = req.files?.image;

   if (file) {
    // If an image file has been uploaded
    pic = { data: file.data, contentType: file.mimetype };
   }

   // Create product
   const p = await Product.create({
    name: body.name,
    farm: body.farm,
    pic,
   });

   // Create record
   const r = await ProductStat.addRecord({
    product: p._id,
    quantity: body.quantity || 1,
    sold: body.sold || 0,
   });

   // Get relationship
   const rPopulated = await r.execPopulate();

   // API response
   const response = {
    message: "Product added to farm.",
    productRecord: {
     ...rPopulated.toJSON(),
    },
   };

   // Send response
   res.status(201).json({
    statusCode: 201,
    response,
   });
  } catch (error) {
   res.status(500).json({
    statusCode: 500,
    response: error.message,
   });
  }
 }

 static async getProducts(req, res) {
  try {
   // Get products
   const products = await Product.findByFarmId(req.params.farmId);

   // Products as json
   const productsJson = products.map((p) => p.toJSON());

   // API response
   const response = productsJson;

   // Send response
   res.status(200).json({
    statusCode: 200,
    response,
   });
  } catch (error) {
   res.status(500).json({
    statusCode: 500,
    response: error.message,
   });
  }
 }

 static async getProduct(req, res) {
  try {
   // Get product by its ID
   const product = await Product.findById(req.params.id);

   // Throw error if product wasn't found
   if (!product) throw new ErrorResponse(404, "Product wasn't found");

   // API response
   const response = {
    ...product.toJSON(),
   };

   // Send response
   res.status(200).json({
    statusCode: 200,
    response,
   });
  } catch (error) {
   res.status(error.c || 500).json({
    statusCode: error.c || 500,
    response: error.message,
   });
  }
 }

 static async getProductStat(req, res) {
  try {
   // Get product statistic
   const stats = await ProductStat.findByProductId(req.params.id);

   // Populate
   const sPopulated = await stats.execPopulate();

   // API response
   const response = {
    ...sPopulated.toJSON(),
   };

   // Send response
   res.status(200).json({
    statusCode: 200,
    response,
   });
  } catch (error) {
   res.status(500).json({
    statusCode: 500,
    response: error.message,
   });
  }
 }

 static async updateProduct(req, res) {
  try {
   // Get farm from request
   const { farm } = req;

   // Find all products
   const products = await Product.findByFarmId(farm._id);

   // Get single product id
   const pId = products
    .map((p) => p._id)
    .find((i) => i.toString() === req.params.id);

   // Update product
   const p = await Product.updateProduct(pId, req.body);

   // Throw error if product is not found
   if (!p) throw new ErrorResponse(404, "Product not found");

   // API response
   const response = {
    ...p.toJSON(),
   };

   // Send response
   res.status(200).json({
    statusCode: 200,
    response,
   });
  } catch (error) {
   res.status(error.c || 500).json({
    statusCode: error.c || 500,
    response: error.message,
   });
  }
 }

 static async getAllProducts(req, res) {
  try {
   // Get product by its ID
   const products = await Product.findAllProducts();

   // Throw error if product wasn't found
   if (!products.length)
    throw new ErrorResponse(404, "No Product has been added!");

   // API response
   const response = products.map((f) => f.toJSON());

   // Send response
   res.status(200).json({
    statusCode: 200,
    response,
   });
  } catch (error) {
   res.status(error.c || 500).json({
    statusCode: error.c || 500,
    response: error.message,
   });
  }
 }
}
