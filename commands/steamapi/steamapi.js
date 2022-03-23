
// NOT USED CURRENTLY WILL FINISH

var request = require('request');
var options = {
  'method': 'POST',
  'url': 'https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/',
  'headers': {
  },
  formData: {
    'itemcount': '1',
    'publishedfileids[0]': '1762551063'
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);


});
