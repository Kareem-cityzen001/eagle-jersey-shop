const express = require('express');
const mongoose = require('mongoose'); // Make sure mongoose is required
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection (replace with your actual MongoDB connection string)
mongoose.connect('mongodb+srv://denvermanuel04:kareem%40cityzen@eaglejerseyshopcluster.bzdli.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err.message));

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// Register route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send('Please provide all required fields');
  }

    // Hash the password and save the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    try {
       await user.save();
    res.status(201).send('User registered successfully');
  } catch (err) {
    res.status(400).send('Error registering user: ' + err.message);
  }
});

// Login route
app.post('/login', async (req, res) => {
const { email, password } = req.body;
try {
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send('Invalid credentials');

  const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1h' });
  res.json({ token });
} catch (err) {
  res.status(500).send('Error logging in: ' + err.message);
}
});

// Start server
app.listen(PORT, () => {
console.log('Server is running on port',PORT);
});  