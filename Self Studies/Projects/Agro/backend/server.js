const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');


dotenv.config();


const ClientRouter = require('./routes/clientRouter');
const uploadRouter = require('./routes/uploadRouter');
const loyaltyRouter = require('./routes/loyaltyRouter');

const app = express();

app.use(cors());
app.use(express.json());

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    }
};

connectDB();

app.use('/api', ClientRouter,uploadRouter,loyaltyRouter);
app.use('/images', express.static(path.join(__dirname, 'image')));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
