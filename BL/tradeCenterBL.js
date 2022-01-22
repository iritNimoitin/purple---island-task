const tradeCenterDAL = require("../DAL/tradeCenterDAL");
const userDAL = require("../DAL/userDAL");

const deleteTrade = async function (id) {
  return await tradeCenterDAL.deleteTradeFromDB(id);
};

const getTrade = async function (id) {
  const trade = await tradeCenterDAL.getTradeByIdFromDB(id);
  if (!trade) {
    throw "this trade doesn't exists in the system";
  }
  return trade;
};

const getAllTrades = async function () {
  return await tradeCenterDAL.getAllTradesFromDB();
};

/**
 * first bring the seller info from database by his name
 * next check if the bid items are existing (validation check)
 * if one of the items is missing throw an error
 * next calculate the minimum bid and after that add the trade object to database
 * @param {*} sellerName
 * @param {*} bidItems
 * @returns
 */
const addTrade = async function (sellerName, bidItems) {
  const seller = await userDAL.getUserByNameFromDB(sellerName);
  if (!seller) {
    throw "this user doesn't exists in the system";
  }
  bidItems.forEach((bidItem) => {
    const validItem = seller.items.find(
      (sellerItem) =>
        sellerItem.name === bidItem.name && sellerItem.amount >= bidItem.amount
    );
    if (!validItem) {
      throw "One of the items that given is missing.";
    }
  });
  const minimumBid = bidItems.reduce(
    (sum, item) => item.amount * item.value + sum,
    0
  );
  const trade = {
    sellerName: sellerName,
    itemsToTrade: bidItems,
    minimumBid: minimumBid,
  };
  return await tradeCenterDAL.addTradeToDB(trade);
};

module.exports = {
  deleteTrade,
  getTrade,
  getAllTrades,
  addTrade,
};
