var React = require('react');

var annotationList = React.createClass({

  render: function() {
    console.log('inside annotationList', this.props.annotations)
    var annotations = this.props.annotations.map(function(annotation, index) {
      return <li className="annotation" key={index}>
        <p>{annotation.quote}</p>
        <p>{annotation.text}</p>
      </li>
    });
    console.log(annotations)

    return (
      <ul className="annotationList">
        {annotations}
      </ul>
    )
  }
})

module.exports = annotationList;