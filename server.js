#!/usr/bin/env node

const net = require('net');
const chat = require ('./chat');

var id = 0;

const server = net.createServer(socket => {
  socket.id = id++;
  socket.nick = `guest0${id}`;
  chat.clients.push(socket);
  chat.init(socket);

  socket.on( 'close', () => console.log(`${socket.nick} disconnected`));

  socket.on('data', chunk => {
    if (/^\//.test(chunk)) {
      chat.Events.emit('command'+socket.id, chunk.toString().split(' '));
    } else {
      chat.writeAll(`<${socket.nick}> ${chunk.toString()}`, socket);
    }
  });


});

server.listen(process.argv[2]||3000, () => {
  var address = server.address();
  console.log('opened server on %j', address);
});
