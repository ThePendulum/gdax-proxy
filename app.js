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

const server = net.createServer(client => {
    note('server', 0, 'Client \'' + client.remoteAddress + '\' connected');

    exchangeSocket.on('message', msg => {
        if(client.writable) {
            client.write(JSON.stringify(msg));
        }
    });

    client.on('end', () => {
        note('server', 0, 'Client \'' + client.remoteAddress + '\' disconnected');
    });
});

server.on('error', error => {
    note('server', 2, error);
});

server.listen(config.port, config.host, () => {
    const address = server.address();

    note('server', 0, 'Server listening at \'' + address.address + ':' + address.port + '\'');
});
