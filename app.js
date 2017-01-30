'use strict';

const config = require('config');
const util = require('util');
const net = require('net');
const note = require('note-log');
const Gdax = require('gdax');

const exchangeSocket = new Gdax.WebsocketClient(config.products, null, config.auth);

exchangeSocket.on('open', () => {
    exchangeSocket.socket.send(JSON.stringify({
        type: "heartbeat",
        on: config.heartbeat
    }));
});

const server = net.createServer(socket => {
    exchangeSocket.on('message', msg => {
        if(socket.writable) {
            socket.write(JSON.stringify(msg));
        }
    });
});

server.listen(config.port, config.host);
