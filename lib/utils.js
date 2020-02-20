const isFunction = fn => fn && (typeof (fn) === 'function');

const curry = fn => new Array(fn.length ? Math.abs(fn.length - 1) : 0).fill(undefined).reduceRight(
  prev => (...v) => c => prev(...v, c),
  (...val) => fn(...val),
);

const compose = (...fn) => curry((...val) => fn.reduce((prev, curr) => curr(prev), ...val));

const composeAsync = (...fn) => curry((...val) => fn.reduce((prev, curr) => prev
  .then(curr), Promise.resolve(...val)));

const callOrRetun = (fn, ...val) => (isFunction(fn) ? fn(...val) : fn);

const ifElse = (cond, trueFn, fasleFn) =>
  curry((...val) => (callOrRetun(cond, ...val) ? trueFn(...val) : fasleFn(...val)));

const relay = arr => (...val) => compose(
  () => arr.find(el => !!el[0](...val)),
  ifElse(
    el => el && isFunction(el[1]),
    el => el[1](...val),
    () => undefined,
  ),
)(...val);

const values = (obj = {}) => Object.keys(obj).map(el => obj[el]);

const mapToObject = (obj = {}) => val => Object.keys(obj)
  .reduce((acc, cVal) => ({
    ...acc,
    [cVal]: ifElse(isFunction(obj[cVal]), () => obj[cVal](val), v => v)(val[cVal]),
  }), {});

module.exports = {
  curry,
  compose,
  composeAsync,
  ifElse,
  relay,
  callOrRetun,
  isFunction,
  values,
  mapToObject,
};
