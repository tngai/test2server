var React = require('react');
var AnnotatorView = require('./annotator-view/annotator-view');
var FeedView = require('./feed-view/feed-view');
var AnnotatorButton = require('./annotator-view/annotator-button');
var FriendsAnnotations = require('./friends-annotations-view/friends-annotations-view');

var App = React.createClass({
  getInitialState: function() {
    return {
      showAnnotatorButton: true,
      showAnnotatorView: false,
      showFeedView: false,
      showFriendsAnnotations: false
    };
  },
  componentWillMount: function() {
    console.log('App componentWillMount');
    var THIS = this;
    $(document).on('click', '.annotator-hl', function() {
      THIS.updateView('showAnnotatorView');
    });
  },
  componentDidUpdate: function() {
    console.log('App componentDidUpdate');
    var THIS = this;
    $(document).on('click', '.annotator-hl', function() {
      THIS.updateView('showAnnotatorView');
    });

    $(document).on('keyup', function(e){
      if (e.which == 27) { 
        console.log('ESCAPE KEY PRESSED!');
        $('.annotator-cancel').trigger('click');
      }    
    });
  },
  updateView: function(action){
    var duration = 200;

    switch(action) {
        case 'showAnnotatorButton':
            console.log('showAnnotatorButton!!');
            this.setState({showFriendsAnnotations: false});
            this.setState({showAnnotatorButton: true});
            this.setState({showAnnotatorView: false});
            this.setState({showFeedView: false});
            $('.annotation-sidebar').animate({right: -(565)}, duration);
            break;
        // case 'showFriendsAnnotations':
        //     console.log('showFriendsAnnotations!!');
        //     this.setState({showFriendsAnnotations: true});
        //     this.setState({showAnnotatorButton: false});
        //     this.setState({showAnnotatorView: false});
        //     this.setState({showFeedView: false});
        //     $('.annotation-sidebar').animate({right: -(300)}, 50);
        //     break;
        case 'showAnnotatorView':
            this.setState({showFriendsAnnotations: true});
            this.setState({showAnnotatorButton: false});
            this.setState({showAnnotatorView: false});
            this.setState({showFeedView: false});
            $('.annotation-sidebar').animate({right: -(300)}, 50);
            break;
        case 'showFeedView':
            this.setState({showFriendsAnnotations: false});
            this.setState({showAnnotatorButton: false});
            this.setState({showAnnotatorView: false});
            this.setState({showFeedView: true});
            $('.annotation-sidebar').animate({right: (0)}, duration);
            break;
        default:
            console.log('nothing happened')
    }
  },
  render: function() {
    return (
      <div className='app-container'>      
        {this.state.showAnnotatorButton ? <AnnotatorButton updateView={this.updateView} /> : null}
        {this.state.showAnnotatorView ? <AnnotatorView updateView={this.updateView} /> : null}
        {this.state.showFeedView ? <FeedView updateView={this.updateView} /> : null} 
        {this.state.showFriendsAnnotations ? <FriendsAnnotations updateView={this.updateView} /> : null} 
      </div>
    );
  }
});

module.exports = App;
