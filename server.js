#!/usr/bin/env node

const net = require('net');
const ee = require('events');
const chat = require ('./chat');
const chatEvents = new ee();

var id = 0;

const server = net.createServer(socket => {
  socket.id = id++;
  socket.nick = `guest0${id}`;
  chat.clients.push(socket);
  console.log(`${socket.nick} connected`);
  socket.write(`\nHello ${socket.nick}!\n\nCommands are:\n /nick <nick>: change your name.\n /who: list all connections.\n /quit: leave the room.\n\n`);

  socket.on( 'close', () => {
    console.log(`${socket.nick} disconnected`);
    chatEvents.removeAllListeners('quit'+socket.id);
    chatEvents.removeAllListeners('command'+socket.id);
    chatEvents.removeAllListeners('nick'+socket.id);
    chat.clients.splice(chat.clients.indexOf(socket), 1);
  });

  socket.on('data', chunk => {
    if (/^\//.test(chunk)) {
      chatEvents.emit('command'+socket.id, chunk.toString().split(' '));
    } else {
      writeAll(`<${socket.nick}> ${chunk.toString()}`, socket);
    }
  });

  function writeAll (data, sender) {
    console.log('sender: ', sender.nick);
    chat.clients.forEach( (client) => {
      client.write(data);
    });
  }

  chatEvents.on('nick'+socket.id, (newNick) => {
    console.log(`${socket.nick} is now ${newNick}`);
    writeAll(`*** ${socket.nick} is now known as ${newNick}\n`, socket);
    socket.nick = newNick;
  });

  chatEvents.on('quit'+socket.id, chat.quit);

  chatEvents.on('command'+socket.id, (data) => {
    switch (data[0].trim()) {
    case '/nick': {
      chatEvents.emit('nick'+socket.id, data[1].trim());
      break;
    }
    case '/quit': {
      chatEvents.emit('quit'+socket.id, socket);
      break;
    }
    case '/who': {
      chat.who (socket);
      break;
    }
    }
  });
});

server.listen(process.argv[2]||3000, () => {
  var address = server.address();
  console.log('opened server on %j', address);
});
