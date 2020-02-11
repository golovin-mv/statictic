const { relay } = require('../utils');
const neDbStorage = require('./storage');
const influxStorage = require('./influxStorage');

/**
 * Получаем фунцию получения коллекции исходяиз типа
 * @function
 * @returns {function}
 */
const getCollection = relay([
  [s => s.type === 'NE', neDbStorage.getCollection],
  [s => s.type === 'INFLUX', influxStorage.getCollection],
]);

/**
 * Обьединяем хранилица
 * @function
 * @param {[]Object} arr
 * @returns {{string: Object}}
 */
const concatStorages = (arr = []) => arr.reduce((prev, curr) => ({
  ...prev,
  [curr.name]: getCollection(curr),
}), {});


module.exports = {
  concatStorages,
};
