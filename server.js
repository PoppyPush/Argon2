const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { argon2Hash, argon2Verify } = require('./argon2');

// Models
const User = require('./models/User');
const Secret = require('./models/Secret');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Kết nối MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/secrets_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Đăng ký
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const { hash, salt } = await argon2Hash(password);
        const newUser = new User({ username, password: `${salt}:${hash}` });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Username already exists or invalid data' });
    }
});

// Đăng nhập
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const [salt, storedHash] = user.password.split(':');
        const isValid = await argon2Verify(storedHash, salt, password);
        if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

        const secrets = await Secret.find({ userId: user._id });
        res.status(200).json({ message: 'Login successful', secrets });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Thêm thông tin bí mật
app.post('/add-secret', async (req, res) => {
    const { username, secret } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const newSecret = new Secret({ userId: user._id, secret });
        await newSecret.save();
        res.status(201).json({ message: 'Secret added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
