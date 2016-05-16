const ee = require('events');
const chat = {};
chat.Events = new ee();
chat.clients = [];
chat.id = 0;


chat.init = function (socket) {
  chat.id++;
  socket.id = chat.id;
  socket.nick = `guest0${socket.id}`;
  chat.clients.push(socket);
  socket.write(`\nHello ${socket.nick}!\n\nCommands are:\n /nick <nick>: change your name.\n /who: list all connections.\n /quit: leave the room.\n\n`);

  chat.Events.on('nick'+socket.id, (newNick) => {
    console.log(`${socket.nick} is now ${newNick}`);
    chat.writeAll(`*** ${socket.nick} is now known as ${newNick}\n`, socket);
    socket.nick = newNick;
  });

  chat.Events.on('quit'+socket.id, chat.quit);

  chat.Events.on('command'+socket.id, (data) => {
    switch (data[0].trim()) {
    case '/nick': {
      chat.Events.emit('nick'+socket.id, data[1].trim());
      break;
    }
    case '/quit': {
      chat.Events.emit('quit'+socket.id, socket);
      break;
    }
    case '/who': {
      chat.who (socket);
      break;
    }
    }
  });
  return `${socket.nick} connected`;
};

chat.processData = function (chunk, socket) {
  if (/^\//.test(chunk)) {
    chat.Events.emit('command'+socket.id, chunk.toString().split(' '));
  } else {
    chat.writeAll(`<${socket.nick}> ${chunk.toString()}`, socket);
  }
};

chat.writeAll = function (data, sender) {
  chat.clients.forEach( (client) => {
    if (client !== sender) {
      client.write(data);
    }
  });
};

chat.quit = function (socket) {
  chat.writeAll(`${socket.nick} has left the chat.\n`, socket);
  chat.Events.removeAllListeners('quit'+socket.id);
  chat.Events.removeAllListeners('command'+socket.id);
  chat.Events.removeAllListeners('nick'+socket.id);
  chat.clients.splice(chat.clients.indexOf(socket), 1);
  socket.destroy();
};

chat.who = function (socket) {
  socket.write('The following clients are connected:\n');
  chat.clients.forEach( (client) => {
    socket.write(`  ${client.nick}\n`);
  });
};

module.exports = chat;
