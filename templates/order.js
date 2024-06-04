const generateHTML = (data, user) => {
    let grandTotal = 0;

    const ordersTable = `
        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total Amount</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(book => {
                    const title = book.name;
                    const price = parseFloat(book.price).toFixed(2);
                    const totalAmount = parseFloat(book.totalAmount).toFixed(2);

                    grandTotal += parseFloat(book.totalAmount);

                    return `
                        <tr>
                            <td>${title}</td>
                            <td>$${price}</td>
                            <td>${book.quantity}</td>
                            <td>$${totalAmount}</td>
                        </tr>`;
                }).join('')}
            </tbody>
        </table>`;

    const userDetail = `
        <div class="user-details">
            <h2>User Details</h2>
            <p><strong>Grand Total:</strong> $${grandTotal.toFixed(2)}</p>
            <p><strong>User:</strong> ${user}</p>
        </div>`;

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Books Summary</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                .container {
                    border: 1px solid #ccc;
                    padding: 20px;
                    border-radius: 5px;
                    max-width: 800px;
                    margin: auto;
                }
                h1 {
                    color: #333;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                .user-details {
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Books Summary</h1>
                ${ordersTable}
                ${userDetail}
            </div>
        </body>
        </html>`;
};

module.exports = {generateHTML}