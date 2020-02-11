const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const neDb = require('./neDB');

const testFilePath = './store/test'; 

afterEach(() => {
  fs.existsSync(
    path.resolve(testFilePath)
  ) && fs.unlinkSync(path.resolve(testFilePath));
});

describe('neDb', () => {
  it('should insert item', async () => {
    const doc =  {
      name: 'Танкрэд',
      profession: 'Превозмогать'
    }
    const result = await neDb('test').insert(doc)
    expect(result.name).to.equal(doc.name);
    expect(result.profession).to.equal(doc.profession);
  });
});