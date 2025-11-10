function isTopWin() {
return window == window.top;
}

function getTarget() {
return isTopWin() ? window : window.parent;
}

function setlistOperating(errorMessage, value) {
var opt_param = {
forSelection: '1',
errorMessage: errorMessage,
post_param: 'morefuncSelect',
value: value
};
$('morefuncSelect').value = value, submitMoreFunc(opt_param);
}

!function(jQuery) {
function keyHandler(handleObj) {
if ('string' == typeof handleObj.data) {
var origHandler = handleObj.handler, keys = handleObj.data.toLowerCase().split(' ');
handleObj.handler = function(event) {
if (this === event.target || !/textarea|select/i.test(event.target.nodeName) && 'text' !== event.target.type && 'password' !== event.target.type) {
var special = 'keypress' !== event.type && jQuery.hotkeys.specialKeys[event.which], character = String.fromCharCode(event.which).toLowerCase(), modif = '', possible = {};
event.altKey && 'alt' !== special && (modif += 'alt+'), event.ctrlKey && 'ctrl' !== special && (modif += 'ctrl+'), event.metaKey && !event.ctrlKey && 'meta' !== special && (modif += 'meta+'), 
event.shiftKey && 'shift' !== special && (modif += 'shift+'), special ? possible[modif + special] = !0 : (possible[modif + character] = !0, 
possible[modif + jQuery.hotkeys.shiftNums[character]] = !0, 'shift+' === modif && (possible[jQuery.hotkeys.shiftNums[character]] = !0));
for (var i = 0, l = keys.length; i < l; i++) if (possible[keys[i]]) return origHandler.apply(this, arguments);
}
};
}
}
jQuery.hotkeys = {
specialKeys: {
8: 'backspace',
9: 'tab',
13: 'enter',
16: 'shift',
17: 'ctrl',
18: 'alt',
19: 'pause',
20: 'capslock',
27: 'esc',
32: 'space',
33: 'pageup',
34: 'pagedown',
35: 'end',
36: 'home',
37: 'left',
38: 'up',
39: 'right',
40: 'down',
45: 'insert',
46: 'del',
96: '0',
97: '1',
98: '2',
99: '3',
100: '4',
101: '5',
102: '6',
103: '7',
104: '8',
105: '9',
106: '*',
107: '+',
109: '-',
110: '.',
111: '/',
112: 'f1',
113: 'f2',
114: 'f3',
115: 'f4',
116: 'f5',
117: 'f6',
118: 'f7',
119: 'f8',
120: 'f9',
121: 'f10',
122: 'f11',
123: 'f12',
144: 'numlock',
145: 'scroll',
191: '/',
224: 'meta',
220: '|'
},
shiftNums: {
'`': '~',
1: '!',
2: '@',
3: '#',
4: '$',
5: '%',
6: '^',
7: '&',
8: '*',
9: '(',
0: ')',
'-': '_',
'=': '+',
';': ': ',
'\'': '"',
',': '<',
'.': '>',
'/': '?',
'\\': '|'
}
}, jQuery.each([ 'keydown', 'keyup', 'keypress' ], (function() {
jQuery.event.special[this] = {
add: keyHandler
};
}));
}(jQuery), 1 == $win().enableShortCut && jQ(document).ready((function() {
EnableShortCut = !0, jQuery(document).bind('keydown', 'c', (function(evt) {
return isTopWin() ? jQ('#navContainer a.compose').length > 0 && jQ('#navContainer a.compose').click() : window.parent.jQ('#navContainer a.compose').length > 0 && window.parent.jQ('#navContainer a.compose').click(), 
!1;
})), jQuery(document).bind('keydown', '/', (function(evt) {
var helplink = isTopWin() ? jQ('#headContainer a.helplink') : window.parent.jQ('#headContainer a.helplink');
return window.open(helplink.attr('href')), !1;
})), jQuery(document).bind('keydown', 'Ctrl+|', (function(evt) {
var target = getTarget();
return target.GE && 'welcome' != target.GE.curModule && target.UI.Tab.close(target.GE.curModule), !1;
})), jQuery(document).bind('keydown', 'Shift+m', (function(evt) {
return isTopWin() ? jQ('#navContainer a.check').length > 0 && jQ('#navContainer a.check').click() : window.parent.jQ('#navContainer a.check').length > 0 && window.parent.jQ('#navContainer a.check').click(), 
!1;
})), jQuery(document).bind('keydown', 'left', (function(evt) {
var target = getTarget(), curModule = target.GE.curModule, neighborModule = target.GE.getTabNeighbor(curModule);
return neighborModule.prev && target.MM.getModule(null, neighborModule.prev), !1;
})), jQuery(document).bind('keydown', 'right', (function(evt) {
var target = getTarget(), curModule = target.GE.curModule, neighborModule = target.GE.getTabNeighbor(curModule);
return neighborModule.next && target.MM.getModule(null, neighborModule.next), !1;
})), jQuery(document).bind('keydown', 'p', (function(evt) {
var pplink = jQ('#controls_top a.pp');
return pplink.length <= 0 || (MM ? clickLink(pplink[0]) : window.location.href = pplink.attr('href')), !1;
})), jQuery(document).bind('keydown', 'n', (function(evt) {
var nplink = jQ('#controls_top a.np');
return nplink.length <= 0 || (MM ? clickLink(nplink[0]) : window.location.href = nplink.attr('href')), !1;
})), jQuery(document).bind('keydown', 'r', (function(evt) {
return jQ('#messageForm table.std').length > 0 ? setlistOperating('error_reply_mail', 'reply') : (jQ('#btnReply').length > 0 && jQ('#btnReply').click(), 
jQ('#replyLastSender').length > 0 && jQ('#replyLastSender').click()), !1;
})), jQuery(document).bind('keydown', 'a', (function(evt) {
return jQ('#messageForm table.std').length > 0 ? setlistOperating('error_reply_mail', 'replyall') : jQ('#btnReplyAll').length > 0 && jQ('#btnReplyAll').click(), 
!1;
})), jQuery(document).bind('keydown', 'f', (function(evt) {
return jQ('#messageForm table.std').length > 0 ? setlistOperating('error_forward_mail', 'forward') : jQ('#btnForward').length > 0 && jQ('#btnForward').click(), 
!1;
})), jQuery(document).bind('keydown', 'del', (function(evt) {
return jQ('div[name=\'real_delete\']').length > 0 && (jQ('div[name=\'real_delete\']').hasClass('disabled') ? UI.alert(gLang.menu.msg.error_del_mail) : jQ('input[name=\'real_delete\']').length > 0 && jQ('input[name=\'real_delete\']')[0].click()), 
jQ('div[name=\'delete\']').length > 0 && (jQ('div[name=\'delete\']').hasClass('disabled') ? UI.alert(gLang.menu.msg.error_del_mail) : jQ('input[name=\'delete\']').length > 0 && jQ('input[name=\'delete\']')[0].click()), 
!1;
})), jQuery(document).bind('keydown', 'm', (function(evt) {
if (jQ('#messageForm table.std').length > 0) {
for (var mids = document.getElementsByName('mid'), opt = {
value: '',
forSelection: '+',
errorMessage: 'error_sel_opt_mail'
}, param = $('markedflag'), i = 0; i < mids.length; i++) {
var mid = mids[i];
if (mid.checked) {
'read' == mid.getAttribute('flag') ? (opt = {
value: 'Recent',
forSelection: '+',
errorMessage: 'error_mark_mail'
}, param.value = 'Recent') : (opt = {
value: 'Seen',
forSelection: '+',
errorMessage: 'error_sel_opt_mail'
}, param.value = 'Seen');
break;
}
}
submitOnChange(opt);
}
return !1;
})), jQuery(document).bind('keydown', 'Ctrl+enter', (function(evt) {
var btnSchedule = $('btnSchedule'), btnSend = $('btnSend');
if (btnSend && 'none' != btnSend.style.display) if (Element.hasClassName(btnSend, 'disabled')) UI.alert(gLang.compose.msg.operate_disable); else {
var btnName = btnSend.getAttribute('name');
jQ('input[name=\'' + btnName + '\']')[0].click();
} else if (btnSchedule && 'none' != btnSchedule.style.display) if (Element.hasClassName(btnSchedule, 'disabled')) UI.alert(gLang.compose.msg.operate_disable); else {
btnName = btnSchedule.getAttribute('name');
jQ('input[name=\'' + btnName + '\']').length > 0 && jQ('input[name=\'' + btnName + '\']')[0].click();
}
return !1;
})), jQuery(document).bind('keydown', 'Ctrl+s', (function(evt) {
var btnSave = $('btnSave');
return btnSave && btnSave.click(), Event.stop(evt), !1;
})), jQuery(document).bind('keydown', 'Shift+left', (function(evt) {
var pplink = jQ('span.pagesNav a.pp');
return pplink.length > 0 && (window.location.href = pplink.attr('href')), !1;
})), jQuery(document).bind('keydown', 'Shift+right', (function(evt) {
var nplink = jQ('span.pagesNav a.np');
return nplink.length > 0 && (window.location.href = nplink.attr('href')), !1;
})), jQuery(document).bind('keydown', 'Ctrl+a', (function(evt) {
return document.getElementsByName('selection_checkbox')[0].click(), Event.stop(evt), !1;
}));
}));
//# sourceMappingURL=shortcut.js.map