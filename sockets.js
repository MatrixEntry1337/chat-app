var socket = require('socket.io');

module.exports.listen = function(app){
  console.log("Socket is up and running!");
  
  var io = socket.listen(app);
  
  io.use(function(socket, next){
    var handshakeData = socket.request;
    // console.log("Middleware: " + handshakeData._query);
    //Code for socket id here
    next();
  });
  
  io.on('connection', function(socket){
    console.log('A new user connected.');
    var handshakeData = socket.request;
    // console.log(handshakeData);
    
    socket.on('message', function(message, name, date){
      console.log("On server, new message received over socket: " + message + " from " + name);
      io.emit('message', message, name, date);
    });
  });
  
  return io;
};