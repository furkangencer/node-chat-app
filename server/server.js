const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are reqired. ');
        }

        socket.join(params.room);
        //socket.leave(params.room);

        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

        //This will send the event to anybody in the room except this socket;
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined`));


        callback();
    });
    
    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);

        //This will send the event to everybody
        io.emit('newMessage', generateMessage(message.from, message.text));

        //Acknowledgement - Tell the client that server has received the message.
        callback(); //callback('This is from the server');
    });

    socket.on('createLocationMessage', (coords) => {
        console.log(generateLocationMessage('Admin', coords.latitude, coords.longitude));
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }
    });

});

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});