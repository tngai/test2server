var React = require('react');
var AnnotatorBody = require('./annotator-body');
var AnnotatorHeader = require('../header/header');
var HomeButton = require('./home-button');
var AnnotatorMinimizeButton = require('./annotator-minimize-button');
var FriendsAnnotationsButton = require('./friends-annotations-button');

var AnnotatorView = React.createClass({
  componentWillMount: function() {
    console.log('AnnotatorView mounted');
    var THIS = this;
    $(document).on('click', 'body', function(e) {
      console.log('e is : ', e);
      // highlighter click check
      if(getSelection().toString()) {
        return;
      }
      if($(e.target).attr('data-reactid')) {
        e.preventDefault();
        return;
      }
      if($(e.target).is('[class^="annotator-"]') || $(e.target).is('[id^="annotator-"]')) {
          e.preventDefault();
          return;
      }
      THIS.props.updateView('showAnnotatorButton');
    });
  },
  componentWillUnmount: function() {
    console.log('AnnotatorView unmounted');
    $(document).off();
  },
  render: function() {
    return (
      <div className='annotator-view-container'>
        <div className='annotator-buttons-container'>
          <AnnotatorMinimizeButton {...this.props} />
          <FriendsAnnotationsButton {...this.props} />
          <HomeButton {...this.props} />
        </div>

        <AnnotatorHeader {...this.props} />
        <AnnotatorBody {...this.props} />
      </div>
    );
  }
});

module.exports = AnnotatorView;
