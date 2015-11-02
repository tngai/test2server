var React = require('react');

var FeedHomeButton = React.createClass({
  handleClick: function() {
    this.props.updateBodyView('showMyAnnotations');
  },
  render: function() {
    return (
      <div onClick={this.handleClick} className='feed-button'>
        <img className='feed-button' src='https://cdn3.iconfinder.com/data/icons/black-easy/512/535106-user_512x512.png' />
      </div>
    );
  }
});

module.exports = FeedHomeButton;
