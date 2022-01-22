const User = require("../Models/usersModel");

const getAllUsersFromDB = function () {
  return new Promise((resolve, reject) => {
    User.find({}, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const addUserToDB = function (user) {
  return new Promise((resolve, reject) => {
    let newUser = new User(user);

    newUser.save(function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const deleteUserFromDB = function (id) {
  return new Promise((resolve, reject) => {
    User.findByIdAndDelete(id, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve("user was Deleted");
      }
    });
  });
};

const getUserByNameFromDB = function (username) {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        username: username,
      },
      function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};

const getUserByIdFromDB = function (id) {
  return new Promise((resolve, reject) => {
    User.findById(id, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const updateUserItemsDB = function (id, items) {
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(
      id,
      {
        items: items,
      },
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve("user's items are updated");
        }
      }
    );
  });
};

const updateUsernameDB = function (id, newUsername) {
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(
      id,
      {
        username: newUsername,
      },
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve("username was updated to : " + newUsername);
        }
      }
    );
  });
};

const updateImageDB = function (id, newImage) {
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(
      id,
      {
        image: newImage,
      },
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve("image is Updated");
        }
      }
    );
  });
};

const addUserDealDB = function (id, deal) {
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(id, { deals: deal }, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve("the deal is updated");
      }
    });
  });
};

module.exports = {
  getUserByNameFromDB,
  getUserByIdFromDB,
  deleteUserFromDB,
  updateUserItemsDB,
  addUserDealDB,
  getAllUsersFromDB,
  addUserToDB,
  updateUsernameDB,
  updateImageDB,
};
