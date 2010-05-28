var MongoDB = require("mongodb");
var assert = require('test/assert.js');
var Util = require('util.js');
var Support = require("mongosupport").MongoSupport;

var _db = new MongoDB.Mongo( "localhost" ).getDB( "dbbasetest" );

exports.testCreateCollection = function() {
    var c = _db.getCollection("test");
    c.drop();

    var obj = c.findOne();
    assert.isEqual(null, obj, "1");

    var inserted = { "x":1, "y":2 };
    c.insert(inserted);
    c.insert({"_id": 123, "x": 2, "z": 2});
    obj = c.findOne(123);
    assert.isEqual("123", obj["_id"], "2");
    assert.isEqual(2, obj["x"], "3");
    assert.isEqual(2, obj["z"], "4");

    obj = c.findOne(123, { "x": 2 });
    assert.isEqual("123", obj["_id"], "5");
    assert.isEqual(2, obj["x"], "6");
    assert.isTrue(Util.has(obj, "z"), "7");

    obj = c.findOne({"x": 1});
    assert.isEqual(1, obj["x"], "8");
    assert.isEqual(2, obj["y"], "9");

    obj = c.findOne(null, {"x": 1, "y": 1});
    assert.isEqual(false, Util.has(obj, "x"), "10");
    assert.isEqual(2, obj["y"], "11");
}

exports.testDropIndex = function() {
    var c = _db.getCollection( "dropindex1" );
    c.drop();

    c.save( {"x": 1 });
    assert.isEqual( 1 , c.getIndexInfo().size(), "11");
    c.ensureIndex( {"x": 1} );
    assert.isEqual( 2 , c.getIndexInfo().size(), "12");
    c.dropIndexes();
    assert.isEqual( 1 , c.getIndexInfo().size(), "13");
    c.ensureIndex( {"x": 1} )   ;
    assert.isEqual( 2 , c.getIndexInfo().size(), "14");
    c.ensureIndex( {"y": 1} );
    assert.isEqual( 3 , c.getIndexInfo().size(), "15");
    c.dropIndex( {"x": 1} );
    assert.isEqual( 2 , c.getIndexInfo().size(), "16");
}
exports.testSave = function() {
    var c = _db.getCollection( "test" );
    c.drop();
    var insertable = {"hello": "world"};
    c.save(insertable);
    var id = insertable._id.toString();
    var doc = c.findOne();
    var docId = doc._id.toString();
    assert.isTrue(docId == id, "17");
    assert.isTrue(Packages.com.mongodb.ObjectId.isValid(id));
}
exports.testRemove = function() {
    var c = _db.getCollection( "test" );
    c.drop();

    c.insert({"_id": 123, "x": 100});
    var obj = (c.findOne());
    assert.isTrue(obj != null, "18");
    c.remove({"x": 100});
    obj = c.findOne();
    assert.isTrue(obj == null, "19");
}

if (require.main == module.id)
    require("os").exit(require("test/runner").run(exports));
