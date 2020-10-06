import { Farm } from "../db";
import { ErrorResponse } from "../custom";

export class FarmController {
 static async add(req, res) {
  try {
   // Retrieve payload and body from request
   const { payload } = req;

   // Parse the data recieved from the request multipart/form-data
   const body = { ...JSON.parse(req.body.data) };

   // Retrieve Image file from request
   const file = req.files?.image;

   if (file) {
    // If an image file has been uploaded
    body.pic = { data: file.data, contentType: file.mimetype };
   }

   // Modify the request body
   body.userId = payload._id;

   // Add farm to the db
   const farm = await Farm.create(body);

   // API response
   const response = {
    ...farm.toJSON(),
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

 // static async getFarmByAuthenticatedUser(req, res) {
 //  try {
 //   // Get all farms
 //   const farms = await Farm.findByUserId(req.payload._id);

 //   // Find a single farm using path parameter
 //   const farm = farms.find((f) => f._id === req.params.id);

 //   // Throw error if farm with specified id is not found
 //   if (!farm)
 //    throw new ErrorResponse(404, "Farm details not found");

 //   // API response
 //   const response = {
 //    ...farm.toJSON()
 //   };

 //   // Send response
 //   res.status(200).json({
 //    statusCode: 200,
 //    response
 //   });
 //  } catch (error) {
 //   res.status(error.c || 500).json({
 //    statusCode: error.c || 500,
 //    response: error.message
 //   });
 //  }
 // }

 static async getAllFarmsByAuthenticatedUser(req, res) {
  try {
   // Get all farms using user id from decoded payload
   const farms = await Farm.findByUserId(req.payload._id);

   // API response
   const response = farms.map((f) => f.toJSON());

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

 static async getFarmById(req, res) {
  try {
   // Find farm by id
   const farm = await Farm.findById(req.params.id);

   // Throw error if farm is not found
   if (!farm)
    throw new ErrorResponse(404, `Farm with id ${req.params.id} not found`);

   // API response
   const response = {
    ...farm.toJSON(),
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

 static async getAllFarms(req, res) {
  try {
   // Get all farms
   const farms = await Farm.findAllFarms();

   // Farms as JSON
   const farmsJson = farms.map((farm) => farm.toJSON());

   // API Response as array with limit. Useful for pagination
   const response = farmsJson.slice(
    parseInt(req.query.limit || "0")
          * (parseInt(req.query.page || "1") - 1),
    parseInt(req.query.limit || farmsJson.length.toString())
          * parseInt(req.query.page || "1")
   );

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

 static async updateFarm(req, res) {
  try {
   // Get payload from request
   const { payload } = req;

   // Get all farms by user
   const farms = await Farm.findByUserId(payload._id);

   // Get id
   const id = farms
    .map((f) => f._id)
    .find((_id) => _id.toString() === req.params.id);

   // Update farm detail
   const updatedFarm = await Farm.updateFarmDetails(id, req.body);

   // Respond with a 404 if farm detail is not found
   if (!updatedFarm)
    throw new ErrorResponse(404, `No farm with id ${id} found`);

   // API response
   const response = {
    ...updatedFarm.toJSON(),
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

 static async deleteSingleFarm(req, res) {
  try {
   // Get payload from request
   const { payload } = req;

   // Get all farms
   const farms = await Farm.findByUserId(payload._id);

   // Map farms to their ids and get id of farm to be deleted
   const id = farms
    .map((farm) => farm._id)
    .find((_id) => _id.toString() === req.params.id);

   // Delete farm and return result
   const farm = await Farm.delete(id);

   // Throw error if farm is not found
   if (!farm) throw new ErrorResponse(404, `Farm with id ${id} not found`);

   // API response
   const response = {
    ...farm.toJSON(),
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

 static async deleteAllFarmsByUser(req, res) {
  try {
   // Get payload from request
   const { payload } = req;

   // Get all farms owned by user
   const farms = await Farm.findByUserId(payload._id);

   // Delete all farms and return them
   const delFarms = farms.map((farm) => Farm.delete(farm._id));

   // Promise
   const promise = await Promise.all(delFarms);

   // API response
   const response = promise.map((farm) => farm.toJSON());

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
}
