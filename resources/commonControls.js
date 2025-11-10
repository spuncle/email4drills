var clickLink = function(aHrefElement, reload) {
aHrefElement && aHrefElement.tagName || (aHrefElement = this), UI.Dialog.closeAll(), jQ(aHrefElement).hasClass('check') && jQ('#nav_pop_nod').length > 0 && (new CMXClient).simpleCall('user:syncAutoSyncPOPAccounts');
var options, auth2Locked = 'true' == jQ(aHrefElement).attr('auth2Locked') && !$win().hasAuth2Unlocked, cmURL = jQ(aHrefElement).attr('href');
if (MM) {
if ('' != (jQ(aHrefElement).attr('target') || '')) return jQ((aHrefElement.parentNode || {}).parentNode).hasClass('unread') && setTimeout((function() {
MM.invalidModule([ 'folder', 'search' ]);
}), 500), !0;
var moduleOptions = {}, moduleName = jQ(aHrefElement).attr('totabid') || '';
return moduleName.indexOf('readLetter_') > -1 && (moduleName = 'letter_' + CC.getMidByUrl(cmURL), moduleOptions.replaceCurrent = !0, 
cmURL = 'mbox/' + cmURL), reload == undefined && (reload = !1), cmURL && '' == moduleName && (moduleName = GE.getModuleByURL(cmURL)), 
('preference' == moduleName || 'search' == moduleName || moduleName.toLowerCase().endsWith('pab') || 'oab' == moduleName.toLowerCase()) && (reload = !0), 
auth2Locked ? (options = {
onPass: function() {
MM.getModule(cmURL, moduleName, reload, null, moduleOptions);
}
}, auth2LockVerify(options)) : MM.getModule(cmURL, moduleName, reload, null, moduleOptions), $$(moduleName) && $$(moduleName).contentWindow.document.getElementById('addrChange') && ($$(moduleName).contentWindow.document.getElementById('addrChange').value = cmURL), 
!1;
}
if (auth2Locked) return options = {
onPass: function() {
$win().frames[$win().mainFrame].location.href = cmURL;
}
}, auth2LockVerify(options), !1;
};

function reloadPabAddr() {
var f = $$('loadAddData');
f && f.contentWindow.location.reload();
}

function getMboxChecksum() {
return window.mboxChecksum;
}

function setMboxChecksum(checksum) {
window.mboxChecksum = checksum;
}

function reloadNav() {
var f = $$('loadNav');
f && (f.src = CC.basePath + 'load_nav.jsp?sid=' + CC.sid);
}

function invalidateModules(modules) {
MM.invalidModule(modules);
}

var CC = $win().CC;

CC || ((CC = {
rev: '5d61e4c0'
}).basePath = '/coremail/XT5/', CC.sid = '', CC.locale = '', CC.showLoginForgotPass = !1, CC.FolderID = {
INBOX: 1,
DRAFT: 2,
SENT: 3,
TRASH: 4,
JUNK: 5,
VIRUS: 6,
ADVERTISEMENTS: 7
}, CC.folderInfo = {}, CC.addOutLinkTab = {}, CC.extendPab = {}, CC.isShowMultiTab = !0, CC.folderCategory = '', CC.LOADING_TIPS = new Notification({
type: 'loading'
}), CC.ACTION_TIPS = new Notification({
type: 'action'
}), CC.popTips = function(popMessage) {
popMessage = popMessage || [];
for (var i = 0; i < popMessage.length; i++) {
var info = popMessage[i], text = 'string' == typeof info ? info : info.text;
text && CC.ACTION_TIPS.show({
succ: !info.severity || 'info' == info.severity,
text: text
});
}
});

var MM = $win().MM, GE = $win().GE;
//# sourceMappingURL=commonControls.js.map