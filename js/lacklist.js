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
  var lackcount = sortedData.length;
  var lackingTill = new Date(sortedData[0].date);
  var lackingFrom = new Date(sortedData[lackcount - 1].date);
  var lackSummary = getLacklistSummary(lackcount, lackingFrom, lackingTill);
  d3.select('.lackcount').html(lackSummary);
  display(byYearData(sortedData, '2015'));
});

function displayByYear(year) {
  var data = byYearData(allData, year);
  display(data);
}

function byYearData(data, year) {
  var filteredData = data.filter(function(element) {
    return element.date.startsWith(year);
  });
  return filteredData;
}

function display(data) {
  var lacklist = d3.select('ul#lacklist');
  // lacklist.html("");
  lacklist.selectAll("li").remove();
  

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
    var tags = [];
    tags.unshift('');

    var realTags = d.getTags();
    for(var i = 0; i < realTags.length; i += 1) {
      tags.push(realTags[i]);
    }
    
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
    var lackTitle = d.getLackTitle(true);
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
  return matrix;
}

function computeTfIdf(documentVector) {
  var getWords = function(docVector) {
    var words = [];
    for(var i = 0; i < docVector.length; i += 1) {
      var document = docVector[i];
      if(document === null) continue;
      for(var j = 0; j < document.length; j += 1) {
        var word = document[j];
        if(word === null 
            || word === undefined 
            || word.length === 0
            || words.indexOf(word) != -1) {
          continue;
        }
        words.push(word);
      }
    }
    return words;
  }

  var getTfVector = function(docVector, words) {
    var tfs = [];
    for(var i = 0; i < words.length; i += 1) {
      var word = words[i];
      var count = 0;
      for(var j = 0; j < docVector.length; j += 1) {
        if(docVector[j].indexOf(word) != -1) count += 1;
      }
      tfs.push(count);
    }
    return tfs;
  }

  var getIdfVector = function(docVector, words) {
    var idfs = [];
    var logDocCount = Math.log(docVector.length);
    for(var i = 0; i < words.length; i += 1) {
      var word = words[i];
      var count = 0;
      for(var j = 0; j < docVector.length; j += 1) {
        if(docVector[j].indexOf(word) != -1) count += 1;
      }
      var idf = logDocCount - (count === 0? 0 : Math.log(count));
      idfs.push(idf);
    }
    return idfs;
  }

  var getScoredWords = function(words, scores) {
    var scoredWords = [];
    for(var i = 0; i < words.length; i += 1) {
      var scoredWord = { 'word':words[i], 'score':scores[i] };
      scoredWords.push(scoredWord);  
    }

    scoredWords.sort(function(a, b) {
      return b.score - a.score;
    });

    return scoredWords;
  }

  var words = getWords(documentVector);
  // console.log(words);
  var wordcount = words.length;
  var tfs = getTfVector(documentVector, words);
  var idfs = getIdfVector(documentVector, words);
  var scores = [];
  for(var i = 0; i < wordcount; i += 1) {
    scores.push(tfs[i] * idfs[i]);
  }
  var scoredWords = getScoredWords(words, scores);
  console.log(scoredWords);
}