var _ = require('underscore');
var async = require('async');

module.exports = function(config) {
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

  function expire(cb) {
    db.view(config._design_doc._id, '_default', { limit: 40000 }, function(e,b) {
      if (e) { return(e); }
      var results = _(res.rows).map(function(row) { 
        return _.extend(row, { _deleted: true});
      });
      db.bulk(results, cb);
    });
  }

  function process(err, list) {
    _(list).each(function(name) {
      var db = nano.use(name);
      expire(function(e, res) {
        if (e) {
          // create view and rerun
        }
        // report outcome
      });

      async.waterfall([
        // get design doc
        // function (cb) { db.get(config._design_doc._id, cb); },
        // insert if does not exist
        function (cb) {
          // if (err) { return cb(null, { ok: true }); }
          db.insert(config._design_doc, config._design_doc._id, cb);
        },
        // call expired view
        function(err, res, cb) {
          console.log('get expired docs');
          db.view(config._design_doc._id, '_default', { limit: 40000 }, cb);
        },
        // mark the documents as deleted
        function(err, res, cb) {
          if (err) { return cb(err); }
          var results = _(res.rows).map(function(row) { 
            return _.extend(row, { _deleted: true});
          });
          cb(null, results);
        },
        // perform bulk operation
        function(err, rows, cb) {
          if (err) { return cb(err); }
          db.bulk(rows, cb);
        }
      ], function(err, res) {
        console.log('jump to start do not collect 200');
        if (err) { console.log(err); }
        console.log(res);
      });
    });
  }
}