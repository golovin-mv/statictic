const { expect } = require('chai');
const { CustomAction, doAction } = require('./customAction');

describe('Custom action', () => {
  it('should handle action', (done) => {
    const context = {
      foo: 'bar'
    }

    const action = new CustomAction({
      fnString: 'return foo'
    });

    doAction(action.func)(context)
      .then(data => {
        expect(data).to.equal(context.foo);
        done();
      })
      .catch(err => done(err))
  });
});