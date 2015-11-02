var React = require('react');
var HomeButton = require('../annotator-view/home-button');
var AnnotatorMinimizeButton = require('../annotator-view/annotator-minimize-button');
var MyAnnotationsButton = require('./my-annotations-button');
var FriendAnnotationList = require('./friends-annotationList');

var FriendsAnnotationsView = React.createClass({
  getInitialState: function() {
    return {
      annotations: [],
      friends: {}
    }
  },
  componentWillMount: function() {
    console.log('friends annotaions mounted');
    var THIS = this;
    $(document).on('click', 'body', function(e) {
      console.log('e is : ', e);
      // highlighter click check
      if(getSelection().toString()) {
        return;
      }
      if($(e.target).attr('data-reactid')) {
        e.preventDefault();
        return;
      }
      if($(e.target).is('[class^="annotator-"]') || $(e.target).is('[id^="annotator-"]')) {
          e.preventDefault();
          return;
      }
      THIS.props.updateView('showAnnotatorButton');
    });
  },

  componentWillUnmount: function() {
    console.log('friends annotaions mounted unmounted');
    $(document).off();
  },

  toggleFriendAnnotations: function(id) {
    debugger;
    console.log('toggleFriendAnnotations: ', id)
    var friends = this.state.friends;

    if (!friends[id]) {
      var ev = new CustomEvent('getFriendAnnotations', {detail: {userId: id}});
      document.dispatchEvent(ev);
      console.log('friends are now', this.state.friends);
      console.log(friends[id], ' stored in chrome now')
    } else {
      console.log('friends are now', this.state.friends);
      var targetAnnotations = [];
      for (var i = 0; i < this.state.annotations.length; i++) {
        console.log(this.state.annotations[i]);
        if (this.state.annotations[i].user_id.toString() === id) {
          targetAnnotations.push(this.state.annotations[i]);
        }
      }
      var ev = new CustomEvent('deleteRender', {detail: {
        targetAnnotations: targetAnnotations
      }});
      document.dispatchEvent(ev);
    }
  },

  render: function() {
    var ownId = window.localStorage.getItem('user_id');
    var friendsArray = Object.keys(this.state.friends);
    var self = this;

    var friendCarousel = friendsArray.map(function(friend, index) {
      if (friend !== ownId) {
        return (
          <div className='friends-pic' data-id={friend} onClick={self.toggleFriendAnnotations.bind(null, friend)}></div>
        )
      }
    })

    console.log('inside-friendsview, annotations:', this.state.annotations)

    return (
      <div className='friends-annotations-view-container'>
        <div className='friends-annotations-buttons-container'>
          <AnnotatorMinimizeButton {...this.props} />
          <MyAnnotationsButton toggleFriendAnnotations={this.toggleFriendAnnotations} />
          <HomeButton {...this.props} />
        </div>

        <div className='friends-container'>
          {friendCarousel}
        </div>
        <div className='friends-annotations-list'>
          {this.state.annotations.length > 0 ? <FriendAnnotationList friends={this.state.friends} annotations={this.state.annotations}/> : null}
        </div>
      </div>
    );
  },

  componentDidMount: function() {
    debugger;
    console.log('friend annotations view mounted');
    var self = this;
    var ownId = window.localStorage.getItem('user_id');
    var uri = window.location.href.split("?")[0];
    if (uri.substring(uri.length-11) === 'onwords1991') {
      uri = uri.substring(0, uri.length-13);
    } else {
      uri = uri;
    }

    var annotations = [];
    var friends = {};

    $.get('https://onwords-test-server.herokuapp.com/api/search/uri', {uri: uri})
      .done(function(data) {
        chrome.storage.local.get(uri, function(obj) {
          debugger;
          if(obj[uri]) {
            for (var i = 0; i < obj[uri].length; i++) {
              friends[obj[uri][i].user_id] = true;
            }
            annotations = obj[uri];
          }
          for (var i = 0; i < data.rows.length; i++) {
            if (friends[data.rows[i].user_id] === undefined) {
              friends[data.rows[i].user_id] = false;
            }
          }
          self.setState({annotations: annotations, friends: friends});
      })
    })


    chrome.storage.onChanged.addListener(function(changes) {
      debugger;
      if (changes[uri]) {
        var newFriends = {};
        var oldFriends = self.state.friends;
        console.log('chrome storage changed mothafucka', changes);
        if (changes[uri].newValue.length > 0) {
          for (var i = 0; i < changes[uri].newValue.length; i++) {
            newFriends[changes[uri].newValue[i].user_id] = true;
          }
        }

        for (var friend in oldFriends) {
          if (newFriends[friend] === undefined) {
            newFriends[friend] = false;
          }
        }
        self.setState({annotations: changes[uri].newValue, friends: newFriends});
      }
    })
  }
});

module.exports = FriendsAnnotationsView;
