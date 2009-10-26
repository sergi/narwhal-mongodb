var MongoDB = require("mongodb");
var assert = require('test/assert.js');
var Util = require('Util.js');

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

    print(typeof(obj));
    assert.isEqual(123, obj["_id"], "2");
    assert.isEqual(2, obj["x"], "3");
    assert.isEqual(2, obj["z"], "4");

    obj = c.findOne(123, { "x": 1 });
    assert.isEqual(123, obj["_id"], "5");
    assert.isEqual(2, obj["x"], "6");
    assert.isEqual(false, Util.has(obj, "z"), "7");

    obj = c.findOne({"x": 1});
    assert.isEqual(1, obj["x"], "8");
    assert.isEqual(2, obj["y"], "9");

    obj = c.findOne({"x": 1}, {"y": 1});
    assert.isEqual(false, Util.has(obj, "x"), "10");
    assert.isEqual(2, obj["y"], "11");
}

if (require.main === module.id)
    require("os").exit(require("test/runner").run(exports));
