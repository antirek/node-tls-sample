"use strict";

var TLSClient = require('./tls-client.js');
var models = require('./models');

var c1 = new TLSClient('agent1', 8000);

c1.on('connect', function (err) {
    console.log('Client connected.');

    c1.write(models.ConnectRequest.encode({
        'session-timeout': 60,
        'max-data-length': 11,
        'data-packet-window-size': 12,
        'data-load-timeout': 13,
        'request-response-timeout': 14,
        'data-packet-response-timeout': 15
    },'der'));
});

c1.on('disconnect', function (err) {
    console.log('Client disconnected');
});

c1.on('message', function (message) {
    console.log('message', 'message');
});

console.log('STARTED');