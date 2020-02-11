const { createAndRun } = require('../script');

/**
 * Action с сохраненной функцией
 */
class CustomAction {
  /**
   *
   * @param {Object} params
   * @param {string} params.fnString - строка с телом функции
   */
  constructor({ fnString }) {
    this.func = fnString;
    this.type = 'CUSTOM';
  }
}

/**
 * Выполняем Action
 * @function
 * @name doCustiomAction
 * @param {CustomAction} customAction
 * @returns {function}
 */
const doAction = customAction => context => new Promise((res, rej) => {
  try {
    return res(createAndRun(customAction, context));
  } catch (ex) {
    return rej(ex);
  }
});

module.exports = {
  CustomAction,
  doAction,
};
