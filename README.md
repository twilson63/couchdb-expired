# CouchDb Expired

This node app can be launched by cron or other scheduler to run daily and bulk
delete all expired documents from your couchdb databases.

First you want to create a config file, this file will list the server and all of your databases that you wish to manage:

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

On the first run the application will insert the view that is in the design_doc node of the json document.


