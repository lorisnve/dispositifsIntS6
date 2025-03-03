const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'db_loris',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mysql',
        port: '3306'
    }
);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

module.exports = sequelize;
