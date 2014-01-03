var expect = require('expect.js');
var transform = require('../../lib/transform');

describe('transform', function() {
  it('should convert key, value, to _id, _rev, _deleted', function(){
    var doc = transform({ key: 1, value: 2 });
    expect(doc).to.eql({_id: 1, _rev: 2, _deleted: true });
  });
});