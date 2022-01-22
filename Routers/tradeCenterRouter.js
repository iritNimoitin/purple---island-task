const express = require("express");
const tradeCenterBL = require("../BL/tradeCenterBL");
const userBL = require("../BL/userBL");

const router = express.Router();

/**
 * get all trades from database
 */
router.route("/all").get(async function (req, resp) {
  try {
    const result = await tradeCenterBL.getAllTrades();
    return resp.json(result);
  } catch (err) {
    return resp.json(err);
  }
});

/**
 * get trade by id from database
 */
router.route("/trade").get(async (req, resp) => {
  try {
    const result = await tradeCenterBL.getTrade(req.headers.id);
    return resp.json(result);
  } catch (err) {
    return resp.json(err);
  }
});

/**
 * add trade to database
 */
router.route("/addTrade").post(async (req, resp) => {
  try {
    const sellerName = req.headers.seller_name;
    const bidItems = req.body.bidItems;
    const result = await tradeCenterBL.addTrade(sellerName, bidItems);
    await userBL.tradeItems(sellerName, bidItems);
    return resp.json(result);
  } catch (err) {
    return resp.json(err);
  }
});

/**
 * first getting the trade from database by id
 * than calculating the bid amount
 * next checking if the items that were offered are actually existing ,if not throwing an error
 * after that updating both of the traders-the seller and the buyer - remove the items that were sold and add the items that were gotten
 * finally adding the deal to users table for the history record and deleting this offer from the trade center
 */
router.route("/trade").delete(async (req, resp) => {
  try {
    const traderName = req.headers.trader_name;
    const tradeId = req.headers.trade_id;
    const itemsToTrade = req.body.itemsToTrade;
    const tradeFromDB = await tradeCenterBL.getTrade(tradeId);
    const bidAmount = itemsToTrade.reduce(
      (sum, item) => item.amount * item.value + sum,
      0
    );
    if (bidAmount < tradeFromDB.minimumBid) {
      return resp.json("The bid offer does't cover the minimum bid.");
    }
    await userBL.tradeItems(traderName, itemsToTrade);
    await userBL.addItems(traderName, tradeFromDB.itemsToTrade);

    await userBL.addItems(tradeFromDB.sellerName, itemsToTrade);
    await userBL.addDeal(
      tradeFromDB.sellerName,
      tradeFromDB.itemsToTrade,
      itemsToTrade,
      traderName
    );
    const result = await tradeCenterBL.deleteTrade(tradeId);
    return resp.json(result);
  } catch (err) {
    return resp.json(err);
  }
});

module.exports = router;
