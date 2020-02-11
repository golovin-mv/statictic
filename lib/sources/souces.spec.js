const expect = require('chai').expect;
const sinon = require('sinon');

const mySqlSource = require('./mySqlSource');
const inMemorySource = require('./inMemorySource');

let sources;

xdescribe('sources', () => {
  const mSourseData = [{
    some: 'mSourseData item'
  }];

  const mSourseData1 = [{
    some: 'mSourseData1 item'
  }];

  const items = [
    {some: 'in'},
    {memory: 'data'}
  ];

  before(() => {
    mGetData = sinon.stub(mySqlSource, 'getData');
    sources = require('./sources');
  });

  after(() => {
    mGetData.restore();
  });

  it('should concat sources', (done) => {
    const mSourse = new mySqlSource.MySqlSource({
      name: 'mSourse'
    });

    const mSourse1 = new mySqlSource.MySqlSource({
      name: 'mSourse1'
    });

    const iSource = new inMemorySource.InMemorySource({
      name: 'iSource',
      items
    });
  
    const expected = {
      mSourse: mSourseData,
      mSourse1: mSourseData1,
      iSource: items
    }

    mGetData
      .onFirstCall().resolves(mSourseData)
      .onSecondCall().resolves(mSourseData1);

    sources.concatSources([mSourse, mSourse1, iSource])
      .then(data => {
        expect(data).to.deep.equal(expected)
        done();
      })
      .catch(err => done(err));

  });
});