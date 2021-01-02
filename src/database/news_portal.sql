create database news_portal;

create table  [news] (
	id_news int not null primary key,
    title varchar(100),
    news text,
    date_created timestamp default current_timestamp
);

insert into news (title, news)
values ('other title', 'lorem ipsum');

select * from news;

create table [user_enabled] (
	user_enabled_id varchar(30) primary key	
);