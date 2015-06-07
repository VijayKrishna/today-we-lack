var url = 'data/lack.csv';
d3.csv(url, function(error, data) {
  if(error) {
    data = null;
  }
  console.log(data);
  var lacklist = d3.select('ul#lacklist');
  
  var lacks = lacklist.selectAll('li')
  .data(data)
  .enter().append('li');

  lacks.append('span')
  .text(function(d) {
    return d.date + ' // ';
  })

  lacks.append('a')
  .text(function(d) {
    return d.title;
  })
  .attr('href', function(d) {
    return d.url;
  })
  .attr('target', '_blank')
});