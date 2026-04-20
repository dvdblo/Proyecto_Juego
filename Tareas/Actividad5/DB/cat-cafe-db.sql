DROP DATABASE IF EXISTS Cat_Cafe4;
CREATE DATABASE Cat_Cafe4;
USE Cat_Cafe4;

CREATE TABLE product (
	id_product INT AUTO_INCREMENT,
	product_name VARCHAR(40),
	img_url VARCHAR(2083),
	PRIMARY KEY  (id_product)
);

CREATE TABLE day (
	id_day INT AUTO_INCREMENT,
    day_name VARCHAR(9),
	PRIMARY KEY (id_day)
);

CREATE TABLE menu_day (
	id_product INT,
    id_day INT,
    FOREIGN KEY (id_product) REFERENCES product(id_product),
    FOREIGN KEY (id_day) REFERENCES day(id_day)
);

CREATE TABLE cat (
	id_cat INT AUTO_INCREMENT,
    cat_name VARCHAR(20),
    cat_age INT,
    description VARCHAR(100),
    img_url VARCHAR(2083),
	PRIMARY KEY (id_cat)
);

