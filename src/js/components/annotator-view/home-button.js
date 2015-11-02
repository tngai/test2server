var React = require('react');

var HomeButton = React.createClass({
  handleClick: function() {
    this.props.updateView('showFeedView');
  }, 
  render: function() {   
    return (
      <div onClick={this.handleClick} className='home-button-container'>
        <img className='home-button' src='http://www.clker.com/cliparts/T/W/F/L/n/h/home-png-md.png' />
      </div>
    );
  }
});

module.exports = HomeButton;
