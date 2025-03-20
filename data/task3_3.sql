-- TODO Task 3
drop database if exists ecommerce;

create database ecommerce;
use ecommerce;

create table userOrder (
    order_id varchar(26) not null,
    customer_name varchar(55) not null,
    address varchar(55) not null,
    priority boolean default false,
    comments varchar(256),
    constraint pk_order_id primary key (order_id)
);

create table cart (
    prodId varchar(256) not null,
    quantity int not null,
    product_name varchar(256) not null,
    price float not null,
    order_id varchar(26) not null,
    constraint pk_prodId primary key (prodId),
    constraint fk_order_id foreign key (order_id) references userOrder(order_id)
);