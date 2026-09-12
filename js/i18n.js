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
      'common.password': '密碼',
      'common.passwordRule': '密碼至少需要 8 碼，且需同時包含英文字母與數字',
      'common.newPasswordMismatch': '兩次輸入的新密碼不一致',
      'common.requestFailed': '請求失敗',
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
      'register.mismatch': '兩次輸入的密碼不一致',

      'profile.title': '編輯個人資料',
      'profile.emailHint': '(選填，用於找回密碼)',
      'profile.contactLabel': '聯絡方式',
      'profile.contactHint': '(選填，填寫後會於首頁卡牌比對結果中公開顯示)',
      'profile.save': '儲存資料',
      'profile.changePasswordLink': '修改密碼',
      'profile.emailInvalid': 'Email 格式錯誤',
      'profile.updateSuccess': '個人資料已更新',

      'changePassword.title': '修改密碼',
      'changePassword.oldPassword': '舊密碼',
      'changePassword.newPassword': '新密碼',
      'changePassword.confirmNewPassword': '確認新密碼',
      'changePassword.submit': '更新密碼',
      'changePassword.backToProfile': '返回',
      'changePassword.updateSuccess': '密碼更新成功',

      'forgotPassword.title': '忘記密碼',
      'forgotPassword.desc': '請輸入註冊時填寫的 Email，我們會寄送重設密碼的連結給你',
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
      'index.deleteBtn': '刪除',
      'index.badgeOffered': '多餘',
      'index.badgeWanted': '缺少',
      'index.statusNone': '未設定',
      'index.enterUid': '請輸入原神 UID',
      'index.deletedSuccess': '已刪除',
      'index.saveSuccess': '儲存成功',
      'index.noResults': '目前沒有符合的交換對象',
      'index.none': '無',
      'index.uidLabel': 'UID：',
      'index.contactPrefix': '聯絡方式：',
      'index.contactHidden': '未公開',
      'index.confirmDeleteUid': '確定要刪除 UID {uid} 的所有卡牌資料嗎？此動作無法復原',

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
      'admin.confirmBan': '確定要停權帳號「{name}」嗎？',
      'admin.confirmUnban': '確定要解封帳號「{name}」嗎？',
      'admin.banSuccess': '已停權「{name}」',
      'admin.unbanSuccess': '已解封「{name}」',
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
      'common.password': 'Password',
      'common.passwordRule': 'Password must be at least 8 characters long and contain both letters and numbers',
      'common.newPasswordMismatch': 'The new passwords do not match',
      'common.requestFailed': 'Request failed',
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
      'register.mismatch': 'The passwords do not match',

      'profile.title': 'Edit Profile',
      'profile.emailHint': '(Optional, used for password recovery)',
      'profile.contactLabel': 'Contact Info',
      'profile.contactHint': '(Optional, shown publicly in search results if provided)',
      'profile.save': 'Save',
      'profile.changePasswordLink': 'Change Password',
      'profile.emailInvalid': 'Invalid email format',
      'profile.updateSuccess': 'Profile updated',

      'changePassword.title': 'Change Password',
      'changePassword.oldPassword': 'Old Password',
      'changePassword.newPassword': 'New Password',
      'changePassword.confirmNewPassword': 'Confirm New Password',
      'changePassword.submit': 'Update Password',
      'changePassword.backToProfile': 'Back',
      'changePassword.updateSuccess': 'Password updated successfully',

      'forgotPassword.title': 'Forgot Password',
      'forgotPassword.desc': "Enter the email you registered with and we'll send you a password reset link",
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
      'index.deleteBtn': 'Delete',
      'index.badgeOffered': 'Extra',
      'index.badgeWanted': 'Wanted',
      'index.statusNone': 'Not Set',
      'index.enterUid': 'Please enter a Genshin UID',
      'index.deletedSuccess': 'Deleted',
      'index.saveSuccess': 'Saved successfully',
      'index.noResults': 'No matching exchange partners found',
      'index.none': 'None',
      'index.uidLabel': 'UID: ',
      'index.contactPrefix': 'Contact: ',
      'index.contactHidden': 'Not public',
      'index.confirmDeleteUid': 'Are you sure you want to delete all card data for UID {uid}? This action cannot be undone.',

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
      'admin.confirmBan': 'Ban account "{name}"?',
      'admin.confirmUnban': 'Unban account "{name}"?',
      'admin.banSuccess': '"{name}" has been banned',
      'admin.unbanSuccess': '"{name}" has been unbanned',
      'admin.noResults': 'No matching users found',
      'admin.prevPage': 'Previous',
      'admin.nextPage': 'Next',
      'admin.pageInfo': 'Page {page} / {totalPages} ({total} total)',
      'admin.forbidden': 'You do not have permission to access the admin zone'
    }
  };

  const LANGUAGES = [
    { code: 'zh', label: '繁體中文' },
    { code: 'en', label: 'English' }
  ];

  function getLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'en' ? 'en' : DEFAULT_LANG;
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

      if (menu && !menu.dataset.built) {
        menu.dataset.built = 'true';
        LANGUAGES.forEach((item) => {
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

      if (menu) {
        menu.querySelectorAll('[data-lang-option]').forEach((item) => {
          item.classList.toggle('active', item.getAttribute('data-lang-option') === lang);
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
    localStorage.setItem(STORAGE_KEY, lang === 'en' ? 'en' : 'zh');
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-Hant';
    applyI18n();
    renderLangDropdowns();
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: getLang() } }));
  }

  document.documentElement.lang = getLang() === 'en' ? 'en' : 'zh-Hant';
  applyI18n();
  renderLangDropdowns();

  document.addEventListener('click', () => closeAllLangDropdowns());
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAllLangDropdowns();
  });

  return { getLang, setLang, t, applyI18n };
})();
