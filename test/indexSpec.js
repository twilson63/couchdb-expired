var expect = require('expect.js');
var expired = require('../');

//var nock = require('nock');


describe('expired', function() {
  it('should create view and bulk remove three docs', function(done) {
    expired({}, function(err, res) {
      console.log(err);
      console.log(res);
      expect(res.rows.length).to.be(3);
      done();
    });
  });
  // it('should not create view and remove 1 doc', function(done) {
  //   
  // });
});