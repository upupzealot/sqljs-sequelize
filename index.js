const {init} = require('./sqljs-patch');
const path = require('path');

(async ()=>{
  await init();

  const Sequelize = require('sequelize');
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    dialectModulePath: path.resolve(__dirname, './dialect-module.js'),
    storage: path.resolve(__dirname, './database.sqlite'),
    logging: false,
  });

  const User = sequelize.define('user', {
    username: Sequelize.STRING,
    birthday: Sequelize.DATE
  });

  sequelize.sync().then(function() {
    return User.create({
      username: 'janedoe',
      birthday: new Date(1980, 6, 20)
    });
  }).then(function(jane) {
    console.log(jane.get({
      plain: true
    }));
  });
})();