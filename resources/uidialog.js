!function() {
UI.Dialog = Dialog, UI.SysDialog = function() {
Dialog.apply(this, arguments);
};
var _all = [];
Dialog.closeAll = function() {
for (var last, i = _all.length; i > 0; i--) (last = _all[i - 1]) && last.cancel();
}, Dialog.freeAll = function() {
_all.each((function(dialog) {
dialog.free();
})), _all.clear();
var box = $$('dvDialogContainer');
box && (box.innerHTML = '', Element.remove(box));
}, Dialog.top = function() {
return _all.last();
};
var _TEMPLATES = {
SYS: '<div class="winFrame dialogFrame">  <div class="winHead">$TITLE$</div>  <div class="sysBody" id="sysBody">$BODY$</div>  <div class="winFoot">$BUTTONS$</div></div>',
WIN: '<div class="winFrame dialogFrame">  <div class="sysBody">$BODY$</div>  <div class="winFoot">$BUTTONS$</div></div>',
FORM: '<div class="winFrame dialogFrame">  <div class="winHead">$TITLE$</div>  <div class="sysBody">$BODY$</div>  <div class="winFoot">$BUTTONS$</div></div>',
LOCK: '<div class="lockFrame">  <div></div>  <div class="lockBody">$BODY$</div>  <div class="lockButtons">$BUTTONS$</div>  <div></div></div>'
};
function Dialog(options) {
var dialog = this, box = $$('dvDialogContainer');
box || ((box = $doc().createElement('div')).id = 'dvDialogContainer', $doc().body.appendChild(box));
var divWin = $doc().createElement('div');
divWin.setAttribute('id', 'dvDialogStyle');
var bodyElement, buttonsElement, style = options.style || (this.constructor == UI.SysDialog ? 'SYS' : 'FORM'), buttonStyle = options.button || (this.constructor == UI.SysDialog ? 'OK' : 'OK_CANCEL'), title = options.title || (this.constructor == UI.SysDialog ? gLang.dialog.sysmsg_title : ''), actions = options.actions || [ options.action ], showHide = options.showHide, showMask = options.showMask !== undefined && options.showMask, maskValue = options.maskValue === undefined ? .5 : options.maskValue, showClose = options.showClose === undefined || options.showClose, lockMode = 'LOCK' == style, allowRefresh = options.allowRefresh !== undefined && options.allowRefresh, left = options.left !== undefined && options.left, top = options.top !== undefined && options.top, prefixClass = options.prefixClass || '';
function fPrepareDisplay() {
if (divWin.style.cssText = 'position:absolute;z-index:999;top:0;left:0;display:none;', null == box.firstChild) {
var alpha = showMask ? maskValue : 0, alpha_IE = showMask ? 100 * maskValue : 0;
$ieVersionLt10 ? box.innerHTML = '<div style="position:absolute;z-index:998;top:0;left:0;width:100%;height:100%;background-color:#000;filter:alpha(opacity=' + alpha_IE + ');"><iframe id="overWin" style="position:absolute;z-index:-1;top:0;left:0;width:100%;height:100%;filter:alpha(opacity=0)" frameborder=0 src="javascript:\'\'"></iframe></div>' : box.innerHTML = '<div style="position:absolute;z-index:998;top:0;left:0;width:100%;height:100%;background-color:#000;opacity:' + alpha + ';"></div>';
}
var lastDiv = box.lastChild.previousSibling;
lastDiv && (lastDiv.style.zIndex = 997), box.insertBefore(divWin, box.lastChild);
}
function fDisplay() {
Element.show(divWin), Element.show(box), dialog.adjust(), allowRefresh && jQ(window).resize((function() {
dialog.adjust();
})), lockMode || fSetDragAble(divWin, bodyElement);
}
function fCallback(callbackFunction, target) {
return (callbackFunction || Prototype.emptyFunction)(target || bodyElement.getElementsByTagName('FORM')[0] || bodyElement, dialog);
}
function fButtonClick(index) {
!1 !== fCallback(actions[index]) && fClose();
}
function fClose() {
doClose(!options.cache);
}
function fClose2() {
!1 !== fCallback(options.onClose) && fClose();
}
function fMin() {
doClose(!1);
}
function doClose(toRelease) {
box == divWin.parentNode && box.removeChild(divWin);
var lastDiv = (box.lastChild || {}).previousSibling;
lastDiv ? lastDiv.style.zIndex = 999 : (box.style.display = 'none', box.innerHTML = ''), toRelease && (divWin.innerHTML = '', 
_all = _all.without(dialog)), (options.onClosed || Prototype.emptyFunction)();
}
dialog.getButton = function(key) {
return jQ(buttonsElement).children().children('.sigbtn_ns')[buttonIndexes[key]];
}, dialog.ok = fButtonClick.bind(null, 0), dialog.cancel = fClose, dialog.show = function() {
fPrepareDisplay(), fDisplay();
}, dialog.hide = fClose, dialog.free = function() {
doClose(!0);
}, dialog.adjust = fAdjustPosition.bind(null, divWin, left, top), dialog.update = function(options) {
options.body && (bodyElement.innerHTML = options.body);
}, box.className = prefixClass, divWin.innerHTML = (document.all ? '<iframe style="position:absolute;z-index:-1;top:0;left:0;width:0;height:0;);" frameborder=0 src="javascript:\'\'"></iframe>' : '') + '<div class="popWin" style="position:absolute;top:0;left:0;">' + _TEMPLATES[style] + '</div>', 
showClose || document.getElementsByClassName('dialogCloseBtn', divWin).each((function(btn) {
Element.remove(btn);
}));
for (var toRemove = [], i = 0, elements = divWin.getElementsByTagName('*'); elements[i]; i++) if (1 == elements[i].childNodes.length && 3 == elements[i].firstChild.nodeType) {
var s = elements[i].firstChild.data;
if (elements[i].removeChild(elements[i].firstChild), '$TITLE$' == s) elements[i].innerHTML = title; else if ('$BODY$' == s) bodyElement = elements[i]; else if ('$BUTTONS$' == s) buttonsElement = elements[i]; else if ('$CLOSE$' == s) elements[i].onclick = fClose2; else if ('$MIN$' == s) {
if (!showHide) {
toRemove[toRemove.length] = elements[i];
continue;
}
elements[i].onclick = fMin;
}
}
for (i = 0; i < toRemove.length; i++) toRemove[i].parentNode.removeChild(toRemove[i]);
bodyElement.innerHTML = options.body;
var buttonCount = 0, buttonIndexes = {};
buttonsElement.innerHTML = buttonStyle.split('_').inject([], (function(memo, buttonKey) {
var key;
return memo.push((buttonIndexes[key = buttonKey] = buttonCount, '<div class="sigbtn_ns ' + (1 == ++buttonCount ? 'sigbtn_ns_on' : '') + '"><span>' + (options['text' + key] || gLang.dialog.btn[key.toLowerCase()] || gLang.dialog.custom_btn[key.toLowerCase()]) + '</span></div>')), 
memo;
})).join(' ');
var FootBtn_class = 'LOCK' == style ? '' : 'dialogFootBtn';
buttonsElement.innerHTML = '<div class="' + FootBtn_class + '">' + buttonsElement.innerHTML + ' </div>';
var sigbtns = jQ(buttonsElement).children().children('.sigbtn_ns');
for (i = 0; i < sigbtns.length; i++) sigbtns[i].onclick = fButtonClick.bind(null, i);
_all.push(dialog), fPrepareDisplay(), fCallback((function(form, dialog) {
function _fInitKeyListen(bSubmitForm) {
jQ(form).find('input:text,input:password,input[name=verifyCode]').keydown((function(e) {
if (13 == e.keyCode) {
if ($Pjq('#search_area') && $Pjq('#search_area').is(':focus')) return;
bSubmitForm ? jQ(form).submit() : dialog.ok();
}
}));
}
form.tagName && 'FORM' == form.tagName.toUpperCase() ? (form.onsubmit = function() {
return dialog.ok(), !1;
}, _fInitKeyListen(!0)) : _fInitKeyListen(!1);
})), fCallback(options.init), fDisplay(), fCallback(options.activate), function() {
for (var candidate, e, all = bodyElement.getElementsByTagName('*'), i = 0; e = all[i]; i++) {
var tagName = e.tagName.toUpperCase();
if (!(('INPUT' != tagName || 'text' != e.type && 'password' != e.type && 'input' != e.type) && 'SELECT' != tagName && 'TEXTAREA' != tagName || e.disabled || e.readOnly)) {
if (0 == e.tabIndex) {
try {
e.focus();
} catch (e) {}
return;
}
candidate || (candidate = e);
}
}
try {
(candidate || jQ(buttonsElement).children().children('.sigbtn_ns')[0]).focus();
} catch (e) {}
}(), function() {
for (var e, index = 1, all = bodyElement.getElementsByTagName('*'), i = 0; e = all[i]; i++) {
var tagName = e.tagName.toUpperCase();
('INPUT' != tagName || 'text' != e.type && 'password' != e.type && 'input' != e.type) && 'SELECT' != tagName && 'TEXTAREA' != tagName || e.disabled || e.readOnly || (e.tabIndex = index, 
index++);
}
var buttons = jQ(buttonsElement).children().children('.sigbtn_ns');
if (buttons) for (var j = 0; j < buttons.length; j++) buttons[j].tabIndex = index, index++;
}(), jQ.browser.msie && 6 == jQ.browser.version && bodyElement.scrollWidth > 420 && (bodyElement.parentNode.style.width = 'auto');
}
function fAdjustPosition(divWin, left, top) {
var div = divWin.lastChild, body = $doc().body, bodyW = body.clientWidth, bodyH = body.clientHeight, w = div.offsetWidth, h = div.offsetHeight;
divWin.style.left = left ? left + 'px' : Math.floor(Math.max(0, bodyW - w) / 2) + 'px', divWin.style.top = top ? top + 'px' : Math.floor(Math.max(0, bodyH - h) / 2) + 'px', 
body.scrollTop = body.scrollLeft = 0;
}
window.fSetDragAble = function(obj, excludeObj, win) {
var downX, downY;
function mousemove(event) {
var x = (event = event || win.event).clientX - downX, y = event.clientY - downY;
obj.style.top = parseInt(obj.style.top, 10) + y + 'px', obj.style.left = parseInt(obj.style.left, 10) + x + 'px', downX = event.clientX, 
downY = event.clientY;
}
win = win || $win(), obj.onmousedown = function(event) {
var target = Event.element(event = event || win.event);
if (excludeObj) {
for (var testObj = target; null != testObj && testObj != excludeObj; ) testObj = testObj.parentNode;
if (testObj == excludeObj) return;
}
if (!target || !target.tagName || 'INPUT' == target.tagName.toUpperCase() || 'SELECT' == target.tagName.toUpperCase() || 'TEXTAREA' == target.tagName.toUpperCase() || 'OPTION' == target.tagName.toUpperCase() || null != target.onclick || null != target.onmousedown) return;
downX = event.clientX, downY = event.clientY, obj.setCapture ? (obj.setCapture(), obj.onmousemove = mousemove, obj.onmouseup = function() {
obj.releaseCapture(), obj.onmousemove = null, obj.onmouseup = null;
}) : window.captureEvents && (win.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP), win.onmousemove = mousemove, win.onmouseup = function() {
win.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP), win.onmousemove = null, win.onmouseup = null;
});
Event.stop(event);
};
}, Dialog.openImage = function(title, originalUrl, actualWidth, actualHeight, scaleTo) {
var displayScale, displayWidth = actualWidth, displayHeight = actualHeight, displayUrl = originalUrl;
function calculateActualDimensions() {
this.onload = this.resize = null, actualWidth = this.width, actualHeight = this.height, caculateScaling() && applyDimensions(this), 
Dialog.top().adjust();
}
function applyDimensions(img) {
img.width = displayWidth, img.height = displayHeight, displayScale && (img.style.cursor = document.all ? 'hand' : 'pointer', 
img.onclick = function() {
window.open(originalUrl);
});
}
function caculateScaling() {
var maxWidth = Math.max(GE.bodyWidth - 50, 50), maxHeight = Math.max(GE.bodyHeight - 120, 50), maxScale = Math.min(maxWidth / actualWidth, maxHeight / actualHeight), result = 0 < maxScale && maxScale < 1;
return result && (displayScale = maxScale, displayWidth = Math.round(actualWidth * displayScale), displayHeight = Math.round(actualHeight * displayScale)), 
result;
}
actualWidth && actualHeight && (title += ' - ' + actualWidth + ' x ' + actualHeight + ' ' + gLang.GLOBAL.pixel, caculateScaling() && (displayUrl = scaleTo(displayWidth, displayHeight), 
title += ' - <span>' + String.format(gLang.img.scale, Number.getPercent(displayScale)) + '</span>')), new Dialog({
init: function(div) {
var img = div.getElementsByTagName('img')[0];
displayWidth && displayHeight ? applyDimensions(img) : img.onresize = img.onload = calculateActualDimensions;
},
title: title,
body: '<div style="text-align:center"><img src="' + displayUrl + '" /></div>',
button: 'OK'
});
};
}();
//# sourceMappingURL=uidialog.js.map