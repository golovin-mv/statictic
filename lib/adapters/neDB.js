const Datastore = require('nedb');
const { isFunction } = require('../utils');
const { compose } = require('../utils');
/**
 * Перехванываем вызов возвращаем промис
 * @param {Object} obj
 * @param {Object} prop
 * @param {Object} val
 * @returns {Promise}
 */
const handle = (obj, prop, val) => new Promise((resolve, reject) => obj[prop](...val, (err, res) => {
  if (err) {
    return reject(err);
  }
  return resolve(res);
}));


/**
 * Хэндлер
 * @function
 * @description - проблема в том что библиотека nedb все свое апи
 * предоставляем с вызовами через калбэки, нас это не устраивает помому
 * что это апи используется в стораджах и чтобы можно было описывать через
 * await мы переделываем в Promise
 */
const handler = {
  get: (obj, prop) => {
    if (!isFunction(obj[prop])) {
      throw new TypeError(`${prop} is not a function`);
    }

    return async (...val) => {
      const res = await handle(obj, prop, Array.isArray(val) ? val : [val]);
      return res;
    };
  },
};

/**
 * Получаем Datastore
 * @function
 * @param {string} filename
 * @returns {Proxy<nedb.Datastore>}
 */
const getDb = compose(
  filename => new Datastore({ filename: `./store/${filename}` }),
  (db) => {
    db.loadDatabase();
    return db;
  },
  db => new Proxy(
    db,
    handler,
  ),
);


module.exports = getDb;
