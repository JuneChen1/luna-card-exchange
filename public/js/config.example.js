// 複製這個檔案為 config.js 並依環境調整。
// config.js 不會被版控（見 .gitignore），本機開發和正式站要各自維護自己的版本。
//
// 本機開發：前端和後端同源時可以不建立 config.js（api.js 會自動 fallback 用相對路徑 /api）。
// GitHub Pages 正式站：前後端不同源，必須設定成 Railway 後端的完整網址。
window.API_BASE_URL = 'https://your-backend.up.railway.app/api';
