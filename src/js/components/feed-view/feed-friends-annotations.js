var React = require('react');
var AnnotationLink = require('./feed-friends-annotationlink');

var FriendsAnnotations = React.createClass({

  getInitialState: function() {
    return {
      info: {
        uri: 'http://blogs.scientificamerican.com/guest-blog/presidential-candidates-who-believes-in-climate-change/',
        title: 'Presidential Candidates: Who Believes in Climate Change?',
        profPic: 'https://scontent-lax3-1.xx.fbcdn.net/hphotos-xpa1/t31.0-8/q87/s960x960/980347_10201703421134973_1425263140_o.jpg',
        name: 'Irving Barajas',
        user_id: '2'
      }
    }
  },

  render: function() {
    return (
      <AnnotationLink info={this.state.info} />
    );
  },

  componentDidMount: function() {
    // AJAX calls
  }

});

module.exports = FriendsAnnotations;
