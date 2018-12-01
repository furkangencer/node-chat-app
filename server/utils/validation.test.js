const expect = require('expect');
const {isRealString} = require('./validation');

describe("isRealString", () => {
    it('should reject non-string values', function () {
        var text = 123;
        expect(isRealString(text)).toBe(false);
    });

    it('should reject string with only spaces', function () {
        var text = "  ";
        expect(isRealString(text)).toBe(false);
    });

    it('should allow string with non-space characters', function () {
        var text = "   test   ";
        expect(isRealString(text)).toBe(true);
    });
});