const expect = require('chai').expect;
const handler = require('./handler');

describe('handlers', () => {
  it('should handle async', () => {
    const res = 'foo'; 
    const data = {
      func: `const t = () => new Promise((res, rej) => {
        return setTimeout(() => {
          return res('${res}')
        })
      })
      
      const res = await t();
      
      return res;`
    };

    handler.handle(
      handler.createHandler(data),
      {setTimeout}
    ).then(data => expect(data).to.equal(res));

  });

  it('should handle sync', () => {
    const res = 'some result';
    const data = {
      func: `return "${res}"`
    }


    handler.handle(
      handler.createHandler(data),
    ).then(data => expect(data).to.equal(res));

  });

  it('should handle error', () => {
    const data = {
      func: `All my life is big errror`
    }
    try {
      handler.handle(
        handler.createHandler(data),
      )
    } catch(ex) {
      expect(ex).to.be.an.instanceof(Error);
    }
  });

  it('should add context', () => {
    const context = {
      foo: 'bar'
    };

    const data = {
      func: `return foo`      
    }

    handler.handle(
      handler.createHandler(data),
      context
    ).then(data => {
      expect(data).to.equal(context.foo)
    })
  });

  xit('should collect handlers', (done) => {
    const foo = [1, 2, 3];
    const bar = 'some source data';

    const context = {
      foo, 
      bar
    };

    const handler1 = new handler.Handler({
      func: `foo = '!!!!!';
      bar = '!!!!!';
      
      const result = ['who', 'is', 'good', 'boy', '?'];
      
      return result;`
    });

    const handler2 = new handler.Handler({
      func: `
      const res = {
        data: [data, ['yes', 'yor', 'are']],
        foo,
        bar
      };
      return res;
      `
    });

    const handle = handler.collectHandlers([handler1, handler2], context);

    const expected = {
      foo,
      bar,
      data: [
        ['who', 'is', 'good', 'boy', '?'],
        ['yes', 'yor', 'are']
      ]
    }

    handle()
      .then(data => {
        expect(data).to.deep.equal(expected);
        done();
      })
      .catch(err => done(err))
    
  });
});