/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AddIsPublicInUserCardsTable1790410012964 {
    name = 'AddIsPublicInUserCardsTable1790410012964'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_cards" ADD "is_public" boolean NOT NULL DEFAULT true`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_cards" DROP COLUMN "is_public"`);
    }
}
