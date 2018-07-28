var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate the correct message object', function () {
        var from = 'jen';
        var text = 'Some message';
        var message = generateMessage(from, text);
        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({
            from,
            text
        })
    });
});

describe('generateLocationMessage', () => {
    it('should generate the correct location message object', function () {
        var from = 'chris';
        var lat = '12';
        var lng= '11';
        var url = 'https://www.google.com/maps?q=12,11';
        var message = generateLocationMessage(from, lat, lng);
        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({
            from,
            url
        })
    });
});