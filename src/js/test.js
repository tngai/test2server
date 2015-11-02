var renderAnnotations = require('./annotationRender');

exports.annotate = function(userId) {
  var uri = window.location.href.split("?")[0];
  if (uri.substring(uri.length-11) === 'onwords1991') {
    targetUri = uri.substring(0, uri.length-13);
  } else {
    targetUri = uri;
  }

  chrome.storage.local.remove(targetUri);


  var pageUri = function() {
    return {
      beforeAnnotationCreated: function(ann) {
        ann.uri = targetUri;
        ann.title = document.getElementsByTagName('title')[0].innerHTML || document.querySelector('meta[name="twitter:title"]').getAttribute("content");
        // ann.description = null || document.querySelector('meta[name="twitter:description"]').getAttribute("content");
        ann.user_id = window.localStorage.getItem('user_id');
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


   app.start()
    .then(function() {
      app.annotations.load({
        uri: targetUri,
        user: userId
      })
    })

  document.addEventListener('getFriendAnnotations', function(e) {
    console.log("show this dude's annotation:", e.detail.userId);
    app.annotations.load({
      uri: targetUri,
      user: e.detail.userId
    });
  });
};
