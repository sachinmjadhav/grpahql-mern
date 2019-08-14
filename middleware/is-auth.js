const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  // Check if there's Authorization header
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  // Check if there's token present in the header
  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }
  // Decode the token if present in header
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "somesupersecretkey");
  } catch(err) {
    req.isAuth = false;
    return next();
  }
  // Check if there is not decoded token
  if(!decodedToken) {
    req.isAuth = false;
    return next();
  }
  // If all the checks pass
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};
