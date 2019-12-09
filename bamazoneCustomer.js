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

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    afterConnection();
});
function afterConnection() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(res);
        // connection.end();
    });
}
purchasePrompt();

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
function orderCheck(idNumberNeeded, quantityNeeded) {
    connection.query('SELECT * FROM products WHERE ?', { item_id: idNumberNeeded }, function (err, res) {
        if (err) { console.log(err) };

        if (res[0].stock_quantity >= quantityNeeded) {
            console.log(res[0].stock_quantity);
            var totalPrice = res[0].price * quantityNeeded;
            console.log(totalPrice);
            console.log("your total cost for" + " " + quantityNeeded + " " + res[0].product_name + " " + "is" + " " + "$" + totalPrice);
        }
        else {
            console.log("Insufficient quantity!")
            connection.end();
        }
    })
}
