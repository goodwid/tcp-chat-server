const assert = require('chai').assert;
const chat = require('../chat');

// mock socket object
function makeSocket() {
  const socket = {
    write (s) {
      this.output = s;
    },
    destroy() {
      this.output = 'destroy called';
    }
  };
  return socket;
}

describe('chat client handling', () => {

  it('init function adds socket to clients array', () => {
    chat.init(makeSocket());
    chat.init(makeSocket());
    // console.log(chat.Event.listeners('nick'+chat.clients[0]));
    assert (chat.clients.length !== 0);
  });

  it('init function adds random nick to socket object', () => {
    assert (chat.clients[0].nick);
  });

  it('writeAll writes to all objects except sender', () => {
    chat.writeAll ('test', chat.clients[1]);
    assert ((chat.clients[0].output === 'test') && chat.clients[1].output !== 'test');
  });
});

describe('chat events handling', () => {
  it('nick event changes socket.nick', () => {
    const oldNick = chat.clients[0].nick;
    chat.Events.emit('nick'+chat.clients[0].id, 'test');

    assert(oldNick !== chat.clients[0].nick);
  });

  it('quit function removes object from array', () => {
    var l = chat.clients.length;
    chat.Events.emit('quit'+chat.clients[0].id, chat.clients[0]);
    assert (chat.clients.length === l-1);
  });

});
