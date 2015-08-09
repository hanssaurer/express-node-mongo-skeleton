var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST
    //EJS = require('ejs');

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

var omo = mongoose.model('Obj');
var objects = require("./objects.js")(omo);
console.log(omo.schema.path('dob').instance);

//REST operations at the base for Objects
router.route('/')
       
    .get(objects.all)
    //POST a new Object
    .post(objects.post) 

    /* GET New Object page. */
    router.get('/new', function(req, res) {
      console.log('GET /new - Request-original URL: ', req.originalUrl);
      res.render('obs/edit.html', { title: 'Add New Object' });
    });

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    console.log('param validating ' + id + ' exists');
    console.log('Request-original URL: ', req.originalUrl);
    //find the ID in the Database
    mongoose.model('Obj').findById(id, function (err, obj) {
        //if it isn't found, we are going to respond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(400)
            var err = new Error('Bad Request');
            err.status = 400;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        } else if (!obj) {
            console.log('No Document Found with ID: ' + req.id);
            res.status(417)
            var err = new Error('Not Available');
            err.status = 417;
            res.format({
                html: function(){
                    console.log("Err created-html: " + err);
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            console.log(obj);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});

router.route('/:id')
    .get(objects.oneobj)

  //GET the individual obj by Mongo ID
router.get('/:id/edit', function(req, res) {
    console.log('route GET /:id/edit - Request-original URL: ', req.originalUrl + 'Id: ' + req.id);
    //search for the obj within Mongo
    mongoose.model('Obj').findById(req.id, function (err, obj) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else if (!obj) {
            console.log('No Document Found with ID: ' + req.id);
        } else {
            //Return the obj
            console.log('GET Retrieving Object: ' + obj);
            //format the date properly for the value to show correctly in our edit form
          var objdob = obj.dob.toISOString();
          objdob = objdob.substring(0, objdob.indexOf('T'))
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function(){
                       res.render('obs/edit', {
                          title: 'Object' + obj._id,
                        "objdob" : objdob,
                          "obj" : obj
                      });
                 },
                 //JSON response will return the JSON output
                json: function(){
            console.log("Edit JSON");
                       res.json(obj);
                }
            });
        }
    });
});


//PUT to update an obj by ID
router.put('/edit/:id', objects.update);

//DELETE an obj by ID
router.delete('/:id', function (req, res){
    //find obj by ID
    mongoose.model('Obj').findById(req.id, function (err, obj) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            obj.remove(function (err, obj) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + obj._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                               res.redirect("/obs");
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({message : 'deleted',
                                   item : obj
                               });
                         }
                      });
                }
            });
        }
    });
});

module.exports = router;
