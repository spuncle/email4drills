function auth2LockVerify(options) {
var passFunc = options.onPass || Prototype.emptyFunction, isSetting = options.isSetting, cancelDialog = options.cancelDialog === undefined || options.cancelDialog, bodyHTML = (options.isReload === undefined || options.isReload, 
''), sid = CC.sid, pwdResetURL = CC.basePath + 'pref/auth2LockPwdReset.jsp?sid=' + sid;
isSetting ? (bodyHTML = '<form> <table width="420px">     <tr>         <td width="40"><i class="bico brig alert"></i></td>         <td>             <table>                 <tr>                     <td>' + gLang.pref.lock.input_lock_pwd + ': <input style="width:90px;height:18px;" name="password" id="password" type="password">', 
CC.showLoginForgotPass && (bodyHTML += '                         <a id="resetauth2pwd_ln" totabid="resetauth2pwd" href="' + pwdResetURL + '">' + gLang.pref.lock.forget_pwd + '</a>'), 
bodyHTML += '                     </td>                 </tr>                 <tr>                     <td>                         <span id="error_span" class="error"></span>                     </td>                 </tr>             </table>         </td>     </tr> </table></form>') : (bodyHTML = '<form> <table width="420px">     <tr>         <td width="40"><i class="bico brig alert"></i></td>         <td>             <table>                 <tr>                     <td>                         <span style="color: #7D7D7D;font-size:15px;">' + gLang.pref.lock.input_lock_pwd_tip + '</span>                     </td>                 </tr>                 <tr>                     <td>' + gLang.pref.lock.input_lock_pwd + ': <input style="width:90px;height:18px;" name="password" id="password" type="password">', 
CC.showLoginForgotPass && (bodyHTML += '                         <a id="resetauth2pwd_ln" totabid="resetauth2pwd" href="' + pwdResetURL + '">' + gLang.pref.lock.forget_pwd + '</a>'), 
bodyHTML += '                     </td>                 </tr>                 <tr>                     <td><span id="error_span" class="error"></span></td>                 </tr>             </table>         </td>     </tr> </table></form>'), 
new UI.Dialog({
title: gLang.pref.lock.please_input_pwd,
button: 'OK_CANCEL',
body: bodyHTML,
action: function(form, dialog) {
var client = new CMXClient;
return client.resultListener = function(result) {
return '' == $$('password').value || null == $$('password').value ? ($$('error_span').innerHTML = gLang.pref.lock.pwd_empty, 
!0) : ('FA_INVALID_PARAMETER' == result.code || 'FA_UNAUTHORIZED' == result.code) && ($$('error_span').innerHTML = gLang.pref.lock.pwd_err, 
!0);
}, client.simpleCall('user:authenticate2', {
password: $$('password').value
}, (function() {
cancelDialog && dialog.cancel(), reloadNav(), $win().hasAuth2Unlocked = !0, passFunc(form, dialog);
})), !1;
}
}), CC.showLoginForgotPass && ($$('resetauth2pwd_ln').onclick = clickLink);
}
//# sourceMappingURL=auth2Lock.js.map