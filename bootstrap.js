const requireAll = require('require-all');
const { values, composeAsync } = require('./lib/utils');
const jobs = require('./lib/jobs/job');
const collection = require('./lib/collection');

module.exports = composeAsync(
  () => collection.withCollection(jobs.COLLECTION_NAME).truncate(),
  ...values(requireAll(`${__dirname}/bootstrap`)),
);
