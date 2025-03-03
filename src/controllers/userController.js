const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const SECRET_KEY = process.env.JWT_SECRET || 'secret';

exports.hello = (req, res) => res.send('hello');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user || user.isBanned) return res.status(403).json({ error: 'Access denied' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
        const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) { res.status(500).send('Internal Server Error'); }
};

exports.createUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: 'OK' });
    } catch (error) { res.status(500).json({ error: 'Error creating user' }); }
};

exports.getUserProfile = async (req, res) => {
    try {
        console.log('Fetching profile for user ID:', req.userId);
        const user = await User.findByPk(req.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ username: user.username, email: user.email });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Error fetching user' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.destroy({ where: { id: req.params.id } });
        res.json({ message: 'User deleted' });
    } catch (error) { res.status(500).json({ error: 'Error deleting user' }); }
};

exports.blockUser = async (req, res) => {
    try {
        await User.update({ isBanned: true }, { where: { id: req.params.id } });
        res.json({ message: 'User blocked' });
    } catch (error) { res.status(500).json({ error: 'Error blocking user' }); }
};

exports.uploadFile = (req, res) => {
    if (!req.files || !req.files.file) return res.status(400).send('No file uploaded');
    res.json({ message: 'File uploaded successfully', file: req.files.file.name });
};