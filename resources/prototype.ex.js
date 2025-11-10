Object.extend(String.prototype, {
trim: function() {
return this.replace(/^\s+/, '').replace(/\s+$/, '');
},
text2HTML: function() {
for (var context = this.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('\r\n').join('<br>').split('\n').join('<br>'), text2html = '', i = 0; i < context.length; i++) i > 0 && ' ' == context.charAt(i) && ' ' == context.charAt(i - 1) ? text2html += '&nbsp;' : text2html += context.charAt(i);
return text2html;
}
}), Object.extend(Element, {
toggleClassName: function(element, className) {
if (element = $(element)) return Element[Element.hasClassName(element, className) ? 'removeClassName' : 'addClassName'](element, className);
},
switchClassName: function(element, className1, className2) {
Element.toggleClassName(element, className1), Element.toggleClassName(element, className2);
},
buildAttributes: function(attrs, ignoreEmptyValue, useSingleQuote) {
var result = ' ';
for (var key in attrs) if (key) {
var value = attrs[key];
if (!value && ignoreEmptyValue) continue;
result += key + '=' + (useSingleQuote ? '\'' : '"'), value && (result += useSingleQuote ? value.replace(/'/g, '&#39;') : value.replace(/"/g, '&#34;')), 
result += (useSingleQuote ? '\'' : '"') + ' ';
}
return result;
}
}), Array.prototype.indexOf || (Array.prototype.indexOf = function(object) {
for (var i = 0; i < this.length; i++) if (this[i] == object) return i;
return -1;
});
//# sourceMappingURL=prototype.ex.js.map