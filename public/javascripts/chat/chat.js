var chatModule = angular.module('chat', []);

chatModule.factory('chatFtry', ['$http', '$log', function($http, $log) {
  $log.log("Chat Factory connected");
  
  var chat = {};
  // chat.messages = [];
  chat.socket = io(); // Socket - create socket for user.

  chat.changeName = function(name){
    console.log("Received name change in factory: " + name);
    chat.name = name;
  };
  
  return chat;
}]);