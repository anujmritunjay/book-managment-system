const errorMiddleware = require('./middleware/errorMiddleware')
const initDatabase = require('./config/initDatabase')
const userRoutes = require('./routes/userRoutes');
const orderRoute = require('./routes/orderRoute');
const booksRoute = require('./routes/bookRoute');
const express = require('express');
require('dotenv').config()

const app = express();

app.use(express.json())
app.use('/auth', userRoutes);
app.use('/books', booksRoute);
app.use('/orders', orderRoute);

app.get('/', (req, res)=>{
    res.json({
        success: true,
        message: "Hello from the server"
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    initDatabase()
    console.log(`Server is running on port ${PORT}`);
});
app.use(errorMiddleware)