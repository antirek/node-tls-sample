var asn = require('asn1.js');

var ObjectDescriptor = asn.define('ObjectDescriptor', function() {
  this.seq().obj(
    this.key('ObjectDescriptor').bmpstr()
  );
});

var ConnectResponse = asn.define('ConnectResponse', function () {
    this.seq().obj(
        this.key('confirmed-data-packet-window-size').int(),
        this.key('confirmed-session-timeout').int(),
        this.key('confirmed-data-load-timeout').int(),
        this.key('confirmed-request-response-timeout').int(),
        this.key('supports').seqof(ObjectDescriptor)
    )
});
module.exports = ConnectResponse;