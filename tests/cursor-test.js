var MongoDB = require("mongodb");
var db = new MongoDB.Mongo("test", "localhost" , 27017);
var coll = db.getCollection("test") ;
var cur = coll.find();

while(cur.hasNext()) {
    print(cur.next());
}

print("$$$$ "+cur.explain());
