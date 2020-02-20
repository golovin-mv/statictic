const neDb = require('./adapters/neDB');
const { composeAsync } = require('./utils');
/**
 * Отчищаем коллекцию
 * @function
 * @param {string} COLLECTION_NAME
 * @returns {Promise}
 */
const truncate = COLLECTION_NAME => () => neDb(COLLECTION_NAME).remove({}, { multi: true });

/**
 * Получаем все элементы
 * @function
 * @param {string} COLLECTION_NAME
 * @returns {Promise}
 */
const findAll = COLLECTION_NAME => () => neDb(COLLECTION_NAME).find({});

/**
 * Ищем элемент по id
 * @function
 * @param {string} COLLECTION_NAME
 * @returns {Promise}
 */
const findOne = COLLECTION_NAME => id => composeAsync(
  id => neDb(COLLECTION_NAME).find({ _id: id }),
  res => [].concat(res)[0],
)(id);

/**
 * Ищем элемент по полям
 * @param {string} COLLECTION_NAME
 */
const find = COLLECTION_NAME => params => neDb(COLLECTION_NAME).find(params);

const remove = COLLECTION_NAME => id => neDb(COLLECTION_NAME).remove({ _id: id }, {});

const update = COLLECTION_NAME => (id, data) => composeAsync(
  () => neDb(COLLECTION_NAME).update(
    { _id: id },
    { $set: data },
  ),
  () => findOne(COLLECTION_NAME)(id),
)(id, data);

/**
 * Сохраняем элемент в коллекцию
 * @function
 * @param {string} COLLECTION_NAME
 * @returns {Promise}
 */
const save = COLLECTION_NAME => source => neDb(COLLECTION_NAME).insert(source);

/**
 * Получаем обьект для работы с коллециями
 * @function
 * @param {string} collectionName
 * @requires {Object}
 */
const withCollection = collectionName => ({
  ...[truncate, findAll, findOne, save, find, update, remove].reduce((p, c) => ({
    ...p,
    [c.name]: c(collectionName),
  }), {}),
});

/**
 * Получаем обьект для работы с типизированными коллециями
 * @function
 * @param {string} collectionName
 * @requires {Object}
 */
const withType = Type => fnArray => ({
  ...fnArray,
  save: composeAsync(
    fnArray.save,
    res => res && new Type(res),
  ),
  findAll: composeAsync(
    fnArray.findAll,
    res => [].concat(res).map(el => new Type(el)),
  ),
  findOne: composeAsync(
    fnArray.findOne,
    res => res && new Type(res),
  ),
  find: composeAsync(
    fnArray.find,
    res => res && new Type(res),
  ),
  update: (id, data) => composeAsync(
    () => fnArray.update(id, data),
    res => res && new Type(res),
  )(),
});

const collection = {
  withCollection: collectionName => ({
    ...withCollection(collectionName),
    withType: type => withType(type)(withCollection(collectionName)),
  }),
};

module.exports = collection;
