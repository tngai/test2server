var React = require('react');

var friendAnnotationComment = React.createClass({
  goToHighlight: function() {
    $('html, body').animate({
      scrollTop: this.props.annotation.offsetTop - 200
    }, 300)
  },

  render: function() {
    
    var annotation = this.props.annotation;
    return (
      <div>
        <p onClick={this.goToHighlight}>{annotation.quote}</p>
        <p>{annotation.text}</p>
      </div>
    )
  }
})

module.exports = friendAnnotationComment;