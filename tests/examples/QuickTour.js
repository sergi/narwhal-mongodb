var MongoDB = require("mongodb");
var $ = require("util");

var QuickTour = function() {
    var m = new MongoDB.Mongo();
    var db = m.getDB("mydb");

    var colls = db.getCollectionNames();

    colls.forEach(function(el) { print(el); });
    print(" --- ");

    var coll = db.getCollection("testCollection");

    coll.drop();

    var doc = {
        name: "MongoDB",
        type: "database",
        count: 1
    };

    var info = {
        x: 203,
        y: 102
    }

    doc.info = info;
    coll.insert(doc)

    /*
     *  get it (since it's the only one in there since we dropped the rest earlier on)
     */
     myDoc = coll.findOne();

     print(myDoc);

     /*
     * now, lets add lots of little documents to the collection so we can explore queries and cursors
     */

    print(" --- ");

    for (var i=0; i < 100; i++) {
        coll.insert({"i": i});
    }

    print(coll.getCount());

    /*
     *  lets get all the documents in the collection and print them out
     */

    print(" --- ");

    var cur = coll.find();

    while(cur.hasNext()) {
        print(cur.next());
    }

    /*
     *  now use a query to get 1 document out
     */

    print(" --- ");

    var query = {i: 71};

    cur = coll.find(query);

    while(cur.hasNext())
        print(cur.next());

    /*
     *  now use a query to get a larger set
     */

    print(" --- ");

    query = { "i": {"$gt": 50} };  // i.e. find all where i > 50

    cur = coll.find(query);

    while(cur.hasNext())
        print(cur.next());

    print(" --- ");

    query = { "i": { "$gt": 20, "$lte": 30} };  // i.e.   20 < i <= 30

    cur = coll.find(query);

    while(cur.hasNext())
        print(cur.next());
}
QuickTour();
