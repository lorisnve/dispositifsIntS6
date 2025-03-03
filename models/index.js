const sequelize = require('../config/database');
const User = require('./user');

sequelize.sync().then(() => {
    console.log('Database & tables created!');
}).catch((error) => {
    console.error('Error synchronizing the database: ', error);
});

module.exports = {
    User
};
