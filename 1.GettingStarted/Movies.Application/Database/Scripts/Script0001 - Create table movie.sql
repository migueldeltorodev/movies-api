CREATE TABLE movies (
    id UUID PRIMARY KEY,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    yearofrelease integer NOT NULL);