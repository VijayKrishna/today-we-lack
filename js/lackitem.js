var Lackitem = function(rawdata) {
  this.date = rawdata.date;
  this.title = rawdata.title;
  this.url = rawdata.url;
  this.tags = [];
  this.provider = null;
};

Lackitem.prototype.getDate = function() {
  return this.date;
};

Lackitem.prototype.getTitle = function() {
  return this.title;
};

Lackitem.prototype.getUrl = function() {
  return this.url;
};

Lackitem.prototype.mineUrlForTags = function() {
  var urlsplit = this.url.split('//');
  var tagsplit = urlsplit[urlsplit.length - 1].split('/');

  for(var i = 0; i < tagsplit.length - 3; i += 1) {
    var tag = tagsplit[i];
    if(tag === null 
        || tag === undefined 
        || tag.length === 0
        || tag.toLowerCase().indexOf('lack-') != -1) {
      continue;
    }

    this.tags.push(tag);
  }
};

Lackitem.prototype.getTags = function(first_argument) {
  return this.tags;
};

Lackitem.prototype.getUrlProvider = function() {
  if(this.provider != null) return this.provider;

  if(this.url.startsWith('http://timesofindia.indiatimes.com')) {
    this.provider = 'TOI';
  } else {
    this.provider = '';
  }
    
  return this.provider;
};

Lackitem.prototype.toFormatedUrlProvider = function(s, e) {
  var provider = this.getUrlProvider();
  if(provider === '') return '';
  if(s === null || s === undefined) {
    s = '(';
  }

  if(e === null || e === undefined) {
    e = ')';
  }
  return s + provider + e;
};

Lackitem.prototype.getHighlightedTitle = function() {
  var title = this.title;
  if(this.title.search(' lack ') === -1) {
    title = title.replace('Lack ', '<b>Lack ');
  } else {
    title = title.replace(' lack ', ' <b>lack '); 
  }
  return title + '</b>';
};

Lackitem.prototype.getLackTitle = function(shouldFormat) {
  var provider = this.toFormatedUrlProvider('%20-%20%23', '');
  var lackIndex = this.title.search(' lack ');

  var prefix = null;
  if(lackIndex === -1) {
    lackIndex = this.title.search('Lack ');
    prefix = '"';
  } else {
    lackIndex += 1;
    prefix = '"...';
  }

  var lackString = this.title.substring(lackIndex);
  lackString = lackString.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()\?]/g,"");
  lackString = lackString.trim();
  if(shouldFormat === true) {
    lackString = lackString.replace(/\s/g,'%20');
    lackString = prefix + lackString + '"' + provider;
  }
  return lackString;
};