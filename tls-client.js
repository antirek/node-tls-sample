"use strict";
var tls = require('tls');
var fs = require('fs');
var util = require('util');
var events = require('events');
var models = require('./models');


var TLSClient = function (host, port) {

    var options = {
        ca: [
            fs.readFileSync('ssl/root-cert.pem'),
            fs.readFileSync('ssl/ca1-cert.pem'),
            fs.readFileSync('ssl/ca2-cert.pem'),
            fs.readFileSync('ssl/ca3-cert.pem'),
            fs.readFileSync('ssl/ca4-cert.pem')
        ],
        key: fs.readFileSync('ssl/agent2-key.pem'),
        cert: fs.readFileSync('ssl/agent2-cert.pem'),
        rejectUnauthorized: false             // Set false to see what happens.
    };
    var self = this;
    events.EventEmitter.call(this);

    var connect = (function connect() {
        self.s = tls.connect(port, host, options, function () {
            self.emit('connect', null);

            console.log("TLS Server authorized:", self.s.authorized);
            if (!self.s.authorized) {
                console.log("TLS authorization error:", self.s.authorizationError);
            }
            console.log('cert:', self.s.getPeerCertificate());
            console.log('protocol:', self.s.getProtocol());
        });

        self.s.on("error", function (err) {
            console.log("Eeek:", err.toString());
        });

        self.s.on("data", function (data) {
            var ConnectResponse = models.ConnectResponse.decode(data,'der');
            console.log('ConnectResponse', ConnectResponse);
        });

        self.s.on("end", function () {
            console.log("End:");
        });

        self.s.on("close", function () {
            console.log("Close:");
            self.emit('disconnect', null);
        });
    })();
};
util.inherits(TLSClient, events.EventEmitter);

TLSClient.prototype.write = function (message) {
    if (this.s.writable) {
        this.s.write(message);
    }
};

module.exports = TLSClient;





