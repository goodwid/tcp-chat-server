const assert = require('chai').assert;
const chat = require('../chat');

// mock socket object
function makeSocket() {
  return {
    write (s) {
      this.output = s;
    },
    destroy() {
      this.output = 'destroy called';
    }
  };
}

describe('chat client handling', () => {

  it('init function adds socket to clients array', () => {
    chat.init(makeSocket());
    chat.init(makeSocket());
    assert.equal(chat.clients.length,2);
  });

  it('init function adds random nick to socket object', () => {
    assert(chat.clients[0].nick);
  });

  it('writeAll writes to all sockets except sender', () => {
    chat.writeAll ('test', chat.clients[1]);
    assert ((chat.clients[0].output === 'test') && chat.clients[1].output !== 'test');
  });

  it('nick function changes socket.nick', () => {
    const oldNick = chat.clients[0].nick;
    chat.nickChange(chat.clients[0], 'test');
    assert(oldNick !== chat.clients[0].nick);
  });

  it('quit function removes object from array', () => {
    var l = chat.clients.length;
    chat.quit(chat.clients[0]);
    assert (chat.clients.length === l - 1);
  });

});
