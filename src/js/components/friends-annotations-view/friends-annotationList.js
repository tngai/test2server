var React = require('react');
var AnnotationComment = require('../annotator-view/annotationComment');
var FriendAnnotationComment = require('./friends-annotationComment');


var friendsAnnotationList = React.createClass({
  deleteAnn: function(annotation) {
    var ev = new CustomEvent('deleteAnnotation', {detail: {
      targetAnnotation: annotation
    }});
    document.dispatchEvent(ev);
  },

  render: function() {
    console.log('hellloooooo, friendsAnnotationList:', this.props.friends);
    debugger;
    var ownId = window.localStorage.getItem('user_id');
    var friends = this.props.friends;
    var annotations = this.props.annotations;
    var self = this;

    var annotationList = annotations.map(function(annotation, index) {
      var user = annotation.user_id;
      console.log('INSIDE FRIEND ANNOTATION LIST: ', annotation.user_id);
        if (friends[user]) {
          return (
            <div>
              <li className="annotation">
                {user.toString() === ownId ? 
                  <AnnotationComment user={annotation.user_id} annotation={annotation} deleteAnn={self.deleteAnn} />
                : <FriendAnnotationComment user={annotation.user} annotation={annotation}/>
                }
              </li>
              <br></br>
            </div>
          )
        }
    });

    return (
      <ul className="annotationList">
        {annotationList}
      </ul>
    )
  }
});

module.exports = friendsAnnotationList;
