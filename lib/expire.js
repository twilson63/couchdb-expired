var transform = require('./transform');
var _ = require('underscore');

module.exports = function(config) {
  return function(db, cb) {
    db.view(config._design_doc._id, '_default', { limit: 10000 }, function(e,b) {
      if (e) { return cb(e); }
      db.bulk({ docs: _(b.rows).map(transform) }, cb);
    });
  }
}