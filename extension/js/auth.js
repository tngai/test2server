function fetchToken() {
  var access_token;

  var clientID = 'None';

  var redirectUri = 'https://' + chrome.runtime.id + '.chromiumapp.org/provider_cb';

  var options = {
    'interactive': true,
    url: 'https://www.facebook.com/dialog/oauth?client_id=' + clientID + 
         '&response_type=token&access_type=online&redirect_uri=' + encodeURIComponent(redirectUri) +
         '&scope=email'
  }

  chrome.identity.launchWebAuthFlow(options, function(redirectUri) {

    if (chrome.runtime.lastError) {
      console.log(new Error(chrome.runtime.lastError));
      return;
    }
    
    var string = redirectUri.slice(redirectUri.indexOf('#')+1);
    var pairs = string.split('=');
    var token = pairs[1].split('&');
    var values = {};
    values[pairs[0]] = token[0];
    if (values.hasOwnProperty('access_token')) {
      access_token = values['access_token'];
      fetchFbProfile(access_token);
    }

    chrome.storage.sync.set({'access_token': access_token});
  });
}

chrome.storage.sync.clear();

chrome.browserAction.onClicked.addListener(function() {
  chrome.storage.sync.get('access_token', function(obj) {
    if (!obj['access_token']) {
      fetchToken();
    }
  });
});

function fetchFbProfile(accessToken) {
  var xhr = new XMLHttpRequest();
  var url = 'https://graph.facebook.com/v2.5/me/?fields=id,name,picture,email&access_token=' + accessToken;
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      var resp = JSON.parse(xhr.responseText);
      var profile = {};
      profile.facebook_id = resp.id;
      profile.full_name = resp.name;
      profile.pic_url = resp.picture.data.url;
      profile.email = resp.email;
      sendFbProfile(profile);
    }
  }
  xhr.send();
}

function sendFbProfile(data) {
  var xhr = new XMLHttpRequest();
  var url = 'https://test2server.herokuapp.com/api/users';
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
}
