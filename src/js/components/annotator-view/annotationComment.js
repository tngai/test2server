var React = require('react');

var annotationComment = React.createClass({
  getInitialState: function() {
    return {
      shouldEditComment: false
    }
  },

  goToHighlight: function() {
    $('html, body').animate({
      scrollTop: this.props.annotation.offsetTop - 200
    }, 300)
  },

  editComment: function() {
    this.setState({shouldEditComment: true});
  },

  submitChange: function(e) {
    e.preventDefault();
    var newText = $('textArea#annotationEdit').val();
    console.log('new text:', newText)
    var annotation = this.props.annotation;
    annotation.text = newText;
    var ev = new CustomEvent('updateAnnotation', {detail: {targetAnnotation: annotation}})
    document.dispatchEvent(ev);
    this.setState({shouldEditComment: false});
  },

  componentDidMount: function(e) {
    // var THIS = this;
    // // esc and enter functionality
    // $(document).keypress(function(e) {
    //   var key = e.which;
    //   console.log('inside!!!!!!');
    //   if (key == 13) {
    //     console.log('Enter was pushed!', this);
    //     THIS.submitChange(e);
    //     return false;
    //   }
    // });

    // $(document).on('keyup', function(e){
    //   if (e.which == 27) { 
    //     console.log('ESCAPE KEY PRESSED!');
    //     // rerender the annotator view?
    //     $('.annotator-cancel').trigger('click.annotator-editor');
    //   }    
    // }); 
  },


  render: function() {
    var annotation = this.props.annotation;
    var self = this;
    var deleteAnn = function() {
      self.props.deleteAnn(annotation);
    }

    return (
      <div>
        <p onClick={this.goToHighlight}>{annotation.quote}</p>
        {!this.state.shouldEditComment ? <p>{annotation.text}</p> : 
          <form>
            <textArea id="annotationEdit" style={{height: 100+"px", width: 300+"px"}}>
              {annotation.text}
            </textArea>
            <button className='comment-submit-button' onClick={this.submitChange}>Submit</button>
          </form>
          }
        <button className='comment-delete-button' onClick={deleteAnn}>Remove</button>
        <button className='comment-edit-button' onClick={this.editComment}>Edit</button>
      </div>
    )
  }
});


module.exports = annotationComment;