const { createBook, updateBook, getAllBooks, 
    getBookById, deleteBookById, changeBookStatus} = require('../controllers/bookController');
    const express = require('express');
const roleMiddleware = require('./../middleware/roleMiddleware')
const auth = require('./../middleware/authMiddleware')
const router = express.Router();

router.post('/add-book',auth, roleMiddleware.admin, createBook);
router.put('/update-book/:bookId', auth, roleMiddleware.admin, updateBook);
router.get('/get-all-books', auth,getAllBooks );
router.get('/get-book/:bookId', auth,getBookById );
router.delete('/delete-book/:bookId', auth,roleMiddleware.admin, deleteBookById );
router.put('/change-book-status/:bookId', auth, roleMiddleware.superAdmin, changeBookStatus);

module.exports = router;