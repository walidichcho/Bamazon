-- create database/if the name exist drop it and create new one
DROP DATABASE IF EXISTS bamazon ;

create database bamazon;

-- create a table in bamazon
use bamazon;

create table products(
	item_id int(4) auto_increment not null,
    product_name varchar(100) not null,
    departement_name varchar(100) not null,
    price decimal(10,2) not null,
    stock_quantity int null,
    primary key(item_id)

);

-- insert 10 data for 10 product
use bamazon;

insert into products(product_name, departement_name, price, stock_quantity)

values("Dell Computer", "electronics", 899.99, 20),

	 ("Samsung TV/55inch", "electronics", 680.56, 10),

	 ("wireless Headphones", "electronics", 239, 13),

	 ("Cuisinart Food Processor", "Kitchen", 69.99, 6),

	 ("KitchenAid Stand Mixer", "Kitchen", 199.99, 10),

	 ("Dining Set", "Furniture", 999.99, 7),

	 ("Leather Recliner", "Furniture", 619, 2),

	 ("Chanel Perfume", "Cosmetics", 125, 30),

	 ("Soccer Net", "Sports", 89.99, 28),
      
	 ("Bike", "Sports", 159.99, 15);
