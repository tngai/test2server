// var Promise = require('bluebird');
// var dbOptions = {
//   client: process.env.dbClient || 'postgres',
//   connection: process.env.DATABASE_URL
// }
var dbOptions = process.env.DATABASE_URL || {
  client: process.env.dbClient || 'postgres',
  connection: {
    host: process.env.dbHost || '127.0.0.1',
    user: process.env.dbUser || 'root',
    password: process.env.dbPassword || '',
    database: process.env.dbDatabase || 'onwordsdb',
    charset: 'utf8'
  }
};

var knex = require('knex')(dbOptions);

module.exports = db = require('bookshelf')(knex);

db.plugin('registry');

var buildTable = function(name, callback) {
  return db.knex.schema.hasTable(name)
  .then(function(exists) {
    if (exists) {
      return { name: name, created: false };
    } else {
      return db.knex.schema.createTable(name, callback);
    }
  })
  .then(function(response) {
    if (!response.name) {
      qb = response;
      if (qb) {
        return { name: name, created: true };
      } else {
        return { name: name, created: false };
      }
    } else { return response; }
  });
};

var users = buildTable('users', function(table){
  table.increments('id').primary();
  table.string('facebook_id').unique();
  table.string('full_name');
  table.string('pic_url');
  table.string('email');
});

var annotations = buildTable('annotations', function(table){
  table.increments('id').primary();
  table.string('text');
  table.string('quote',2000);
  table.string('uri');
  table.string('start');
  table.string('end');
  table.integer('startOffset');
  table.integer('endOffset');
  table.integer('user_id');
});

var users_followers = buildTable('users_followers', function(table){
  table.integer('user_id');
  table.integer('follower_id');
});

var tables = [users, annotations, users_followers];
 
Promise.all(tables)
.then(function(tables) {
  tables.forEach(function(table) {
    if (table.created) {
      console.log('Bookshelf: created table', table.name);
    } else {
      console.log('Bookshelf:', table.name, 'table already exists');
    }
  });
});
