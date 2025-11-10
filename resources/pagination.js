function Pagination(totalCount, itemPerPage, currentPage, requestPageNo, baseURL, targetPage, options) {
(options = options || {}).isDisplayTotal = options.isDisplayTotal || !1, options.sPageFontText = options.sPageFontText || null;
var pageNo = 1, lastPageNo = 1;
totalCount > 0 && (totalCount = parseInt(totalCount)), itemPerPage > 0 && (itemPerPage = parseInt(itemPerPage)), currentPage ? pageNo = parseInt(currentPage) : requestPageNo && (pageNo = parseInt(requestPageNo)), 
lastPageNo = parseInt(Math.max(lastPageNo, (totalCount + itemPerPage - 1) / itemPerPage)), pageNo = (pageNo = pageNo > lastPageNo ? lastPageNo : pageNo) < 1 ? 1 : pageNo;
var sTotalTips = '';
options.isDisplayTotal && (sTotalTips = '<span class=\'pageNoDesc\'>' + (sTotalTips = (sTotalTips = gLang.read.page.page_total).replace('{0}', totalCount)) + '</span>'), 
options.sPageFontText && (sTotalTips = '<span class=\'pageNoDesc\'>' + options.sPageFontText + '</span>');
var prevHTML, nextHTML, pageSelectHTML = sTotalTips + '<span class=\'pageNo\' ' + (lastPageNo > 1 ? 'onclick=\'MN.showToolbarMenu("pageno",this);\'' : '') + '>' + pageNo + '/' + lastPageNo + (lastPageNo > 1 ? '<a href=\'javascript:void(0);\' class=\'arr\'></a>' : '') + '</span>';
if (lastPageNo > 1) {
for (var pageNumbers = [], jumpNo = 1; jumpNo <= lastPageNo; jumpNo++) pageNumbers.push([ jumpNo, jumpNo + '/' + lastPageNo, 'ico', '', !1, '', '', '' ]);
MN.globalMenu.pageno = pageNumbers, MN.globalMenu.pageno_opt = {
handler: options.handler || function(selEl) {
targetPage ? targetPage.location.href = baseURL + '&page_no=' + selEl.value : document.location.href = baseURL + '&page_no=' + selEl.value;
},
relative_center: !0,
mWidth: 120,
maxHeight: 350,
mTop: 5
};
}
options.handler ? (prevHTML = '<a title=\'' + gLang.read.page.prev_page + '\' href=\'javascript:void(0);\' class=\'page ' + (1 == pageNo ? 'prevPage' : 'prevPageOn') + '\'></a>', 
nextHTML = '<a title=\'' + gLang.read.page.next_page + '\' href=\'javascript:void(0);\' class=\'page ' + (pageNo == lastPageNo ? 'nextPage' : 'nextPageOn') + '\'></a>') : (prevHTML = '<a title=\'' + gLang.read.page.prev_page + '\'href=\'' + (pageNo > 1 ? baseURL + '&page_no=' + (pageNo - 1) : 'javascript:void(0);') + '\'' + (targetPage ? ' target=\'' + jQ(targetPage).attr('name') + '\'' : '') + ' class=\'' + (1 == pageNo ? 'prevPage' : 'prevPageOn') + '\'></a>', 
nextHTML = '<a title=\'' + gLang.read.page.next_page + '\'href=\'' + (pageNo < lastPageNo ? baseURL + '&page_no=' + (pageNo + 1) : 'javascript:void(0);') + '\'' + (targetPage ? ' target=\'' + jQ(targetPage).attr('name') + '\'' : '') + ' class=\'' + (pageNo == lastPageNo ? 'nextPage' : 'nextPageOn') + '\'></a>');
var pageNav = '<span class=\'pagesNav\'>' + prevHTML + nextHTML + '</span>';
function fCustomHandler(container) {
jQ(container).find('a.page').click((function(evt) {
evt.preventDefault();
var $this = jQ(this);
$this.hasClass('prevPageOn') ? options.handler(pageNo - 1) : $this.hasClass('nextPageOn') && options.handler(pageNo + 1);
}));
}
this.display = function() {
0 == jQ('#pageNo').length ? jQ('.fRight').each((function() {
jQ(this).html(pageSelectHTML + pageNav), options.handler && fCustomHandler(this);
})) : (jQ('#pageNo').html(pageSelectHTML + pageNav), options.handler && fCustomHandler(this));
};
}
//# sourceMappingURL=pagination.js.map