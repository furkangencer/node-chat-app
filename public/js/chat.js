var socket = io(); // We're making the request from the client to the server to open up a web socket and keep that connection open.

function scrollToBottom() {
    var messages = $("#messages");
    var newMessage = messages.children("li:last-child");

    var clientHeight = messages.prop("clientHeight");
    var scrollTop = messages.prop("scrollTop");
    var scrollHeight = messages.prop("scrollHeight");
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function() {
    // console.log('Connected to server');
    var params = $.deparam(window.location.search);

    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = "/";
        }else {
            console.log('No error');
        }
    })
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('updateUserList', (users) => {
    var ol = $('<ol></ol>');
    users.forEach((user) => {
        ol.append($('<li></li>').text(user));
    });

    $('#users').html(ol);
});

socket.on('newMessage', function(message) {
    // console.log('newMessage', message);
    var formattedTime = moment(message.createdAt).format('kk:mm');
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    $('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
    // console.log('newLocationMessage', message);
    var formattedTime = moment(message.createdAt).format('kk:mm');
    var template = $('#location-message-template').html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });

    $('#messages').append(html);
    scrollToBottom();
});

$('#message-form').on('submit', function (e) {
    e.preventDefault();

    var messageTextbox = $('[name=message]');

    socket.emit('createMessage', {
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