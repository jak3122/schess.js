var Crazyhouse = require('../crazyhouse').Crazyhouse;
const readline = require('readline');
var game;

var game_num = 1;

function makeRandomMove() {
    var possibleMoves = game.moves();
    if (game.game_over() === true || game.in_draw() === true || possibleMoves.length === 0) {
        console.log("\nGame over.");
        console.log(game.fen());
        console.log(game.ascii());
        console.log(game.pgn());
        return false;
    }
    var randomIndex = Math.floor(Math.random() * possibleMoves.length);
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0, null);
    process.stdout.write(game.fen()+' '+possibleMoves[randomIndex]);
    game.move(possibleMoves[randomIndex]);
    //console.log("making move:", possibleMoves[randomIndex]);

    return true;
}

try {
    for (var i = 0; i < 100; i++) {
        console.log("------------ game #"+game_num+" ------------");
        game = new Crazyhouse({960: true});
        console.log("start:", game.fen());
        var r = makeRandomMove();
        while (r) {
            r = makeRandomMove();
        }
        console.log("\n");
        game_num++;
    }
} catch(err) {
    console.log(err);
    console.log(game.fen());
    console.log(game.pgn());
}
