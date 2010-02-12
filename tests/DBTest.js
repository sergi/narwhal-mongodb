var MongoDB = require("mongodb");
var assert = require('test/assert.js');

var DB = new MongoDB.Mongo().getDB( "dbbasetest" );

exports.testCreateCollection = function() {
    DB.getCollection("foo1").drop();
    DB.getCollection("foo2").drop();
    DB.getCollection("foo3").drop();
    DB.getCollection("foo4").drop();

    var c = DB.createCollection("foo1", { "capped": false });

    c = DB.createCollection("foo2", { "capped": true, "size": 100 });
    for (var i = 0; i < 30; i++) c.insert({ "x": i });

    assert.isTrue(c.find().count() < 10);

    c = DB.createCollection("foo3", {
            "capped": true,
            "size": 1000,
            "max": 2
        });

    for (var i=0; i<30; i++) c.insert({ "x": i });
    assert.eq(c.find().count(), 2);

    try {
        DB.createCollection("foo4", { "capped": true, "size": -20 }); // Invalid size
    } catch(e) {
        return;
    }
    assert.eq(0, 1);
}

if (require.main == module.id)
    require("os").exit(require("test/runner").run(exports));
