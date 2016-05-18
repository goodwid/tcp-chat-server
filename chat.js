const chat = {};
chat.clients = [];
chat.id = 0;

chat.init = function (socket) {
  chat.id++;
  socket.id = chat.id;
  socket.nick = `guest0${socket.id}`;
  chat.clients.push(socket);
  socket.write(`\nHello ${socket.nick}!\n\nCommands are:\n /nick <nick>: change your name.\n /who: list all connections.\n /quit: leave the room.\n /me: action.\n /msg: send private message to another.\n\n`);
  return `${socket.nick} connected`;
};


chat.nickChange = function (socket, newNick) {
  var nickAvail = true;
  chat.clients.forEach (client => {
    if (newNick === client.nick) nickAvail = false;
  });
  if (nickAvail) {
    chat.writeAll(`*** ${socket.nick} is now known as ${newNick}\n`, null);
    socket.nick = newNick;
  } else {
    socket.write (' error: that nick is in use.\n');
  }
};

chat.command = function (socket, data) {
  switch (data[0].trim()) {
  case '/nick': {
    chat.nickChange(socket, data[1].trim());
    break;
  }
  case '/quit': {
    chat.quit(socket);
    break;
  }
  case '/who': {
    chat.who(socket);
    break;
  }
  case '/me': {
    data.shift();
    chat.writeAll (`${socket.nick} ${data.join(' ')}`);
    break;
  }
  case '/msg': {
    var nickFound = false;
    chat.clients.forEach(client => {
      if (client.nick.toUpperCase() === data[1].toUpperCase()) {

        client.write (`${socket.nick} whispers: ${data.slice(2).join(' ')}`);
        nickFound = true;
      }
    });
    if (!nickFound) socket.write (' error: nick not found.\n');
    break;
  }
  case '/diag': {
    socket.write('*** There are ' + chat.clients.length + 'in the array\n');
  }
  }
};

chat.processData = function (chunk, socket) {
  if (/^\//.test(chunk)) {
    chat.command(socket, chunk.toString().split(' '));
  } else {
    chat.writeAll(`<${socket.nick}> ${chunk.toString()}`, socket);
  }
};

chat.writeAll = function (data, sender) {
  chat.clients.forEach( (client) => {
    // Doesn't send message to sender since it appears in telnet client.
    if (client !== sender) {
      client.write(data);
    }
  });
};

chat.quit = function (socket) {
  chat.writeAll(`${socket.nick} has left the chat.\n`, socket);
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
