var MongoSupport = {
    toJSArray: function(javaArray) {
        var jsArray = [];
        for (var i = 0, length = javaArray.length; i < length ; i++)
            jsArray.push(javaArray[i]);

        return jsArray;
    },
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
