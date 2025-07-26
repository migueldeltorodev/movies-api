CREATE TABLE IF NOT EXISTS ratings (
    userid uuid,
    movieid uuid REFERENCES movies (id),
    rating integer NOT NULL,
    PRIMARY KEY (userid, movieid));