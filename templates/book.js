'use strict';

const bookTemplate = (title, author, price, description, user, isCreated = true) => {
    const action = isCreated ? 'Created By' : 'Updated By';
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Book ${isCreated ? 'Created' : 'Updated'}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
            }
            .container {
                border: 1px solid #ccc;
                padding: 20px;
                border-radius: 5px;
                max-width: 600px;
                margin: auto;
            }
            h1 {
                color: #333;
            }
            p {
                line-height: 1.6;
            }
            .book-details, .user-details {
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>New Book ${isCreated ? 'Created' : 'Updated'}</h1>
            <div class="book-details">
                <h2>Book Details</h2>
                <p><strong>Title:</strong> ${title}</p>
                <p><strong>Author:</strong> ${author}</p>
                <p><strong>Description:</strong> ${description}</p>
                <p><strong>Price:</strong> $${price}</p>
            </div>
            <div class="user-details">
                <h2>User Details</h2>
                <p><strong>${action}:</strong> ${user}</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = { bookTemplate,}