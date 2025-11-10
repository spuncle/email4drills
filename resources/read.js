function show_hide(me, id) {
var mySpans = $(me).getElementsByTagName('span');
Element.toggle(id, mySpans[0], mySpans[1]), fixMboxSearchHeight();
}

function fixMboxSearchHeight() {
var srchForm = jQ('#dvDialogStyle .OptTheme'), fixedHgt = jQ('#mainContainer').height() - 60;
srchForm.css('overflow-x', 'hidden'), srchForm.height() + srchForm.scrollTop() > fixedHgt ? (srchForm.height(fixedHgt), 
srchForm.css('overflow-y', 'scroll')) : (srchForm.css('height', null), srchForm.css('overflow-y', null));
}

function selected(element) {
var li = jQ(element).closest('li');
jQ('#addNfFolders li').css({
'background-color': '',
'font-weight': 'normal'
}), li.css({
'background-color': '#d6d6d6',
'font-weight': 'bold'
}), li.find('input').prop('checked', !0);
}

function funSetMsgWinHeight() {
var msgFrm = $('mail_content');
if (msgFrm) {
var minMailContentHeight = msgFrm.clientHeight, newHeight = msgFrm[document.all ? 'Document' : 'contentDocument'].body.scrollHeight;
newHeight = newHeight > minMailContentHeight ? newHeight + 30 : minMailContentHeight, Element.setStyle(msgFrm, {
height: newHeight + 'px'
});
}
}

function initSrchKeyDisplay(element, hintValue, cssClassName, checkBox) {
var e = element, hValue = hintValue, css = cssClassName;
'' == e.value && (e.value = hintValue), e.value != hintValue && Element.hasClassName(e, css) && Element.removeClassName(e, css), 
e.onfocus = function() {
e.value == hValue && (e.value = '', checkBox.checked = !0), Element.hasClassName(e, css) && Element.removeClassName(e, css);
}, e.onblur = function() {
'' == e.value && (e.value = hValue, checkBox.checked = !1, Element.addClassName(e, css));
};
}

function hideInfoPanel(el) {
jQ(el).closest('.infoPanel').remove();
}

!function() {
var sid, dialog, actFunc;
window.saveAttach2Nf = function(_sid, actionFunc) {
sid = _sid, actFunc = actionFunc, function() {
var left, span = jQ('.oprt.txt-info');
left = span.width() >= 0 && null != jQ('#navContainer', window.parent.document).width() ? span.offset().left + span.width() + jQ('#navContainer', window.parent.document).width() + 5 : 200;
dialog ? dialog.show() : new Ajax.Request('nfDirectory.jsp?sid=' + sid, {
onSuccess: function(transport) {
var options = {
left: left,
title: gLang.read.msg.saveAttach2Nf,
body: transport.responseText,
action: function(sForm) {
var ischecked = !1;
if ($A(sForm.getElementsByTagName('input')).each((function(inp) {
'radio' == inp.type && inp.checked && (ischecked = !0, actFunc(inp.value));
})), !ischecked) return UI.alert(gLang.read.msg.isnotchecked), !1;
},
cache: !0
};
dialog = new UI.Dialog(options);
},
onFailure: function(transport) {
UI.alert('request selectnf.jsp failed.');
}
});
}();
};
}();
//# sourceMappingURL=read.js.map