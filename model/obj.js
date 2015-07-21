var mongoose = require('mongoose');  
var ObjSchema = new mongoose.Schema({  
  name: String,
  badge: Number,
  dob: { type: Date, default: Date.now },
  isloved: Boolean
});
/**
 * Static Method to load the one Object with the given Id
 */
ObjSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb)
};

mongoose.model('Obj', ObjSchema);