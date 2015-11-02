var React = require('react');
var AnnotationList = require('./annotationList');

var AnnotatorBody = React.createClass({
  getInitialState: function() {
    return {
      annotations: []
    }
  },

  componentWillMount: function() {
    var self = this;
    chrome.storage.local.get('annotations', function(object) {
      console.log('inside annotator body', object.annotations);
      if (object.annotations) {
        self.setState({annotations: object.annotations});
      }
    })
    chrome.storage.onChanged.addListener(function(changes) {
      console.log('annotator body, storage updated', changes.annotations);
      if (changes.annotations.newValue) {
        self.setState({annotations: changes.annotations.newValue});
      }
    })
  },

  render: function() {
    return (
      <div id='annotator-body-container'>
        <AnnotationList annotations={this.state.annotations}/>
      </div>
    );
  }
});

module.exports = AnnotatorBody;
