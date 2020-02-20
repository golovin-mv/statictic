import io from 'socket.io-client';

let socket;

const run = () => {
  socket = io('http://localhost:1337', { query: 'userId=1' });

  socket.on('readyWork', (data) => {
    console.log(data);
  });
};
// TODO to env

export default socket;

export { run };
