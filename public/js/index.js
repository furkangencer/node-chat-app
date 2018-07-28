var socket = io(); // We're making the request from the client to the server to open up a web socket and keep that connection open.

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
    // console.log('newMessage', message);
    var formattedTime = moment(message.createdAt).format('kk:mm');
    var spanFormattedTime = $(`<span style="color: #c7c7c7;"> - ${formattedTime}</span>`);
    var li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`).append(spanFormattedTime);

    $('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
    // console.log('newLocationMessage', message);
    var formattedTime = moment(message.createdAt).format('kk:mm');
    var spanFormattedTime = $(`<span style="color: #c7c7c7;"> - ${formattedTime}</span>`);
    var li = $('<li></li>');
    var a = $('<a target="_blank">My current location</a>');
    li.text(`${message.from}: `);
    a.attr("href", message.url);
    li.append(a).append(spanFormattedTime);
    $('#messages').append(li);
});

$('#message-form').on('submit', function (e) {
    e.preventDefault();

    var messageTextbox = $('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val('');
    })
});

var locationButton = $('#send-location');
locationButton.on('click', function (e) {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.')
    }

    locationButton.prop("disabled", true).text('Sending location...');

    //Takes two functions: one for success, one for error
    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.prop("disabled", false).text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function () {
        locationButton.prop("disabled", false).text('Send location');
        alert('Unable to fetch location');
    })
});