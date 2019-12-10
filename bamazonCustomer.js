var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Walid123@",
    database: "bamazon"
});
//  connection to bamazon database.
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    afterConnection();

});

// call function to show the table created from Mysql/the table name is products

function afterConnection() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(res);
        purchasePrompt();

    })
}

// functopn that prompt 2 questions after sales table display using inquirer/1-id the customer want to purchase,
// 2-the quantity the customer want to purchase.

function purchasePrompt() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the ID of the product would you like to buy?",
                name: "idNumber"
            },
            {
                type: "input",
                message: "How many units of the product would you like to buy?",
                name: "quantity"
            },

        ])
        .then(function (answer) {
            var idNumberNeeded = answer.idNumber;
            var quantityNeeded = answer.quantity;
            console.log(idNumberNeeded);
            console.log(quantityNeeded);
            orderCheck(idNumberNeeded, quantityNeeded);
        })
}

// place customer order function after check if the quantity requested is availible in stock.
// if we have enough calculate the price and update the stock quantity.
// if there is not enough product console log sorry for the customer.

function orderCheck(idNumberNeeded, quantityNeeded) {
    connection.query('SELECT * FROM products WHERE ?', { item_id: idNumberNeeded }, function (err, res) {
        if (err) { console.log(err) };

        if (res[0].stock_quantity >= quantityNeeded) {
            console.log("The availible quantity in stock is" + " " + res[0].stock_quantity);

            var quantityLeft = res[0].stock_quantity - quantityNeeded;
            connection.query(
                "update products set ? where ?",
                [
                    {
                        stock_quantity: quantityLeft
                    },
                    {
                        item_id: idNumberNeeded
                    }
                ])

            console.log("the availible quantity now after this purchase for " + " " + res[0].product_name + " " + "is" + " " + quantityLeft);

            var totalPrice = res[0].price * quantityNeeded;
            console.log(totalPrice);
            console.log("your total cost for" + " " + quantityNeeded + " " + res[0].product_name + " " + "is" + " " + "$" + totalPrice);
            connection.end();
        }

        else {
            console.log("Sorry, Insufficient quantity!")
            connection.end();
        }
    })
}

