var MongoSupport = {
    ensureStringId: function(o) {
        if(!typeof o['_id'] == "string")
            o['_id'] = o['_id'].toString();
        return o;
    },
    createBDObject: function(obj) {
        return obj ? new Packages.com.mongodb.BasicDBObject(obj)
                   : new Packages.com.mongodb.BasicDBObject();
    },
    extend: function( dst , src , deep ) {
        for (var k in src){
            var v = src[k];
            if (deep && typeof(v) == "object")
                v = MongoSupport.extend(typeof(v.length) == "number" ? [] : {} , v , true);
            dst[k] = v;
        }
        return dst;
    }
}

if (typeof exports != "undefined")
    exports.MongoSupport = MongoSupport;
