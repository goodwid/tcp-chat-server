#!/usr/bin/env node

const net = require('net');
const chat = require ('./chat');

const server = net.createServer(socket => {
  console.log(chat.init(socket));

  socket.on( 'close', () =>{
    console.log(`${socket.id} disconnected`);
    // call cleanup function if user loses connection instead of using /quit
    if (chat.clients.indexOf(socket) > -1) chat.quit(socket);
  });

  socket.on('data', chunk => {
    chat.processData(chunk, socket);
  });
});

server.listen(process.argv[2]||3000, () => {
  var address = server.address();
  console.log('opened server on %j', address);
});
