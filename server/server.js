var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var morgan = require('morgan');
var Promise = require('bluebird');

var app = express();
var server = http.Server(app);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
  next();
});

var pg = require('pg');

var Pg = Promise.promisifyAll(require('pg'))
Promise.promisifyAll(pg.Client.prototype)

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/test1';

var selectQueries = require('./db/queries/selectQueries.js'); 
var insertQueries = require('./db/queries/insertQueries.js');
var updateQueries = require('./db/queries/updateQueries.js');
var deleteQueries = require('./db/queries/deleteQueries.js');
var checkQueries = require('./db/queries/checkQueries.js');

var tables = require('./db/config.js');

pg.connect(connectionString, function (err, client, done) {
  if (err) console.log('Connection error: ', err);
  for (var i = 0; i < tables.length; i++) {
    client.query(tables[i]);
  }
  done();
});

var checkAndInsertIfNotExists = function (checkQuery, insertQuery, callback) {
  pg.connect(connectionString, function (err, client, done) {
    if (err) console.log('Connection error: ', err);
    var result = {};
    var check = client.query(checkQuery);
    check.on('row', function (row) { result = row });
    check.on('end', function () {
      done();
      if (result.exists === false) {
        client.query(insertQuery);
      }
    });
  });
  if (callback) {
    callback();
  }
}

// pg.connect(connectionString, function(err, client, done) {
//  if (err) console.log('Connection error: ', err);
//  client.query(checkQueries.checkURIUser(20, 1), function(err, result) {
//    done();
//    console.log('lets see: ',result.rows[0].exists);
//  });
// });

// pg.connect(connectionString, function(err, client, done) {
//  if (err) console.log('Connection error: ', err);
//  client.query(checkQueries.checkURI(uri), function(err, result) {
//    done();
//    resolve(result.rows[0].exists);
//  });
// });  


//------------------------------------------------------------------------------------//

app.get('/',function(req,res){
  res.end('connected!!!!!!');
});

app.post('/api/users', function (req, res) {

  var full_name = req.body.full_name;
  var username = req.body.username;
  var fb_pic = req.body.fb_pic;
  var uploaded_pic = req.body.uploaded_pic;
  var facebook_id = req.body.facebook_id;
  var email = req.body.email;
  var description = req.body.description;

  (function() {
    return new Promise(function(resolve, reject){
      pg.connect(connectionString, function (err, client, done) {
        if (err) console.log('Connection error: ', err);
        client.query(checkQueries.checkPerson(full_name), function(err, result) {
          if(result.rows.length > 0) {
            if (result.rows[0].id) {
            done();
              req.body.user_id = result.rows[0].id;
              res.set('Content-Type','application/JSON'); 
              res.json(req.body);
            }
          
          }
          
          resolve(result.rows[0]);
        });
      });
    })
  })()
  .then(function(exists) {
    if (!exists) {
      pg.connect(connectionString, function (err, client, done) {
        client.query(insertQueries.insertPerson('users', full_name, username, fb_pic, uploaded_pic, facebook_id, email, description));
        client.query(insertQueries.insertPerson('followers', full_name, username, fb_pic, uploaded_pic, facebook_id, email, description), function(err, result) {
          done();
          req.body.user_id = result.rows[0].id;
          res.set('Content-Type','application/JSON'); 
          res.json(req.body);
        });
      });
    }
  })
});


app.post('/api/annotations', function (req, res) {
  console.log(' the req body ', req.body)
  var user_id = req.body.user_id;
  var uri = req.body.uri;
  var title = req.body.title;
  var text = req.body.text;
  var quote = req.body.quote;
  var start = req.body.ranges[0].start;
  var end = req.body.ranges[0].end;
  var startOffset = req.body.ranges[0].startOffset;
  var endOffset = req.body.ranges[0].endOffset;
  var ann = req.body;
 
  (function(){
    return new Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) console.log('Connection error: ', err);
        client.query(checkQueries.checkURI(uri), function(err, result) {
          done();
          resolve(result.rows[0].exists);
        });
      }); 
    });
  })()
  .then(function(exists) {
    console.log('just checked if uri exists: ', exists);
    return new Promise(function(resolve, reject) {
      if (!exists) {
        pg.connect(connectionString, function(err, client, done) {
          if (err) console.log('Connection error: ', err);
          client.query(insertQueries.insertURI(uri, title), function(err, result) {
            done();
            resolve(result.rows[0].id);
          });
        });
      }
      else {
        pg.connect(connectionString, function(err, client, done) {
          if (err) console.log('Connection error: ', err);
          client.query(selectQueries.selectURIID(uri), function(err, result) {
            done();
            resolve(result.rows[0].id);
          });
        });
      } 
    }); 
  })
  .then(function(uri_id) {
    console.log('just got the uri_id: ', uri_id);
    return new Promise(function(resolve, reject) {
      (function(){
        return new Promise(function(resolveNested1, rejectNested1) {
          pg.connect(connectionString, function(err, client, done) {
            if (err) console.log('Connection error: ', err);
            client.query(checkQueries.checkURIUser(uri_id, user_id), function(err, result) {
              done();
              console.log('what is user_id: ', user_id)
              resolveNested1(result.rows[0].exists);
            });
          });
        })
      })()
      .then(function(exists) {
        console.log('just checked if uri_id exists: ', exists);
        if (!exists) {
          pg.connect(connectionString, function(err, client, done) {
            if (err) console.log('Connection error: ', err);
            client.query(insertQueries.insertURIUser(uri_id, user_id), function(err, result) {
              done();
              resolve(result.rows[0].id);
            });
          });
        }
        else {
          pg.connect(connectionString, function(err, client, done) {
            if (err) console.log('Connection error: ', err);
            client.query(selectQueries.selectURIUserID(uri_id, user_id), function(err, result) {
              done();
              resolve(result.rows[0].id);
            });
          });
        }
      })
    });
  })
  .then(function(uri_user_id) {
    console.log('just got the uri_user_id: ', uri_user_id);
    pg.connect(connectionString, function(err, client, done) {
      if (err) console.log('Connection error: ', err);
      client.query(insertQueries.insertAnnotation(uri_user_id, text, quote, start, end, startOffset, endOffset), function(err, result) {
        done()
        ann.id = parseInt(result.rows[0].id);
        res.set('Content-Type','application/JSON'); 
        res.json(ann);
        res.end();
      });
    });
  });
});


app.get('/api/search',function (req, res) {
  var user_id = req.query.user;
  var uri = req.query.uri;

  pg.connect(connectionString, function(err, client, done) {
    if (err) console.log('Connection error: ', err);
    client.query(selectQueries.selectAnnotations(uri, user_id), function(err, result) {
      var returnObj = {}
      var finalAnnotationObjects;
      done();
      if(result) {
         finalAnnotationObjects = result.rows.map(function(annotation) {
          return {
            user_id: user_id,
            uri: uri,
            id: parseInt(annotation.id),
            text: annotation.text,
            quote: annotation.quote,
            ranges: [
              {
                start: annotation.start1,
                end: annotation.end1,
                startOffset: annotation.startoffset,
                endOffset: annotation.endoffset
              }
            ]
          };        
      }) 
      returnObj.rows = finalAnnotationObjects;
      
    }else{
      returnObj.rows = [];
    }
    res.set('Content-Type','application/JSON'); 
      res.json(returnObj);
  });


});
});


app.put('/api/annotations/:id', function (req, res) {
  var annotation_id = req.params.id;
  var text = req.body.text;
  var ann = req.body;
  pg.connect(connectionString, function(err, client, done) {
    if(err) console.log('Connection error: ', err);
    client.query(updateQueries.updateAnnotationText(annotation_id, text), function(err, result) {
      done();
      req.body.id = annotation_id;
      res.set('Content-Type','application/JSON'); 
      res.json(req.body);
    });
  });
});


app.delete('/api/annotations/:id',function (req, res) {
  var annotation_id = req.params.id;

  pg.connect(connectionString, function(err, client, done) {
    if (err) console.log('Connection error: ', err);
    client.query(deleteQueries.deleteAnnotation(annotation_id), function(err, result) {
      done();
      res.sendStatus(204);
    })
  });
});












app.get('/api/personalfeed', function (req, res) {
  var body = req.body;

});


app.get('api/personalfeed/share', function (req, res) {
  var body = req.body;

});

// ----------------------------------------------------
  // Tommy's endpoints

app.get('/api/search/uri', function (req, res) {
  // sends back annotations based on uri
});

app.get('/api/search/users', function (req, res) {
  // sends back annotations based on users
});



app.listen(process.env.PORT || 9000);
console.log("Listening on port 9000...")