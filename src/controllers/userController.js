const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/user');

exports.hey = (req, res) => {
    res.send('hey');
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
        res.json({ token });

    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.createUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ username, email, password: hashedPassword });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    try {
        const user = await User.findByPk(id);
        if (user) {
            user.username = username || user.username;
            user.email = email || user.email;
            user.password = password || user.password;
            await user.save();
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();
            res.status(200).json({ message: 'User deleted' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
};

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token is required');

    try {
        const decoded = jwt.verify(token, 'secret');
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(401).send('Invalid token');
    }
};

exports.verifyAdmin = async (req, res, next) => {
    const user = await User.findByPk(req.userId);
    if (user && user.isAdmin) {
        next();
    } else {
        res.status(403).send('Admin access required');
    }
};

exports.calcul = (req, res) => {
    const { num1, num2, operation } = req.body;
    let result;
    switch (operation) {
        case 'addition':
            result = num1 + num2;
            break;
        case 'soustraction':
            result = num1 - num2;
            break;
        case 'multiplication':
            result = num1 * num2;
            break;
        case 'division':
            result = num1 / num2;
            break;
        default:
            return res.status(400).send('Invalid operation');
    }
    res.send({ result });
};

exports.constante = (req, res) => {
    const constante = 10;
    res.send({ constante });
};

let variable = 'test';

exports.profil = (req, res) => {
    const { chaine } = req.body;
    variable = variable + chaine;
    res.send({ result: variable });
};

exports.delete = (req, res) => {
    variable = '';
    res.send({ result: variable });
};

exports.uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    res.status(200).send({
        message: 'File uploaded successfully',
        file: req.file
    });
};
