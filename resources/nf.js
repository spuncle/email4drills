function confirmDelete(btn, form, isDefaultTip) {
for (var fidArray = document.getElementsByName('fid'), nf_tips = isDefaultTip ? nf_tips_DeleteTrs : nf_tips_DeleteFolder, i = 0; i < fidArray.length; i++) {
var folder = fidArray[i];
if (folder.checked) {
var childCount = folder.getAttribute('childCount'), fileCount = folder.getAttribute('fileCount');
if (childCount > 0 || fileCount > 0) {
nf_tips = nf_tips_DeleteFolder_Recursion;
break;
}
}
}
return UI.confirm({
message: nf_tips,
yes: function() {
window.setDeleteAction ? window.setDeleteAction() : $('delete').value = 'true', form || (form = btn.form ? btn.form : document.forms[0]), 
form.submit();
}
}), !1;
}

function submitForm(theControl) {
theControl.value && theControl.form.submit();
}

function show_hide(event, body) {
var spans = Event.findElement(event, 'a').getElementsByTagName('span');
Element.toggle(spans[0], spans[1], $(body));
}

function validateName(name, isFile) {
var msg = checkName(name, isFile);
return msg && UI.alert(msg), !msg;
}

function checkName(name, isFile) {
var emptyTips, tooLongTips, errorNameTips;
isFile ? (emptyTips = nf_tips_emptyFileName, tooLongTips = nf_tips_FileNameTooLong, errorNameTips = nf_tips_errorFileName) : (emptyTips = foldermain_tips_emptyFolderName, 
tooLongTips = foldermain_tips_FolderNameTooLong, errorNameTips = foldermain_tips_errorFolderName);
return name ? name.len() > 24 ? tooLongTips.replace('{0}', 24).replace('{1}', Math.floor(12)) : containsAny(name, '%\'"\\/:*?<>|=,^') ? errorNameTips.replace('{0}', '%\'"\\/:*?<>|=,^') : '' : emptyTips;
}

function containsAny(s1, s2) {
for (var i = 0; i < s1.length; i++) if (s2.indexOf(s1.charAt(i)) >= 0) return !0;
return !1;
}

function generateIds(files, index, externalKeys) {
for (var ids = [], i = 0, filesLength = files.length; i < filesLength; i++) {
var fileItem = files[i], fileId = fileItem[index];
if (fileId) if (externalKeys && externalKeys.length > 0) {
for (var obj = {}, j = 0, keysLength = externalKeys.length; j < keysLength; j++) obj[externalKeys[i]] = fileItem[externalKeys[i]];
obj.id = fileId, ids.push(obj);
} else ids.push(fileId);
}
return ids;
}

function checkUploading(callback) {
var hasFileUploading = TrsUpload.queryStatesOfFiles([ PluginManager.UploadItemState_Type.Uploading ]);
return !!(hasFileUploading = hasFileUploading || CMUpload.CMHasFileUploading()) && (UI.confirm({
message: gLang.nf.msg.file_uploading_new,
icon: 'warnning',
yes: callback
}), !0);
}

function updateFileInfo(params, callback) {
if (params.length > 0) {
var client = new CMXClient;
client.resultListener = function(result) {
return ('FA_NAME_EXISTS' === result.code || 'S_PARTIAL_OK' === result.code || 'FA_NAME_INVALID' === result.code) && (callback(), 
!0);
}, client.simpleCall('nf:updateFileInfos', {
items: params
}, (function() {
callback();
}));
} else callback();
}

function confirmHandler(callback) {
return function() {
if (checkUploading(callback)) return !1;
var dataFiles, params;
PluginManager.isLoaded() ? params = generateIds(dataFiles = TrsUpload.getUploadSuccessFiles(), 'attachmentId', [ 'name' ]) : (dataFiles = CMUpload.CMGetFilesDataUploaded().objs, 
$win().jQ('input[id^=rename_bigFile]').each((function() {
if (this.value) for (var id = this.id.substring(this.id.lastIndexOf('_') + 1), fileID = _$ui('renameId_bigFile_' + id).value, name = _$ui('rename_bigFile_' + id).value, i = 0; i < dataFiles.length; i++) if (dataFiles[i].nfAttachmentId === fileID) {
dataFiles[i].name = name;
break;
}
})), params = generateIds(dataFiles, 'nfAttachmentId', [ 'name' ])), updateFileInfo(params, callback);
};
}

function cancelHandler(callback) {
return function() {
var deleteFile = function() {
var hasFileUploaded = TrsUpload.queryStatesOfFiles([ PluginManager.UploadItemState_Type.Finish, PluginManager.UploadItemState_Type.FinishWithoutCRC ]);
if (hasFileUploaded = hasFileUploaded || CMUpload.CMHasFileUpload()) {
var delIDs, isPlugin = PluginManager.isLoaded(), idIndex = isPlugin ? 'attachmentId' : 'nfAttachmentId', dataFiles = isPlugin ? TrsUpload.getUploadSuccessFiles() : CMUpload.CMGetFilesDataUploaded().objs;
if ((delIDs = generateIds(dataFiles, idIndex)).length > 0) {
var client = new CMXClient;
client.resultListener = function(result) {
return 'S_OK' !== result.code && (callback(), !0);
}, client.simpleCall('nf:deleteFiles', {
ids: delIDs,
fid: 9
}, (function() {
for (var i = 0, len = dataFiles.length; i < len; i++) {
var fileItem = dataFiles[i];
delIDs.indexOf(fileItem.nfAttachmentId) > -1 && (fileItem.isDeleted = !0);
}
callback();
}));
} else callback();
} else callback();
};
if (checkUploading(deleteFile)) return !1;
deleteFile();
};
}
//# sourceMappingURL=nf.js.map