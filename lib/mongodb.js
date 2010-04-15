var Support = require("mongosupport").MongoSupport;
var BasicDBObject = Packages.com.mongodb.BasicDBObject;
var Cursor = require("cursor").Cursor;
var Collection = require("collection").Collection;


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

    var self = this;
    this.javaMethods.forEach(function (m) {
        self[m] = function() {
                if (arguments[0])
                    return db[m](arguments);
                else
                    // If there are no arguments we can't pass null, because it
                    // is considered an object and doesn't translate properly
                    // in Java...
                    return db[m]();
            }
    });
}

MongoDB.prototype = {
    _db: null,
    host: null,
    port: null,
    javaMethods: [
        "addUser",
        "authenticate",
        "dropDatabase",
        "getName"
    ],

    command: function(cmd) {
        return this._db.command(new BasicDBObject(cmd));
    },
    createCollection: function(name, obj) {
        return new Collection(
            this._db.createCollection(name, new BasicDBObject(obj)), this);
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


