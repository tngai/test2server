var renderAnnotations = function() {
  return {
    annotationsLoaded: function(annotations) {
      console.log("annotations loaded", annotations);
      chrome.storage.local.set({'annotations': annotations});
    },
    annotationCreated: function(annotation) {
      console.log("annotation created:", annotation);
      chrome.storage.local.get('annotations', function(obj) {
        console.log('old values:', obj.annotations)
          obj.annotations.push(annotation);
          console.log('new values:', obj.annotations);
          chrome.storage.local.set({'annotations': obj.annotations});
      })
    },
    annotationDeleted: function(annotation) {
      chrome.storage.local.get('annotations', function(obj) {
        debugger;
        console.log('old values:', obj.annotations)
        for (var i = 0; i < obj.annotations.length; i++) {
          console.log(obj.annotations[i].id)
          if (obj.annotations[i].id === annotation.id) {
            obj.annotations.splice(i, 1);
            chrome.storage.local.set({'annotations': obj.annotations})
          }
        }
      })
    }
  }
}

module.exports = renderAnnotations;
