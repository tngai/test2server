var React = require('react');

var MyAnnotationsLink = React.createClass({
  render: function() {
    var handleClick = this.handleClick;
    var info = this.props.info;
    var urls = info.map(function(annotation, index) {
      console.log('in MyAnnotationsLink', annotation);

      var redirectUri = annotation.uri + '#' + annotation.user_id + 'onwords1991';
      console.log(redirectUri)
      return (
        <div key={index} className='my-annotations-link-container'>
          <a onClick={handleClick} href={redirectUri} target='blank' className='redirectLink'>URL TITLE GOES HERE : {index}</a>
        </div>
      )
    });

    return (
      <div className='my-annotations-links-container'>
        {urls}
      </div>
    )
  },
  componentDidMount: function() {
    console.log('MyAnnotationsLink - componentDidMount');
    $(document).on('click', '.redirectLink', function(e) {
      var url = $(this).attr('href');
      window.open(url, '_blank');  
    });
  },
  componentWillUnmount: function() {
    console.log('MyAnnotationsLink - componentWillUnmount');
    $(document).off();
  },
});

module.exports = MyAnnotationsLink;
