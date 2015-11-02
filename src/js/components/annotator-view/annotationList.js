var React = require('react');
var AnnotationComment = require('./annotationComment');
var home = require('./home-button');

var annotationList = React.createClass({
  deleteAnn: function(annotation) {
    var ev = new CustomEvent('deleteAnnotation', {detail: {
      targetAnnotation: annotation
    }});
    document.dispatchEvent(ev);
  },

  render: function() {
    var self = this;
    console.log('inside annotationList', this.props.annotations)

    var annotations = this.props.annotations.map(function(annotation, index) {
      return (
        <li className="annotation" key={index}>
          <AnnotationComment annotation={annotation} deleteAnn={self.deleteAnn} />
        </li>
      )
    });

    return (
      <ul className="annotationList">
        {annotations}
      </ul>
    )
  }
})

module.exports = annotationList;
