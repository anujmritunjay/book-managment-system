const emailHelper = require('./../utilities/emailHelper')
const userController = require('./userController')
const bookTemplate = require('../templates/order')
const pool = require('../config/database');

exports.createOrder = async (req, res, next) => {
    try {
        const superAdmin = await userController.getSuperAdmin()
        const userId = req.user.id
        const orderDetails = []
        if(req.body && req.body.length){
            for(let i = 0; i<req.body.length; i++){
                const element = req.body[i]
                let book = await pool.query('SELECT * FROM books WHERE id = ?', [element.bookId]);
                book = book[0]  
                console.log(book)
                const totalAmount = book.price * element.quantity
                const orderData = {
                    name: book.title,
                    price: book.price,
                    quantity: element.quantity,
                    totalAmount: totalAmount
                }
                orderDetails.push(orderData)
                const result = await pool.query(
                    'INSERT INTO orders (bookId, userId, quantity, totalAmount) VALUES (?, ?, ?, ?)',
                    [element.bookId, userId, element.quantity, totalAmount]);
            }
        }  
        
        if(superAdmin && superAdmin.email){
            const mailObj = {
                to: superAdmin.email,
                subject: 'New Order Places',
                html: bookTemplate.generateHTML(orderDetails, req.user.name)
            }
            await emailHelper.sendEmail(mailObj);
        } 
        res.status(201).json({
            success: true,
            data: "Order Placed successfully"
        });
    
    } catch (error) {
        return next(error)
    }
};