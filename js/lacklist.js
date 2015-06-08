var url = 'data/lack.csv';
d3.csv(url, function(error, data) {
  if(error) {
    data = null;
  }
  console.log(data);

  var sortedData = sortLackList(data);
  var lackcount = sortedData.length;
  var countString = 
  'There have been <b>' + lackcount + '</b> moments when India was lacking.'
  d3.select('.lackcount').html(countString);

  var lacklist = d3.select('ul#lacklist');
  
  var lacks = lacklist.selectAll('li')
  .data(sortedData)
  .enter().append('li');

  lacks.append('span')
  .text(function(d) {
    var date = new Date(d.date);

    var dateString = date.toDateString();
    return dateString.substring(4) + ' // ';
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

  // lacks.append('small')
  // .html('<a href="">share</a>')
  // .attr('class', 'spaced');
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