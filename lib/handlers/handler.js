const vm = require('vm');
const neDb = require('../adapters/neDB');
const { composeAsync, curry } = require('../utils');

/**
 * Обработчик
 */
class Handler {
  /**
   *
   * @param {Object} param
   * @param {string} param.id
   * @param {string} param.name
   * @param {string} param.description
   * @param {!string} param.func
   */
  constructor({
    id, name, description, func,
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.func = func;
  }
}

const COLLECTION_NAME = 'handlers';

/**
 * Оборачиваем тело функции
 * @function
 * @param {string} fnString
 * @returns {string}
 */
const getFn = fnString => `
    async function run() {${fnString}}; 
    var result = run()
`;

/**
 * Выполняем функцию в контенсте
 * @function
 * @param {Object} handler
 * @param {string} handler.func - тело функции для выпроло
 * @param {Object} context
 * @returns {*}
 * TODO: заюзать scripts
 */
const handle = ({ func }, context = {}) => {
  const script = new vm.Script(getFn(func));
  script.runInNewContext(context);
  const { result } = context;
  return result;
};

/**
 * Соединяем контекст с данными пришевшими с предыдущег хэндлера
 * @function
 * @param {Object} context
 * @param {Object} handler
 * @returns {function}
 */
const handlerWithContext = (context, handler) => data => handle(
  handler,
  Object.assign({}, context, { data }),
);

/**
 * Собираем все хэндлеры в одну функцию
 * @function
 * @param {[]Objects} handlers
 * @param {*} context
 * @returns {function}
 */
const collectHandlers = (handlers, context) => composeAsync(...handlers.map(curry(handlerWithContext)(context)))();

module.exports = {
  Handler,
  handle,
  collectHandlers,
  COLLECTION_NAME,
};
