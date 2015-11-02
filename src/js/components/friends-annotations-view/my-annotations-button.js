var React = require('react');

var MyAnnotationsButton = React.createClass({
    getInitialState: function(){
      return {
        pic_url: 'http://frsports-bucket-0001.s3.amazonaws.com/wp-content/uploads/sites/6/2015/02/26224056/white-llama.jpg'
      }
    },
    componentWillMount: function(){
      chrome.storage.sync.get('user',function(data){
        this.setState({
          pic_url: data.user.picUrl,
          username: data.user.fullName,
          description: data.user.description || 'OnWords  !!  '
        });  
      }.bind(this));
  },
  handleClick: function() {
    var ownId = window.localStorage.getItem('user_id');
    this.props.toggleFriendAnnotations(ownId);
  }, 
  render: function() {   
    return (
      <div onClick={this.handleClick} className='my-annotations-button-container'>
        <img className='my-annotations-button' src={this.state.pic_url} />
      </div>
    );
  }
});

module.exports = MyAnnotationsButton;
