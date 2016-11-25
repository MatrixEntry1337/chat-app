var socket = require('socket.io');

// store users
var users = [];


// helper - prints user name 
var printUsers = function(users) {
  console.log("List of users - ");
  users.forEach(function(socket) {
    console.log("Name: " + socket.name);
    console.log("Socket id:  " + socket.id);
  });
};

// helper - find user
var findIndex = function(users, socketId) {
  return users.findIndex(function(user) {
    return user.id == socketId;
  });
};

module.exports.listen = function(app) {
  console.log("Socket is up and running!");

  var io = socket.listen(app);

  // middleware
  io.use(function(socket, next) {
    var handshakeData = socket.request;
    console.log("User socket id: " + socket.id);
    console.log("Chat name: " + handshakeData._query._name);

    // log the data for the user that has just connected
    users.push({
      id: socket.id,
      name: handshakeData._query._name
    });

    // debug - print out the number of users currently connected.
    printUsers(users);
    next();
  });

  // client connect
  io.on('connect', function(socket) {
    console.log('A new user connected.');
    // var handshakeData = socket.request;

    // send updated users
    io.emit('users', users);

    // socket error
    socket.on('error', function() {
      console.log("There was an error with the socket connection.");
    });

    // socket when disconnected
    socket.on('disconnect', function() {
      console.log("Socket disconnected.");

      // debug - find user, delete user, print to verify
      console.log("Socket to disconnect: " + findIndex(users, socket.id));
      users.splice(findIndex(users, socket.id), 1);
      printUsers(users);

      // send updated users
      io.emit('users', users);
    });

    // socket when reconnecting
    socket.on('reconnect', function() {
      console.log("User reconnected.");
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

    // user chat name
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
