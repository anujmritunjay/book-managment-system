'use strict';

const rejectionTemplate = (price, title, author, description, user) => {    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Book Rejected</title>
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
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Book Rejected</h1>
            <div class="book-details">
                <h2>Book Details</h2>
                <p><strong>Title:</strong> ${title}</p>
                <p><strong>Author:</strong> ${author}</p>
                <p><strong>Description:</strong> ${description}</p>
                <p><strong>Price:</strong> $${price}</p>
            </div>
            <div>
                <p>We regret to inform you that your book "${title}" has been rejected.</p>
                <p><strong>Submitted By:</strong> ${user}</p>
                <p>Please review the details and make necessary changes to resubmit your book.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = { rejectionTemplate };
