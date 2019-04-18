var inquirer = require('inquirer');

var mysql = require("mysql");

const { table } = require('table');


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

    var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales ";
    query += "FROM departments INNER JOIN products ON departments.department_name = products.department_name ";
    query += "GROUP BY departments.department_id ";

    connection.query(query, function (err, res) {
        if (err) throw err;
        // console.log(res);
        var y = [['department_id', 'department_name', 'over_head_costs', 'product_sales', 'total_profit']];

        for (i = 0; i < res.length; i++) {
            var total_profit = res[i].product_sales - res[i].over_head_costs;
            var x = [];
            x.push(res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, total_profit);
            // console.log("x: ", x)
            y.push(x);
        }

        // console.log("y: ", y)

        let data,
            output;

        data = y;

        output = table(data);

        console.log(output);

        displayMenu();
    })
};

function createDepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the department you woud like to create?",
                name: "department"
            },
            {
                type: "input",
                message: "What is the overhead of this deparment (ex. 5000)?",
                name: "overhead"
            },
        ])
        .then(answers => {

            var depName = answers.department;
            var overhead = parseInt(answers.overhead);

            connection.query("INSERT INTO departments SET ?",
                {
                    department_name: depName,
                    over_head_costs: overhead
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("You have succesfully added the " + depName + " department!");
                    displayMenu();
                });
        });
}