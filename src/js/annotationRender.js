var renderAnnotations = function() {
  var uri = window.location.href.split("?")[0];
  if (uri.substring(uri.length-11) === 'onwords1991') {
    uri = uri.substring(0, uri.length-13);
  } else {
    uri = uri;
  }

  return {
    // annotationsLoaded: function(annotations) {
    //   var uri = window.location.href.split("?")[0];
    //   console.log("annotations loaded", annotations);
    //   var obj = {};
    //   obj[uri] = annotations;
    //   chrome.storage.local.set(obj);
    // },

    annotationCreated: function(annotation) {
      console.log("annotation created:", annotation);
      chrome.storage.local.get(uri, function(obj) {
        debugger;
        console.log('values before CREATING:', obj[uri])
        if (!obj[uri]) {
          obj[uri] = [];
        }
        obj[uri].push(annotation);
        obj[uri].sort(function(a,b) {
          if (a.offsetTop < b.offsetTop) {
           return -1;
          } else if (a.offsetTop > b.offsetTop){
           return 1;
          } else {
             if (a.offsetLeft < b.offsetLeft) { 
              return -1;
             } else if (a.offsetLeft > b.offsetLeft){
              return 1;
             }
          }
        })
        console.log('values after CREATING:', obj[uri]);
        var newObj = {};
        newObj[uri] = obj[uri];
        chrome.storage.local.set(newObj);
      })
    },

    beforeAnnotationDeleted: function(annotation) {
      var id = annotation.id;
      $('[data-annotation-id=' + id + ']').contents().unwrap();
      chrome.storage.local.get(uri, function(obj) {
        debugger;
        console.log('values before DELETING:', obj[uri]);
        for (var i = 0; i < obj[uri].length; i++) {
          if (obj[uri][i].id === annotation.id) {
            obj[uri].splice(i, 1);
            var newObj = {};
            newObj[uri] = obj[uri];
            console.log('values after DELETING:', newObj[uri]);
            chrome.storage.local.set(newObj);
          }
        }
      })
    },

    beforeRenderDeleted: function(annotations) {
      debugger;
      chrome.storage.local.get(uri, function(obj) {
        debugger;
        for (var i = 0; i < annotations.length; i++) {
          var id = annotations[i].id;
          $('[data-annotation-id=' + id + ']').contents().unwrap();
          for (var j = 0; j < obj[uri].length; j++) {
            if (obj[uri][j].id === id) {
              obj[uri].splice(j, 1);
              break;
            }
          }
        }
        var newObj = {};
        newObj[uri] = obj[uri];
        chrome.storage.local.set(newObj);
      })
    },

    beforeAnnotationUpdated: function(annotation) {
      chrome.storage.local.get(uri, function(obj) {
        console.log('values before UPDATING:', obj[uri]);
        for (var i = 0; i < obj[uri].length; i++) {
          if (obj[uri][i].id === annotation.id) {
            obj[uri][i].text = annotation.text;
            var newObj = {};
            newObj[uri] = obj[uri];
            console.log('values after UPDATING', newObj[uri]);
            chrome.storage.local.set(newObj);
          }
        }
      })
    }
  }
}

module.exports = renderAnnotations;
