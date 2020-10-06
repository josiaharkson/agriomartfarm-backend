export const cors = (origin) => {
 return (req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, PUT, OPTIONS, PATCH, DELETE, POST");
  next();
 };
};
