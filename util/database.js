const Sequelize = require('sequelize');

const sequelize = new Sequelize('learning_node', 'root', 'rootroot', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
