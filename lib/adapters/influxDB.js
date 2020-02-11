const Influx = require('influx');

/**
 * Адаптер для взаимодействия с influxdb
 */
const influx = new Influx.InfluxDB({
  host: process.env.INFLUX_DB_HOST,
  // TODO: вынести в .env
  database: 'statistic',
  schema: [
    {
      measurement: 'channels',
      fields: {
        max: Influx.FieldType.FLOAT,
        current: Influx.FieldType.INTEGER,
        min: Influx.FieldType.FLOAT,
      },
      tags: ['type'],
    },
  ],
});

module.exports = influx;
