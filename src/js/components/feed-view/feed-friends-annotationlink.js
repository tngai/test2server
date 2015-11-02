var React = require('react');

var FriendsAnnotationLink = React.createClass({
  render: function() {
    var info = this.props.info
    var redirectUri = info.uri + '#' + info.user_id + 'onwords1991';
    console.log(redirectUri)
    return (
      <div>
        <img className='friends-pic' src={info.profPic}/>
        <p>{info.name}</p>
        <a href={redirectUri} target='blank' className='redirectLink'>{info.title}</a>
      </div>
    )
  },

  componentDidMount: function() {
    $('.redirectLink').click(function(e) {
      e.preventDefault();
      var url = $(this).attr('href');
      window.open(url, '_blank');
    })
  }
});

module.exports = FriendsAnnotationLink;