var mongoose = require('mongoose');  
var ObjSchema = new mongoose.Schema({  
  name: String,
  badge: Number,
  dob: { type: Date, default: Date.now },
  isloved: Boolean,
});


/**
 * Static Method to fill the form data into an object
 */
ObjSchema.statics.fill = function(req) {
	var retObj = {};
    var contentObj = {};
    
    for (var key in req.body){
 console.log("key:",key, "value: ",req.body[key] )
        if (key != "_id") {
            contentObj[key] = req.body[key]
        } else {
            retObj._id = req.body[key]
        }
    }
    retObj.contentObj = contentObj;
    return retObj
}	

/**
 * Static Method to load the one Object with the given Id
 */
ObjSchema.statics.load = function(id, cb) {
console.log("load - Wann kommt das???????????????????")
  this.findOne({
    _id: id
  }).exec(cb)
};
//console.log(JSON.stringify(ObjSchema));
mongoose.model('Obj', ObjSchema);