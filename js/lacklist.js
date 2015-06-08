var url = 'data/lack.csv';
d3.csv(url, function(error, data) {
  if(error) {
    data = null;
  }

  var sortedData = sortLackList(data);
  var lackcount = sortedData.length;
  var lackingTill = new Date(sortedData[0].date);
  var lackingFrom = new Date(sortedData[lackcount - 1].date);
  var lackSummary = getLacksSummary(lackcount, lackingFrom, lackingTill);
  d3.select('.lackcount').html(lackSummary);

  var lacklist = d3.select('ul#lacklist');
  
  var lacks = lacklist.selectAll('li')
  .data(sortedData)
  .enter().append('li');

  lacks.append('span')
  .text(function(d) {
    var dateString = new Dumbdate(d.date).toDumbString();
    return dateString + ' // ';
  })

  lacks.append('a')
  .html(function(d) {
    return d.getHighlightedTitle();
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
    var provider = d.toFormatedUrlProvider(' (', ') ');
    return provider;
  })
  .style('color', 'darkgrey')
  .attr('class', 'spaced');

  lacks.selectAll('small')
  .data(function(d) {
    var tags = d.getTags();
    tags.unshift('');
    return tags;
  })
  .enter().append('small')
  .text(function(d) {
    return '[' + d + ']';
  })
  .attr('class', 'spaced')
  .style('color', 'darkgrey');

  lacks.append('small')
  .attr('class', 'spaced')
  .append('a')
  .style('color', 'crimson')
  .text('share')
  .attr('class', 'spaced')
  .attr('href', function(d) {
    var lackTitle = d.getLackTitle();

    var twitterShare = 'https://twitter.com/intent/tweet?button_hashtag=TodayWeLack&text=' + lackTitle + '&url=http://bit.ly/1IxwaLE';
    return twitterShare;  
  });
});

function sortLackList(data) {
  var list = data.map(function(element) {
    var lackitem = new Lackitem(element);
    lackitem.mineUrlForTags();
    return lackitem;
  });
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

function getLacksSummary(lackcount, from, to) {
  var summary = 'There have been <b>' 
  + lackcount
  + '</b> moments when India was lacking something, between '
  + from.getFullYear() + ' and '
  + to.getFullYear() + '.';
  return summary;
}