const { relay, ifElse, curry } = require('../utils');
const customAction = require('./customAction');
const emailAction = require('./emailAction');
const { createAndRun } = require('../script');

/**
 * Действие совершаимое с каким то условием
 *
 * @class ActionWithCondition
 */
class ActionWithCondition {
  /**
   * @param {Object} params
   * @param {string} params.condition - строка, содержащая тело функции условия
   * @param {Object} params.action - исполняемый экшн
   * @memberof ActionWithCondition
   */
  constructor({ condition, action }) {
    this.condition = condition;
    this.action = action;
  }
}

/**
 * Получаем функцию экшена в зависимости от его типа
 * @function
 * @param {Object} action
 * @param {string} action.type
 * @name getAction
 * @returns {(doCustiomAction | doEmailAction)}
 */
const getAction = relay([
  // TODO: types emun
  [s => s.type === 'CUSTOM', customAction.doAction],
  [s => s.type === 'EMAIL', emailAction.doAction],
]);

/**
 * Выполнение экшена с условиями
 * @function
 * @param {Object} action
 * @param {string} condition
 * @returns {function}
 */
const actionWithCondition = (action, condition) => context => ifElse(
  curry(createAndRun)(condition),
  getAction(action),
  () => context,
)(context);

module.exports = {
  actionWithCondition,
  ActionWithCondition,
};
