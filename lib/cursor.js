var Support = require("mongosupport").MongoSupport;

function Cursor(cursor) {
    this.cursor = cursor;
    var self = this;
    this.javaMethods.forEach(function (m) {
        self[m] = function() {
                if (arguments[0])
                    return cursor[m](arguments);
                else
                    // If there are no arguments we can't pass null, because it
                    // is considered an object and doesn't translate properly
                    // in Java...
                    return cursor[m]();
            }
    });
}

Cursor.prototype = {
    javaMethods: [
        "hasNext",
        "count",
        "curr",
        "length",
        "itcount",
        "numGetMores"
    ],
    cursor: null,
    next: function() {
        var sm = this.cursor.next() || {};
        return Support.ensureStringId(sm);
    },
    limit: function(lim) {
        return new Cursor(this.cursor.limit(lim));
    },
    skip: function(num) {
        return new Cursor(this.cursor.skip(num));
    },
    sort: function(obj) {
        return new Cursor(this.cursor.sort(Support.createBDObject(obj)));
    },
    explain: function() {
        return this.cursor.explain() || {};
    },
    toArray: function() {
        var obj = this.cursor.copy().toArray().toArray();
        return obj.map(function(el) { return Support.ensureStringId(el) }).slice();
    },
    snapshot: function() {
        this.cursor.snapshot();
        return this;
    },
    batchSize: function(num) {
        return new Cursor(this.cursor.batchSize(num));
    },
    getSizes: function() {
        return this.cursor.getSizes().toArray().slice();
    },
}

if (typeof exports != "undefined")
    exports.Cursor = Cursor;

