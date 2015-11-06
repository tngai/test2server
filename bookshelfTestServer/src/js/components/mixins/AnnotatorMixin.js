var React = require('react');

var AnnotatorMixin = {

  componentWillMount: function() {
    console.log('Mounted inside bro!');
    $(document).on('click', 'body', function() {
        // console.log('clicked on body!!', this)
        // updateView('showAnnotatorButton');
    });
  }

};

module.exports = AnnotatorMixin;
