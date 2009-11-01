var MongoDB = require("mongodb");
var assert = require('test/assert.js');
var Util = require('Util.js');

var _db = new MongoDB.Mongo( "localhost" ).getDB("cursortest");

exports.testCount = function() {
    var c = _db.getCollection("test");
    c.drop();
    assert.isEqual(0, c.find().count());
    c.insert({"x": "foo"});
    assert.isEqual(1, c.find().count());
}

exports.testSnapshot = function() {
    var c = _db.getCollection("snapshot1");
    c.drop();
    for ( var i=0; i<100; i++ )
        c.save({ "x": i });
    assert.isEqual( 100 , c.find().count() );
    assert.isEqual( 100 , c.find().toArray().length );
    assert.isEqual( 100 , c.find().snapshot().count() );
    assert.isEqual( 100 , c.find().snapshot().toArray().length );
    assert.isEqual( 100 , c.find().snapshot().limit(50).count() );
    assert.isEqual( 50 , c.find().snapshot().limit(50).toArray().length );
}

exports.testBig = function() {
    var c = _db.getCollection("big1");
    c.drop();

    var bigString = "";
    for ( var i=0; i<16000; i++ )
        bigString += "x";

    var numToInsert = Math.ceil(( 15 * 1024 * 1024 ) / bigString.length);

    for ( var i=0; i<numToInsert; i++ )
        c.save({"x": i, "s": bigString});

    assert.isTrue( 800 < numToInsert, "1");
    assert.isEqual( c.find().count(), numToInsert, "2");
    assert.isEqual( c.find().toArray().length, numToInsert, "3");
    assert.isEqual( c.find().limit(800).count(), numToInsert, "4");
    assert.isEqual( 800 , c.find().limit(800).toArray().length, "5");

    var x = c.find().limit(-800).toArray().length;
    assert.isTrue( x < 800, "6");

    var a = c.find();
    assert.isEqual( numToInsert , a.itcount(), "7" );

    var b = c.find().batchSize( 10 );
    assert.isEqual( numToInsert , b.itcount(), "8" );
    assert.isEqual( 10 , b.getSizes()[0], "9" );

    assert.isTrue( a.numGetMores() < b.numGetMores(), "10" );
    assert.isEqual( numToInsert , c.find().batchSize(2).toArray().slice().length, "11" );
    assert.isEqual( numToInsert , c.find().batchSize(1).toArray().slice().length, "12" );

    assert.isEqual( numToInsert , _count( c.find( null , null , 0 , 5 ) ), "13" );
    assert.isEqual( 5 , _count( c.find( null , null , 0 , -5 ) ), "14" );
}

var _count = function(i) {
    var c = 0;
    while (i.hasNext()){
        i.next();
        c++;
    }
    return c;
}

exports.testExplain = function() {
    var c = _db.getCollection( "explain1" );
    c.drop();

    for ( var i=0; i<100; i++ )
        c.save({"x": i });

    var q = {"x" : {"$gt": 50 }};

    assert.isEqual( 49, c.find(q).count(), "1" );
    assert.isEqual( 49, c.find(q).toArray().length, "2" );
    assert.isEqual( 49, c.find(q).itcount(), "3" );
    assert.isEqual( 20, c.find(q).limit(20).itcount(), "4" );

    c.ensureIndex({"x": 1 });

    assert.isEqual( 49, c.find(q).count(), "5" );
    assert.isEqual( 49, c.find(q).toArray().length, "6" );
    assert.isEqual( 49, c.find(q).itcount(), "7" );
    assert.isEqual( 20, c.find(q).limit(20).itcount(), "8" );
    assert.isEqual( 49, c.find(q).explain().get("n"), "9" ); // Not a JS object

    // these 2 are 'reersed' b/ e want the user case to make sense
    assert.isEqual( 20, c.find(q).limit(20).explain().get("n"), "10" );
    assert.isEqual( 49, c.find(q).limit(-20).explain().get("n"), "11 " );
}

if (require.main === module.id)
    require("os").exit(require("test/runner").run(exports));
