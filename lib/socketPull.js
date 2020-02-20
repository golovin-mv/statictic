// TODO разделить
const IO = require('koa-socket-2');

const { composeAsync, curry } = require('./utils');
const { getUsersResults } = require('./jobs/jobResults');

class SocketEvent {
  constructor(name, data, userId, broadcast = false) {
    this.name = name;
    this.data = data;
    this.userId = userId;
    this.broadcast = broadcast;
    this.finish = false;
  }
}

const socketPull = {};
// TODO грязь
const addSocket = (sock, userId) => {
  socketPull[userId] = sock;
  return userId;
};

const getUserId = sock => sock.handshake.query.userId;

const publishResults = (sock, results) => sock.json.send({
  event: 'readyWork',
  results,
});

// TODO: to socket events
const onConnection = sock => composeAsync(
  getUserId,
  curry(addSocket)(sock),
  getUsersResults,
  curry(publishResults)(sock),
)(sock);

// TODO убрать грязь
const getSocket = ({ userId }) => socketPull[userId];

const sendEvent = (socketEvent, sock) => sock.json.send({
  event: socketEvent.name,
  data: socketEvent.data,
});

const publishEvent = socketEvent => composeAsync(
  getSocket,
  curry(sendEvent)(socketEvent),
)(socketEvent);

const runSocket = app => () => {
  const io = new IO();
  io.attach(app);
  app._io.on('connection', onConnection);
};

module.exports = {
  runSocket,
  publishEvent,
  SocketEvent,
};
