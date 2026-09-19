const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

async function sendResetPasswordEmail(to, resetUrl) {
  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': process.env.BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: { email: process.env.MAIL_FROM },
      to: [{ email: to }],
      subject: '重設密碼 - 月諭聖牌交換站',
      htmlContent: `
        <p>您好，</p>
        <p>我們收到您重設密碼的請求，請點擊以下連結重設密碼（15 分鐘內有效）：</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>若您並未申請重設密碼，請忽略此信件，您的密碼不會有任何變動。</p>
      `
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo API 寄信失敗（${response.status}）：${errorBody}`);
  }
}

module.exports = { sendResetPasswordEmail };
