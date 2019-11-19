let jwt = require("jsonwebtoken");
const config = require("./config");
let User = require("./db").User;

let checkToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (token) {
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
      jwt.verify(token, config.SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.send({
            authication: "failed",
            message: "invalid token"
          });
        }
        req.decoded = decoded;
        getUser(req, res, next);
      });
    } else {
      return res.send({
        message: "invalid auth token"
      });
    }
  } else {
    return res.send({
      message: "authentication required"
    });
  }
};

let generateAuthToken = email => {
  let token = jwt.sign({ email: email }, config.SECRET_KEY, {
    expiresIn: "24h"
  });
  return token;
};

let getUser = (req, res, next) => {
  try {
    User.findOne({ email: req.decoded.email }, (err, result) => {
      if (result !== null) {
        req.user = result;
        next();
      } else {
        res.send({ message: "user loaded failed" });
      }
    });
  } catch (err) {
    res.send({ message: "user load failed" });
  }
};

module.exports = {
  checkToken: checkToken,
  generateAuthToken: generateAuthToken
};
