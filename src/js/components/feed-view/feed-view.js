var React = require('react');
var MinimizeButton = require('./minimize-button');
var Header = require('../header/header');
var AnnotatorMixin = require('../mixins/annotatormixin');

var FeedView = React.createClass({
  componentWillMount: function() {
    var THIS = this;
    console.log('FeedView mounted');
    $(document).on('click', 'body', function() {
        THIS.props.updateView('showAnnotatorButton');
    });
  },
  componentWillUnmount: function() {
    console.log('FeedView componentWillUnmount');
    $(document).off();
  },
  render: function() {
    return (
      <div className='feed-view-container'>
        <div className='minimize-btn'>
          <MinimizeButton {...this.props} />
        </div>

        <div className='feed-container'>
          Feed DIVS go HERE!!!!
        </div>

      </div>
    );
  }
});

module.exports = FeedView;
