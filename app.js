const express = require('express');
var router = express.Router();
const app = express();
const port = 3000;

const server = app.listen(port, () => console.log(`Example API listening on port ${port}!`));
// const server = require('http').createServer(app);
const io = require('socket.io')(server);
const db = require("./db/database.js");

io.on('connection', async function (socket) {
    console.info("User connected");

    // setInterval(() => {
    //     var mydata = await getValues();
    //
    //     io.emit('current rates', mydata);
    // }, 5000);

    var mydata = await getValues();

    io.emit('current rates', mydata);

    // try {
    //     // let res = await findInCollection(dsn, "posts", {}, {}, 0);
    //     io.emit('earlier chat', "result")
    // } catch (err) {
    //     console.log(err);
    // }

    // socket.on('chat message', async function (message) {
    //     io.emit('chat message', message);
    //     await saveToCollection(dsn, "posts", message);
    //     console.log(message);
    // });
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

function getValues() {
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

            // insertValues(newchf, newgbp, newusd, neweur);
            // deleteValues(limit, highestid);
            return row;
        });
    });
}

function deleteValues(limit, highestid) {
    let sql1 = "SELECT COUNT(id) AS total FROM CURRENCIES";

    db.get(sql1, (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        // console.log("SSSSSSSSSSSSSSSSSS");
        // console.log(row.total, limit);
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

function insertValues(newchf, newgbp, newusd, neweur) {
    let sql = "INSERT INTO currencies (chf, gbp, usd, eur) VALUES (?, ?, ?, ?)";

    db.run(sql, [newchf, newgbp, newusd, neweur], (err) => {
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
