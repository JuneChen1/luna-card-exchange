const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'UserCards',
  tableName: 'user_cards',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid'
    },
    genshin_uid: {
      type: 'varchar',
      length: 50,
      nullable: false
    },
    status: {
      type: 'varchar',
      length: 10,
      nullable: false
    },
    is_public: {
      type: 'boolean',
      nullable: false,
      default: true
    },
    created_at: {
      type: 'timestamp',
      createDate: true
    }
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'Users',
      joinColumn: { name: 'user_id' },
      nullable: false
    },
    card: {
      type: 'many-to-one',
      target: 'Cards',
      joinColumn: { name: 'card_id' },
      nullable: false
    }
  },
  uniques: [
    {
      name: 'UQ_user_card_pair',
      columns: ['user', 'genshin_uid', 'card']
    }
  ]
});
