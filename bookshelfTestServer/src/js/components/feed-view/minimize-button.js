var React = require('react');

var MinimizeButton = React.createClass({
  handleClick: function() {
    this.props.updateView('showAnnotatorView');
  }, 
  render: function() {
    return (
      <div onClick={this.handleClick}>
        <img className='minimize-button' src={chrome.extension.getURL('/assets/right-copy.png')} />
      </div>
    );
  }
});

module.exports = MinimizeButton;