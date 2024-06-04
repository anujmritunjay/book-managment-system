const rejectionTemplate = require('../templates/rejectionBook')
const ErrorHandler = require('./../utilities/errorHandler')
const emailHelper = require('./../utilities/emailHelper')
const bookTemplate = require('../templates/book')
const userController = require('./userController')
const pool = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


exports.createBook = async (req, res, next) => {
    try {
        const superAdmin = await userController.getSuperAdmin()
        const { title, author, description, price } = req.body;
        const result = await pool.query(
            'INSERT INTO books (title, author, description, price, isApproved, createdBy) VALUES (?, ?, ?, ?, ?, ?)',
            [title, author, description, price, false, req.user.id]);
  
        if(result && result.insertId){ 
            if(superAdmin && superAdmin.email){
                const mailObj = {
                    to: superAdmin.email,
                    subject: 'New Book Added',
                    html: bookTemplate.bookTemplate(title, author, price, description, req.user.name)
                }
                await emailHelper.sendEmail(mailObj);
            } 
            const book = { id: result.insertId, title, author, description, price, isApproved: false, createdBy: req.user.id }
            res.status(201).json({
                success: true,
                data: book
            });
        }else{
            return next(new ErrorHandler('Failed to create book', 401));
        }
    } catch (error) {
        return next(error)
    }
};

exports.updateBook = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const { title, author, description, price } = req.body;
        
        const result = await pool.query(
            'UPDATE books SET title = ?, author = ?, description = ?, price = ?, updatedBy = ? WHERE id = ?',
            [title, author, description, price, req.user.id, bookId]
        );        

        if (result && result.affectedRows > 0) {
            const superAdmin = await userController.getSuperAdmin()
            if(superAdmin && superAdmin.email){
                const mailObj = {
                    to: superAdmin.email,
                    subject: 'Book Updated',
                    html: bookTemplate.bookTemplate(title, author, price, description, req.user.name, false)
                }
                await emailHelper.sendEmail(mailObj);
            } 
            res.status(200).json({
                success: true,
                data: {id: bookId, title, author, description, price}
            });
        } else {
            return next(new ErrorHandler('Failed to update book', 404));
        }
    } catch (error) {
        return next(error);
    }
};

exports.getAllBooks = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const role = req.user.role;
        const userId = req.user.id;
        let booksQuery;
        let countQuery;
        const queryParams = [parseInt(limit), parseInt(offset)];
        if (role === 'super-admin') {
            booksQuery = `
                SELECT books.*, users.id as createdById, users.name as createdByName 
                FROM books 
                INNER JOIN users ON books.createdBy = users.id 
                LIMIT ? OFFSET ?`;
            countQuery = 'SELECT COUNT(*) as total FROM books';
        } else if (role === 'admin') {
            booksQuery = `
                SELECT books.*, users.id as createdById, users.name as createdByName 
                FROM books 
                INNER JOIN users ON books.createdBy = users.id 
                WHERE books.createdBy = ? 
                LIMIT ? OFFSET ?`;
            countQuery = 'SELECT COUNT(*) as total FROM books WHERE createdBy = ?';
            queryParams.unshift(userId);
        } else {
            booksQuery = `
                SELECT books.*, users.id as createdById, users.name as createdByName 
                FROM books 
                INNER JOIN users ON books.createdBy = users.id 
                WHERE books.isApproved = true 
                LIMIT ? OFFSET ?`;
            countQuery = 'SELECT COUNT(*) as total FROM books WHERE isApproved = true';
        }

        const [countResult] = await pool.query(countQuery, role === 'admin' ? [userId] : []);
        const totalBooks = countResult.total;

        const books = await pool.query(booksQuery, queryParams);

        const formattedBooks = books.map(book => ({
            id: book.id,
            title: book.title,
            author: book.author,
            description: book.description,
            price: book.price,
            isApprove: book.isApprove,
            createdAt: book.createdAt,
            updatedAt: book.updatedAt,
            createdBy: {
                id: book.createdById,
                name: book.createdByName
            }
        }));

        res.status(200).json({
            success: true,
            data: formattedBooks,
            total: totalBooks,
            page: parseInt(page),
        });
    } catch (error) {
        return next(error);
    }
};


exports.getBookById = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        let book = await pool.query('SELECT * FROM books WHERE id = ?', [bookId]);
        
        if (book.length === 0) {
            return next(new ErrorHandler('Book not found', 404));
        }

        res.status(200).json({
            success: true,
            data: book[0]
        });
    } catch (error) {
        return next(error);
    }
};

exports.deleteBookById = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const result = await pool.query(
            'DELETE FROM books WHERE id = ? AND createdBy = ?',
            [bookId, req.user.id]
        );
        
        if (result.affectedRows === 0) {
            return next(new ErrorHandler('Book not found', 404));
        }
        
        res.status(200).json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error) {
        return next(error);
    }
};


exports.changeBookStatus = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const { isApproved } = req.body;

        let book = await pool.query('SELECT * FROM books WHERE id = ?', [bookId]);
        if(book.length === 0){
            return next(new ErrorHandler('Book not found', 404));
        }

        const result = await pool.query('UPDATE books SET isApproved = ? WHERE id = ?', [isApproved, bookId]);
        if (result.affectedRows === 0) {
            return next(new ErrorHandler('Book not found', 404));
        }
        if(!isApproved){
            book = book[0]
            let user = await pool.query('SELECT * FROM users WHERE id = ?', [book.createdBy]);
            if(user && user.length){
                console.log(book.price)
                user = user[0]
                const mailObj = {
                    to: user.email,
                    subject: "You book has been rejected.",
                    html: rejectionTemplate.rejectionTemplate(book.price, book.title, book.author, book.description, req.user.name)
                }
                await emailHelper.sendEmail(mailObj)
            }
        }
        res.status(200).json({
            success: true,
            message: `Book ${isApproved ? 'approved' : 'rejected'} successfully`
        });
    } catch (error) {
        return next(error);
    }
};




