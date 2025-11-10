function CMXClient() {}

!function() {
var sid;
function getSID() {
return sid === undefined && (sid = (window.CC || {}).sid || ((location.search || '').match(/[?|&]sid=(\w*)/) || [])[1] || ''), 
sid;
}
function $$A(element) {
if (null == element) return [];
if ('object' != typeof element) return [ element ];
if (element.toArray) return element.toArray();
if (null != element.length) {
for (var results = [], i = 0; i < element.length; i++) results.push(element[i]);
return results;
}
return [ element ];
}
function getURL(funcId, cgi) {
return completeURL('/coremail/s?func=' + funcId + (getSID() ? '&sid=' + getSID() : ''), cgi);
}
function completeURL(url, cgi) {
for (var key in cgi) for (var val = $$A(cgi[key]), i = 0; i < val.length; i++) url += '&' + key + '=' + encodeURIComponent(val[i]);
return url;
}
function submit(client, funcId, requestVar, options) {
client.funcId = funcId, client.requestVar = requestVar;
var onSuccess = (options = options || {}).onSuccess || Prototype.emptyFunction;
options.onSuccess = function(transport, object) {
onSuccess(transport, object), client.handleResult();
}, client.initialize(getURL(funcId, client.cgi), options);
}
function doGetFailMessage(failCode, failFunc, resultVar) {
var messageIsSpecific = !1, message = null;
if (failCode && 'FA_' == failCode.substring(0, 3)) {
var key = failCode.substring(3), keyEx = null;
if ('OVERFLOW' == key) {
var reason = (resultVar || {}).overflowReason;
reason && (keyEx = key + '.' + reason), 'FOLDERCOUNT_OVERFLOW' == reason && (keyEx = reason);
} else 'SECURITY' == key && (keyEx = resultVar.securityReason);
for (var pattern in gLang.msg) {
var map = gLang.msg[pattern];
'*' != pattern && 'object' == typeof map && (failFunc && failFunc.match(pattern) && (message = map[keyEx] || map[key] || message));
}
message ? messageIsSpecific = !0 : message = gLang.msg['.*'][keyEx] || gLang.msg['*'][key];
}
return {
messageIsSpecific: messageIsSpecific,
message: message || gLang.msg.unknown
};
}
function showFailedByUiCommon(result) {
var message = doGetFailMessage(result.code, null, result).message;
'FA_SECURITY' == result.code && (message = message.replace('{0}', '<span id = "countDown">15</span>')), UI.alert({
message: '' + message,
callback: function() {
top.location = '/coremail/logout.jsp';
},
onClose: function() {
top.location = '/coremail/logout.jsp';
},
errorCode: result.code,
backURL: '/coremail/logout.jsp'
}, !0);
}
function showFailedDefault(request, result, diagnosticMessage) {
result = result || {};
var requestFunc = (request = request || {}).funcId, requestVar = request.requestVar, resultCode = result.code, resultMessages = result.messages, failFunc = requestFunc, failCode = resultCode;
'S_PARTIAL_OK' == failCode && (failCode = result.failCode || failCode), 'sequential' == requestFunc && requestVar && null != result.failIndex && (failFunc = requestVar.items[result.failIndex].func);
var m = doGetFailMessage(failCode, failFunc, result);
function addRow(labelHtml, valueHtml) {
labelHtml.endsWith('.var') && (valueHtml = '<a href=\'javascript:void(0);\' style=\'color:#666\' onclick=\'Element.toggle(this.nextSibling)\'>(...)</a><pre style=\'display:none;margin:0;color:navy;overflow:auto;max-height:200px;\'>' + varToXML(valueHtml).htmlencode() + '</pre>'), 
html += ' <tr vAlign=top>     <td nowrap>' + labelHtml + ':&nbsp;</td>     <td nowrap>' + valueHtml + '</td> </tr>';
}
var html = ' <table class="msg">     <tr>         <td nowrap>' + m.message + '</td>         <td align="right" nowrap width=50> &nbsp; <a href="javascript:void(0);"></a></td>     </tr>';
html += '     <tr>         <td colspan=2 id=\'moreErrorInfo\' style=\'color:#666\'>             <hr>             <table>', 
failFunc ? addRow(gLang.msg.dialog_label.func, failFunc) : request.url && addRow(gLang.msg.dialog_label.url, request.url), 
failCode && addRow(gLang.msg.dialog_label.code, failCode), diagnosticMessage && addRow(gLang.msg.dialog_label.code, diagnosticMessage.escapeHTML()), 
html += '               </table>';
var paramsString = top.location.search || '';
paramsString.charAt(0) == '?&='.charAt(0) && (paramsString = paramsString.substring(1));
var i, params = paramsString.split('?&='.charAt(1));
for (i = 0; i < params.length; i++) {
var pair = params[i].split('?&='.charAt(2), 2);
params[pair[0]] = pair[1];
}
var debug = null != params.debug;
if (debug) {
for (i in html += '         <hr>         <table>', request) {
var name = '';
'funcId' == i ? name = 'func' : 'requestVar' == i ? name = 'var' : 'url' == i && (name = i), name && addRow('request.' + name, request[i]);
}
for (i in result) 'messages' != i && addRow('result.' + i, result[i]);
html += '           </table>';
}
if (resultMessages && resultMessages.length > 0) {
for (html += '         <hr>' + gLang.msg.dialog_label.msgs + ':         <table>', i = 0; i < resultMessages.length; ++i) {
var msg = resultMessages[i], l = '';
msg.severity && (l += '[' + msg.severity.substring(0, 3) + '] '), addRow(l + (msg.key || ''), msg.summary);
}
html += '           </table>';
}
function toggleMore() {
var moreDiv = $$('moreErrorInfo');
Element.toggle(moreDiv), this.innerHTML = (Element.visible(moreDiv) ? '<<<' : '>>>').escapeHTML(), UI.Dialog.top().adjust();
}
html += '         </td>     </tr> </table>', new UI.SysDialog({
body: html,
init: function(table) {
var moreButton = table.getElementsByTagName('A')[0];
debug || !m.messageIsSpecific ? (moreButton.onclick = toggleMore, moreButton.onclick()) : Element.hide($$('moreErrorInfo'));
},
action: function() {
'FA_INVALID_SESSION' == result.code && (top.location = '/coremail/logout.jsp');
}
});
}
function varToXML(obj) {
return namedVarToXML(null, obj, '\n').substr(1);
}
function namedVarToXML(nameAttr, obj, indent) {
if (null == obj) return indent + tagXML('null', nameAttr);
var s, i, constructor = obj.constructor;
if (constructor == String) return indent + tagXML('string', nameAttr, textXML(obj));
if (constructor == Object) {
if (obj.nodeType) return UI.alert('Passing invalid object: ' + Object.inspect(obj)), '';
for (i in s = '', obj) s += namedVarToXML(i, obj[i], indent + '  ');
return indent + tagXML('object', nameAttr, s + indent);
}
if (constructor == Array) {
for (s = '', i = 0; i < obj.length; i++) s += namedVarToXML(null, obj[i], indent + '  ');
return indent + tagXML('array', nameAttr, s + indent);
}
return constructor == Boolean || constructor == Number ? (s = obj.toString(), indent + tagXML(getVarType(obj, s), nameAttr, s)) : constructor == Date ? (s = obj.getFullYear() + '-' + (obj.getMonth() + 1) + '-' + obj.getDate(), 
(obj.getHours() > 0 || obj.getMinutes() > 0 || obj.getSeconds() > 0) && (s += ' ' + obj.getHours() + ':' + obj.getMinutes() + ':' + obj.getSeconds()), 
indent + tagXML(getVarType(obj, s), nameAttr, s)) : (UI.alert('Passing invalid object: ' + Object.inspect(obj)), '');
}
function getVarType(obj, stringValue) {
if (null == obj) return 'null';
var constructor = obj.constructor;
if (constructor == String) return 'string';
if (constructor == Object) return 'object';
if (constructor == Array) return 'array';
if (constructor == Date) return 'date';
if (constructor == Boolean) return 'boolean';
if (constructor == Number) {
if (-1 == (stringValue || obj.toString()).indexOf('.')) {
if (obj >= -2147483648 && obj < 2147483648) return 'int';
if (!isNaN(obj)) return 'long';
}
return 'number';
}
}
function tagXML(tagName, nameAttr, innerXML) {
var s = '<' + tagName;
return nameAttr && (s += ' name="' + textXML(nameAttr, !0) + '"'), innerXML ? (s += '>' + innerXML, '>' == innerXML.charAt(innerXML.length - 1) && (s += '\n'), 
s + '</' + tagName + '>') : s + ' />';
}
function textXML(s, isAttr) {
return s = (s = s.htmlencode()).replace(/[\x00-\x08\x0b\x0e-\x1f]/g, '');
}
CMXClient.getSID = getSID, CMXClient.getURL = getURL, CMXClient.prototype.getFailMessage = function(failCode, resultVar) {
return doGetFailMessage(failCode, this.funcId, resultVar).message;
}, Object.extend(Object.extend(CMXClient.prototype, Ajax.Request.prototype), {
resultListener: Prototype.emptyFunction,
handleResult: function() {
var contentType = this.header('Content-Type') || '', result;
if (contentType.match(/^text\/javascript/i) && (result = eval('(function() {return ' + this.transport.responseText + '})()')), 
result) {
this.result = result;
var handler = this.options['aj_' + result.code];
handler ? handler(result) : this.resultListener(result) || (ErrorHandleList && ErrorHandleList[result.code] ? showFailedByUiCommon(result) : showFailedDefault(this, result, null));
}
},
evalResponse: Prototype.emptyFunction,
setRequestHeaders: function() {
var headers = [];
'JSON' == this.options.mode && headers.push('Accept', 'text/javascript'), 'post' == this.options.method && headers.push('Content-type', 'application/xml'), 
headers.push.apply(headers, this.options.requestHeaders || []);
for (var i = 0; i < headers.length; i += 2) this.transport.setRequestHeader(headers[i], headers[i + 1]);
}
}), CMXClient.prototype.simpleCall = function(funcId, requestVar, handler, extArg) {
submit(this, funcId, requestVar, {
mode: 'JSON',
postBody: varToXML(requestVar),
aj_S_OK: function(result) {
handler && handler(result['var'], extArg);
}.bind(this)
});
};
}();
//# sourceMappingURL=simpleclient.js.map