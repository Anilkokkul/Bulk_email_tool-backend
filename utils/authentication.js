const jwt = require("jsonwebtoken");

//to authenticate the user is logged in or not
exports.isAuth = (req, res, next) => {
  const cookies = req.cookies;

  if (cookies.accessToken) {
    const obj = jwt.verify(cookies.accessToken, process.env.SECRET_KEY);
    if (!obj._id) {
      res.status(401).send({
        message: "Not Authenticated please login",
      });
    }
    return next();
  }
  res.status(401).send({
    message: "Not Authenticated need to login",
  });
};
