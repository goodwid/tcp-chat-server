![CF](http://i.imgur.com/7v5ASc8.png) TCP Chat Server
===

TCP chat server.

To run, clone this repo, then run

    npm install
    node index.js [port]

Connect to the server by running one of the following:

    telnet localhost [port]
    node client.js [port]

Available commands are:

  - /nick: change your nickname
  - /who: shows who is connected
  - /msg: private message to another
  - /me: action in the chat room
  - /quit: disconnect from the chat room

Tests can be run by:

    npm test
