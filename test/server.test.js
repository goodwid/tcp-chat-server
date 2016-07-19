const assert = require('chai').assert;
const server = require('../server');
const net = require('net');
const port = 15658;

describe ('server',() => {
  before(done => {
    server.listen(port, done);
  });

  describe('client input', () => {
    var client1;
    var client2;
    var client3;

    before(done => {
      client1 = net.connect({port}, done);
    });

    it ('received welcome message', done => {
      client1.once('data', message => {
        const checkLine = message.toString().split('\n')[1];
        assert.equal(checkLine, 'Hello guest01!');
      });
      done();
    });

    before(done => {
      client2 = net.connect({port}, done);
    });

    var testMessage = 'client2 says hello client1';

    it ('client message shows up for another client',done => {
      client1.once ('data', message => {
        // removing the client's nick from the message
        var incomingMessage = message.toString().split(' ').slice(1).join(' ');
        assert.equal(testMessage, incomingMessage);
        done();
      });
      client2.write(testMessage);
    });

    before(done => {
      client3 = net.connect({port}, done);
    });

    it ('client1 does not see private message between other clients',done => {
      client1.once ('data', message => {
        throw new Error (message);
      });
      client2.write('/msg guest03 This should not be visible');
      done();
    });

    after(done => {
      client1.on('close',done);
      client1.end();
    });
    after(done => {
      client2.on('close', done);
      client2.end();
    });
    after(done => {
      client3.on('close', done);
      client3.end();
    });
  });

  after(done => {
    server.close(done);
  });
});
