#!/usr/bin/env node

const net = require('net');
const ee = require('events');
const commands = require ('./commands');
const chat = new ee();

var clients = [];
var id = 0;

const server = net.createServer(socket => {
  socket.id = id++;
  socket.nick = `guest0${id}`;
  clients.push(socket);
  console.log(`${socket.nick} connected`);
  socket.write(`\nHello ${socket.nick}!\n\nCommands are:\n /nick <nick>: change your name.\n /who: list all connections.\n /quit: leave the room.\n\n`);

  socket.on( 'close', () => {
    console.log(`${socket.nick} disconnected`);
    chat.removeAllListeners('quit'+socket.id);
    chat.removeAllListeners('command'+socket.id);
    chat.removeAllListeners('nick'+socket.id);
    clients.splice(clients.indexOf(socket), 1);
  });

  socket.on('data', chunk => {
    if (/^\//.test(chunk)) {
      chat.emit('command'+socket.id, chunk.toString().split(' '));
    } else {
      writeAll(`<${socket.nick}> ${chunk.toString()}`, socket);
    }
  });

  function writeAll (data, sender) {
    console.log('sender: ', sender.nick);
    clients.forEach( (client) => {
      client.write(data);
    });
  }

  chat.on('nick'+socket.id, (newNick) => {
    console.log(`${socket.nick} is now ${newNick}`);
    writeAll(`*** ${socket.nick} is now known as ${newNick}\n`, socket);
    socket.nick = newNick;
  });

  chat.on('quit'+socket.id, commands.quit);

  chat.on('command'+socket.id, (data) => {
    if (data[0].trim() === '/nick') {
      chat.emit('nick'+socket.id, data[1].trim());
    }
    if (data[0].trim() === '/quit') {
      chat.emit('quit'+socket.id, socket);
    }
    if (data[0].trim() === '/who') {
      socket.write('The following clients are connected:\n');
      clients.forEach( (client) => {
        socket.write(`  ${client.nick}\n`);
      });
    }
  });
});

server.listen(process.argv[2]||3000, () => {
  var address = server.address();
  console.log('opened server on %j', address);
});
