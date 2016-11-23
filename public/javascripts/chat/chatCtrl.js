chatModule.controller('chatCtrl', ['chatFtry', '$scope', '$log',
  function(chatFtry, $scope, $log) {
    $log.log('Chat controller connected');

    $scope.errors = {};
    $scope.success = {};
    $scope.haveName = false;

    //Send message
    $scope.sendText = function() {
      console.log(this.text);
      chatFtry.sendText(this.text);
      this.text = "";
    };

    // Create Chat Room name
    $scope.changeName = function() {
      
      // If user does not enter a name
      if (this.newName.length == 0){
        this.errors.nameMessage = "Please enter a chat room name";
        clearErrorMessages();
      
      // If user enters a really long name
      }else if (this.newName.length > 15) {
        this.errors.nameMessage = "Your chat room name is larger than 15 characters";
        clearErrorMessages();
      
      // If user enters a valid name  
      }else {
        this.success.nameMessage = "Name changed";
        this.name = this.newName;
        chatFtry.changeName(this.newName);
        clearSuccessMessages();
      }
    };

    // Clear Error Messages --timeout
    var clearErrorMessages = function() {
      $scope.newName = "";
      setTimeout(function() {
        $scope.errors = {};
        $scope.$apply();
      }, 4000);
    };
    
    // Clear Success Messages --timeout
    var clearSuccessMessages = function() {
      $scope.newName = "";
      setTimeout(function() {
        $scope.success = {};
        $scope.$apply();
      }, 4000);
    };
  }
]);
