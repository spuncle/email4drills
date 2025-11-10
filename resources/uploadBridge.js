function DnDUploadManager(win) {
win = win || window;
var composeId, files, html5, urlParams = {}, countUploadFile = 0;
if (win.File) html5 = !0; else try {
new FileReader, html5 = !0;
} catch (e) {}
this.setUrlParams = function(params) {
urlParams = params || {};
}, this.initUpload = function(argsComposeId) {
composeId = argsComposeId;
}, this.initUpload2 = function(fid, id) {
composeId = 'c:nf:' + (fid = fid || 0);
}, this.getComposeId = function() {
return composeId;
}, this.isSupportHTML5 = function() {
return html5;
}, this.deleteUpload = function(id) {
var file = this.getUploadFileObj(id);
if (file) {
try {
file.XHR.abort();
} catch (ex) {}
file.status = 5;
var fileName = file.name.substring(file.name.lastIndexOf('\\') + 1);
(new CMXClient).simpleCall('upload:deleteTasks', {
composeId: composeId,
item: fileName
});
}
}, this.moveToNetFolder = function(id, name, func) {
var sid;
CMXClient.getSID ? sid = CMXClient.getSID() : gSID && (sid = gSID);
var file = this.getUploadFileObj(id), fileName = file.name.substring(file.name.lastIndexOf('\\') + 1);
file.status = 6, (new CMXClient).simpleCall('upload:moveToNetFolder', {
sid: sid,
composeId: composeId,
item: fileName,
attachmentId: file.id
}, (function(result) {
file.fileId = result.fileId, file.status = 7, func && func(id, name, result.fileId);
}));
}, this.moveToEtpNetFolder = function(id, name, func) {
var sid;
CMXClient.getSID ? sid = CMXClient.getSID() : gSID && (sid = gSID);
var file = this.getUploadFileObj(id), fileName = file.name.substring(file.name.lastIndexOf('\\') + 1);
file.status = 6;
var client = new CMXClient;
client.cgi = urlParams, client.simpleCall('upload:moveToNetDisk', {
sid: sid,
composeId: composeId,
item: fileName,
attachmentId: file.id
}, (function(result) {
file.fileId = result.fileId, file.status = 7, func && func(id, name, result.fileId);
}));
}, this.cancelUpload = function(id) {
var file = this.getUploadFileObj(id);
if (file) {
try {
file.XHR.abort();
} catch (e) {}
file.status = 5, file.cancel = !0;
}
}, this.restoreState = function(id) {
var file = this.getUploadFileObj(id);
file && (file.status = 0);
}, this.addNetFolderToContinue = function(filePath, id, crc) {
return id;
}, this.queryStatus = function(id) {
var file = this.getUploadFileObj(id), uploaded = file.bytesLoaded || file.offset || 0, size = this.getFileSize(id), percent = Math.floor(uploaded / (size || 1) * 100), status = 2;
return (0 === file.status || file.status) && (status = file.status), status + ',' + percent + ',' + (file.id || '') + ',' + size + ',' + uploaded;
}, this.getFileSize = function(id) {
return this.getUploadFileObj(id).size || 0;
}, this.getUploadFailReason = function(id) {
var file = this.getUploadFileObj(id);
if (file && 4 === file.status) return file.failId || 3;
}, this.getServerReturnInfo = function(id) {}, this.checkDnDFile = function(event) {
event = event || win.event;
var hasDnDfile = !1;
if (html5) for (var n = event.dataTransfer.types, G = n.length, i = 0; i < G; i++) if ('Files' === n[i]) {
hasDnDfile = !0;
break;
}
return hasDnDfile;
}, this.addMultiDnDFile = function(event) {
event = event || win.event;
var tmpFiles = [];
try {
return html5 && (tmpFiles = event.dataTransfer.files), Event.stop(event), this.addMultiFile(tmpFiles);
} catch (er) {}
}, this.addMultiFile = function(addFiles) {
files = (files || []).concat($A(addFiles));
for (var ids = [], i = 0; i < addFiles.length; i++) ids.push('g:' + (countUploadFile + i));
return countUploadFile = files.length, ids.join(',');
}, this.getUploadFileName = function(id) {
if (0 === id.indexOf('g:')) {
var index = id.substring(2) - (countUploadFile - files.length);
if (files.length > index) return files[index].name;
}
}, this.getUploadFileObj = function(id) {
if (0 === id.indexOf('g:')) {
var index = id.substring(2) - (countUploadFile - files.length);
if (files.length > index) return files[index];
}
}, this.startUpload = function(id) {
var sid, self = this;
CMXClient.getSID ? sid = CMXClient.getSID() : gSID && (sid = gSID);
var file = this.getUploadFileObj(id);
function exeUploadSuccessCheck(actualSize) {
(null != file.bytesLoaded && actualSize === file.bytesLoaded || null != file.size && actualSize === file.size) && (file.status = 3, 
file.bytesLoaded = file.size);
}
if (file.offset = file.offset || 0, file.id) self.sendDirectData(file, file.id, sid, (function(actualSize) {
exeUploadSuccessCheck(parseInt(actualSize));
}), null); else {
var requestVar = {
sid: sid,
inlined: !1,
size: this.getFileSize(id),
fileName: this.getUploadFileName(id),
attachId: -1,
composeId: composeId
}, client = new CMXClient;
client.resultListener = function(result) {
return file.status = 4, file.id = 0, file.failObj = result, 'FA_OVERFLOW' === result.code ? file.failId = 4 : 'FA_COMPOSE_NOT_FOUND' === result.code ? file.failId = 6 : file.failId = 3, 
3 !== file.failId;
}, client.cgi = urlParams, file.status = 1, client.simpleCall('upload:prepare', requestVar, (function(result) {
console.log('prepare'), self.sendDirectData(file, result.attachmentId, sid, (function(actualSize) {
exeUploadSuccessCheck(parseInt(actualSize));
}), (function(actualSize) {
client.simpleCall('upload:prepare', requestVar, (function(result) {
actualSize = result.actualSize, exeUploadSuccessCheck(parseInt(actualSize));
}));
}));
}));
}
}, this.sendDirectData = function(file, attachmentId, sid, successCallback, errorCallback) {
var xhr, self = this;
if (file.id = attachmentId, file.status = 2, html5) {
(xhr = new XMLHttpRequest).upload.onprogress = function(event) {
(event = event || win.event).lengthComputable && (file.bytesLoaded = event.loaded + file.offset);
}, xhr.onreadystatechange = function(event) {
if (4 === xhr.readyState) if (xhr.onreadystatechange = xhr.upload.onprogress = null, 200 === xhr.status) if (file.offset + 2097152 >= file.size) {
var actualSize = 0, xmlDoc = xhr.responseXML;
try {
xmlDoc ? xmlDoc = xhr.responseXML : (xmlDoc = new win.ActivexObject('MSXML2.DOMDocument')).loadXML(xhr.responseText), actualSize = xmlDoc.getElementsByTagName('int')[2].childNodes[0].nodeValue;
} catch (e) {
return void ('function' == typeof errorCallback && errorCallback(actualSize));
}
'function' == typeof successCallback && successCallback(actualSize);
} else file.offset = file.offset + 2097152, self.sendDirectData(file, attachmentId, sid, successCallback, errorCallback); else file.status = 4, 
file.error = 'upload failed: HTTP ' + xhr.status + ' ' + xhr.statusText;
}, file.XHR = xhr;
var url = CMXClient.getURL('upload:directData', {
attachmentId: attachmentId,
sid: sid,
composeId: composeId,
offset: file.offset
});
xhr.open('POST', url, !0), xhr.setRequestHeader('Content-Type', 'application/octet-stream');
var endOffset = file.offset + 2097152 >= file.size ? file.size : file.offset + 2097152, fileSlice = file.slice || file.webkitSlice || file.mozSlice;
'function' == typeof fileSlice ? xhr.send(fileSlice.call(file, file.offset, endOffset)) : alert('Upload File Blob init Error, please update your browser!');
}
};
}

function UploadBridge(win) {
var dndUpload;
try {
dndUpload = new DnDUploadManager(win);
} catch (e) {}
function isDnDMgr(id) {
var isDndMgr = !1;
return 0 === (id += '').indexOf('g:') && (isDndMgr = !0), isDndMgr;
}
this.bdgSupportHTML5Upload = function() {
return dndUpload && dndUpload.isSupportHTML5();
}, this.bdgSupportPlugin = function(forceToFirstUse) {
var isSupportCMUpload = PluginManager.isLoaded();
return isSupportCMUpload && forceToFirstUse && (dndUpload = null), isSupportCMUpload;
}, this.bdgSupportCM_COM = function(forceToFirstUse) {
return !1;
}, this.bdgSupportDnDUpload = function() {
return null != dndUpload;
}, this.bdgGetFileSize = function(id) {
return isDnDMgr(id) ? dndUpload.getFileSize(id) : null;
}, this.bdgInit = function(composeId, isCapture) {
null != dndUpload && dndUpload.initUpload(composeId);
}, this.bdgInit2 = function(fid, id) {
null != dndUpload && dndUpload.initUpload2(fid, id);
}, this.bdgGetComposeId = function() {
if (this.bdgSupportDnDUpload()) return dndUpload.getComposeId();
}, this.bdgAddNetfolderToContinue = function(filePath, id, crc) {
return isDnDMgr(id) ? dndUpload.addNetFolderToContinue(filePath, id, crc) : (void 0).addNetFolderToContinue(filePath, id, crc);
}, this.bdgMoveToNetFolder = function(id, name, func) {
if (isDnDMgr(id)) return dndUpload.moveToNetFolder(id, name, func);
}, this.bdgMoveToEtpNetFolder = function(id, name, urlParams, func) {
if (isDnDMgr(id)) return dndUpload.setUrlParams(urlParams), dndUpload.moveToEtpNetFolder(id, name, func);
}, this.bdgCancelUpload = function(id) {
isDnDMgr(id) ? dndUpload.cancelUpload(id) : PluginManager.cancelUpload(id);
}, this.bdgRestoreState = function(id) {
return isDnDMgr(id) ? (dndUpload.restoreState(id), !0) : PluginManager.queryUploadItemStatus(id).state !== PluginManager.UploadItemState_Type.Stopping && PluginManager.queryUploadItemStatus(id).state !== PluginManager.UploadItemState_Type.Query && (PluginManager.startUpload(id), 
!0);
}, this.bdgQueryStatus = function(id) {
if (isDnDMgr(id)) return dndUpload.queryStatus(id);
var obj = PluginManager.queryUploadItemStatus(id);
return obj.state + ',' + obj.percent + ',' + obj.attachmentId + ',' + obj.size;
}, this.bdgGetUploadFailReason = function(id) {
return isDnDMgr(id) ? dndUpload.getUploadFailReason(id) : PluginManager.queryUploadItemStatus(id).lastErrorNum;
}, this.bdgGetServerReturnInfo = function(id) {
return isDnDMgr(id) ? dndUpload.getServerReturnInfo(id) : PluginManager.queryUploadItemStatus(id).lastErrorStr;
}, this.bdgAddMutiDnDFile = function(event) {
if (this.bdgSupportDnDUpload()) return dndUpload.addMultiDnDFile(event);
}, this.bdgAddMutiFile = function(files) {
if (this.bdgSupportDnDUpload()) return dndUpload.addMultiFile(files);
}, this.bdgCheckDnDFile = function(event) {
if (this.bdgSupportDnDUpload()) return dndUpload.checkDnDFile(event);
}, this.bdgGetUploadFileName = function(id) {
return isDnDMgr(id) ? dndUpload.getUploadFileName(id) : PluginManager.queryUploadItemStatus(parseInt(id)).name;
}, this.bdgStartUpload = function(id, urlParams) {
isDnDMgr(id) ? (dndUpload.setUrlParams(urlParams), dndUpload.startUpload(id)) : PluginManager.startUpload(parseInt(id));
}, this.bdgIsDndMgr = function(id) {
return isDnDMgr(id);
};
}
//# sourceMappingURL=uploadBridge.js.map