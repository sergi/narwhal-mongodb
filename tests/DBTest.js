var MongoDB = require("mongodb");
var assert = require('test/assert.js');
var _db = new MongoDB.Mongo( "localhost" ).getDB( "dbbasetest" );

exports.testCreateCollection = function() {
    _db.getCollection( "foo1" ).drop();
    _db.getCollection( "foo2" ).drop();
    _db.getCollection( "foo3" ).drop();
    _db.getCollection( "foo4" ).drop();

    var o1 = { "capped": false };
    var c = _db.createCollection("foo1", o1);

    /*var o2 = BasicDBObjectBuilder.start().add("capped", true)
        .add("size", 100).get();*/
    var o2 = { "capped": true, "size": 100 }
    c = _db.createCollection("foo2", o2);
    for (var i=0; i<30; i++) {
        c.insert({"x": i});
    }
    assert.isTrue(c.find().count() < 10);

    var o3 = { "capped": true, "size": 1000, "max": 2 }
    c = _db.createCollection("foo3", o3);
    for (var i=0; i<30; i++) {
        c.insert({"x": i});
    }
    assert.isEqual(c.find().count(), 2);

    try {
        var o4 = { "capped": true, "size": -20 }
        c = _db.createCollection("foo4", o4);
    }
    catch(e) {
        return;
    }
    assert.isEqual(0, 1);
}

if (require.main === module.id)
    require("os").exit(require("test/runner").run(exports));
