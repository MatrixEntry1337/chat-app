var chatModule = angular.module('chat', []);

chatModule.factory('chatFtry', ['$http', '$log', function($http, $log) {
  $log.log("Chat Factory connected");
  
  var chat = {};
  chat.messages = [];
  chat.users = [];
  chat.name = "";
  
  // chat.socket = io(); // Socket - create socket for user.
  chat.socket = io.connect({ query: "_name=" + chat.name }); //Connect with chat nickname

  chat.changeName = function(name){
    console.log("Received name change in factory: " + name);
    this.socket.emit('changeName', name);
    this.name = name;
  };
  
  return chat;
}]);