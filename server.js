const net = require('net');
const chat = require ('./chat');

const server = net.createServer(socket => {

  chat.init(socket);

  socket.on('data', chunk => {
    chat.processData(chunk, socket);
  });

  socket.on( 'close', () =>{
    // console.log(`${socket.id} disconnected`);
    // call cleanup function if user loses connection instead of using /quit
    if (chat.clients.indexOf(socket) > -1) chat.quit(socket);
  });
});

module.exports = server;
