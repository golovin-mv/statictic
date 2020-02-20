const neDb = require('./adapters/neDB');
const collection = require('./collection');
const { expect } = require('chai');

describe('collection', () => {

  const COLLECTION_NAME = 'test';

  const testCollection = collection.withCollection(COLLECTION_NAME);

  it('update', async () => {
    const testObj = {
      foo: 'bar',
      fizz: 'buzz',
    };

    const newFizz = 'newFizz';

    const t =  await testCollection.save(testObj);

    const updated = await testCollection.update(t._id, {
      fizz: newFizz,
    }); 

    expect(updated).to.deep.equal({
      ...t,
      fizz: newFizz
    });
  });
});
