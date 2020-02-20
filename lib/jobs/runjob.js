
const logger = require('../logger');
const { workerData, removeResult, parentPort } = require('worker_threads');
const { SocketEvent } = require('../socketPull');
const { JobResult, addResult, addJobResult } = require('./jobResults');

// TODO: fuctional
const {
  doJobWithSources, doJob, getJob,
} = require('./job');

const run = async ({ sources = [], id, userId }) => {
  let jobResult = new JobResult({
    userId,
  });

  const fn = (sources && sources.length) ?
    doJobWithSources(sources) :
    doJob;

  const job = await getJob(id);

  jobResult.jobId = job.id;
  jobResult.jobName = job.name;

  jobResult = await addResult(jobResult);

  try {
    const result = await fn(job);

    return await addJobResult(
      jobResult._id,
      result,
    );

  } catch (err) {
    removeResult(jobResult._id);
  }
};

run(workerData)
  .then(data => (
    new SocketEvent(
      'workResult',
      data,
      1, // TODO hardcode
    )
  ))
  .then(data => parentPort.postMessage(data))
 .catch(err => logger.error(err));