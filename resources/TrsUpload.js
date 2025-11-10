var TrsUpload = function() {
var isMac = 'Macintosh' == navigator.userAgent.split(';')[0].split('(')[1], EUPDATE_TYPE = {
CALLBACK_FUNC: 0,
TIMER: 1
}, ESTATUS_FAIL_REASON = [ 'NORMAL', 'Input Param Error', gLang.compose.msg.msg_attachment_nomem, 'File Access Deny', gLang.compose.msg.msg_attachment_crcerr, gLang.compose.msg.msg_attachment_neterr, gLang.compose.msg.msg_attachment_noexist, gLang.compose.msg.msg_attachment_excced_count, gLang.compose.msg.msg_attachment_excced_size, gLang.compose.msg.msg_attachment_syserr ], uploadFiles = [], setFileName = [], enableTimer = !1, enableRename = !1, securityLevel = {
enable: !1,
selfLevel: !1,
schema: null,
matchExpression: null
}, isFileResume = !1, FileObj = {
beginUploadTime: null,
beginUploadSize: null,
leftTime: null,
lastSpeed: null,
finishAll: !1,
createNew: function(obj) {
return Object.extend(obj, FileObj);
}
};
return {
UPDATE_TYPE: EUPDATE_TYPE,
STATUS_FAIL_REASON: ESTATUS_FAIL_REASON,
initTrsUpload: function(uploadType, updateType, param, options, bRename) {
var callback = null;
enableRename = bRename || !1, updateType == EUPDATE_TYPE.CALLBACK_FUNC ? callback = fUpdateFileStateCallBack : updateType == EUPDATE_TYPE.TIMER && (enableTimer = !0, 
fUpdateFilesState());
param.enableSecurityLevel && (securityLevel.enable = !0, securityLevel.selfLevel = param.selfSecurityLevel, securityLevel.schema = param.securityLevelSchema);
return PluginManager.initUpload(uploadType, param, callback, options);
},
resetTrsUpload: function() {
enableTimer = !1, setFileName = [];
for (var i = 0; i < uploadFiles.length; i++) uploadFiles[i].state != PluginManager.UploadItemState_Type.Finish && fCancelUpload(uploadFiles[i].id);
uploadFiles = [];
},
addUploadFiles: function(isSingle, targetDiv) {
var ids = PluginManager.browserFolder(isSingle);
isFileResume = !1;
for (var i = 0; i < ids.length; ++i) fDisplayFile(parseInt(ids[i]), targetDiv);
securityLevel.enable || PluginManager.startUploadSyn(ids);
return ids;
},
getUploadSuccessFiles: function() {
for (var uploadSuccessFiles = [], i = 0; i < uploadFiles.length; i++) for (var stateKeys = [ PluginManager.UploadItemState_Type.Finish, PluginManager.UploadItemState_Type.FinishWithoutCRC ], j = 0; j < stateKeys.length; j++) if (stateKeys[j] == uploadFiles[i].state) {
uploadSuccessFiles[uploadSuccessFiles.length] = uploadFiles[i], uploadFiles[i].name = getDescription(uploadFiles[i].name), 
uploadFiles[i].mid = uploadFiles[i].attachmentId;
break;
}
return uploadSuccessFiles;
},
getUploadFilesWithSLevel: function(stateKeys) {
var uploadFilesWithSLevel = [];
stateKeys = stateKeys || [];
for (var i = 0; i < uploadFiles.length; i++) {
var curFile = uploadFiles[i];
if (curFile.state != PluginManager.UploadItemState_Type.Error || curFile.lastErrorNum == PluginManager.UploadItemError_Type.Interrupt_Error) for (var j = 0; j < stateKeys.length; j++) stateKeys[j] != curFile.state || curFile.isDeleted || uploadFilesWithSLevel.push({
id: curFile.attachmentId,
misc: {
securityLevel: curFile.securityLevel
}
});
}
return uploadFilesWithSLevel;
},
updateFileState: fUpdateFileState,
updateFilesState: fUpdateFilesState,
updateFileObjById: fUpdateFileObjById,
updateFileStateCallBack: fUpdateFileStateCallBack,
cancelUpload: fCancelUpload,
resumeUpload: function(id) {
for (var i = 0; i < uploadFiles.length; i++) if (uploadFiles[i].id == id) {
if (uploadFiles[i].state == PluginManager.UploadItemState_Type.Stopping) UI.alert(gLang.compose.msg.msg_opsTooFrequent); else $win().$('uploadProcessBardiv_' + id).className = 'uploadProcessBar', 
PluginManager.startUpload(id), fUpdateFileState(i);
break;
}
},
restoreUpload: function(fileName, crc2, attachID, targetDiv, sLevel) {
var ids = PluginManager.resumeUpload(fileName, crc2, attachID);
isFileResume = !0;
for (var i = 0; i < ids.length; ++i) fDisplayFile(parseInt(ids[i]), targetDiv, sLevel), securityLevel.enable || PluginManager.startUpload(parseInt(ids[i]));
},
updateUploadingParam: fUpdateUploadingParam,
queryStatesOfFiles: function(arrKeys) {
for (var i = 0; i < arrKeys.length; i++) for (var j = 0; j < uploadFiles.length; j++) if (uploadFiles[j].state == arrKeys[i]) return !0;
return !1;
}
};
function _departSLFromFilename(filename) {
var matchResult, senderSLExpression = securityLevel.matchExpression || function() {
var i, expression = null, slNameArr = [], schema = securityLevel.schema || {};
for (i in schema) slNameArr.push(schema[i]);
return 0 != slNameArr.length && (expression = new RegExp('^\\[(' + slNameArr.join('|') + ')\\]\\s*', 'ig'), securityLevel.matchExpression = expression), 
expression;
}(), departResult = {
securityLevel: ''
};
return filename = getDescription(filename).escapeHTML(), senderSLExpression && (matchResult = filename.match(senderSLExpression)) && (departResult.securityLevel = matchResult[0].replace(/\[/, '').replace(/\]\s*/, ''), 
departResult.value = function(name) {
var i, schema = securityLevel.schema || {};
for (i in schema) if (schema[i] == name) return parseInt(i);
return '';
}(departResult.securityLevel)), departResult;
}
function fUpdateFileStateCallBack(state, percent, id) {
fUpdateFileState(id);
}
function fUpdateFileObjById(id) {
for (var i = 0; i < uploadFiles.length; i++) if (uploadFiles[i].id == id) {
var obj = PluginManager.queryUploadItemStatus(id, uploadFiles[i]);
return obj.state == PluginManager.UploadItemState_Type.Uploading && fUpdateUploadingParam(uploadFiles[i]), obj;
}
return null;
}
function fUpdateFilesState() {
for (var i = 0; i < uploadFiles.length; i++) fUpdateFileState(uploadFiles[i].id);
enableTimer && setTimeout(fUpdateFilesState, 200);
}
function fUpdateFileState(id) {
if (PluginManager.isLoaded()) {
var obj = fUpdateFileObjById(id);
if (obj && $win().$('ft_startdiv_' + id) && !obj.finishAll) if (obj.state == PluginManager.UploadItemState_Type.Ready) securityLevel.enable || ($win().$('ft_txProcessPausediv_' + id).style.display = ''), 
$win().$('ft_processCountdiv_' + id).style.display = '', $win().$('ft_tProcessdiv_' + id).style.display = 'none', $win().$('uploadProcessBardiv_' + id).style.width = (obj.percent || 0) + '%', 
$win().$('ft_processCountdiv_' + id).innerHTML = ''; else if (obj.state == PluginManager.UploadItemState_Type.CRC) $win().$('ft_txProcessPausediv_' + id).style.display = '', 
$win().$('ft_processCountdiv_' + id).style.display = '', $win().$('ft_tProcessdiv_' + id).style.display = 'none', $win().$('ft_processCountdiv_' + id).innerHTML = gLang.compose.msg.uploadPrepare + obj.percent + '%', 
$win().$('cancel_bigFile_' + id).style.display = '', $win().$('resume_bigFile_' + id).style.display = 'none'; else if (obj.state == PluginManager.UploadItemState_Type.Uploading) {
$win().$('ft_tProcessdiv_' + id).style.display = 'none', $win().$('ft_txProcessPausediv_' + id).style.display = '', $win().$('ft_processCountdiv_' + id).style.display = '', 
$win().$('ft_processDetaildiv_' + id).style.display = '', $win().$('uploadProcessBardiv_' + id).style.width = obj.percent + '%';
var currentUploadSize = parseInt(obj.size) * obj.percent / 100;
$win().$('ft_processCountdiv_' + id).innerHTML = obj.percent + '%', $win().$('ft_processDetaildiv_' + id).innerHTML = gLang.compose.msg.uploadDetail.replace('*upload*', formatSize(currentUploadSize, 2)).replace('*speed*', formatSize(obj.lastSpeed, 2)).replace('*lefttime*', function(time) {
var hour = Math.floor(time / 3600), minutes = Math.floor((time - 60 * hour * 60) / 60), second = Math.round(time - 60 * hour * 60 - 60 * minutes), text = '';
text += hour > 9 ? hour + ':' : '0' + hour + ':';
text += minutes > 9 ? minutes + ':' : '0' + minutes + ':';
text += second > 9 ? second : '0' + second;
return text;
}(obj.leftTime)), $win().$('cancel_bigFile_' + id).style.display = '', $win().$('resume_bigFile_' + id).style.display = 'none';
} else if (obj.state == PluginManager.UploadItemState_Type.Finish || obj.state == PluginManager.UploadItemState_Type.FinishWithoutCRC) $win().$('ft_icodiv_' + id).style.display = '', 
$win().$('ft_txProcessPausediv_' + id).style.display = 'none', $win().$('ft_processCountdiv_' + id).style.display = 'none', 
$win().$('ft_processDetaildiv_' + id).style.display = 'none', $win().$('ft_tProcessdiv_' + id).style.display = '', $win().$('cancel_bigFile_' + id).style.display = 'none', 
$win().$('resume_bigFile_' + id).style.display = 'none', $win().$('ft_tProcessdiv_' + id).innerHTML = gLang.compose.msg.uploadFinish, 
enableRename && (securityLevel.enable && 'included' == $win().$('securityLevel_bigFile_' + id).className ? $win().$('ft_tProcessdiv_' + id).innerHTML = gLang.nf.att.finish_unSupportRename : $win().$('ft_tProcessdiv_' + id).innerHTML = gLang.nf.att.finish_rename + '<input type=\'hidden\' id=\'renameId_bigFile_' + id + '\' value=\'' + obj.attachmentId + '\'/><input type=\'text\' class=\'rename_bigFile\' id=\'rename_bigFile_' + id + '\' value=\'' + getDescription(obj.name).htmlencode() + '\'/>'), 
obj.finishAll = !0, securityLevel.enable && (jQ('#start_bigFile_' + id).addClass('done').hide(), jQ('.btl_start').filter(':not(.done)').show()); else if (obj.state == PluginManager.UploadItemState_Type.Stopping || obj.state == PluginManager.UploadItemState_Type.Error && obj.lastErrorNum == PluginManager.UploadItemError_Type.Interrupt_Error) $win().$('cancel_bigFile_' + id).style.display = 'none', 
$win().$('ft_processDetaildiv_' + id).style.display = 'none', $win().$('resume_bigFile_' + id).style.display = ''; else if (obj.state == PluginManager.UploadItemState_Type.Error) {
var errorMsg = TrsUpload.STATUS_FAIL_REASON[obj.lastErrorNum];
0 === obj.lastErrorNum && /^\[.*?:.*?]$/.test(document.domain) && (errorMsg = gLang.compose.msg.msg_attachment_ipv6), errorMsg || (errorMsg = obj.lastErrorStr), 
$win().$('ft_txProcessPausediv_' + id).style.display = 'none', $win().$('ft_processCountdiv_' + id).style.display = 'none', 
$win().$('ft_processDetaildiv_' + id).style.display = 'none', $win().$('ft_tProcessdiv_' + id).style.display = '', $win().$('ft_tProcessdiv_' + id).innerHTML = errorMsg, 
$win().$('cancel_bigFile_' + id).style.display = 'none';
}
}
}
function fDisplayFile(id, targetDiv, sLevel) {
var fileObj = FileObj.createNew(PluginManager.queryUploadItemStatus(id)), fileName = fileObj.name;
if (null != fileName && '' != fileName) if (setFileName[fileName]) UI.alert(gLang.compose.msg.msg_attach_exist); else {
var index = uploadFiles.length;
uploadFiles[uploadFiles.length] = fileObj, setFileName[fileName] = index;
var El = $doc(), _startdiv = El.createElement('div');
_startdiv.setAttribute('id', 'ft_startdiv_' + id), _startdiv.className = 'ft_start';
var ft_icodiv = El.createElement('div');
ft_icodiv.setAttribute('id', 'ft_icodiv_' + id), ft_icodiv.className = 'ft_ico', ft_icodiv.style.display = 'none', ft_icodiv.innerHTML = '<div class="ico_upload_success"></div>';
var ft_maindiv = El.createElement('div');
ft_maindiv.className = 'ft_main';
var ft_topdiv = El.createElement('div');
ft_topdiv.className = 'ft_top';
var ft_namediv = El.createElement('div');
if (ft_namediv.className = 'ft_name', ft_namediv.innerHTML = getDescription(fileName).escapeHTML(), ft_topdiv.appendChild(ft_namediv), 
securityLevel.enable) {
var ft_securityleveldiv = El.createElement('div');
ft_securityleveldiv.setAttribute('id', 'securityleveldiv_' + id), ft_securityleveldiv.className = 'ft_securitylevel', ft_securityleveldiv.appendChild(function(id, sLevel, filename) {
var departResult = _departSLFromFilename(filename), isIncludeSL = !!departResult.securityLevel, node = $doc().createElement(isFileResume || isIncludeSL ? 'span' : 'select');
if (node.id = 'securityLevel_bigFile_' + id, isFileResume) node.innerHTML = securityLevel.schema[sLevel], node.className = 'resumeFile'; else if (isIncludeSL) node.innerHTML = departResult.securityLevel, 
node.className = 'included', node.setAttribute('slevel', departResult.value); else for (var key in node.appendChild(Object.extend($doc().createElement('option'), {
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
}(id, sLevel, fileName)), ft_securityleveldiv.appendChild(function(id, sLevel) {
return Object.extend($doc().createElement('a'), {
id: 'start_bigFile_' + id,
className: 'btl_start',
innerHTML: gLang.compose.att.att_upload_start,
onclick: function() {
var slObj = jQ(this).prev(), isIncludeSL = slObj.hasClass('included');
if (slObj.hasClass('resumeFile') || isIncludeSL) {
jQ('.btl_start').hide();
for (var i = 0; i < uploadFiles.length; i++) if (uploadFiles[i].id == id) {
uploadFiles[i].securityLevel = '' + (isIncludeSL ? slObj.attr('slevel') : sLevel);
break;
}
PluginManager.startUploadSyn([ id ]);
} else {
var curLevel = slObj.val();
if (curLevel) {
jQ('.btl_start').hide();
var container = jQ(this).closest('.ft_securitylevel'), curValue = slObj.find('option:selected').html();
slObj.hide(), container.prepend(jQ('<span>').html(curValue));
for (i = 0; i < uploadFiles.length; i++) if (uploadFiles[i].id == id) {
uploadFiles[i].securityLevel = curLevel;
break;
}
PluginManager.startUploadSyn([ id ]);
} else UI.alert(gLang.compose.msg.msg_security_level_empty_err);
}
}
});
}(id, sLevel)), ft_topdiv.appendChild(ft_securityleveldiv);
}
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
var ft_operatordiv = El.createElement('div');
ft_operatordiv.setAttribute('id', 'operatordiv_' + id), ft_operatordiv.className = 'ft_tOperator trs_operator trs_line_height', 
ft_operatordiv.appendChild(function(id) {
var node = Object.extend($doc().createElement('a'), {
id: 'cancel_bigFile_' + id,
className: 'btl',
innerHTML: gLang.compose.att.att_upload_cancel,
onclick: function() {
TrsUpload.cancelUpload(id);
}
});
return node.style.display = 'none', node;
}(id)), ft_operatordiv.appendChild(function(id) {
var node = Object.extend($doc().createElement('a'), {
id: 'resume_bigFile_' + id,
className: 'btl',
innerHTML: gLang.compose.att.att_upload_resume,
onclick: function() {
TrsUpload.resumeUpload(id);
}
});
return node.style.display = 'none', node;
}(id));
var ft_processCountdiv = El.createElement('div');
ft_processCountdiv.className = 'ft_processCount trs_line_height trs_processCount', ft_processCountdiv.setAttribute('id', 'ft_processCountdiv_' + id), 
ft_contentdiv.appendChild(ft_txProcessPausediv), ft_contentdiv.appendChild(ft_operatordiv), ft_contentdiv.appendChild(ft_processCountdiv), 
ft_contentdiv.appendChild(ft_tProcessdiv);
var ft_processDetaildiv = El.createElement('div');
ft_processDetaildiv.setAttribute('id', 'ft_processDetaildiv_' + id), ft_processDetaildiv.innerHTML = '', ft_processDetaildiv.className = 'ft_bottom trs_bottom', 
ft_maindiv.appendChild(ft_topdiv), ft_maindiv.appendChild(ft_contentdiv), ft_maindiv.appendChild(ft_processDetaildiv), _startdiv.appendChild(ft_icodiv), 
_startdiv.appendChild(ft_maindiv), targetDiv.appendChild(_startdiv);
} else alert('Illegal file name!');
}
function fCancelUpload(id) {
for (var i = 0; i < uploadFiles.length; i++) if (uploadFiles[i].id == id) {
PluginManager.cancelUpload(id);
var uploadProcessBardiv = $win().$('uploadProcessBardiv_' + id);
uploadProcessBardiv && (uploadProcessBardiv.className = 'uploadProcessBarNotActive', fUpdateFileState(i)), uploadFiles[i].beginUploadTime = null, 
uploadFiles[i].beginUploadSize = null;
break;
}
}
function fUpdateUploadingParam(obj) {
var current = (new Date).getTime(), currentUploadSize = parseInt(obj.size) * obj.percent / 100;
if (obj.size = parseInt(obj.size) || 0, obj.percent = obj.percent || 0, obj.beginUploadSize = obj.beginUploadSize || currentUploadSize, 
obj.beginUploadTime = obj.beginUploadTime || current, obj.lastSpeed = obj.lastSpeed || 0, obj.leftTime = obj.leftTime || 0, 
obj.state == PluginManager.UploadItemState_Type.Uploading) {
var uploadtime = current - obj.beginUploadTime;
obj.lastSpeed = 1e3 * (currentUploadSize - obj.beginUploadSize) / uploadtime, obj.lastSpeed > 0 && (obj.leftTime = (obj.size - currentUploadSize) / obj.lastSpeed);
}
return obj.leftTime = 10 * obj.leftTime, obj.leftTime = Math.round(obj.leftTime), obj.leftTime = obj.leftTime / 10, obj;
}
function getDescription(fileName) {
var index = -1;
return -1 == (index = isMac ? fileName.lastIndexOf('/') : fileName.lastIndexOf('\\')) ? fileName : fileName.substring(index + 1);
}
function formatSize(size, n) {
var p = 1;
return n && n > 0 && (p = 10 * n), size < 1024 ? (size *= p, size = Math.round(size), (size /= p) + 'B') : size < 1048576 ? (size /= 1024, 
size *= p, size = Math.round(size), (size /= p) + 'K') : (size /= 1048576, size *= p, size = Math.round(size), (size /= p) + 'M');
}
}();
//# sourceMappingURL=TrsUpload.js.map