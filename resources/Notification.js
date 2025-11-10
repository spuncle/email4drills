function Notification(globalOptions) {
globalOptions = globalOptions || {};
this.show = function(options) {
'string' == typeof options && (options = {
text: options
});
options.succ ? options.type = 'suc' : options.type = 'err';
options.err && (options.type = 'err');
options.cls = 'cui-frameTips cui-tips cui-frameTips-' + options.type, options.expires = options.expires || 7e3, fDisplay(options);
}, this.hide = function(options) {
var frmId = 'mail_tips_action';
'loading' == options.type && (frmId = 'mail_tips_loading');
jQ('#' + frmId).stop(), jQ('#' + frmId).hide();
}, this.loading = function(options) {
(options = options || {}).icon = options.icon || 'cui-ico-loading', options.text = options.text || gLang.read.msg.tip_loading, 
options.type = 'loading', options.cls = 'cui-frameTips cui-frameTips-aside', fDisplay(options);
}, this.loaded = function() {
this.hide({
type: 'loading'
});
}, this.type = globalOptions.type || 'action';
var tplCss = {
cls: 'cui-tips',
tpl: '<div class="#{modclass}">#{_hasIcon}<span class="cui-tips-text">#{text}</span></div>',
_hasIcon: {
cls: 'cui-ico-loading',
tpl: '<span class="cui-tips-icon"><b class="cui-ico #{icon}"></b></span>'
}
};
document.body;
function fDisplay(options) {
var displayHTML = tplCss.tpl;
if (displayHTML = options.cls ? displayHTML.replace('#{modclass}', options.cls) : displayHTML.replace('#{modclass}', tplCss.cls), 
options.icon) {
var iconHTML = tplCss._hasIcon.tpl.replace('#{icon}', options.icon);
displayHTML = displayHTML.replace('#{_hasIcon}', iconHTML);
} else displayHTML = displayHTML.replace('#{_hasIcon}', '');
var isDisplay = !1;
options.text ? (isDisplay = !0, displayHTML = displayHTML.replace('#{text}', options.text)) : displayHTML = displayHTML.replace('#{text}', '');
var frmId = 'mail_tips_action';
'loading' == options.type && (frmId = 'mail_tips_loading');
if (options.frmCSS && options.frmCSS, options.target && jQ('#' + frmId).length > 0 && jQ('#' + frmId).remove(), 0 == jQ('#' + frmId).length && jQ(options.target || document.body).append('<div id="' + frmId + '"></div>'), 
jQ.each([ 'mail_tips_action', 'mail_tips_loading' ], (function(i, n) {
jQ('#' + n).hide();
})), isDisplay) {
var width = jQ(document).width();
jQ('#' + frmId).css({
top: '0px',
position: 'absolute'
}), jQ('#' + frmId).html(displayHTML);
var left = Math.floor((width - jQ('#' + frmId).outerWidth()) / 2);
jQ('#' + frmId).css({
left: left + 'px'
}), 'loading' != options.type ? jQ('#' + frmId).stop(!0, !0).slideDown(300).delay(options.expires || 3e3).slideToggle(300) : jQ('#' + frmId).stop().show();
}
}
}
//# sourceMappingURL=Notification.js.map