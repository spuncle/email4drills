function validateGrpName(inputOrName, otherGrpNames) {
var name = inputOrName.tagName ? inputOrName.value : inputOrName;
if ('' == (name = name.trim())) return UI.alert(res_alert_newgroupname_nullerror), !1;
if (name.len() > 24) {
var msg = res_alert_newgroupname_errorNameTooLong.replace('{0}', 24).replace('{1}', Math.floor(12));
return UI.alert(msg), !1;
}
if (containsAny(name, '%\'"\\/:*?<>|=,^')) return UI.alert(res_alert_newgroupname_errorGrpName.replace('{0}', '%\'"\\/:*?<>|=,^')), 
!1;
for (var i = 0; i < otherGrpNames.length && name != otherGrpNames[i]; i++) ;
return i == otherGrpNames.length || (UI.alert(res_alert_newgroupname_error), !1);
}

function validateGrpName1(inputOrName, otherGrpNames, order, initialname) {
var name = inputOrName.tagName ? inputOrName.value : inputOrName;
if ('' == (name = name.trim())) return UI.alert(res_alert_newgroupname_nullerror), !1;
if (name.len() > 24) {
var msg = res_alert_newgroupname_errorNameTooLong.replace('{0}', 24).replace('{1}', Math.floor(12));
return UI.alert(msg), !1;
}
if (containsAny(name, '%\'"\\/:*?<>|=,^')) return UI.alert(res_alert_newgroupname_errorGrpName.replace('{0}', '%\'"\\/:*?<>|=,^')), 
!1;
if ('addnew' == order) {
for (var i = 0; i < otherGrpNames.length && name != otherGrpNames[i]; i++) ;
if (i != otherGrpNames.length) return UI.alert(res_alert_newgroupname_error), !1;
}
if ('update' == order) {
for (i = 0; i < otherGrpNames.length && (name != otherGrpNames[i] || name == initialname); i++) ;
if (i != otherGrpNames.length) return UI.alert(res_alert_newgroupname_error), !1;
}
return !0;
}

function containsAny(s1, s2) {
for (var i = 0; i < s1.length; i++) if (s2.indexOf(s1.charAt(i)) >= 0) return !0;
return !1;
}

Date.isDateFormat = function(dateString) {
if (-1 == dateString.indexOf('-')) return !1;
var items = dateString.split('-');
if (items.length < 3) return !1;
var year = items[0], month = items[1] - 1, day = items[2];
if (isNaN(year) || isNaN(month) || isNaN(day)) return !1;
var date = new Date(year, month, day);
return date.getFullYear() == year && date.getMonth() == month && date.getDate() == day;
}, Date.isShortTimeFormat = function(timeString) {
if (-1 == timeString.indexOf(':')) return !1;
var items = timeString.split(':');
if (items.length < 2) return !1;
var hour = items[0], minute = items[1], second = items[2] == undefined ? 0 : items[2];
return !(isNaN(hour) || isNaN(minute) || isNaN(second)) && !(parseInt(hour) >= 24 || parseInt(minute) > 59 || parseInt(second) > 59);
};
//# sourceMappingURL=verifyformat.js.map