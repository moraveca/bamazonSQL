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

displayMenu();

function displayMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'options',
                message: 'What would you like to do?',
                choices: ['View Product Sales by Department', 'Create New Department', 'Exit'],
            },
        ])
        .then(answers => {
            // console.log(answers);
            switch (answers.options) {
                case "View Product Sales by Department":
                    viewSales();
                    break;

                case "Create New Department":
                    createDepartment();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
};

function viewSales() {
    // connection.query("SELECT * FROM departments", function (err, res) {
    //     if (err) throw err;
    //     // console.log(res);
    //     var departmentArray = [];
    //     for (i = 0; i < res.length; i++) {
    //         departmentArray.push(res[i].department_name)
    //     };
    //     console.log(departmentArray);

    // var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales "
    // query += "SUM(products.product_sales) AS new_product_sales "
    // query += "FROM products INNER JOIN departments ON departments.department_name = products.department_name "


    var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales ";
    query += "FROM departments INNER JOIN products ON departments.department_name = products.department_name ";
    query += " WHERE (top_albums.artist = ? AND top5000.artist = ?) ORDER BY top_albums.year ";
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log(res);
    })
}