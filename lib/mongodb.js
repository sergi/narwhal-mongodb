var Util = require("mongosupport").MongoSupport;
var BasicDBObject = Packages.com.mongodb.BasicDBObject;


function Mongo(host, port) {
    this.host = host || 'localhost';
    this.port = port || 27017;
    this._mongo = new Packages.com.mongodb.Mongo(this.host, this.port);
}

Mongo.prototype = {
    _mongo: null,
    dropDatabase: function(dbName) {
        this._mongo.dropDatabase(dbName);
    },
    getDatabaseNames: function() {
        return this._mongo.getDatabaseNames().toArray();
    },
    getDB: function(db) {
        return new MongoDB(this._mongo.getDB(db));
    }
}


function MongoDB(db) {
    this._db = db;
}

MongoDB.prototype = {
    _db: null,
    host: null,
    port: null,

    addUser: function(username, password) {
        this._db.addUser(username, pasword);
    },
    authenticate: function(username, password) {
        return this._db.authenticate(username, password);
    },
    command: function(cmd) {
        return this._db.command(cmd);
    },
    createCollection: function(name, obj) {
        return new Collection(
            this._db.createCollection(name, new BasicDBObject(obj)));
    },
    dropDatabase: function() {
        this._db.dropDatabase();
    },
    getCollection: function(name) {
        return new Collection(this._db.getCollection(name));
    },
    getCollectionFromFull: function(fullNameSpace) {
        return this._db.getCollectionFromFull(fullNameSpace);
    },
    getCollectionNames: function() {
        return this._db.getCollectionNames().toArray().slice();
    },
    getName: function() {
        return this._db.getName();
    },
    eval: function(code, args) {
        return this._db.eval(code, args) || {};
    },
    getLastError: function() {
        return this._db.lastError || {};
    },
    toString: function() {
        this.getName();
    }
}

if (typeof exports != "undefined")
    exports.Mongo = Mongo;


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
        var dbo = Util.createBDObject(obj);
        return new Cursor(this.collection.find(dbo));
    },

    findOne: function(obj) {
        var dbo = obj;
        if (obj && typeof(obj) != "object")
            dbo = { "_id": obj };

        var sm = this.collection.findOne(Util.createBDObject(dbo), Util.createBDObject(arguments[1]));
        if (sm) {
            var jsObj = { __proto__: null},
                smKeySet = sm.keySet().toArray();
            for each(var i in smKeySet)
                jsObj[i] = sm.get(i);
            return jsObj;
        } else
            return null;
    },

    save: function(obj) {
        var dbo = Util.createBDObject(obj);
        var sm = this.collection.save(dbo) || {};
        return Util.ensureStringId(sm);
    },

    getName: function() {
       return this.collection.getName();
    },

    getCount: function() {
       return this.collection.getCount();
    },

    ensureIndex: function(obj) {
        this.collection.ensureIndex(Util.createBDObject(obj));
    },

    ensureIDIndex: function() {
        this.collection.ensureIDIndex();
    },

    dropIndexes: function() {
        this.collection.dropIndexes();
    },

    dropIndex: function(obj) {
        this.collection.dropIndex(Util.createBDObject(obj));
    },

    getIndexInfo: function() {
        return this.collection.getIndexInfo() || {};
    },

    insert: function(docs) {
        var insertable = docs.isArray && docs.isArray() ?
                        docs.map(createBDO) : Util.createBDObject(docs);

        return this.collection.insert(insertable).length;
    }
}

if (typeof exports != "undefined")
    exports.Collection = Collection;


function Cursor(cursor) {
    this.cursor = cursor;
}

Cursor.prototype = {
    cursor: null,
    hasNext: function() {
        return this.cursor.hasNext();
    },
    next: function() {
        var sm = this.cursor.next() || {};
        return Util.ensureStringId(sm);
    },
    limit: function(lim) {
        return new Cursor(this.cursor.limit(lim));
    },
    skip: function(num) {
        return new Cursor(this.cursor.skip(num));
    },
    sort: function(obj) {
        return new Cursor(this.cursor.sort(Util.createBDObject(obj)));
    },
    count: function() {
        return this.cursor.count();
    },
    length: function() {
        return this.cursor.length();
    },
    explain: function() {
        return this.cursor.explain() || {};
    },
    toArray: function() {
        var obj = this.cursor.copy().toArray().toArray();
        return obj.map(function(el) { return Util.ensureStringId(el) }).slice();
    },
    snapshot: function() {
        this.cursor.snapshot();
        return this;
    },
    itcount: function() {
        return this.cursor.itcount();
    },
    batchSize: function(num) {
        return new Cursor(this.cursor.batchSize(num));
    },
    getSizes: function() {
        return this.cursor.getSizes().toArray().slice();
    },
    numGetMores: function() {
        return this.cursor.numGetMores();
    }
}

if (typeof exports != "undefined")
    exports.Cursor = Cursor;

