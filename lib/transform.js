module.exports = function (row) {
  return { _id: row.key, _rev: row.value, _deleted: true }
};