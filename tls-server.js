//
// tls-server.js
//
// Example of a Transport Layer Security (or TSL) server
//
// References:
//    http://nodejs.org/api/tls.html
//    http://docs.nodejitsu.com/articles/cryptography/how-to-use-the-tls-module
//

// Always use JavaScript strict mode. 
"use strict";

// Modules used here
var tls = require('tls'),
    fs = require('fs');
var Ber = require('asn1').Ber;
var merge = require("node.extend");

var common = require("asn1js/org/pkijs/common");
var _asn1js = require("asn1js");
var _pkijs = require("pkijs");
var _x509schema = require("pkijs/org/pkijs/x509_schema");

// #region Merging function/object declarations for ASN1js and PKIjs
var asn1js = merge(true, _asn1js, common);

var x509schema = merge(true, _x509schema, asn1js);

var pkijs_1 = merge(true, _pkijs, asn1js);
var pkijs = merge(true, pkijs_1, x509schema);
var org = pkijs.org;
var arrayBufferToBuffer = require('arraybuffer-to-buffer')
var TERM = '\uFFFD';

var options = {
    // Chain of certificate autorities
    // Client and server have these to authenticate keys 
    ca: [
        fs.readFileSync('ssl/root-cert.pem'),
        fs.readFileSync('ssl/ca1-cert.pem'),
        fs.readFileSync('ssl/ca2-cert.pem'),
        fs.readFileSync('ssl/ca3-cert.pem'),
        fs.readFileSync('ssl/ca4-cert.pem')
    ],
    // Private key of the server
    key: fs.readFileSync('ssl/agent1-key.pem'),
    // Public key of the server (certificate key)
    cert: fs.readFileSync('ssl/agent1-cert.pem'),

    // Request a certificate from a connecting client
    requestCert: true,

    // Automatically reject clients with invalide certificates.
    rejectUnauthorized: false             // Set false to see what happens.
};


// The data structure to be sent to connected clients
var message = {
    tag: 'Helsinki ' /* + String.fromCharCode(65533) */,
    date: new Date(),
    latitude: 60.1708,
    longitude: 24.9375,
    seqNo: 0
};
<<<<<<< HEAD
// var writer = new Ber.Writer();
//
// writer.startSequence();
=======


var writer = new Ber.Writer();

writer.startSequence();
>>>>>>> 89c475a294c4590fa5eab20487ed87df4ce0811e
// writer.writeBoolean(true);
// writer.writeInt(6);
// writer.endSequence();
var sequence = new org.pkijs.asn1.SEQUENCE();
sequence.value_block.value.push(new org.pkijs.asn1.INTEGER({value: 12}));

var sequence_buffer = sequence.toBER(false);

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

// A secure (TLS) socket server.
tls.createServer(options, function (s) {
    var intervalId;

    console.log("TLS Client authorized:", s.authorized);
    if (!s.authorized) {
        console.log("TLS authorization error:", s.authorizationError);
    }

    console.log("Cipher: ", s.getCipher());
    console.log("Address: ", s.address());
    console.log("Remote address: ", s.remoteAddress);
    console.log("Remote port: ", s.remotePort);
    message.seqNo = 0;
    var fragment = '';


    //console.log(s.getPeerCertificate());

    intervalId = setInterval(function () {
        // message.date = new Date();
        // var ms = JSON.stringify(message) + TERM;
        // message.seqNo += 1;
        // message.date = new Date();
        // ms += JSON.stringify(message) + TERM;
        // message.seqNo += 1;
<<<<<<< HEAD
        s.write(arrayBufferToBuffer(sequence_buffer));
=======
        var hex = Buffer.from(writer.buffer).toString('hex')
        console.log(hex, hex2a(hex));
        s.write(writer.buffer);
>>>>>>> 89c475a294c4590fa5eab20487ed87df4ce0811e
        // if ((message.seqNo % 100) === 0) {
        //     console.log(process.memoryUsage());
        // }
    }, 100);

    // Echo data incomming dats from stream back out to stream
    //s.pipe(s);

    s.on('data', function (data) {
        // Split incoming data into messages around TERM
        var info = data.toString().split(TERM);

        // Add any previous trailing chars to the start of the first message
        info[0] = fragment + info[0];
        fragment = '';

        // Parse all the messages into objects
        for (var index = 0; index < info.length; index++) {
            if (info[index]) {
                try {
                    var message = JSON.parse(info[index]);
                    console.log(message.name);
                    console.log(message.passwd);
                } catch (error) {
                    // The last message may be cut short so save its chars for later.
                    fragment = info[index];
                    continue;
                }
            }
        }
//        s.socket.end();
    });

    // Handle events on the underlying socket
    s.on("error", function (err) {
        console.log("Eeek:", err.toString());
    });

    s.on("end", function () {
        console.log("End:");
    });

    s.on("close", function () {

        clearInterval(intervalId);
        console.log("Close:");
    });
}).listen(8000);






