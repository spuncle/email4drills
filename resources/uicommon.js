var _messagePlayRunner, UI = {}, jQ = window.jQuery && jQuery.noConflict(), $win = getWebmailWindow, $ieVersionLt10 = getIEVersionLt10(), ErrorHandleList = {
FA_SECURITY: 1
};

function $doc() {
return $win().document;
}

function $$(id) {
return $doc().getElementById(id);
}

function $Pjq(id) {
return null == parent || null == parent.jQ ? jQ(id) : parent.jQ(id);
}

function getIEVersionLt10() {
var userAgent = navigator.userAgent;
return -1 != userAgent.indexOf('MSIE') && -1 == userAgent.indexOf('MSIE 10');
}

function getWebmailWindow() {
return UI._win || (UI._win = function() {
try {
return tryThis(window) || tryThis(parent) || tryThis(parent.parent) || window;
} catch (e) {
return window;
}
}()), UI._win;
function tryThis(w) {
return !0 === w.webmailWindow ? w : null;
}
}

function _txtMsgPrepare(txtMsg) {
return txtMsg.text2HTML();
}

function _sysIcon(msg, icon) {
return [ '<div>', msg, '</div>' ].join('');
}

function _alert(options, raw) {
var msg = 'string' == typeof options ? options : options.message;
msg = raw ? msg : _txtMsgPrepare(msg);
var textOK, type = 'alert';
options.type && 1 == options.type && (type = ''), new UI.SysDialog({
body: _sysIcon(msg, type),
action: 'string' == typeof options ? null : options.callback,
onClose: options.onClose,
showMask: options.showMask,
textOK: ('FA_SECURITY' == options.errorCode && (textOK = gLang.dialog.btn.reLogin), textOK),
init: function() {
var targetDiv, backUrl;
'FA_SECURITY' == options.errorCode && (targetDiv = jQ('#countDown', parent.document)[0], backUrl = options.backURL, setTimeout((function execute() {
var curSecond = parseInt(targetDiv.innerHTML);
curSecond ? (curSecond--, targetDiv.innerHTML = curSecond, setTimeout(execute, 1e3)) : top.location.href = backUrl;
}), 1e3));
}
});
}

function _confirm(options) {
new UI.SysDialog({
body: _sysIcon(options.skipText2HTML ? options.message : _txtMsgPrepare(options.message), options.icon || 'confirm'),
button: 'OK_CANCEL',
actions: [ options.yes, options.no ]
});
}

function _inputDialog(options) {
return new UI.SysDialog({
title: options.title || '',
body: options.body || _sysIcon(_txtMsgPrepare(options.message) + '<br><input type="text" value=""/>', 'confirm'),
init: function(div, dialog) {
div.getElementsByTagName('input')[0] && (div.getElementsByTagName('input')[0].value = options.dv || '', div.getElementsByTagName('input')[0].onkeyup = function(event) {
if (13 == (event = event || $win().event).keyCode) return dialog.getButton('OK').click();
}, dialog.getButton('CANCEL').onblur = function() {
div.getElementsByTagName('input')[0].focus();
});
},
button: 'OK_CANCEL',
actions: [ function(div) {
return options.yes(div.getElementsByTagName('INPUT')[0].value);
}, options.no ]
});
}

function _playMessage(msg, title) {
stopPlaying(), title = title || '';
var html = '<div id="nmAlert" style="top:' + $doc().body.clientHeight + 'px"><div class="header"><h3 class="fLeft dialogTitle"><b>' + title + '</b></h3><div id="nmClose" class="fRight dialogCloseBtn"></div></div><div class="body"><b>' + msg + '</b></div></div>';
new Insertion.Bottom($doc().body, html), $('nmClose').onclick = stopPlaying, _messagePlayRunner = setTimeout(fadeIn);
}

function _bindEvent(evtName, func) {
!function bindIframeElItr(doc) {
jQ(doc).on(evtName, (function(event) {
return func.call(this, event), !0;
})), jQ('iframe', doc).each((function(i, n) {
try {
bindIframeElItr(n.contentWindow.document);
} catch (e) {}
}));
}($win().document);
}

function stopPlaying() {
clearTimeout(_messagePlayRunner);
var div = $('nmAlert');
div && Element.remove(div);
}

function fadeIn() {
var div = $('nmAlert'), bodyHeight = $doc().body.clientHeight, scrollTop = $doc().body.scrollTop;
div.offsetTop + div.offsetHeight < bodyHeight + scrollTop - 2 ? _messagePlayRunner = setTimeout(fadeOut, 5e3) : (div.style.top = div.offsetTop - 2 + 'px', 
_messagePlayRunner = setTimeout(fadeIn, 50));
}

function fadeOut() {
var div = $('nmAlert');
if (div) {
var bodyHeight = $doc().body.clientHeight, scrollTop = $doc().body.scrollTop;
div.offsetTop > bodyHeight + scrollTop ? Element.remove(div) : (div.style.top = div.offsetTop + 2 + 'px', _messagePlayRunner = setTimeout(fadeOut, 50));
}
}

function _yesNoCancel(options) {
new UI.SysDialog({
button: 'YES_NO_CANCEL',
textYes: gLang.dialog.custom_btn.yes,
textNo: gLang.dialog.custom_btn.no,
textCancel: gLang.dialog.custom_btn.cancel,
body: _sysIcon(_txtMsgPrepare(options.message), 'confirm'),
actions: [ options.yes, options.no, options.cancel ]
});
}

function _panel(title, messageHTML) {
return new UI.Dialog({
title: title,
body: messageHTML,
button: 'OK',
textOK: gLang.dialog.btn.close,
cache: !0
});
}

function detailTips(obj) {
var div = document.getElementById('detail');
'none' == div.style.display ? (div.style.display = '', jQ(obj).children()[0].style.display = 'none', jQ(obj).children()[1].style.display = '') : (div.style.display = 'none', 
jQ(obj).children()[0].style.display = '', jQ(obj).children()[1].style.display = 'none');
}

function clicknode(nod, div) {
nod = 'string' == typeof nod ? document.getElementById(nod) : nod, div = 'string' == typeof div ? document.getElementById(div) : div;
var nodfile = jQ(nod).siblings('i')[0];
switch (nod.className) {
case 'tgl EXPANDED':
nod.className = 'tgl COLLAPSED', void 0 !== nodfile && 'fico OPEN' == nodfile.className && (nodfile.className = 'fico'), 
div.style.display = 'none';
break;

case 'tgl COLLAPSED':
nod.className = 'tgl EXPANDED', void 0 !== nodfile && 'fico' == nodfile.className && (nodfile.className = 'fico OPEN'), 
div.style.display = '';
break;

case 'tgl FOPEN':
nod.className = 'tgl FCLOSE', div.style.display = 'none';
break;

case 'tgl FCLOSE':
nod.className = 'tgl FOPEN', div.style.display = '';
}
'function' == typeof window.jsHandleExpand && window.jsHandleExpand(nod, 'none' != div.style.display);
}

function clicknode_show(nod, div) {
'none' == div.style.display && clicknode(nod, div);
}

function tGL(nameElement) {
clicknode(nameElement, nameElement.parentNode.getElementsByTagName('ul')[0]);
}

function tGL_show(nameElement) {
clicknode_show(nameElement, nameElement.parentNode.getElementsByTagName('ul')[0]);
}

function tGL_callee(element) {
tGL(element);
}

function tGL_calleeDb(element) {
tGL(jQ(element).prev()[0]);
}

function tGL_calleeDbSpan() {
tGL(jQ(this).prevAll()[1]);
}

UI.alert = _alert, UI.confirm = _confirm, UI.prompt = _inputDialog, UI.inputDialog = _inputDialog, UI.yesNoCancel = _yesNoCancel, 
UI.panel = _panel, UI.playMessage = _playMessage, UI.bindEvent = _bindEvent;
//# sourceMappingURL=uicommon.js.map