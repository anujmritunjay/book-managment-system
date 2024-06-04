const pool = require('./database')

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    forgotPasswordToken VARCHAR(255) DEFAULT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;


const createBooksTable = `
  CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    isApproved BOOLEAN DEFAULT FALSE,
    createdBy INT NOT NULL,
    updatedBy INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (createdBy) REFERENCES users(id),
    FOREIGN KEY (updatedBy) REFERENCES users(id)
  );
`;

const createOrderTable = `
CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        bookId INT NOT NULL,
        quantity INT NOT NULL,
        totalAmount DECIMAL(10, 2) NOT NULL,
        purchaseDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE
    );
`;





async function initDatabase(){
    try {
        await pool.query(createUsersTable);
        await pool.query(createBooksTable);
        await pool.query(createOrderTable);
      } catch (error) {
        console.error('Error creating tables:', error.message);
      }
}

module.exports = initDatabase