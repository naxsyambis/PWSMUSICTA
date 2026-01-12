'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    password: { 
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'users',
    timestamps: false
  });

  User.associate = (models) => {
    User.hasOne(models.ApiKey, {
      foreignKey: 'user_id',
      as: 'apiKey',
      onDelete: 'CASCADE'
    });
  };

  return User;
};