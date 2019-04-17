var inquirer = require('inquirer');

var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon",

    socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
});

// List a set of menu options:

// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product

// If a manager selects View Products for Sale, the app should list every 
// available item: the item IDs, names, prices, and quantities.

// If a manager selects View Low Inventory, then it should list all items
//  with an inventory count lower than five.

// If a manager selects Add to Inventory, your app should display a prompt 
// that will let the manager "add more" of any item currently in the store.

// If a manager selects Add New Product, it should allow the manager 
// to add a completely new product to the store.
var lineBreak = "----------------------------------------------------------------------------------";

displayMenu();

function displayMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'options',
                message: 'What would you like to do?',
                choices: ['View Products for Sale', 'View Low Inventory',
                    'Add to Inventory', 'Add New Product', 'Exit'],
            },
        ])
        .then(answers => {
            // console.log(answers);
            switch (answers.options) {
                case "View Products for Sale":
                    listProducts();
                    break;

                case "View Low Inventory":
                    showLow();
                    break;

                case "Add to Inventory":
                    addProduct();
                    break;

                case "Add New Product":
                    newProduct();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
}

function listProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // console.log(res);

        for (i = 0; i < res.length; i++) {
            console.log("Item #" + res[i].item_id + ": " +
                res[i].product_name + " - Price: $" + res[i].price +
                " (Current inventory: " + res[i].stock_quantity + ")");
        };
        console.log(lineBreak);
        displayMenu();
    });
};

function showLow() {
    connection.query("SELECT * FROM products WHERE stock_quantity BETWEEN 0 AND 5", function (err, res) {
        for (i = 0; i < res.length; i++) {
            console.log("Item #" + res[i].item_id + ": " +
                res[i].product_name + " - Price: $" + res[i].price +
                " (Current inventory: " + res[i].stock_quantity + ")");
        };
        console.log(lineBreak);
        displayMenu();
    });
};

function addProduct() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the Item # of the product to add to inventory?",
                name: "idNumber"
            },
            {
                type: "input",
                message: "How many would you like to add to inventory?",
                name: "quantity"
            },
        ])
        .then(answers => {

            var itemNum = answers.idNumber;
            var addToStock = parseInt(answers.quantity);

            connection.query("SELECT * FROM products WHERE item_id = " + itemNum, function (err, res) {
                if (err) throw err;
                // console.log(res[0]);
                // console.log("res[0].stock_quantity: ", res[0].stock_quantity);
                var updatedStock = res[0].stock_quantity + addToStock;
                // console.log("updatedStock: ", updatedStock);
                updateStock(itemNum, updatedStock, res[0].product_name);
            });
        });
};

function updateStock(itemNum, newStock, product_name) {
    connection.query("UPDATE products SET stock_quantity = " + newStock +
        " WHERE item_id =" + itemNum, function (err, res) {
            if (err) throw err;
            // console.log(res);
            console.log("You now have " + newStock + " " + product_name + ".");
            console.log(lineBreak)
            displayMenu();
        });
};

function newProduct() {
    
}