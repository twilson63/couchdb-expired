var _ = require('underscore');
var async = require('async');

module.exports = function(config, cb) {
  var _default = require('./default');
  // mixin config
  config = _.extend(_default, config);
  var nano = require('nano')(config.server);
  var remove = require('./lib/remove')(config);
  // get db list if config uses asterisk then get all dbs
  config.dbs[0] === "*" ? nano.db.list(process) : process(null, config.dbs);
  // for each db `remove` expired docs
  function process(err, list) { 
    async.map(list, remove, cb); 
  }
};
