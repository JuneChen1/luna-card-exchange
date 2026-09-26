const i18n = (function () {
  const STORAGE_KEY = 'luna_lang';
  const DEFAULT_LANG = 'zh';

  const STRINGS = {
    zh: {
      'nav.login': '登入',
      'nav.register': '註冊',
      'nav.myPage': '個人頁面',
      'nav.editProfile': '編輯個人資料',
      'nav.adminZone': '管理者專區',
      'nav.logout': '登出',

      'footer.contact': '聯絡我們：',

      'title.login': '登入 - 月諭聖牌交換站',
      'title.register': '註冊 - 月諭聖牌交換站',
      'title.dashboard': '個人頁面 - 月諭聖牌交換站',
      'title.profile': '編輯個人資料 - 月諭聖牌交換站',
      'title.changePassword': '修改密碼 - 月諭聖牌交換站',
      'title.forgotPassword': '忘記密碼 - 月諭聖牌交換站',
      'title.resetPassword': '重設密碼 - 月諭聖牌交換站',

      'common.username': '帳號',
      'common.usernameCaseSensitiveHint': '※ 帳號區分大小寫（例如：UserA 與 usera 視為不同帳號）',
      'common.password': '密碼',
      'common.passwordRule': '密碼至少需要 8 碼，且需同時包含英文字母與數字',
      'common.newPasswordMismatch': '兩次輸入的新密碼不一致',
      'common.requestFailed': '請求失敗',
      'common.networkError': '網路連線失敗，請稍後再試',
      'common.loginHint': '登入後即可管理你的月諭聖牌多餘 / 缺少狀態',

      'login.title': '登入',
      'login.forgotPassword': '忘記密碼？',
      'login.noAccountPrefix': '還沒有帳號嗎？',
      'login.goRegister': '前往註冊',
      'login.enterBoth': '請輸入帳號與密碼',
      'login.registeredSuccess': '註冊成功，請登入',

      'register.title': '註冊',
      'register.confirmPassword': '確認密碼',
      'register.hasAccountPrefix': '已經有帳號了嗎？',
      'register.goLogin': '前往登入',
      'register.enterUsername': '請輸入帳號',
      'register.usernameTooLong': '帳號長度不可超過 50 個字元',
      'register.usernameFormatInvalid': '帳號只能包含英文字母、數字與底線（_）',
      'register.mismatch': '兩次輸入的密碼不一致',

      'profile.title': '編輯個人資料',
      'profile.emailHint': '(選填，用於重設密碼)',
      'profile.contactLabel': '聯絡方式',
      'profile.contactHint': '(選填，填寫後會於首頁卡牌比對結果中公開顯示)',
      'profile.save': '儲存資料',
      'profile.changePasswordLink': '修改密碼',
      'profile.emailInvalid': 'Email 格式錯誤',
      'profile.updateSuccess': '個人資料已更新',
      'profile.dangerZoneTitle': '危險區域',
      'profile.dangerZoneWarning': '刪除帳號後，你的所有卡片持有紀錄將被永久刪除，此動作無法復原。',
      'profile.deleteAccountBtn': '刪除帳號',
      'profile.deleteAccountModalTitle': '刪除帳號',
      'profile.deleteAccountPasswordLabel': '請輸入密碼以確認',
      'profile.deleteAccountConfirm': '確認刪除',
      'profile.deleteAccountCancel': '取消',
      'profile.deleteAccountConfirmDialog': '確定要刪除帳號嗎？此動作無法復原，所有卡片持有紀錄都會被永久刪除。',
      'profile.deleteAccountEnterPassword': '請輸入密碼',
      'profile.deleteAccountSuccess': '帳號已刪除，即將跳轉至首頁...',

      'changePassword.title': '修改密碼',
      'changePassword.oldPassword': '舊密碼',
      'changePassword.newPassword': '新密碼',
      'changePassword.confirmNewPassword': '確認新密碼',
      'changePassword.submit': '更新密碼',
      'changePassword.backToProfile': '返回',
      'changePassword.updateSuccess': '密碼更新成功',

      'forgotPassword.title': '忘記密碼',
      'forgotPassword.desc': '請輸入您在「個人資料」中設定的 Email，我們會寄送重設密碼的連結給您',
      'forgotPassword.submit': '寄送重設密碼信',
      'forgotPassword.backToLogin': '返回登入',
      'forgotPassword.enterEmail': '請輸入 Email',

      'resetPassword.title': '重設密碼',
      'resetPassword.submit': '重設密碼',
      'resetPassword.invalidLink': '重設連結無效，請重新申請忘記密碼',
      'resetPassword.resetSuccess': '密碼重設成功，請重新登入',

      'index.findExchange': '尋找交換對象',
      'index.wantedLabel': '我想要的牌',
      'index.offeredLabel': '我多出的牌',
      'index.serverLabel': '伺服器',
      'index.serverAny': '不限',
      'index.search': '搜尋',
      'index.addUidLabel': '新增原神 UID',
      'index.uidPlaceholder': '輸入原神 UID',
      'index.addUidBtn': '新增',
      'index.addUidHint': '新增後即可設定該 UID 的聖牌多餘 / 缺少狀態',
      'index.supportedServersPrefix': '支援的伺服器：',
      'index.back': '返回',
      'index.cardStatusTitle': '聖牌狀態',
      'index.parenOpen': '（',
      'index.parenClose': '）',
      'index.deleteUid': '刪除此 UID',
      'index.saveChanges': '儲存變更',
      'index.unsavedUidNotice': '這個 UID 尚未儲存，請至少將一張卡片設為「多餘」或「缺少」並點擊「儲存變更」，否則離開後這個 UID 不會被建立',
      'index.deleteBtn': '刪除',
      'index.badgeOffered': '多餘',
      'index.badgeWanted': '缺少',
      'index.statusNone': '未設定',
      'index.shareBtn': '產生分享文字',
      'index.privateBadge': '不公開',
      'index.publicSwitch': '公開',
      'index.madePrivateSuccess': '已設為不公開，UID：{uid} 不會出現在交換市集',
      'index.madePublicSuccess': '已設為公開，UID：{uid} 會出現在交換市集',
      'index.shareModalTitle': '分享文字',
      'index.shareCopyBtn': '複製文字',
      'index.shareCopied': '已複製到剪貼簿',
      'index.shareCopyFailed': '複製失敗，請手動選取複製',
      'index.shareOfferedLine': '多餘：{list}',
      'index.shareWantedLine': '缺少：{list}',
      'index.shareListSeparator': '、',
      'index.enterUid': '請輸入原神 UID',
      'index.uidFormatError': '原神 UID 格式錯誤',
      'index.quickMatchBtn': '帶入資料',
      'index.quickMatchApplied': '已代入 UID {uid} 的資料，請按下方搜尋查看結果',
      'index.quickMatchChooseUid': '請選擇要帶入的 UID 資料',
      'index.quickMatchNoUid': '你還沒有登記任何原神 UID，請先至個人頁面新增',
      'index.deletedSuccess': '已刪除',
      'index.saveSuccess': '儲存成功',
      'index.noResults': '目前沒有符合的交換對象',
      'index.noDataYet': '目前還沒有人登記換牌喔！\n這個網站剛誕生，歡迎直接送出你的多餘/缺牌需求，一起把這個平台養大！',
      'index.none': '無',
      'index.noUidsYet': '你還沒有新增任何原神 UID，請在下方新增你的第一個 UID',
      'index.uidLabel': 'UID：',
      'index.contactPrefix': '聯絡方式：',
      'index.contactHidden': '未公開',
      'index.confirmDeleteUid': '確定要刪除 UID {uid} 的所有卡牌資料嗎？此動作無法復原',
      'index.confirmDiscardChanges': '你有尚未儲存的變更。確定要離開嗎？離開後這些變更將會遺失。',

      'title.admin': '管理者專區 - 月諭聖牌交換站',
      'admin.title': '管理者專區',
      'admin.keywordPlaceholder': '搜尋帳號名稱',
      'admin.statusAll': '全部狀態',
      'admin.statusActive': '正常',
      'admin.statusBanned': '已停權',
      'admin.search': '搜尋',
      'admin.colName': '帳號',
      'admin.colEmail': 'Email',
      'admin.colContact': '聯絡方式',
      'admin.colRole': '角色',
      'admin.colStatus': '狀態',
      'admin.colAction': '操作',
      'admin.ban': '停權',
      'admin.unban': '解封',
      'admin.promote': '升級為管理者',
      'admin.confirmBan': '確定要停權帳號「{name}」嗎？',
      'admin.confirmUnban': '確定要解封帳號「{name}」嗎？',
      'admin.confirmPromote': '確定要將「{name}」升級為管理者嗎？',
      'admin.banSuccess': '已停權「{name}」',
      'admin.unbanSuccess': '已解封「{name}」',
      'admin.promoteSuccess': '已將「{name}」升級為管理者',
      'admin.deleteUidData': '刪除此筆資料',
      'admin.confirmDeleteUidData': '確定要刪除「{name}」名下 UID {uid} 的所有卡牌資料嗎？此動作無法復原',
      'admin.deleteUidDataSuccess': '已刪除 UID {uid} 的卡牌資料',
      'admin.noResults': '沒有符合的使用者',
      'admin.prevPage': '上一頁',
      'admin.nextPage': '下一頁',
      'admin.pageInfo': '第 {page} / {totalPages} 頁（共 {total} 筆）',
      'admin.forbidden': '您沒有權限進入管理者專區'
    },
    en: {
      'nav.login': 'Log In',
      'nav.register': 'Register',
      'nav.myPage': 'Profile',
      'nav.editProfile': 'Edit Profile',
      'nav.adminZone': 'Admin Zone',
      'nav.logout': 'Log Out',

      'footer.contact': 'Contact us: ',

      'title.login': 'Login - Luna Card Exchange',
      'title.register': 'Register - Luna Card Exchange',
      'title.dashboard': 'My Page - Luna Card Exchange',
      'title.profile': 'Edit Profile - Luna Card Exchange',
      'title.changePassword': 'Change Password - Luna Card Exchange',
      'title.forgotPassword': 'Forgot Password - Luna Card Exchange',
      'title.resetPassword': 'Reset Password - Luna Card Exchange',

      'common.username': 'Username',
      'common.usernameCaseSensitiveHint': '※ Usernames are case-sensitive (e.g., "UserA" and "usera" are different)',
      'common.password': 'Password',
      'common.passwordRule': 'Password must be at least 8 characters long and contain both letters and numbers',
      'common.newPasswordMismatch': 'The new passwords do not match',
      'common.requestFailed': 'Request failed',
      'common.networkError': 'Network error, please try again later',
      'common.loginHint': 'Log in to manage your surplus / wanted Luna cards',

      'login.title': 'Log In',
      'login.forgotPassword': 'Forgot password?',
      'login.noAccountPrefix': "Don't have an account?",
      'login.goRegister': 'Register now',
      'login.enterBoth': 'Please enter your username and password',
      'login.registeredSuccess': 'Registration successful, please log in',

      'register.title': 'Register',
      'register.confirmPassword': 'Confirm Password',
      'register.hasAccountPrefix': 'Already have an account?',
      'register.goLogin': 'Log in',
      'register.enterUsername': 'Please enter a username',
      'register.usernameTooLong': 'Username must be 50 characters or fewer',
      'register.usernameFormatInvalid': 'Username can only contain letters, numbers, and underscores (_)',
      'register.mismatch': 'The passwords do not match',

      'profile.title': 'Edit Profile',
      'profile.emailHint': '(Optional, used for password reset)',
      'profile.contactLabel': 'Contact Info',
      'profile.contactHint': '(Optional, shown publicly in search results if provided)',
      'profile.save': 'Save',
      'profile.changePasswordLink': 'Change Password',
      'profile.emailInvalid': 'Invalid email format',
      'profile.updateSuccess': 'Profile updated',
      'profile.dangerZoneTitle': 'Danger Zone',
      'profile.dangerZoneWarning': 'Deleting your account will permanently remove all your card records. This cannot be undone.',
      'profile.deleteAccountBtn': 'Delete Account',
      'profile.deleteAccountModalTitle': 'Delete Account',
      'profile.deleteAccountPasswordLabel': 'Enter your password to confirm',
      'profile.deleteAccountConfirm': 'Confirm Delete',
      'profile.deleteAccountCancel': 'Cancel',
      'profile.deleteAccountConfirmDialog': 'Are you sure you want to delete your account? This cannot be undone and all your card records will be permanently removed.',
      'profile.deleteAccountEnterPassword': 'Enter your password',
      'profile.deleteAccountSuccess': 'Account deleted. Redirecting to home...',

      'changePassword.title': 'Change Password',
      'changePassword.oldPassword': 'Old Password',
      'changePassword.newPassword': 'New Password',
      'changePassword.confirmNewPassword': 'Confirm New Password',
      'changePassword.submit': 'Update Password',
      'changePassword.backToProfile': 'Back',
      'changePassword.updateSuccess': 'Password updated successfully',

      'forgotPassword.title': 'Forgot Password',
      'forgotPassword.desc': "Enter the email you set in \"Edit Profile\" and we'll send you a password reset link.",
      'forgotPassword.submit': 'Send Reset Email',
      'forgotPassword.backToLogin': 'Back to Login',
      'forgotPassword.enterEmail': 'Please enter your email',

      'resetPassword.title': 'Reset Password',
      'resetPassword.submit': 'Reset Password',
      'resetPassword.invalidLink': 'This reset link is invalid, please request a new one',
      'resetPassword.resetSuccess': 'Password reset successfully, please log in again',

      'index.findExchange': 'Find Exchange Matches',
      'index.wantedLabel': 'Cards Wanted',
      'index.offeredLabel': 'Cards Offered',
      'index.serverLabel': 'Server',
      'index.serverAny': 'Any',
      'index.search': 'Search',
      'index.addUidLabel': 'Add Genshin UID',
      'index.uidPlaceholder': 'Enter your Genshin UID',
      'index.addUidBtn': 'Add',
      'index.addUidHint': "Once added, you can set that UID's card surplus / wanted status",
      'index.supportedServersPrefix': 'Supported servers: ',
      'index.back': 'Back',
      'index.cardStatusTitle': 'Card Status',
      'index.parenOpen': ' (',
      'index.parenClose': ')',
      'index.deleteUid': 'Delete this UID',
      'index.saveChanges': 'Save Changes',
      'index.unsavedUidNotice': 'This UID has not been saved yet. Set at least one card to "Extra" or "Wanted" and click "Save Changes", or this UID will not be created if you leave without saving.',
      'index.deleteBtn': 'Delete',
      'index.badgeOffered': 'Extra',
      'index.badgeWanted': 'Wanted',
      'index.statusNone': 'Not Set',
      'index.shareBtn': 'Generate Share Text',
      'index.privateBadge': 'Private',
      'index.publicSwitch': 'Public',
      'index.madePrivateSuccess': 'Set to private. UID: {uid} will now be hidden from the exchange market.',
      'index.madePublicSuccess': 'Set to public. UID: {uid} will now appear in the exchange market.',
      'index.shareModalTitle': 'Share Text',
      'index.shareCopyBtn': 'Copy',
      'index.shareCopied': 'Copied to clipboard',
      'index.shareCopyFailed': 'Copy failed. Please select and copy manually.',
      'index.shareOfferedLine': 'Offering: {list}',
      'index.shareWantedLine': 'Wanted: {list}',
      'index.shareListSeparator': ', ',
      'index.enterUid': 'Please enter a Genshin UID',
      'index.uidFormatError': 'Invalid Genshin UID format',
      'index.quickMatchBtn': 'Auto-fill',
      'index.quickMatchApplied': 'Filled in data from UID {uid} — click search below to see results',
      'index.quickMatchChooseUid': 'Choose which UID to fill in',
      'index.quickMatchNoUid': "You haven't registered any Genshin UID yet — add one on your personal page first",
      'index.deletedSuccess': 'Deleted',
      'index.saveSuccess': 'Saved successfully',
      'index.noResults': 'No matching exchange partners found',
      'index.noDataYet': "No one has listed any cards for exchange yet!\nThis site just launched — feel free to submit your extra/needed cards and help build the community!",
      'index.none': 'None',
      'index.noUidsYet': "You haven't added any Genshin UID yet — add your first one below",
      'index.uidLabel': 'UID: ',
      'index.contactPrefix': 'Contact: ',
      'index.contactHidden': 'Not public',
      'index.confirmDeleteUid': 'Are you sure you want to delete all card data for UID {uid}? This action cannot be undone.',
      'index.confirmDiscardChanges': 'You have unsaved changes. Are you sure you want to leave? These changes will be lost.',

      'title.admin': 'Admin Zone - Luna Card Exchange',
      'admin.title': 'Admin Zone',
      'admin.keywordPlaceholder': 'Search by username',
      'admin.statusAll': 'All statuses',
      'admin.statusActive': 'Active',
      'admin.statusBanned': 'Banned',
      'admin.search': 'Search',
      'admin.colName': 'Username',
      'admin.colEmail': 'Email',
      'admin.colContact': 'Contact Info',
      'admin.colRole': 'Role',
      'admin.colStatus': 'Status',
      'admin.colAction': 'Action',
      'admin.ban': 'Ban',
      'admin.unban': 'Unban',
      'admin.promote': 'Promote to Admin',
      'admin.confirmBan': 'Ban account "{name}"?',
      'admin.confirmUnban': 'Unban account "{name}"?',
      'admin.confirmPromote': 'Promote "{name}" to admin?',
      'admin.banSuccess': '"{name}" has been banned',
      'admin.unbanSuccess': '"{name}" has been unbanned',
      'admin.promoteSuccess': '"{name}" has been promoted to admin',
      'admin.deleteUidData': 'Delete This Entry',
      'admin.confirmDeleteUidData': 'Delete all card data for UID {uid} under "{name}"? This action cannot be undone.',
      'admin.deleteUidDataSuccess': 'Card data for UID {uid} has been deleted',
      'admin.noResults': 'No matching users found',
      'admin.prevPage': 'Previous',
      'admin.nextPage': 'Next',
      'admin.pageInfo': 'Page {page} / {totalPages} ({total} total)',
      'admin.forbidden': 'You do not have permission to access the admin zone'
    },
    ja: {
      'nav.login': 'ログイン',
      'nav.register': '新規登録',
      'nav.myPage': 'マイページ',
      'nav.editProfile': 'プロフィール編集',
      'nav.adminZone': '管理者専用エリア',
      'nav.logout': 'ログアウト',

      'footer.contact': 'お問い合わせ：',

      'title.login': 'ログイン - 月諭のアルカナ交換所',
      'title.register': '新規登録 - 月諭のアルカナ交換所',
      'title.dashboard': 'マイページ - 月諭のアルカナ交換所',
      'title.profile': 'プロフィール編集 - 月諭のアルカナ交換所',
      'title.changePassword': 'パスワード変更 - 月諭のアルカナ交換所',
      'title.forgotPassword': 'パスワードをお忘れの方 - 月諭のアルカナ交換所',
      'title.resetPassword': 'パスワード再設定 - 月諭のアルカナ交換所',

      'common.username': 'ユーザー名',
      'common.usernameCaseSensitiveHint': '※ ユーザー名は大文字と小文字を区別します（例：「UserA」と「usera」は異なるユーザー名として扱われます）',
      'common.password': 'パスワード',
      'common.passwordRule': 'パスワードは8文字以上で、英字と数字の両方を含める必要があります',
      'common.newPasswordMismatch': '新しいパスワードが一致しません',
      'common.requestFailed': 'リクエストに失敗しました',
      'common.networkError': 'ネットワークエラーが発生しました。しばらくしてから再試行してください',
      'common.loginHint': 'ログインすると、月諭のアルカナの余剰・不足状況を管理できます',

      'login.title': 'ログイン',
      'login.forgotPassword': 'パスワードをお忘れですか？',
      'login.noAccountPrefix': 'アカウントをお持ちでない方は',
      'login.goRegister': 'こちらから新規登録',
      'login.enterBoth': 'ユーザー名とパスワードを入力してください',
      'login.registeredSuccess': '登録が完了しました。ログインしてください',

      'register.title': '新規登録',
      'register.confirmPassword': 'パスワード（確認）',
      'register.hasAccountPrefix': 'すでにアカウントをお持ちの方は',
      'register.goLogin': 'こちらからログイン',
      'register.enterUsername': 'ユーザー名を入力してください',
      'register.usernameTooLong': 'ユーザー名は50文字以内で入力してください',
      'register.usernameFormatInvalid': 'ユーザー名は半角英数字とアンダースコア（_）のみ使用できます',
      'register.mismatch': 'パスワードが一致しません',

      'profile.title': 'プロフィール編集',
      'profile.emailHint': '（任意、パスワード再設定に使用します）',
      'profile.contactLabel': '連絡先',
      'profile.contactHint': '（任意。入力するとトップページの検索結果に公開されます）',
      'profile.save': '保存',
      'profile.changePasswordLink': 'パスワード変更',
      'profile.emailInvalid': 'メールアドレスの形式が正しくありません',
      'profile.updateSuccess': 'プロフィールを更新しました',
      'profile.dangerZoneTitle': '危険ゾーン',
      'profile.dangerZoneWarning': 'アカウントを削除すると、すべてのカード保有記録が完全に削除されます。この操作は元に戻せません。',
      'profile.deleteAccountBtn': 'アカウントを削除',
      'profile.deleteAccountModalTitle': 'アカウントを削除',
      'profile.deleteAccountPasswordLabel': '確認のためパスワードを入力してください',
      'profile.deleteAccountConfirm': '削除を確認',
      'profile.deleteAccountCancel': 'キャンセル',
      'profile.deleteAccountConfirmDialog': '本当にアカウントを削除しますか？この操作は元に戻せず、すべてのカード保有記録が完全に削除されます。',
      'profile.deleteAccountEnterPassword': 'パスワードを入力してください',
      'profile.deleteAccountSuccess': 'アカウントを削除しました。トップページへ移動します...',

      'changePassword.title': 'パスワード変更',
      'changePassword.oldPassword': '現在のパスワード',
      'changePassword.newPassword': '新しいパスワード',
      'changePassword.confirmNewPassword': '新しいパスワード（確認）',
      'changePassword.submit': 'パスワードを更新',
      'changePassword.backToProfile': '戻る',
      'changePassword.updateSuccess': 'パスワードを更新しました',

      'forgotPassword.title': 'パスワードをお忘れの方',
      'forgotPassword.desc': '「プロフィール編集」で設定したメールアドレスを入力してください。パスワード再設定用のリンクをお送りします。',
      'forgotPassword.submit': '再設定メールを送信',
      'forgotPassword.backToLogin': 'ログインに戻る',
      'forgotPassword.enterEmail': 'メールアドレスを入力してください',

      'resetPassword.title': 'パスワード再設定',
      'resetPassword.submit': 'パスワードを再設定',
      'resetPassword.invalidLink': '再設定リンクが無効です。もう一度パスワード再設定の手続きを行ってください',
      'resetPassword.resetSuccess': 'パスワードを再設定しました。再度ログインしてください',

      'index.findExchange': '交換相手を探す',
      'index.wantedLabel': '欲しいカード',
      'index.offeredLabel': '余っているカード',
      'index.serverLabel': 'サーバー',
      'index.serverAny': '指定なし',
      'index.search': '検索',
      'index.addUidLabel': '原神UIDを追加',
      'index.uidPlaceholder': '原神UIDを入力',
      'index.addUidBtn': '追加',
      'index.addUidHint': '追加すると、そのUIDのアルカナの余剰・不足状況を設定できます',
      'index.supportedServersPrefix': '対応サーバー：',
      'index.back': '戻る',
      'index.cardStatusTitle': 'アルカナの状況',
      'index.parenOpen': '（',
      'index.parenClose': '）',
      'index.deleteUid': 'このUIDを削除',
      'index.saveChanges': '変更を保存',
      'index.unsavedUidNotice': 'このUIDはまだ保存されていません。少なくとも1枚のカードを「譲」または「求」に設定して「変更を保存」を押してください。保存せずに離れるとこのUIDは作成されません。',
      'index.deleteBtn': '削除',
      'index.badgeOffered': '譲',
      'index.badgeWanted': '求',
      'index.statusNone': '未設定',
      'index.shareBtn': 'シェア文を作成',
      'index.privateBadge': '非公開',
      'index.publicSwitch': '公開',
      'index.madePrivateSuccess': '非公開に設定しました。UID：{uid} は交換マーケットに表示されません',
      'index.madePublicSuccess': '公開に設定しました。UID：{uid} は交換マーケットに表示されます',
      'index.shareModalTitle': 'シェア文',
      'index.shareCopyBtn': 'テキストをコピー',
      'index.shareCopied': 'クリップボードにコピーしました',
      'index.shareCopyFailed': 'コピーに失敗しました。手動で選択してコピーしてください',
      'index.shareOfferedLine': '譲れるもの：{list}',
      'index.shareWantedLine': '求めるもの：{list}',
      'index.shareListSeparator': '、',
      'index.enterUid': '原神UIDを入力してください',
      'index.uidFormatError': '原神UIDの形式が正しくありません',
      'index.quickMatchBtn': 'データを反映',
      'index.quickMatchApplied': 'UID {uid} のデータを反映しました。下の検索ボタンで結果を確認してください',
      'index.quickMatchChooseUid': '反映するUIDを選択',
      'index.quickMatchNoUid': 'まだ原神UIDが登録されていません。マイページから追加してください',
      'index.deletedSuccess': '削除しました',
      'index.saveSuccess': '保存しました',
      'index.noResults': '該当する交換相手が見つかりません',
      'index.noDataYet': 'まだ誰もカード交換の登録をしていません！\n開設したばかりのサイトですが、ぜひ余っているカードや欲しいカードを登録して、一緒にこのプラットフォームを育てていきましょう！',
      'index.none': 'なし',
      'index.noUidsYet': 'まだ原神UIDが登録されていません。下記から最初のUIDを追加してください',
      'index.uidLabel': 'UID：',
      'index.contactPrefix': '連絡先：',
      'index.contactHidden': '非公開',
      'index.confirmDeleteUid': 'UID {uid} のカードデータをすべて削除してもよろしいですか？この操作は取り消せません',
      'index.confirmDiscardChanges': '保存されていない変更があります。このページを離れますか？変更内容は失われます。',

      'title.admin': '管理者専用エリア - 月諭のアルカナ交換所',
      'admin.title': '管理者専用エリア',
      'admin.keywordPlaceholder': 'ユーザー名で検索',
      'admin.statusAll': 'すべての状態',
      'admin.statusActive': '有効',
      'admin.statusBanned': '停止中',
      'admin.search': '検索',
      'admin.colName': 'ユーザー名',
      'admin.colEmail': 'メールアドレス',
      'admin.colContact': '連絡先',
      'admin.colRole': '権限',
      'admin.colStatus': 'ステータス',
      'admin.colAction': '操作',
      'admin.ban': '利用停止',
      'admin.unban': '利用停止解除',
      'admin.promote': '管理者に昇格',
      'admin.confirmBan': 'アカウント「{name}」を利用停止にしますか？',
      'admin.confirmUnban': 'アカウント「{name}」の利用停止を解除しますか？',
      'admin.confirmPromote': '「{name}」を管理者に昇格させますか？',
      'admin.banSuccess': '「{name}」を利用停止にしました',
      'admin.unbanSuccess': '「{name}」の利用停止を解除しました',
      'admin.promoteSuccess': '「{name}」を管理者に昇格させました',
      'admin.deleteUidData': 'このデータを削除',
      'admin.confirmDeleteUidData': '「{name}」のUID {uid} のカードデータをすべて削除してもよろしいですか？この操作は取り消せません',
      'admin.deleteUidDataSuccess': 'UID {uid} のカードデータを削除しました',
      'admin.noResults': '該当するユーザーが見つかりません',
      'admin.prevPage': '前へ',
      'admin.nextPage': '次へ',
      'admin.pageInfo': '{page} / {totalPages} ページ（全 {total} 件）',
      'admin.forbidden': '管理者専用エリアへのアクセス権限がありません'
    },
    ko: {
      'nav.login': '로그인',
      'nav.register': '회원가입',
      'nav.myPage': '마이페이지',
      'nav.editProfile': '프로필 수정',
      'nav.adminZone': '관리자 전용 구역',
      'nav.logout': '로그아웃',

      'footer.contact': '문의하기: ',

      'title.login': '로그인 - 달 계시 카드 교환소',
      'title.register': '회원가입 - 달 계시 카드 교환소',
      'title.dashboard': '마이페이지 - 달 계시 카드 교환소',
      'title.profile': '프로필 수정 - 달 계시 카드 교환소',
      'title.changePassword': '비밀번호 변경 - 달 계시 카드 교환소',
      'title.forgotPassword': '비밀번호 찾기 - 달 계시 카드 교환소',
      'title.resetPassword': '비밀번호 재설정 - 달 계시 카드 교환소',

      'common.username': '아이디',
      'common.usernameCaseSensitiveHint': '※ 아이디는 대소문자를 구분합니다 (예: "UserA"와 "usera"는 다른 아이디로 처리됩니다)',
      'common.password': '비밀번호',
      'common.passwordRule': '비밀번호는 8자 이상이며 영문과 숫자를 모두 포함해야 합니다',
      'common.newPasswordMismatch': '새 비밀번호가 일치하지 않습니다',
      'common.requestFailed': '요청에 실패했습니다',
      'common.networkError': '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
      'common.loginHint': '로그인하면 달 계시 카드의 여유/부족 상태를 관리할 수 있습니다',

      'login.title': '로그인',
      'login.forgotPassword': '비밀번호를 잊으셨나요?',
      'login.noAccountPrefix': '계정이 없으신가요? ',
      'login.goRegister': '회원가입 하기',
      'login.enterBoth': '아이디와 비밀번호를 입력해주세요',
      'login.registeredSuccess': '회원가입이 완료되었습니다. 로그인해주세요',

      'register.title': '회원가입',
      'register.confirmPassword': '비밀번호 확인',
      'register.hasAccountPrefix': '이미 계정이 있으신가요? ',
      'register.goLogin': '로그인 하기',
      'register.enterUsername': '아이디를 입력해주세요',
      'register.usernameTooLong': '아이디는 50자를 초과할 수 없습니다',
      'register.usernameFormatInvalid': '아이디는 영문, 숫자, 밑줄(_)만 사용할 수 있습니다',
      'register.mismatch': '비밀번호가 일치하지 않습니다',

      'profile.title': '프로필 수정',
      'profile.emailHint': '(선택 사항, 비밀번호 재설정에 사용됩니다)',
      'profile.contactLabel': '연락처',
      'profile.contactHint': '(선택 사항, 입력하면 검색 결과에 공개됩니다)',
      'profile.save': '저장',
      'profile.changePasswordLink': '비밀번호 변경',
      'profile.emailInvalid': '이메일 형식이 올바르지 않습니다',
      'profile.updateSuccess': '프로필이 업데이트되었습니다',
      'profile.dangerZoneTitle': '위험 구역',
      'profile.dangerZoneWarning': '계정을 삭제하면 모든 카드 보유 기록이 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.',
      'profile.deleteAccountBtn': '계정 삭제',
      'profile.deleteAccountModalTitle': '계정 삭제',
      'profile.deleteAccountPasswordLabel': '확인을 위해 비밀번호를 입력하세요',
      'profile.deleteAccountConfirm': '삭제 확인',
      'profile.deleteAccountCancel': '취소',
      'profile.deleteAccountConfirmDialog': '정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며 모든 카드 보유 기록이 영구적으로 삭제됩니다.',
      'profile.deleteAccountEnterPassword': '비밀번호를 입력해주세요',
      'profile.deleteAccountSuccess': '계정이 삭제되었습니다. 잠시 후 홈으로 이동합니다...',

      'changePassword.title': '비밀번호 변경',
      'changePassword.oldPassword': '현재 비밀번호',
      'changePassword.newPassword': '새 비밀번호',
      'changePassword.confirmNewPassword': '새 비밀번호 확인',
      'changePassword.submit': '비밀번호 업데이트',
      'changePassword.backToProfile': '뒤로',
      'changePassword.updateSuccess': '비밀번호가 업데이트되었습니다',

      'forgotPassword.title': '비밀번호 찾기',
      'forgotPassword.desc': '"프로필 수정"에서 설정한 이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다.',
      'forgotPassword.submit': '재설정 메일 보내기',
      'forgotPassword.backToLogin': '로그인으로 돌아가기',
      'forgotPassword.enterEmail': '이메일을 입력해주세요',

      'resetPassword.title': '비밀번호 재설정',
      'resetPassword.submit': '비밀번호 재설정',
      'resetPassword.invalidLink': '재설정 링크가 유효하지 않습니다. 비밀번호 재설정 절차를 다시 진행해주세요',
      'resetPassword.resetSuccess': '비밀번호가 재설정되었습니다. 다시 로그인해주세요',

      'index.findExchange': '교환 상대 찾기',
      'index.wantedLabel': '구하는 카드',
      'index.offeredLabel': '양도 카드',
      'index.serverLabel': '서버',
      'index.serverAny': '전체',
      'index.search': '검색',
      'index.addUidLabel': '원신 UID 추가',
      'index.uidPlaceholder': '원신 UID 입력',
      'index.addUidBtn': '추가',
      'index.addUidHint': '추가하면 해당 UID의 카드 여유/부족 상태를 설정할 수 있습니다',
      'index.supportedServersPrefix': '지원 서버: ',
      'index.back': '뒤로',
      'index.cardStatusTitle': '카드 현황',
      'index.parenOpen': ' (',
      'index.parenClose': ')',
      'index.deleteUid': '이 UID 삭제',
      'index.saveChanges': '변경사항 저장',
      'index.unsavedUidNotice': '이 UID는 아직 저장되지 않았습니다. 카드를 최소 1장 "양도" 또는 "구함"으로 설정하고 "변경사항 저장"을 눌러주세요. 저장하지 않고 나가면 이 UID는 생성되지 않습니다.',
      'index.deleteBtn': '삭제',
      'index.badgeOffered': '양도',
      'index.badgeWanted': '구함',
      'index.statusNone': '미설정',
      'index.shareBtn': '공유 텍스트 생성',
      'index.privateBadge': '비공개',
      'index.publicSwitch': '공개',
      'index.madePrivateSuccess': '비공개로 설정되었습니다. UID {uid}의 카드는 교환 마켓에 표시되지 않습니다',
      'index.madePublicSuccess': '공개로 설정되었습니다. UID {uid}의 카드는 교환 마켓에 표시됩니다',
      'index.shareModalTitle': '공유 텍스트',
      'index.shareCopyBtn': '텍스트 복사',
      'index.shareCopied': '클립보드에 복사되었습니다',
      'index.shareCopyFailed': '복사에 실패했습니다. 직접 선택하여 복사해주세요',
      'index.shareOfferedLine': '양도: {list}',
      'index.shareWantedLine': '구함: {list}',
      'index.shareListSeparator': ', ',
      'index.enterUid': '원신 UID를 입력해주세요',
      'index.uidFormatError': '원신 UID 형식이 올바르지 않습니다',
      'index.quickMatchBtn': '데이터 가져오기',
      'index.quickMatchApplied': 'UID {uid}의 데이터를 가져왔습니다. 아래 검색 버튼을 눌러 결과를 확인하세요',
      'index.quickMatchChooseUid': '가져올 UID 선택',
      'index.quickMatchNoUid': '아직 등록된 원신 UID가 없습니다. 마이페이지에서 먼저 추가해주세요',
      'index.deletedSuccess': '삭제되었습니다',
      'index.saveSuccess': '저장되었습니다',
      'index.noResults': '조건에 맞는 교환 상대가 없습니다',
      'index.noDataYet': '아직 카드 교환을 등록한 사람이 없어요!\n막 오픈한 사이트라, 남는 카드나 필요한 카드를 등록해서 함께 이 플랫폼을 키워가요!',
      'index.none': '없음',
      'index.noUidsYet': '아직 등록된 원신 UID가 없습니다. 아래에서 첫 번째 UID를 추가해 보세요',
      'index.uidLabel': 'UID: ',
      'index.contactPrefix': '연락처: ',
      'index.contactHidden': '비공개',
      'index.confirmDeleteUid': 'UID {uid}의 모든 카드 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다',
      'index.confirmDiscardChanges': '저장되지 않은 변경 사항이 있습니다. 나가시겠습니까? 변경 사항이 사라집니다.',

      'title.admin': '관리자 전용 구역 - 달 계시 카드 교환소',
      'admin.title': '관리자 전용 구역',
      'admin.keywordPlaceholder': '아이디로 검색',
      'admin.statusAll': '전체 상태',
      'admin.statusActive': '정상',
      'admin.statusBanned': '정지됨',
      'admin.search': '검색',
      'admin.colName': '아이디',
      'admin.colEmail': '이메일',
      'admin.colContact': '연락처',
      'admin.colRole': '권한',
      'admin.colStatus': '상태',
      'admin.colAction': '작업',
      'admin.ban': '정지',
      'admin.unban': '정지 해제',
      'admin.promote': '관리자로 승격',
      'admin.confirmBan': '"{name}" 계정을 정지하시겠습니까?',
      'admin.confirmUnban': '"{name}" 계정의 정지를 해제하시겠습니까?',
      'admin.confirmPromote': '"{name}"님을 관리자로 승격하시겠습니까?',
      'admin.banSuccess': '"{name}" 계정을 정지했습니다',
      'admin.unbanSuccess': '"{name}" 계정의 정지를 해제했습니다',
      'admin.promoteSuccess': '"{name}"님을 관리자로 승격했습니다',
      'admin.deleteUidData': '항목 삭제',
      'admin.confirmDeleteUidData': '"{name}"의 UID {uid} 카드 데이터를 모두 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다',
      'admin.deleteUidDataSuccess': 'UID {uid}의 카드 데이터를 삭제했습니다',
      'admin.noResults': '일치하는 사용자가 없습니다',
      'admin.prevPage': '이전',
      'admin.nextPage': '다음',
      'admin.pageInfo': '{page} / {totalPages} 페이지 (전체 {total}건)',
      'admin.forbidden': '관리자 전용 구역에 접근할 권한이 없습니다'
    }
  };

  const LANGUAGES = [
    { code: 'zh', label: '繁體中文' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' }
  ];

  function isValidLang(code) {
    return LANGUAGES.some((l) => l.code === code);
  }

  const HTML_LANG_MAP = { zh: 'zh-Hant', en: 'en', ja: 'ja', ko: 'ko' };

  function htmlLangFor(lang) {
    return HTML_LANG_MAP[lang] || lang;
  }

  function detectBrowserLang() {
    const candidates = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language];

    for (const raw of candidates) {
      if (!raw) continue;
      const primary = raw.toLowerCase().split('-')[0];
      if (isValidLang(primary)) return primary;
    }

    return 'en';
  }

  function getLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isValidLang(stored) ? stored : detectBrowserLang();
  }

  function getLangLabel(code) {
    const found = LANGUAGES.find((l) => l.code === code);
    return found ? found.label : code;
  }

  function t(key, vars) {
    const lang = getLang();
    let str = STRINGS[lang][key] ?? STRINGS[DEFAULT_LANG][key] ?? key;

    if (vars) {
      Object.keys(vars).forEach((name) => {
        str = str.replace(new RegExp(`\\{${name}\\}`, 'g'), () => String(vars[name]));
      });
    }

    return str;
  }

  function applyI18n(root = document) {
    root.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
  }

  function closeAllLangDropdowns() {
    document.querySelectorAll('[data-lang-menu]').forEach((menu) => {
      menu.classList.remove('show');
      const toggle = menu.parentElement.querySelector('[data-lang-dropdown-toggle]');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }

  function renderLangDropdowns() {
    const lang = getLang();

    document.querySelectorAll('.lang-dropdown').forEach((wrapper) => {
      const toggle = wrapper.querySelector('[data-lang-dropdown-toggle]');
      const currentLabel = wrapper.querySelector('[data-lang-current-label]');
      const menu = wrapper.querySelector('[data-lang-menu]');

      if (currentLabel) currentLabel.textContent = getLangLabel(lang);

      if (menu) {
        menu.innerHTML = '';
        LANGUAGES.filter((item) => item.code !== lang).forEach((item) => {
          const li = document.createElement('li');
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'dropdown-item';
          btn.setAttribute('data-lang-option', item.code);
          btn.textContent = item.label;
          btn.addEventListener('click', () => {
            setLang(item.code);
            closeAllLangDropdowns();
          });
          li.appendChild(btn);
          menu.appendChild(li);
        });
      }

      if (toggle && !toggle.dataset.wired) {
        toggle.dataset.wired = 'true';
        toggle.addEventListener('click', (event) => {
          event.stopPropagation();
          const isOpen = menu.classList.contains('show');
          closeAllLangDropdowns();
          if (!isOpen) {
            menu.classList.add('show');
            toggle.setAttribute('aria-expanded', 'true');
          }
        });
      }
    });
  }

  function setLang(lang) {
    const normalized = isValidLang(lang) ? lang : DEFAULT_LANG;
    localStorage.setItem(STORAGE_KEY, normalized);
    document.documentElement.lang = htmlLangFor(normalized);
    applyI18n();
    renderLangDropdowns();
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: getLang() } }));
  }

  document.documentElement.lang = htmlLangFor(getLang());
  applyI18n();
  renderLangDropdowns();

  document.addEventListener('click', () => closeAllLangDropdowns());
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAllLangDropdowns();
  });

  return { getLang, setLang, t, applyI18n };
})();
