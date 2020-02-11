const neDb = require('../adapters/neDB');

const COLLECTION_NAME = 'storages';

/**
 * Стандартное хранилище в файле
 */
class Storage {
  /**
   * 
   * @param {Object} param
   * @param {string} param.id
   * @param {string} param.name
   * @param {string} param.description
   * @param {string} param.collectionName
   */
  constructor({
    id, name, description, collectionName,
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.collectionName = collectionName;
    this.type = 'NE';
  }
}

/**
 * Получаем обьект коллекции
 * @function
 * @param {Storage} storage
 */
const getCollection = storage => neDb(storage.collectionName);

const concatStorages = (arr = []) => arr.reduce((prev, curr) => ({
  ...prev,
  [curr.name]: getCollection(curr),
}), {});

module.exports = {
  Storage,
  getCollection,
  concatStorages,
  COLLECTION_NAME,
};
