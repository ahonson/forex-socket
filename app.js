const express = require('express');
var router = express.Router();
const app = express();
const port = 3001;

const server = app.listen(port, () => console.log(`Example API listening on port ${port}!`));
// const server = require('http').createServer(app);
const io = require('socket.io')(server);
const db = require("./db/database.js");

var mydata = [9.32, 10.06, 11.13, 8.20];

io.on('connection', function (socket) {
    console.info("User connected");

    setInterval(() => {
        // getValues(socket);
        get10Values(socket);
    }, 5000);
});

app.get('/', function(req, res, next) {
    let sql = "SELECT * FROM currencies ORDER BY id DESC LIMIT 1;";

    db.serialize(function() {
        db.get(sql, (err, row) => {
            if (err) {
                return console.error(err.message);
            }
            var newusd = (row.usd * getVariance()).toFixed(2);
            var newchf = (row.chf * getVariance()).toFixed(2);
            var neweur = (row.eur * getVariance()).toFixed(2);
            var newgbp = (row.gbp * getVariance()).toFixed(2);
            var highestid = row.id;
            var limit = 40;

            res.json({
                id: row.id,
                usd: newusd,
                chf: newchf,
                eur: neweur,
                gbp: newgbp,
                rate_date: row.rate_date
            });
            insertValues(newchf, newgbp, newusd, neweur);
            deleteValues(limit, highestid);
        });
    });
});

async function getValues(socket) {
    let sql = "SELECT * FROM currencies ORDER BY id DESC LIMIT 1;";

    let res = await db.serialize(async function() {
        await db.get(sql, (err, row) => {
            if (err) {
                return console.error(err.message);
            }
            var newchf = Number((row.chf * getVariance()).toFixed(2));
            var neweur = Number((row.eur * getVariance()).toFixed(2));
            var newgbp = Number((row.gbp * getVariance()).toFixed(2));
            var newusd = Number((row.usd * getVariance()).toFixed(2));
            var highestid = row.id;
            var limit = 1000;
            var allValues = [newchf, neweur, newgbp, newusd];

            console.log("hajhaj", allValues);
            if (Math.max.apply(Math, allValues) > 14 || Math.min.apply(Math, allValues) < 4) {
                socket.emit('current rates', mydata);
                insertValues(9.32, 10.06, 11.13, 8.20);
                deleteValues(limit, highestid);
            } else {
                socket.emit('current rates', allValues);
                insertValues(newchf, neweur, newgbp, newusd);
                deleteValues(limit, highestid);
            }
            return row;
        });
    });
}

async function get10Values(socket) {
    let sql = "SELECT * FROM currencies ORDER BY id DESC LIMIT 10;";

    let res = await db.serialize(async function() {
        await db.all(sql, (err, rows) => {
            if (err) {
                return console.error(err.message);
            }
            if (rows) {
                console.log(rows);

                var newchf = Number((rows[0].chf * getVariance()).toFixed(2));
                var neweur = Number((rows[0].eur * getVariance()).toFixed(2));
                var newgbp = Number((rows[0].gbp * getVariance()).toFixed(2));
                var newusd = Number((rows[0].usd * getVariance()).toFixed(2));
                var highestid = rows[0].id;
                var limit = 1000;
                var allValues = [newchf, neweur, newgbp, newusd];

                console.log("hajhaj", allValues);
                if (Math.max.apply(Math, allValues) > 13 || Math.min.apply(Math, allValues) < 6) {
                    socket.emit('current rates', rows);
                    insertValues(9.32, 10.06, 11.13, 8.20);
                    deleteValues(limit, highestid);
                } else {
                    socket.emit('current rates', rows);
                    insertValues(newchf, neweur, newgbp, newusd);
                    deleteValues(limit, highestid);
                }
                return rows;
            }
        });
    });
}


function deleteValues(limit, highestid) {
    let sql1 = "SELECT COUNT(id) AS total FROM CURRENCIES";

    db.get(sql1, (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        if (row.total > limit) {
            let sql2 = "DELETE FROM currencies WHERE id < ?";
            let midlimit = highestid - limit / 2;

            db.run(sql2, [midlimit], (err) => {
                    if (err) {
                    console.log(err);
                    }
            });
        }
    });
}

function insertValues(newchf, neweur, newgbp, newusd) {
    let sql = "INSERT INTO currencies (chf, eur, gbp, usd) VALUES (?, ?, ?, ?)";

    db.run(sql, [newchf, neweur, newgbp, newusd], (err) => {
            if (err) {
            console.log(err);
            }
    });
}

function randInt(min, max) { // function taken from https://www.w3schools.com/js/js_random.asp
    return Math.floor(Math.random() * (max - min) ) + min; // upper value not included
}

function getVariance() {
    return randInt(950, 1050) / 1000;
}
