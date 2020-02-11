const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const sinon = require('sinon');

const mySlq = require('../adapters/mySlq');

const data = {
  name: 'name',
  description: 'description',
  host: 'host',
  port: 'port',
  user: 'user',
  password: 'password',
  database: 'database',
  queryString: 'queryString',
  params: 'params',
}

const incomingParams = {
  host: 'host',
  port: 'port',
  user: 'user',
  database: 'dbName',
  queryString: 'hello $foo$, $age$',
  password: 'password',
  params: {
    age: 12
  }
}

describe('mySqlDataSource', () => {
  let sGetData;
  let mySqlSource;
  const testFilePath = './store/mySqlSources';

  beforeEach(() => {
    sGetData = sinon.stub(mySlq, 'query');
    mySqlSource = require('./mySqlSource');
  });
  
  afterEach(() => {
    sGetData.restore();
  });
  
  afterEach(() => {
    fs.existsSync(
      path.resolve(testFilePath)
    ) && fs.unlinkSync(path.resolve(testFilePath));
  });

  it('createStore', () => {
    expect(mySqlSource.createSource({})).to.be.an.instanceof(mySqlSource.MySqlSource);
  });
  
  xit('getData should call qyery fn', () => {
    const reqParams = () => ({foo: 'bar'});
    const source = new mySqlSource.MySqlSource(incomingParams);
    const res = mySqlSource.getData(source, reqParams);
    
    sinon.assert.calledWith(sGetData, {
      host: source.host,
      port: source.port,
      user: source.user,
      password: source.password,
      database: source.database,
    }, 'hello bar, 12');
  });

  it('should save mySqlSource', async () => {

    const result = await mySqlSource.save(new mySqlSource.MySqlSource(data));
    expect(result).to.include(data);
    expect(result).to.have.ownProperty("id");
    expect(result).to.be.an.instanceof(mySqlSource.MySqlSource);
  });

  it('should update mySqlSource', async () => {
    const result = await mySqlSource.save(new mySqlSource.MySqlSource(data));
    const { id } = result; 
    const newName = 'new Name';
    result.name = newName;

    const count = await mySqlSource.update(id, {name: newName})
    const updatedSource = await mySqlSource.findOne(id);

    expect(count).to.eql(1);
    expect(updatedSource).to.deep.equal({
      ...data,
      id,
      name: newName,
      type: "MYSQL"
    });1
  });

  xit('should call stored params function', () => {
    const sourceParams = {
      ...incomingParams,
      queryString: 'why $foo$ $bar$',
      params: `return {
        foo: 'mister',
        bar: 'Anderson'
      }`
    }
    const source = new mySqlSource.MySqlSource(sourceParams);
    const res = mySqlSource.getData(source, {});
    
    sinon.assert.calledOnce(sGetData, {
      host: source.host,
      port: source.port,
      user: source.user,
      password: source.password,
      database: source.database,
    }, 'why mister Anderson');
  });
});
