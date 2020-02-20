const { composeAsync, mapToObject } = require('../utils');
const collections = require('../collection');

const COLLECTION_NAME = 'jobs';

const mapJobInfo = mapToObject({
  id: v => v._id,
  name: undefined,
  description: undefined,
  tags: undefined,
  schedule: undefined,
});

const getInfo = (jobs = []) => jobs
  .map(mapJobInfo);

const getJobs = () => collections
  .withCollection(COLLECTION_NAME)
  .findAll();

module.exports = {
  getAll: composeAsync(
    getJobs,
    getInfo,
  ),
};
