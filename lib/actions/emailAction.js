const nodemailer = require('nodemailer');
const { createAndRun } = require('../script');
const { composeAsync, curry } = require('../utils');

/**
 * Action отправки email
 */
class EmailAction {
  /**
   *
   * @param {Object} params
   * @param {[]string} params.to - получатели
   * @param {string} params.subject - тема письма
   * @param {string} params.template - строка тело функции для получения шаблона
   */
  constructor({ to, subject, template }) {
    this.addressees = to;
    this.subject = subject;
    this.tempalte = template;
    this.type = 'EMAIL';
  }
}

/**
 * Получаем сервер для отправки письма
 * @function
 * @returns {function}
 */
const getServer = () => nodemailer.createTransport({
  // TODO: хост и порт перенести в параметры
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

/**
 * Получаем шаблон
 * @function
 */
const getText = createAndRun;

/**
 * Создаем письмо с параметрами отправителя и получателя
 * @function
 * @param {EmailAction} emailAction
 * @returns {funciton}
 */
const withParams = emailAction => ({
  from: process.env.MAIL_FROM,
  to: emailAction.addressees.join(', '),
  subject: emailAction.subject,
});

/**
 * Добавляем к письму шаблон
 * @function
 * @param {Object} param
 * @param {string} param.template
 * @param {Object} context - контекст исполнения скрипта получения шаблона
 * @param {Object} params - параметры которые нам вернули хэндлеры
 * @returns {function}
 */
const withTemplate = ({ template }, context, params) => composeAsync(
  getText(template, context),
  text => ({
    ...params,
    text: text.toString(),
  }),
)({ template }, context, params);

/**
 * Отправляем письмо
 * @function
 * @param {Object} params
 * @returns {Promise}
 */
const sendMail = params => new Promise((res, rej) => getServer().sendMail(
  params,
  (err, val) => {
    if (err) {
      return rej(err);
    }
    return res(val);
  },
));

/**
 * @function
 * @name doEmailAction
 * @param {EmailAction} emailAction
 */
const doAction = emailAction => context => composeAsync(
  withParams,
  curry(withTemplate)(emailAction)(context),
  sendMail,
)(emailAction);

module.exports = {
  EmailAction,
  doAction,
};
