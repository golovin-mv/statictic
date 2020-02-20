const collections = require('../collection');
const { composeAsync } = require('../utils');

const COLLECTION_NAME = 'jobResults';

class JobResult {
  constructor({
    _id, userId, jobName, jobId, data,
  }) {
    this._id = _id;
    this.userId = userId;
    this.jobName = jobName;
    this.jobId = jobId;
    this.data = data;
  }
}

const jobResultCollection = collections.withCollection(COLLECTION_NAME)
  .withType(JobResult);

const addResult = jobResult => jobResultCollection.save(jobResult);

const removeResult = key => jobResultCollection.remove(key);

const getResult = key => jobResultCollection.findOne(key);

const addJobResult = (id, result) =>
  composeAsync(
    getResult,
    r => ({ ...r }), // TODO не нужно
    r => ({
      ...r,
      data: result,
    }),
    ({ _id, ...other }) => jobResultCollection.update(_id, other),
  )(id);

const getAndDrop = composeAsync(
  getResult,
  r => composeAsync(
    removeResult(r._id),
    () => r,
  )(),
);

const getUsersResults = userId => jobResultCollection.findAll({ userId });

const truncate = () => jobResultCollection.truncate();

module.exports = {
  JobResult,
  addResult,
  // TODO disgusting naming
  addJobResult,
  removeResult,
  getResult,
  getAndDrop,
  getUsersResults,
  truncate,
};
