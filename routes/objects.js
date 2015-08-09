'use strict';

//var mongoose = require('mongoose'); //mongo connection

module.exports = function (omo) {
    return {
        /**
         * Find object by id
         */
        oneobj: function(req, res, next) {
            console.log("One-Object Id: " + req.id);

            //omo.load(req.id, function (err, obj) {
            omo.findOne({_id: req.id}, function (err, obj) {
                if (err) {
                    console.log('GET Error: There was a problem retrieving: ' + err);
                } else {

                    try {
                        var objdob = obj.dob.toISOString();
                        objdob = objdob.substring(0, objdob.indexOf('T'))
                    } catch(e) {
                        var message = e.message;
                        console.log(e.message);                        
                    }    
                    res.format({
                        html: function(){
                            res.render('obs/show', {
                                "objdob" : objdob,
                                "obj" : obj,
                                "error" : message
                            });
                        },
                        json: function(){
                            console.log("JSON Format");
                            res.json({
                                "obj" : obj,
                                "message" : "Single object found"
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
console.log("Returning all Objects")
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
            var updObj = omo.fill(req);   
            omo.create(updObj.contentObj, function (err, obj) {
                if (err) {
                    res.send("There was a problem adding the information to the database.");
                } else {
                    //Object has been created
                    console.log('POST creating new Object: ' + obj);
                    var message = "New Object created";
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
                            res.json({
                                "obj" : obj,
                                "message" : "Hallo"
                            });
                        }
                    });
                }
            })
        },
        update: function(req, res) {
            var updObj = omo.fill(req);   
            omo.findById(updObj._id, function (err, obj) {
                console.log(updObj);
                obj.update(updObj.contentObj, function (err, objID) {
                    if (err) {
                        res.send("There was a problem updating the information to the database: " + err);
                    } else {
                        //HTML responds by going back to show the object 
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
        }

    }  
}