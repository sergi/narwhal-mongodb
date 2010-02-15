var Util = require("mongosupport").MongoSupport;
var Cursor = require("cursor").Cursor;

function Collection(collection, db) {
    if (!db)
        throw "A database argument is required.";
    this.collection = collection;
    this._db = db;

    var self = this;
    this.javaMethods.forEach(function (m) {
        self[m] = function() {
                if (arguments[0])
                    return collection[m](arguments);
                else
                    // If there are no arguments we can't pass null, because it
                    // is considered an object and doesn't translate properly
                    // in Java...
                    return collection[m]();
            }
    });
}

Collection.prototype = {
    javaMethods: [
        "ensureIDIndex",
        "getName",
        "getCount",
        "dropIndexes",
    ],
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

