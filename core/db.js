const MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;

var DB = function(){
    const DB_URL = "mongodb://localhost:27017";
    const DB_NAME = "project";

    var db = null;

    async function Connect(){
        try {
            let _connection = await MongoClient.connect(DB_URL);
            return _connection.db("project");
        } catch (error) {
            return error;
        }
    }

    async function Reference(){
        try {
            if(db!=null){
                return db;
            }else {
               db = await Connect();
               return db; 
            }
        } catch (error) {
            return error;
        }
    }
    return {
        Reference: Reference
    };
};

function getObjectId(_id){
    return new ObjectId(_id);
}

class Model {
    constructor(collection){
        this.collection = collection;
        this.DB = DB();
    }
    async findOne(query,listener){
        let db = await this.DB.Reference();
        db.collection(this.collection).findOne(query,listener);
    }
    async find(query,listener){
        let db = await this.DB.Reference();
        db.collection(this.collection)
        .find(query).toArray(listener);
    }
    async insertOne(obj,listener){
        let db = await this.DB.Reference();
        db.collection(this.collection).insert(obj,listener);
    }
    async insertMany(arr,listener){
        let db = await this.DB.Reference();
        db.collection(this.collection).insertMany(arr,listener);
    }
    async updateOne(query,obj,listener){
        let db = await this.DB.Reference();
        db.collection(this.collection).updateOne(query,obj,listener);
    }
    async deleteOne(query, listener) {
        let db = await this.DB.Reference();
        db.collection(this.collection).deleteOne(query, listener);
      }
    
      async deleteMany(query, listener) {
        let db = await this.DB.Reference();
        db.collection(this.collection).deleteMany(query, listener);
      }

}

class User extends Model {
    constructor(){
        super("user");
    }
    create(data,listener){
        try {
            this.findOne({email:data.email},(err,result)=>{
                if(result!=null){
                    listener({message:"email already registerd"});
                    return;
                }
                this.insertOne({
                    name: data.name,
                    email: data.email,
                    password: data.password
                },listener);
            });
        } catch (err) {
            listener(err,null);
        }
    }
    authenticate(data, listener) {
        try {
          this.findOne({ email: data.email, password: data.password }, listener);
        } catch (err) {
          listener(err, null);
        }
      }
}
class Like extends Model{
    constructor(){
        super("like");
    }
}
class Post extends Model{
    constructor(){
        super("post");
    }
    create(data, listener) {
        try {
          this.insertOne(
            {
              title: data.title,
              body: data.body,
              time: data.time,
              date: data.date,
              user: data.user,
              rating:0,
              cnt:0
            },
            listener
          );
        } catch (err) {
          listener(err, null);
        }
      }
     
}
module.exports = {
    DB: DB(),
    User: new User(),
    Post: new Post(),
    getObjectId: getObjectId
  };