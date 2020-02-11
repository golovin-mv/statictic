const { composeAsync } = require('../utils');
const { cryptPassword, unCryptPassrow } = require('../crypt');
const collections = require('../collection');

const COLLECTION_NAME = 'users';

class User {
  /**
   *
   * @param {Object} param
   * @param {string} param.id
   * @param {string} param.login
   * @param {string} param.password
   *
   */
  constructor({ id, login, password }) {
    this.id = id;
    this.login = login;
    this.password = password;
  }
}

/**
 * Получам безопасные данные пользователя
 * @param {User} user
 * @returns {Object}
 */
const getSafeUserData = (user) => {
  const { password, ...other } = user;

  return other;
};

/**
 * Шифруем пароль, возвращаем пользователя
 * @function
 * @param {User} user
 * @returns {User}
 */
const cryptUserPassword = user => ({
  ...user,
  password: cryptPassword(user.password),
});

/**
 * Расшифровываем пароль, возвращаем пользователя
 * @function
 * @param {User} user
 * @returns {User}
 */
const unCryptUserPassword = user => ({
  ...user,
  password: unCryptPassrow(user.password),
});

/**
 * Сохраняем пользователя
 * @function
 * @param {User} user
 * @returns {Promise}
 */
const saveUser = (user) => {
  collections.withCollection(COLLECTION_NAME).save(user);
  return user;
};

/**
 * Создаем пользователя
 * @function
 * @returns {Promise}
 */
const createUser = composeAsync(
  cryptUserPassword,
  saveUser,
  getSafeUserData,
);

/**
 * Получаем пользователя по id
 * @function
 * @returns {Promise.<User>}
 */
const getUser = composeAsync(
  id => collections.withCollection(COLLECTION_NAME).withType(User).findOne(id),
  getSafeUserData,
);

/**
 * Проверяем логин и пароль пользователя
 * @param {string} login
 * @param {string} password
 */
const checkUser = (login, password) => composeAsync(
  userLogin => collections.withCollection(COLLECTION_NAME).find({ login: userLogin }),
  unCryptUserPassword,
  user => password === user.password,
)(login);

module.exports = {
  User,
  COLLECTION_NAME,
  createUser,
  getUser,
  checkUser,
};
