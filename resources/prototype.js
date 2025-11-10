var Prototype = {
Version: '',
ScriptFragment: '(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)',
emptyFunction: function() {},
K: function(x) {
return x;
}
}, Class = {
create: function() {
return function() {
this.initialize.apply(this, arguments);
};
}
}, Abstract = new Object;

Object.extend = function(destination, source) {
for (property in source) destination[property] = source[property];
return destination;
}, Object.inspect = function(object) {
try {
return object == undefined ? 'undefined' : null == object ? 'null' : object.inspect ? object.inspect() : object.toString();
} catch (e) {
if (e instanceof RangeError) return '...';
throw e;
}
}, Function.prototype.bind = function() {
var __method = this, args = $A(arguments), object = args.shift();
return function() {
return __method.apply(object, args.concat($A(arguments)));
};
}, Function.prototype.bindAsEventListener = function(object) {
var __method = this;
return function(event) {
return __method.call(object, event || window.event);
};
}, Object.extend(Number.prototype, {
toColorPart: function() {
var digits = this.toString(16);
return this < 16 ? '0' + digits : digits;
},
succ: function() {
return this + 1;
},
times: function(iterator) {
return $R(0, this, !0).each(iterator), this;
}
});

var Try = {
these: function() {
for (var returnValue, i = 0; i < arguments.length; i++) {
var lambda = arguments[i];
try {
returnValue = lambda();
break;
} catch (e) {}
}
return returnValue;
}
}, PeriodicalExecuter = Class.create();

function $() {
for (var elements = new Array, i = 0; i < arguments.length; i++) {
var element = arguments[i];
if ('string' == typeof element && (element = document.getElementById(element)), 1 == arguments.length) return element;
elements.push(element);
}
return elements;
}

PeriodicalExecuter.prototype = {
initialize: function(callback, frequency) {
this.callback = callback, this.frequency = frequency, this.currentlyExecuting = !1, this.registerCallback();
},
registerCallback: function() {
setInterval(this.onTimerEvent.bind(this), 1e3 * this.frequency);
},
onTimerEvent: function() {
if (!this.currentlyExecuting) try {
this.currentlyExecuting = !0, this.callback();
} finally {
this.currentlyExecuting = !1;
}
}
}, Object.extend(String.prototype, {
stripTags: function() {
return this.replace(/<\/?[^>]+>/gi, '');
},
stripScripts: function() {
return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
},
extractScripts: function() {
var matchAll = new RegExp(Prototype.ScriptFragment, 'img'), matchOne = new RegExp(Prototype.ScriptFragment, 'im');
return (this.match(matchAll) || []).map((function(scriptTag) {
return (scriptTag.match(matchOne) || [ '', '' ])[1];
}));
},
evalScripts: function() {
return this.extractScripts().map(eval);
},
escapeHTML: function() {
return this.replace(/&/gi, '&amp;').replace(/</gi, '&lt;').replace(/>/gi, '&gt;').replace(/\"/gi, '&quot;').replace(/'/gi, '&#039;');
},
unescapeHTML: function() {
var div = document.createElement('div');
return div.innerHTML = this.stripTags(), div.childNodes[0] ? div.childNodes[0].nodeValue : '';
},
toQueryParams: function() {
return this.match(/^\??(.*)$/)[1].split('&').inject({}, (function(params, pairString) {
var pair = pairString.split('=');
return params[pair[0]] = pair[1], params;
}));
},
toArray: function() {
return this.split('');
},
camelize: function() {
var oStringList = this.split('-');
if (1 == oStringList.length) return oStringList[0];
for (var camelizedString = 0 == this.indexOf('-') ? oStringList[0].charAt(0).toUpperCase() + oStringList[0].substring(1) : oStringList[0], i = 1, len = oStringList.length; i < len; i++) {
var s = oStringList[i];
camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
}
return camelizedString;
},
inspect: function() {
return '\'' + this.replace('\\', '\\\\').replace('\'', '\\\'') + '\'';
}
}), String.prototype.parseQuery = String.prototype.toQueryParams;

var $break = new Object, $continue = new Object, Enumerable = {
each: function(iterator) {
var index = 0;
try {
this._each((function(value) {
try {
iterator(value, index++);
} catch (e) {
if (e != $continue) throw e;
}
}));
} catch (e) {
if (e != $break) throw e;
}
},
all: function(iterator) {
var result = !0;
return this.each((function(value, index) {
if (!(result = result && !!(iterator || Prototype.K)(value, index))) throw $break;
})), result;
},
any: function(iterator) {
var result = !0;
return this.each((function(value, index) {
if (result = !!(iterator || Prototype.K)(value, index)) throw $break;
})), result;
},
collect: function(iterator) {
var results = [];
return this.each((function(value, index) {
results.push(iterator(value, index));
})), results;
},
detect: function(iterator) {
var result;
return this.each((function(value, index) {
if (iterator(value, index)) throw result = value, $break;
})), result;
},
findAll: function(iterator) {
var results = [];
return this.each((function(value, index) {
iterator(value, index) && results.push(value);
})), results;
},
grep: function(pattern, iterator) {
var results = [];
return this.each((function(value, index) {
value.toString().match(pattern) && results.push((iterator || Prototype.K)(value, index));
})), results;
},
include: function(object) {
var found = !1;
return this.each((function(value) {
if (value == object) throw found = !0, $break;
})), found;
},
inject: function(memo, iterator) {
return this.each((function(value, index) {
memo = iterator(memo, value, index);
})), memo;
},
invoke: function(method) {
var args = $A(arguments).slice(1);
return this.collect((function(value) {
return value[method].apply(value, args);
}));
},
max: function(iterator) {
var result;
return this.each((function(value, index) {
(value = (iterator || Prototype.K)(value, index)) >= (result || value) && (result = value);
})), result;
},
min: function(iterator) {
var result;
return this.each((function(value, index) {
(value = (iterator || Prototype.K)(value, index)) <= (result || value) && (result = value);
})), result;
},
partition: function(iterator) {
var trues = [], falses = [];
return this.each((function(value, index) {
((iterator || Prototype.K)(value, index) ? trues : falses).push(value);
})), [ trues, falses ];
},
pluck: function(property) {
var results = [];
return this.each((function(value, index) {
results.push(value[property]);
})), results;
},
reject: function(iterator) {
var results = [];
return this.each((function(value, index) {
iterator(value, index) || results.push(value);
})), results;
},
sortBy: function(iterator) {
return this.collect((function(value, index) {
return {
value: value,
criteria: iterator(value, index)
};
})).sort((function(left, right) {
var a = left.criteria, b = right.criteria;
return a < b ? -1 : a > b ? 1 : 0;
})).pluck('value');
},
toArray: function() {
return this.collect(Prototype.K);
},
zip: function() {
var iterator = Prototype.K, args = $A(arguments);
'function' == typeof args.last() && (iterator = args.pop());
var collections = [ this ].concat(args).map($A);
return this.map((function(value, index) {
return iterator(value = collections.pluck(index)), value;
}));
},
inspect: function() {
return '#<Enumerable:' + this.toArray().inspect() + '>';
}
};

Object.extend(Enumerable, {
map: Enumerable.collect,
find: Enumerable.detect,
select: Enumerable.findAll,
member: Enumerable.include,
entries: Enumerable.toArray
});

var $A = Array.from = function(iterable) {
if (!iterable) return [];
if (iterable.toArray) return iterable.toArray();
for (var results = [], i = 0; i < iterable.length; i++) results.push(iterable[i]);
return results;
};

Object.extend(Array.prototype, Enumerable), Array.prototype._reverse = Array.prototype.reverse, Object.extend(Array.prototype, {
_each: function(iterator) {
for (var i = 0; i < this.length; i++) iterator(this[i]);
},
clear: function() {
return this.length = 0, this;
},
first: function() {
return this[0];
},
last: function() {
return this[this.length - 1];
},
compact: function() {
return this.select((function(value) {
return value != undefined || null != value;
}));
},
flatten: function() {
return this.inject([], (function(array, value) {
return array.concat(value.constructor == Array ? value.flatten() : [ value ]);
}));
},
without: function() {
var values = $A(arguments);
return this.select((function(value) {
return !values.include(value);
}));
},
indexOf: function(object) {
for (var i = 0; i < this.length; i++) if (this[i] == object) return i;
return -1;
},
contain: function(arr) {
for (var t = [], i = 0; i < this.length; i++) t['x_' + this[i]] = 1;
for (i = 0; i < arr.length; i++) if (!t['x_' + arr[i]]) return !1;
return !0;
},
reverse: function(inline) {
return (!1 !== inline ? this : this.toArray())._reverse();
},
inspect: function() {
return '[' + this.map(Object.inspect).join(', ') + ']';
}
});

var Hash = {
_each: function(iterator) {
for (key in this) {
var value = this[key];
if ('function' != typeof value) {
var pair = [ key, value ];
pair.key = key, pair.value = value, iterator(pair);
}
}
},
keys: function() {
return this.pluck('key');
},
values: function() {
return this.pluck('value');
},
merge: function(hash) {
return $H(hash).inject($H(this), (function(mergedHash, pair) {
return mergedHash[pair.key] = pair.value, mergedHash;
}));
},
toQueryString: function() {
return this.map((function(pair) {
return pair.map(encodeURIComponent).join('=');
})).join('&');
},
inspect: function() {
return '#<Hash:{' + this.map((function(pair) {
return pair.map(Object.inspect).join(': ');
})).join(', ') + '}>';
}
};

function $H(object) {
var hash = Object.extend({}, object || {});
return Object.extend(hash, Enumerable), Object.extend(hash, Hash), hash;
}

ObjectRange = Class.create(), Object.extend(ObjectRange.prototype, Enumerable), Object.extend(ObjectRange.prototype, {
initialize: function(start, end, exclusive) {
this.start = start, this.end = end, this.exclusive = exclusive;
},
_each: function(iterator) {
var value = this.start;
do {
iterator(value), value = value.succ();
} while (this.include(value));
},
include: function(value) {
return !(value < this.start) && (this.exclusive ? value < this.end : value <= this.end);
}
});

var $R = function(start, end, exclusive) {
return new ObjectRange(start, end, exclusive);
}, Ajax = {
getTransport: function() {
return Try.these((function() {
return new ActiveXObject('Msxml2.XMLHTTP');
}), (function() {
return new ActiveXObject('Microsoft.XMLHTTP');
}), (function() {
return new XMLHttpRequest;
})) || !1;
},
activeRequestCount: 0,
Responders: {
responders: [],
_each: function(iterator) {
this.responders._each(iterator);
},
register: function(responderToAdd) {
this.include(responderToAdd) || this.responders.push(responderToAdd);
},
unregister: function(responderToRemove) {
this.responders = this.responders.without(responderToRemove);
},
dispatch: function(callback, request, transport, json) {
this.each((function(responder) {
if (responder[callback] && 'function' == typeof responder[callback]) try {
responder[callback].apply(responder, [ request, transport, json ]);
} catch (e) {}
}));
}
}
};

if (Object.extend(Ajax.Responders, Enumerable), Ajax.Responders.register({
onCreate: function() {
Ajax.activeRequestCount++;
},
onComplete: function() {
Ajax.activeRequestCount--;
}
}), Ajax.Base = function() {}, Ajax.Base.prototype = {
setOptions: function(options) {
this.options = {
method: 'post',
asynchronous: !0,
parameters: ''
}, Object.extend(this.options, options || {});
},
responseIsSuccess: function() {
return this.transport.status == undefined || 0 == this.transport.status || this.transport.status >= 200 && this.transport.status < 300;
},
responseIsFailure: function() {
return !this.responseIsSuccess();
}
}, Ajax.Request = Class.create(), Ajax.Request.Events = [ 'Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete' ], 
Ajax.Request.prototype = Object.extend(new Ajax.Base, {
initialize: function(url, options) {
this.transport = Ajax.getTransport(), this.setOptions(options), this.request(url);
},
request: function(url) {
var parameters = this.options.parameters || '';
parameters.length > 0 && (parameters += '&_=');
try {
this.url = url, 'get' == this.options.method && parameters.length > 0 && (this.url += (this.url.match(/\?/) ? '&' : '?') + parameters), 
Ajax.Responders.dispatch('onCreate', this, this.transport), this.transport.open(this.options.method, this.url, this.options.asynchronous), 
this.options.asynchronous && (this.transport.onreadystatechange = this.onStateChange.bind(this), setTimeout(function() {
this.respondToReadyState(1);
}.bind(this), 10)), this.setRequestHeaders();
var body = this.options.postBody ? this.options.postBody : parameters;
this.transport.send('post' == this.options.method ? body : null);
} catch (e) {
this.dispatchException(e);
}
},
setRequestHeaders: function() {
var requestHeaders = [ 'X-Requested-With', 'XMLHttpRequest', 'X-Prototype-Version', Prototype.Version ];
'post' == this.options.method && requestHeaders.push('Content-type', 'application/x-www-form-urlencoded'), this.options.requestHeaders && requestHeaders.push.apply(requestHeaders, this.options.requestHeaders);
for (var i = 0; i < requestHeaders.length; i += 2) this.transport.setRequestHeader(requestHeaders[i], requestHeaders[i + 1]);
},
onStateChange: function() {
1 != this.transport.readyState && this.respondToReadyState(this.transport.readyState);
},
header: function(name) {
try {
return this.transport.getResponseHeader(name);
} catch (e) {}
},
evalJSON: function() {
try {
return eval(this.header('X-JSON'));
} catch (e) {}
},
evalResponse: function() {
try {
return eval(this.transport.responseText);
} catch (e) {
this.dispatchException(e);
}
},
respondToReadyState: function(readyState) {
var event = Ajax.Request.Events[readyState], transport = this.transport, json = this.evalJSON();
if ('Complete' == event) {
try {
(this.options['on' + this.transport.status] || this.options['on' + (this.responseIsSuccess() ? 'Success' : 'Failure')] || Prototype.emptyFunction)(transport, json);
} catch (e) {
this.dispatchException(e);
}
(this.header('Content-type') || '').match(/^text\/javascript/i) && this.evalResponse();
}
try {
(this.options['on' + event] || Prototype.emptyFunction)(transport, json), Ajax.Responders.dispatch('on' + event, this, transport, json);
} catch (e) {
this.dispatchException(e);
}
'Complete' == event && (this.transport.onreadystatechange = Prototype.emptyFunction);
},
dispatchException: function(exception) {
(this.options.onException || Prototype.emptyFunction)(this, exception), Ajax.Responders.dispatch('onException', this, exception);
}
}), Ajax.Updater = Class.create(), Object.extend(Object.extend(Ajax.Updater.prototype, Ajax.Request.prototype), {
initialize: function(container, url, options) {
this.containers = {
success: container.success ? $(container.success) : $(container),
failure: container.failure ? $(container.failure) : container.success ? null : $(container)
}, this.transport = Ajax.getTransport(), this.setOptions(options);
var onComplete = this.options.onComplete || Prototype.emptyFunction;
this.options.onComplete = function(transport, object) {
this.updateContent(), onComplete(transport, object);
}.bind(this), this.request(url);
},
updateContent: function() {
var receiver = this.responseIsSuccess() ? this.containers.success : this.containers.failure, response = this.transport.responseText;
this.options.evalScripts || (response = response.stripScripts()), receiver && (this.options.insertion ? new this.options.insertion(receiver, response) : Element.update(receiver, response)), 
this.responseIsSuccess() && this.onComplete && setTimeout(this.onComplete.bind(this), 10);
}
}), Ajax.PeriodicalUpdater = Class.create(), Ajax.PeriodicalUpdater.prototype = Object.extend(new Ajax.Base, {
initialize: function(container, url, options) {
this.setOptions(options), this.onComplete = this.options.onComplete, this.frequency = this.options.frequency || 2, this.decay = this.options.decay || 1, 
this.updater = {}, this.container = container, this.url = url, this.start();
},
start: function() {
this.options.onComplete = this.updateComplete.bind(this), this.onTimerEvent();
},
stop: function() {
this.updater.onComplete = undefined, clearTimeout(this.timer), (this.onComplete || Prototype.emptyFunction).apply(this, arguments);
},
updateComplete: function(request) {
this.options.decay && (this.decay = request.responseText == this.lastText ? this.decay * this.options.decay : 1, this.lastText = request.responseText), 
this.timer = setTimeout(this.onTimerEvent.bind(this), this.decay * this.frequency * 1e3);
},
onTimerEvent: function() {
this.updater = new Ajax.Updater(this.container, this.url, this.options);
}
}), document.getElementsByClassName = function(className, parentElement) {
var children = ($(parentElement) || document.body).getElementsByTagName('*');
return $A(children).inject([], (function(elements, child) {
return (child.className || '').match(new RegExp('(^|\\s)' + className + '(\\s|$)')) && elements.push(child), elements;
}));
}, !window.Element) var Element = new Object;

Object.extend(Element, {
visible: function(element) {
return 'none' != $(element).style.display;
},
toggle: function() {
for (var i = 0; i < arguments.length; i++) {
var element = $(arguments[i]);
Element[Element.visible(element) ? 'hide' : 'show'](element);
}
},
hide: function() {
for (var i = 0; i < arguments.length; i++) {
var element = $(arguments[i]);
element && (element.style.display = 'none');
}
},
show: function() {
for (var i = 0; i < arguments.length; i++) {
var element = $(arguments[i]);
element && (element.style.display = '');
}
},
remove: function(element) {
(element = $(element)).parentNode.removeChild(element);
},
update: function(element, html) {
$(element).innerHTML = html.stripScripts(), setTimeout((function() {
html.evalScripts();
}), 10);
},
getHeight: function(element) {
return (element = $(element)).offsetHeight;
},
classNames: function(element) {
return new Element.ClassNames(element);
},
hasClassName: function(element, className) {
if (element = $(element)) return Element.classNames(element).include(className);
},
addClassName: function(element, className) {
if (element = $(element)) return Element.classNames(element).add(className);
},
removeClassName: function(element, className) {
if (element = $(element)) return Element.classNames(element).remove(className);
},
cleanWhitespace: function(element) {
element = $(element);
for (var i = 0; i < element.childNodes.length; i++) {
var node = element.childNodes[i];
3 != node.nodeType || /\S/.test(node.nodeValue) || Element.remove(node);
}
},
empty: function(element) {
return $(element).innerHTML.match(/^\s*$/);
},
scrollTo: function(element) {
var x = (element = $(element)).x ? element.x : element.offsetLeft, y = element.y ? element.y : element.offsetTop;
window.scrollTo(x, y);
},
getStyle: function(element, style) {
var value = (element = $(element)).style[style.camelize()];
if (!value) if (document.defaultView && document.defaultView.getComputedStyle) {
var css = document.defaultView.getComputedStyle(element, null);
value = css ? css.getPropertyValue(style) : null;
} else element.currentStyle && (value = element.currentStyle[style.camelize()]);
return window.opera && [ 'left', 'top', 'right', 'bottom' ].include(style) && 'static' == Element.getStyle(element, 'position') && (value = 'auto'), 
'auto' == value ? null : value;
},
setStyle: function(element, style) {
for (var name in element = $(element), style) element.style[name.camelize()] = style[name];
},
getDimensions: function(element) {
if (element = $(element), 'none' != Element.getStyle(element, 'display')) return {
width: element.offsetWidth,
height: element.offsetHeight
};
var els = element.style, originalVisibility = els.visibility, originalPosition = els.position;
els.visibility = 'hidden', els.position = 'absolute', els.display = '';
var originalWidth = element.clientWidth, originalHeight = element.clientHeight;
return els.display = 'none', els.position = originalPosition, els.visibility = originalVisibility, {
width: originalWidth,
height: originalHeight
};
},
makePositioned: function(element) {
element = $(element);
var pos = Element.getStyle(element, 'position');
'static' != pos && pos || (element._madePositioned = !0, element.style.position = 'relative', window.opera && (element.style.top = 0, 
element.style.left = 0));
},
undoPositioned: function(element) {
(element = $(element))._madePositioned && (element._madePositioned = undefined, element.style.position = element.style.top = element.style.left = element.style.bottom = element.style.right = '');
},
makeClipping: function(element) {
(element = $(element))._overflow || (element._overflow = element.style.overflow, 'hidden' != (Element.getStyle(element, 'overflow') || 'visible') && (element.style.overflow = 'hidden'));
},
undoClipping: function(element) {
(element = $(element))._overflow || (element.style.overflow = element._overflow, element._overflow = undefined);
}
});

var Toggle = new Object;

Toggle.display = Element.toggle, Abstract.Insertion = function(adjacency) {
this.adjacency = adjacency;
}, Abstract.Insertion.prototype = {
initialize: function(element, content) {
if (this.element = $(element), this.content = content.stripScripts(), this.adjacency && this.element.insertAdjacentHTML) try {
this.element.insertAdjacentHTML(this.adjacency, this.content);
} catch (e) {
if ('tbody' != this.element.tagName.toLowerCase()) throw e;
this.insertContent(this.contentFromAnonymousTable());
} else this.range = this.element.ownerDocument.createRange(), this.initializeRange && this.initializeRange(), this.insertContent([ this.range.createContextualFragment(this.content) ]);
setTimeout((function() {
content.evalScripts();
}), 10);
},
contentFromAnonymousTable: function() {
var div = document.createElement('div');
return div.innerHTML = '<table><tbody>' + this.content + '</tbody></table>', $A(div.childNodes[0].childNodes[0].childNodes);
}
};

var Insertion = new Object;

Insertion.Before = Class.create(), Insertion.Before.prototype = Object.extend(new Abstract.Insertion('beforeBegin'), {
initializeRange: function() {
this.range.setStartBefore(this.element);
},
insertContent: function(fragments) {
fragments.each(function(fragment) {
this.element.parentNode.insertBefore(fragment, this.element);
}.bind(this));
}
}), Insertion.Top = Class.create(), Insertion.Top.prototype = Object.extend(new Abstract.Insertion('afterBegin'), {
initializeRange: function() {
this.range.selectNodeContents(this.element), this.range.collapse(!0);
},
insertContent: function(fragments) {
fragments.reverse(!1).each(function(fragment) {
this.element.insertBefore(fragment, this.element.firstChild);
}.bind(this));
}
}), Insertion.Bottom = Class.create(), Insertion.Bottom.prototype = Object.extend(new Abstract.Insertion('beforeEnd'), {
initializeRange: function() {
this.range.selectNodeContents(this.element), this.range.collapse(this.element);
},
insertContent: function(fragments) {
fragments.each(function(fragment) {
this.element.appendChild(fragment);
}.bind(this));
}
}), Insertion.After = Class.create(), Insertion.After.prototype = Object.extend(new Abstract.Insertion('afterEnd'), {
initializeRange: function() {
this.range.setStartAfter(this.element);
},
insertContent: function(fragments) {
fragments.each(function(fragment) {
this.element.parentNode.insertBefore(fragment, this.element.nextSibling);
}.bind(this));
}
}), Element.ClassNames = Class.create(), Element.ClassNames.prototype = {
initialize: function(element) {
this.element = $(element);
},
_each: function(iterator) {
this.element.className.split(/\s+/).select((function(name) {
return name.length > 0;
}))._each(iterator);
},
set: function(className) {
this.element.className = className;
},
add: function(classNameToAdd) {
this.include(classNameToAdd) || this.set(this.toArray().concat(classNameToAdd).join(' '));
},
remove: function(classNameToRemove) {
this.include(classNameToRemove) && this.set(this.select((function(className) {
return className != classNameToRemove;
})).join(' '));
},
toString: function() {
return this.toArray().join(' ');
}
}, Object.extend(Element.ClassNames.prototype, Enumerable);

var Field = {
clear: function() {
for (var i = 0; i < arguments.length; i++) $(arguments[i]).value = '';
},
focus: function(element) {
$(element).focus();
},
present: function() {
for (var i = 0; i < arguments.length; i++) if ('' == $(arguments[i]).value) return !1;
return !0;
},
select: function(element) {
$(element).select();
},
activate: function(element) {
(element = $(element)).focus(), element.select && element.select();
}
}, Form = {
serialize: function(form) {
for (var elements = Form.getElements($(form)), queryComponents = new Array, i = 0; i < elements.length; i++) {
var queryComponent = Form.Element.serialize(elements[i]);
queryComponent && queryComponents.push(queryComponent);
}
return queryComponents.join('&');
},
getElements: function(form) {
form = $(form);
var elements = new Array;
for (tagName in Form.Element.Serializers) for (var tagElements = form.getElementsByTagName(tagName), j = 0; j < tagElements.length; j++) elements.push(tagElements[j]);
return elements;
},
getInputs: function(form, typeName, name) {
var inputs = (form = $(form)).getElementsByTagName('input');
if (!typeName && !name) return inputs;
for (var matchingInputs = new Array, i = 0; i < inputs.length; i++) {
var input = inputs[i];
typeName && input.type != typeName || name && input.name != name || matchingInputs.push(input);
}
return matchingInputs;
},
disable: function(form) {
for (var elements = Form.getElements(form), i = 0; i < elements.length; i++) {
var element = elements[i];
element.blur(), element.disabled = 'true';
}
},
enable: function(form) {
for (var elements = Form.getElements(form), i = 0; i < elements.length; i++) {
elements[i].disabled = '';
}
},
findFirstElement: function(form) {
return Form.getElements(form).find((function(element) {
return 'hidden' != element.type && !element.disabled && [ 'input', 'select', 'textarea' ].include(element.tagName.toLowerCase());
}));
},
focusFirstElement: function(form) {
Field.activate(Form.findFirstElement(form));
},
reset: function(form) {
$(form).reset();
}
};

Form.Element = {
serialize: function(element) {
var method = (element = $(element)).tagName.toLowerCase(), parameter = Form.Element.Serializers[method](element);
if (parameter) {
var key = encodeURIComponent(parameter[0]);
if (0 == key.length) return;
return parameter[1].constructor != Array && (parameter[1] = [ parameter[1] ]), parameter[1].map((function(value) {
return key + '=' + encodeURIComponent(value);
})).join('&');
}
},
getValue: function(element) {
var method = (element = $(element)).tagName.toLowerCase(), parameter = Form.Element.Serializers[method](element);
if (parameter) return parameter[1];
}
}, Form.Element.Serializers = {
input: function(element) {
switch (element.type.toLowerCase()) {
case 'submit':
case 'hidden':
case 'password':
case 'text':
return Form.Element.Serializers.textarea(element);

case 'checkbox':
case 'radio':
return Form.Element.Serializers.inputSelector(element);
}
return !1;
},
inputSelector: function(element) {
if (element.checked) return [ element.name, element.value ];
},
textarea: function(element) {
return [ element.name, element.value ];
},
select: function(element) {
return Form.Element.Serializers['select-one' == element.type ? 'selectOne' : 'selectMany'](element);
},
selectOne: function(element) {
var opt, value = '', index = element.selectedIndex;
return index >= 0 && ((value = (opt = element.options[index]).value) || 'value' in opt || (value = opt.text)), [ element.name, value ];
},
selectMany: function(element) {
for (var value = new Array, i = 0; i < element.length; i++) {
var opt = element.options[i];
if (opt.selected) {
var optValue = opt.value;
optValue || 'value' in opt || (optValue = opt.text), value.push(optValue);
}
}
return [ element.name, value ];
}
};

var $F = Form.Element.getValue;

if (Abstract.TimedObserver = function() {}, Abstract.TimedObserver.prototype = {
initialize: function(element, frequency, callback) {
this.frequency = frequency, this.element = $(element), this.callback = callback, this.lastValue = this.getValue(), this.registerCallback();
},
registerCallback: function() {
setInterval(this.onTimerEvent.bind(this), 1e3 * this.frequency);
},
onTimerEvent: function() {
var value = this.getValue();
this.lastValue != value && (this.callback(this.element, value), this.lastValue = value);
}
}, Form.Element.Observer = Class.create(), Form.Element.Observer.prototype = Object.extend(new Abstract.TimedObserver, {
getValue: function() {
return Form.Element.getValue(this.element);
}
}), Form.Observer = Class.create(), Form.Observer.prototype = Object.extend(new Abstract.TimedObserver, {
getValue: function() {
return Form.serialize(this.element);
}
}), Abstract.EventObserver = function() {}, Abstract.EventObserver.prototype = {
initialize: function(element, callback) {
this.element = $(element), this.callback = callback, this.lastValue = this.getValue(), 'form' == this.element.tagName.toLowerCase() ? this.registerFormCallbacks() : this.registerCallback(this.element);
},
onElementEvent: function() {
var value = this.getValue();
this.lastValue != value && (this.callback(this.element, value), this.lastValue = value);
},
registerFormCallbacks: function() {
for (var elements = Form.getElements(this.element), i = 0; i < elements.length; i++) this.registerCallback(elements[i]);
},
registerCallback: function(element) {
if (element.type) switch (element.type.toLowerCase()) {
case 'checkbox':
case 'radio':
Event.observe(element, 'click', this.onElementEvent.bind(this));
break;

case 'password':
case 'text':
case 'textarea':
case 'select-one':
case 'select-multiple':
Event.observe(element, 'change', this.onElementEvent.bind(this));
}
}
}, Form.Element.EventObserver = Class.create(), Form.Element.EventObserver.prototype = Object.extend(new Abstract.EventObserver, {
getValue: function() {
return Form.Element.getValue(this.element);
}
}), Form.EventObserver = Class.create(), Form.EventObserver.prototype = Object.extend(new Abstract.EventObserver, {
getValue: function() {
return Form.serialize(this.element);
}
}), !window.Event) var Event = new Object;

Object.extend(Event, {
KEY_BACKSPACE: 8,
KEY_TAB: 9,
KEY_RETURN: 13,
KEY_ESC: 27,
KEY_LEFT: 37,
KEY_UP: 38,
KEY_RIGHT: 39,
KEY_DOWN: 40,
KEY_DELETE: 46,
element: function(event) {
return event.target || event.srcElement;
},
isLeftClick: function(event) {
return event.which && 1 == event.which || event.button && 1 == event.button;
},
pointerX: function(event) {
return event.pageX || event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
},
pointerY: function(event) {
return event.pageY || event.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
},
stop: function(event) {
event.preventDefault ? (event.preventDefault(), event.stopPropagation()) : (event.returnValue = !1, event.cancelBubble = !0);
},
findElement: function(event, tagName) {
for (var element = Event.element(event); element.parentNode && (!element.tagName || element.tagName.toUpperCase() != tagName.toUpperCase()); ) element = element.parentNode;
return element;
},
findElementByClassName: function(event, className) {
for (var element = Event.element(event); element.parentNode && (element.className === undefined || !Element.hasClassName(element, className)); ) element = element.parentNode;
return element;
},
observers: !1,
_observeAndCache: function(element, name, observer, useCapture) {
this.observers || (this.observers = []), element.addEventListener ? (this.observers.push([ element, name, observer, useCapture ]), 
element.addEventListener(name, observer, useCapture)) : element.attachEvent && (this.observers.push([ element, name, observer, useCapture ]), 
element.attachEvent('on' + name, observer));
},
unloadCache: function() {
if (Event.observers) {
for (var i = 0; i < Event.observers.length; i++) Event.stopObserving.apply(this, Event.observers[i]), Event.observers[i][0] = null;
Event.observers = !1;
}
},
observe: function(element, name, observer, useCapture) {
element = $(element);
useCapture = useCapture || !1, 'keypress' == name && (navigator.appVersion.match(/Konqueror|Safari|KHTML/) || element.attachEvent) && (name = 'keydown'), 
this._observeAndCache(element, name, observer, useCapture);
},
stopObserving: function(element, name, observer, useCapture) {
element = $(element);
useCapture = useCapture || !1, 'keypress' == name && (navigator.appVersion.match(/Konqueror|Safari|KHTML/) || element.detachEvent) && (name = 'keydown'), 
element.removeEventListener ? element.removeEventListener(name, observer, useCapture) : element.detachEvent && element.detachEvent('on' + name, observer);
}
}), Event.observe(window, 'unload', Event.unloadCache, !1);

var Position = {
includeScrollOffsets: !1,
prepare: function() {
this.deltaX = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0, this.deltaY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
},
realOffset: function(element) {
var valueT = 0, valueL = 0;
do {
valueT += element.scrollTop || 0, valueL += element.scrollLeft || 0, element = element.parentNode;
} while (element);
return [ valueL, valueT ];
},
cumulativeOffset: function(element) {
var valueT = 0, valueL = 0;
do {
valueT += element.offsetTop || 0, valueL += element.offsetLeft || 0, element = element.offsetParent;
} while (element);
return [ valueL, valueT ];
},
positionedOffset: function(element) {
var valueT = 0, valueL = 0;
do {
if (valueT += element.offsetTop || 0, valueL += element.offsetLeft || 0, (element = element.offsetParent) && (p = Element.getStyle(element, 'position'), 
'relative' == p || 'absolute' == p)) break;
} while (element);
return [ valueL, valueT ];
},
offsetParent: function(element) {
if (element.offsetParent) return element.offsetParent;
if (element == document.body) return element;
for (;(element = element.parentNode) && element != document.body; ) if ('static' != Element.getStyle(element, 'position')) return element;
return document.body;
},
within: function(element, x, y) {
return this.includeScrollOffsets ? this.withinIncludingScrolloffsets(element, x, y) : (this.xcomp = x, this.ycomp = y, this.offset = this.cumulativeOffset(element), 
y >= this.offset[1] && y < this.offset[1] + element.offsetHeight && x >= this.offset[0] && x < this.offset[0] + element.offsetWidth);
},
withinIncludingScrolloffsets: function(element, x, y) {
var offsetcache = this.realOffset(element);
return this.xcomp = x + offsetcache[0] - this.deltaX, this.ycomp = y + offsetcache[1] - this.deltaY, this.offset = this.cumulativeOffset(element), 
this.ycomp >= this.offset[1] && this.ycomp < this.offset[1] + element.offsetHeight && this.xcomp >= this.offset[0] && this.xcomp < this.offset[0] + element.offsetWidth;
},
overlap: function(mode, element) {
return mode ? 'vertical' == mode ? (this.offset[1] + element.offsetHeight - this.ycomp) / element.offsetHeight : 'horizontal' == mode ? (this.offset[0] + element.offsetWidth - this.xcomp) / element.offsetWidth : void 0 : 0;
},
clone: function(source, target) {
source = $(source), (target = $(target)).style.position = 'absolute';
var offsets = this.cumulativeOffset(source);
target.style.top = offsets[1] + 'px', target.style.left = offsets[0] + 'px', target.style.width = source.offsetWidth + 'px', 
target.style.height = source.offsetHeight + 'px';
},
page: function(forElement) {
var valueT = 0, valueL = 0, element = forElement;
do {
if (valueT += element.offsetTop || 0, valueL += element.offsetLeft || 0, element.offsetParent == document.body && 'absolute' == Element.getStyle(element, 'position')) break;
} while (element = element.offsetParent);
element = forElement;
do {
valueT -= element.scrollTop || 0, valueL -= element.scrollLeft || 0;
} while (element = element.parentNode);
return [ valueL, valueT ];
},
clone: function(source, target) {
var options = Object.extend({
setLeft: !0,
setTop: !0,
setWidth: !0,
setHeight: !0,
offsetTop: 0,
offsetLeft: 0
}, arguments[2] || {});
source = $(source);
var p = Position.page(source);
target = $(target);
var delta = [ 0, 0 ], parent = null;
'absolute' == Element.getStyle(target, 'position') && (parent = Position.offsetParent(target), delta = Position.page(parent)), 
parent == document.body && (delta[0] -= document.body.offsetLeft, delta[1] -= document.body.offsetTop), options.setLeft && (target.style.left = p[0] - delta[0] + options.offsetLeft + 'px'), 
options.setTop && (target.style.top = p[1] - delta[1] + options.offsetTop + 'px'), options.setWidth && (target.style.width = source.offsetWidth + 'px'), 
options.setHeight && (target.style.height = source.offsetHeight + 'px');
},
absolutize: function(element) {
if ('absolute' != (element = $(element)).style.position) {
Position.prepare();
var offsets = Position.positionedOffset(element), top = offsets[1], left = offsets[0], width = element.clientWidth, height = element.clientHeight;
element._originalLeft = left - parseFloat(element.style.left || 0), element._originalTop = top - parseFloat(element.style.top || 0), 
element._originalWidth = element.style.width, element._originalHeight = element.style.height, element.style.position = 'absolute', 
element.style.top = top + 'px', element.style.left = left + 'px', element.style.width = width + 'px', element.style.height = height + 'px';
}
},
relativize: function(element) {
if ('relative' != (element = $(element)).style.position) {
Position.prepare(), element.style.position = 'relative';
var top = parseFloat(element.style.top || 0) - (element._originalTop || 0), left = parseFloat(element.style.left || 0) - (element._originalLeft || 0);
element.style.top = top + 'px', element.style.left = left + 'px', element.style.height = element._originalHeight, element.style.width = element._originalWidth;
}
}
};

/Konqueror|Safari|KHTML/.test(navigator.userAgent) && (Position.cumulativeOffset = function(element) {
var valueT = 0, valueL = 0;
do {
if (valueT += element.offsetTop || 0, valueL += element.offsetLeft || 0, element.offsetParent == document.body && 'absolute' == Element.getStyle(element, 'position')) break;
element = element.offsetParent;
} while (element);
return [ valueL, valueT ];
});
//# sourceMappingURL=prototype.js.map