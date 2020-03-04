const neDb = require('../adapters/neDB');
const { ifElse } = require('../utils');
const { createAndRun } = require('../script');

const {
  callOrRetun, curry, composeAsync,
} = require('../utils');
const mySql = require('../adapters/mySlq');

const COLLECTION_NAME = 'mySqlSources';

/**
 * Источник даза данных MySql
 */
class MySqlSource {
  /**
   *
   * @param {Object} param
   * @param {string} param._id
   * @param {string} param.description
   * @param {string} param.name
   * @param {string} param.host
   * @param {number} param.port
   * @param {string} param.user
   * @param {string} param.password
   * @param {string} param.database
   * @param {string} param.queryString
   * @param {Object|string} param.param - параметра которые можно прокинуть в запрос
   */
  constructor({
    _id, description, name, host = 'localhost', port = 3306, user, password, database, queryString, params,
  }) {
    this.id = _id;
    this.description = description;
    this.name = name;
    this.host = host;
    this.port = port;
    this.user = user;
    this.password = password;
    this.database = database;
    this.queryString = queryString;
    this.params = params;
    this.type = 'MYSQL';
  }
}

/**
 * Получаем параметры из параметров источника
 * @function
 * @param {MySqlSource} source
 * @returns {Object}
 */
const getConnectionParams = source => ({
  host: source.host,
  port: source.port,
  user: source.user,
  password: source.password,
  database: source.database,
});

/**
 * Получаем сохраненные параметры
 * @function
 * @returns {function}
 */
const getStoredParams = ifElse(
  s => (typeof s) === 'string', // если это строка то считаем что это сохраненное тело функции
  createAndRun,
  callOrRetun,
);

/**
 * Собираем массив параметров из переданных и сохраненых параметров
 * @function
 * @param {Object | MySqlSource}
 * @param {Object | Function} inParams
 * @returns {function}
 */
const createParams = ({ params }, inParams) => composeAsync(
  () => getStoredParams(params),
  p => Object.assign({}, p, callOrRetun(inParams)),
)();

/**
 * Наполняем строку параметрами, параметры должны в строке выглядеть как $имя параметра$
 * @example createQuery({queryString: 'SELECT $columnName$ FROM $tableName$'}, {foo: 'bar'})
 * @function
 * @param {Object | MySqlSource}
 * @param {Object} params
 * @returns {string}
 */
const createQuery = ({ queryString }, params) => Object.keys(params)
  .reduce((prev, curr) => prev.replace(`$${curr}$`, params[curr]), queryString);

/**
 * Собираем из параметров строку запроса
 * @function
 * @param {MySqlSource} source
 * @returns {function}
 */
const createQueryWithParams = source => composeAsync(
  curry(createParams)(source),
  curry(createQuery)(source),
);

/**
 * Делаем запрос к БД c параметрами сохраненными в источнике
 * @function
 * @param {MySqlSource} source
 * @returns {Promise}
 */
const queryWithConnectionParams = (source, query) => mySql.query(getConnectionParams(source), query);

/**
 * Получаем данные из источика
 * @function
 * @param {MySqlSource} source
 * @param {Object | Function} params
 * @returns {function}
 */
const getData = (source, params) => composeAsync(
  createQueryWithParams(source),
  curry(queryWithConnectionParams)(source),
)(params);

module.exports = {
  MySqlSource,
  getData: curry(getData),
  COLLECTION_NAME,
};
