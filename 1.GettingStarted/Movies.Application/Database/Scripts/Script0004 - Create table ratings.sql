CREATE TABLE ratings (
    userid uuid,
    movieid uuid REFERENCES movies (id),
    rating integer NOT NULL,
    PRIMARY KEY (userid, movieid));