function initSelection($form) {
$form = $form.jquery ? $form : jQ($form);
var form = $form[0], contextDoc = document, needDisable = 'false' != form.getAttribute('needDisable'), checkboxNames = $A(arguments).slice(1), checkboxCount = 0, checkedCount = 0, checkedCounts = {}, opEls = [];
return $A(form.getElementsByTagName('a')).each((function(selLink) {
selLink.getAttribute('setSelection') && (selLink.href = 'javascript:;', selLink.onclick = setSelections);
})), setAllCancelCheckbox(), $A(form.getElementsByTagName('*')).each((function(opEl) {
opEl.getAttribute('forSelection') && opEls.push(opEl);
})), $A(contextDoc.getElementsByClassName('sigbtn')).each((function(opEl) {
opEl.getAttribute('forSelection') && opEls.push(opEl);
})), $A(contextDoc.getElementsByClassName('sigbtn_ns')).each((function(opEl) {
opEl.getAttribute('forSelection') && opEls.push(opEl);
})), iterateCheckboxes((function(checkbox, name) {
checkboxCount++, checkbox.onclick = checkboxOnclick;
})), reloadCheckedCount(), updateOperationStatus(), Event.observe(window, 'unload', (function() {
form = null, opEls = null, contextDoc = null;
})), {
addCountByName: function(name, c) {
checkedCounts[name] += c, checkedCount += c;
},
setCountByName: function(name, c) {
var countToAdd = c - checkedCounts[name];
checkedCounts[name] += countToAdd, checkedCount += countToAdd;
},
updateOperationStatus: updateOperationStatus,
refreshOperationStatus: refreshOperationStatus,
getCheckStatus: getCheckStatus,
getCheckedCount: getCheckedCount,
switchContextDoc: switchContextDoc
};
function setAllCancelCheckbox() {
$A(contextDoc.getElementsByName('selection_checkbox')).each((function(selChk) {
selChk.onclick = setCheckboxSelections;
}));
}
function switchContextDoc(doc) {
contextDoc = doc, setAllCancelCheckbox();
}
function iterateCheckboxes(iterator) {
var nameIterator = arguments[1] || Prototype.emptyFunction;
checkboxNames.each((function(name) {
nameIterator(name), Form.getInputs(form, 'checkbox', name).each((function(checkbox) {
iterator(checkbox, name);
}));
}));
}
function reloadCheckedCount() {
checkedCount = 0, iterateCheckboxes((function(checkbox, name) {
checkbox.checked && (checkedCount++, checkedCounts[name]++);
}), (function(name) {
checkedCounts[name] = 0;
}));
}
function refreshOperationStatus() {
reloadCheckedCount(), updateOperationStatus();
}
function statusChanged(chk) {
if (contextDoc.all) {
if (chk.lastChecked === chk.checked) return !1;
chk.lastChecked = chk.checked;
}
return !0;
}
function checkboxOnclick() {
if (statusChanged(this)) {
this.lastChecked = this.checked;
var name = this.name;
this.checked ? (checkedCounts[name]++, checkedCount++) : (checkedCounts[name]--, checkedCount--), updateRowStatus.apply(this, arguments), 
updateOperationStatus();
}
}
function updateRowStatus() {
this.lastChecked = this.checked, Element[(this.checked ? 'add' : 'remove') + 'ClassName'](this.parentNode.parentNode, 'selected');
}
function setCheckboxes(checked) {
'boolean' == typeof checked && (iterateCheckboxes((function(checkbox, name) {
checkbox.checked = checked, updateRowStatus.apply(checkbox);
})), reloadCheckedCount(), updateOperationStatus());
}
function setSelections() {
setCheckboxes('all' == this.getAttribute('setSelection'));
}
function setCheckboxSelections() {
setCheckboxes(this.checked);
}
function getCheckStatus(val) {
if (val) {
var symbol = val, count = checkedCount;
if ('(' == val.charAt(0)) {
var endBracket = val.indexOf(')');
endBracket && (symbol = val.substring(endBracket + 1), count = checkedCounts[val.substring(1, endBracket)]);
}
return '1' == symbol ? 1 == count : count > 0;
}
return !0;
}
function getCheckedCount(name) {
var count = checkedCount;
return name && (count = checkedCounts[name]), count;
}
function updateOperationStatus() {
$form.trigger('change.selection');
for (var i = 0; i < opEls.length; i++) {
var opEl = opEls[i], val = opEl.getAttribute('forSelection');
if (needDisable = needDisable || opEl.getAttribute('needDisable'), val) {
var symbol = val, count = checkedCount;
if ('(' == val.charAt(0)) {
var endBracket = val.indexOf(')');
endBracket && (symbol = val.substring(endBracket + 1), count = checkedCounts[val.substring(1, endBracket)]);
}
var enable = '1' == symbol ? 1 == count : count > 0;
enable && opEl.getAttribute('extraChk') && (enable = eval(opEl.getAttribute('extraChk'))), needDisable ? (opEl.disabled = !enable, 
opEl.disabled ? (Element.addClassName(opEl, 'disabled'), opEl.href && (opEl._href = opEl.href, opEl.href = 'javascript:;'), 
opEl.onclick && (opEl._onclick = opEl.onclick, opEl.onclick = null)) : (Element.removeClassName(opEl, 'disabled'), opEl._href && (opEl.href = opEl._href), 
null != opEl._onclick && (opEl.onclick = opEl._onclick))) : enable ? null != opEl._onclick && (opEl.onclick = opEl._onclick) : (opEl._onclick || (opEl._onclick = opEl.onclick), 
opEl.onclick = function() {
if (!Element.hasClassName(this, 'disabled')) {
var extraChk = eval(this.getAttribute('extraChk')), errorMsg = !extraChk && this.getAttribute('extraErrorMessage') ? this.getAttribute('extraErrorMessage') : this.getAttribute('errorMessage');
UI.alert(errorMsg);
}
});
}
}
checkedCount < checkboxCount ? $A(contextDoc.getElementsByName('selection_checkbox')).each((function(chkbox) {
chkbox.checked = !1;
})) : checkedCount == checkboxCount && 0 != checkedCount && $A(contextDoc.getElementsByName('selection_checkbox')).each((function(chkbox) {
chkbox.checked = !0;
}));
}
}
//# sourceMappingURL=select.js.map