var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var morgan = require('morgan');

var app = express();
var server = http.Server(app);
require('./db/config.js');
require('./db/models/annotations'); 
require('./db/models/users');

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
  next();
});



// Create annotations 
app.post('/api/annotations', function(req,res){
  var ann = req.body;
  var text = req.body.text;
  var quote = req.body.quote;
  var uri = req.body.uri;
  var start = req.body.ranges[0].start;
  var end = req.body.ranges[0].end;
  var startOffset = req.body.ranges[0].startOffset;
  var endOffset = req.body.ranges[0].endOffset;
  var user_id = 1;
 
  db.model('Annotation').newAnnotation({
    text: text,
    quote: quote,
    uri: uri,
    user_id: user_id,
    start: start,
    end: end,
    startOffset: startOffset,
    endOffset: endOffset
  }).save().then(function(data){
    console.log('heres the annotation id ', data.id);
    ann.id = data.id;
    res.set('Content-Type','application/JSON');
    res.json(ann);
    res.end();
  });




});



/// Delete functionality

app.delete('/api/annotations/:id',function(req,res){
  var annId = req.params.id;
  console.log('the params id ',annId)
  db.model('Annotation').destroyById(annId).then(function(data){
    console.log('this is the annotation to be deleted ', data);
    res.sendStatus(204)
  })
});
// Update endpoint 

app.put('/api/annotations/:id',function(req,res){
  var annId = req.params.id;
  db.model('Annotation').updateById({id:annId, text:req.body.text}).then(function(data){
    console.log('database updated ');
  })
  db.model('Annotation').fetchByUri(annId).then(function(data){ 
  var resObj = {
        id: data.attributes.id,
        text: req.body.text,
        quote: data.attributes.quote,
        ranges: [
          {
            start: data.attributes.start,
            end: data.attributes.end,
            startOffset: data.attributes.startOffset,
            endOffset: data.attributes.endOffset
          }
        ]
       };

    res.set('Content-Type','application/JSON');   
    res.json(resObj);
    res.end();
  });


});

// Search endpoint(Read)
app.get('/api/search',function(req,res){
  var uri = req.url.split('?')[1].split('=')[1].replace(/%2F/g,'/').replace(/%3A/,':');
  db.model('Annotation').fetchByUri(uri).then(function(data){
    var resultsArray = data.models.map(function(e){
      var resObj = {
        id: e.attributes.id,
        text: e.attributes.text,
        quote: e.attributes.quote,
        uri: e.attributes.uri,
        ranges: [
          {
            start: e.attributes.start,
            end: e.attributes.end,
            startOffset: e.attributes.startOffset,
            endOffset: e.attributes.endOffset
          }
        ]
       };
       return resObj;   
    });

    var returnObj = {};
    returnObj.rows = resultsArray;
    
    res.set('Content-Type', 'application/JSON');
    res.json(returnObj);
    res.end();
  })
})


app.listen(process.env.PORT || 8000);
console.log("Listening on port 8000...")