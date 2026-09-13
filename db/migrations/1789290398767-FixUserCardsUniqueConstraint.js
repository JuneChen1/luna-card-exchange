/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class FixUserCardsUniqueConstraint1789290398767 {
    name = 'FixUserCardsUniqueConstraint1789290398767'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_cards" DROP CONSTRAINT "UQ_user_card_pair"`);
        await queryRunner.query(`ALTER TABLE "user_cards" ADD CONSTRAINT "UQ_user_card_pair" UNIQUE ("user_id", "genshin_uid", "card_id")`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_cards" DROP CONSTRAINT "UQ_user_card_pair"`);
        await queryRunner.query(`ALTER TABLE "user_cards" ADD CONSTRAINT "UQ_user_card_pair" UNIQUE ("user_id", "card_id")`);
    }
}
