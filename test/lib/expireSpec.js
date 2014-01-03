var expect = require('expect.js');
var _default = require('../../default');
var expire = require('../../lib/expire')(_default);
var db = {
  view: function(design, view, opts, cb) {
    expect(design).to.eql('expired');
    expect(view).to.eql('_default');
    expect(opts.limit).to.eql(10000);
    cb(null, { rows: [{ key: 1, value: 2 }]});
  },
  bulk: function(doc, cb) {
    expect(doc).to.eql({ docs: [{ _id: 1, _rev: 2, _deleted: true }]});
    cb(null, [{_id: 1, _rev: 2}]);
  }
};

describe('expire', function() {
  it('should be successful', function(done) {
    expire(db, done);
  });
});