const jfile = require("jsonfile");

let ItemsPath = "./configs/itemsTable.json";

const getItemsFromJson = function () {
  return new Promise((resolve, reject) => {
    jfile.readFile(ItemsPath, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = { getItemsFromJson };
