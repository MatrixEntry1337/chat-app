var socket = require('socket.io');
// var socketFunctions = require();
var users = [];

// prints list of users 
var printUsers = function(users) {
  if (users.length >= 0) {
    console.log("List of users: ");
    users.forEach(function(socket) {
      console.log("Name: " + socket.name);
      console.log("Socket id:  " + socket.id);
    });
  }
  else
  console.log("No users connected.");
};

// find user
var findIndex = function(users, socketId) {
  return users.findIndex(function(user) {
    return user.id == socketId;
  });
};

//add user to list of users
var addUser = function(id, name) {
  users.push({
    id: id,
    name: name
  });
};


module.exports.listen = function(app) {
  console.log("Socket is up and running!");

  var io = socket.listen(app);

  // middleware
  io.use(function(socket, next) {
    var handshakeData = socket.request;
    addUser(socket.id, handshakeData._query._name);
    printUsers(users);
    next();
  });

  // client connect
  io.on('connect', function(socket) {
    console.log('A new user connected: ' + socket.id);

    // send updated users when new user connects
    io.emit('users', users);

    // socket error
    socket.on('error', function() {
      console.log("There was an error with the socket connection.");
    });

    // socket on disconnect
    socket.on('disconnect', function() {
      console.log("User disconnected: " + users[findIndex(users, socket.id)].name);
      users.splice(findIndex(users, socket.id), 1);
      printUsers(users);
      // send updated users
      io.emit('users', users);
    });

    // socket on reconnect
    socket.on('reconnect', function() {
      var reconDate = new Date();
      var reconUser = users[findIndex(users, socket.id)].name;
      console.log("User reconnected: " + reconUser);
      var reconMessage = reconUser + " has reconnected to the chat room";
      io.emit('reconnect', reconMessage, reconUser, reconDate);
      io.emit('users', users);
    });

    socket.on('getUsers', function() {
      console.log("Grabbing users.");
      var testUsers = "testUsers";
      socket.emit('users', testUsers);
    });

    // gets new message and sends message to everyone
    socket.on('message', function(message, name, date) {
      console.log("On server, new message received over socket: " + message + " from " + name);
      io.emit('message', message, name, date);
    });

    //compute function style message from user
    socket.on('functionMessage', function(message, name, date) {
      // remove whitespace
      message = message.trim();
      // check for function
      var limit = message.search(" ");
      if (limit == -1) {
        if (message == "/me") {
          message = "*I am " + name + "!!";
          console.log("Sending message over socket: " + message);
          io.emit("message", message, null, date);
        }
        else {
          message = "*WHOOPS...wrong function call";
          console.log("Sending message over socket: " + message);
          io.emit("errorMessage", message);
        }
      }
      else {
        var functionExtract = message.slice(0, limit);
        if (functionExtract == "/me") {
          var messageExtract = message.slice(limit);
          message = "*" + name + " " + messageExtract;
          console.log("Sending message over socket: " + message);
          io.emit("message", message, null, date);
        }
        else {
          message = "*WHOOPS...wrong function call";
          console.log("Sending message over socket: " + message);
          io.emit("errorMessage", message);
        }
      }
    });

    // change chat name
    socket.on('changeName', function(name) {
      console.log("User wants to change his name to: " + name);
      users[findIndex(users, socket.id)].name = name;
      // verify changing of name
      printUsers(users);

      //send updated names to users
      io.emit('users', users);
    });

  });

  return io;
};
