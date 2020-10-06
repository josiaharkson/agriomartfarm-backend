import { Farm } from "../db";
import { ErrorResponse } from "../custom";

export const getFarm = async (req, res, next) => {
 try {
  // Get payload from request
  const { payload } = req;

  // Get all farms by user
  const farms = await Farm.findByUserId(payload._id);

  // Find single farm
  const farm = farms.find((f) => f._id.toString() === req.params.farmId);

  // Throw error if farm is not found
  if (!farm)
   throw new ErrorResponse(404, "Farm with given id not found");

  req.farm = farm.toJSON();
  next();
 } catch (error) {
  res.status(error.c || 500).json({
   statusCode: error.c || 500,
   response: error.message
  });
 }
};
