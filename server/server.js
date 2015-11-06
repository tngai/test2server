var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var morgan = require('morgan');
var Promise = require('bluebird');
var validator = require('validator');

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
  if (err) console.error('Connection error: ', err);
  for (var i = 0; i < tables.length; i++) {
    client.query(tables[i]);
  }
  done();
});

var checkAndInsertIfNotExists = function (checkQuery, insertQuery, callback) {
  pg.connect(connectionString, function (err, client, done) {
    if (err) console.error('Connection error: ', err);
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



//------------------------------------------------------------------------------------//

app.get('/',function(req,res){
  res.end('connected!!!!!!');
});

app.post('/api/users', function (req, res) {

  var full_name = req.body.full_name;
  var username = req.body.username;
  var pic_url = req.body.pic_url;
  var uploaded_pic = req.body.uploaded_pic;
  var facebook_id = req.body.facebook_id;
  var email = req.body.email;
  var description = req.body.description;

  (function() {
    return new Promise(function(resolve, reject){
      pg.connect(connectionString, function (err, client, done) {
        if (err) console.error('Connection error: ', err);
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
        client.query(insertQueries.insertPerson('users', full_name, username, pic_url, uploaded_pic, facebook_id, email, description));
        client.query(insertQueries.insertPerson('followers', full_name, username, pic_url, uploaded_pic, facebook_id, email, description), function(err, result) {
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
  console.log('what is happening: ', req.body);
  var user_id = req.body.user_id;
  var uri = req.body.uri;
  var title = req.body.title;
  var text = validator.escape(validator.toString(req.body.text));
  var quote = validator.escape(validator.toString(req.body.quote));
  var start = req.body.ranges[0].start;
  var end = req.body.ranges[0].end;
  var startOffset = req.body.ranges[0].startOffset;
  var endOffset = req.body.ranges[0].endOffset;
  var ann = req.body;
 
  (function(){
    return new Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) console.error('Connection error: ', err);
        client.query(checkQueries.checkURI(uri), function(err, result) {
          done();
          resolve(result.rows[0].exists);
        });
      }); 
    });
  })()
  .then(function(exists) {
    return new Promise(function(resolve, reject) {
      if (!exists) {
        pg.connect(connectionString, function(err, client, done) {
          if (err) console.error('Connection error: ', err);
          client.query(insertQueries.insertURI(uri, title), function(err, result) {
            done();
            resolve(result.rows[0].id);
          });
        });
      }
      else {
        pg.connect(connectionString, function(err, client, done) {
          if (err) console.error('Connection error: ', err);
          client.query(selectQueries.selectURIID(uri), function(err, result) {
            done();
            resolve(result.rows[0].id);
          });
        });
      } 
    }); 
  })
  .then(function(uri_id) {
    console.log("uri_id: ", uri_id);
    return new Promise(function(resolve, reject) {
      (function(){
        return new Promise(function(resolveNested1, rejectNested1) {
          pg.connect(connectionString, function(err, client, done) {
            if (err) console.error('Connection error: ', err);
            client.query(checkQueries.checkURIUser(uri_id, user_id), function(err, result) {
              done();
              resolveNested1(result.rows[0].exists);
            });
          });
        })
      })()
      .then(function(exists) {
        if (!exists) {
          pg.connect(connectionString, function(err, client, done) {
            if (err) console.error('Connection error: ', err);
            client.query(insertQueries.insertURIUser(uri_id, user_id), function(err, result) {
              done();
              resolve(result.rows[0].id);
            });
          });
        }
        else {
          pg.connect(connectionString, function(err, client, done) {
            if (err) console.error('Connection error: ', err);
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
    console.log('uri_user_id: ', uri_user_id);
    pg.connect(connectionString, function(err, client, done) {
      if (err) console.error('Connection error: ', err);
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
    if (err) console.error('Connection error: ', err);
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
      }
      else {
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
    if(err) console.error('Connection error: ', err);
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

  var deleteThatAnnotation = function(annotation_id) {
    return new Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) console.error('Connection error: ', err);
        client.query(deleteQueries.deleteAnnotation(annotation_id), function(err, result) {
          done();
          if (!result) {
            console.error('Error in query: ', err);
            res.sendStatus(404);
            reject(err);
          }
          else if (result.rows.length === 0) res.sendStatus(404);
          else resolve(result.rows[0].uri_user_id);
        })
      });
    });
  }

  var checkIfAnnotationsForThisURIUserIsEmpty = function(uri_user_id) {
    return new Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) {
          done();
          console.error('Connection error: ', err);
          reject(err);
        }
        client.query(checkQueries.checkIfAnyAnnotationsForThisURIUser(uri_user_id), function(err, result) {
          done();
          if (!result) {
            console.error('Error in query: ', err);
            res.sendStatus(404);
            reject(err);
          }
          else {
            var obj = {
              uri_user_id: uri_user_id,
              exists: result.rows[0].exists
            }  
            resolve(obj);
          }
        })
      })
    })
  }

  var deleteURIUserOrNot = function(obj) {
    if (!obj.exists) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) {
          done();
          console.error('Connection error: ', err);
          reject(err);
        }
        client.query(deleteQueries.deleteURIUser(obj.uri_user_id), function(err, result) {
          done();
          if (!result) {
            console.error('Error in query: ', err);
            res.sendStatus(404);
            reject(err);
          }
          else {
            res.sendStatus(204);
          }
        })
      });
    }
    else {
      res.sendStatus(204);
    }
  }

  deleteThatAnnotation(annotation_id)
    .then(checkIfAnnotationsForThisURIUserIsEmpty)
    .then(deleteURIUserOrNot)
    .catch(function(err) {
      console.error('Error in deleting annotation: ', err);
    })

});




app.get('/api/homefeed', function (req, res) {
  var user_id = req.query.user_id;
  // returns an array of people (user ids) you follow
  var getPeopleYouFollow = function(user_id) {
    return new Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) {
          console.error('Connection error: ', err);
          return reject(err);
        }
        client.query(selectQueries.selectPeopleYouFollow(user_id), function(err, result) {
          done();
          resolve(result.rows);
        });
      });
    });
  };
 
  var getFullNamePicURLAndID = function(person) {
    return new Promise(function(resolve, reject) { 
      pg.connect(connectionString, function(err, client, done) {
        if (err) {
          console.error('Connection error: ', err); 
          return reject(err);
        }
        client.query(selectQueries.selectFullNameAndPicURLBasedOnID(person.user_id), function(err, result) {
          done();
          resolve(result.rows[0]);
        });
      });
    });
  };
 
  // returns an array of urls (uri objs) a person has annotated
  //    uri objs have 2 properties: url_link and title
  var getUriObjsOfPerson = function(person) {
    return new Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) {
          console.error('Connection error: ', err);
          return reject(err);
        }
        client.query(selectQueries.selectURIs(person.user_id), function(err, result) {
          done();
          resolve(result.rows);
        });
      });
    });
  };

 
  // returns the general post for a specific uri
  var getGeneralPost = function(uri, userId) {
    return new Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) {
          console.error('Connection error: ', err);
          return reject(err);
        }
        client.query(selectQueries.selectGeneralPost(uri.uri_link, userId), function(err, result) {
          done();
          resolve(result.rows[0].general_post);
        });
      });
    });
  };
 
  var getCommentsOnGeneralPost = function(uri, userId) {
    return new Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) {
          console.error('Connection error: ', err);
          return reject(err);
        }
        client.query(selectQueries.selectCommentsOnGeneralPost(uri.uri_link, userId), function(err, result) {
          done();
          resolve(result.rows);
        });
      });
    });
  };
 
  var getLikesOnGeneralPost = function(uri, userId) {
    return new Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) {
          console.error('Connection error: ', err);
          return reject(err);
        }
        client.query(selectQueries.whoLikedThisPost(uri.uri_link, userId), function(err, result) {
          done();
          resolve(result.rows);
        });
      });
    });
  };

  var getIsSharedProperty = function(uri, userId) {
    return new Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) {
          console.error('Connection error: ', err);
          return reject(err);
        }
        client.query(selectQueries.selectIsSharedProperty(uri.uri_link, userId), function(err, result) {
          done();
          resolve(result.rows[0].is_shared);
        })
      });
    })
  }
 
  var getGeneralPostCommentsLikes = function(uri, userId) {
    return Promise.all([
      getGeneralPost(uri, userId),
      getCommentsOnGeneralPost(uri, userId),
      getLikesOnGeneralPost(uri, userId),
      getIsSharedProperty(uri, userId)
    ]);
  };
 
  var assembleArticleObj = function(generalPostCommentsLikesArray, uriObj) {
    var generalPost = generalPostCommentsLikesArray[0];
    var comments = generalPostCommentsLikesArray[1];
    var likes = generalPostCommentsLikesArray[2];
    var shared = generalPostCommentsLikesArray[3];
    return {
      uri_link: uriObj.uri_link,
      title: uriObj.title,
      general_post: generalPost,
      is_shared: shared,
      updated_at: uriObj.updated_at,
      commentsOnGeneralPost: comments,
      likes: likes
    };
  };
 
  var convertUriObjToArticleObj = function(uriObj, userId) {
    return getGeneralPostCommentsLikes(uriObj, userId)
      .then(function(generalPostCommentsLikesArray) {
        return assembleArticleObj(generalPostCommentsLikesArray, uriObj);
      })
      .catch(function(err) {
        console.error('Error in convertUriObjToArticleObj:', err);
      });
  };
 
  var assemblePersonInfoWithArticlesObj = function(person) {
    // Promise.all these two promises
    return Promise.all([
      getFullNamePicURLAndID(person),
      getUriObjsOfPerson(person)
        .then(function(uriObjsArray) {
          // iterating through each uriObjsArray of each user ID
          return Promise.map(uriObjsArray, function(uriObj) {
            // iterating through each uriObj of each uriObjsArray
            return convertUriObjToArticleObj(uriObj, person.user_id);
          });
        })
    ])
      .then(function(fullNameFBPicAndUriObjs) {
        var fullNameAndFBPicObj = fullNameFBPicAndUriObjs[0];
        var articleObjsOfPerson = fullNameFBPicAndUriObjs[1];
        return {
          user_id: fullNameAndFBPicObj.id,
          full_name: fullNameAndFBPicObj.full_name,
          pic_url: fullNameAndFBPicObj.pic_url,
          articles: articleObjsOfPerson
        };
      })
      .catch(function(err) {
          console.error('Error in assemblePersonInfoWithArticlesObj:', err);
        });
  };
 
  var getArrayOfPersonInfoWithArticles = getPeopleYouFollow(user_id)
    .then(function(peopleList) {
      // iterating through each user ID in peopleList
      return Promise.map(peopleList, function(person) {
        return assemblePersonInfoWithArticlesObj(person);
      });
    });
 
  getArrayOfPersonInfoWithArticles
    .then(function(arrayOfPersonInfoWithArticles) {
      res.json(arrayOfPersonInfoWithArticles);
    })
    .catch(function(err) {
      console.error('Error creating array of article object arrays:', err);
    });
});


app.get('/api/personalfeed', function (req, res) {
  var user_id = req.query.user_id;
 
  // returns an array of urls (uri objs) a person has annotated
  //    uri objs have 2 properties: url_link and title
  var getUriObjsOfUser = function(user_id) {
    return new Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) {
          console.error('Connection error: ', err);
          return reject(err);
        }
        client.query(selectQueries.selectURIs(user_id), function(err, result) {
          done();
          resolve(result.rows);
        });
      });
    });
  };
 
  // returns the general post for a specific uri
  var getGeneralPost = function(uri, userId) {
    return new Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) {
          console.error('Connection error: ', err);
          return reject(err);
        }
        client.query(selectQueries.selectGeneralPost(uri.uri_link, userId), function(err, result) {
          done();
          resolve(result.rows[0].general_post);
        });
      });
    });
  };
 
  var getCommentsOnGeneralPost = function(uri, userId) {
    return new Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) {
          console.error('Connection error: ', err);
          return reject(err);
        }
        client.query(selectQueries.selectCommentsOnGeneralPost(uri.uri_link, userId), function(err, result) {
          done();
          resolve(result.rows);
        });
      });
    });
  };
 
  var getLikesOnGeneralPost = function(uri, userId) {
    return new Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) {
          console.error('Connection error: ', err);
          return reject(err);
        }
        client.query(selectQueries.whoLikedThisPost(uri.uri_link, userId), function(err, result) {
          done();
          resolve(result.rows);
        });
      });
    });
  };
 
  var getGeneralPostCommentsLikes = function(uri, userId) {
    return Promise.all([
      getGeneralPost(uri, userId),
      getCommentsOnGeneralPost(uri, userId),
      getLikesOnGeneralPost(uri, userId)
    ]);
  };
 
  var assembleArticleObj = function(generalPostCommentsLikesArray, uriObj) {
    var generalPost = generalPostCommentsLikesArray[0];
    var comments = generalPostCommentsLikesArray[1];
    var likes = generalPostCommentsLikesArray[2];
    return {
      uri_link: uriObj.uri_link,
      title: uriObj.title,
      general_post: generalPost,
      commentsOnGeneralPost: comments,
      likes: likes
    };
  };
 
  var convertUriObjToArticleObj = function(uriObj, userId) {
    return getGeneralPostCommentsLikes(uriObj, userId)
      .then(function(generalPostCommentsLikesArray) {
        return assembleArticleObj(generalPostCommentsLikesArray, uriObj);
      })
      .catch(function(err) {
        console.error('Error in convertUriObjToArticleObj:', err);
      });
  };

  var getArrayOfArticleObjs = getUriObjsOfUser(user_id)
    .then(function(uriObjsArray) {
      // iterating through each uriObjsArray of each user ID
      return Promise.map(uriObjsArray, function(uriObj) {
        // iterating through each uriObj of each uriObjsArray
        return convertUriObjToArticleObj(uriObj, user_id);
      });
    });
 
  getArrayOfArticleObjs
    .then(function(arrayOfArticleObjs) {
      res.json(arrayOfArticleObjs);
    })
    .catch(function(err) {
      console.error('Error creating array of article object arrays:', err);
    });
});



app.put('/api/personalfeed/share', function(req, res) {
  var user_id = req.query.user_id;
  var uri = req.query.uri;
  var is_shared = req.query.is_shared;

  var updateArticlesSharedStatusTo = function(is_shared, uri, user_id) {
    return new Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) {
          console.error('Connection error: ', err);
          resolve(err);
        }
        client.query(updateQueries.updateSharedStatusTo(is_shared, uri, user_id), function(err, result)  {
          done();
          if (!result) res.sendStatus(404)
          else if (result.rows.length === 0) res.sendStatus(404);
          else {
            resolve(result.rows[0].id);
          }
        })
      })
    })
  }

  var updateTimestampOnArticle = function(uri_user_id) {
    pg.connect(connectionString, function(err, client, done) {
      if (err) console.error('Connection error: ', err);
      client.query(updateQueries.updateTimestampOnURIUser(uri_user_id), function(err, result) {
        done();
        if (!result) res.sendStatus(404);
        else if (result.rows.length === 0) res.sendStatus(404);
        else res.sendStatus(204);
      })
    })
  }

  updateArticlesSharedStatusTo(is_shared, uri, user_id) 
  .then(updateTimestampOnArticle)
  .catch(function(err) {
    console.error('Error in updating the shared status of article: ', err);
  })

})
  app.post('/api/users/update', function(req,res){
    console.log('here  ', req.body )
    var userInfo = req.body;

    var updateUserRow = function(infoObj) {
      return new Promise(function(resolve,reject){
        pg.connect(connectionString, function(err,client,done){
          if (err) console.error('Connection error: ', err);
          client.query(updateQueries.updateUserRow('users',infoObj), function(err,result) {
            if (err) console.error('Connection error: ', err);
            console.log('the result in the query ', result)
            done();
            resolve(result.rows);
          });
        }) 
      });
    };
    var updateUserFollowerRow = function(table,infoObj) {
      return new Promise(function(resolve,reject){
        pg.connect(connectionString, function(err,client,done){
          if (err) console.error('Connection error: ', err);
          client.query(updateQueries.updateUserRow('followers', infoObj), function(err,result) {
            if (err) console.error('Connection error: ', err);
            console.log('the result in the query ', result)
            done();
            resolve(result);
          });
        }) 
      });
    };

   var userFollowerArr = [updateUserFollowerRow("users",userInfo), updateUserFollowerRow("followers",userInfo)];
   
   Promise.all(userFollowerArr).then(function() {
    res.set('Content-Type','application/JSON'); 
    res.json(userInfo);
   });

  });


app.get('/api/search/users', function(req, res) {
  var user_id = req.query.user_id;
  var full_name = req.query.full_name;

  var getFullNamePicURLAndID = function(full_name) {
    return new Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) console.error('Connection error: ', err);
        client.query(selectQueries.selectFullNamePicURLAndID(full_name), function(err, result) {
          done();
          resolve(result.rows);
        });
      });
    });
  }

  var getCheckIfYoureFollowingThem = function(personYouSearchedForID) {
    return new Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) console.error('Connection error: ', err);
        client.query(checkQueries.checkUserFollower(personYouSearchedForID, user_id), function(err, result) {
          done();
          resolve(result.rows[0].exists);
        });
      });
    });
  }

  getFullNamePicURLAndID(full_name)
    .then(function(people) {
      return Promise.map(people, function(person) {
        return getCheckIfYoureFollowingThem(person.id)
          .then(function(exists) {
            return {
              person_id: person.id,
              full_name: person.full_name,
              pic_url: person.pic_url,
              is_following: exists
            }
          })
      })
    })
    .then(function(peopleArray) {
      res.set('Content-Type','application/JSON'); 
      res.json(peopleArray);
    })

}); 


app.post('/api/users/follow', function(req, res) {
  var user_id = req.body.user_id;
  var follower_id = req.body.follower_id;


  var getCheckIfYoureFollowingThem = function(user_id) {
    return new Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) console.error('Connection error: ', err);
        client.query(checkQueries.checkUserFollower(user_id, follower_id), function(err, result) {
          done();
          resolve(result.rows[0].exists);
        });
      });
    });
  }

  var insertUserFollowerOrNot = function(exists) {
    if (!exists) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) console.error('Connection error: ', err);
        client.query(insertQueries.insertUserFollowerRelationship(user_id, follower_id), function(err, result) {
          done();
          res.sendStatus(201);
        });
      })
    }
  }

  getCheckIfYoureFollowingThem(user_id)
    .then(insertUserFollowerOrNot)

})

app.delete('/api/users/unfollow', function(req, res) {
  var user_id = req.query.user_id;
  var follower_id = req.query.follower_id;

  pg.connect(connectionString, function(err, client, done) {
    if (err) console.error('Connection error: ', err);
    client.query(deleteQueries.deleteUserFollowerRelationship(user_id, follower_id), function(err, result) {
      done();
      if (!result) res.sendStatus(404);
      else res.sendStatus(204);
    })
  });
})


app.get('/api/users/uri/annotations', function (req, res) {
  var user_id = req.query.user_id; 
  var uri = req.query.uri;


  var getPeopleYouFollow = function(user_id) {
    return new Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) {
          console.error('Connection error: ', err);
          return reject(err);
        }
        client.query(selectQueries.selectPeopleYouFollow(user_id), function(err, result) {
          done();
          resolve(result.rows);
        });
      });
    });
  };
  
  var checkIfPersonAnnotatedThisArticle = function(uri, person) {
    return new Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) {
          console.error('Connection error: ', err);
          return reject(err);
        }
        client.query(selectQueries.selectPersonIfPersonAnnotatedThisPage(uri, person.user_id), function(err, result) {
          done();
          if (result.rows.length > 0) resolve(true);
          else resolve(false)
        })
      })
    })
  }

  var getFullNamePicURLAndID = function(person) {
    return new Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) {
          console.error('Connection error: ', err);
          return reject(err);
        }
        client.query(selectQueries.selectFullNameAndPicURLBasedOnID(person.user_id), function(err, result) {
          done();
          resolve(result.rows[0]);
        });
      });
    });
  }

  getPeopleYouFollow(user_id) 
    .then(function(peopleYouFollow) {
      return Promise.filter(peopleYouFollow, function(personYouFollow) {
        return checkIfPersonAnnotatedThisArticle(uri, personYouFollow)
      })
    })
    .then(function(peopleYouFollowWhoAnnotatedPage) {
      return Promise.map(peopleYouFollowWhoAnnotatedPage, function(personYouFollowWhoAnnotatedPage) {
        return getFullNamePicURLAndID(personYouFollowWhoAnnotatedPage);
      })
    })
    .then(function(fullNamesPicURLsAndIDsOfWhoAnnotatedPage) {
      res.set('Content-Type','application/JSON'); 
      res.json(fullNamesPicURLsAndIDsOfWhoAnnotatedPage);
    })

})


  app.post('/api/uri/gp', function(req,res) {
    var gpObj = req.body;
    var uri = req.body.uri;
    var user_id = req.body.user_id;
    var generalPost = req.body.generalPost;

    var updateGP = function(uri, user_id, generalPost) {
      return new Promise(function(resolve,reject){
        pg.connect(connectionString, function(err, client, done) {
          if (err) {
            console.error('Connection error: ', err);
            return reject(err);
          }
          client.query(updateQueries.updateGeneralPost(uri, user_id, generalPost), function(err, result) {
            if(err) console.error('Connection error: ', err);
            done();
            resolve(result.rows[0]);
          });
        });
      });
      }; 
    updateGP(uri, user_id, generalPost).then(function(){
      res.set('Content-Type','application/JSON'); 
      res.json(gpObj);  
    });
  });

  app.post('/api/comments', function(req,res) {
    var uri = req.body.uri;
    var user_id = req.body.user_id;
    var follower_id = req.body.follower_id;
    var message = req.body.message;

    var insertComments =  function(uri,user_id,follower_id,message){
      return new Promise(function(resolve,reject){
        pg.connect(connectionString,function(err,client,done) {
          if (err) {
            console.error('Connection error: ', err);
            return reject(err);
          }
          client.query(insertQueries.insertGeneralPostComment(uri, user_id, follower_id, message), function(err,result){
            if(err) console.error('Connection error' ,err);
            done()
            resolve(result.row)
          });  
        });  
      })
    };
  
    insertComments(uri, user_id, follower_id, message)
    .then(function(data){
      res.set('Content-Type','application/JSON'); 
      res.json(req.body);
    })
  });

  app.post('/api/likes',function(req,res) {
    var uri = req.body.uri;
    var user_id = req.body.user_id;
    var follower_id = req.body.follower_id;
    var likeToggle = req.body.likeToggle

    var insertLike = function(uri,user_id,follower_id) {
      return new Promise(function(resolve,reject){
        pg.connect(connectionString,function(err,client,done) {
          if (err) {
            console.error('Connection error: ', err);
            return reject(err);
          }
          client.query(insertQueries.insertLikes(uri,user_id,follower_id),function(err,result){
            done();
            resolve(result);
          });      
        });
      });  
    };
    var deleteLike = function(uri, user_id, follower_id){
      return new Promise(function(resolve,reject){
        pg.connect(connectionString,function(err,client,done) {
          if (err) {
            console.error('Connection error: ', err);
            return reject(err);
          }
          client.query(deleteQueries.deleteLike(uri,user_id,follower_id),function(err,result){
            done();
            resolve(result);
          });      
        });
      });     
    };
    if(likeToggle.length === 5) {
      deleteLike(uri, user_id, follower_id).then(function(result){
        res.set('Content-Type','application/JSON'); 
        res.json(req.body);  
      }) 
    }else{
      insertLike(uri, user_id, follower_id).then(function(results) {
        res.set('Content-Type','application/JSON'); 
        res.json(req.body);        
      });  
    }
  });





app.listen(process.env.PORT || 9000);
console.log("Listening on port 9000...")