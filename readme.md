CommonJS driver for Mongo database
===========

narwhal-mongodb is a CommonJS JavaScript driver for the Mongo database. It wraps the official Java driver and emulates its behavior, while adding some JavaScript sugar and convenience methods.

This Java wrapper will always be there and will be updated with every new release of the driver, but the plan is to slowly transition from wrapping the Java implementation to a full-fledged native and independent CommonJS implementation.

### Source & Download:

* [http://github.com/mrclash/narwhal-mongodb](http://github.com/mrclash/narwhal-mongodb)


### Mongo Homepage:

* [http://www.mongodb.org/](http://www.mongodb.org/)

### Mongo Java driver source

* [http://github.com/mongodb/mongo-java-driver/](http://github.com/mongodb/mongo-java-driver)


Example usage
------------------------

    var MongoDB = require("mongodb");
    var db = new MongoDB.Mongo().getDB("mydb");

    var colls = db.getCollectionNames();
    colls.forEach(function(el) { print(el); });

    var coll = db.getCollection("testCollection");
    coll.drop();

    var doc = {
       "name" : "MongoDB",
       "type" : "database",
       "count" : 1,
       "info" : {
                   x : 203,
                   y : 102
                 }
    }

    coll.insert(doc)
    myDoc = coll.findOne();
    print(myDoc);

    // Now, lets add lots of little documents to the collection so we can explore queries and cursors
    for (var i=0; i < 100; i++) {
        coll.insert({"i": i});
    }

    print(coll.getCount());

    // Let's get all the documents in the collection and print them out

    var cur = coll.find();
    while(cur.hasNext()) {
        print(cur.next());
    }

    // Now use a query to get 1 document out

    var query = { i: 71 };
    cur = coll.find(query);

    while(cur.hasNext())
        print(cur.next());

    // Now use a query to get a larger set

    query = { "i": { "$gt": 50 } };  // i.e. find all where i > 50
    cur = coll.find(query);

    while(cur.hasNext())
        print(cur.next());
