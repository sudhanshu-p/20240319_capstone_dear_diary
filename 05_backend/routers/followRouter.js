// Setting up the express router
const express = require("express");
const { verifyToken } = require("../helpers/helperFunctions");
const { follow, unfollow } = require("../controllers/followController");
const router = express.Router();

router.post('/follow',verifyToken,follow)

router.delete('/unfollow',verifyToken,unfollow)

module.exports = router
