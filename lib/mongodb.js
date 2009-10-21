var BasicDBObject = Packages.com.mongodb.BasicDBObject;
var MongoJava = Packages.com.mongodb.Mongo;

/**
 * @namespace {Mongo}
 * @example
 * 
 * Mongo
 * ================
 * Docs coming soon.
 */
function Mongo(dbname, host, port) {
    //if(_dbs[dbname] != undefined)
    //return _dbs[dbname]; // TODO: check if port or address is different as well
    
    this.host = host || 'localhost';
    this.port = port || 27017;
    this.db = new MongoJava(this.host, this.port).getDB(dbname);
    //_dbs[dbname] = this;
}

Mongo.prototype = {
    db: null,
    host: null,
    port: null,
    /*get name: function() {
        return this.db.name;
    },*/
    ///
    runCommand: function(obj) {
        if (typeof(obj) == "string" ) {
            var n = {};
            n[obj] = 1;
            obj = n;
        }
        return this.getCollection("$cmd").findOne(obj);
    },
    _dbCommand: this.runCommand,
    ///
    auth: function(username, pass) {
    },
    coll: function(name) {
        return new Collection(this.db.getCollection(name));
    },
    getCollection: function(name) {
        return this.coll(name);
    },
    getName: function() {
        return this.db.name;
    },
    getCollectionNames: function() {
        return this.db.collectionNames.toArray();
    },
    dropDatabase: function() {
        this.db.dropDatabase();
    },
    authenticate: function(username, password) {
        return this.db.authenticate(username, password);
    },
    getName: function() {
        return this.db.name();
    },
    /*
    this.eval = function(fun) {
    // TODO - what should the 2nd arg to eval consist of?
    return new ScriptableMap(db.eval(fun, {}) || {});
    }*/
    getLastError: function() {
        return this.db.lastError || {};
    }
}

if (typeof exports != "undefined")
    exports.Mongo = Mongo;

/*
  we usually want to be able to access the object ID as a string,
  certainly if we're ever serializing things to JSON, but maybe
  there's a better way to alter the JSON serialization to account
  for this so we don't do it all the time?
*/
function checkforObjectId(o) {
  if(! typeof o['_id'] == "string")
    o['_id'] = o['_id'].toString();
  return o;
}

/*
  Light wrapper around com.mongodb.DBCollection
  - mostly pass calls through, but translate between
  maps/arrays <-> JS objects where appropriate.
*/
function Collection(collection) {
    this.collection = collection;
}

Collection.prototype = {
    collection: null,
    count: function() {
    },
    drop: function() {
        this.collection.dropIndexes();
        this.collection.drop();
    },

    find: function(obj) {
        var dbo = new BasicDBObject(obj ? obj : null);
        return new Cursor(this.collection.find(dbo));
    },

    findOne: function(obj) {
        var dbo = obj ? new BasicDBObject(obj) : new BasicDBObject();
        var sm = this.collection.findOne(dbo) || {};
        return checkforObjectId(sm);
    },

    save: function(obj) {
        var dbo = new BasicDBObject(obj ? obj : null);
        var sm = this.collection.save(dbo) || {};
        return checkforObjectId(sm);
    },

    getName: function() {
       return this.collection.getName();
    },

    ensureIndex: function(obj) {
        var dbo = (obj) ? new BasicDBObject(obj) : new BasicDBObject();
        this.collection.ensureIndex(dbo);
    },
    
    ensureIDIndex: function() {
        this.collection.ensureIDIndex();
    },
    
    getIndexInfo: function() {
        return new ScriptableList(this.collection.getIndexInfo() || {});
    },
    
    insert: function(docs) {
        var toinsert = docs.map(function(d) {
                return d ? new BasicDBObject(d) : new BasicDBObject();
        });
        
        // TODO - this claims to return List<DBObject> but doesn't seem like it does
        // just return the length inserted for now
        return this.collection.insert(toinsert).length;
        // var rv = [];
        // for(d in inserted) {
        //   for(e in d)
        //     log.info("inserted: " + e);
        //   // rv.push(new ScriptableMap(checkforObjectId(d) || {}));
        // }
        // return rv;
    }
}

/*
  Light wrapper around com.mongodb.DBCursor
  - mostly pass calls through, but translate between
  maps/arrays <-> JS objects where appropriate.
*/
function Cursor(cursor) {
    this.cursor = cursor;
}

Cursor.prototype = {
  
  hasNext: function() {
    return cursor.hasNext();
  },
  
  next: function() {
    var sm = new ScriptableMap(cursor.next() || {});
    return checkforObjectId(sm);
  },
  
  limit: function(lim) {
    return new Cursor(cursor.limit(lim));
  },
  
  skip: function(num) {
    return new Cursor(cursor.skip(num));
  },
  
  sort: function(obj) {
    var dbo = (obj) ? new BasicDBObject(obj) : new BasicDBObject();
    return new Cursor(cursor.sort(dbo));
  },
  
  count: function() {
    return cursor.count();
  },
  
  length: function() {
    return cursor.length();
  },
  
  explain: function() {
    return new ScriptableMap(checkforObjectId(cursor.explain()) || {});
  },
  
  toArray: function() {
    var list = new ScriptableList(cursor.toArray());
    return list.map( function(doc) {
      return checkforObjectId(doc);
    });
  },
}

if (typeof exports != "undefined")
    exports.Mongo = Mongo;
