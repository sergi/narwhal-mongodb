
Javascript driver for Mongo database
===========

narwhal-mongodb is a CommonJS-compliant JavaScript driver for the Mongo database. It wraps the official Java driver and emulates its behavior, while adding some JavaScript sugar and convenience methods.

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


