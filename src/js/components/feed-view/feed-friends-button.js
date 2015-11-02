var React = require('react');

var FeedFriendsButton = React.createClass({
  handleClick: function() {
    this.props.updateBodyView('showFriendsAnnotations');
  },
  render: function() {
    return (
      <div onClick={this.handleClick} className='feed-button'>
        <img className='feed-button' src='http://www.clker.com/cliparts/T/W/F/L/n/h/home-png-md.png' />
      </div>
    );
  }
});

module.exports = FeedFriendsButton;
