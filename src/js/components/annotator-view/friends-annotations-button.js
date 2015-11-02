var React = require('react');

var FriendsAnnotationsButton = React.createClass({
  handleClick: function() {
    this.props.updateView('showFriendsAnnotations');
  }, 
  render: function() {   
    return (
      <div onClick={this.handleClick} className='friends-annoataions-button-container'>
        <img className='friends-annotations-button' src='http://orig14.deviantart.net/03ef/f/2014/174/5/b/aro_netuno_by_henricksouza-d7norl9.png' />
      </div>
    );
  }
});

module.exports = FriendsAnnotationsButton;
