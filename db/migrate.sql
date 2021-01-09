--
-- Drop and create all tables in the correct order
--
DROP TABLE IF EXISTS currencies;

CREATE TABLE IF NOT EXISTS currencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chf FLOAT,
    eur FLOAT,
    gbp FLOAT,
    usd FLOAT,
    rate_date NUMERIC DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO currencies (chf, eur, gbp, usd) VALUES (9.32, 10.06, 11.13, 8.20);
INSERT INTO currencies (chf, eur, gbp, usd) VALUES (9.32, 10.06, 11.13, 8.20);
INSERT INTO currencies (chf, eur, gbp, usd) VALUES (9.32, 10.06, 11.13, 8.20);
INSERT INTO currencies (chf, eur, gbp, usd) VALUES (9.32, 10.06, 11.13, 8.20);
INSERT INTO currencies (chf, eur, gbp, usd) VALUES (9.32, 10.06, 11.13, 8.20);
INSERT INTO currencies (chf, eur, gbp, usd) VALUES (9.32, 10.06, 11.13, 8.20);
INSERT INTO currencies (chf, eur, gbp, usd) VALUES (9.32, 10.06, 11.13, 8.20);
INSERT INTO currencies (chf, eur, gbp, usd) VALUES (9.32, 10.06, 11.13, 8.20);
INSERT INTO currencies (chf, eur, gbp, usd) VALUES (9.32, 10.06, 11.13, 8.20);
INSERT INTO currencies (chf, eur, gbp, usd) VALUES (9.32, 10.06, 11.13, 8.20);
