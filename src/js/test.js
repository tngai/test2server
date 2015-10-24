// var loadfunction = window.onload;
var renderAnnotations = require('./annotationRender');


exports.annotate = function(event) {

debugger;

  var pageUri = function() {
    return {
      beforeAnnotationCreated: function(ann) {
        ann.uri = window.location.href.split("?")[0];
      }
    };
  };

  var app = new annotator.App();
  app.include(annotator.ui.main)
     .include(annotator.storage.http, {
        prefix: 'https://onwords-test-server.herokuapp.com',
        urls: {
          create: '/api/annotations',
          update: '/api/annotations/{id}',
          destroy: '/api/annotations/{id}',
          search: '/api/search'
        }
      })
     .include(pageUri)
     .include(renderAnnotations);

  // chrome.storage.onChanged.addListener(function(changes) {
  //   if(changes.access_token.newValue) {
  //     app.start()
  //        .then(function() {
  //           app.annotations.load({uri: window.location.href.split("?")[0]});
  //        })
  //   }
  // })

  // chrome.storage.sync.get('access_token', function(obj) {
  //   if(obj['access_token']) {
      app.start()
         .then(function() {
            app.annotations.load({uri: window.location.href.split("?")[0]});
         })
    // } else {
    //   chrome.storage.onChanged.addListener(function(changes) {
    //     if(changes.access_token.newValue) {
    //       app.start()
    //          .then(function() {
    //             app.annotations.load({uri: window.location.href.split("?")[0]});
    //          })
    //     }
    //   })
    // }
  // })



}
