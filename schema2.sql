USE bamazon;

CREATE TABLE departments(
 department_id INT NOT NULL AUTO_INCREMENT,
 department_name VARCHAR(100) NULL,
 over_head_costs INTEGER(15) NULL,
 PRIMARY KEY (department_id)
);

ALTER TABLE products
ADD COLUMN product_sales DECIMAL(15,2) NULL;

select * from departments;
select * from products