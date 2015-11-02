var React = require('react');

var FeedSearchButton = React.createClass({
  handleClick: function() {
    this.props.updateBodyView('showSearchView');
  },
  render: function() {
    return (
      <div onClick={this.handleClick} className='feed-button'>
        <img className='feed-button' src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Feedbin-Icon-home-search.svg/2000px-Feedbin-Icon-home-search.svg.png' />
      </div>
    );
  }
});

module.exports = FeedSearchButton;
