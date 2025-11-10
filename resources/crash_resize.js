var wResize = new WResize;

function WResize() {
var _markedValues = {};
function fSetMarkedValue(key, value) {
_markedValues[key] = value;
}
this.isResized = function(key, currentValue) {
if (function(key) {
return _markedValues[key] || 0;
}(key) == currentValue) return !1;
return fSetMarkedValue(key, currentValue), !0;
}, this.setMarkedValue = fSetMarkedValue;
}
//# sourceMappingURL=crash_resize.js.map