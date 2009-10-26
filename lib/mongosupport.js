var MongoSupport = {
    ensureStringId: function(o) {
        if(!typeof o['_id'] == "string")
            o['_id'] = o['_id'].toString();
        return o;
    },
    createBDObject: function(obj) {
        return obj ? new Packages.com.mongodb.BasicDBObject(obj)
                   : new Packages.com.mongodb.BasicDBObject();
    }
}

if (typeof exports != "undefined")
    exports.MongoSupport = MongoSupport;
