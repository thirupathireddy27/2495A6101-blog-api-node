'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    static associate(models) {
      Author.hasMany(models.Post, {
        foreignKey: 'authorId',
        as: 'posts',
        onDelete: 'CASCADE',
        hooks: true
      });
    }
  }
  Author.init({
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } }
  }, {
    sequelize,
    modelName: 'Author',
    tableName: 'authors',
    underscored: true
  });
  return Author;
};
