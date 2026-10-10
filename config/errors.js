// 所有錯誤的 HTTP 狀態碼與預設訊息集中在這裡，使用方式：appError('USERNAME_TAKEN')
// 新增錯誤時，前端 public/js/i18n.js 的 zh、en、ja、ko 也要補上 error.<CODE>（npm run check:errors 會檢查）
module.exports = {
  // 欄位與格式
  INVALID_FIELDS: { status: 400, message: '欄位未填寫正確' },
  INVALID_UID: { status: 400, message: '原神 UID 格式錯誤' },
  NOTHING_TO_UPDATE: { status: 400, message: '沒有可更新的欄位' },
  CARD_CONFLICT: { status: 400, message: '同一張卡片不能同時是提供與需求' },

  // 帳號與密碼
  USERNAME_TAKEN: { status: 409, message: '名字已被使用' },
  EMAIL_TAKEN: { status: 400, message: 'email 已被使用' },
  USERNAME_IMMUTABLE: { status: 400, message: '帳號不可修改' },
  INVALID_CREDENTIALS: { status: 400, message: '使用者不存在或密碼輸入錯誤' },
  PASSWORD_MISMATCH: { status: 400, message: '兩次輸入的密碼不一致' },
  NEW_PASSWORD_MISMATCH: { status: 400, message: '兩次輸入的新密碼不一致' },
  OLD_PASSWORD_WRONG: { status: 400, message: '舊密碼錯誤' },
  PASSWORD_WRONG: { status: 400, message: '密碼錯誤' },
  RESET_LINK_INVALID: { status: 400, message: '重設連結無效或已過期' },

  // 登入狀態與權限
  UNAUTHORIZED: { status: 401, message: '請先登入' },
  TOKEN_INVALID: { status: 401, message: '無效的 token' },
  TOKEN_EXPIRED: { status: 401, message: 'Token 已過期' },
  ACCOUNT_BANNED: {
    status: 403,
    message: '您的帳號已被停權，如有疑問請聯絡管理者'
  },
  FORBIDDEN: { status: 403, message: '您沒有權限執行此操作' },
  CANNOT_BAN_SELF: { status: 403, message: '無法停權自己的帳號' },
  CANNOT_BAN_ADMIN: { status: 403, message: '無法停權管理者帳號' },
  CANNOT_DELETE_ADMIN: { status: 403, message: '不可刪除管理者帳號' },
  ALREADY_ADMIN: { status: 400, message: '此使用者已經是管理者' },

  // 資源（NO_DATA 預設 400，管理者端刪除時用 { status: 404 } 覆寫）
  NO_DATA: { status: 400, message: '查無資料' },
  USER_NOT_FOUND: { status: 404, message: '找不到使用者' },
  ROUTE_NOT_FOUND: { status: 404, message: 'Page Not Found' },

  // 系統
  PAYLOAD_TOO_LARGE: { status: 413, message: '送出的內容過大' },
  TOO_MANY_REQUESTS: { status: 429, message: '請求過於頻繁，請稍後再試' },
  TOO_MANY_ATTEMPTS: { status: 429, message: '嘗試次數過多，請稍後再試' },
  SERVER_ERROR: { status: 500, message: '伺服器發生錯誤，請稍後再試' }
};
