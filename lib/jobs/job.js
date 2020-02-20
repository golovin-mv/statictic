const { concatSources } = require('../sources/sources');
const { concatStorages } = require('../storages/storages');
const { collectHandlers } = require('../handlers/handler');
const { composeAsync, curry, compose } = require('../utils');
const { InMemorySource } = require('../sources/inMemorySource');
const { actionWithCondition } = require('../actions/actions');
const collections = require('../collection');

const COLLECTION_NAME = 'jobs';

/**
 * Задание
 */
class Job {
  /**
   * @param {Object} param
   * @param {string} param.id
   * @param {string} param.name
   * @param {string} param.description
   * @param {string} param.schedule - описание периодичности повторения экшена в CRON формате
   * @param {[]Object} param.sources = массив источников
   * @param {[]Object} param.storages - массив хранилищ
   * @param {[]Object} param.handlers - массив обработчиков
   * @param {[]Object} param.actions - массив действий
   * @param {[]string} param.tags
   */
  constructor({
    _id, name, description, schedule, sources = [], storages = [], handlers = [], actions = [], tags = [],
  }) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.schedule = schedule; // TODO: это должно быть в отдельной сущности
    this.sources = sources;
    this.storages = storages;
    this.handlers = handlers;
    this.actions = actions;
    this.tags = tags;
  }
}

/**
 * Создаем контекст для хэндлеров
 * @function
 * @param {Object}
 * @returns {function}
 */
const createContext = ({ sources, storages }) => composeAsync(
  () => concatSources(sources),
  context => Object.assign({}, context, concatStorages(storages)),
)();

/**
 * Собираем хэндлеры
 * @function
 * @param {Array} handlers
 * @returns {function}
 */
const handle = job => () => composeAsync(
  createContext,
  curry(collectHandlers)(job.handlers),
)(job);


/**
 * Получаем функцию хэндлер для всех экшенов
 * @function
 * @param {[]ActionWithCondition} actions
 * @returns {function}
 */
const actionsHandle = ({ actions }) =>
  composeAsync(...actions.map(el => actionWithCondition(el.action, el.condition)));

/**
 * Запускаем задачу
 * @function
 * @param {Job} job
 * @returns {function}
 */
const doJob = job => composeAsync(
  handle(job),
  actionsHandle(job),
)(job);

/**
 * Заменяем текущие источники на сохнаненные
 * @function
 * @param {[]InMemorySource} newSources
 * @param {Job} job
 */
const addInMemorySourcesToJob = (newSources, job) => newSources.reduce((p, c) => {
  const t = p.filter(el => el.name !== c.name);
  t.push(new InMemorySource({ name: c.name, items: c.value }));

  return t;
}, Object.assign({}, job.sources));

/**
 * Запускаем задачу с заменой источников
 * @function
 * @param {[]Obje} sources
 * @returns {function}
 */
const doJobWithSources = sources => job => compose(
  curry(addInMemorySourcesToJob)(sources),
  s => doJob({
    ...job,
    sources: s,
  }),
)(job);

const getJob = id => collections.withCollection(COLLECTION_NAME).findOne(id);

const getJobInfo = composeAsync(
  v => v,
  getJob,
);

module.exports = {
  Job,
  doJob,
  doJobWithSources,
  COLLECTION_NAME,
  getJob,
  getJobInfo,
};
