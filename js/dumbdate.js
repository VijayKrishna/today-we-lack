var Dumbdate = function(date_string) {
  this.date_string = date_string;
  this.date_array = date_string.split('-');
};

Dumbdate.prototype.getYear = function() {
  return this.date_array[0];
};

Dumbdate.prototype.getMonth = function() {
  return this.date_array[1];
};

Dumbdate.prototype.getDate = function() {
  return this.date_array[2];
};

Dumbdate.prototype.toDumbString = function() {
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var monthIndex = parseInt(this.getMonth()) - 1;
  var monthString = months[monthIndex];
  return monthString + ' ' + this.getDate() + ' ' + this.getYear();
};