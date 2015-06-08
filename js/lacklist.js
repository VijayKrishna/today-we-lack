var url = 'data/lack.csv';
d3.csv(url, function(error, data) {
  if(error) {
    data = null;
  }
  console.log(data);

  var sortedData = sortLackList(data);
  var lackcount = sortedData.length;
  var lackingTill = new Date(sortedData[0].date);
  var lackingFrom = new Date(sortedData[lackcount - 1].date);
  var lackSummary = getLackSummary(lackcount, lackingFrom, lackingTill);
  console.log(lackSummary);
  d3.select('.lackcount').html(lackSummary);

  var lacklist = d3.select('ul#lacklist');
  
  var lacks = lacklist.selectAll('li')
  .data(sortedData)
  .enter().append('li');

  lacks.append('span')
  .text(function(d) {
    // var date = new Date(d.date);

    // var dateString = date.toDateString();
    // dateString = dateString.substring(4);
    var dateString = new Dumbdate(d.date).toDumbString();
    return dateString + ' // ';
  })

  lacks.append('a')
  .html(function(d) {
    var title = d.title.replace(' lack ', ' <b>lack ');
    return title + '</b>';
  })
  .attr('href', function(d) {
    return d.url;
  })
  .attr('target', '_blank')

  // lacks.append('small')
  // .html('<a href="">why?</a>')
  // .attr('class', 'spaced');

  lacks.append('small')
  .text(function(d) {
    var provider = getFormattedProvider(d.url, ' (', ') ');
    return provider;
  })
  .style('color', 'royalblue')
  .attr('class', 'spaced');

  lacks.append('small')
  .attr('class', 'spaced')
  .append('a')
  .style('color', 'crimson')
  .text('share')
  .attr('class', 'spaced')
  .attr('href', function(d) {
    var provider = getFormattedProvider(d.url, '%20-%20', '');
    var lackIndex = d.title.search(' lack ');
    var lackString = d.title.substring(lackIndex + 1);
    lackString = lackString.replace(/\s/g,'%20')
    lackString = '"...' + lackString + '"' + provider;
    var twitterShare = 'https://twitter.com/intent/tweet?button_hashtag=TodayWeLack&text=' + lackString + '&url=http://treestrokes.github.io/today-we-lack';
    return twitterShare;  
  });
});

function getFormattedProvider(url, s, e) {
  var provider = getProvider(url);
  if(provider === '') return '';
  if(s === null || s === undefined) {
    s = '('
  }

  if(e === null || e === undefined) {
    e = ')'
  }
  return s + provider + e;
}

function getProvider (url) {
  if(url.startsWith('http://timesofindia.indiatimes.com')) {
    return 'TOI';
  }

  return '';
}

function sortLackList(list) {
  var sortedList = list.sort(function(a, b) {
    if (a.date > b.date) {
      return -1;
    }
    if (a.date < b.date) {
      return 1;
    }
    return 0;
  });
  return sortedList;
}

function getLackSummary(lackcount, from, to) {
  var summary = 'There have been <b>' 
  + lackcount
  + '</b> moments when India was lacking something, from '
  + from.getFullYear() + ', to '
  + to.getFullYear() + '.';
  return summary;
}

var Dumbdate = function(date_string) {
  this.date_string = date_string;
  this.date_array = date_string.split('-');
}

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