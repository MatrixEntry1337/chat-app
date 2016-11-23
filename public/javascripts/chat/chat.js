var chatModule = angular.module('chat', []);

chatModule.factory('chatFtry', ['$http', '$log', function($http, $log) {
  $log.log("Chat Factory connected");
  
  var chat = {};

  //Socket
  chat.socket = io();

  chat.sendText = function(text) {
    console.log("Receieved text in factory: " + text);
  };
  
  chat.changeName = function(name){
    console.log("Received text for name change: " + name);
  };

  return chat;
}]);