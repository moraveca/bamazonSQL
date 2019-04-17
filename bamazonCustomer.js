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

listItems();

function listItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // console.log(res);

        for (i = 0; i < res.length; i++) {
            console.log("Item #" + res[i].item_id + ": " +
            res[i].product_name + " - Price: $" + res[i].price);
        };
        askQuestion();
    });
};

function askQuestion() {

    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the Item # of the product you'd like to buy?",
                name: "idNumber"
            },
            {
                type: "input",
                message: "How many would you like to buy?",
                name: "quantity"
            },
        ])
        .then(answers => {
            // console.log(answers);
            checkQuantity(answers.idNumber, answers.quantity);
        });
}

function checkQuantity(id, userBoughtNum) {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // console.log(res);

        var arrayId = id - 1;
        var stockNum = res[arrayId].stock_quantity;
        var userCost = res[arrayId].price * userBoughtNum;
        var itemName = res[arrayId].product_name;

        if (stockNum >= userBoughtNum) {
            console.log("you can buy it!");

            var newStockNum = stockNum - userBoughtNum;
            buyProduct(id, newStockNum, userCost, userBoughtNum, itemName);
        } else {
            console.log("Insufficient quantity, sorry.");
            buyAgain();
        }
    });

};

function buyProduct(id, newStock, userCost, userBoughtNum, itemName) {
    connection.query("UPDATE products SET stock_quantity = " + newStock +
        " WHERE item_id =" + id, function (err, res) {
            if (err) throw err;
            // console.log(res);
            console.log("You have purchased " + userBoughtNum + " " +
                itemName + " for the price of $" + userCost + ". Thank you!");
            buyAgain();
        });
};

function buyAgain() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Would you like to buy something else?",
                choices: ["Yes", "No"],
                name: "buyAgain"
            },
        ])
        .then(answers => {
            // console.log(answers);
            if (answers.buyAgain === "Yes") {
                listItems();
            } else {
                console.log("Thanks for shopping. Come again!");
                connection.end();
            }
        });
}
