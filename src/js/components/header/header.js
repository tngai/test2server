var React = require('react');

var AnnotatorHead = React.createClass({
  render: function() {
    return (
      <div className='annotator-head-container'>
        <div className='user-image-container'>
          <img src='http://frsports-bucket-0001.s3.amazonaws.com/wp-content/uploads/sites/6/2015/02/26224056/white-llama.jpg' className='annotator-user-image' />
        </div>

        <div className='username-container'>Hoonthegoon9000</div>

        <div className='profile-statistics-container'>
          <div className='posts-container'>
            <span className='statistic'>3</span><span>posts</span>
          </div>

          <div className='followers-container'>
            <span className='statistic'>87</span><span>followers</span>
          </div>

          <div className='following-container'>
            <span className='statistic'>33</span><span>following</span>
          </div>
        </div>

        <div className='description-container'>Hi guys, my name is hoon. Im a full time llama. I eat grass and annotate things on the web.</div>
      </div>
    );
  }
});

module.exports = AnnotatorHead;
