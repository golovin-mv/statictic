const COLLECTION_NAME = 'params';

class Param {
  /**
   * Параметр задания
   * @param {Constructor} param.type
   * @param {string} param.name
   * @param {any} param.value
   */
  constructor({ type, name, value }) {
    this.type = type;
    this.name = name;
    this.value = value;
  }
}
/**
 * Получаем параметры со значением
 * @param {[]Param} arr
 */
const getParams = arr => arr.reduce((acc, el) => {
  acc[el.name] = el.value;
  return acc;
}, {});

module.exports = {
  Param,
  getParams,
  COLLECTION_NAME,
};
