var socket = io(); // We're making the request from the client to the server to open up a web socket and keep that connection open.

socket.on('connect', function() {
    console.log('Connected to server');

    socket.emit('createMessage', {
        from: 'petrucci53',
        text: 'Yup, that works for me.'
    });
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
    console.log('newMessage', message);
});
