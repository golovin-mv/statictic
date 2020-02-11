const { expect } = require('chai'); 
const sinon = require('sinon');
const jobs = require('./job');

describe('schedules', () => {
  let sFindAll, schedules;  
  before(() => {
    sFindAll = sinon.stub(jobs, 'findAll');
    schedules = require('./schedules');
  });

  after(() => {
    sFindAll.restore();
  });

  it('should sort jobs', (done) => {
    const job1 = new jobs.Job({
      schedule: '* * * * * *'
    });
    const job2 = new jobs.Job({
      schedule: '* * * * * *'
    });

    const job3 = new jobs.Job({
      schedule: '*/5 * * * * *'
    });

    sFindAll.resolves([job1, job2, job3]);

    const expected = {
      '* * * * * *': [
        job1, job2
      ],
      '*/5 * * * * *': [
        job3
      ]
    }


    schedules.collectJobs()
      .then(data => {
        expect(data).to.deep.equal(expected);
        done();
      })
      .catch(err => done(err));
  });
});
