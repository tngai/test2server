var React = require('react');

var AnnotatorMinimizeButton = React.createClass({
  handleClick: function() {
    this.props.updateView('showAnnotatorButton');

    // image rendering from files
    // src={chrome.extension.getURL('/assets/right-copy.png')} 
  },
  render: function() {
    return (
      <div onClick={this.handleClick} className='annotator-my-view-button-container' >
        <img className='annotator-my-view-button' src={chrome.extension.getURL('/assets/right-copy.png')} />
      </div>
    );
  }
});

module.exports = AnnotatorMinimizeButton;
