const { composeAsync } = require('../utils');
const collections = require('../collection');

const COLLECTION_NAME = 'jobs';

const getInfo = (jobs = []) => jobs
  .map(el => ({
    id: el._id,
    name: el.name,
    description: el.description,
    tags: el.tags,
    schedule: el.schedule,
  }));

const getJobs = () => collections
  .withCollection(COLLECTION_NAME)
  .findAll();

module.exports = {
  getAll: composeAsync(
    getJobs,
    getInfo,
  ),
};
