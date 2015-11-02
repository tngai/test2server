var React = require('react');
var MinimizeButton = require('./minimize-button');
var Header = require('../header/header');
var AnnotatorMixin = require('../mixins/annotatormixin');
var SettingsButton = require('./settings-button');
var HomeButton = require('./feed-home-button');
var FriendsButton = require('./feed-friends-button');
var SearchButton = require('./feed-search-button');
var Settings = require('./feed-settings');
var MyAnnotations = require('./feed-my-annotations');
var FriendsAnnotations = require('./feed-friends-annotations');
var SearchView = require('./feed-search-view');

var FeedView = React.createClass({
  getInitialState: function() {
    return {
      showSettingsPage: false,
      showFriendsAnnotations: true, 
      showMyAnnotations: false,
      showSearchView: false     
    };
  },
  componentWillMount: function() {
    console.log('FeedView mounted');
    var THIS = this;
    $(document).on('click', 'body', function(e) {
        if($(e.target).attr('data-reactid')){
            e.preventDefault();
            return;
        }
        THIS.props.updateView('showAnnotatorButton');
    });
  },
  componentWillUnmount: function() {
    console.log('FeedView componentWillUnmount');
    $(document).off();
  },
  updateBodyView: function(action) {
    switch(action) {
      case 'showSettingsPage':
        console.log('showSettingsPage');
        this.setState({showSettingsPage: true});
        this.setState({showFriendsAnnotations: false});
        this.setState({showMyAnnotations: false});
        this.setState({showSearchView: false});
        break;
      case 'showFriendsAnnotations':
        console.log('showFriendsAnnotations');
        this.setState({showSettingsPage: false});
        this.setState({showFriendsAnnotations: true});
        this.setState({showMyAnnotations: false});
        this.setState({showSearchView: false});
        break;
      case 'showMyAnnotations':
        console.log('showMyAnnotations');
        this.setState({showSettingsPage: false});
        this.setState({showFriendsAnnotations: false});
        this.setState({showMyAnnotations: true});
        this.setState({showSearchView: false});
        break;
      case 'showSearchView':
        console.log('showSearchView');
        this.setState({showSettingsPage: false});
        this.setState({showFriendsAnnotations: false});
        this.setState({showMyAnnotations: false});
        this.setState({showSearchView: true});
        break;
      default:
        console.log('nothing happened');
    }
  },
  render: function() {
    return (
      <div className='feed-view-container'>
        <div className='header-container'>
          <MinimizeButton {...this.props} />
          <div>Onwords</div>
        </div>

        <div className='body-container'>

          <div className='button-container'>
            <HomeButton {...this.props} updateBodyView={this.updateBodyView} />
            <FriendsButton {...this.props} updateBodyView={this.updateBodyView} />
            <SearchButton {...this.props} updateBodyView={this.updateBodyView} />
            <SettingsButton {...this.props} updateBodyView={this.updateBodyView} />
          </div>

          {this.state.showFriendsAnnotations ? <FriendsAnnotations {...this.props} updateBodyView={this.updateBodyView} /> : null}
          {this.state.showMyAnnotations ? <MyAnnotations {...this.props} updateBodyView={this.updateBodyView} /> : null}
          {this.state.showSearchView ? <SearchView {...this.props}  updateBodyView={this.updateBodyView} /> : null}
          {this.state.showSettingsPage ? <Settings {...this.props}  updateBodyView={this.updateBodyView} /> : null}
        </div>
      </div>
    );
  }
});

module.exports = FeedView;
