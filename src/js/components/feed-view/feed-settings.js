var React = require('react');

var Settings = React.createClass({
  getInitialState: function(){
    return {
      description: "Onwords!",
      editPicUrl: false,
      editUsername: false,
      editDescription: false
    };
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
  updateServer: function(options){ 
    return $.ajax({
      url: "http://localhost:8000/api/users/update",
      method: "post",
      data: options,
      dataType: 'json'
  });
    
  },
  handleSubmit: function(e){
    if(e.charCode == 13) { 
      switch (e.target.dataset.setting) {
        case 'picUrl':
          this.setState({
            pic_url: e.target.value,
            editPicUrl: false
          }); 
          break;
        case 'username':
          this.setState({
            username: e.target.value,
            editUsername: false
          });
          break;
        case 'description':
          this.setState({
             description: e.target.value,
             editDescription: false
           });
          break;
      }
    }
  },
  handleClick: function(e) {  
    switch (e.target.dataset.setting) {
      case 'pic':
        if(this.state.editPicUrl){
          this.setState({editPicUrl:false})
          break;
        }
        this.setState({editPicUrl: true});
        break;
      case 'username':
        if(this.state.editUsername){
            this.setState({editUsername:false})
            break;
        }
        this.setState({editUsername: true});
        break;
      case 'description':
        if(this.state.editDescription){
            this.setState({editDescription:false})
            break;
        }
        this.setState({editDescription: true});
        break;
    }  
  },
  render: function() {

    return (
      <div className="settings-view-container">
        <div className="picture-settings">
          <img id="profile-pic" src={this.state.pic_url} /> 
          <button type="submit" onClick={this.handleClick} >
            <img data-setting="pic" className= "settings-profile-edit-icon" src="https://icons.iconarchive.com/icons/custom-icon-design/mono-general-2/512/edit-icon.png" alt="profile pic" />
          </button>
          {this.state.editPicUrl ? <input type="text" placeholder={this.state.pic_url} data-setting="picUrl" onKeyPress={this.handleSubmit} /> : null}
        </div>
        <div className="username-settings">
          {this.state.username} 
          <button type="submit" onClick={this.handleClick}>
            <img data-setting="username" className="settings-profile-edit-icon" src="https://icons.iconarchive.com/icons/custom-icon-design/mono-general-2/512/edit-icon.png" />
          </button> 
          {this.state.editUsername ? <input type="text" placeholder={this.state.username} data-setting="username" onKeyPress={this.handleSubmit} /> : null}
        </div>

        <div className="settingsdescription-settings">
          Description: {this.state.description} 
          <button  type="submit" onClick={this.handleClick}>
            <img data-setting="description" className="settings-profile-edit-icon" src="https://icons.iconarchive.com/icons/custom-icon-design/mono-general-2/512/edit-icon.png" />
          </button> 
          {this.state.editDescription ? <input type="text" placeholder={this.state.description} data-setting="description" onKeyPress={this.handleSubmit} /> : null}
        </div>
      </div>
    );
  }
});

module.exports = Settings;