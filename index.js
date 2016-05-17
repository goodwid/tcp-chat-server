#!/usr/bin/env node
const server = require( './server' );

server.listen(process.argv[2]||3000, () => {
  var address = server.address();
  console.log('opened server on %j', address);
});
