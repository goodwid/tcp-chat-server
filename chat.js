const chat = {}
chat.clients = [];

chat.quit = function (socket) {
  socket.destroy();
};

chat.who = function (socket) {
  socket.write('The following clients are connected:\n');
  chat.clients.forEach( (client) => {
    socket.write(`  ${client.nick}\n`);
  });
};


module.exports = chat;
