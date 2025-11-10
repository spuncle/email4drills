function initSigbtn() {
var name_i = 0;
jQ('div.sigbtn').each((function() {
var b_name = jQ(this).attr('name');
b_name == undefined && (b_name = 'sigbtn_' + name_i, jQ(this).attr('name', b_name), name_i++);
var b_type = jQ(this).attr('type');
if (0 == jQ('input[name=\'' + b_name + '\']').length) {
var attrs = {
name: b_name,
type: 'submit' == b_type ? 'submit' : 'button',
value: jQ(this).attr('value')
};
jQ(this).attr('btnonclick') && (attrs.onclick = jQ(this).attr('btnonclick')), jQ(this).attr('extraChk') && (attrs.extraChk = jQ(this).attr('extraChk')), 
jQ(this).attr('errormessage') && (attrs.errormessage = jQ(this).attr('errormessage'));
var button = jQ('<input ' + Element.buildAttributes(attrs) + '/>');
jQ(button).addClass('hidden-element'), button.insertAfter(jQ(this));
}
'true' == jQ(this).attr('disabledBool') && jQ(this).addClass('disabled'), this.onclick = function() {
if (!jQ(this).hasClass('disabled')) {
var b_name = jQ(this).attr('name');
jQ('input[name=\'' + b_name + '\']')[0].click();
}
};
})).mouseover((function() {
jQ(this).hasClass('disabled') || jQ(this).addClass('sigbtn_over');
})).mouseout((function() {
jQ(this).hasClass('disabled') || jQ(this).removeClass('sigbtn_over');
})).mousedown((function() {
jQ(this).hasClass('disabled') || jQ(this).addClass('sigbtn_down');
})).mouseup((function() {
jQ(this).hasClass('disabled') || jQ(this).removeClass('sigbtn_down');
})), jQ('div.sigbtn_ns').each((function() {
var b_name = jQ(this).attr('name');
b_name == undefined && (b_name = 'sigbtn_ns' + name_i, jQ(this).attr('name', b_name), name_i++);
var b_type = jQ(this).attr('type');
if (0 == jQ('input[name=\'' + b_name + '\']').length) {
var attrs = {
name: b_name,
type: 'submit' == b_type ? 'submit' : 'button',
value: jQ(this).attr('value')
};
jQ(this).attr('btnonclick') && (attrs.onclick = jQ(this).attr('btnonclick')), jQ(this).attr('extraChk') && (attrs.extraChk = jQ(this).attr('extraChk')), 
jQ(this).attr('errormessage') && (attrs.errormessage = jQ(this).attr('errormessage'));
var button = jQ('<input ' + Element.buildAttributes(attrs) + '/>');
jQ(button).addClass('hidden-element'), button.insertAfter(jQ(this));
}
'true' == jQ(this).attr('disabledBool') && jQ(this).addClass('disabled'), this.onclick = function() {
if (!jQ(this).hasClass('disabled')) {
var b_name = jQ(this).attr('name');
jQ('input[name=\'' + b_name + '\']')[0].click();
}
};
}));
}

function initTargetBtn(div) {
if (div) {
var b_name = jQ(div).attr('name') || jQ(div).attr('id');
b_name == undefined && (b_name = 'sigbtn', jQ(div).attr('name', b_name));
var b_type = jQ(div).attr('type');
if (0 == jQ('input[name=\'' + b_name + '\']').length) {
var attrs = {
name: b_name,
type: 'submit' == b_type ? 'submit' : 'button',
value: jQ(div).attr('value')
};
jQ(div).attr('forselection') && (attrs.forselection = jQ(div).attr('forselection')), jQ(div).attr('btnonclick') && (attrs.onclick = jQ(div).attr('btnonclick')), 
jQ(div).attr('extraChk') && (attrs.extraChk = jQ(div).attr('extraChk')), jQ(div).attr('errormessage') && (attrs.errormessage = jQ(div).attr('errormessage'));
var button = jQ('<input ' + Element.buildAttributes(attrs) + '/>');
jQ(button).addClass('hidden-element'), button.insertAfter(jQ(div));
}
'true' == jQ(div).attr('disabledBool') && jQ(div).addClass('disabled'), jQ(div).click((function() {
jQ(this).hasClass('disabled') || jQ('input[name=\'' + b_name + '\']')[0].click();
})).mouseover((function() {
jQ(this).hasClass('disabled') || jQ(this.addClass('sigbtn_over'));
})).mouseout((function() {
jQ(this).hasClass('disabled') || jQ(this).removeClass('sigbtn_over');
})).mousedown((function() {
jQ(this).hasClass('disabled') || jQ(this.addClass('sigbtn_down'));
})).mouseup((function() {
jQ(this).hasClass('disabled') || jQ(this).removeClass('sigbtn_down');
}));
}
}

function clearSigbtn() {
jQ('div.sigbtn,div.sigbtn_ns').each((function() {
var b_name = jQ(this).attr('name');
jQ('input[name=\'' + b_name + '\']').remove();
}));
}
//# sourceMappingURL=sigbtn.js.map