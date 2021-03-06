var expect = require('expect.js');
var expired = require('../');

var nock = require('nock');

nock('http://localhost:5984')
  .get('/eirenerx/_design/expired/_view/_default?limit=10000')
  .reply(200, JSON.stringify({ rows: [{ key: 1, value: 2 }]}));

nock('http://localhost:5984')
  .post('/eirenerx/_bulk_docs', {"docs":[{"_id": 1, "_rev": 2, "_deleted": true}]})
  .reply(201, JSON.stringify([{_id: 1, _rev: 2}]));

describe('expired', function() {
  it('should create view and bulk remove 1 doc', function(done) {
    expired({}, function(err, res) {
      expect(res[0].length).to.be(1);
      done();
    });
  });
});