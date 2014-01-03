
module.exports = function(config) {
  var expire = require('./expire')(config);
  var nano = require('nano')(config.server);

  return function(name, cb) {
    var db = nano.use(name);
    expire(db, done);

    function done(e, res) {
      if (e) {
        // create view and rerun
        db.insert(config._design_doc, "_design/" + config._design_doc._id,
          function(err) {
            if (err) { return cb(err); }
            expire(db, done);
          });
        return;
      }
      cb(null, res);
    }
    
  }
}