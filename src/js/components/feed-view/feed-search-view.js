var React = require('react');
var FeedSearchList = require('./feed-search-list');

var FeedSearchView = React.createClass({
  getInitialState: function() {
    return {
      text: ''
    };
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var inputVal = React.findDOMNode(this.refs.input).value;
    if (inputVal === '') { return; }
    this.setState({text: inputVal});
  },
  render: function() {
    return (
      <div className='search-view-container'>
        <form onSubmit={this.handleSubmit} className='form-search-container'>
          <input type='text' ref='input' placeholder='Find people to follow...' />
        </form>
        <FeedSearchList fullName={this.state.text} updateBodyView={this.props.updateBodyView} />
      </div>
    );
  }
});

module.exports = FeedSearchView;
