var config = require('./config');
var moment = require('moment');
let Harvest = require('harvest'),
	harvest = new Harvest({
    subdomain: config.subdomain,
    email: config.email,
    password: config.password
  });
var Users = harvest.users;
var Reports = harvest.reports;
var userIds = [];
var userNames = [];
var idNumber = 0;
var repeat = 0;

Users.get({id: ''}, function(err, people) {
  if (err) throw new Error(err);
  for(idNumber; idNumber < people.body.length; idNumber++) {
    userIds.push(people.body[idNumber].user.id);
    userNames.push(people.body[idNumber].user.first_name + ' ' + people.body[idNumber].user.last_name);
  }
  var Timer = setInterval(function() {getRequest()}, 200);
  function getRequest() {
    Reports.timeEntriesByUser(userIds[repeat], {to: new moment().subtract(1, 'd').toDate(), from: new moment().subtract(6, 'd').toDate()}, function(err, tasks) {
      if (err) throw new Error(err);
      var billableHours = 0;
      var totalHours = 0;
      for(x = 0; x < tasks.body.length; x++) { //Repeat for every entry
        totalHours += tasks.body[x].day_entry.hours; //Add hours worked to totalHours
          if(tasks.body[x].day_entry.is_billed) { //If hours are billable add them to billableHours
            billableHours += tasks.body[x].day_entry.hours;
          }
        }
      console.log(repeat);
      console.log(userNames[repeat]);
      console.log(billableHours);
      console.log(totalHours);
      repeat++;
      if(repeat == idNumber){
        clearInterval(Timer);
      }
    });
  }
});