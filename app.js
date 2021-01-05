const express = require('express');
var router = express.Router();
const app = express();
const port = 3000;

const server = app.listen(port, () => console.log(`Example API listening on port ${port}!`));
// const server = require('http').createServer(app);
const io = require('socket.io')(server);
const db = require("./db/database.js");

// MongoDB
// const mongo = require("mongodb").MongoClient;
// const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/chat";

// gbp = 1
var baserates = {
    sek: 0.09,
    usd: 0.73,
    eur: 0.89,
    chf: 0.82
}

io.on('connection', async function (socket) {
    console.info("User connected");
    try {
        // let res = await findInCollection(dsn, "posts", {}, {}, 0);
        io.emit('earlier chat', "result")
    } catch (err) {
        console.log(err);
    }

    // socket.on('chat message', async function (message) {
    //     io.emit('chat message', message);
    //     await saveToCollection(dsn, "posts", message);
    //     console.log(message);
    // });
});


app.get('/', function(req, res, next) {
    // var info = await getLatest();
    //
    // console.log("KKKKKKKKKKKKKK");
    // console.log(info);
    // // res.send('<h1>Hallo Welt</h1>');
    // await res.send(info);
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

            res.json({
                id: row.id,
                usd: newusd,
                chf: newchf,
                eur: neweur,
                gbp: newgbp,
                rate_date: row.rate_date
            });
            db.run("INSERT INTO currencies (chf, gbp, usd, eur) VALUES (?, ?, ?, ?)",
                [newchf, newgbp, newusd, neweur], (err) => {
                    if (err) {
                    console.log("---------HIBAHIBA-----------------------");
                    console.log(err);
                    }
                    // returnera korrekt svar
                });

            // return row.rate_date
            //     ? console.log(row.rate_date)
            //     : console.log(`No email found with the name`);
        });
    });
});

function randInt(min, max) { // function taken from https://www.w3schools.com/js/js_random.asp
    return Math.floor(Math.random() * (max - min) ) + min; // upper value not included
}

function getVariance() {
    return randInt(950, 1050) / 1000;
}
