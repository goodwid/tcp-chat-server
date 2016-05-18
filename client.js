#!/usr/bin/env node

const net = require('net');
const aE = require('ansi-escapes');
const port = process.argv[2] || 3000;

process.stdin.resume();
process.stdin.setEncoding('utf-8');

process.stdout.write(aE.clearScreen);
const client = net.connect({port}, () => {
  client.on('error', err => {
    console.log(err);
  });

  process.stdin.on('data', text => {
    client.write(text);
    prompt();
  });

  client.on('data', text => {
    process.stdout.write(text);
    prompt();
  });

  client.on('close', () => {
    console.log('The connection has dropped.');
    process.exit(0);
  });
});

//
function prompt() {
  process.stdout.write('> ');
}
