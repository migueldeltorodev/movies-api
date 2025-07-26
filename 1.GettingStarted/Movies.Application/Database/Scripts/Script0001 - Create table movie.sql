CREATE TABLE IF NOT EXISTS movies (
    id UUID PRIMARY KEY,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    yearofrelease integer NOT NULL);