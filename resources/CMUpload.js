var CMUpload = {};

!function() {
var risky = [], prepareUploadCheckUrlParams = {}, _$ui = $win().$, isAutoNormal2Trs = !1, autoNormal2TrsTips = '', upManager = new UploadBridge, isIE = !!document.all || !!window.ActiveXObject || 'ActiveXObject' in window, isIE11 = !window.ActiveXObject && 'ActiveXObject' in window, isMac = 'Macintosh' == navigator.userAgent.split(';')[0].split('(')[1], uploadFailData = $H(), uploadData = {
objs: [],
setFileName: {},
curIndex: -1,
uploadFailIds: [],
timerID: null,
STATUS_WAITTING: 0,
STATUS_PREPARE_UPLOAD: 1,
STATUS_UPLOADING: 2,
STATUS_UPLOAD_SUCCESS: 3,
STATUS_UPLOAD_FAIL: 4,
STATUS_CANCEL: 5,
STATUS_AUTO_TRS_UPLOAD: 6,
STATUS_QUERY: 999,
STATUS_FAIL_REASON: [ 'NORMAL', 'RUNNING', gLang.compose.msg.msg_attachment_nomem, gLang.compose.msg.msg_attachment_syserr, gLang.compose.msg.msg_attachment_excced_size, gLang.compose.msg.msg_attachment_excced_count, gLang.compose.msg.msg_attachment_noexist, gLang.compose.msg.msg_attachment_neterr, gLang.compose.msg.msg_attachment_client_notfound, gLang.compose.msg.msg_attachment_crcerr ],
isPeddingStatus: function(s) {
return s == uploadData.STATUS_WAITTING || s == uploadData.STATUS_PREPARE_UPLOAD || s == uploadData.STATUS_QUERY || s == uploadData.STATUS_UPLOADING;
}
}, securityLevel = {
enable: !1,
schema: {},
selfLevel: !1,
matchExpression: null
};
function hasFileUploading() {
var i;
for (i = 0; i < uploadData.objs.length; i++) if (uploadData.isPeddingStatus(uploadData.objs[i].status)) return !0;
for (i = 0; i < uploadBigFileData.objs.length; i++) if (isProcessingByBigFile(uploadBigFileData.objs[i].state)) return !0;
return !1;
}
function delAttachment() {
uploadData.objs = [], uploadData.setFileName = {}, uploadData.curIndex = -1, jQ('#divAttachInfo').empty(), jQ('#divAttach').empty();
}
function setSecurityLevelInfo(enable, schema, selfLevel) {
securityLevel.enable = enable || !1, securityLevel.schema = schema || {}, securityLevel.selfLevel = selfLevel;
}
function _departSLFromFilename(filename) {
var matchResult, senderSLExpression = _getMatchExpression('sender_security_level'), departResult = {
securityLevel: ''
};
return filename = (filename || '').split(/[\/\\]/).pop(), senderSLExpression && (matchResult = filename.match(senderSLExpression)) && (departResult.securityLevel = matchResult[0].replace(/\[/, '').replace(/\]\s*/, ''), 
departResult.value = _getSLValueByName(departResult.securityLevel)), departResult;
}
function _getMatchExpression() {
return securityLevel.matchExpression || _buildExpression();
}
function _buildExpression() {
var i, expression = null, slNameArr = [], schema = securityLevel.schema || {};
for (i in schema) slNameArr.push(schema[i]);
return 0 != slNameArr.length && (expression = new RegExp('^\\[(' + slNameArr.join('|') + ')\\]\\s*', 'ig'), securityLevel.matchExpression = expression), 
expression;
}
function _getSLValueByName(name) {
var i, schema = securityLevel.schema || {};
for (i in schema) if (schema[i] == name) return parseInt(i);
return '';
}
function supportClickFile() {
var userAgent = window.navigator.userAgent, isFF = !1, Version = '';
return userAgent.toUpperCase().indexOf('FIREFOX') > -1 && (isFF = !0, Version = userAgent.replace(/.+Firefox\//gi, '').replace(/\(.*\)/g, '')), 
!isFF || Version.match(/\d+.\d+/) >= 4;
}
function fSetRisky(riskyItems) {
risky = riskyItems;
}
function fSetPrepareUploadCheckUrlParams(params) {
prepareUploadCheckUrlParams = params;
}
function hasCOM() {
return upManager.bdgSupportPlugin();
}
function hasSupportDND() {
return upManager.bdgSupportHTML5Upload();
}
function fCheckSecurityLevel(name) {
name = getDescription(name).trim();
for (var regExpSL = [], msg = gLang.compose.msg, i = 0; msg['msg_mail_perm_pattern_' + (i + 1)]; i++) {
var pattern = msg['msg_mail_perm_pattern_' + (i + 1)];
regExpSL[i] = new RegExp('^(\\[(' + pattern + ')\\]|\\u3010(' + pattern + ')\\u3011)', 'ig');
}
var subSecurityLevelName = name, securityLevel = 0;
if (C.securityLevel > 1) {
i = 0;
for (var size = regExpSL.length; i < size; i++) if (regExpSL[i].test(name)) {
subSecurityLevelName = name.replace(regExpSL[i], ''), securityLevel = i + 1;
break;
}
securityLevel > C.securityLevel && (securityLevel = C.securityLevel);
}
return {
name: subSecurityLevelName,
level: securityLevel
};
}
function getPrefixUrl(loc) {
var hostname = loc.hostname, port = loc.port;
-1 != hostname.indexOf(':') && -1 == hostname.indexOf('[') && (hostname = '[' + hostname + ']');
var host = hostname;
return null != port && '' != port && (host = host + ':' + port), loc.protocol + '//' + host;
}
function $(sName) {
return document.getElementById(sName);
}
function buildSizeTag(index) {
var id = uploadData.objs[index].id, node = Object.extend(document.createElement('span'), {
id: 'upSize_' + id
});
return jQ(node).addClass('attachSize'), node;
}
function buildCancelTag(index) {
var id = uploadData.objs[index].id, node = Object.extend(document.createElement('a'), {
id: 'cancel_' + id,
className: 'btl',
innerHTML: gLang.compose.att.att_upload_cancel,
onclick: function() {
CMUpload.CMCancelUpload(id);
}
});
return node.style.display = 'none', node;
}
function buildResumeTag(index) {
var id = uploadData.objs[index].id, node = Object.extend(document.createElement('a'), {
id: 'resume_' + id,
className: 'btl',
innerHTML: gLang.compose.att.att_upload_resume,
onclick: function() {
setDeleteStatus(id, !1), CMUpload.CMRestoreState(id);
}
});
return node.style.display = 'none', node;
}
function buildDeleteTag(index, bShow) {
var id = uploadData.objs[index].id, node = Object.extend(document.createElement('a'), {
id: 'delete_' + id,
className: 'btl',
innerHTML: gLang.compose.att.att_upload_delete,
onclick: function() {
setDeleteStatus(id, !0);
}
});
return bShow || (node.style.display = 'none'), node;
}
function buildUnDeleteTag(index) {
var id = uploadData.objs[index].id, node = Object.extend(document.createElement('a'), {
id: 'undelete_' + id,
className: 'btl',
innerHTML: gLang.compose.att.att_upload_undelete,
onclick: function() {
setDeleteStatus(id, !1);
}
});
return node.style.display = 'none', node;
}
function buildDownloadTag(id, bShow, mid) {
mid = mid || '';
for (var i = 0, length = uploadData.objs.length; i < length; i++) if (uploadData.objs[i].id === id) {
i;
break;
}
var node = Object.extend(document.createElement('a'), {
id: 'download_' + id,
className: 'btl',
innerHTML: gLang.compose.att.att_download,
onclick: function() {
for (var index = -1, i = 0, length = uploadData.objs.length; i < length; i++) if (uploadData.objs[i].id === id) {
index = i;
break;
}
var attachId = uploadData.objs[index].attributeID, enfUid = uploadData.objs[index].enfUid;
return C.downloadAttach(attachId, mid, enfUid), !1;
},
href: '#'
});
return bShow || (node.style.display = 'none'), node;
}
function buildEditTag(index, bUploaded) {
var id = uploadData.objs[index].id, node = Object.extend(document.createElement('a'), {
id: 'edit_' + id,
className: 'btl',
innerHTML: gLang.compose.att.att_edit,
onclick: function() {
uploadData.objs[index].attributeID;
return C.editAttach(id, !0), !1;
},
href: '#'
}), name = uploadData.objs[index].name;
return C.getIsOpenAttachmentEdit(name) ? node.style.display = '' : node.style.display = 'none', node;
}
function buildSecurityLevelTag(index, defaultLevel) {
var id = uploadData.objs[index].id, colObj = {
Items: [ {
name: gLang.compose.msg.msg_mail_perm_1,
topid: '0',
colid: '2',
value: '1',
fun: _onSetSecurityLevel
}, {
name: gLang.compose.msg.msg_mail_perm_2,
topid: '0',
colid: '3',
value: '2',
fun: _onSetSecurityLevel
}, {
name: gLang.compose.msg.msg_mail_perm_3,
topid: '0',
colid: '4',
value: '3',
fun: _onSetSecurityLevel
}, {
name: gLang.compose.msg.msg_mail_perm_4,
topid: '0',
colid: '5',
value: '4',
fun: _onSetSecurityLevel
}, {
name: gLang.compose.msg.msg_mail_perm_5,
topid: '0',
colid: '6',
value: '5',
fun: _onSetSecurityLevel
} ]
};
function _onSetSecurityLevel(value) {
C.setAttachSecurityLevel(uploadData.objs[index].attributeID, value);
}
defaultLevel > 0 ? jQ($('colsel_security_' + id)).mlnColsel(colObj, {
title: gLang.compose.msg.msg_mail_perm_title0,
value: defaultLevel + '',
width: 90,
bCheckType: !0
}) : jQ($('colsel_security_' + id)).mlnColsel(colObj, {
title: gLang.compose.msg.msg_mail_perm_title0,
value: '-1',
width: 90,
bCheckType: !0
});
}
function setDeleteStatus(id, isDelete, bReplaced) {
with (bReplaced = bReplaced || !1, uploadData) {
for (var index = -1, i = 0, length = objs.length; i < length; i++) if (objs[i].id === id) {
index = i;
break;
}
var id = objs[index].id;
if (objs[index].deleted = isDelete, AttachInfo.setDeleted(objs[index].attributeID + '', isDelete, bReplaced), updateSizeInfo(), 
!isDelete && AttachInfo.getValidSize() > C.getMailLimitSize()) return UI.alert(gLang.compose.msg.msg_attachment_excced_size), 
objs[index].deleted = !isDelete, AttachInfo.setDeleted(objs[index].attributeID + '', !isDelete, !1), void updateSizeInfo();
$('displayName_' + id) && ($('displayName_' + id).style.textDecoration = isDelete ? 'line-through' : ''), Element[isDelete ? 'hide' : 'show']($('delete_' + id)), 
Element[isDelete ? 'show' : 'hide']($('undelete_' + id)), objs[index].status != STATUS_UPLOAD_SUCCESS && (uploadFailData[id] = isDelete ? '1' : '0', 
canSendEmail() ? (jQ('#btnSend').removeClass('disabled'), jQ('#btnSend2').removeClass('disabled'), $('aTimeSet') && ($('aTimeSet').style.display = ''), 
Element[isDelete ? 'hide' : 'show']($('download_' + id)), $('colsel_security_' + id) && Element[isDelete ? 'hide' : 'show']($('colsel_security_' + id))) : (jQ('#btnSend').addClass('disabled'), 
jQ('#btnSend2').addClass('disabled'), $('aTimeSet') && ($('aTimeSet').style.display = 'none')));
}
}
function updateSize(id, sUploadedSize, sTotalSize) {
var trUpSize = $('upSize_' + id);
if (trUpSize) {
var sSize = gLang.compose.att.att_upload_size;
sSize = sSize.replace('{0}', sUploadedSize).replace('{1}', sTotalSize), jQ(trUpSize).show(), jQ(trUpSize).empty().html(sSize);
}
}
function canSendEmail(autoTrs) {
var canSend = !0;
if (uploadFailData._each((function(item) {
'0' == item.value && (canSend = !1);
})), autoTrs && uploadBigFileData.objs.length > 0) for (var i = 0; i < uploadBigFileData.objs.length; ++i) {
var obj = uploadBigFileData.objs[i];
if (obj.state && isProcessingByBigFile(obj.state)) {
canSend = !1;
break;
}
}
return canSend;
}
function cancelUpload(id) {
with (uploadData) for (var len = objs.length, i = 0; i < len; ++i) if (objs[i].id == id) {
upManager.bdgCancelUpload(id);
var usingplugin = !upManager.bdgIsDndMgr(id);
usingplugin && (objs[i].status = PluginManager.queryUploadItemStatus(i).state), updateStatus(i, !upManager.bdgIsDndMgr(id));
break;
}
}
function restoreState(id) {
var composeId = $('composeIDForCMUpload').value, uploadSuccessAttachmentArr = AttachInfo.getUploadSuccessObjs();
(new CMXClient).simpleCall('mbox:compose', {
id: composeId,
action: 'continue',
attrs: {
id: composeId,
attachments: uploadSuccessAttachmentArr
}
}, (function() {
with (uploadData) {
for (var len = objs.length, usingPlugin = !upManager.bdgIsDndMgr(id), i = 0; i < len; ++i) if (objs[i].id == id) {
if (upManager.bdgRestoreState(id)) {
var st = upManager.bdgQueryStatus(id).split(',');
objs[i].status = parseInt(st[0], 10), objs[i].percent = parseInt(st[1], 10), st[4] && (objs[i].uploaded = parseInt(st[4], 10)), 
usingPlugin = !upManager.bdgIsDndMgr(id), updateStatus(i, usingPlugin);
} else UI.alert(gLang.compose.msg.msg_opsTooFrequent);
break;
}
null == timerID && startNextActive(usingPlugin);
}
}));
}
function switchStatusForCMUpload(index) {
var obj = uploadData.objs[index];
switch (obj.status) {
case PluginManager.UploadItemState_Type.Ready:
obj.status = uploadData.STATUS_WAITTING;
break;

case PluginManager.UploadItemState_Type.CRC:
obj.status = uploadData.STATUS_PREPARE_UPLOAD;
break;

case PluginManager.UploadItemState_Type.Query:
obj.status = uploadData.STATUS_QUERY;
break;

case PluginManager.UploadItemState_Type.Uploading:
obj.status = uploadData.STATUS_UPLOADING;
break;

case PluginManager.UploadItemState_Type.Finish:
case PluginManager.UploadItemState_Type.FinishWithoutCRC:
obj.status = uploadData.STATUS_UPLOAD_SUCCESS;
break;

case PluginManager.UploadItemState_Type.Error:
obj.status = uploadData.STATUS_UPLOAD_FAIL;
break;

case PluginManager.UploadItemState_Type.Stopping:
obj.status = uploadData.STATUS_CANCEL;
}
}
function updateStatus(index, usingPlugin) {
usingPlugin = usingPlugin || !1;
var obj = uploadData.objs[index];
usingPlugin && switchStatusForCMUpload(index);
var id = obj.id;
if (obj.status == uploadData.STATUS_WAITTING) $('status_' + id).style.width = (obj.percent || 0) + '%', $('status_' + id).innerHTML = (obj.percent || 0) + '%'; else if (obj.status == uploadData.STATUS_PREPARE_UPLOAD) $('css_status_' + id).className = 'capacity inlineb', 
$('status_' + id).innerHTML = (obj.percent || 0) + '%', setStyleDisplay({
cancel_: '',
delete_: 'none',
undelete_: 'none',
resume_: 'none',
download_: 'none'
}, id), setStyleDisplay({
colsel_security_: 'none'
}, id, !0); else if (obj.status == uploadData.STATUS_QUERY && usingPlugin) ; else if (obj.status == uploadData.STATUS_UPLOADING) $('status_' + id).style.width = obj.percent + '%', 
$('status_' + id).innerHTML = obj.percent + '%', setStyleDisplay({
cancel_: '',
delete_: 'none',
undelete_: 'none',
resume_: 'none',
download_: 'none'
}, id), setStyleDisplay({
colsel_security_: 'none'
}, id, !0), updateSize(id, sizeAutoFormat(obj.size * obj.percent / 100), sizeAutoFormat(obj.size)); else if (obj.status == uploadData.STATUS_UPLOAD_SUCCESS) {
if (uploadFailData[id] = '1', changeStatusUploadSuccess(id), obj.isCapture) {
var viewNode = $('divAttachDisplay_' + id);
jQ(viewNode).remove();
var identifier = obj.identifier;
if (identifier) {
var src = '/coremail/s?func=mbox:getComposeData&sid=' + window.location.search.substring(1).toQueryParams().sid + '&composeId=' + $('composeIDForCMUpload').value + '&attachId=' + obj.attributeID;
C.parseHTMLForUpdateTheImgNode(identifier, src);
}
}
updateSize(id, sizeAutoFormat(obj.size), sizeAutoFormat(obj.size)), updateSizeInfo();
} else if (obj.status == uploadData.STATUS_UPLOAD_FAIL) {
var errorStatus = upManager.bdgGetUploadFailReason(id), errorMsg = '';
if (usingPlugin) isAutoNormal2Trs && 8 == errorStatus ? (uploadData.objs.splice(index, 1), addUploadFailIds(parseInt(id)), 
changeIcoNormal2Trs(id)) : changeStatusUploadFailed(id, index, errorMsg = TrsUpload.STATUS_FAIL_REASON[errorStatus]); else {
if (3 == errorStatus || 4 == errorStatus) errorMsg = getErrorMsg(upManager.bdgGetServerReturnInfo(id));
errorMsg || (errorMsg = uploadData.STATUS_FAIL_REASON[errorStatus]), changeStatusUploadFailed(id, index, errorMsg), isAutoNormal2Trs && 4 == errorStatus && (upManager.bdgIsDndMgr(id) ? jQ('#upsupportDndTips').show() : showInstallPluginTips());
}
} else ($('divAttachDisplay_' + id) || $('attachmentByActiveX_' + id)) && (setStyleDisplay({
delete_: '',
undelete_: 'none',
cancel_: 'none',
resume_: '',
download_: 'none'
}, id), setStyleDisplay({
colsel_security_: 'none'
}, id, !0));
enableSendButton(canSendEmail(isAutoNormal2Trs));
}
function showInstallPluginTips() {
$('installPluginTips') && ($('installPluginTips').style.display = '');
}
function enableSendButton(enable) {
enable ? (jQ('#btnSend').removeClass('disabled'), jQ('#btnSend2').removeClass('disabled'), $('aTimeSet') && ($('aTimeSet').style.display = '')) : (jQ('#btnSend').addClass('disabled'), 
jQ('#btnSend2').addClass('disabled'), $('aTimeSet') && ($('aTimeSet').style.display = 'none'));
}
function changeStatusUploadSuccess(id, isNormal2Trs) {
$('status_' + id).style.width = '100%', $('status_' + id).innerHTML = gLang.compose.msg.msg_attach_upload_successInfo, setStyleDisplay({
cancel_: 'none',
delete_: '',
undelete_: 'none',
resume_: 'none',
css_status_: 'none',
Upload_Success_: ''
}, id), setStyleDisplay(isNormal2Trs ? {
download_: 'none'
} : {
download_: ''
}, id), setStyleDisplay({
colsel_security_: ''
}, id, !0);
}
function changeStatusUploadFailed(id, index, errorMsg) {
displayUploadErrorMsg(id, errorMsg), setDeleteStatus(id, !0);
}
function displayUploadErrorMsg(id, errorMsg, autoTrs) {
$('css_status_' + id).className = 'capacity warning inlineb', $('status_' + id).style.width = '100%', $('status_' + id).innerHTML = errorMsg, 
setStyleDisplay({
cancel_: 'none',
delete_: autoTrs ? 'none' : '',
undelete_: 'none',
resume_: 'none',
download_: 'none'
}, id), $('colsel_security_' + id) && setStyleDisplay({
colsel_security_: 'none'
}, id), $('css_status_' + id).title = errorMsg;
}
function startNextActive(usingPlugin) {
with (usingPlugin = usingPlugin || !1, uploadData) {
var len = objs.length;
if (curIndex == len || -1 == curIndex || !isPeddingStatus(objs[curIndex].status)) {
for (curIndex = 0; curIndex < len && !isPeddingStatus(objs[curIndex].status); ++curIndex) ;
if (curIndex == len) return timerID = null, void (isAutoNormal2Trs && uploadData.uploadFailIds.length > 0 && doTrsUpload());
}
var id = objs[curIndex].id;
if (objs[curIndex].status == STATUS_WAITTING) upManager.bdgStartUpload(id), objs[curIndex].status = STATUS_PREPARE_UPLOAD; else {
var st = upManager.bdgQueryStatus(id).split(',');
if (objs[curIndex].status = parseInt(st[0], 10), objs[curIndex].percent = parseInt(st[1], 10), objs[curIndex].uploaded = parseInt(st[4], 10), 
st.length > 2 && (objs[curIndex].attributeID = st[2]), st.length > 3 && (objs[curIndex].size = st[3]), !objs[curIndex].isloaded && null != objs[curIndex].attributeID && '' != objs[curIndex].attributeID) {
var inlined = !1;
objs[curIndex].isCapture && (inlined = !0);
var item = {
id: parseInt(objs[curIndex].attributeID, 10),
type: 'upload',
deleted: !1,
inlined: inlined,
size: null != objs[curIndex].size ? parseInt(objs[curIndex].size, 10) : 0,
fileName: objs[curIndex].name
};
null != objs[curIndex].size && updateSize(id, '0', sizeAutoFormat(objs[curIndex].size)), objs[curIndex].isCapture || (AttachInfo.addAttachInfo(objs[curIndex].attributeID, getDescription(objs[curIndex].name), 'upload', !1, null, objs[curIndex].size, null), 
AttachInfo.setSecurityLevel(objs[curIndex].attributeID + '', '0', getDescription(objs[curIndex].name)), C.setAttachSecurityLevel(id, CMUpload.CMCheckSecurityLevel(objs[curIndex].name).level)), 
objs[curIndex].isloaded = !0, objs[curIndex].deleted = !1;
}
}
updateStatus(curIndex, usingPlugin), timerID = setTimeout((function() {
startNextActive(usingPlugin);
}), 100);
}
}
function addUploading(id, usingPlugin, submitType) {
var isCapture;
submitType && submitType == PluginManager.Submit_Type.ScreenCapture && (isCapture = !0), usingPlugin = usingPlugin || !1;
var identifier = '';
isCapture && (identifier = self.frames.htmleditor.fAddImgBeforeCaptureUploaded());
var exitMessage, fileName = getDescription(upManager.bdgGetUploadFileName(id));
if (isRisky(fileName)) return fileName = fileNameSoLong(fileName, 30), UI.alert(gLang.compose.msg.msg_risky_local_attach.replace('${filename}', fileName)), 
!1;
if (null != fileName && '' != fileName) if (null != uploadData.setFileName[fileName]) {
var indexOfFile = uploadData.setFileName[fileName], obj = uploadData.objs[indexOfFile];
exitMessage = gLang.compose.msg.msg_attach_exist_confirm.replace('{attach_name}', fileName), !obj || obj.status != uploadData.STATUS_UPLOAD_SUCCESS && obj.status != uploadData.STATUS_UPLOAD_FAIL ? UI.alert(gLang.compose.msg.msg_attach_exist) : UI.confirm({
message: exitMessage,
yes: function() {
obj.attributeID;
var obj_id = obj.id;
(new CMXClient).simpleCall('upload:deleteTasks', {
composeId: $('composeIDForCMUpload').value,
item: [ fileName ]
}, (function() {
setDeleteStatus(obj_id, !0, !0);
var view = $('divAttachDisplay_' + obj_id);
view && view.parentNode.removeChild(view), C.handleDisplayOfAttach(), C.autoCompleteSubject(fileName), uploadData.setFileName[fileName] = null, 
doUploadLocalFileAction(id, fileName, usingPlugin, submitType);
}));
},
no: function() {
var index = uploadData.objs.length;
uploadData.objs[index] = {};
}
});
} else if (isAutoNormal2Trs && null != uploadBigFileData.setFileName[fileName]) {
indexOfFile = uploadBigFileData.setFileName[fileName], obj = uploadBigFileData.objs[indexOfFile];
exitMessage = gLang.compose.msg.msg_attach_exist_confirm.replace('{attach_name}', fileName), obj && !isProcessingByBigFile(obj.state) ? UI.confirm({
message: exitMessage,
yes: function() {
obj.attributeID;
var obj_id = obj.id;
setDeleteStatusByBigFile(indexOfFile, !0, !0);
var view = $('divAttachDisplay_' + obj_id);
view && view.parentNode.removeChild(view), doUploadLocalFileAction(id, fileName, usingPlugin, submitType, identifier);
},
no: function() {
var index = uploadBigFileData.objs.length;
uploadBigFileData.objs[index] = {};
}
}) : UI.alert(gLang.compose.msg.msg_attach_exist);
} else C.autoCompleteSubject(fileName), doUploadLocalFileAction(id, fileName, usingPlugin, submitType, identifier);
}
CMUpload.submitDataByCoreMailPlugin = fSubmitDataByCoreMailPlugin, CMUpload.DndSubmitData = submitDataByDnD, CMUpload.SubmitMultiData = submitMultiData, 
CMUpload.ListenDndEventbyId = fListenDndEventbyId, CMUpload.closeDnDDisplay = fCloseDnDDisplay, CMUpload.showDnDDisplay = fShowDnDDisplay, 
CMUpload.CMCheckSecurityLevel = fCheckSecurityLevel, CMUpload.CMCancelUpload = cancelUpload, CMUpload.CMRestoreState = restoreState, 
CMUpload.CMHasCOM = hasCOM, CMUpload.CMHasDND = hasSupportDND, CMUpload.setRisky = fSetRisky, CMUpload.setPrepareUploadCheckUrlParams = fSetPrepareUploadCheckUrlParams, 
CMUpload.supportClickFile = supportClickFile, CMUpload.getDescription = getDescription, CMUpload.generateDesc = generateDesc, 
CMUpload.generateDescN = generateDescN, CMUpload.updateFailReasonForN = updateFailReasonForN, CMUpload.unGenerateDescForN = unGenerateDescForN, 
CMUpload.queryDisplayId = queryDisplayId, CMUpload.hasFileUploading = hasFileUploading, CMUpload.delAttachment = delAttachment, 
CMUpload.setSecurityLevelInfo = setSecurityLevelInfo, CMUpload.CMGetUploadFilesWithSLevel = getUploadFilesWithSLevel;
var _iUploadIndexForN = 0;
function generateDescN(obj, bFirst) {
if (bFirst) {
var index = uploadData.objs.length, id = 'n:' + _iUploadIndexForN;
obj.id = id, uploadData.objs[index] = obj, uploadData.setFileName[obj.name] = index, uploadData.objs[index].status = uploadBigFileData.STATUS_WAITTING;
var divContainer = jQ('#divAttach')[0], divRow = document.createElement('DIV');
jQ(divRow).addClass('attachRow'), jQ(divRow).attr('id', 'divAttachDisplay_' + id);
var eIcon = document.createElement('SPAN');
jQ(eIcon).addClass('ico icoNormalAttach'), jQ(divRow).append(eIcon);
var fileSecurityObj = CMUpload.CMCheckSecurityLevel(getDescription(obj.name)), displayName = getDescription(fileSecurityObj.name), eFilename = document.createElement('SPAN');
jQ(eFilename).attr('id', 'displayName_' + id), jQ(eFilename).html(displayName + '&nbsp;').addClass('inlineb'), jQ(divRow).append(eFilename);
var eCapacity = '<span id=\'css_status_' + id + '\' class=\'capacity inlineb\'><div class=\'comcapacityBar inlineb\'><div id=\'status_' + id + '\' class=\'comcapacityBarFont inlineb\' style=\'width:100%\'>' + gLang.compose.msg.msg_attachment_uploading + '</div></div></span>';
jQ(divRow).append(eCapacity);
var eStatusIco = document.createElement('SPAN');
jQ(eStatusIco).attr('id', 'Upload_Success_' + id).css('display', 'none'), jQ(eStatusIco).addClass('ico icoUploadSuccess'), 
jQ(divRow).append(eStatusIco), jQ(divContainer).append(divRow), jQ(divRow).append(buildCancelTagForN(index)), _iUploadIndexForN++, 
uploadFailData[id] = '0';
} else {
index = uploadData.setFileName[obj.name];
uploadData.objs[index].attributeID = obj.attributeID, uploadData.objs[index].status = uploadBigFileData.STATUS_UPLOAD_SUCCESS, 
uploadData.objs[index].size = obj.size;
divRow = $('divAttachDisplay_' + (id = (obj = uploadData.objs[index]).id));
if (jQ($('cancel_' + id)).remove(), jQ($('css_status_' + id)).remove(), jQ($('Upload_Success_' + id)).show(), jQ(divRow).append(buildSizeTag(index)), 
updateSize(id, sizeAutoFormat(obj.size), sizeAutoFormat(obj.size)), jQ(divRow).append(buildEditTag(index, !0)), jQ(divRow).append(buildDeleteTag(index, !0)), 
jQ(divRow).append(buildUnDeleteTag(index)), jQ(divRow).append(buildDownloadTag(id, !0)), C.securityLevel > 1) {
var eSecurity = document.createElement('DIV');
jQ(eSecurity).attr('id', 'colsel_security_' + id).addClass('inlineb'), jQ(divRow).append(eSecurity), buildSecurityLevelTag(index, (fileSecurityObj = CMUpload.CMCheckSecurityLevel(getDescription(obj.name))).level), 
jQ(eSecurity).css({
'vertical-align': 'middle',
'margin-top': '-3px'
});
}
uploadFailData[id] = '1';
}
}
function buildCancelTagForN(index) {
var obj = uploadData.objs[index];
return Object.extend(document.createElement('a'), {
id: 'cancel_' + obj.id,
className: 'btl',
innerHTML: gLang.compose.att.att_upload_cancel_by_dnd,
onclick: function() {
C.cancelUploadForN(obj.formId, obj.name, obj.inline, obj.identifier), jQ($('divAttachDisplay_' + obj.id)).remove(), C.handleDisplayOfAttach();
}
});
}
function updateFailReasonForN(msg, formId, sAttributeId) {
sAttributeId += '', jQ.each(uploadData.objs, (function() {
if (this.formId == formId) {
this.attributeID = sAttributeId, this.status = uploadBigFileData.STATUS_UPLOAD_FAIL, uploadFailData[this.id] = '0', $('css_status_' + this.id).className = 'capacity warning inlineb', 
$('status_' + this.id).style.width = '100%', $('status_' + this.id).innerHTML = msg, $('css_status_' + this.id).title = msg;
var divRow = $('divAttachDisplay_' + this.id), index = uploadData.setFileName[this.name];
return jQ($('cancel_' + this.id)).remove(), jQ(divRow).append(buildDeleteTag(index, !0)), jQ(divRow).append(buildUnDeleteTag(index)), 
setDeleteStatus(this.id, !0), !1;
}
}));
}
function unGenerateDescForN(formId, sAttributeId) {
sAttributeId += '', jQ.each(uploadData.objs, (function() {
if (this.formId == formId) {
this.attributeID = sAttributeId, this.status = uploadBigFileData.STATUS_UPLOAD_SUCCESS, uploadFailData[this.id] = '1';
var divRow = $('divAttachDisplay_' + this.id);
return jQ(divRow).remove(), !1;
}
}));
}
function queryDisplayId(attId, bDelete) {
bDelete = bDelete || !1;
var sResult = '';
if (jQ.each(uploadData.objs, (function(i, n) {
if (this.attributeID && this.attributeID == attId) return sResult = this.id, bDelete && uploadData.objs.splice(i, 1), !1;
})), isAutoNormal2Trs && '' == sResult && uploadBigFileData.objs.length > 0) for (var i = 0; i < uploadBigFileData.objs.length; ++i) {
var obj = uploadBigFileData.objs[i];
if ('BigFile' + obj.id == attId) return sResult = obj.id, bDelete && uploadBigFileData.objs.splice(i, 1), sResult;
}
return sResult;
}
function generateDesc(obj, submitType, bUploaded) {
bUploaded = bUploaded || !1;
var index = uploadData.objs.length, id = obj.id;
uploadData.objs[index] = obj, uploadData.setFileName[obj.name] = index;
var divContainer = jQ('#divAttach')[0], divRow = document.createElement('DIV');
jQ(divRow).addClass('attachRow'), jQ(divRow).attr('id', 'divAttachDisplay_' + id);
var eIcon = document.createElement('SPAN');
jQ(eIcon).addClass('ico'), submitType == PluginManager.Submit_Type.Normal || submitType == PluginManager.Submit_Type.DropFiles ? jQ(eIcon).addClass('icoNormalAttach') : submitType == PluginManager.Submit_Type.SoundRecord ? jQ(eIcon).addClass('icoSoundAttach') : submitType == PluginManager.Submit_Type.VideoRecord ? jQ(eIcon).addClass('icoVedioAttach') : 'trs' == submitType ? jQ(eIcon).addClass('icoTrsAttach') : 'netfolder' == submitType ? jQ(eIcon).addClass('icoNFAttach') : jQ(eIcon).addClass('icoNormalAttach'), 
jQ(divRow).append(eIcon);
var fileSecurityObj = CMUpload.CMCheckSecurityLevel(getDescription(obj.name)), displayName = getDescription(fileSecurityObj.name), eFilename = document.createElement('SPAN');
if (jQ(eFilename).attr('id', 'displayName_' + id), jQ(eFilename).html(displayName + '&nbsp;').addClass('inlineb'), jQ(divRow).append(eFilename), 
!bUploaded) {
var eCapacity = '<div id=\'css_status_' + id + '\' class=\'capacity inlineb\'><div class=\'comcapacityBar inlineb\'><div id=\'status_' + id + '\' class=\'comcapacityBarFont\' style=\'width:0%\'>0%</div></div></div>';
jQ(divRow).append(eCapacity);
}
var eStatusIco = document.createElement('SPAN');
if (jQ(eStatusIco).attr('id', 'Upload_Success_' + id), bUploaded || jQ(eStatusIco).css('display', 'none'), jQ(eStatusIco).addClass('ico'), 
jQ(eStatusIco).addClass('icoUploadSuccess'), jQ(divRow).append(eStatusIco), jQ(divContainer).append(divRow), jQ(divRow).append(buildSizeTag(index)), 
bUploaded && updateSize(id, sizeAutoFormat(obj.size), sizeAutoFormat(obj.size)), jQ(divRow).append(buildEditTag(index, bUploaded)), 
bUploaded || jQ(divRow).append(buildCancelTag(index)), jQ(divRow).append(buildDeleteTag(index, bUploaded)), jQ(divRow).append(buildUnDeleteTag(index)), 
(bUploaded && obj.deleted || AttachInfo.getValidSize() > C.getMailLimitSize()) && setDeleteStatus(id, !0), bUploaded || jQ(divRow).append(buildResumeTag(index)), 
'trs' != submitType && ('netfolder' == submitType ? jQ(divRow).append(buildDownloadTag(id, bUploaded, obj.mid)) : jQ(divRow).append(buildDownloadTag(id, bUploaded))), 
C.securityLevel > 1) {
var eSecurity = document.createElement('DIV');
jQ(eSecurity).attr('id', 'colsel_security_' + id).addClass('inlineb'), jQ(divRow).append(eSecurity), buildSecurityLevelTag(index, fileSecurityObj.level), 
jQ(eSecurity).css({
'vertical-align': 'middle',
'margin-top': '-3px'
});
}
}
function doUploadLocalFileAction(id, fileName, usingPlugin, submitType, identifier) {
usingPlugin = usingPlugin || !1;
var isCapture = (submitType = submitType || null) == PluginManager.Submit_Type.ScreenCapture;
identifier = identifier || '', generateDesc({
name: fileName = getDescription(fileName),
id: id,
status: uploadData.STATUS_WAITTING,
percent: 0,
isloaded: !1,
isCapture: isCapture,
identifier: identifier
}, submitType, !1), C.handleDisplayOfAttach(), uploadFailData[id] = '0', jQ('#btnSend').addClass('disabled'), jQ('#btnSend2').addClass('disabled'), 
$('aTimeSet') && ($('aTimeSet').style.display = 'none'), null == uploadData.timerID && startNextActive(usingPlugin);
}
function dealWithAddResult(uploadFiles) {
var ids = uploadFiles.split(',');
if (!(risky && risky.length > 0 && checkRisk(upManager, ids))) {
for (var i = 0; i < ids.length; ++i) addUploading(ids[i]);
null == uploadData.timerID && startNextActive();
}
}
function checkRisk(mgr, ids) {
for (var i = 0; i < ids.length; ++i) {
var fileName = '';
if (ids[i] && isRisky(fileName = (fileName = mgr.bdgGetUploadFileName ? mgr.bdgGetUploadFileName(ids[i]) : mgr.getUploadFileName(ids[i])).substr(fileName.lastIndexOf('\\') + 1))) {
fileName = fileNameSoLong(fileName, 30);
var msg = gLang.compose.msg.msg_risky_attach_select;
return msg = (msg = msg.replace('${filename}', fileName)).replace('${suffix}', risky.join(' , ')), UI.alert(msg), !0;
}
}
return !1;
}
function isRisky(name) {
return risky && name && -1 != name.lastIndexOf('.') && risky.member(name.substr(name.lastIndexOf('.')).toLowerCase());
}
function fCloseDnDDisplay(objId) {
(objId = objId || 'dndContainer') && $(objId) && Element.hide($(objId));
}
function fShowDnDDisplay(objId) {
(objId = objId || 'dndContainer') && $(objId) && Element.show($(objId));
}
function fListenDndEventbyId(objId) {
if (objId) {
var elem = $(objId), dndEffect = !1, timerID = setTimeout((function() {
CMUpload.closeDnDDisplay(objId), dndEffect = !1;
}), 500);
if (elem) if (setAuto2Trs(), upManager.bdgSupportHTML5Upload() && !isIE || isIE11) {
var htmlEditorIFrame = jQuery('#htmleditor').contents(), htmlEditorBody = htmlEditorIFrame.find('body')[0], multiMediaHtmlEditorBody = htmlEditorIFrame.find('#HtmlEditor')[0].contentWindow.document.body;
Event.observe(top, 'dragenter', Event.stop, !1), Event.observe(window, 'dragenter', Event.stop, !1), Event.observe(htmlEditorBody, 'dragenter', Event.stop, !1), 
Event.observe(multiMediaHtmlEditorBody, 'dragenter', Event.stop, !1);
var dragover = function(event) {
event = event || window.event, $win && $win().event && (event = $win().event), upManager.bdgCheckDnDFile(event) ? (timerID && (clearTimeout(timerID), 
timerID = setTimeout((function() {
CMUpload.closeDnDDisplay(objId), dndEffect = !1;
}), 500)), dndEffect = !0, Element.show(elem)) : (Event.stop(event), isIE ? event.dataTransfer.dropEffect = 'none' : (event.dataTransfer.effectAllowed = 'copy', 
event.dataTransfer.dropEffect = 'copy')), dndEffect && Event.stop(event);
};
Event.observe(top, 'dragover', dragover, !1), Event.observe(window, 'dragover', dragover, !1), Event.observe(htmlEditorBody, 'dragover', dragover, !1), 
Event.observe(multiMediaHtmlEditorBody, 'dragover', dragover, !1);
var drop = function(e) {
CMUpload.closeDnDDisplay(objId), dndEffect && Event.stop(e);
};
Event.observe(top, 'drop', drop, !1), Event.observe(window, 'drop', drop, !1), Event.observe(htmlEditorBody, 'drop', drop, !1), 
Event.observe(multiMediaHtmlEditorBody, 'drop', drop, !1), Event.observe(elem, 'dragenter', Event.stop, !1), Event.observe(elem, 'dragover', (function(e) {
timerID && (clearTimeout(timerID), timerID = setTimeout((function() {
CMUpload.closeDnDDisplay(objId), dndEffect = !1;
}), 500)), dndEffect = !0, Element.show(elem), dndEffect && Event.stop(e);
}), !1), Event.observe(elem, 'drop', CMUpload.DndSubmitData, !1);
} else PluginManager.isLoaded() ? PluginManager.supportDropFiles() ? (PluginManager.setDropFiles(!0), $('cmplugin').attachEvent('onDropIn', (function(ids) {
CMUpload.showDnDDisplay(objId);
})), $('cmplugin').attachEvent('onDropOut', (function(ids) {
CMUpload.closeDnDDisplay(objId);
})), $('cmplugin').attachEvent('onDropFiles', (function(ids) {
CMUpload.closeDnDDisplay(objId), CMUpload.submitDataByCoreMailPlugin(PluginManager.Submit_Type.DropFiles, {
ids: ids
});
}))) : $('html5_dragdrop_area').innerHTML = gLang.compose.msg.upload_attachment_unSupport_drap_other : PluginInfo.asyncLoad((function(pluginInfo) {
var g = gLang.compose.multimidea.dropfiles_notfound;
$('html5_dragdrop_area').innerHTML = g[0] + '<b>' + pluginInfo.createDownloadLinkForCMPlugin(g[1], 'color:#0000FF;text-decoration:underline') + '</b>';
}));
}
}
function submitDataByDnD(event) {
CMUpload.closeDnDDisplay('dndContainer'), event = event || window.event, $win && $win().event && (event = $win().event), 
submidDataByIds(upManager.bdgAddMutiDnDFile(event));
}
function submidDataByIds(ids) {
var composeId = $('composeIDForCMUpload').value, uploadSuccessAttachmentArr = AttachInfo.getUploadSuccessObjs();
null == composeId || '' == composeId ? (new CMXClient).simpleCall('mbox:compose', null, (function(result) {
composeId = result, $('composeIDForCMUpload').value = composeId, upManager.bdgSupportDnDUpload() && (upManager.bdgInit(composeId), 
dealWithAddResult(ids));
})) : (new CMXClient).simpleCall('mbox:compose', {
id: composeId,
action: 'continue',
attrs: {
id: composeId,
attachments: uploadSuccessAttachmentArr
}
}, (function() {
upManager.bdgSupportDnDUpload() && (upManager.bdgInit(composeId), dealWithAddResult(ids));
}));
}
function submitMultiData() {
var autoDelMailElem = document.getElementById('autoDel');
if (autoDelMailElem && autoDelMailElem.checked) return !1;
if (jQ('div.infoPanel').closest('tr').hide(), setAuto2Trs(), PluginManager.isLoaded()) CMUpload.submitDataByCoreMailPlugin(PluginManager.Submit_Type.Normal); else if (upManager.bdgSupportHTML5Upload()) {
var fileInput = document.getElementById('divUploadAttachFile');
if (fileInput) {
var control = jQ('#divUploadAttachFile');
control.replaceWith(control = control.val('').clone(!0)), (fileInput = control[0]).onchange = null;
} else {
var div = document.createElement('div');
div.innerHTML = '<input id="divUploadAttachFile" type="file" multiple style=\'position:relative;right:99999px;\'/>', fileInput = div.removeChild(div.firstChild), 
document.body.appendChild(fileInput);
}
fileInput.onchange = function() {
submidDataByIds(upManager.bdgAddMutiFile(this.files));
}, setTimeout((function() {
fileInput.click();
}), 0);
}
}
function setAuto2Trs() {
var supportAutoNormal2TrsValue = $('supportAutoNormal2Trs').value;
('string' == typeof supportAutoNormal2TrsValue && 'true' == supportAutoNormal2TrsValue || 'boolean' == typeof supportAutoNormal2TrsValue && supportAutoNormal2TrsValue) && (isAutoNormal2Trs = !0);
}
function fSubmitDataByCoreMailPlugin(submitType, option) {
var ids = [], isCapture = !1, needSpecify = !1;
submitType == PluginManager.Submit_Type.ScreenCapture ? isCapture = !0 : submitType == PluginManager.Submit_Type.DropFiles && (needSpecify = !0, 
ids = option.ids);
var composeId = $('composeIDForCMUpload').value, uploadSuccessAttachmentArr = AttachInfo.getUploadSuccessObjs();
function doUploadSelect() {
function doSelect() {
if (upBigFileMgr.bdgSupportPlugin(!0)) {
PluginManager.initUpload(PluginManager.Upload_Type.Upload_Compose, {
composeId: composeId,
isCapture: isCapture
}, null, {
ids: ids
}, needSpecify), ids = PluginManager.submitMultiUpload(submitType, {
ids: ids
});
for (var i = 0; i < ids.length; i++) addUploading(ids[i], !0, submitType);
}
}
jQ.browser.mozilla && !isIE ? PluginManager.reloadPluginDiv(jQ, doSelect) : doSelect();
}
null == composeId || '' == composeId ? (new CMXClient).simpleCall('mbox:compose', null, (function(result) {
$('composeIDForCMUpload').value = composeId = result, doUploadSelect();
})) : (new CMXClient).simpleCall('mbox:compose', {
id: composeId,
action: 'continue',
attrs: {
id: composeId,
attachments: uploadSuccessAttachmentArr
}
}, (function() {
doUploadSelect();
}));
}
var hasFileUpload = !1, uploadBigFiles = [], uploadSucTrsFiles = [], upBigFileMgr = new UploadBridge, needPostProcess = !0, uploadBigFileData = {
objs: [],
setFileName: {},
curIndex: -1,
timerID: null,
STATUS_WAITTING: 0,
STATUS_PREPARE_UPLOAD: 1,
STATUS_UPLOADING: 2,
STATUS_UPLOAD_SUCCESS: 3,
STATUS_UPLOAD_FAIL: 4,
STATUS_CANCEL: 5,
STATUS_MOVING_TO_NF: 6,
STATUS_MOVE_TO_NF_SUCCESS: 7,
STATUS_FAIL_REASON: [ 'NORMAL', 'RUNNING', gLang.compose.msg.msg_attachment_nomem, gLang.compose.msg.msg_attachment_syserr, gLang.compose.msg.msg_attachment_excced_size, gLang.compose.msg.msg_attachment_excced_count, gLang.compose.msg.msg_attachment_noexist, gLang.compose.msg.msg_attachment_neterr, gLang.compose.msg.msg_attachment_client_notfound, gLang.compose.msg.msg_attachment_crcerr, gLang.compose.msg.fa_request_expired ],
isPeddingStatus: function(s) {
return s == uploadData.STATUS_WAITTING || s == uploadData.STATUS_PREPARE_UPLOAD || s == uploadData.STATUS_UPLOADING;
},
isProcessing: function(s) {
return uploadBigFileData.isPeddingStatus(s) || s == uploadBigFileData.STATUS_UPLOAD_SUCCESS && needPostProcess || s == uploadBigFileData.STATUS_MOVING_TO_NF;
}
};
function hasHTML5UploadByBigFile() {
return upBigFileMgr.bdgSupportHTML5Upload();
}
function submidDataIdsByBigFile(targetDiv, files, fid) {
var ids = upBigFileMgr.bdgAddMutiFile(files);
upBigFileMgr.bdgSupportDnDUpload() && (upBigFileMgr.bdgInit2(fid), dealWithAddResultByBigFile(ids, targetDiv));
}
function restoreUploadingByBigFile(filePath, id, crc, targetDiv, fid) {
(uploadBigFiles || (uploadBigFiles = []), upBigFileMgr.bdgSupportCM_COM(!0)) && (upBigFileMgr.bdgInit2(fid, id), addUploadingByBigFile(id = upBigFileMgr.bdgAddNetfolderToContinue(filePath, id, crc), targetDiv), 
null == uploadBigFileData.timerID && startNextActiveByBigFile());
}
function fHasFileUpload() {
return hasFileUpload || uploadBigFiles && uploadBigFiles.length > 0;
}
function dealWithAddResultByBigFile(files, targetDiv) {
var ids = files.split(',');
if (!(risky && risky.length > 0 && checkRisk(upBigFileMgr, ids))) {
for (var i = 0; i < ids.length; ++i) addUploadingByBigFile(ids[i], targetDiv);
null != uploadBigFileData.timerID || securityLevel.enable || startNextActiveByBigFile();
}
}
function addUploadingByBigFile(id, targetDiv) {
var fileName = upBigFileMgr.bdgGetUploadFileName(id);
if (null != fileName && '' != fileName) if (null != uploadBigFileData.setFileName[fileName]) {
var index, indexOfFile = uploadBigFileData.setFileName[fileName], obj = uploadBigFileData.objs[indexOfFile];
obj.status == uploadBigFileData.STATUS_UPLOAD_SUCCESS ? $win().$('ft_startdiv_' + indexOfFile) ? (obj = {}, index = uploadBigFileData.objs.length, 
uploadBigFileData.objs[index] = obj) : doUploadLocalFileActionByBigFile(id, fileName, targetDiv) : $win().$('ft_startdiv_' + indexOfFile) ? (obj = {}, 
index = uploadBigFileData.objs.length, uploadBigFileData.objs[index] = obj, UI.alert(gLang.compose.msg.msg_attach_exist)) : doUploadLocalFileActionByBigFile(id, fileName, targetDiv);
} else doUploadLocalFileActionByBigFile(id, fileName, targetDiv);
}
function doUploadLocalFileActionByBigFile(id, fileName, targetDiv) {
var obj = {
name: fileName,
id: id,
status: uploadBigFileData.STATUS_WAITTING,
percent: 0,
isloaded: !1,
uploaded: 0
}, index = uploadBigFileData.objs.length;
uploadBigFileData.objs[index] = obj, uploadBigFileData.setFileName[fileName] = index;
var El = $doc(), _startdiv = El.createElement('div');
_startdiv.setAttribute('id', 'ft_startdiv_' + id), _startdiv.className = 'ft_start';
var ft_icodiv = El.createElement('div');
ft_icodiv.setAttribute('id', 'ft_icodiv_' + id), ft_icodiv.className = 'ft_ico', ft_icodiv.style.display = 'none', ft_icodiv.innerHTML = '<div class="ico_upload_success"></div>';
var ft_maindiv = El.createElement('div');
ft_maindiv.className = 'ft_main';
var ft_topdiv = El.createElement('div');
ft_topdiv.className = 'ft_top';
var ft_namediv = El.createElement('div');
ft_namediv.className = 'ft_name';
var nameIndex = -1 != fileName.lastIndexOf('\\') ? fileName.lastIndexOf('\\') + 1 : 0;
if (ft_namediv.innerHTML = fileName.substring(nameIndex).escapeHTML(), securityLevel.enable) {
var ft_securityleveldiv = El.createElement('div');
ft_securityleveldiv.className = 'ft_securitylevel fleft', ft_securityleveldiv.appendChild(buildSecurityLevelSelectTagByBigFile(id, fileName));
}
var ft_operatordiv = El.createElement('div');
ft_operatordiv.setAttribute('id', 'operatordiv_' + id), ft_operatordiv.className = 'ft_tOperator', securityLevel.enable && ft_operatordiv.appendChild(buildStartTagByBigFile(id)), 
ft_operatordiv.appendChild(buildCancelTagByBigFile(id)), ft_operatordiv.appendChild(buildResumeTagByBigFile(id)), ft_topdiv.appendChild(ft_namediv), 
securityLevel.enable && ft_topdiv.appendChild(ft_securityleveldiv), ft_topdiv.appendChild(ft_operatordiv);
var ft_contentdiv = El.createElement('div');
ft_contentdiv.className = 'ft_content';
var ft_tProcessdiv = El.createElement('div');
ft_tProcessdiv.className = 'ft_tProcess', ft_tProcessdiv.setAttribute('id', 'ft_tProcessdiv_' + id), ft_tProcessdiv.style.display = 'none';
var ft_txProcessPausediv = El.createElement('div');
ft_txProcessPausediv.setAttribute('id', 'ft_txProcessPausediv_' + id), ft_txProcessPausediv.className = 'ft_txProcessPause', 
securityLevel.enable && (ft_txProcessPausediv.style.display = 'none');
var uploadProcessBardiv = El.createElement('div');
uploadProcessBardiv.setAttribute('id', 'uploadProcessBardiv_' + id), uploadProcessBardiv.className = 'uploadProcessBar', 
uploadProcessBardiv.style.width = '0', ft_txProcessPausediv.appendChild(uploadProcessBardiv);
var ft_processCountdiv = El.createElement('div');
ft_processCountdiv.className = 'ft_processCount', ft_processCountdiv.setAttribute('id', 'ft_processCountdiv_' + id), ft_contentdiv.appendChild(ft_txProcessPausediv), 
ft_contentdiv.appendChild(ft_processCountdiv), ft_contentdiv.appendChild(ft_tProcessdiv);
var ft_processDetaildiv = El.createElement('div');
ft_processDetaildiv.setAttribute('id', 'ft_processDetaildiv_' + id), ft_processDetaildiv.innerHTML = '', ft_processDetaildiv.className = 'ft_bottom', 
ft_maindiv.appendChild(ft_topdiv), ft_maindiv.appendChild(ft_contentdiv), ft_maindiv.appendChild(ft_processDetaildiv), _startdiv.appendChild(ft_icodiv), 
_startdiv.appendChild(ft_maindiv), targetDiv.appendChild(_startdiv), null != uploadBigFileData.timerID || securityLevel.enable || startNextActiveByBigFile();
}
function buildStartTagByBigFile(id) {
return Object.extend($doc().createElement('a'), {
id: 'start_bigFile_' + id,
className: 'btl_start',
innerHTML: gLang.compose.att.att_upload_start,
onclick: function() {
var slObj = jQ(this).closest('.ft_top').find('.securityLevel'), objs = uploadBigFileData.objs || [], isIncludeSL = !!slObj.hasClass('included'), curLevel = isIncludeSL ? slObj.attr('slevel') : slObj.val();
if (curLevel) {
if (jQ('.btl_start').hide(), !isIncludeSL) {
var container = jQ(this).closest('.ft_top').find('.ft_securitylevel'), curValue = slObj.find('option:selected').html();
slObj.hide(), container.prepend(jQ('<span>').html(curValue));
}
for (var i = 0; i < objs.length; i++) if (objs[i].id == id) {
objs[i].securityLevel = curLevel, uploadBigFileData.curIndex = i;
break;
}
startNextActiveByBigFile();
} else UI.alert(gLang.compose.msg.msg_security_level_empty_err);
}
});
}
function buildSecurityLevelSelectTagByBigFile(id, filename) {
var departResult = _departSLFromFilename(filename), isIncludeSL = !!departResult.securityLevel, node = $doc().createElement(isIncludeSL ? 'span' : 'select');
if (node.id = 'securityLevel_bigFile_' + id, isIncludeSL) node.className = 'securityLevel included', node.innerHTML = departResult.securityLevel, 
node.setAttribute('slevel', departResult.value); else for (var key in node.className = 'securityLevel levelselect', node.appendChild(Object.extend($doc().createElement('option'), {
value: '',
innerHTML: gLang.compose.att.att_select_security_level
})), securityLevel.schema) if (!securityLevel.selfLevel || key <= securityLevel.selfLevel) {
var op = Object.extend($doc().createElement('option'), {
value: key,
innerHTML: securityLevel.schema[key]
});
node.appendChild(op);
}
return node;
}
function buildCancelTagByBigFile(id) {
var node = Object.extend($doc().createElement('a'), {
id: 'cancel_bigFile_' + id,
className: 'btl',
innerHTML: gLang.compose.att.att_upload_cancel,
onclick: function() {
CMUpload.CMCancelUploadByBigFile(id);
}
});
return node.style.display = 'none', node;
}
function buildResumeTagByBigFile(id) {
var node = Object.extend($doc().createElement('a'), {
id: 'resume_bigFile_' + id,
className: 'btl',
innerHTML: gLang.compose.att.att_upload_resume,
onclick: function() {
CMUpload.CMRestoreStateByBigFile(id);
}
});
return node.style.display = 'none', node;
}
function cancelUploadByBigFile(id) {
for (var i = 0; i < uploadBigFileData.objs.length; ++i) if (uploadBigFileData.objs[i].id == id) {
var obj = uploadBigFileData.objs[i];
$win().$('uploadProcessBardiv_' + id).className = 'uploadProcessBarNotActive', upBigFileMgr.bdgCancelUpload(id), updateStatusByBigFile(i), 
obj.beginUploadTime = null, obj.beginUploadSize = null, obj.cancelling = !0, setTimeout((function() {
obj.cancelling = !1;
}), 2e3);
break;
}
}
CMUpload.CMHasHTML5UploadByBigFile = hasHTML5UploadByBigFile, CMUpload.CMSubmidDataIdsByBigFile = submidDataIdsByBigFile, 
CMUpload.CMRestoreStateByBigFile = restoreStateByBigFile, CMUpload.CMCancelUploadByBigFile = cancelUploadByBigFile, CMUpload.CMRestoreUploadingByBigFile = restoreUploadingByBigFile, 
CMUpload.CMUpdateFileStatusWhenDialogShow = updateFileStatusWhenDialogShow, CMUpload.CMHasFileUpload = fHasFileUpload, CMUpload.CMReleaseTrsActiveX = releaseTrsActiveX, 
CMUpload.CMHasFileUploading = hasBigFileUploading, CMUpload.CMGetFilesDataUploaded = getFilesDataUploaded;
var restoring = !1;
function restoreStateByBigFile(id) {
for (var i = 0; i < uploadBigFileData.objs.length; ++i) {
var obj = uploadBigFileData.objs[i];
if (obj.id == id) {
if (obj.cancelling || restoring) return void UI.alert(gLang.compose.msg.msg_opsTooFrequent);
restoring = !0, $win().$('uploadProcessBardiv_' + id).className = 'uploadProcessBar', upBigFileMgr.bdgRestoreState(id);
var st = upBigFileMgr.bdgQueryStatus(id).split(',');
obj.status = parseInt(st[0], 10), obj.percent = parseInt(st[1], 10), obj.uploaded = parseInt(st[4], 10), updateStatusByBigFile(i), 
restoring = !1;
break;
}
}
null == uploadBigFileData.timerID && startNextActiveByBigFile();
}
function prepareCheckUploadLimit(id, attrSize, isNormal2Trs) {
with (isNormal2Trs = isNormal2Trs || !1, uploadBigFileData) {
var client = new CMXClient;
client.resultListener = function(result) {
if (objs[curIndex].status = STATUS_UPLOAD_FAIL, timerID = setTimeout(startNextActiveByBigFile(isNormal2Trs), 100), 'FA_OVERFLOW' == result.code) {
upBigFileMgr.bdgCancelUpload(id), $win().$('ft_txProcessPausediv_' + id).style.display = 'none', $win().$('ft_processCountdiv_' + id).style.display = 'none', 
$win().$('ft_tProcessdiv_' + id).style.display = '';
var overflowReason = result.overflowReason, resultMessage = gLang.compose.msg[overflowReason] || overflowReason || result.code;
return 'pref_netfolder_max_file_count' == overflowReason ? resultMessage = gLang.compose.msg.msg_attachment_excced_count : 'pref_netfolder_quota' != overflowReason && 'pref_netfolder_max_file_size' != overflowReason || (resultMessage = gLang.compose.msg.msg_attachment_excced_size), 
$win().$('ft_tProcessdiv_' + id).innerHTML = resultMessage, $win().$('cancel_bigFile_' + id).style.display = 'none', $win().$('resume_bigFile_' + id).style.display = 'none', 
!0;
}
return !1;
};
var curAttachId = objs[curIndex].attributeID || '', curFid = 9;
upBigFileMgr.bdgSupportDnDUpload() && (curAttachId = '', curFid = upBigFileMgr.bdgGetComposeId(), 0 == curFid.indexOf('c:nf:') && (curFid = curFid.substr('c:nf:'.length))), 
client.cgi = {
uid: prepareUploadCheckUrlParams.uid
}, client.simpleCall('upload:prepareCheckUploadSizeLimit', {
attachId: curAttachId,
fid: parseInt(curFid),
size: parseInt(attrSize),
uid: prepareUploadCheckUrlParams.uid
}, (function(result) {
objs[curIndex].size = attrSize, isNormal2Trs ? $('divAttachDisplay_' + id) ? updateStatusByBigFileN(curIndex) : objs[curIndex].status == STATUS_UPLOAD_SUCCESS && (uploadSucTrsFiles[uploadSucTrsFiles.length] = {
id: id,
index: curIndex
}) : $win().$('ft_startdiv_' + id) ? updateStatusByBigFile(curIndex) : objs[curIndex].status == STATUS_UPLOAD_SUCCESS && (uploadSucTrsFiles[uploadSucTrsFiles.length] = {
id: id,
index: curIndex
}), timerID = setTimeout(startNextActiveByBigFile(isNormal2Trs), 100);
})), objs[curIndex].checkSize = !0;
}
}
function startNextActiveByBigFile() {
if (upBigFileMgr) with (uploadBigFileData) {
var len = objs.length;
if (curIndex == len || -1 == curIndex || !isProcessing(objs[curIndex].status)) {
for (curIndex = 0; curIndex < len && !isProcessing(objs[curIndex].status); ++curIndex) ;
if (curIndex == len) return void (timerID = null);
}
var id = objs[curIndex].id;
if (objs[curIndex].status == STATUS_WAITTING) {
if (upBigFileMgr.bdgSupportDnDUpload()) {
var fileSize = upBigFileMgr.bdgGetFileSize(id);
if (!objs[curIndex].checkSize && fileSize > 0) return void prepareCheckUploadLimit(id, fileSize);
if (0 == fileSize) return objs[curIndex].status = STATUS_UPLOAD_FAIL, timerID = setTimeout(startNextActiveByBigFile, 100), 
void updateStatusByBigFile(curIndex);
objs[curIndex].checkSize && fileSize && (objs[curIndex].size = fileSize);
}
upBigFileMgr.bdgStartUpload(id, prepareUploadCheckUrlParams), objs[curIndex].status = STATUS_PREPARE_UPLOAD;
} else {
var st = upBigFileMgr.bdgQueryStatus(id).split(',');
if (objs[curIndex].status = parseInt(st[0], 10), objs[curIndex].percent = parseInt(st[1], 10), objs[curIndex].uploaded = parseInt(st[4], 10), 
st.length > 2 && (objs[curIndex].attributeID = st[2]), objs[curIndex].isloaded || null == objs[curIndex].attributeID || '' == objs[curIndex].attributeID || (objs[curIndex].isloaded = !0), 
st.length > 3) {
if (!objs[curIndex].checkSize && parseInt(st[3]) > 0) return void (upBigFileMgr.bdgSupportDnDUpload() || prepareCheckUploadLimit(id, st[3]));
objs[curIndex].size = st[3];
}
}
$win().$('ft_startdiv_' + id) ? updateStatusByBigFile(curIndex) : objs[curIndex].status == STATUS_UPLOAD_SUCCESS && (uploadSucTrsFiles[uploadSucTrsFiles.length] = {
id: id,
index: curIndex
}), securityLevel.enable ? needPostProcess && objs[curIndex].status != STATUS_MOVE_TO_NF_SUCCESS && objs[curIndex].status != STATUS_UPLOAD_FAIL ? timerID = setTimeout(startNextActiveByBigFile, 100) : needPostProcess || objs[curIndex].status == STATUS_UPLOAD_SUCCESS || objs[curIndex].status == STATUS_UPLOAD_FAIL || (timerID = setTimeout(startNextActiveByBigFile, 100)) : timerID = setTimeout(startNextActiveByBigFile, 100);
}
}
function isProcessingByBigFile(state) {
return state == PluginManager.UploadItemState_Type.Ready || state == PluginManager.UploadItemState_Type.CRC || state == PluginManager.UploadItemState_Type.Uploading;
}
function startNextActiveByBigFileId(id) {
if (PluginManager.isLoaded()) for (var i = 0; i < uploadBigFileData.objs.length; ++i) if (uploadBigFileData.objs[i].id == id) {
var obj = PluginManager.queryUploadItemStatus(id, uploadBigFileData.objs[i]);
if (uploadBigFileData.objs[i].percent = obj.percent, uploadBigFileData.objs[i].attributeID = obj.attachmentId, uploadBigFileData.objs[i].isloaded || null == uploadBigFileData.objs[i].attributeID || '' == uploadBigFileData.objs[i].attributeID || (uploadBigFileData.objs[i].isloaded = !0), 
!isProcessingByBigFile(uploadBigFileData.objs[i].state)) return void updateStatusByBigFileN(i);
updateStatusByBigFileN(i), setTimeout((function() {
return startNextActiveByBigFileId(id);
}), 100);
break;
}
}
function updateFileStatusWhenDialogShow() {
with (uploadBigFileData) {
for (var i = 0; i < uploadSucTrsFiles.length; i++) {
var id = uploadSucTrsFiles[i].id, curIndex = uploadSucTrsFiles[i].index;
$win().$('ft_icodiv_' + id).style.display = '', $win().$('ft_txProcessPausediv_' + id).style.display = 'none', $win().$('ft_processCountdiv_' + id).style.display = 'none', 
$win().$('ft_tProcessdiv_' + id).style.display = '', $win().$('ft_tProcessdiv_' + id).innerHTML = gLang.compose.msg.uploadFinish, 
$win().$('cancel_bigFile_' + id).style.display = 'none', $win().$('resume_bigFile_' + id).style.display = 'none', $win().$('ft_processDetaildiv_' + id).style.display = 'none', 
uploadBigFiles[uploadBigFiles.length] = {
mid: objs[curIndex].attributeID,
name: getDescription(objs[curIndex].name),
desc: getDescription(objs[curIndex].name),
nfSize: objs[curIndex].size,
size: formatSize(objs[curIndex].size)
}, upBigFileMgr.bdgMoveToNetFolder(id);
}
uploadSucTrsFiles = [];
}
}
function formatSize(size, n) {
var p = 1;
if (n && n > 0) for (var i = 0; i < n; i++) p *= 10;
return size < 1024 ? (size *= p, size = Math.round(size), (size /= p) + 'B') : size < 1048576 ? (size /= 1024, size *= p, 
size = Math.round(size), (size /= p) + 'K') : (size /= 1048576, size *= p, size = Math.round(size), (size /= p) + 'M');
}
function formatLeftTime(time) {
var hour = Math.floor(time / 3600), minutes = Math.floor((time - 60 * hour * 60) / 60), second = Math.round(time - 60 * hour * 60 - 60 * minutes), text = '';
return text += hour > 9 ? hour + ':' : '0' + hour + ':', text += minutes > 9 ? minutes + ':' : '0' + minutes + ':', text += second > 9 ? second : '0' + second;
}
function updateStatusByBigFile(index) {
if (upBigFileMgr) with (uploadBigFileData) {
var obj = objs[index], id = obj.id;
if (obj.moveToNetFolder || !$win().$('ft_startdiv_' + id)) return;
if (obj.status == STATUS_WAITTING) securityLevel.enable || ($win().$('ft_txProcessPausediv_' + id).style.display = ''), 
$win().$('ft_processCountdiv_' + id).style.display = '', $win().$('ft_tProcessdiv_' + id).style.display = 'none', $win().$('uploadProcessBardiv_' + id).style.width = (obj.percent || 0) + '%', 
$win().$('ft_processCountdiv_' + id).innerHTML = ''; else if (obj.status == STATUS_PREPARE_UPLOAD) $win().$('ft_txProcessPausediv_' + id).style.display = '', 
$win().$('ft_processCountdiv_' + id).style.display = '', $win().$('ft_tProcessdiv_' + id).style.display = 'none', $win().$('ft_processCountdiv_' + id).innerHTML = gLang.compose.msg.uploadPrepare + obj.percent + '%', 
$win().$('cancel_bigFile_' + id).style.display = '', $win().$('resume_bigFile_' + id).style.display = 'none'; else if (obj.status == STATUS_UPLOADING) {
$win().$('ft_tProcessdiv_' + id).style.display = 'none', $win().$('ft_txProcessPausediv_' + id).style.display = '', $win().$('ft_processCountdiv_' + id).style.display = '', 
$win().$('ft_processDetaildiv_' + id).style.display = '', $win().$('uploadProcessBardiv_' + id).style.width = obj.percent + '%';
var current = (new Date).getTime(), currentUploadSize = obj.uploaded || obj.size * obj.percent / 100;
if (obj.beginUploadSize || (obj.beginUploadSize = currentUploadSize), obj.beginUploadTime || (obj.beginUploadTime = current), 
obj.lastSpeed || (obj.lastSpeed = 0), obj.leftTime || (obj.leftTime = 0), current - obj.beginUploadTime > 1e3 && currentUploadSize - obj.beginUploadSize > 0) {
var uploadtime = current - obj.beginUploadTime;
obj.lastSpeed = 1e3 * (currentUploadSize - obj.beginUploadSize) / uploadtime, obj.lastSpeed > 0 && (obj.leftTime = (obj.size - currentUploadSize) / obj.lastSpeed), 
obj.beginUploadTime = current, obj.beginUploadSize = currentUploadSize;
}
obj.leftTime = 10 * obj.leftTime, obj.leftTime = Math.round(obj.leftTime), obj.leftTime = obj.leftTime / 10, $win().$('ft_processCountdiv_' + id).innerHTML = obj.percent + '%', 
$win().$('ft_processDetaildiv_' + id).innerHTML = gLang.compose.msg.uploadDetail.replace('*upload*', formatSize(currentUploadSize, 2)).replace('*speed*', formatSize(obj.lastSpeed, 2)).replace('*lefttime*', formatLeftTime(obj.leftTime)), 
$win().$('cancel_bigFile_' + id).style.display = '', $win().$('resume_bigFile_' + id).style.display = 'none', hasFileUpload = !0;
} else if (obj.status == STATUS_UPLOAD_SUCCESS) {
if ($win().$('ft_icodiv_' + id).style.display = '', $win().$('ft_txProcessPausediv_' + id).style.display = 'none', $win().$('ft_processCountdiv_' + id).style.display = 'none', 
$win().$('ft_processDetaildiv_' + id).style.display = 'none', $win().$('ft_tProcessdiv_' + id).style.display = '', $win().$('cancel_bigFile_' + id).style.display = 'none', 
$win().$('resume_bigFile_' + id).style.display = 'none', obj.moveToNetFolder = !0, prepareUploadCheckUrlParams.moveToEnf ? upBigFileMgr.bdgMoveToEtpNetFolder(id, objs[curIndex].name, prepareUploadCheckUrlParams, moveToNetFolderCallback) : upBigFileMgr.bdgMoveToNetFolder(id, objs[curIndex].name, moveToNetFolderCallback), 
needPostProcess ? $win().$('ft_tProcessdiv_' + id).innerHTML = gLang.compose.msg.server_handling : ($win().$('ft_tProcessdiv_' + id).innerHTML = gLang.compose.msg.uploadFinish, 
currentFileUploaded()), hasFileUpload = !0, securityLevel.enable) {
var curStart = $win().$('start_bigFile_' + id);
curStart.className = curStart.className + ' done', curStart.style.display = 'none', jQ('.btl_start').filter(':not(.done)').show();
}
} else if (obj.status == STATUS_MOVING_TO_NF) ; else if (obj.status == STATUS_MOVE_TO_NF_SUCCESS) currentFileUploaded(); else if (obj.status == STATUS_UPLOAD_FAIL) {
var errorStatus = upBigFileMgr.bdgGetUploadFailReason(id), errorMsg = '';
if (3 == errorStatus || 4 == errorStatus) {
var errorInfo = upBigFileMgr.bdgGetServerReturnInfo(id);
errorMsg = getErrorMsg(errorInfo);
}
errorMsg || (errorMsg = STATUS_FAIL_REASON[errorStatus]), $win().$('resume_bigFile_' + id).style.display = '', errorMsg || 0 != upBigFileMgr.bdgGetFileSize(id) || (errorMsg = gLang.compose.msg.msg_attachment_file_upload_empty, 
$win().$('resume_bigFile_' + id).style.display = 'none'), $win().$('ft_txProcessPausediv_' + id).style.display = 'none', 
$win().$('ft_processCountdiv_' + id).style.display = 'none', $win().$('ft_processDetaildiv_' + id).style.display = 'none', 
$win().$('ft_tProcessdiv_' + id).style.display = '', $win().$('ft_tProcessdiv_' + id).innerHTML = errorMsg, $win().$('cancel_bigFile_' + id).style.display = 'none';
} else $win().$('cancel_bigFile_' + id).style.display = 'none', $win().$('ft_processDetaildiv_' + id).style.display = 'none', 
$win().$('resume_bigFile_' + id).style.display = '';
}
}
function currentFileUploaded() {
var objs = uploadBigFileData.objs, curIndex = uploadBigFileData.curIndex;
uploadBigFiles[uploadBigFiles.length] = {
mid: objs[curIndex].attributeID,
name: getDescription(objs[curIndex].name),
desc: getDescription(objs[curIndex].name),
nfSize: objs[curIndex].size,
size: formatSize(objs[curIndex].size)
};
}
function getFilesDataUploaded() {
return uploadBigFileData;
}
function moveToNetFolderCallback(id, name, fileId) {
var isIncludeSL = securityLevel.enable && jQ($('securityLevel_bigFile_' + id)).hasClass('included');
$win().$('ft_tProcessdiv_' + id).innerHTML = isIncludeSL ? gLang.nf.att.finish_unSupportRename : gLang.nf.att.finish_rename + '<input type=\'hidden\' id=\'renameId_bigFile_' + id + '\' value=\'' + fileId + '\'/><input type=\'text\' class=\'rename_bigFile\' id=\'rename_bigFile_' + id + '\' value=\'' + name.htmlencode() + '\'/>';
for (var objs = uploadBigFileData.objs || [], i = 0; i < objs.length; i++) {
var obj = objs[i];
if (obj.id == id) {
obj.nfAttachmentId = fileId;
break;
}
}
}
function releaseTrsActiveX() {
var temp = upBigFileMgr;
with (uploadBigFileData) {
timerID && clearTimeout(timerID);
var len = objs.length;
for (curIndex = 0; curIndex < len; ++curIndex) if (isPeddingStatus(objs[curIndex].status)) {
var id = objs[curIndex].id;
temp.bdgCancelUpload(id);
}
temp = null, uploadSucTrsFiles = [], uploadBigFiles = [], hasFileUpload = !1, timerID = null, objs = [], setFileName = {}, 
curIndex = -1;
}
}
function hasBigFileUploading() {
for (var len = uploadBigFileData.objs.length, curIndex = 0; curIndex < len; ++curIndex) if (uploadBigFileData.isPeddingStatus(uploadBigFileData.objs[curIndex].status)) return !0;
return !1;
}
function getUploadFilesWithSLevel() {
for (var uploadFilesWithSLevel = [], objs = uploadBigFileData.objs || [], i = 0; i < objs.length; i++) {
var obj = objs[i];
obj.status != uploadBigFileData.STATUS_MOVE_TO_NF_SUCCESS || obj.isDeleted || uploadFilesWithSLevel.push({
id: obj.nfAttachmentId,
misc: {
securityLevel: obj.securityLevel
}
});
}
return uploadFilesWithSLevel;
}
function getErrorMsg(errorInfo) {
var errorMsg = '';
if (errorInfo) {
var secondLine = errorInfo.substring(errorInfo.indexOf('\n') + 1);
if (secondLine) {
var responseText = 'var responseObj=' + secondLine;
if (eval(responseText), responseObj) {
var overflowReason = responseObj.overflowReason || responseObj.code;
overflowReason && (errorMsg = gLang.compose.msg[overflowReason.toLowerCase()]);
}
}
}
return errorMsg;
}
function getDescription(fileName) {
var index = -1;
return -1 == (index = isMac ? fileName.lastIndexOf('/') : fileName.lastIndexOf('\\')) ? fileName : fileName.substring(index + 1);
}
function showCancelLink(id) {
setStyleDisplay({
cancel_: '',
delete_: 'none',
undelete_: 'none',
download_: 'none',
resume_: 'none'
}, id);
}
function changeOnclickActions(id) {
changeCancelOnclickAction(id), changeResumeOnclickAction(id), changeDeleteOnclickAction(id), changeUndeleteOnclickAction(id);
}
function changeCancelOnclickAction(id) {
$('cancel_' + id).onclick = function() {
for (var i = 0; i < uploadBigFileData.objs.length; i++) if (uploadBigFileData.objs[i].id == id) {
PluginManager.cancelUpload(id), startNextActiveByBigFileId(id);
break;
}
};
}
function changeResumeOnclickAction(id) {
$('resume_' + id).onclick = function() {
for (var i = 0; i < uploadBigFileData.objs.length; i++) if (uploadBigFileData.objs[i].id == id) {
uploadBigFileData.objs[i].state == PluginManager.UploadItemState_Type.Stopping ? UI.alert(gLang.compose.msg.msg_opsTooFrequent) : PluginManager.startUpload(id), 
setTimeout((function() {
return startNextActiveByBigFileId(id);
}), 200);
break;
}
};
}
function changeDeleteOnclickAction(id) {
$('delete_' + id).onclick = function() {
var index = getBigFileIndexById(id);
index != uploadBigFileData.objs.length && setDeleteStatusByBigFile(index, !0);
};
}
function changeUndeleteOnclickAction(id) {
$('undelete_' + id).onclick = function() {
var index = getBigFileIndexById(id);
index != uploadBigFileData.objs.length && setDeleteStatusByBigFile(index, !1);
};
}
function getBigFileIndexById(id) {
for (var i = 0; i < uploadBigFileData.objs.length; ++i) if (uploadBigFileData.objs[i].id == id) return i;
return uploadBigFileData.objs.length;
}
function setDeleteStatusByBigFile(index, isDelete, bReplaced) {
with (bReplaced = bReplaced || !1, uploadBigFileData) {
var id = objs[index].id;
objs[index].deleted = isDelete;
var sId = 'BigFile' + id;
AttachInfo.setDeleted(sId, isDelete, bReplaced), $('displayName_' + id) && ($('displayName_' + id).style.textDecoration = isDelete ? 'line-through' : ''), 
Element[isDelete ? 'hide' : 'show']($('delete_' + id)), Element[isDelete ? 'show' : 'hide']($('undelete_' + id));
}
}
function changeIcoNormal2Trs(id) {
jQ('#divAttachDisplay_' + id + '>.ico:first').removeClass('icoNormalAttach').addClass('icoTrsAttach');
}
function updateNormal2TrsTips() {
var autoTrsTips = jQ('#autoTrsTips');
autoNormal2TrsTips = autoNormal2TrsTips || autoTrsTips.find('.info').html() || '';
for (var files = '<span style=\'color: #0077b9\'>', count = 0, idx = 0, size = uploadBigFileData.objs.length; idx < size; idx++) count < 2 && uploadBigFileData.objs[idx].state != PluginManager.UploadItemState_Type.Error && (files += getDescription(uploadBigFileData.objs[idx].name), 
++count < 2 && (files += ', '));
files += '</span>', autoTrsTips.find('.info').html(autoNormal2TrsTips.replace('$file$', files).replace('$number$', size)), 
autoTrsTips.show();
}
function addUploadFailIds(id) {
uploadData.uploadFailIds.push(id);
}
function doTrsUpload() {
var options = {
ids: uploadData.uploadFailIds
};
PluginManager.initUpload(PluginManager.Upload_Type.Upload_NetFolder, {
fid: 9
}, null, options, !0), PluginManager.setUploadItemStates(uploadData.uploadFailIds);
for (var i = 0; i < uploadData.uploadFailIds.length; i++) {
var id = uploadData.uploadFailIds[i];
addUploadingByBigFileN(parseInt(id), $('divAttachDisplay_' + id)), changeOnclickActions(id), showCancelLink(id);
}
updateNormal2TrsTips(), uploadData.uploadFailIds = [];
}
function addUploadingByBigFileN(id, displayDiv) {
var fileName = getDescription(upBigFileMgr.bdgGetUploadFileName(id));
uploadData.setFileName[fileName] >= 0 && (uploadData.setFileName[fileName] = null), doUploadLocalFileActionByBigFileN(id, fileName);
}
function doUploadLocalFileActionByBigFileN(id, fileName) {
var obj = {
name: fileName,
id: id,
status: uploadBigFileData.STATUS_WAITTING,
percent: 0,
isloaded: !1,
uploaded: 0
}, index = uploadBigFileData.objs.length;
uploadBigFileData.objs[index] = obj, uploadBigFileData.setFileName[fileName] = index, PluginManager.startUpload(id), startNextActiveByBigFileId(id);
}
function updateStatusByBigFileN(index) {
if (PluginManager.isLoaded()) with (uploadBigFileData) {
var obj = objs[index], id = obj.id;
if (!$('divAttachDisplay_' + id)) return;
var state = obj.state;
if (state == PluginManager.UploadItemState_Type.Ready) $('status_' + id).style.width = (obj.percent || 0) + '%', $('status_' + id).innerHTML = (obj.percent || 0) + '%'; else if (state == PluginManager.UploadItemState_Type.CRC) $('css_status_' + id).className = 'capacity inlineb', 
$('status_' + id).innerHTML = (obj.percent || 0) + '%', setStyleDisplay({
cancel_: '',
delete_: 'none',
undelete_: 'none',
resume_: 'none',
download_: 'none'
}, id), setStyleDisplay({
colsel_security_: 'none'
}, id, !0); else if (state == PluginManager.UploadItemState_Type.Uploading) $('status_' + id).style.width = obj.percent + '%', 
$('status_' + id).innerHTML = obj.percent + '%', setStyleDisplay({
cancel_: '',
delete_: 'none',
undelete_: 'none',
resume_: 'none',
download_: 'none'
}, id), setStyleDisplay({
colsel_security_: 'none'
}, id, !0), updateSize(id, sizeAutoFormat(obj.size * obj.percent / 100), sizeAutoFormat(obj.size)); else if (state == PluginManager.UploadItemState_Type.Finish || state == PluginManager.UploadItemState_Type.FinishWithoutCRC) changeStatusUploadSuccess(id, !0), 
AttachInfo.addAttachInfo('BigFile' + id, getDescription(obj.name), obj.type || 'trs', obj.deleted || !1, obj.mid || obj.attributeID, obj.nfSize || obj.size || null, obj.enfUid || null), 
updateSize(id, sizeAutoFormat(obj.size), sizeAutoFormat(obj.size)), updateSizeInfo(); else if (state == PluginManager.UploadItemState_Type.Stopping || state == PluginManager.UploadItemState_Type.Error && obj.lastErrorNum == PluginManager.UploadItemError_Type.Interrupt_Error) setStyleDisplay({
cancel_: 'none',
resume_: ''
}, id); else if (state == PluginManager.UploadItemState_Type.Error) {
var errorMsg = TrsUpload.STATUS_FAIL_REASON[obj.lastErrorNum];
errorMsg || (errorMsg = obj.lastErrorStr), displayUploadErrorMsg(id, errorMsg, isAutoNormal2Trs), $('displayName_' + id) && ($('displayName_' + id).style.textDecoration = 'line-through');
}
!isProcessingByBigFile(state) && uploadFailData[id] && (uploadFailData[id] = '1'), enableSendButton(canSendEmail(!0));
}
}
function setStyleDisplay(settingObj, id, isCheckExists) {
for (var p in settingObj) 'function' == typeof settingObj[p] || (isCheckExists ? $(p + '' + id) && ($(p + '' + id).style.display = settingObj[p]) : $(p + '' + id).style.display = settingObj[p]);
}
}(), AttachInfo = function() {
var eDivAttachInfo;
function _fSetHiddenInput(sName, sValue) {
var eInput = document.createElement('INPUT');
return jQ(eInput).attr({
type: 'hidden',
name: sName,
value: sValue
}), eInput;
}
function _fEscapeSym(s) {
var i = (s += '').indexOf(':');
return i > 0 ? s.substring(0, i) + '\\' + s.substring(i, s.length) : 0 == i ? '\\' + s : s;
}
return {
initAttachInfo: function(eDivAttachInfo0) {
eDivAttachInfo = eDivAttachInfo0 || jQ('#divAttachInfo')[0];
},
addAttachInfo: function(sId, sDisplayName, sType, bDeleted, sMid, sSize, sEnfUid) {
jQ('#attachment_' + sId, eDivAttachInfo).remove();
var eDiv = document.createElement('DIV');
jQ(eDiv).attr({
id: 'attachment_' + sId,
name: 'attachment_' + sId
}), jQ(eDiv).append(_fSetHiddenInput('attachment', sId)), jQ(eDiv).append(_fSetHiddenInput('attachment_' + sId + '_type', sType)), 
jQ(eDiv).append(_fSetHiddenInput('attachment_' + sId + '_displayName', sDisplayName)), jQ(eDiv).append(_fSetHiddenInput('attachment_' + sId + '_deleted', bDeleted + '')), 
sMid && jQ(eDiv).append(_fSetHiddenInput('attachment_' + sId + '__mid', sMid + '')), sSize && jQ(eDiv).append(_fSetHiddenInput('attachment_' + sId + '_size', sSize + '')), 
sEnfUid && jQ(eDiv).append(_fSetHiddenInput('attachment_' + sId + '_enfUid', sEnfUid + '')), jQ(eDivAttachInfo).append(eDiv);
},
setSecurityLevel: function(sId, sLevel, sName) {
sLevel = sLevel || '0', sName = sName || '';
var sSelectAT = 'input[name=attachment][value=' + _fEscapeSym(sId) + ']', sSelectSL = 'input[name=attachment_' + _fEscapeSym(sId) + '_security_level]';
sName && '' != sName && (sLevel = CMUpload.CMCheckSecurityLevel(sName).level + ''), 0 == jQ(sSelectSL, eDivAttachInfo).length ? jQ(sSelectAT, eDivAttachInfo).after(_fSetHiddenInput('attachment_' + sId + '_security_level', sLevel + '')) : jQ(sSelectSL, eDivAttachInfo).attr('value', sLevel + '');
},
setDeleted: function(sId, bDeleted, bReplaced, bRealDelete) {
if (sId) {
if (bDeleted = bDeleted || !1, bReplaced = bReplaced || !1, bRealDelete = bRealDelete || !1) {
var sSelectEL = '#attachment_' + _fEscapeSym(sId);
jQ(sSelectEL, eDivAttachInfo).remove();
}
var sSelectAT = 'input[name=attachment][value=' + _fEscapeSym(sId) + ']', sSelectDL = 'input[name=attachment_' + _fEscapeSym(sId) + '_deleted]';
0 == jQ(sSelectDL, eDivAttachInfo).length ? jQ(sSelectAT, eDivAttachInfo).after(_fSetHiddenInput('attachment_' + sId + '_deleted', bDeleted + '')) : jQ(sSelectDL, eDivAttachInfo).attr('value', bDeleted + ''), 
bDeleted && bReplaced && jQ(sSelectAT, eDivAttachInfo).after(_fSetHiddenInput('attachment_' + sId + '_replaced', bReplaced + ''));
}
},
getValidSize: function(bNotSkipTrs) {
bNotSkipTrs = bNotSkipTrs || !1;
var iSize = 0;
return jQ('div[name*=attachment]', eDivAttachInfo).each((function() {
var sType = jQ('input[name*=type]', this).attr('value'), sDelete = jQ('input[name*=deleted]', this).attr('value');
if (!bNotSkipTrs && 'trs' == sType || 'true' == sDelete) return !0;
iSize += parseInt(jQ('input[name*=size]', this).attr('value'));
})), iSize;
},
checkAttrNameExit: function(sName, bReturnId) {
var result = !1;
return (bReturnId = bReturnId || !1) && (result = ''), jQ('input[name*=displayName]', eDivAttachInfo).each((function() {
if (jQ(this).attr('value') == sName) {
var sAttachmentID = jQ(this).siblings('input[name=attachment]').attr('value'), bReplaced = jQ(this).siblings('input[name=attachment_' + sAttachmentID + '_replaced]').attr('value');
return !(!bReplaced || 'true' != bReplaced) || (result = !bReturnId || sAttachmentID, !1);
}
})), result;
},
getAttachInfo: function() {
var aResults = [];
return jQ('div[name*=attachment]', eDivAttachInfo).each((function() {
var oResult = {};
jQ(this).children('input').each((function() {
oResult[jQ(this).attr('name')] = jQ(this).attr('value');
})), aResults.push(oResult);
})), aResults;
},
getUploadSuccessObjs: function() {
var aResults = [];
return jQ('div[name*=attachment]', eDivAttachInfo).each((function() {
var oResult = {};
jQ(this).children('input').each((function() {
var name = jQ(this).attr('name'), value = jQ(this).attr('value');
if ('attachment' == name) {
if (!value.match(/^[0-9]*$/)) return !1;
value = parseInt(value), oResult.id = value;
} else name.match(/type/) ? oResult.type = value : name.match(/deleted/) ? oResult.deleted = 'true' == value : name.match(/size/) ? oResult.size = parseInt(value) : name.match(/displayName/) && (oResult.fileName = value);
})), oResult.hasOwnProperty('id') && aResults.push(oResult);
})), aResults;
}
};
}();
//# sourceMappingURL=CMUpload.js.map