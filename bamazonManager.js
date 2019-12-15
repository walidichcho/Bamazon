var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});
//  connection to bamazon database.
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // afterConnection();
    menuPrompt();

});

// call function to show the table created from Mysql/the table name is products

function afterConnection() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(res);
        menuPrompt();

    })
}
//  creat a menu function to ask the manager what he want to do:
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
                // connection.end();
            }
            else if (answer.menu === "Add New Product") {
                addNewProduct();
                // connection.end();
            }

            else {
                connection.end();
            }
        })

}

// ===============================Product For Sale ==============================
//  first prompt in the menu is produt that they are for sale/shows all table
function productForSale() {

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(res);
    })
}

// =============================Low Inventory====================================
//low invwntory function will show all product that the stock quantity is less than 5
function lowInventory() {
    connection.query("SELECT item_id, product_name, stock_quantity FROM Products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        console.log(res);
    })
}

// ===============================Add Inventory =================================
// add inventery function to add more quntity to selected item by ID.
function addInventory() {

    inquirer.prompt([
        {

            type: "input",
            name: "inputId",
            message: "Please enter the ID number of the item you would like to add inventory to.",
        },
        {
            type: "input",
            name: "inputQuantity",
            message: "How many units of this item would you like to have in the in-store stock quantity?",

        }

    ]).then(function (answer) {
        var idnumberAdd = answer.inputId;
        var quantitytoadd = answer.inputQuantity;

        connection.query(
            "update products set ? where ?",
            [
                {
                    stock_quantity: quantitytoadd
                },
                {
                    item_id: idnumberAdd
                }
            ])

        console.log("the availible quantity now after the manager changes is : " + " " + quantitytoadd + "for the product Id :"
            + "" + idnumberAdd);

    });
}

// ==========================Add Products ===================================

function addNewProduct() {


    //ask user to fill in all necessary information to fill columns in table

    inquirer
        .prompt([

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
            // when finished prompting, insert a new item into the table with that info
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.itemName,
                    departement_name: answer.departName,
                    stock_quantity: answer.itemQuantity || 0,
                    price: answer.itemPrice || 0
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your row was created successfully!");
                    // re-prompt the manager want to go back to menu
                    menuPrompt();
                }
            );
        });
}
