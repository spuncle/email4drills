function removeKeysFromURL(url, keys, keysSplit) {
if (!url) return url;
var keyList = [];
if (keys && (keysSplit = keysSplit || '|', keyList = keys.split(keysSplit)), keyList.length > 0) for (var i = 0; i < keyList.length; i++) url = removeUrlParam(url, keyList[i]);
return url;
}

function removeUrlParam(url, param) {
var segments, base, params, i = 0;
if (!param) return url;
for (base = (segments = (url = url.indexOf('?') >= 0 ? url : '?' + url).split('?'))[0], params = (segments[1] || '').split('&'); i < params.length; ) params[i] && 0 === params[i].indexOf(param) ? params.splice(i, 1) : i++;
return params = params.join('&'), base ? params ? base + '?' + params : base : params;
}

function updateUrlParam(url, param, value) {
return url = removeUrlParam(url, param), value ? url.indexOf('?') >= 0 ? url + '&' + param + '=' + value : url + '?' + param + '=' + value : url;
}

function getUrlParam(url, param) {
var result, i, size, params, part;
for (i = 0, size = (params = (url = url.indexOf('?') >= 0 ? url.split('?')[1] : ('?' + url).split('?')[1]).split('&')).length; i < size; i++) if ((part = params[i].split('='))[0] === param) {
result = part[1];
break;
}
return result;
}

function fileNameSoLong(fileName, size) {
var lengt = fileName.length;
if (lengt > size) {
var le = fileName.lastIndexOf('.');
fileName = fileName.substring(0, size - 1) + '..' + fileName.substring(le, lengt);
}
return fileName;
}

function fGetParamValueByURL(url, param) {
if (!url || 0 == url.length) return '';
if (url.length > 0) {
var i = url.indexOf('?' + param + '=');
-1 == i && (i = url.indexOf('&' + param + '='));
var paramLength = (param + '=').length + 1;
if (-1 != i) {
var endPos = url.indexOf('&', i + paramLength);
return -1 == endPos && (endPos = url.length), decodeURIComponent(url.substring(i + paramLength, endPos));
}
}
return '';
}

function fGetShortURL(moduleURL) {
if (0 == moduleURL.indexOf('../')) return moduleURL.substr('../'.length);
moduleURL = moduleURL.replace(/%40/g, '@');
var contextPattern = 'coremail'.replace('.', '\\.');
return moduleURL.replace(new RegExp('.*/' + contextPattern + '/\\w+/(.*)'), '$1');
}

function getFolderCategory(url) {
var mboxa = fGetParamValueByURL(url, 'mboxa'), folderCategory = '';
return mboxa.indexOf('@') > -1 ? folderCategory = 'shareFolder' : '2' == mboxa && (folderCategory = 'archiveFolder'), folderCategory;
}

String.prototype.trim = function() {
return this.replace(/(^\s*)|(\s*$)/g, '');
}, String.isZipCode = function(zipCode) {
return null != zipCode.match(/^\d{6}$/);
}, String.isNumber = function(number) {
return 0 == number.search(/^\d+$/g);
}, String.prototype.len = function() {
for (var len = 0, i = 0; i < this.length; i++) this.charCodeAt(i) > 255 ? len += 2 : len++;
return len;
}, String.prototype.htmlencode = function() {
var str = this;
return str = (str = (str = (str = (str = str.replace(/&/gi, '&amp;')).replace(/</gi, '&lt;')).replace(/>/gi, '&gt;')).replace(/\"/gi, '&quot;')).replace(/'/gi, '&#039;');
}, String.prototype.endsWith = function(suffix) {
return this.substring(this.length - suffix.length) == suffix;
}, String.prototype.htmldecode = function() {
var str = this;
return str = (str = (str = (str = (str = str.replace(/&amp;/gi, '&')).replace(/&lt;/gi, '<')).replace(/&gt;/gi, '>')).replace(/(&quot;|&#034;)/gi, '"')).replace(/&#039;/gi, '\'');
}, String.prototype.usc_hdc = function() {
return unescape(this.htmldecode());
}, String.prototype.isIncludeChinese = function() {
return this.length != this.replace(/[^\x00-\xff]/g, '**').length;
}, String.prototype.usc_hdc = function() {
return unescape(this.htmldecode());
};
//# sourceMappingURL=common.js.map