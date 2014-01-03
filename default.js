module.exports = {
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