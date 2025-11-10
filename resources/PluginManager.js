var PluginInfo = function(window) {
var data, instance = {
createDownloadLinkForCMPlugin: function(tips, style, noAnchor, isOutlook) {
var info = fGetLatestPluginInfo(isOutlook = isOutlook || !1), enable = !0 === info.enable || 'on' === info.enable, link = info.name ? (isOutlook ? '/coremail/coremail_plugin/update/coremail_plugin_file/coremail/' : '/cab/') + info.name : '';
return link ? fGetDownloadLink(isOutlook && enable ? info.link : link, noAnchor, tips, style) : noAnchor ? 'javascript:void(0);' : isOutlook ? '' : tips + '(' + gLang.compose.msg.request_plugin_info_fail + ')';
},
hasNewVersion: function(version) {
return fCompareVersion(fGetLatestPluginInfo(!1).version, version) > 0;
}
};
return window.PluginInfo || (window.PluginInfo = {
asyncLoad: function fGetPluginInfoObjAsync(callback) {
if (null != data) return void (callback && callback(instance));
if (null == fGetPluginInfoObjAsync.callbacks) {
function pluginInfoLoaded(_data) {
data = _data || {}, jQuery.each(fGetPluginInfoObjAsync.callbacks, (function(index, callback) {
callback(instance);
})), delete fGetPluginInfoObjAsync.callbacks;
}
fGetPluginInfoObjAsync.callbacks = [], callback && fGetPluginInfoObjAsync.callbacks.push(callback), jQuery.ajax({
type: 'GET',
url: '/cab/desc.json',
async: !1,
cache: !1,
dataType: 'json',
success: pluginInfoLoaded,
failure: function() {
pluginInfoLoaded(null);
},
error: function() {
pluginInfoLoaded(null);
}
});
}
},
compareVersion: fCompareVersion,
system: function() {
var $OSList = {
Windows: /(Windows)/i,
Macintosh: /(Mac OS X|Mac_PowerPC|Macintosh)/i,
Android: /(Android)/i,
iPhone: /(iPhone)/i,
iPad: /(iPad)/i
}, sUserAgent = navigator.userAgent;
for (var i in $OSList) if ($OSList.hasOwnProperty(i) && sUserAgent.match($OSList[i])) return i;
return 'Unknown';
}()
});
function fGetDownloadLink(link, noAnchor, tips, style) {
return link ? noAnchor ? link : '<a href="' + link + '" target="_blank" style="' + style + '">' + tips + '</a>' : tips + '(' + gLang.compose.msg.request_plugin_info_fail + ')';
}
function fGetLatestPluginInfo(isOutlook) {
if (null == data) throw 'Program Error - asyncLoad not called';
if (isOutlook = isOutlook || !1) return data.outlookdownlink || {};
for (var matchedType = isOutlook ? 'outlook' : 'webmail', programs = data.programs || [], i = 0; i < programs.length; i++) if (programs[i]['for'] == matchedType && programs[i].system == PluginInfo.system) return programs[i];
return isOutlook ? {} : {
version: '4.0.1.0'
};
}
function fCompareVersion(version1, version2) {
for (var v1 = (version1 || '').split('.', 4), v2 = (version2 || '').split('.', 4), i = 0; i < v1.length; i++) {
var i1 = parseInt(v1[i]) || v1[i] || 0, i2 = parseInt(v2[i]) || v2[i] || 0;
if (i1 < i2) return -1;
if (i1 > i2) return 1;
}
return 0;
}
}(window.$win && $win() || window), PluginManager = function() {
var cmPlugin, cmUpload, screenCapture, soundRecord, videoRecord, browserOpening = !1, _document = null, waitingFileIds = [], waitingEmbbedFileIds = [], EUpload_Type = {
Upload_NetFolder: 1,
Upload_Compose: 2,
Upload_Invite: 3
}, ESubmit_Type = {
Normal: 1,
ScreenCapture: 2,
SoundRecord: 3,
VideoRecord: 4,
DropFiles: 5
}, EUploadItemState_Type = {
Ready: 0,
CRC: 1,
Query: 2,
Uploading: 3,
Finish: 4,
FinishWithoutCRC: 5,
Error: 6,
Stopping: 7
};
return {
Upload_Type: EUpload_Type,
Submit_Type: ESubmit_Type,
UploadItemState_Type: EUploadItemState_Type,
UploadItemError_Type: {
No_Error: 0,
Param_Error: 1,
Interrupt_Error: 2,
FileAccess_Error: 3,
CRC_Error: 4,
Network_Error: 5,
FileNotExist_Error: 6,
FilesNumOverFlow_Error: 7,
UploadLimit_Error: 8,
System_Error: 9
},
SndRecordState_Type: {
Initializing: 0,
Ready: 1,
Recording: 2,
Stopping: 3,
Finish: 4
},
VdoRecordState_Type: {
Initializing: 0,
Ready: 1,
Recording: 2,
RecFinish: 3,
Compassing: 4,
ComFinish: 5
},
initPluginManager: fInitPluginManager,
isLoaded: fIsLoaded,
isValid: fIsValid,
getVersion: function() {
return fIsLoaded() ? cmPlugin.version : '';
},
isV4: function() {
return PluginInfo.compareVersion(this.getVersion(), '4.0.0.0') >= 0;
},
isSupportEmbbedFile: function() {
return PluginInfo.compareVersion(this.getVersion(), '4.0.3.0') >= 0 && 'Windows' == PluginInfo.system;
},
shutDown: function() {
cmPlugin.shutdown();
},
reloadPluginDiv: function(jQ, callBack) {
jQ('#cmplugin', _document).remove();
var eCMPlugin = _document.createElement('OBJECT');
jQ(eCMPlugin).attr({
id: 'cmplugin',
type: 'application/x-cmplugin',
height: 0,
width: 0
});
var param = _document.createElement('PARAM');
jQ(param).attr({
name: 'onload',
value: 'pluginLoaded'
}), jQ(eCMPlugin).append(param), jQ(_document).append(eCMPlugin), fInitPluginManager(_document, 'cmplugin'), setTimeout((function() {
callBack.call(this);
}), 200);
},
browserFolder: fBrowserFolder,
initUpload: function(type, param, callback, options, specify) {
if (param = param || {}, callback = callback || null, (options = options || {}).prefixUrl = options.prefixUrl || null, specify = specify || !1, 
cmUpload) {
var sid;
CMXClient.getSID ? sid = CMXClient.getSID() : gSID && (sid = gSID);
param.fid && param.fid;
var queryURL, uploadURL, URL = (options.prefixUrl ? options.prefixUrl : function(loc) {
var hostname = loc.hostname, port = loc.port;
-1 != hostname.indexOf(':') && -1 == hostname.indexOf('[') && (hostname = '[' + hostname + ']');
var host = hostname;
null != port && '' != port && (host = host + ':' + port);
return loc.protocol + '//' + host;
}(window.location)) + '/coremail/';
switch (type) {
case EUpload_Type.Upload_Compose:
queryURL = URL + 'comupload.jsp?sid=' + sid + '&composeId=' + param.composeId, uploadURL = URL + 's?func=upload:directData&sid=' + sid + '&composeId=' + param.composeId, 
param.isCapture && (queryURL += '&inlined=true', uploadURL += '&inlined=true');
break;

case EUpload_Type.Upload_NetFolder:
queryURL = URL + 'comupload.jsp?sid=' + sid + '&trs=true&fid=' + param.fid + (param.uid ? '&uid=' + param.uid : ''), uploadURL = URL + 's?func=upload:directDataNF&sid=' + sid + (param.uid ? '&uid=' + param.uid : '');
break;

case EUpload_Type.Upload_Invite:
queryURL = URL + 'comupload.jsp?trs=true&fid=' + param.fid + '&uid=' + param.uid + '&inviteKey=' + param.inviteKey, uploadURL = URL + 's?func=upload:directDataNF&&uid=' + param.uid + '&inviteKey=' + param.inviteKey;
break;

default:
return !1;
}
'Macintosh' == PluginInfo.system && (options.blocksize = 2097152);
var initObj = {
netfolder: options.netfolder || !0,
compress: options.compress || window && window.CompressLevel || 5,
blocksize: options.blocksize || 65536,
query: queryURL,
upload: uploadURL,
notify: function(state, percent, index) {
null != callback && callback.call(TrsUpload, state, percent, index);
}
};
if (specify) for (var i = 0; i < options.ids.length; i++) cmUpload.item(options.ids[i]).init(initObj); else cmUpload.init(initObj);
return !0;
}
return !1;
},
startUpload: fStartUpload,
startUploadSyn: fStartUploadsSyn,
uploadEmbbedFile: function(filePath) {
var curId, waitingTimer, fileTemp;
if (0 === waitingEmbbedFileIds.length) {
waitingEmbbedFileIds = waitingEmbbedFileIds.concat(filePath);
var ids = fAddEmbbedFile(filePath);
curId = ids, 'ffffffff' != Number(curId).toString(16) && fStartUpload(curId), waitingTimer = setTimeout((function uploadSyn() {
if (waitingEmbbedFileIds.length > 0) if (fQueryUploadItemStatus(curId).state > EUploadItemState_Type.Uploading) {
if (waitingEmbbedFileIds.splice(0, 1), waitingEmbbedFileIds.length > 0 && (fileTemp = waitingEmbbedFileIds[0])) {
var ids = fAddEmbbedFile(fileTemp);
curId = ids, 'ffffffff' != Number(curId).toString(16) && fStartUpload(curId), waitingTimer = setTimeout(uploadSyn, 100);
}
} else waitingTimer = setTimeout(uploadSyn, 100); else waitingTimer && clearTimeout(waitingTimer);
}), 100);
} else waitingEmbbedFileIds = waitingEmbbedFileIds.concat(filePath);
},
clearUploadList: function() {
waitingFileIds.length > 0 && (waitingFileIds.length = 0);
},
addEmbbedFile: fAddEmbbedFile,
getPathClipboard: function() {
if (fIsLoaded()) return cmPlugin.getPathFileClipboard();
},
getUploadItem: function(index) {
if (fIsValid(cmUpload)) return cmUpload.item(index);
return null;
},
getHTMLClipboard: function() {
if (fIsLoaded()) {
var content = cmPlugin.getHTMLClipboard();
if (content) {
var start = content.indexOf('<body'), end = content.indexOf('</body>');
return (content = (content = content.substring(start, end + '</body>'.length)).replace('body', 'div')).trim();
}
}
return '';
},
cancelUpload: function(id) {
fIsLoaded() && fIsValid(cmUpload) && cmUpload.item(id).stop();
},
resetUpload: function(id) {
fIsLoaded() && fIsValid(cmUpload) && cmUpload.item(id).reset();
},
resumeUpload: function(filename, crc2, attachmentID) {
if (fIsLoaded() && fIsValid(cmUpload)) {
var obj = {
filename: filename,
crc2: crc2,
attachID: attachmentID
};
return cmUpload.resume_netfolder(obj);
}
return [];
},
queryUploadItemStatus: fQueryUploadItemStatus,
setUploadItemStates: function(ids) {
for (var i = 0; i < ids.length; ++i) {
var id = ids[i], uploadItem = cmUpload.item(id);
uploadItem && (uploadItem.state = PluginManager.UploadItemState_Type.Ready, uploadItem.lastErrorNum = PluginManager.UploadItemError_Type.No_Error);
}
},
submitMultiUpload: function(submitType, option, upload) {
var ids = [];
switch (submitType) {
case ESubmit_Type.Normal:
ids = fBrowserFolder(!1);
break;

case ESubmit_Type.ScreenCapture:
ids = screenCapture.upload();
break;

case ESubmit_Type.SoundRecord:
ids = soundRecord.upload();
break;

case ESubmit_Type.VideoRecord:
ids = videoRecord.upload();
break;

case ESubmit_Type.DropFiles:
ids = option.ids;
}
upload && fStartUploadsSyn(ids);
return ids;
},
supportCapture: fSupportCapture,
doCapture: function() {
if (fSupportCapture()) return screenCapture.capture();
return !1;
},
getScreenClipboard: function() {
if (screenCapture.supportClipboard) {
if (screenCapture.clipboard()) return screenCapture.upload();
}
return null;
},
supportSoundRecord: fSupportSoundRecord,
getWavDeviceNum: function() {
return soundRecord.wavDeviceNum;
},
getWavDeviceNameById: function(id) {
return soundRecord.wavDeviceDesc(id);
},
getWavDeviceObj: function() {
return !!fSupportSoundRecord() && soundRecord;
},
supportVideoRecord: fSupportVideoRecord,
getVdoDeviceNum: function() {
return videoRecord.capDeviceNum;
},
getVdoDeviceNameById: function(id) {
return videoRecord.capDeviceDesc(id);
},
getVdoDeviceObj: function() {
return !!fSupportVideoRecord() && videoRecord;
},
supportDropFiles: function() {
if (fIsLoaded()) return cmPlugin.supportDropFiles;
return !1;
},
setDropFiles: function(value) {
if (fIsLoaded()) return cmPlugin.EnableDropFiles = value, !0;
return !1;
},
clearPluginInfo: function() {
(navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/Trident\/7\./)) && ((window.$win && $win() || window).PluginInfo = null);
},
getPluginObj: function() {
return cmPlugin;
}
};
function fInitPluginManager(document, strPluginID) {
if (!(cmPlugin = document.getElementById(strPluginID))) {
jQ(document.body).append('<div id="CM-Plugin"><object type="application/x-cmplugin" id="cmplugin" width="0" height="0"><param name="onload" value="pluginLoaded" /></object></div>');
}
cmPlugin = document.getElementById(strPluginID), _document = document, PluginManager.isLoaded() && (cmUpload = cmPlugin.upload(), 
screenCapture = cmPlugin.screenCapture(), soundRecord = cmPlugin.soundRecord(), videoRecord = cmPlugin.videoRecord());
}
function fIsLoaded() {
return cmPlugin && '<JSAPI-Auto Javascript Object>' == cmPlugin.value && cmPlugin.valid;
}
function fIsValid(obj) {
return !(!obj || !obj.valid);
}
function fBrowserFolder(disableMultipleSelect) {
if (!browserOpening && fIsLoaded() && fIsValid(cmUpload)) {
browserOpening = !0;
try {
return cmUpload.browser({
single: !!disableMultipleSelect
});
} finally {
browserOpening = !1;
}
}
return [];
}
function fStartUpload(id) {
fIsLoaded() && fIsValid(cmUpload) && cmUpload.item(id).start();
}
function fStartUploadsSyn(ids) {
var curId, waitingTimer;
0 === waitingFileIds.length && ids.length > 0 ? (waitingFileIds = waitingFileIds.concat(ids), fStartUpload(curId = parseInt(waitingFileIds.splice(0, 1), 10)), 
waitingTimer = setTimeout((function uploadSyn() {
waitingFileIds.length > 0 ? fQueryUploadItemStatus(curId).state >= EUploadItemState_Type.Uploading ? (fStartUpload(curId = parseInt(waitingFileIds.splice(0, 1), 10)), 
waitingTimer = setTimeout(uploadSyn, 100)) : waitingTimer = setTimeout(uploadSyn, 100) : waitingTimer && clearTimeout(waitingTimer);
}), 100)) : waitingFileIds = waitingFileIds.concat(ids);
}
function fAddEmbbedFile(filePath) {
if (fIsLoaded() && fIsValid(cmUpload)) return cmUpload.addEmbbedFile(filePath);
}
function fQueryUploadItemStatus(id, obj) {
if (fIsLoaded() && fIsValid(cmUpload)) {
obj = obj || {};
var uploadItem = cmUpload.item(id), size = uploadItem.size;
return 'unknown' == typeof uploadItem.size && (size = parseInt(uploadItem.size_str)), obj.id = id, obj.attachmentId = uploadItem.attachmentId, 
obj.size = size, obj.name = uploadItem.name, obj.state = uploadItem.state, obj.percent = uploadItem.percent, obj.lastErrorNum = uploadItem.lastErrorNum, 
obj.lastErrorStr = uploadItem.lastErrorStr, obj;
}
return '';
}
function fSupportCapture() {
return fIsValid(screenCapture) && screenCapture.supportCapture;
}
function fSupportSoundRecord() {
return fIsLoaded() && fIsValid(soundRecord);
}
function fSupportVideoRecord() {
return fIsLoaded() && fIsValid(videoRecord);
}
}();

document.getElementsByClassName = function() {
if ((1 == arguments.length || 2 == arguments.length && 'object' == typeof arguments[1]) && 'string' == typeof arguments[0]) {
for ($$nArr = [], $$cArg = new RegExp('\\b' + arguments[0] + '\\b'), $$elem = 1 == arguments.length ? document : arguments[1], 
$$DOM = $$elem.getElementsByTagName('*'), $$i = 0; $$i < $$DOM.length; $$i++) $$tmp = $$DOM[$$i].className, $$cArg.test($$tmp) && $$nArr.push($$DOM[$$i]);
return $$nArr;
}
throw 2 == arguments.length && 'object' != typeof arguments[1] ? new Error('Specified container is null or not an object in document.getElementsByClassName("[className|string],[OBJECT (optional)]").') : arguments.length > 2 ? new Error('Too many arguments specified for "getElementsByClassName", use 2 or less.') : new Error('Argument [Class Name (string)] expected for [Element].getElementsByClassName().');
};
//# sourceMappingURL=PluginManager.js.map