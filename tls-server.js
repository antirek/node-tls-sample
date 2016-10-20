"use strict";

var tls = require('tls');
var fs = require('fs');
var asn = require('asn1.js');

var options = {
    ca: [
        fs.readFileSync('ssl/root-cert.pem'),
        fs.readFileSync('ssl/ca1-cert.pem'),
        fs.readFileSync('ssl/ca2-cert.pem'),
        fs.readFileSync('ssl/ca3-cert.pem'),
        fs.readFileSync('ssl/ca4-cert.pem')
    ],
    key: fs.readFileSync('ssl/agent1-key.pem'),         //private
    cert: fs.readFileSync('ssl/agent1-cert.pem'),       //public
    requestCert: true,
    rejectUnauthorized: true
};

var models = require('./models');

tls.createServer(options, function (s) {

    console.log("TLS Client authorized:", s.authorized);

    if (!s.authorized) {
        console.log("TLS authorization error:", s.authorizationError);
    }

    console.log("Cipher: ", s.getCipher());
    console.log("Address: ", s.address());
    console.log("Remote address: ", s.remoteAddress);
    console.log("Remote port: ", s.remotePort);

    s.on('data', function (data) {
        
        var ConnectRequest = models.ConnectRequest.decode(data, 'der');
        for (var key in ConnectRequest) {
            console.log(ConnectRequest[key].toString());
        }
        var ConnectResponse = models.ConnectResponse.encode({
            'confirmed-data-packet-window-size': ConnectRequest['data-packet-window-size'],
            'confirmed-session-timeout': ConnectRequest['session-timeout'],
            'confirmed-data-load-timeout': ConnectRequest['data-load-timeout'],
            'confirmed-request-response-timeout': ConnectRequest['request-response-timeout'],
            'supports': [{name: 'Good'}]
        }, 'der');
        s.write(ConnectResponse)
        console.log('connectresponse', ConnectResponse.toString('hex'));
    });

    s.on("error", function (err) {
        console.log("Error:", err.toString());
    });

    s.on("end", function () {
        console.log("End");
    });

    s.on("close", function () {
        console.log("Close");
    });
}).listen(8000);