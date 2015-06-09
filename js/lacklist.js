var url = 'data/lack.csv';
var allData = null;
var allCities = null;
d3.csv(url, function(error, data) {
  if(error) {
    data = null;
    return;
  }

  var sortedData = sortLackList(data);
  allData = sortedData;
  allCities = getCityList(sortedData);
  buildTermDocumentMatix(sortedData);
  var lackcount = sortedData.length;
  var lackingTill = new Date(sortedData[0].date);
  var lackingFrom = new Date(sortedData[lackcount - 1].date);
  var lackSummary = getLacklistSummary(lackcount, lackingFrom, lackingTill);
  d3.select('.lackcount').html(lackSummary);
  display(sortedData);
});

function display(data) {
  var lacklist = d3.select('ul#lacklist');
  lacklist.html('');
  
  var lacks = lacklist.selectAll('li')
  .data(data)
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
}

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

function getLacklistSummary(lackcount, from, to) {
  var summary = 'There have been <b>' 
  + lackcount
  + '</b> moments when India was lacking something, between '
  + from.getFullYear() + ' and '
  + to.getFullYear() + '.';
  return summary;
}

function getCityList(lackitems) {
  var cities = [];
  for(var i = 0; i < lackitems.length; i += 1) {
    var tags = lackitems[i].getTags();
    var cityIndex = tags.indexOf('city');
    if(cityIndex === -1) continue;
    var city = tags[cityIndex + 1];
    if(city === null || city === undefined || city.length === 0) {
      continue;
    }

    city = city.toLowerCase();

    if(cities.indexOf(city) === -1) {
      cities.push(city);
    }

  }
  return cities.sort();
}

function buildDocumentVector(lackitems) {
  var matrix = [];
  var formatOpt = false;
  for(var i = 0; i < lackitems.length; i += 1) {
    var lackitem = lackitems[i];
    var lacktitle = lackitem.getLackTitle(formatOpt);
    lacktitle = lacktitle.removeStopWords();
    var lackArray = lacktitle.toLowerCase().split(/\s+/);
    if(lackArray[0] === 'lack') lackArray.shift();
    if(lackArray === null 
        || lackArray === undefined
        || !Array.isArray(lackArray)) {
      lackArray = [];
    }
    matrix.push(lackArray);
  }
  console.log(matrix.length);
}

function computeTfIdf(documentVector) {
  var getWords = function(documentVector) {
    var words = [];
    for(var i = 0; i < documentVector.length; i += 1) {
      var document = documentVector[i];
      if(document === null) continue;
      for(var j = 0; j < document; j += 1) {
        var word = document[j];
        if(word === null || word === undefined || word.length === 0) {
          continue;
        }
        words.push(word);
      }
    }
    return words;
  }

  var tfMatrix = function(documentVector, wordcount) {
    // body...
  }

  var words = getWords(documentVector);
  var wordcount = words.length;

}