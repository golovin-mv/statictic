const vm = require('vm');
const { curry, compose } = require('./utils');

/**
 * Оборачиваем тело в функцию
 * @function
 * @param {string} fnString - тело функции для запуска
 */
const getFn = fnString => `
    async function run() {${fnString}}; 
    var result = run()
`;

/**
 * Запускаем скрипт в контексте
 * @function
 * @param {Object} context
 * @param {string} scriptString
 */
const run = (context, scriptString) => {
  // TODO: не красиво переделать
  const script = new vm.Script(scriptString);
  script.runInNewContext(context);
  const { result } = context;
  return result;
};

/**
 * Создаем скрипт запускаем в контексте
 * @function
 * @param {Storage} scriptString - тело функции для запуска
 * @param {Object} context
 */
const createAndRun = (scriptString, context = {}) => compose(
  getFn,
  curry(run)(context),
)(scriptString);

module.exports = {
  createAndRun,
};
