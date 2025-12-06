'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posts', {
      id: { allowNull: false, primaryKey: true, type: Sequelize.INTEGER, autoIncrement: true },
      title: { type: Sequelize.STRING, allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      author_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'authors', key: 'id' }, onDelete: 'CASCADE' },
      created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.addIndex('posts', ['author_id'], { name: 'idx_posts_author_id' });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('posts', 'idx_posts_author_id');
    await queryInterface.dropTable('posts');
  }
};
