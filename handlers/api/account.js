let generateAuthToken = require("../../core/middleware").generateAuthToken;
let User = require("../../core/db").User;
let Post = require("../../core/db").Post;

class AccountManager {
  signup(req, res) {
    User.create(req.body, (err, result) => {
      if (err) {
        res.status(400).send(err);
        return;
      }
      let token = generateAuthToken(req.body.email);
      res.send({
        token: token
      });
    });
  }

  login(req, res) {
    User.authenticate(req.body, (err, result) => {
      if (err || !result) {
        res.status(400).send({ message: "authentication failed" });
        return;
      }
      let token = generateAuthToken(result.email);
      res.send({
        token: token
      });
    });
  }

  profile(req, res) {
    const query = { "user.email": req.user.email };
    Post.find(query, (err, result) => {
      if (err) {
        res.status(400).send({ user: req.user, err: err });
        return;
      }
      res.send({
        user: req.user,
        postSet: result
      });
    });
  }

  update(req, res) {
    try {
      let newName = req.body.name;
      User.updateOne(
        { email: req.user.email },
        { $set: { name: newName } },
        (err, result) => {
          if (err) {
            res.status(400).send(err);
            return;
          }
          res.send(result);
        }
      );
    } catch (err) {
      res.status(400).send(err);
    }
  }
}

module.exports = new AccountManager();
