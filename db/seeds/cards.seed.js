require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { dataSource } = require('../data-source');
const Cards = require('../../entities/cards');
const cardsConfig = require('../../config/cards.json');

const cardImagesDir = path.join(__dirname, '../../public/card_images');

function buildCardRows() {
  return cardsConfig.map((card) => {
    const imageFile = `${card.id}.png`;

    if (!fs.existsSync(path.join(cardImagesDir, imageFile))) {
      throw new Error(
        `找不到卡片圖片：public/card_images/${imageFile}（卡片 id=${card.id}）`
      );
    }

    return {
      id: card.id,
      name: card.name,
      english_name: card.en_name,
      image_url: path.posix.join('card_images', imageFile)
    };
  });
}

async function seedCards() {
  await dataSource.initialize();

  try {
    const rows = buildCardRows();
    const cardsRepository = dataSource.getRepository(Cards);

    await cardsRepository.upsert(rows, ['id']);

    console.log(`卡片資料 seed 完成，共 ${rows.length} 筆`);
  } finally {
    await dataSource.destroy();
  }
}

seedCards().catch((error) => {
  console.error('卡片資料 seed 失敗：', error);
  process.exit(1);
});
