var request = require("request"); // You might need to npm install the request module!
var expect = require('../../node_modules/chai/chai').expect;
var should = require('../../node_modules/chai/chai').should;
var assert = require('../../node_modules/chai/chai').assert;
var chaiHttp = require('../../node_modules/chai/chai').http;
var pg = require('pg');

var selectQueries = require('../server/db/queries/selectQueries.js'); 
var insertQueries = require('../server/db/queries/insertQueries.js');
var updateQueries = require('../server/db/queries/updateQueries.js');
var deleteQueries = require('../server/db/queries/deleteQueries.js');
var checkQueries = require('../server/db/queries/checkQueries.js');
​
​
describe("Persistent DB Server", function() {
  var connectionString = process.env.DATABASE_URL
  beforeEach(function(done) {
    pg.connect(connectionString,function(err,client,done) {
      console.log('our client ', client);
      if (err) console.log('Connection error: ', err);    
    })
  });
​
  
​
  afterEach(function() {
    pg.connect(connectionString,function(err,client,done) {
      console.log()
      if (err) console.log('Connection error: ', err); 
      done();
    })
  });
​
​	it("Should add annotation to database", function(done) {
		client.query(insertQueries.insertAnnotation, function(err, result) {
			
		})
	})

});