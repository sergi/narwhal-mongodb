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
        return this._db.command(new BasicDBObject(cmd));
    },
    createCollection: function(name, obj) {
        return new Collection(
            this._db.createCollection(name, new BasicDBObject(obj)), this);
    },
    dropDatabase: function() {
        this._db.dropDatabase();
    },
    getCollection: function(name) {
        return new Collection(this._db.getCollection(name), this);
    },
    getCollectionFromFull: function(fullNameSpace) {
        return this._db.getCollectionFromFull(fullNameSpace, this);
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


function Collection(collection, db) {
    if (!db)
        throw "A database argument is required.";
    this.collection = collection;
    this._db = db;
}

Collection.prototype = {
    _db: null,
    _dbCommand: function(cmd){
        return this._db.command(cmd);
    },
    _genIndexName: function(keys){
        var name = "";
        for (var k in keys) {
            if (name.length > 0)
                name += "_";
            name += k + "_";

            var v = keys[k];
            if (typeof v == "number")
                name += v;
        }
        return name;
    },
    _indexCache: null,
    _indexSpec: function(keys, options) {
        var ret = { ns : this.getFullName() , key : keys , name : this._genIndexName( keys ) };
        if (options) {
            var type = typeof(options);
            switch(type) {
                case("string"):
                    ret.name = options;
                    break;
                case("boolean"):
                    ret.unique = true;
                    break;
                case("object"):
                    if ( options.length ) {
                        var nb = 0;
                        for each(var option in options) {
                            if (typeof ( option ) == "string")
                                ret.name = option;
                            else if (typeof(option) == "boolean" && option === true) {
                                if (nb == 0)
                                    ret.unique = true;
                                if (nb == 1)
                                    ret.dropDups = true;
                                nb++;
                            }
                        }
                    }
                    else {
                        Util.extend(ret, options);
                    }
                    break;
                default:
                    throw "Can't handle: " + typeof(options) + "as an options argument.";
            }
        }
        return ret;
    },
    getFullName: function() {
        return this._db.getName()+"."+this.getName();
    },
    collection: null,
    count: function() {
    },
    drop: function() {
        this.resetIndexCache();
        this.collection.dropIndexes();
        this.collection.drop();
    },
    find: function() {
        var args = Array.prototype.slice.call(arguments)
                    .map(function(arg) {
                        return typeof arg == "object" ?
                        Util.createBDObject(arg) : arg;
                    });

        return new Cursor(this.collection.find.apply(this.collection, args));
    },
    findOne: function(obj) {
        var all;
        if (!obj && (parseInt((all = this.find()).count()) === 1))
            return all.next();

        var dbo = obj;
        if (obj && typeof(obj) != "object")
            dbo = { "_id": obj };

        var sm = this.collection.findOne(Util.createBDObject(dbo), Util.createBDObject(arguments[1]));
        if (sm) {
            var jsObj = {__proto__: null},
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
    /**
     * Using the JavaScript way instead of the Java method because the latter
     * automatically converts a numeric value into float and writes the name
     * of the index using the float instead of an integer. This obviously makes
     * comparisons fail in JavaScript
     */
    ensureIndex: function(keys, options){
        var name = this._indexSpec(keys, options).name;
        this._indexCache = this._indexCache || {};
        if (this._indexCache[name])
            return;

        this.createIndex(keys, options);
        if (this._db.getLastError() == "")
            this._indexCache[name] = true;
    },
    ensureIDIndex: function() {
        this.collection.ensureIDIndex();
    },
    dropIndexes: function() {
        this.collection.dropIndexes();
    },
    createIndex: function(keys , options){
        this._db.getCollection("system.indexes")
            .insert(this._indexSpec(keys, options) ,true);
    },
    dropIndex:  function(index) {
        if (typeof(index) == "object")
            index = this._genIndexName(index);

        var res = this._dbCommand({deleteIndexes: this.getName(), index: index});
        this.resetIndexCache();
        return res;
    },
    getIndexInfo: function() {
        return this.collection.getIndexInfo() || {};
    },
    insert: function(docs) {
        var insertable = docs.isArray && docs.isArray() ?
                         docs.map(Util.createBDObject) : Util.createBDObject(docs);

        this.collection.insert(insertable);
    },
    resetIndexCache: function() {
        this._indexCache = {};
        this.collection.resetIndexCache();
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
    curr: function() {
        return this.cursor.curr();
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

