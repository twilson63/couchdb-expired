var _ = require('underscore');
var async = require('async');

module.exports = function(config, cb) {
  var _default = {
    server: "http://localhost:5984",
    dbs: ["eirenerx"],
    _design_doc: {
      _id: "expired",
      language: "javascript",
      views: {
        _default: {
            map: "function(doc) { \n  var expire = (new Date(doc.expires_in)),\n    today = (new Date());\n  if (expire < today) {\n    emit(doc._id, doc._rev);\n  }\n}\n"
          }
        }
      }
  };
  // mixin config
  config = _.extend(_default, config);
  // get databases
  var nano = require('nano')(config.server);
  
  // for each db
  // Check and see if view exists
  config.dbs[0] === "*" ? nano.db.list(process) : process(null, config.dbs);

  function expire(db, cb) {
    db.view('expired', '_default', { limit: 4000 }, function(e,b) {
      if (e) { return cb(e); }
      var results = _(b.rows).map(function(row) { 
        return {
          _id: row.key,
          _rev: row.value,
          _deleted: true
        }
      });
      db.bulk({ docs: results}, function(err, res) {
        cb(null, res);
      });
    });
  }

  function process(err, list) {
    var results = [];
    async.map(list, function(name, cb) {
      var db = nano.use(name);
      expire(db, function(e, res) {
        if (e) {
          // create view and rerun
          db.insert(config._design_doc, "_design/expired", function(err, body) {
            if (err) { return cb(err); }
            expire(db, function(e, r) { cb(null, r); });
          });
          return;
        }
        cb(null, res);
      });
    }, function(err, results) {
      cb(null, results);
    });
  }
}