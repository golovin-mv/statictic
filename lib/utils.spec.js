const assert = require('assert');
const { expect } = require('chai');
const { relay, curry, values, mapToObject } = require('./utils');

describe('utils', () => {
  it('relay', () => {
    const isWaterTemp = relay([
      [(isWater, temp) => isWater && temp === 'hot', (isWater, temp) => `water is hot ${isWater}, ${temp}`],
      [(isWater, temp) => isWater && temp === 'cold', (isWater, temp) => `water is cold ${isWater}, ${temp}`],
      [isWater => !isWater, () => 'there is no water'],
    ]);

    assert.equal(isWaterTemp(true, 'hot'), 'water is hot true, hot');
    assert.equal(isWaterTemp(true, 'cold'), 'water is cold true, cold');
    assert.equal(isWaterTemp(false), 'there is no water');
    assert.equal(isWaterTemp(), undefined);
  });

  it('curry', () => {
    const test = (a, b) => a + b;
    const cTest = curry(test)('foo');

    assert.equal(cTest('bar'), 'foobar')
  });

  it('values', () => {
    const obj = {
      foo: 'bar',
      fiz: 'buzz'
    }

    expect(values(obj)).to.deep.equal(['bar', 'buzz']);
    expect(values()).to.deep.equal([]);
  });

  it('mapToObject', () => {
    const val = {
      foo: 'bar',
      fiz: 'buzz',
      some: 'value'
    };

    const obj = {
      foo: undefined,
      some: undefined,
    }

    const mapToTest = mapToObject(obj);

    expect(mapToTest(val)).to.deep.equal({
      foo: val.foo,
      some: val.some,
    });
  });

  it('mapToObject func val', () => {
    const val = {
      foo: 'bar',
      fiz: 'buzz',
      some: 'value'
    };

    const obj = {
      foo: (val) => val.fiz,
      some: undefined,
    }

    const mapToTest = mapToObject(obj);

    expect(mapToTest(val)).to.deep.equal({
      foo: val.fiz,
      some: val.some,
    });
  })
});

