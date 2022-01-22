const Trade = require("../Models/tradeModel");

const getAllTradesFromDB = function () {
  return new Promise((resolve, reject) => {
    Trade.find({}, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const addTradeToDB = function (trade) {
  return new Promise((resolve, reject) => {
    let newTrade = new Trade(trade);

    newTrade.save(function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const deleteTradeFromDB = function (id) {
  return new Promise((resolve, reject) => {
    Trade.findByIdAndDelete(id, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve("Deleted");
      }
    });
  });
};

const getTradeByIdFromDB = function (id) {
  return new Promise((resolve, reject) => {
    Trade.findById(id, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = {
  getAllTradesFromDB,
  addTradeToDB,
  deleteTradeFromDB,
  getTradeByIdFromDB,
};
