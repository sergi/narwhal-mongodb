var MongoSupport = {
    ensureId: function(o) {
        if (typeof o == "object") {
            if (o._id) {
                if (typeof o._id != "string")
                    o._id = o._id.toString();
            } else {
                o._id = this.createObjectId();
            }
        } else {
            o = { _id: o.toString() }
        }
        return o;
    },
    createBDObject: function(obj, ensureId) {
        var o = new Packages.com.mongodb.BasicDBObject(ensureId ? this.ensureId(obj || {}) : obj || {});
        return o
    },
    extend: function( dst , src , deep ) {
        for (var k in src){
            var v = src[k];
            if (deep && typeof(v) == "object")
                v = MongoSupport.extend(typeof(v.length) == "number" ? [] : {} , v , true);
            dst[k] = v;
        }
        return dst;
    },
    createObjectId: function(id) {
        var oid;
        var objectId = Packages.com.mongodb.ObjectId;

        if (!id)
            oid = new objectId();
        else if (objectId.isValid(id))
            oid = new objectId(id);
        else
            throw id + " is not a valid ObjectId.";

        return oid;
    }
}

if (typeof exports != "undefined")
    exports.MongoSupport = MongoSupport;
