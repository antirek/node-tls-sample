var asn = require('asn1.js');
var ConnectRequest = asn.define('ConnectRequest', function () {
    this.seq().obj(
        this.key('session-timeout').int(),
        this.key('max-data-length').int(),
        this.key('data-packet-window-size').int(),
        this.key('data-load-timeout').int(),
        this.key('request-response-timeout').int(),
        this.key('data-packet-response-timeout').int()
    )
});
module.exports = ConnectRequest;