# Socket-server for JS frameworks project at BTH fall 2020

This is an npm project using the following technologies: express (4.17.1) and socket.io (3.0.4).

## Redovisningstext för kmom10

När en användare är ansluten till denna socket-server (som är skriven i node.js och express) får hen simulerade valutakurser var femte sekund. Värdena hämtas, simuleras och sparas sedan i en sqlite databas med en enda tabell: currencies. Jag känner mig bekvämast med relationsdatabaser så jag valde att byta från mongoDB (som jag använde i kmom06) till sqlite.

När det gäller modulen socket.io märkte jag att den nyaste versionen (3.0.5) inte var kompatibel med arbetssättet jag ärvt från kmom06 så jag blev tvungen att använda v2.3.0 i stället.

När tabellen `currencies` når en viss storlek anropas en funktion som raderar 50 % av raderna så att databasen inte går överstyr.

Initialt fick jag problem med att varje ny användare som anslöt sig till servern genererade nya värden som sedan sparades i databasen. Det kunde då förekomma att ett stort antal rader sparades varje sekund. Lösningen var att köra `clearInterval` när en anslutning bröts samt att kolla hur många som var uppkopplade (`io.engine.clientsCount`) och utifrån detta bestämma om värdena bara ska hämtas från databasen eller också simuleras och sparas på nytt.

## Project setup

Run `npm install` to create a `node_modules` directory, which contains all dependencies needed to run the project.

## Run the project

`node app.js` runs the project.
