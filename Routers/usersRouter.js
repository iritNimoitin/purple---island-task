const express = require("express");
const userBL = require("../BL/userBL");

const router = express.Router();

/**
 * get all users from database
 */
router.route("/all").get(async function (req, resp) {
  try {
    const result = await userBL.getAllUsers();
    return resp.json(result);
  } catch (err) {
    return resp.json(err);
  }
});

/**
 * get user by id from database
 */
router.route("/userById").get(async (req, resp) => {
  try {
    const result = await userBL.getUserById(req.headers.id);
    return resp.json(result);
  } catch (err) {
    return resp.json(err);
  }
});

/**
 * get user by username from database
 */
router.route("/userByName").get(async (req, resp) => {
  try {
    const result = await userBL.getUserByName(req.headers.username);
    console.log(result);
    return resp.json(result);
  } catch (err) {
    return resp.json(err);
  }
});

/**
 * update username in database
 */
router.route("/username").put(async (req, resp) => {
  try {
    const preUsername = req.body.preUsername;
    const newUsername = req.body.newUsername;
    const result = await userBL.updateUsername(preUsername, newUsername);
    return resp.json(result);
  } catch (err) {
    return resp.json(err);
  }
});

/**
 * update image in database
 */
router.route("/image").post(async (req, resp) => {
  try {
    const username = req.body.username;
    const newImage = req.body.newImage;
    const result = await userBL.updateUserImage(username, newImage);
    return resp.json(result);
  } catch (err) {
    return resp.json(err);
  }
});

/**
 * add user to database
 */
router.route("/addUser").post(async (req, resp) => {
  try {
    const username = req.body.username;
    const image = req.body.image;
    const result = await userBL.addUser(username, image);
    return resp.json(result);
  } catch (err) {
    return resp.json(err);
  }
});

/**
 * delete user from database by username
 */
router.route("/deleteUser").delete(async (req, resp) => {
  try {
    const result = await userBL.deleteUser(req.headers.username);
    return resp.json(result);
  } catch (err) {
    return resp.json(err);
  }
});

/**
 * generate user items. each user can generate his items only ones
 */
router.route("/generateItems").post(async (req, resp) => {
  try {
    const result = await userBL.generateItems(req.headers.username);
    return resp.json(result);
  } catch (err) {
    return resp.json(err);
  }
});

module.exports = router;
