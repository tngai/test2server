var React = require('react');

var SettingsButton = React.createClass({
  handleClick: function() {
    this.props.updateBodyView('showSettingsPage');
  },
  render: function() {
    return (
      <div onClick={this.handleClick} className='feed-button'>
        <img className='feed-button' src='https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_settings_48px-128.png' />
      </div>
    );
  }
});

module.exports = SettingsButton;
