const { relay } = require('../utils');
const inMemorySource = require('./inMemorySource');
const mySqlSource = require('./mySqlSource');

/**
 * Получаем функцию получения данных в зависимости от типа
 * @function
 * @returns {function}
 */
const getData = relay([
  [s => s.type === 'INMEMORY', inMemorySource.getData],
  [s => s.type === 'MYSQL', mySqlSource.getData],
]);

/**
 * Получаем обьек с источниками для контекста
 * @function
 * @param {[]Object} source
 * @returns {Promise}
 */
const getNamedSource = async (source) => {
  const data = await getData(source);
  return {
    [source.name]: data,
  };
};

/**
 * Обьединяем все источники
 * @function
 * @param {[]Object} arr
 * @returns {Promise}
 */
const concatSources = arr => Promise.all(arr.map(getNamedSource))
  .then(res => Object.assign({}, ...res));

module.exports = {
  concatSources,
};
