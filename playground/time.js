const moment = require("moment");

var someTimestamp = moment().valueOf();
console.log(someTimestamp);

var createdAt = 1234; //timestamp
var date = moment(createdAt);
// date.add(1, 'years').subtract(9, 'months');
console.log(date.format('MMMM Do YYYY, kk:mm'));