
/**
 * Хранимый в памяти источник данных
 */
class InMemorySource {
  /**
   * @param {Object} param
   * @param {string} param.name
   * @param {[]Object} param.items
   */
  constructor({ name, items }) {
    this.name = name;
    this.items = items;
    this.type = 'INMEMORY';
  }
}

/**
 * Создаем источник
 * @function
 * @param {{}Object} arr
 * @returns {InMemorySource}
 */
const createSource = arr => new InMemorySource(arr);
/**
 * Получаем данные из источника
 * @function
 * @param {InMemorySource} source
 * @returns {Promise}
 */
const getData = source => Promise.resolve(source.items);

module.exports = {
  InMemorySource,
  createSource,
  getData,
};
