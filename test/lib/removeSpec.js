var expect = require('expect.js');
var _default = require('../../default');
var remove = require('../../lib/remove')(_default);
var nock = require('nock');

nock('http://localhost:5984')
  .get('/eirenerx/_design/expired/_view/_default?limit=10000')
  .reply(200, JSON.stringify({ rows: [{ key: 1, value: 2 }]}));

nock('http://localhost:5984')
  .post('/eirenerx/_bulk_docs', {"docs":[{"_id": 1, "_rev": 2, "_deleted": true}]})
  .reply(201, JSON.stringify([{_id: 1, _rev: 2}]));

describe('remove', function() {
  it('should be successful', function(done) {
    remove('eirenerx', function(err, docs) {
      expect(docs).to.eql([{_id: 1, _rev: 2}])
      done();
    });
  });
});