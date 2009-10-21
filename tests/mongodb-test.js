/*include("helma/unittest");
include('../db');
var log = require("helma/logging").getLogger(__name__);

export('testCase');

var testCase = new TestCase('mongo/tests/db_test');
var dbname = "helmatest";

testCase.testBasics = function() {
  var db = new MongoDB(dbname);
  var secondDB = new MongoDB(dbname);
  assertEqual(db, secondDB); // make sure we're not creating duplicate db objects
  
  var first = db.coll('first');
  first.drop();
  assertEqual(first.getName(), 'first');
  assertEqual(first.find().length(), 0); // should be empty at first
  
  var saved = first.save({test:21});
  assertEqual(saved.test, 21);
  
  var found = first.findOne(); // should only be one in there
  assertEqual(found.test, 21);
  
  assertEqual(db.getCollectionNames()[0], 'first');
  
  first.ensureIDIndex();
  var idxs = first.getIndexInfo();
  assertEqual(idxs[0].name, '_id_1' );
  
  first.drop();
}

testCase.testLoading = function() {
  var load = new MongoDB(dbname).coll('load');
  load.ensureIDIndex();
  var count = 10000;
  var docs = [];
  for(var i = 0; i < count; i++)
    docs.push({small:123});
  load.insert(docs);
  
  assertTrue(load.find().length() >= count);
  assertEqual(load.find().limit(50).length(), 50);
  
  load.drop();
}

var mon = require('mongodb');
var m = new mon.Mongo(null, null, "test");
*/
