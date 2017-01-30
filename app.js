'use strict';

const config = require('config');
const util = require('util');
const net = require('net');
const Gdax = require('gdax');

const exchangeSocket = new Gdax.WebsocketClient(config.products, null, config.auth);

exchangeSocket.on('open', () => {
    console.log('Established connection with GDAX websocket API');

    exchangeSocket.socket.send(JSON.stringify({
        type: "heartbeat",
        on: config.heartbeat
    }));
});

exchangeSocket.on('close', () => {
    console.log('Closed connection with GDAX websocket API');

    process.exit(1);
});

exchangeSocket.on('error', error => {
    console.log(error);

    process.exit(1);
});

const server = net.createServer(client => {
    console.log('Client \'' + client.remoteAddress + '\' connected');

    exchangeSocket.on('message', msg => {
        if(client.writable) {
            client.write(JSON.stringify(msg));
        }
    });

    client.on('end', () => {
        console.log('Client \'' + client.remoteAddress + '\' disconnected');
    });
});

server.on('error', error => {
    console.log(error);

    process.exit(1);
});

server.listen(config.port, config.host, () => {
    const address = server.address();

    console.log('Server listening at \'' + address.address + ':' + address.port + '\'');
});
