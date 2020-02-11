const Influx = require('influx');

class InfluxParams {
  /**
   * 
   * @param {Object} param
   * @param {string} param.id
   * @param {string} param.name
   * @param {string} param.description
   * @param {string} param.host
   * @param {string} param.database
   * @param {object} param.schema
   * @see https://github.com/node-influx/node-influx
   * 
   */
  constructor({
    id, name, description, host, database, schema,
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.host = host;
    this.database = database;
    this.schema = schema;
    this.type = 'INFLUX';
  }
}

/**
 * Получаем influx хранилище
 * @function
 * @param {InfluxParams} params
 * @returns {Influx.InfluxDB}
 */
const getCollection = params => new Influx.InfluxDB({
  host: params.host,
  database: params.database,
  schema: params.schema,
});


module.exports = {
  InfluxParams,
  getCollection,
};
