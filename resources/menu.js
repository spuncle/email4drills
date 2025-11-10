function Menu() {
this.globalMenu = {}, this.globalVar = {}, this.globalVar.module = 'coremail', this.showToolbarMenu = function(param, trigger, handleAction) {
var container = $(this.globalVar.module + '-' + param);
container ? container.innerHTML = '' : ((container = document.createElement('div')).setAttribute('id', this.globalVar.module + '-' + param), 
container.className = 'd-menu d-root', container.style.top = 0, container.style.position = 'absolute', document.body.appendChild(container));
if ('pageno' == param) !function(obj, container, trigger, handleAction) {
for (var menu = obj.globalMenu.pageno, ul = document.createElement('ul'), i = 0, len = menu.length; i < len; i++) ul.appendChild(document.createElement('li'));
container.appendChild(ul);
var maxHeight = 500;
obj.globalMenu.pageno_opt.maxHeight !== undefined && (maxHeight = parseInt(obj.globalMenu.pageno_opt.maxHeight));
container.offsetHeight > maxHeight && (container.style.height = maxHeight + 'px', container.style.overflowY = 'scroll');
handleAction && 'function' == typeof handleAction && handleAction(obj);
fSetMinWidth(container, obj.globalMenu.pageno_opt.mWidth), fFixAnchorWidth(container);
var containerHeight = container.offsetHeight;
Element.hide(container), flocationElement(container, trigger, containerHeight, obj.globalMenu.pageno_opt.mTop, obj.globalMenu.pageno_opt.relative_center), 
Element.show(container);
var menuLi = container.firstChild.childNodes, containerWidth = jQ(container).width(), liClientWidth = 0, liWidth = 0;
menuLi.length > 0 && (liClientWidth = menuLi[0].clientWidth, liWidth = jQ(menuLi).width());
for (i = 0; i < menuLi.length; i++) {
var li = menuLi[i], aWidth = containerWidth - (liClientWidth - liWidth);
if (null != menu[i] && '' != menu[i]) if ('line' == menu[i][0]) li.className = 'ln-thin'; else if (menu[i][9] && (li.className = menu[i][9]), 
fSetHoverStyle(li), menu[i][4]) li.innerHTML = '<a href="###" style="width: ' + aWidth + 'px"><b class="' + menu[i][2] + '"></b>' + menu[i][1].escapeHTML() + '<b class="arr"></b></a>', 
li.onmouseover = obj.showSubMenu.bind(obj, menu[i][0], li), li.onmouseout = obj.hideSubMenu.bind(obj, menu[i][0], li), li.onclick = obj.hideSubMenu.bind(obj, menu[i][0], li); else {
var info = {
value: menu[i][0]
};
menu[i][0] && (li.id = 'toolbar_pageno_' + menu[i][0]), menu[i][6] && menu[i][7] && (info.forSelection = menu[i][6], info.errorMessage = menu[i][7]), 
menu[i][8] && (info.extraChk = menu[i][8]), li.innerHTML = '<a href="###" style="width: ' + aWidth + 'px" class="' + menu[i][3] + '"><b class="' + menu[i][2] + '"></b>' + menu[i][1].escapeHTML() + '</a>', 
li.onclick = obj.clickItem.bind(obj, info, 'pageno');
}
}
}(this, container, trigger, handleAction); else {
for (var menu = this.globalMenu[param], ul = document.createElement('ul'), i = 0, len = menu.length; i < len; i++) {
var li = document.createElement('li');
if (null != menu[i] && '' != menu[i]) {
if ('line' == menu[i][0]) li.className = 'ln-thin'; else if (menu[i][9] && (li.className = menu[i][9]), fSetHoverStyle(li), 
menu[i][4]) li.innerHTML = '<a href="###"><b class="' + menu[i][2] + '"></b>' + menu[i][1].escapeHTML() + '<b class="arr"></b></a>', 
li.onmouseover = this.showSubMenu.bind(this, menu[i][0], li), li.onmouseout = this.hideSubMenu.bind(this, menu[i][0], li), 
li.onclick = this.hideSubMenu.bind(this, menu[i][0], li); else {
var info = {
value: menu[i][0]
};
menu[i][0] && (li.id = 'toolbar_' + param + '_' + menu[i][0]), menu[i][6] && menu[i][7] && (info.forSelection = menu[i][6], 
info.errorMessage = menu[i][7]), menu[i][8] && (info.extraChk = menu[i][8]), li.innerHTML = '<a href="###" class="' + menu[i][3] + '"><b class="' + menu[i][2] + '"></b>' + menu[i][1].escapeHTML() + '</a>', 
li.onclick = this.clickItem.bind(this, info, param);
}
ul.appendChild(li);
}
}
container.appendChild(ul);
var maxHeight = 500;
this.globalMenu[param + '_opt'].maxHeight !== undefined && (maxHeight = parseInt(this.globalMenu[param + '_opt'].maxHeight)), 
container.offsetHeight > maxHeight && (container.style.height = maxHeight + 'px', container.style.overflowY = 'scroll'), 
handleAction && 'function' == typeof handleAction && handleAction(this), fSetMinWidth(container, this.globalMenu[param + '_opt'].mWidth), 
fFixAnchorWidth(container);
var containerHeight = container.offsetHeight;
Element.hide(container), flocationElement(container, trigger, containerHeight, this.globalMenu[param + '_opt'].mTop, this.globalMenu[param + '_opt'].relative_center), 
0 != menu.length && Element.show(container);
}
onr1 = container, onr2 = trigger, onr3 = containerHeight, onr4 = this.globalMenu[param + '_opt'].mTop, onr5 = this.globalMenu[param + '_opt'].relative_center, 
$win().MN.currentMenu = container, function() {
if (jQ('input[name="cjzq_real_delete"]').length > 0) return !0;
if (jQ('div[name="cjzq_real_delete"]').length > 0) return !0;
if (jQ('input[name="cjzqDeletedFolder"]').length > 0) return !0;
return !1;
}() && jQ('#toolbar_morefunc_real_delete').hide();
}, this.clickItem = function(info, param) {
var menuOpt = this.globalMenu[param + '_opt'];
if (menuOpt.post_param) {
info.post_param = menuOpt.post_param.trim();
var postname = $(menuOpt.post_param);
postname && (postname.value = info.value);
}
var subMenu = $(this.globalVar.module + '-sub-' + param);
subMenu && (subMenu.style.visibility = 'hidden');
jQ($win().MN.currentMenu).remove(), menuOpt.handler.apply(null, [ info ]);
}, this.showSubMenu = function(param, trigger) {
var newmenu = $(this.globalVar.module + '-sub-' + param);
if (newmenu) newmenu.style.visibility = 'visible'; else {
var menu = this.globalMenu[param], container = document.createElement('div');
container.setAttribute('id', this.globalVar.module + '-sub-' + param), container.className = 'd-menu', container.style.position = 'absolute', 
container.style.top = Position.positionedOffset(trigger)[1] + 'px', container.style.left = trigger.offsetWidth + 'px', jQ.browser.msie && '7.0' == jQ.browser.version && (container.style.left = '0px'), 
trigger.appendChild(container);
for (var ul = document.createElement('ul'), i = 0, len = menu.length; i < len; i++) {
var li = document.createElement('li');
if ('line' == menu[i][0]) li.className = 'ln-thin'; else if (menu[i][4]) li.innerHTML = '<a href="###"><b class="' + menu[i][2] + '"></b>' + menu[i][1].escapeHTML() + '<b class="arr"></b></a>', 
li.onmouseover = this.showSubMenu.bind(this, menu[i][0], li), li.onmouseout = this.hideSubMenu.bind(this, menu[i][0], li), 
li.onclick = this.hideSubMenu.bind(this, menu[i][0], li); else {
var info = {
value: menu[i][0]
};
menu[i][6] && menu[i][7] && (info.forSelection = menu[i][6], info.errorMessage = menu[i][7]), menu[i][8] && (info.extraChk = menu[i][8]), 
li.innerHTML = '<a href="###" class="' + menu[i][3] + '"><b class="' + menu[i][2] + '"></b>' + menu[i][1] + '</a>', li.onclick = this.clickItem.bind(this, info, param);
}
fSetHoverStyle(li), ul.appendChild(li);
}
'moveto' === param && len > 12 && jQ(ul).addClass('scrollable'), container.appendChild(ul), fSetMinWidth(container, this.globalMenu[param + '_opt'].mWidth), 
fFixAnchorWidth(container), function(target, trigger) {
var winWidth;
winWidth = isIE ? 'CSS1Compat' == document.compatMode ? document.documentElement.clientWidth : document.body.clientWidth : self.innerWidth;
jQ(trigger).offset().left + jQ(trigger).width() + jQ(target).width() > winWidth && (target.style.left = 0 - jQ(target).width() - 2 + 'px');
}(container, trigger);
}
}, this.hideSubMenu = function(param, target) {
var newmenu = $(this.globalVar.module + '-sub-' + param);
newmenu && (newmenu.style.visibility = 'hidden');
}, this.locationElement = flocationElement, this.initClick = function() {
$win().MN = $win().MN || {}, $doc().onmousedown = document.onmousedown = function(e) {
var target = (e = e || window.event || this.parentWindow.event).srcElement || e.target;
try {
$win().MN.currentMenu && !fisElementParentClassNameFind(target, $win().MN.currentMenu.className) && jQ($win().MN.currentMenu).remove();
} catch (e) {}
};
}, this.isElementParentClassNameFind = fisElementParentClassNameFind;
var onr1, onr2, onr3, onr4, onr5, isIE = jQ.browser.msie, isIE6 = isIE && '6.0' == jQ.browser.version;
function fisElementParentClassNameFind(obj, className) {
for (;obj !== undefined && null !== obj && 'BODY' !== obj.tagName.toUpperCase(); ) {
if (obj.className == className) return !0;
obj = obj.parentNode;
}
return !1;
}
function fSetMinWidth(el, width) {
width = width || 100, isIE6 ? el.style.width = width + 'px' : el.style[el.clientWidth < width ? 'width' : 'minWidth'] = width + 'px';
}
function fSetHoverStyle(el) {
Event.observe(el, 'mouseover', (function() {
Element.addClassName(el, 'ln-hover');
}), !1), Event.observe(el, 'mouseout', (function() {
Element.removeClassName(el, 'ln-hover');
}), !1);
}
function fFixAnchorWidth(container) {
var containerWidth = jQ(container).width();
jQ('a', container).each((function() {
jQ(this).css('width', containerWidth - (jQ(this)[0].clientWidth - jQ(this).width()) + 'px');
}));
}
function flocationElement(target, trigger, targetHeight, customerMTop, isCenter) {
customerMTop = customerMTop || 0, isCenter = isCenter || !1;
var trigger_pos = Position.positionedOffset(trigger);
fisElementParentClassNameFind(trigger, 'controls ctrlbottom') && targetHeight < trigger_pos[1] ? target.style.top = trigger_pos[1] - targetHeight + customerMTop + 'px' : target.style.top = trigger_pos[1] + trigger.offsetHeight + customerMTop + 'px';
var winWidth, leftPos = trigger_pos[0];
fisElementParentClassNameFind(trigger, 'fRight') && (winWidth = isIE ? 'CSS1Compat' == document.compatMode ? document.documentElement.clientWidth : document.body.clientWidth : self.innerWidth, 
jQ(target).width() + trigger_pos[0] > winWidth ? (leftPos = leftPos - jQ(target).width() + jQ(trigger).width(), isCenter && (leftPos += (jQ(target).width() - jQ(trigger).width()) / 2)) : isCenter && (leftPos -= (jQ(target).width() - jQ(trigger).width()) / 2));
target.style.left = leftPos + 'px';
}
window.onresize = function() {
null != onr1 && flocationElement(onr1, onr2, onr3, onr4, onr5);
};
}
//# sourceMappingURL=menu.js.map