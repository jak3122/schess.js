if (typeof require != "undefined") {
    var chai = require('chai');
    var Crazyhouse = require('../crazyhouse').Crazyhouse;
}

var assert = chai.assert;

describe("Single Square Move Generation", function() {

    var positions = [
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR SSSSSSSSssssssss EHeh w KQkq - 0 1',
        square: 'e2', verbose: false, moves: ['e3', 'e4']},
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1',
        square: 'e9', verbose: false, moves: []},  // invalid square
    {fen: 'rnbqk1nr/pppp1ppp/4p3/8/1b1P4/2N5/PPP1PPPP/R1BQKBNR/ w KQkq - 4 3',
        square: 'c3', verbose: false, moves: []},  // pinned piece
    {fen: 'r1bqk2r/ppppbppp/2n2n2/4p3/2BPP3/2N2N2/PPP2PPP/R1BQK2R/ b KQkq - 9 5',
        square: 'e5', verbose: false, moves: ['exd4']},  // pawn capture
    {fen: 'r1bqk2r/ppppbppp/2n2n2/8/2BNP3/2N5/PPP2PPP/R1BQK2R/Pp b KQkq - 11 6',
        square: 'c6', verbose: false, moves: ['Ne5', 'Nxd4', 'Nb4', 'Na5', 'Nb8']},
    {fen: 'r1b1kbnr/1PQ1pppp/p1p1b3/8/1P6/P1N4p/2PP1PqP/R1B1K1NR/NPp w KQkq - 24 13',
        square: 'b7', verbose: false, moves: ['bxa8=Q', 'bxa8=R', 'bxa8=B', 'bxa8=N',
        'b8=Q', 'b8=R', 'b8=B', 'b8=N',
        'bxc8=Q+', 'bxc8=R+', 'bxc8=B', 'bxc8=N']},  // promotion
    {fen: 'r1b1k2r/ppp2ppp/2n2n2/3qP3/1b6/2NQ1N2/PPP2PPP/R1B1KB1R/Ppp b KQkq - 15 8',
        square: 'e8', verbose: false, moves: ['Kf8', 'Ke7', 'Kd7', 'Kd8', 'O-O']},  // castling
    {fen: 'r1b1k1r1/ppp2pPp/2n2P2/3q4/8/2Pp1N2/P1P2PPP/R1B1KB1R/QBPnnp b KQq - 27 14',
        square: 'e8', verbose: false, moves: ['Kd7', 'Kd8']},  // no castling
    {fen: '1r3r2/1pp2pk1/p4q1p/P3B3/2B5/2PP2BP/1P2n1P1/3b1nK1/NPPPqrrppn w - - 58 30',
        square: 'g1', verbose: false, moves: ['Kh1']},
    {fen: 'B4r1k/p1p1Npbp/1p2pN1p/6n1/8/1P4PP/P1P1nP1K/R4n~2/RQrbppbq w - - 70 36',
        square: 'h2', verbose: false, moves: ['Kh1', 'Kg2']},
    {fen: 'B4r1k/p1p1Npbp/1p2pN1p/6n1/8/1P4PP/P1P1nP1K/R4n~2/RQrbppbq w - - 70 36',
        square: 'a1', verbose: false, moves: ['Rxf1']},
    {fen: 'r1bqk2r/ppp1bppp/3p1nn1/8/3NPP2/1BN5/PPP3PP/R1BQK2R/Pp w KQkq - 16 9',
        square: 'e1', verbose: false, moves: ['Kd2', 'Ke2', 'Kf2', 'Kf1', 'O-O']}
    ];

    positions.forEach(function(position) {
        it(position.fen+' '+position.square, function() {
            var game = new Crazyhouse();
            game.load(position.fen);
            assert.equal(game.fen(), position.fen, 'gen fen: '+game.fen());
            var gen_moves = game.moves({square: position.square});
            var new_fen = game.fen();
            assert.equal(gen_moves.length, position.moves.length, new_fen + " " + gen_moves.join(','));
            gen_moves.forEach(function(move) {
                assert.include(position.moves, move);
            });
        });

    });

});

describe("Move generation", function() {
    var game = new Crazyhouse();
    var tests = [
    { fen: '1r3r2/1pp2pk1/p4q1p/P3B3/2B5/2PP2BP/1P2n1P1/3b1nK1/NPPPqrrppn w - - 58 30',
        moves: ['Kh1'] },
    { fen: 'rnb1kb1r/ppp1pppp/5n2/8/7q/2N2P2/PPPPN1PP/R1BQKB1R/Pp w KQkq - 10 6',
        moves: ['g3', 'Ng3', '@f2', '@g3'] },
    { fen: 'rnb1kb1r/ppp1pppp/8/3N4/7q/5P2/PPPPN1PP/R1BQKB1R/NPp w KQkq - 12 7',
        moves: ['g3', 'Ng3', '@f2', '@g3', 'N@f2', 'N@g3'] },
    { fen: 'r1bq1rk1/1pp1npp1/1b1pbN1p/pP1Np3/P1B1P3/2PP1N2/5PPP/R2Q1RK1/ b - - 27 14',
        moves: ['gxf6', 'Kh8'] },
    { fen: '4r1nk/1pp1PNb1/1b1pb1pp/pP2p3/P3P2Q/2PP4/5PPP/R2Q1RK1/Bnrn b - - 53 27',
        moves: ['Bxf7', 'Kh7'] },
    { fen: '5nnk/1ppbr1bb/3p1pN1/pP1Pp1pB/P3Pp1N/2PP4/6PP/R2Q2K1/qrr b - - 79 40',
        moves: ['Bxg6', 'Nxg6'] },
    { fen: '5nnk/1ppbr1b1/3p1pN1/pP1Pp1pB/P3Pp2/2PP4/6PP/R2Q2K1/Bnqrr b - - 81 41',
        moves: ['Nxg6', 'Kh7'] },
    { fen: '6nk/1ppbr1b1/3p1pBr/pP1Pp1pB/P3Pp2/2PPq3/6PP/R2Q2K1/Nnnr w - - 86 44',
        moves: ['Kf1', 'Kh1', 'N@f2'] },
    { fen: 'r4rk1/pp1q1ppB/3pbp2/4r3/2P1Q3/1P3PPP/P3nPBK/5R2/NPPBnpn b - - 53 27',
        moves: ['Kh8'] },
    { fen: 'r4r1k/pp3pP1/3p2n1/5NPB/2P1p3/1Pb2pPP/P3BPBK/5R2/PQPnnrq b - - 83 42',
        moves: ['Bxg7', 'Kg8', 'Kh7'] },
    { fen: 'r4r1k/pp3pn1/3p2nQ/5NPB/2P1p3/1P3pPP/P3BPBK/5R2/BPppnrq b - - 89 45',
        moves: ['Kg8', '@h7', 'N@h7', 'R@h7', 'Q@h7'] }
    ];
    tests.forEach(function(test) {
        it(test.fen, function() {
            game.load(test.fen);
            var in_hand = game.get_hand().w;
            var gen_moves = game.moves();
            assert.equal(gen_moves.length, test.moves.length, gen_moves.join(', ')+", w-hand: "+in_hand);
            test.moves.forEach(function(move) {
                assert.include(gen_moves, move);
            });
        });
    });
});

describe("In Check", function() {
    var game = new Crazyhouse();
    var fens = [
        'B4r1k/p1p1Npbp/1p2pN1p/6n1/8/1P4PP/P1P1nP1K/R4n~2/RQrbppbq w - - 70 36',
        'r4rk1/pp3p1R/3p1NBP/5n2/2P1p3/1P3pPP/P3BPBK/5R2/BPnqppnq b - - 97 49'
    ];
    fens.forEach(function(fen) {
        it(fen, function() {
            game.load(fen);
            assert(game.in_check());
        });
    });
});

describe("Checkmate", function() {

    var game = new Crazyhouse();
    var checkmates = [
        '3Nqr2/pBp2p2/1b1p1p1k/4p1p1/1P6/2PP1P2/Pp3PbP/5qK1/NRNrprnb w - - 88 45',
        'r5rk/pp3Npp/8/2p2b2/1p6/7p/PPP1NpBP/R1B2R1K/PPPBPNqnq b - - 51 26',
        'r6k/ppp1bpNp/3p1n1N/4p1n1/2P1P3/2P1bP1q/P3B1pP/R4R1K/PPQrb w - - 56 29',
        'Qnkr3r/nPp1bpp1/p2pP3/1p3PN1/P2P4/2P5/3bB2P/1R3R1K/BNqppp b - - 55 28',
        'r4rk1/pp3p1R/3p1NBP/5n2/2P1p3/1P3pPP/P3BPBK/5R2/BPnqppnq b - - 97 49'
    ];

    checkmates.forEach(function(checkmate) {
        game.load(checkmate);

        it(checkmate, function() {
            assert(game.in_checkmate());
        });
    });

});



describe("Stalemate", function() {

    var stalemates = [
        '7k/4Q~3/8/5Q~2/1Q~5P/PPPP1P1P/P1PNRPRP/Q4K2/BBPNPNBRNRBQ b - - 98 77',
        '1rrrkn~2/1pppn~n~n~1/p1p1ppq1/pb1bp2r/1ppp4/4b3/4q3/K7/nbnnn w - - 98 121',
        '5b1r/ppr1k3/3p1p2/5b2/1p1Kb3/4P3/q5q1/n7/pppppppnpnnrbprp w - - 72 37',
        'r3r3/8/2p2kp1/p2p1bpp/3n~4/1n~K5/7q/8/pppnpppnbpbrpnbqrn w - - 98 57'
    ];

    stalemates.forEach(function(stalemate) {
        var game = new Crazyhouse();
        game.load(stalemate);

        it(stalemate, function() {
            assert(game.in_stalemate())
        });

    });

});


describe("Threefold Repetition", function() {

    var positions = [
    {fen: 'Bn3r2/p1ppqp1k/1p2p2p/7N/KB4P1/1PP4P/P1P1QP2/1rb5/NRBPRPn b - - 63 32',
        moves: ['N@b2', 'Ka3', 'Nc4', 'Ka4', 'Nb2', 'Ka3', 'Nc4', 'Ka4', 'Nb2']},
    {fen: 'r1b1k2r/pppp2p1/1b5p/1N1Nnp2/8/2P5/P1PKP1PP/R2Q1B1R/NQBPpp b kq - 27 14',
        moves: ['Nc4', 'Kd3', 'Nb2', 'Kd2', 'Nc4', 'Kd3', 'Ne5', 'Kd2', 'Nc4']},
    {fen: 'r2q3r/pbpPNkp1/1pp1p1N1/1B2p3/8/5P1p/P1P2P1P/R4RK1/PBBNPqn w - - 58 30',
        moves: ['N@g5', 'Kf6', 'Ne4', 'Kf7', 'Ng5', 'Kf6', 'Ne4', 'Kf7', 'Ng5']},
    ];

    positions.forEach(function(position) {
        var game = new Crazyhouse();
        game.load(position.fen);

        it(position.fen, function() {

            var passed = true;
            for (var j = 0; j < position.moves.length; j++) {
                if (game.in_threefold_repetition()) {
                    passed = false;
                    break;
                }
                game.move(position.moves[j]);
            }

            assert(passed && game.in_threefold_repetition() && game.in_draw());

        });

    });

});


describe("Algebraic Notation", function() {

    var positions = [
    {fen: 'B4r1k/p1p1Npbp/1p2pN1p/6n1/8/1P4PP/P1P1nP1K/R4n~2/RQrbppbq w - - 70 36',
        moves: ['Rxf1', 'Kg2', 'Kh1']},
    {fen: 'r1bqk1nr/pppp1ppp/4p1n1/1N2P3/5P1b/1BN5/PPP3PP/R1BQK2R/P w KQkq - 20 11',
        moves: ['Kd2', 'Ke2', 'Kf1', 'g3', '@g3', '@f2']},
    ];

    positions.forEach(function(position) {
        var game = new Crazyhouse();
        var passed = true;
        game.load(position.fen);

        it(position.fen, function() {
            var moves = game.moves();
            assert.equal(moves.length, position.moves.length);
            moves.forEach(function(gen_move) {
                assert.include(position.moves, gen_move);
            });
            position.moves.forEach(function(move) {
                assert.include(moves, move);
            });
        });

    });

});


describe("Get/Put/Remove", function() {

    var game = new Crazyhouse();
    var passed = true;
    var positions = [
    {pieces: {a7: {type: game.PAWN, color: game.WHITE},
                 b7: {type: game.PAWN, color: game.BLACK},
                 c7: {type: game.KNIGHT, color: game.WHITE},
                 d7: {type: game.KNIGHT, color: game.BLACK},
                 e7: {type: game.BISHOP, color: game.WHITE},
                 f7: {type: game.BISHOP, color: game.BLACK},
                 g7: {type: game.ROOK, color: game.WHITE},
                 h7: {type: game.ROOK, color: game.BLACK},
                 a6: {type: game.QUEEN, color: game.WHITE},
                 b6: {type: game.QUEEN, color: game.BLACK},
                 a4: {type: game.KING, color: game.WHITE},
                 h4: {type: game.KING, color: game.BLACK}},
                 should_pass: true},

    /*
    {pieces: {a7: {type: 'z', color: game.WHTIE}}, // bad piece
        should_pass: false},

    {pieces: {j4: {type: game.PAWN, color: game.WHTIE}}, // bad square
        should_pass: false},
        */

    /* disallow two kings (black) */
    /*
    {pieces: {a7: {type: game.KING, color: game.BLACK},
                 h2: {type: game.KING, color: game.WHITE},
                 a8: {type: game.KING, color: game.BLACK}},
                 should_pass: false},
                 */

    /* disallow two kings (white) */
    /*
    {pieces: {a7: {type: game.KING, color: game.BLACK},
                 h2: {type: game.KING, color: game.WHITE},
                 h1: {type: game.KING, color: game.WHITE}},
                 should_pass: false},
                 */

    /* allow two kings if overwriting the exact same square */
    {pieces: {a7: {type: game.KING, color: game.BLACK},
                 h2: {type: game.KING, color: game.WHITE},
                 h2: {type: game.KING, color: game.WHITE}},
                 should_pass: true},
    ];

    positions.forEach(function(position) {

        passed = true;
        game.clear();

        it("position should pass - " + position.should_pass, function() {

            /* places the pieces */
            for (var square in position.pieces) {
                var p = game.put(position.pieces[square], square);
                if (position.should_pass)
                    assert.isTrue(p, square+' '+position.pieces[square].color+' '+position.pieces[square].type);
                else
                    assert.isFalse(p);
            }

            /* iterate over every square to make sure get returns the proper
             * piece values/color
             */
            for (var j = 0; j < game.SQUARES.length; j++) {
                var square = game.SQUARES[j];
                if (square in position.pieces) {
                    var piece = game.get(square);
                    assert.equal(position.pieces[square].type, piece.type);
                    assert.equal(position.pieces[square].color, piece.color);
                } else {
                    assert.isNotOk(game.get(square));
                }
            }

            /* remove the pieces */
            for (var j = 0; j < game.SQUARES.length; j++) {
                var square = game.SQUARES[j];
                var piece = game.remove(square);
                if (square in position.pieces) {
                    assert.equal(position.pieces[square].type, piece.type);
                    assert.equal(position.pieces[square].color, piece.color);
                } else {
                    assert.isNotOk(piece);
                }
            }

            /* finally, check for an empty board */
            assert.equal('8/8/8/8/8/8/8/8/ w - - 0 1', game.fen());
        });

    });

});


describe("FEN", function() {

    var positions = [
    {fen: '8/8/8/8/8/8/8/8/ w - - 0 1', should_pass: true},
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1', should_pass: true},
    {fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR/ b KQkq e3 0 1', should_pass: true},
    {fen: '1nbqkbn1/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/1NBQKBN1/ b - - 1 2', should_pass: true},
    {fen: 'r1bqk1nr/pppp1ppp/4p1n1/1N2P3/5P1b/1BN5/PPP3PP/R1BQK2R/P w KQkq - 20 11', should_pass: true},
    {fen: 'B4r1k/p1p1Npbp/1p2pN1p/6n1/8/1P4PP/P1P1nP1K/R4n~2/RQrbppbq w - - 70 36', should_pass: true},
    {fen: 'r4r1k/ppp2Bpp/2np1p2/4pb1B/5p2/3P4/PPP2QPP/RN1K3R/NPNqb w - - 34 18', should_pass: true},
    {fen: 'r6k/ppp2Ppp/2np1p1b/8/4P2Q/5P2/PPP1p1pP/RN1KR3/RBBBNNq w - - 66 34', should_pass: true},

    /* incomplete FEN string */
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBN/ w KQkq - 0 1', should_pass: false},

    /* bad digit (9)*/
    {fen: 'rnbqkbnr/pppppppp/9/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1', should_pass: false},

    /* bad piece (X)*/
    {fen: '1nbqkbn1/pppp1ppX/8/4p3/4P3/8/PPPP1PPP/1NBQKBN1/ b - - 1 2', should_pass: false},
    ];

    positions.forEach(function(position) {
        var game = new Crazyhouse();

        it(position.fen + ' (' + position.should_pass + ')', function() {
            game.load(position.fen);
            if (position.should_pass) {
                var validation = game.validate_fen(position.fen);
                assert(validation.valid, validation.error);
                assert.equal(game.fen(), position.fen);
            } else {
                assert.notEqual(game.fen(), position.fen);
            }
        });

                });

        });


describe("PGN", function() {
    this.timeout(10000);

    var passed = true;
    var error_message;
    var positions = [
        // https://en.ligame.org/jHTaSp5G
    {moves: ['e4', 'e6', 'Nc3', 'b6', 'd4', 'Bb7',
        'Bd3', 'Nf6','Nge2', 'Bb4','f3', 'd6',
        'O-O', 'Nbd7', 'Qe1', 'O-O', 'Qg3',
        'Kh8', 'Bg5', 'Rg8', 'e5', 'dxe5',
        'dxe5', 'Nxe5', 'Qxe5', 'Bd6', 'Qe3',
        'P@h6', 'Bh4', 'P@g5', 'P@e5', 'Bxe5',
        'Qxe5', 'gxh4', 'B@d4', 'B@d6', 'Qe3',
        'P@g3', 'hxg3', 'hxg3', 'P@e5', 'c5',
        'exf6', 'cxd4', 'fxg7+', 'Rxg7', 'Qxd4',
        'B@c5', 'Nxg3', 'Bxd4+', 'P@f2', 'Bxg3',
        'P@h2', 'Bxh2+', 'Kh1', 'P@h3', 'N@e1',
        'Bxf3', 'Be4', 'hxg2+', 'Nxg2', 'Bxg2+',
        'Bxg2', 'Rxg2', 'N@h4', 'Qxh4', 'P@g7+',
        'Bxg7', 'B@h3', 'Bhe5', 'Kxg2', 'Qxh3+',
        'Kxh3', 'Q@h2+', 'Kg4', 'B@h5#'],
        header: ['White', 'mastertan', 'Black', 'JannLee'],
        max_width: 19,
        newline_char: '<br />',
        pgn: '[White "mastertan"]<br />[Black "JannLee"]<br /><br />1. e4 e6 2. Nc3 b6<br />3. d4 Bb7 4. Bd3 Nf6<br />5. Nge2 Bb4 6. f3 d6<br />7. O-O Nbd7<br />8. Qe1 O-O<br />9. Qg3 Kh8<br />10. Bg5 Rg8<br />11. e5 dxe5<br />12. dxe5 Nxe5<br />13. Qxe5 Bd6<br />14. Qe3 @h6<br />15. Bh4 @g5<br />16. @e5 Bxe5<br />17. Qxe5 gxh4<br />18. B@d4 B@d6<br />19. Qe3 @g3<br />20. hxg3 hxg3<br />21. @e5 c5<br />22. exf6 cxd4<br />23. fxg7+ Rxg7<br />24. Qxd4 B@c5<br />25. Nxg3 Bxd4+<br />26. @f2 Bxg3<br />27. @h2 Bxh2+<br />28. Kh1 @h3<br />29. N@e1 Bxf3<br />30. Be4 hxg2+<br />31. Nxg2 Bxg2+<br />32. Bxg2 Rxg2<br />33. N@h4 Qxh4<br />34. @g7+ Bxg7<br />35. B@h3 Bhe5<br />36. Kxg2 Qxh3+<br />37. Kxh3 Q@h2+<br />38. Kg4 B@h5#',
        fen: 'r6k/p4pbp/1p2p2p/4b2b/6K1/2N5/PPP2P1q/R4R2/QRPpnbnppnpp w - - 76 39'}
    ];


    positions.forEach(function(position, i) {

        it(i.toString(), function() {
            var game = new Crazyhouse();
            if ("starting_position" in position) { game.load(position.starting_position); }
            passed = true;
            error_message = "";
            for (var j = 0; j < position.moves.length; j++) {
                if (game.move(position.moves[j]) === null) {
                    error_message = "move() did not accept " + position.moves[j] + " : ";
                    break;
                }
            }

            game.header.apply(null, position.header);
            var pgn = game.pgn({max_width:position.max_width, newline_char:position.newline_char});
            var fen = game.fen();
            assert.equal(error_message.length, 0, error_message);
            assert.equal(position.pgn, pgn);
            assert.equal(position.fen, fen);
        });

    });

});


describe("Load PGN", function() {

    var game = new Crazyhouse();
    var tests = [
    {pgn: [
        '[Event "Rated game"]',
        '[Site "https://ligame.org/4JwLWPnm"]',
        '[Date "2017.03.07"]',
        '[White "JannLee"]',
        '[Black "mastertan"]',
        '[Result "1-0"]',
        '[WhiteElo "2766"]',
        '[BlackElo "2567"]',
        '[PlyCount "39"]',
        '[Variant "Crazyhouse"]',
        '[TimeControl "60+0"]',
        '[ECO "?"]',
        '[Opening "?"]',
        '[Termination "Normal"]',
        '[Annotator "ligame.org"]',
        '',
        '1. e4 e6 2. Nc3 a6 3. d4 b5 4. Bd3 Bb7 5. Qe2 b4 6. Nd1 c5',
        '7. dxc5 Bxc5 8. Nf3 Nc6 9. O-O Nf6 10. e5 Ng4 11. Be3 Bxe3',
        '12. Nxe3 Ngxe5 13. Nxe5 Nxe5 14. N@d6+ Kf8 15. Nxb7 @f3',
        '16. B@d6+ Kg8 17. Bxe5 fxe2 18. Nxd8 exf1=Q+ 19. Rxf1 R@g5',
        '20. Q@e8+ 1-0'],
        expect: true}
    ];

    var newline_chars = ['\n', '<br />', '\r\n', 'BLAH'];

    tests.forEach(function(t, i) {
        newline_chars.forEach(function(newline, j) {
            it(i + String.fromCharCode(97 + j), function() {
                var sloppy = t.sloppy || false;
                var result = game.load_pgn(t.pgn.join(newline), {sloppy: sloppy,
                    newline_char: newline});
                var should_pass = t.expect;

                /* some tests are expected to fail */
                if (should_pass) {

                    /* some PGN's tests contain comments which are stripped during parsing,
                     * so we'll need compare the results of the load against a FEN string
                     * (instead of the reconstructed PGN [e.g. test.pgn.join(newline)])
                     */
                    if ('fen' in t) {
                        assert(result && game.fen() == t.fen);
                    } else {
                        var gen_pgn = game.pgn({max_width:65, newline_char:newline,});
                        assert.equal(gen_pgn, t.pgn.join(newline));
                        //assert(result && game.pgn({ max_width: 65, newline_char: newline }) == t.pgn.join(newline));
                    }

                } else {
                    /* this test should fail, so make sure it does */
                    assert.equal(result, should_pass);
                }
            });

        });

    });

});


describe("Make Move", function() {

    var positions = [
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1',
        legal: true,
        move: 'e4',
        next: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR/ b KQkq - 1 1'},
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1',
        legal: false,
        move: 'e5'},
    {fen: 'r1bqk2r/ppppbppp/2n2n2/4p3/2BPP3/2N2N2/PPP2PPP/R1BQK2R/ b KQkq - 9 5',
        legal: true,
        move: 'exd4',
        captured: 'p',
        next: 'r1bqk2r/ppppbppp/2n2n2/8/2BpP3/2N2N2/PPP2PPP/R1BQK2R/p w KQkq - 10 6'},
    ];

    positions.forEach(function(position) {
        var game = new Crazyhouse();
        game.load(position.fen);
        it(position.fen + ' (' + position.move + ' ' + position.legal + ')', function() {
            var result = game.move(position.move);
            if (position.legal) {
                assert.isOk(result);
                assert.equal(position.next, game.fen(), "result move: "+result.san);
                assert.equal(position.captured, result.captured);
            } else {
                assert.isNotOk(result);
            }
        });
                });
        });

describe("Castling", function() {
    var tests = [
    { start_fen: "r1bqk3/ppp2ppr/2n1p1n1/3pP2B/3Pp3/2P3P1/PP4P1/RNBQK2R/BPn w KQq - 26 14",
        moves: ['O-O'],
        end_fen: "r1bqk3/ppp2ppr/2n1p1n1/3pP2B/3Pp3/2P3P1/PP4P1/RNBQ1RK1/BPn b q - 27 14" }
    ];
    tests.forEach(function(test) {
        var game = new Crazyhouse();
        it(test.start_fen+' '+test.moves.join(', '), function() {
            game.load(test.start_fen);
            assert.equal(test.start_fen, game.fen());
            test.moves.forEach(function(move) {
                game.move(move);
            });
            assert.equal(test.end_fen, game.fen());
            test.moves.forEach(function() {
                game.undo();
            });
            assert.equal(test.start_fen, game.fen());
        });
    });
});


describe("Validate FEN", function() {

    var game = new Crazyhouse();
    var positions = [
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/w KQkq - 0 1',   error_number: 1},
    ];

    positions.forEach(function(position) {

        it(position.fen + ' (valid: ' + (position.error_number  == 0) + ')', function() {
            var result = game.validate_fen(position.fen);
            assert(result.error_number == position.error_number, result.error_number);
        });

                });
        });

    describe("Undo", function() {
        var tests = [
        {fen: 'r1bqk2r/ppppbppp/2n2n2/4p3/2BPP3/2N2N2/PPP2PPP/R1BQK2R/ b KQkq - 9 5',
            move: 'exd4',
            next_fen: 'r1bqk2r/ppppbppp/2n2n2/8/2BpP3/2N2N2/PPP2PPP/R1BQK2R/p w KQkq - 10 6'},
        {fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR/ b KQkq - 1 1',
            move: 'd5',
            next_fen: 'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR/ w KQkq - 2 2'},
        {fen: 'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR/ w KQkq - 2 2',
            move: 'exd5',
            next_fen: 'rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR/P b KQkq - 3 2'},
        {fen: 'rnb1kbnr/1pp1pppp/p7/q7/1P6/P1N5/2PP1PPP/R1BQKBNR/Pp b KQkq - 9 5',
            move: 'Qe5+',
            next_fen: 'rnb1kbnr/1pp1pppp/p7/4q3/1P6/P1N5/2PP1PPP/R1BQKBNR/Pp w KQkq - 10 6'},
        {fen: 'rnb1kbnr/1pp1pppp/p7/8/1P6/P1N5/2PPBPPP/R1B1K1NR/QPqp b KQkq - 13 7',
            move: 'Q@g6',
            next_fen: 'rnb1kbnr/1pp1pppp/p5q1/8/1P6/P1N5/2PPBPPP/R1B1K1NR/QPp w KQkq - 14 8'}
        ];
        tests.forEach(function(test) {
            it(test.move, function() {
                var game = new Crazyhouse();
                game.load(test.fen);
                game.move(test.move);
                assert.equal(test.next_fen, game.fen());
                game.undo();
                assert.equal(test.fen, game.fen());
            });
        });


    });

describe("History", function() {

    var game = new Crazyhouse();
    var tests = [
    {verbose: false,
        fen: 'r1bqk2r/ppppbppp/2n2n2/4p3/2BPP3/2N2N2/PPP2PPP/R1BQK2R/ b KQkq - 9 5',
        moves: ['exd4']},
    {verbose: false,
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1',
        moves: ['e4', 'e6', 'Nc3', 'b6', 'd4', 'Bb7',
        'Bd3', 'Nf6','Nge2', 'Bb4','f3', 'd6',
        'O-O', 'Nbd7', 'Qe1', 'O-O', 'Qg3',
        'Kh8', 'Bg5', 'Rg8', 'e5', 'dxe5',
        'dxe5', 'Nxe5', 'Qxe5', 'Bd6', 'Qe3',
        '@h6', 'Bh4', '@g5', '@e5', 'Bxe5',
        'Qxe5', 'gxh4', 'B@d4', 'B@d6', 'Qe3',
        '@g3', 'hxg3', 'hxg3', '@e5', 'c5',
        'exf6', 'cxd4', 'fxg7+', 'Rxg7', 'Qxd4',
        'B@c5', 'Nxg3', 'Bxd4+', '@f2', 'Bxg3',
        '@h2', 'Bxh2+', 'Kh1', '@h3', 'N@e1',
        'Bxf3', 'Be4', 'hxg2+', 'Nxg2', 'Bxg2+',
        'Bxg2', 'Rxg2', 'N@h4', 'Qxh4', '@g7+',
        'Bxg7', 'B@h3', 'Bhe5', 'Kxg2', 'Qxh3+',
        'Kxh3', 'Q@h2+', 'Kg4', 'B@h5#']}
    ];

    tests.forEach(function(t, i) {
        it(i.toString(), function() {
            var game = new Crazyhouse();
            game.load(t.fen);
            t.moves.forEach(function(move) {
                game.move(move);
            });
            var history = game.history({verbose: t.verbose});
            assert.equal(history.length, t.moves.length);
            t.moves.forEach(function(move) {
                assert.include(history, move);
            });
            history.forEach(function(move) {
                assert.include(t.moves, move);
            });
        });
    });
});

describe('Board Tests', function() {

    var tests = [
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1',
        board: [[{type: 'r', color: 'b'},
        {type: 'n', color: 'b'},
        {type: 'b', color: 'b'},
        {type: 'q', color: 'b'},
        {type: 'k', color: 'b'},
        {type: 'b', color: 'b'},
        {type: 'n', color: 'b'},
        {type: 'r', color: 'b'}],
        [{type: 'p', color: 'b'},
        {type: 'p', color: 'b'},
        {type: 'p', color: 'b'},
        {type: 'p', color: 'b'},
        {type: 'p', color: 'b'},
        {type: 'p', color: 'b'},
        {type: 'p', color: 'b'},
        {type: 'p', color: 'b'}],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [{type: 'p', color: 'w'},
        {type: 'p', color: 'w'},
        {type: 'p', color: 'w'},
        {type: 'p', color: 'w'},
        {type: 'p', color: 'w'},
        {type: 'p', color: 'w'},
        {type: 'p', color: 'w'},
        {type: 'p', color: 'w'}],
        [{type: 'r', color: 'w'},
        {type: 'n', color: 'w'},
        {type: 'b', color: 'w'},
        {type: 'q', color: 'w'},
        {type: 'k', color: 'w'},
        {type: 'b', color: 'w'},
        {type: 'n', color: 'w'},
        {type: 'r', color: 'w'}]]},
    ];


    tests.forEach(function(test) {
        it('Board - ' + test.fen, function() {
            var game = new Crazyhouse();
            game.load(test.fen);
            assert(JSON.stringify(game.board()) === JSON.stringify(test.board));
        })
    })
});

describe("Perft", function() {
    var perfts = [
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1',
        depth: 3, nodes: 8902},
    {fen: 'rnbqkbnr/pppp1ppp/8/8/3pP3/8/PPP2PPP/RNBQKBNR/p w KQkq - 4 3',
        depth: 3, nodes: 88606}
    ];

    perfts.forEach(function(perft) {
        var game = new Crazyhouse();
        game.load(perft.fen);

        it(perft.fen, function() {
            var nodes = game.perft(perft.depth);
            assert.equal(perft.nodes, nodes);
        });

    });
});

describe("Fake Pieces", function() {
    var tests = [
        { start_fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1',
          moves: '[Variant "Crazyhouse"]'+
              '1. e3 c6 2. Ke2 e5 3. e4 Qe7 4. h3 a5 '+
                  '5. Nf3 g5 6. a4 h5 7. Ke3 Nh6 8. Ra3 f6 '+
                  '9. Rd3 Qg7 10. Nh2 Na6 11. Qg4 Bc5+ 12. Ke2 b5 '+
                  '13. Rc3 hxg4 14. Kd1 Be3 15. b4 Qg6 16. Rxc6 O-O '+
                  '17. @b2 Kf7 18. Rc7 Q@h4 19. Bc4+ Ke8 20. Nf1 Nf5 '+
                  '21. b3 Rg8 22. c3 Qh8 23. Kc2 d6 24. Re7+ Kf8 '+
                  '25. Rg1 Bb6 26. d3 Bb7 27. Ba3 Bc8 28. Rxe5 Nh6 '+
                  '29. @a2 Qhg7 30. Nfd2 Rh8 31. g3 Bc5 32. Re7 Ba7 '+
                  '33. Rd1 Bd7 34. Bg8 Q6f7 35. bxa5 Bc5 36. Bh7 Qgg6 '+
                  '37. @d5 Rb8 38. Bg8 Rxg8 39. Re8+ Kxe8 40. Bb4 R@h5 '+
                  '41. Bxc5 Qgh7 42. B@f1 B@c1 43. Ba3 Bb2 44. d4 Qf5 '+
                  '45. Rc1 Bc8 46. axb5 Qa7 47. @h4 Rf8 48. Kd1 Qf4 '+
                  '49. Bxb2 Qf7 50. B@d7+ Bxd7 51. Kc2 Qxf2 52. c4 gxh3 '+
                  '53. Be2 f5 54. Rh1 Be6 55. a3 Rb6 56. Kd3 @f6 '+
                  '57. Bf3 B@g8 58. bxa6 @f4 59. N@a1 Qe7 60. Rf1 Qc7 '+
                  '61. Bc3 Bh7 62. axb6 Qxb6 63. R@g7 Qfxd4+ 64. Bxd4 @e5 '+
                  '65. Nc3 @g2 66. a7 Qxd4+ 67. Kc2 B@c5 68. Q@b1 Qg1 '+
                  '69. Bg4 fxg4 70. Nb5 B@a2 71. Rxh7 Qe3 72. B@f7+ Nxf7 '+
                  '73. Kc1 gxf1=Q+ 74. Kb2 B@d4+ 75. Nc3 R@d3 76. Rxf7 Kxf7 '+
                  '77. N@g7 Kg6 78. Nxf1 gxh4 79. b4 R@a4 80. @c2 @f3 '+
                  '81. Kxa2 Rg5 82. B@b3 Rg8 83. Qd1 Qf2 84. Nh2 Ra6 '+
                  '85. Nb1 Bxa7 86. b5 Bc3 87. Qf1 @d4 88. Qe1 Rf5 '+
                  '89. bxa6 Kh6 90. R@b6 Bc8 91. Ne6 Kg6 92. Rc6 Bxa1 '+
                  '93. gxf4 N@a5 94. Qc1 Kh6 95. Rb6 Qe2 96. @g5+ Rfxg5 '+
                  '97. Qe1 @c5 98. Qg3 R8g6 99. Nxg5 Rg7 100. Qg1 Qe3 '+
                  '101. a4 fxg5 102. Ka3 Qf2 103. Qe1 Bb2+ 104. Kxb2 N@b5 '+
                  '105. Na3 Bd7 106. B@d8 Rxb3+ 107. Ka2 B@e7 108. R@c3 Qe2 '+
                  '109. Nf1 Nb7 110. Ng3 Bb8 111. Qa1 gxf4 112. Bxe7 Na7 '+
                  '113. B@c8 @f5 114. Nxf5+ Kh7 115. Qd1 Bc6 116. Nh6 Be8 '+
                  '117. Nf5 Rf7 118. axb7 Qh2 119. Rd3 Bd7 120. N@h8 Rf6 '+
                  '121. @b4 Bb5 122. Ng6 Bc6 123. Bxd6 Qg2 124. Be6 Bxa4 '+
                  '125. Rc6 Qh1 126. Nge7 g3 127. Nxg3 Rf5 128. Ng6 Kh6 '+
                  '129. bxc5 Rh5 130. @g5+ Kg7 131. Be7 @b5 132. @b2 Bd6 '+
                  '133. Bg8 h2 134. Qc1 hxg3 135. Qa1 f2 136. Qb1 Bxe7 '+
                  '137. Re3 Rh4 138. @a5 N@b8 139. a6 Rb4 140. Nxh4 Bd8 '+
                  '141. R@h8 Bb3+ 142. Rxb3 Rxb3 143. g6 Ba5 144. Bf7 B@h7 '+
                  '145. B@h6+ Kxh6 146. Rd8 B@d2 147. Rg8 Qg2 148. cxb3 R@a8 '+
                  '149. R@f1 b4 150. Qa1 h1=B',
          promoted_fen: 'rn4R1/nP3B1b/P1R3Pk/b1PPp3/1pPpPp1N/NP4p1/KP1b1pq1/Q4R1b~/ w - - 300 151',
          more_moves: ['Qc1', 'Nd7', 'Rxh1'],
          captured_fen: 'r5R1/nP1n1B1b/P1R3Pk/b1PPp3/1pPpPp1N/NP4p1/KP1b1pq1/2Q4R/P b - - 303 152' }
    ];
    tests.forEach(function(test) {
        var game = new Crazyhouse();
        it(test.start_fen, function() {
            game.load(test.start_fen);
            assert.equal(test.start_fen, game.fen());
            game.load_pgn(test.moves);
            assert.equal(test.promoted_fen, game.fen());
            test.more_moves.forEach(function(move) {
                game.move(move);
            });
            assert.equal(test.captured_fen, game.fen());
        });
    });
});

describe("960 castling rights", function() {
    var tests = [
        // the 'k' indicates that, even though there are 2 possible rooks
        // for castling kingside, it is the furthest rook (on g8) which
        // has not moved and is the one available for castling kingside
    { start_fen: '2kbb1r1/1pp1nr2/5q2/p2p3p/3P1B2/N1P2P2/PP5P/R1KB2RQ/ b KQk - 15 21',
        moves: ['Rff8'],
        end_fen: '2kbbrr1/1pp1n3/5q2/p2p3p/3P1B2/N1P2P2/PP5P/R1KB2RQ/ w KQk - 16 22' },
    // the 'g' indicates that it is the rook on the g file that is available
    // for castling kingside, not the furthest one on h8
    { start_fen: '2kbb1r1/1pp1n2r/5q2/p2p3p/3P1B2/N1P2P2/PPB4P/R1K3RQ/ b KQk - 13 20',
        moves: ['Rhh8'],
        end_fen: '2kbb1rr/1pp1n3/5q2/p2p3p/3P1B2/N1P2P2/PPB4P/R1K3RQ/ w KQg - 14 21' },
    // https://en.wikipedia.org/wiki/X-FEN#X-FEN_example
    { start_fen: 'rnbnkqrb/pppppppp/8/8/8/8/PPPPPPPP/RNBNKQRB/ w KQkq - 0 1',
        moves: ['h4', 'g6', 'g3', 'Bf6', 'a4', 'Qh6', 'Ra3', 'Bxh4', 'gxh4', 'Qxh4',
        'Qh3', 'Qxh3', 'Rxh3', 'Ne6', 'Bf3', 'd6', 'Nbc3', 'Ng5', 'Rhh1',
        'Bf5'],
        end_fen: 'rn2k1r1/ppp1pp1p/3p2p1/5bn1/P7/2N2B2/1PPPPP2/2BNK1RR/QBqpp w Gkq - 20 11' },
    ];
    tests.forEach(function(test) {
        var game = new Crazyhouse({960: true});
        it(test.start_fen+' '+test.moves.join(', '), function() {
            game.load(test.start_fen);
            assert.equal(test.start_fen, game.fen());
            test.moves.forEach(function(move) {
                game.move(move);
            });
            assert.equal(test.end_fen, game.fen());
        });
    });
});

describe("960 castling", function() {
    var tests = [
    { start_fen: 'rn2k1r1/ppp1pp1p/3p2p1/5bn1/P7/2N2B2/1PPPPP2/2BNK1RR/QBqpp w Gkq - 20 11',
        moves: ['O-O'],
        end_fen: 'rn2k1r1/ppp1pp1p/3p2p1/5bn1/P7/2N2B2/1PPPPP2/2BN1RKR/QBqpp b kq - 21 11' },
    { start_fen: 'rnbqk2r/ppppbppp/5n2/6B1/3QP3/2N5/PPP2PPP/R3KBNR/Pp b KQkq - 9 5',
        moves: ['O-O'],
        end_fen: 'rnbq1rk1/ppppbppp/5n2/6B1/3QP3/2N5/PPP2PPP/R3KBNR/Pp w KQ - 10 6' },
    { start_fen: 'rnbq1rk1/ppppbppp/5n2/6B1/3QP3/2N5/PPP2PPP/R3KBNR/Pp w KQ - 10 6',
        moves: ['O-O-O'],
        end_fen: 'rnbq1rk1/ppppbppp/5n2/6B1/3QP3/2N5/PPP2PPP/2KR1BNR/Pp b - - 11 6' }
    ];
    tests.forEach(function(test) {
        var game = new Crazyhouse({960: true});
        it(test.start_fen+' '+test.moves.join(', '), function() {
            game.load(test.start_fen);
            assert.equal(test.start_fen, game.fen());
            test.moves.forEach(function(move) {
                game.move(move);
            });
            assert.equal(test.end_fen, game.fen());
        });
    });
});

describe("960 Position Generation", function() {
    var tests = [
        { num: 518, fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1' },
        { num: 0, fen: 'bbqnnrkr/pppppppp/8/8/8/8/PPPPPPPP/BBQNNRKR/ w KQkq - 0 1' },
        { num: 25, fen: 'nqnbbrkr/pppppppp/8/8/8/8/PPPPPPPP/NQNBBRKR/ w KQkq - 0 1' },
        { num: 243, fen: 'bnrkqnrb/pppppppp/8/8/8/8/PPPPPPPP/BNRKQNRB/ w KQkq - 0 1' },
        { num: 754, fen: 'brknnbrq/pppppppp/8/8/8/8/PPPPPPPP/BRKNNBRQ/ w KQkq - 0 1' },
        { num: 959, fen: 'rkrnnqbb/pppppppp/8/8/8/8/PPPPPPPP/RKRNNQBB/ w KQkq - 0 1' }
    ];
    tests.forEach(function(test) {
        it("position number "+test.num, function() {
            var game = new Crazyhouse({960: true, position_number: test.num});
            assert.equal(test.fen, game.fen());
            assert.equal(test.num, game.position_number());
        });
    });

});

describe("960 with Crazyhouse moves", function() {
    var tests = [
        { num: 518,
            start_fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1',
            moves: [
            'e4', 'e5', 'd4', 'exd4', 'Qxd4', 'Nf6',
            'Nc3', 'Be7', 'Bg5', 'O-O', 'O-O-O', 'd6',
            '@h6'],
          end_fen: 'rnbq1rk1/ppp1bppp/3p1n1P/6B1/3QP3/2N5/PPP2PPP/2KR1BNR/p b - - 13 7' },
        { num: 465,
            start_fen: 'brnbnkrq/pppppppp/8/8/8/8/PPPPPPPP/BRNBNKRQ/ w KQkq - 0 1',
            moves: [
                'O-O', 'Nf6', 'b3', 'Nd6', 'g3', 'e6', 'Nf3', 'Be7',
                'c4', 'O-O-O', 'Bc2', 'b6', 'd4', 'Nfe4',
                'Bxe4', 'Bxe4', 'Nd3', 'B@b7', 'N@g5', 'Bec6', 'Nde5', 'Rgf8',
                'Nxc6', 'Bxc6', 'B@a6+', 'Kb8'],
            end_fen: '1k1r1r1q/p1ppbppp/Bpbnp3/6N1/2PP4/1P3NP1/P3PP1P/BR3RKQ/n w - - 26 14'}

    ];
    tests.forEach(function(test) {
        var game = new Crazyhouse({960: true});
        it ("position "+test.num, function() {
            game.new_960(test.num);
            assert.equal(test.start_fen, game.fen());
            test.moves.forEach(function(move) {
                game.move(move);
            });
            assert.equal(test.end_fen, game.fen());
        });
    });
});

describe("960 Specific Position Tests", function() {
    var tests = [
        { start_fen: 'b1r3kb/2Q3pp/1n1p2P1/pp6/1nPPpP1B/PP1PP2P/N4QP1/2NR1KRB/R b KQ - 57 29',
          moves: ['N4d5'],
          end_fen: 'b1r3kb/2Q3pp/1n1p2P1/pp1n4/2PPpP1B/PP1PP2P/N4QP1/2NR1KRB/R w KQ - 58 30' },
        { start_fen: 'nrkbbqrn/pppppppp/8/8/8/8/PPPPPPPP/NRKBBQRN/ w KQkq - 0 1',
          moves: ['a4', 'c6', 'd4', 'Ba5', 'f4'],
          end_fen: 'nrk1bqrn/pp1ppppp/2p5/b7/P2P1P2/8/1PP1P1PP/NRKBBQRN/ b KQkq - 5 3' }
    ];
    tests.forEach(function(test) {
        var game = new Crazyhouse({960: true});
        it(test.start_fen+' '+test.moves.join(', '), function() {
            game.load(test.start_fen);
            assert.equal(test.start_fen, game.fen());
            test.moves.forEach(function(move) {
                game.move(move);
            });
            assert.equal(test.end_fen, game.fen());
        });
    });
});

describe("960 Castling Legality", function() {
    var tests = [
        { fen: '2bbr1nn/kppp1q1p/6p1/P3pp2/7P/4PN2/1PPP1PP1/RKBBR2N/RPq b K - 17 9',
            from: 'b1', to: 'e1',
            direction: 'k',
            side: 'w',
            legal: false },
        { fen: '2bbr1nn/kppp1q1p/6p1/P3pp2/7P/4PN2/1PPP1PP1/RKBBR2N/RPq b KQ - 17 9',
            from: 'b1', to: 'a1',
            direction: 'q',
            side: 'w',
            legal: false },
        { fen: 'r1b1k2r/ppp2ppp/2n2n2/3qP3/1b6/2NQ1N2/PPP2PPP/R1B1KB1R/Ppp b KQkq - 15 8',
            from: 'e8', to: 'h8',
            direction: 'k',
            side: 'b',
            legal: true },
        { fen: 'bqrnkb1B/ppp2p1p/3pp3/5Np1/1P6/3BP1P1/P1PPnP1P/1QRNK2R/R b KQq - 15 8',
            from: 'e1', to: 'c1',
            direction: 'q',
            side: 'w',
            legal: false },
        { fen: 'nrbbqnkr/pppppppp/8/8/8/8/PPPPPPPP/NRBBQNKR/ w KQkq - 0 1',
            from: 'g1', to: 'h1',
            direction: 'k',
            side: 'w',
            legal: false },
        { fen: 'nr1k1rb1/3ppp2/B6p/p1p1Q1p1/3bPPP1/1R5P/P1Pb1p1P/N1NKNr~Q1/r w k - 42 22',
            from: 'd8', to: 'f8',
            direction: 'k',
            side: 'b',
            legal: false },
        { fen: 'rn2kbnr/p1q1pp1p/Pppp4/6p1/6bP/1PN2P2/2PPP1PR/R1BQKBN1/ b Qkq - 15 8',
            from: 'e8', to: 'a8',
            direction: 'q',
            side: 'b',
            legal: false },
    ];
    tests.forEach(function(test) {
        var game = new Crazyhouse({960: true});
        it(test.fen+' '+test.direction+', '+test.side+': '+test.legal, function() {
            game.load(test.fen);
            assert.equal(test.fen, game.fen());
            var is_legal = game.castling_legal(test.from, test.to, test.direction, test.side);
            assert.equal(test.legal, is_legal);
        });
    });
});

describe("960 Castling Undo", function() {
    var tests = [
        { start_fen: 'n2rknrq/1p1bp2p/6pQ/pN2Rp2/2P2P2/B2p1p2/1pBPP1PN/3RK1b1/PP b Qkq - 37 19',
            moves: ['O-O-O'],
            end_fen: 'n1kr1nrq/1p1bp2p/6pQ/pN2Rp2/2P2P2/B2p1p2/1pBPP1PN/3RK1b1/PP w Q - 38 20' },
    ];
    tests.forEach(function(test) {
        var game = new Crazyhouse({960: true});
        it(test.start_fen+' '+test.moves.join(', '), function() {
            game.load(test.start_fen);
            assert.equal(test.start_fen, game.fen());
            test.moves.forEach(function(move) {
                game.move(move);
            });
            assert.equal(test.end_fen, game.fen());
            test.moves.forEach(function() {
                game.undo();
            });
            assert.equal(test.start_fen, game.fen());
        });
    });
});

describe("Crazyhouse hand", function() {
    it("empty hand for start pos", function() {
        var game = new Crazyhouse();
        var hand = game.get_hand({verbose: true});
        assert.deepEqual({w:[],b:[]}, hand);
    });
    it("captured pieces", function() {
        var game = new Crazyhouse();
        game.move('e4');
        game.move('e5');
        game.move('d4');
        assert.deepEqual({w:[],b:[]}, game.get_hand({verbose: true}));
        game.move('exd4');
        var hand = {w:[],b:[{type: game.PAWN, color: 'b'}]};
        assert.deepEqual(hand, game.get_hand({verbose: true}));
        game.move('Qxd4');
        var hand = {w:[{type: game.PAWN, color:'w'}],b:[{type: game.PAWN, color: 'b'}]};
        assert.deepEqual(hand, game.get_hand({verbose: true}));
        game.move('Nc6');
        game.move('Bg5');
        game.move('Nxd4');
        var hand = {w:[{type: game.PAWN, color:'w'}],b:[{type: game.PAWN, color: 'b'},{type: game.QUEEN, color:'b'}]};
        assert.deepEqual(hand, game.get_hand({verbose: true}));
        game.move('Bxd8');
        var hand = {w:[{type: game.PAWN, color:'w'},{type: game.QUEEN, color:'w'}],b:[{type: game.PAWN, color: 'b'},{type: game.QUEEN, color:'b'}]};
        assert.deepEqual(hand, game.get_hand({verbose: true}));
    });
});

describe("Position API", function() {
    it("start position", function() {
        var game = new Crazyhouse();
        var p = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
        assert.equal(p, game.position());
    });
    it("with fake pieces", function() {
        var game = new Crazyhouse();
        game.load('7k/4Q~3/8/5Q~2/1Q~5P/PPPP1P1P/P1PNRPRP/Q4K2/BBPNPNBRNRBQ b - - 98 77');
        var p = '7k/4Q3/8/5Q2/1Q5P/PPPP1P1P/P1PNRPRP/Q4K2';
        assert.equal(p, game.position());
    });
});

describe("Verbose Hand Moves", function() {
    it("piece drop", function() {
        var game = new Crazyhouse();
        game.load('r1bqk1nr/pppp1ppp/4p1n1/1N2P3/5P1b/1BN5/PPP3PP/R1BQK2R/P w KQkq - 20 11');
        game.move({from: '@', to: 'f2', promotion: 'q', piece:'p'});
        assert.equal('r1bqk1nr/pppp1ppp/4p1n1/1N2P3/5P1b/1BN5/PPP2PPP/R1BQK2R/ b KQkq - 21 11', game.fen());
    });
});

