var React = require('react');

var FeedSearchList = React.createClass({
  getInitialState: function() {
    return {
      results: []
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var urlPrefix = 'https://onwords-test-server.herokuapp.com/api/users';
  /*  // var ownId = window.localStorage.getItem('user_id');
    // var userIdQS = '?user_id=' + ownId;
    // var fullNameQS = '&full_name=' + this.props.fullName;
    // var url = urlPrefix + userIdQS + fullNameQS;  */
    var fullNameQS = '?full_name=' + nextProps.fullName;
    var url = urlPrefix + fullNameQS;
    if (nextProps.fullName) {
      $.get(url, function(data) {
        this.setState({results: data.rows});
      }.bind(this));
    }
  },
  handleClick: function(evt) {
    console.log('this is what is clicked ', evt);
  },
  render: function() {
    var feedSearchResults = this.state.results.map(function(result, index) {
      var picUrl = result.pic_url;
      var fullName = result.full_name;
      var description = null;
      if (description === null) {
        description = "I am an annotator!";
      }
      // var isFollowing = result.isFollowing;

      // var follow = <button className="feed-search-follow">Follow</button>;
      // var following = <button className="feed-search-following">Following</button>;
      // var editSettings = ;
      return (
        <li className="feed-search-result" key={index} onClick={this.handleClick} >
          <div className="feed-search-img"><img src={picUrl} /></div>
          <div className="feed-search-name">{fullName}</div>
          {/* {isFollowing ? follow : following} */}
        </li>
      );
    });

    return (
      <ul className='feed-search-results'>
        {feedSearchResults}
      </ul>
    );
  }
});

module.exports = FeedSearchList;