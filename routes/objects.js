'use strict';

//var mongoose = require('mongoose'); //mongo connection

module.exports = function (omo) {
    return {
        /**
         * Find object by id
         */
        oneobj: function(req, res, next) {
            console.log("One-Object Id: " + req.id);
            omo.load(req.id, function (err, obj) {
                if (err) {
                    console.log('GET Error: There was a problem retrieving: ' + err);
                } else {
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
console.log("JSON Format");
                            // res.render('obs/show.html', {
                            //     "objdob" : objdob,
                            //     "obj" : obj
                            // });
                            res.json({
                                "objdob" : objdob,
                                "obj" : obj
                            });
                        }
                    });
                }
            });
        },
        all: function(req, res, next) {
          omo.find({}, function (err, obs) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                    html: function(){
                         res.render('obs/indexA.html', {
                               title: 'All my Objects!',
                               obs: obs
                          });
                    },
                    json: function(){
                        res.json(obs);
                    }
                  });
              }     
          });
        },
        post: function(req, res) {
          // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
            var name = req.body.name;
            var badge = req.body.badge;
            var dob = req.body.dob;
            var company = req.body.company;
            var isloved = req.body.isloved;
            console.log('POST - Request-original URL: ', req.originalUrl);
            //call the create function for our database
            omo.create({
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
        }
    }
}