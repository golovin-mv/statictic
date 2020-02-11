const jobs = require('./job');
const { composeAsync } = require('../utils');
const collections = require('../../lib/collection');

/**
 * Разбиваем все задачи по параметрам периодичности
 * @function
 * @param {[]Job} data
 * @returns {Object}
 */
const sortJobs = data => data.reduce((prev, curr) => {
  prev[curr.schedule] ?
    prev[curr.schedule].push(curr) :
    prev[curr.schedule] = [curr];

  return prev;
}, {});

/**
 * Собираем все периодичные задачи
 * @function
 * @returns {function}
 */
const collectJobs = composeAsync(
  () => collections.withCollection(jobs.COLLECTION_NAME).findAll(),
  j => [].concat(j).filter(el => el && !!el.schedule),
  sortJobs,
);

module.exports = {
  collectJobs,
};
