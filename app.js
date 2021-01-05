const express = require('express');
const app = express();
const port = 3000;

const server = app.listen(port, () => console.log(`Example API listening on port ${port}!`));
// const server = require('http').createServer(app);
const io = require('socket.io')(server);

// MongoDB
// const mongo = require("mongodb").MongoClient;
// const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/chat";

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

app.get('/', (req, res) => {
  res.send('<h1>Hallo Welt</h1>');
});
