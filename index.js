const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const userRoutes = require('./src/routes/userRoutes');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(fileUpload());
app.use('/api', userRoutes);
app.use('/api/users', userRoutes);

sequelize.sync().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
