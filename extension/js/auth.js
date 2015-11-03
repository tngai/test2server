function fetchToken() {
  debugger;
  var access_token;

  var clientID = '';


  var redirectUri = 'https://' + chrome.runtime.id + '.chromiumapp.org/provider_cb';

  var options = {
    'interactive': true,
    url: 'https://www.facebook.com/dialog/oauth?client_id=' + clientID + 
         '&response_type=token&access_type=online&redirect_uri=' + encodeURIComponent(redirectUri) +
         '&scope=email'
  };

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


chrome.browserAction.onClicked.addListener(function() {
  chrome.storage.sync.clear();
  chrome.storage.local.clear();
  debugger;
  console.log('browserAction clicked');
  chrome.storage.sync.get('access_token', function(obj) {
    debugger;
    if (!obj['access_token']) {
      fetchToken();
    }
  });
});

function fetchFbProfile(accessToken) {
  var xhr = new XMLHttpRequest();
  var urlPrefix = 'https://graph.facebook.com/v2.5/me';
  var urlFields = '?fields=id,name,email,picture.width(100).height(100)';
  var urlSignature = '&access_token=' + accessToken;
  var url = urlPrefix + urlFields + urlSignature;
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
  };
  xhr.send();
}

function sendFbProfile(data) {
  debugger;
  var xhr = new XMLHttpRequest();
  var url = 'https://test2server.herokuapp.com/api/users';
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var resp = JSON.parse(xhr.responseText);
      var user = {
        id: resp.user_id,
        fullName: resp.full_name,
        email: resp.email,
        picUrl: resp.pic_url/*,
        desc: resp.description*/
      };
      chrome.storage.sync.set({'user': user});
    }
  };
  xhr.send(JSON.stringify(data));
}
