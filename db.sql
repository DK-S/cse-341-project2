drop table if exists library;
drop table if exists mediatypes;
drop table if exists users;

create table users (id serial primary key not null
, firstname varchar(25)
, lastname varchar(25)
, username varchar(25)
, password varchar(255)
, admin boolean
);

create table mediatypes (id serial primary key not null
, type varchar(25)
);

create TABLE library (id serial primary key not null
, upc varchar(25)
, title varchar(50) not null
, location varchar(50)
, private boolean
, mediatypeid int references mediatypes(id)
, ownerid int references users(id)
, borrowerid int references users(id)
);

INSERT INTO users (firstname, lastname, admin) VALUES ('Donivan', 'Killpack', TRUE);

INSERT INTO mediatypes (type) VALUES ('VHS');
INSERT INTO mediatypes (type) VALUES ('DVD');
INSERT INTO mediatypes (type) VALUES ('BlueRay');
INSERT INTO mediatypes (type) VALUES ('Digital');

