chatModule.controller('chatCtrl', ['chatFtry', '$scope', '$log',
  function(chatFtry, $scope, $log) {
    $log.log('Chat controller connected');

    var socket = chatFtry.socket;

    $scope.errors = {};
    $scope.success = {};
    $scope.haveName = false;
    
    // get users connected
    socket.on('users', function(users){
      console.log("Users obtained from server: " + users);
      $scope.$apply(function(){
        $scope.users = users;
      });
    });
    
    // check if user name is blank
    $scope.checkUser = function(name){
      if (name.length > 0) return true;
      else return false;
    };
    
    // send message
    $scope.sendMessage = function() {
      if(this.message.length > 0){
        var date = new Date();
        console.log("Sending message over socket: " + this.message);
        socket.emit('message', this.message, this.name, date);
        this.message = "";
      }
    };
    
    // receive message
    socket.on('message', function(message, name, date){
      $log.log("Received message on socket from server: " + message + " from " + name);
      var rehydrate = new Date(date);
      $scope.$apply(function(){
        $scope.messages.push({user: name, message: message, date: rehydrate.toLocaleDateString() , 
        time: rehydrate.toLocaleTimeString()});
      });
    });

    // create nickname
    $scope.changeName = function() {
      
      // if user does not enter a name
      if (this.newName.length == 0){
        this.errors.nameMessage = "Please enter a chat room name";
        clearErrorMessages();
      
      // if user enters a really long name
      }else if (this.newName.length > 15) {
        this.errors.nameMessage = "Your chat room name is larger than 15 characters";
        clearErrorMessages();
      
      // if user enters a valid name  
      }else {
        this.success.nameMessage = "Name changed";
        this.name = this.newName;
        chatFtry.changeName(this.newName);
        this.haveName = true;
        clearSuccessMessages();
      }
    };

    // clear Error Messages --timeout
    var clearErrorMessages = function() {
      $scope.newName = "";
      setTimeout(function() {
        $scope.errors = {};
        $scope.$apply();
      }, 4000);
    };
    
    // clear Success Messages --timeout
    var clearSuccessMessages = function() {
      $scope.newName = "";
      setTimeout(function() {
        $scope.success = {};
        $scope.$apply();
      }, 4000);
    };
  }
]);
