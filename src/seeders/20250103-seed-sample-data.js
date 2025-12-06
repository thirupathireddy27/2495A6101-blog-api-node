'use strict';
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('authors', [
      { name: 'Alice', email: 'alice@example.com', created_at: new Date(), updated_at: new Date() },
      { name: 'Bob', email: 'bob@example.com', created_at: new Date(), updated_at: new Date() }
    ], {});
    await queryInterface.bulkInsert('posts', [
      { title: 'Hello from Alice', content: 'First post', author_id: 1, created_at: new Date(), updated_at: new Date() },
      { title: 'Bob says hi', content: 'Bob post', author_id: 2, created_at: new Date(), updated_at: new Date() }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('posts', null, {});
    await queryInterface.bulkDelete('authors', null, {});
  }
};
