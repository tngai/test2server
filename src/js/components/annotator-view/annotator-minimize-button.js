var React = require('react');

var AnnotatorMinimizeButton = React.createClass({
  handleClick: function() {
    this.props.updateView('showAnnotatorButton');
  },
  render: function() {
    return (
      <div onClick={this.handleClick}>
        <img className='annotator-minimize-button' src={chrome.extension.getURL('/assets/right-copy.png')} />
      </div>
    );
  }
});

module.exports = AnnotatorMinimizeButton;