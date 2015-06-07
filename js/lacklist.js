var url = 'data/lack.csv';
d3.csv(url, function(error, data) {
  if(error) {
    data = null;
  }
  console.log(data);

  var sortedData = sortLackList(data);

  var lacklist = d3.select('ul#lacklist');
  
  var lacks = lacklist.selectAll('li')
  .data(sortedData)
  .enter().append('li');

  lacks.append('span')
  .text(function(d) {
    var date = new Date(d.date);
    
    var dateString = date.toDateString();
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
});

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