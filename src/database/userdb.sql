create database userdb;

create table [user] (
    user_id varchar(30) primary key,
    user_password varchar(128),
    user_first_name varchar(30),
    user_last_name varchar(30),
    user_email varchar(60),
    user_date_created timestamp default current_timestamp
);