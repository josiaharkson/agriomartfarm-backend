export const arePresent = (body, keys) => {
 for (const key of keys)
  if (!body[key] || (body[key]).toString().trim().length === 0)
   return false;
 return true;
};
