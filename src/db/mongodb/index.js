const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://42.192.135.17:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("连接成功");
});