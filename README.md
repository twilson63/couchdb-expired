# CouchDb Expired Worker

This worker can be launched by cron or other scheduler to run daily and bulk
deletions all expired documents from your couchdb databases.

## Install

`npm install couchdb-expired -g`

## Getting started

First you want to create a config file, this file will list the server and all of your databases that you wish to manage: (eg. expired-config.json)


### Config File Example

``` json
{
  "server": "http://localhost:5984",
  "dbs": ["*"],
  "_design_doc": {
    "_id": "expired",
    "language": "javascript",
    "views": {
      "_default": {
        "map": "function(doc) { \n  var expire = (new Date(doc.expires_in)),\n    today = (new Date());\n  if (expire < today) {\n    emit(doc._id, doc._rev);\n  }\n}\n"
      }
    }
  }
}
```

### add command to crontab to run daily

``` sh
crontab -e
0 3 * * * expired ~/expired-config.json
```
Now every day on the 3rd hour the expire job should run.

## Tests

`npm test`

## Development Environment

* fork and clone
* `npm install`
* `npm test`

## LICENSE

MIT

## Contributions

* Pull Requests welcome, please include tests

## TODO

* add test for design doc creation
* add test for multiple databases
