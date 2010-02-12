var MongoDB = require("mongodb");
var db = new MongoDB.Mongo( "localhost" ).getDB( "mydb" );

(function() {
    (db.getCollectionNames())
        .forEach(function(el) { print(el); });

    print(" --- ");

    var coll = db.getCollection("test1");

    coll.drop();

    var doc = {
        name: "MongoDB",
        type: "database",
        count: 1,
        info: {
            x: 203,
            y: 102
        }
    };

    coll.insert(doc)

    //get it (since it's the only one in there since we dropped the rest earlier on)
    print(coll.findOne());
    print(" --- ");

    //now, lets add lots of little documents to the collection so we can explore queries and cursors
    for (var i = 0; i < 100; i++)
        coll.insert({ "i": i });

    print(coll.getCount());
    print(" --- ");

    //lets get all the documents in the collection and print them out
    var cur = coll.find();

    while (cur.hasNext())
        print(cur.next());

    print(" --- ");

    // now use a query to get 1 document out
    var query = { i: 71 };
    cur = coll.find(query);

    while(cur.hasNext())
        print(cur.next());

    print(" --- ");

    // now use a query to get a larger set
    query = { "i": {"$gt": 50} };  // i.e. find all where i > 50
    cur = coll.find(query);

    while(cur.hasNext())
        print(cur.next());

    print(" --- ");

    query = { "i": { "$gt": 20, "$lte": 30} };  // i.e.   20 < i <= 30
    cur = coll.find(query);

    while(cur.hasNext())
        print(cur.next());
})();
