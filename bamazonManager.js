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
    menuPrompt();

});

// call function to show the table created from Mysql/the table name is products

// function afterConnection() {
//     connection.query("SELECT * FROM products", function (err, res) {
//         if (err) throw err;
//         console.log(res);
//         menuPrompt();

//     })
// }

function menuPrompt() {

    inquirer
        .prompt([
            {
                type: "list",
                name: "menu",
                message: "Welcome Manager, What would you like to review",

                choices: [
                    "View Products for Sale",
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product",
                    "Exit the Menu"

                ]
            }

        ])
        .then(function (answer) {
            console.log(answer);

            if (answer.menu === "View Products for Sale") {
                productForSale();
                connection.end();
            }
            else if (answer.menu === "View Low Inventory") {
                lowInventory();
                connection.end();
            }
            else if (answer.menu === "Add to Inventory") {
                addInventory();
                connection.end();
            }
            else if (answer.menu === "Add New Product") {
                addNewProduct();
                connection.end();
            }

            else {
                connection.end();
            }
        })

}

// ===============================Product For Sale ==============================

function productForSale() {

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(res);
    })
}
function lowInventory() {
    connection.query("SELECT item_id, product_name, stock_quantity FROM Products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        console.log(res);
    })
}

// ===============================Add Inventory =================================

// function addInventory() {
//     inquirer
//         .prompt([
//     {
//         input: "id",
//         message: "witch product do want to add?",
//         name: "idNumber"
//     },
//     {
//         input: "quantity",
//         message: "witch quantity do want to add?",
//         name: "addQuantity"
//     }

// ])
// .then(function (answer) {
// var newQuantity = answer.addQuantity;
// console.log(newQuantity)
//             connection.query(
//                 "update products set ? where ?",
//                 [
//                     {
//                         stock_quantity: answer.addQuantity
//                     },
//                     {
//                         item_id: answer.idNumber
//                     }
//                 ])
//             menuPrompt();

//         })

// }

function addInventory() {

    inquirer.prompt([{

        type: "input",
        name: "inputId",
        message: "Please enter the ID number of the item you would like to add inventory to.",
    },
    {
        type: "input",
        name: "inputNumber",
        message: "How many units of this item would you like to have in the in-store stock quantity?",

    }
        //     ]).then(function (managerAdd) {

        //         connection.query("UPDATE products SET ? WHERE ?", [{

        //             stock_quantity: managerAdd.inputNumber
        //         }, {
        //             item_id: managerAdd.inputId
        //         }], function (err, res) {
        //         });
        //         menuPrompt();
        //     });
        // }

        // // Pushes new stock to database.

    ]).then(function (answer) {
        connection.query("SELECT * FROM products", function (err, res) {

            var chosenItem;

            // Gets product who's stock needs to be updated.
            for (let i = 0; i < res.length; i++) {
                if (res[i].item_id === parseInt(answer.inputId)) {
                    chosenItem = res[i];
                }
            }

            // Adds new stock  to existing stock.
            var updatedStock = parseInt(chosenItem.stock_quantity) + parseInt(answer.inputNumber);

            console.log("Updated stock: " + updatedStock);

            // Updates stock for selected product in database.
            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: updatedStock
            }, {
                item_id: answer.inputId
            }], function (err, res) {
                if (err) {
                    throw err;
                } else {

                    // Lets manager select new action.
                    menuPrompt();
                }
            });

        });

    });
};
// ==================================Add New Product=================================
function addNewProduct() {


    //ask user to fill in all necessary information to fill columns in table

    inquirer
        .prompt([
            // {
            //     name: "itemId",
            //     type: "input",
            //     message: "What is the item  Id you would like to add?"
            // },
            {
                name: "itemName",
                type: "input",
                message: "What is the nameif item would you like to add?"
            },
            {
                name: "departName",
                type: "input",
                message: "What departement this product?",

            },
            {
                name: "itemQuantity",
                type: "input",
                message: "What quantity would you like to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "itemPrice",
                type: "input",
                message: "What is the price for this product?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
        ])
        .then(function (answer) {
            const sqlQuery = `INSERT INTO products 
            (product_name, stock_quantity, departement_name, price) 
            VALUES
            (${answer.itemName}, ${answer.itemQuantity || 0}, ${answer.departName}, ${answer.itemPrice || 0})`
            console.log('answer:', answer)
            //             insert into products( product_name, stock_quantity, departement_name, price)
            // values ( "hata",'10', "clothing",'10');
            connection.query(sqlQuery, function (err, res) {
                console.log('hitting connection.query')
                if (err) throw err;
                console.log('Record inserted into DB')
            });
            menuPrompt();
        });
}