#! /usr/bin/env node

var config = process.argv[2] ? require(process.argv[2]) : {};
var expire = require(__dirname + '/');
expire(config, function(err, res) {
  if (err) { return console.log(err); }
  console.log(res);
});