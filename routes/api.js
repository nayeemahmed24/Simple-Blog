let express = require("express");
let router = express.Router();
let middleware = require("../core/middleware");

let AccountManager = require("../handlers/api/account");
let PostManager = require("../handlers/api/post");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post("/login", AccountManager.login);
router.post("/signup", AccountManager.signup);
router.get("/profile", middleware.checkToken, AccountManager.profile);
router.post("/profile/update", middleware.checkToken, AccountManager.update);

router.post("/post/create", middleware.checkToken, PostManager.createPost);
router.get("/post/all", PostManager.allPost);
router.get("/post/:id", PostManager.singlePost);
router.post("/post/rating",middleware.checkToken,PostManager.update);

router.get("/post/:id/delete", middleware.checkToken, PostManager.deletePost);

module.exports = router;
