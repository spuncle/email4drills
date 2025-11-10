var Dom = {};

Object.extend(Dom, {
getViewPort: function() {
var viewportwidth, viewportheight;
return 'undefined' != typeof window.innerWidth ? (viewportwidth = window.innerWidth, viewportheight = window.innerHeight) : 'undefined' != typeof document.documentElement && 'undefined' != typeof document.documentElement.clientWidth && 0 != document.documentElement.clientWidth ? (viewportwidth = document.documentElement.clientWidth, 
viewportheight = document.documentElement.clientHeight) : (viewportwidth = document.getElementsByTagName('body')[0].clientWidth, 
viewportheight = document.getElementsByTagName('body')[0].clientHeight), {
width: viewportwidth,
height: viewportheight
};
}
});
//# sourceMappingURL=dom.js.map