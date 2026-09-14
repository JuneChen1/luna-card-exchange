require('dotenv').config();

const bcrypt = require('bcrypt');
const { dataSource } = require('../data-source');
const {
  isValidString,
  isValidPassword,
  isValidEmail
} = require('../../utils/validUtils');

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const email = process.env.ADMIN_EMAIL;

  if (
    !isValidString(username) ||
    !isValidPassword(password) ||
    !isValidEmail(email)
  ) {
    throw new Error(
      '請設定環境變數 ADMIN_USERNAME、ADMIN_PASSWORD、ADMIN_EMAIL（密碼需至少 8 碼且包含英文字母與數字，Email 需符合格式）'
    );
  }

  await dataSource.initialize();

  try {
    const userRepo = dataSource.getRepository('Users');
    let user = await userRepo.findOneBy({ name: username.trim() });

    if (user) {
      await userRepo.save({ ...user, email, role: 'ADMIN' });
      console.log(`已將既有帳號「${username}」的權限設為 ADMIN（密碼未變更）`);
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await userRepo.save({
        name: username.trim(),
        password: hashedPassword,
        email,
        role: 'ADMIN'
      });
      console.log(`已建立管理者帳號「${username}」`);
    }
  } finally {
    await dataSource.destroy();
  }
}

seedAdmin().catch((error) => {
  console.error('管理者帳號 seed 失敗：', error);
  process.exit(1);
});
