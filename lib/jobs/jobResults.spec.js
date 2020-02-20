const { JobResult, addJobResult, addResult, getAndDrop, truncate, getUsersResults } = require('./jobResults');

const { expect } = require('chai');


describe('jobResutls', () => {

  const userId = 1;

  let jobResult = new JobResult({
    userId,
    jobName: 'test name'
  });

  afterEach(async () => {
    await truncate();
  });

  it('add job result', async () => {
    const data = {
      foo: 'foo',
      bar: true
    }
    const savedJobResult = await addResult(jobResult);

    savedJobResult.data = data;

    const res = await addJobResult(savedJobResult._id, data);

    expect(res).to.deep.equal(savedJobResult);
  });

  it('get and drop', async () => {
    const savedJob = await addResult(jobResult);
    const res  = await getAndDrop(savedJob._id);
    
    expect(res).to.deep.equal(savedJob);
  });

  it('find users resutls', async () => {
    const savedJob = await addResult(jobResult);

    const results = await getUsersResults(userId); 

    expect(results[0]).to.deep.equal(savedJob);
  });
});