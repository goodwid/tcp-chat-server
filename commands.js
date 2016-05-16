const commands = {}

commands.quit = function (socket) {
  socket.destroy();
};

module.exports = commands;
