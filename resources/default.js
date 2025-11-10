function setTableEvents() {
for (var table, allTables = document.getElementsByTagName('table'), i = 0; table = allTables[i]; i++) if (Element.hasClassName(table, 'std')) for (var row, allRows = (table.tBodies[0] || {}).rows || [], j = 0; row = allRows[j]; j++) row.onmouseover = trMouseOver, 
row.onmouseout = trMouseOut;
}

function trMouseOver() {
Element.addClassName(this, 'over');
}

function trMouseOut() {
Element.removeClassName(this, 'over');
}

function trClick(e) {
var tagName = (Event.element(e || window.event).tagName || '').toLowerCase();
if ('input' != tagName && 'a' != tagName) {
var firstAnchor = this.getElementsByTagName('a')[0];
firstAnchor && firstAnchor.href && (location.href = firstAnchor.href);
}
}

setTableEvents();
//# sourceMappingURL=default.js.map