const userDAL = require("../DAL/userDAL");
const itemsDAL = require("../DAL/itemsDAL");

const getAllUsers = async function () {
  return await userDAL.getAllUsersFromDB();
};

const getUserById = async function (id) {
  const user = await userDAL.getUserByIdFromDB(id);
  if (!user) {
    throw "User does't exists in the system.";
  }
  return user;
};

const getUserByName = async function (username) {
  const user = await userDAL.getUserByNameFromDB(username);
  if (!user) {
    throw "User does't exists in the system.";
  }
  return user;
};

const deleteUser = async function (username) {
  const user = await userDAL.getUserByNameFromDB(username);
  if (!user) {
    throw "User does't exists in the system.";
  }
  return await userDAL.deleteUserFromDB(user._id);
};

const addUser = async function (username, image = "") {
  let user = await userDAL.getUserByNameFromDB(username);
  if (user) {
    throw "User already exists in the system.";
  }
  user = {
    username: username,
    image: image,
  };
  return await userDAL.addUserToDB(user);
};

const updateUsername = async function (preUsername, newUsername) {
  const user = await userDAL.getUserByNameFromDB(preUsername);
  if (!user) {
    throw "User does't exists in the system.";
  }
  return await userDAL.updateUsernameDB(user._id, newUsername);
};

const updateUserImage = async function (username, newImage) {
  const user = await userDAL.getUserByNameFromDB(username);
  if (!user) {
    throw "User does't exists in the system.";
  }
  return await userDAL.updateImageDB(user._id, newImage);
};

/**
 * first bring the trader info by his name from the database
 * then check if this trader have all the items he wants to trade (validation check),if not throw an error
 * next update the amount of trader items - if the amount now is zero remove the item from the array
 * @param {*} traderName
 * @param {*} itemsToTrade
 * @returns
 */
const tradeItems = async function (traderName, itemsToTrade) {
  const trader = await userDAL.getUserByNameFromDB(traderName);
  if (!trader) {
    throw "User does't exists in the system.";
  }
  itemsToTrade.forEach((item) => {
    const validItem = trader.items.find(
      (traderItem) =>
        traderItem.name === item.name && traderItem.amount >= item.amount
    );
    if (!validItem) {
      throw "One of the items that given is missing.";
    }
    validItem.amount = validItem.amount - item.amount;
    if (validItem.amount === 0) {
      const index = trader.items.indexOf(validItem);
      if (index > -1) {
        trader.items.splice(index, 1);
      }
    }
  });
  return await userDAL.updateUserItemsDB(trader._id, trader.items);
};

/**
 * first bring the user from database , next check if the items we want to add are already existing
 * if the item was found increase his amount , if not add him to the array
 * @param {*} username
 * @param {*} itemsToAdd
 * @returns
 */
const addItems = async function (username, itemsToAdd) {
  const user = await userDAL.getUserByNameFromDB(username);
  if (!user) {
    throw "User does't exists in the system.";
  }
  itemsToAdd.forEach((itemToAdd) => {
    const itemFromDB = user.items.find(
      (userItem) => userItem.name === itemToAdd.name
    );
    if (itemFromDB) {
      itemFromDB.amount = itemFromDB.amount + itemToAdd.amount;
    } else {
      user.items.push(itemToAdd);
    }
  });
  return await userDAL.updateUserItemsDB(user._id, user.items);
};

const addDeal = async function (
  sellerName,
  itemsBided,
  itemsTraded,
  traderName
) {
  const user = await userDAL.getUserByNameFromDB(sellerName);
  const deal = {
    itemsBided: itemsBided,
    itemsTraded: itemsTraded,
    traderName: traderName,
  };
  user.deals.push(deal);
  return await userDAL.addUserDealDB(user._id, user.deals);
};

/**
 * first check if user exists in the system and didn't generated his items yet if he does throwing an error
 * then randomly choose an item out from items table as long as continueGenerate is true
 * if the sum of the total value and the last chosen item value equals to twenty then add the chosen item to the array and exit loop
 * if the sum of the total value and the last chosen item value less then twenty then add the chosen item to the array and continue to loop
 * else (bigger then twenty) just continue the loop without adding the chosen item to the array
 * in every iteration check if the total value is bigger then 3 if it does then choose to continue in 50% odds
 * finally user's items are being updated in database
 * @param {*} username
 * @returns
 */
const generateItems = async function (username) {
  const user = await userDAL.getUserByNameFromDB(username);
  if (!user) {
    throw "User does't exists in the system.";
  }
  if (user.items.length !== 0) {
    throw "This user has already generated his items.";
  }
  const userItems = [];
  const allItems = await itemsDAL.getItemsFromJson();
  let continueGenerate = true;
  let totalValue = 0;
  while (continueGenerate) {
    const generatedItem = allItems[Math.floor(Math.random() * allItems.length)];
    const itemValue = generatedItem.value;
    if (totalValue + itemValue === 20) {
      addGeneratedItem(userItems, generatedItem);
      totalValue = totalValue + itemValue;
      break;
    } else if (totalValue + itemValue < 20) {
      addGeneratedItem(userItems, generatedItem);
      totalValue = totalValue + itemValue;
    }
    if (totalValue >= 3 && Math.random() > 0.5) {
      continueGenerate = false;
    }
  }
  return await userDAL.updateUserItemsDB(user._id, userItems);
};

/**
 * checks if the generated item already exists in user's items list , if does updating the amount of this item, if not adding it
 * @param {*} userItems
 * @param {*} generatedItem
 */
const addGeneratedItem = function (userItems, generatedItem) {
  const userItem = userItems.find((item) => item.name === generatedItem.name);
  if (userItem) {
    userItem.amount = userItem.amount + generatedItem.amount;
  } else {
    userItems.push(generatedItem);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByName,
  updateUsername,
  deleteUser,
  updateUserImage,
  generateItems,
  addUser,
  tradeItems,
  addItems,
  addDeal,
};
