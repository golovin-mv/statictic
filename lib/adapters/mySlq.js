const mysql = require('mysql');
const { composeAsync, curry } = require('../utils');
const logger = require('../logger');

/**
 * Создаем подключение к бд
 * @function
 * @param {Object} param
 * @param {string} param.host
 * @param {number} param.port
 * @param {string} param.user
 * @param {string} param.password
 * @param {string} param.database
 * @returns {mysql.Connection}
 */
const createConnection = ({
  host, port, user, password, database,
}) => mysql.createConnection({
  host,
  port,
  user,
  password,
  database,
});

/**
 * Делаем запрос
 * @function
 * @param {string} query - тело запроса
 * @param {mysql.Connection} connection
 * @returns {Promise}
 */
const makeRequest = (query, connection) => new Promise((res, rej) => connection.query(query, (err, data) => {
  if (err) {
    logger.error(err);
    // TODO: переделать не красиво
    connection.end();
    return rej(err);
  }

  return res(data);
}));

/**
 * @function
 * @param {mysql.Connection} connection
 * @returns {mysql.Connection}
 */
const connect = (connection) => {
  connection.connect();
  return connection;
};

/**
 * Закрываем соединение
 * @param {mysql.Connection} connection
 * @returns {*}
 */
const end = connection => (res) => {
  connection.end();
  return res;
};

/**
 * Коннектимся в базе, делаем запрос
 * @function
 * @param {string} query
 * @returns {function}
 */
const connectAndMakeRequest = query => connection => composeAsync(
  connect,
  curry(makeRequest)(query),
  end(connection),
)(connection);

/**
 * Запрос к базе
 * @function
 * @param {Object} connectionParams
 * @param {string} connectionParams.host
 * @param {number} connectionParams.port
 * @param {string} connectionParams.user
 * @param {string} connectionParams.password
 * @param {string} connectionParams.database
 * @param {string} queryString - тело запроса
 * @returns {Promise}
 */
const query = (connectionParams, queryString) => composeAsync(
  () => createConnection(connectionParams),
  connectAndMakeRequest(queryString),
)(connectionParams, queryString);

module.exports = {
  query,
};
