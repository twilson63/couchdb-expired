// remove docs that are expired
module.exports = function(config) {
  var expire = require('./expire')(config);
  var nano = require('nano')(config.server);

  return function(name, cb) {
    var db = nano.use(name);
    // call expire and then call done
    expire(db, done);

    function done(e, res) {
      // if err and it is view not found (404) the create view
      if (e && e.status_code === 404) {
        // create view and rerun
        db.insert(config._design_doc, "_design/" + config._design_doc._id,
          function(err) {
            if (err) { return cb(err); }
            expire(db, done);
          });
        return;
      } else if(e) {
        // need to report err
        return cb(e);
      }
      cb(null, res);
    }
    
  }
}