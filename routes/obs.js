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


//build the REST operations at the base for Objects
//this will be accessible from http://127.0.0.1:3000/obs if the default route for / is left unchanged
router.route('/')
    //GET all Objects
    .get(function(req, res, next) {
        console.log('GET - Request-original URL: ', req.originalUrl);
        //retrieve all Objects from Monogo
        mongoose.model('Obj').find({}, function (err, obs) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/obs folder. We are also setting "obs" to be an accessible variable in our jade view
                    html: function(){
         //html = new EJS({url: '/obs/index.ejs'}).render(obs);
         console.log ('html');
                         res.render('obs/index.ejs', {
                               title: 'All my Objects',
                               obs: obs
                          });
                    },
                    //JSON response will show all obs in JSON format
                    json: function(){
         console.log ('json');
                        res.json(obs);
         console.log ('json 2');
                    }
                });
              }     
        });
    })
    //POST a new Object
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var name = req.body.name;
        var badge = req.body.badge;
        var dob = req.body.dob;
        var company = req.body.company;
        var isloved = req.body.isloved;
        console.log('POST - Request-original URL: ', req.originalUrl);
        console.log('Body: ',req.body);
        //call the create function for our database
        mongoose.model('Obj').create({
            name : name,
            badge : badge,
            dob : dob,
            isloved : isloved
        }, function (err, obj) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //Object has been created
                  console.log('POST creating new Object: ' + obj);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("obs");
                        // And forward to success page
                        res.redirect("/obs");
                    },
                    //JSON response will show the newly created Object
                    json: function(){
                        res.json(obj);
                    }
                });
              }
        })
    });

    /* GET New Object page. */
    router.get('/new', function(req, res) {
      console.log('GET /new - Request-original URL: ', req.originalUrl);
      res.render('obs/new', { title: 'Add New Object' });
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
  .get(function(req, res) {
    console.log('route GET /:id - Request-original URL: ', req.originalUrl);
    mongoose.model('Obj').findById(req.id, function (err, obj) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + obj._id);
        var objdob = obj.dob.toISOString();
        objdob = objdob.substring(0, objdob.indexOf('T'))
        res.format({
          html: function(){
              res.render('obs/show', {
                "objdob" : objdob,
                "obj" : obj
              });
          },
          json: function(){
              res.json(obj);
          }
        });
      }
    });
  });

  //GET the individual obj by Mongo ID
router.get('/:id/edit', function(req, res) {
    console.log('route GET /:id/edit - Request-original URL: ', req.originalUrl);
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
                       res.json(obj);
                 }
            });
        }
    });
});

//PUT to update a obj by ID
router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var name = req.body.name;
    var badge = req.body.badge;
    var dob = req.body.dob;
    var company = req.body.company;
    var isloved = req.body.isloved;

   //find the document by ID
        mongoose.model('Obj').findById(req.id, function (err, obj) {
            //update it
            obj.update({
                name : name,
                badge : badge,
                dob : dob,
                isloved : isloved
            }, function (err, objID) {
              if (err) {
                  res.send("There was a problem updating the information to the database: " + err);
              } 
              else {
                      //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                      res.format({
                          html: function(){
                               res.redirect("/obs/" + obj._id);
                         },
                         //JSON responds showing the updated values
                        json: function(){
                               res.json(obj);
                         }
                      });
               }
            })
        });
});

//DELETE a obj by ID
router.delete('/:id/edit', function (req, res){
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
