let Post = require("../../core/db").Post;
let getObjectId = require("../../core/db").getObjectId;

class PostManager {
  singlePost(req, res) {
    try {
      const id = new getObjectId(req.params.id);
      Post.findOne({ _id: id }, (err, result) => {
        if (err) {
          res.status(400).send(err);
          return;
        }
        res.send(result);
      });
    } catch (err) {
      res.status(400).send(err);
    }
  }

  allPost(req, res) {
    try {
      Post.find({}, (err, result) => {
        if (err) {
          res.send(err);
        }
        res.send(result);
      });
    } catch (error) {
      res.send(error);
    }
  }

  createPost(req, res) {
    let data = req.body;
    data.user = req.user;
    data.time = new Date().toLocaleTimeString();
    data.date = new Date().toLocaleDateString();
    Post.create(data, (err, result) => {
      if (err) {
        res.status(400).send(err);
        return;
      }
      res.send(result.ops[0]);
    });
  }
  update(req,res){
     try {
       //let rating = req.body.rating;
       const query = { "post._id": req.body.id };
       
       Post.findOne({_id:new getObjectId(req.body.id)}, (err, result) => {
        if (err) {
          res.status(400).send({ post: req.body, err: err });
          return;
        }
        Post.updateOne(
          {
          _id:new getObjectId(req.body.id)
        },
        {$inc:{
          "cnt":1
        }}
        );
        Post.updateOne(
          {_id:new getObjectId(req.body.id)},
          {$set:{"rating":parseFloat(req.body.rating).toFixed(2)}}
        );
        res.send({
          postSet: result
        });
      });
      
          
    } catch (error) {
      res.status(400).send(error);
    }
    
  }



  deletePost(req, res) {
    try {
      const id = new getObjectId(req.params.id);
      Post.findOne({ _id: id }, (err, result) => {
        if (err) {
          res.status(400).send(err);
          return;
        }
        if (!req.user._id.equals(result.user._id)) {
          res.status(405).send("access denied");
          return;
        }
        Post.deleteOne({ _id: id }, (err, result) => {
          if (err) {
            res.status(400).send(err);
            return;
          }
          res.send(result);
        });
      });
    } catch (err) {
      res.status(400).send(err);
    }
  }
}

module.exports = new PostManager();
