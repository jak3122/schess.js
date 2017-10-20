if (typeof require != "undefined") {
    var chai = require('chai');
    var SChess = require('../schess').SChess;
}

var assert = chai.assert;

describe("Single Square Move Generation", function () {

    var positions = [
        {  // elephant on open board
            fen: '4k3/8/8/8/3E4/8/8/4K3 - - w - - 1 1',
            square: 'd4', verbose: false, moves: [
                // rook-like moves
                'Ea4', 'Eb4', 'Ec4', 'Ee4+', 'Ef4', 'Eg4', 'Eh4',
                'Ed1', 'Ed2', 'Ed3', 'Ed5', 'Ed6+', 'Ed7', 'Ed8+',
                // knight-like moves
                'Ec2', 'Eb3', 'Eb5', 'Ec6', 'Ee6+', 'Ef5', 'Ef3', 'Ee2+'
            ]
        },
        {  // hawk on open board
            fen: '4k3/8/8/8/3H4/8/8/4K3 - - w - - 1 1',
            square: 'd4', verbose: false, moves: [
                // bishop-like moves
                'Ha1', 'Hb2', 'Hc3', 'He5', 'Hf6+', 'Hg7+', 'Hh8',
                'Ha7', 'Hb6', 'Hc5', 'He3', 'Hf2', 'Hg1',
                // knight-like moves
                'Hc2', 'Hb3', 'Hb5+', 'Hc6+', 'He6', 'Hf5', 'Hf3', 'He2'
            ]
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR SSSSSSSSssssssss EHeh w KQkq - 0 1',
            square: 'e2', verbose: false, moves: ['e3', 'e4']
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR SSSSSSSSssssssss EHeh w KQkq - 0 1',
            square: 'e9', verbose: false, moves: []
        },  // invalid square
        {
            fen: 'rnbqk1nr/pppp1ppp/4p3/8/1b1P4/2N5/PPP1PPPP/R1BQKBNR SXSSSSSSsssssxss EHeh w KQkq - 4 3',
            square: 'c3', verbose: false, moves: []
        },  // pinned piece
        {
            fen: 'r1bqk2r/ppppbppp/2n2n2/4p3/2BPP3/2N2N2/PPP2PPP/R1BQK2R SXSSSXXSsxsssxxs EHeh b KQkq - 9 5',
            square: 'e5', verbose: false, moves: ['exd4']
        },  // pawn capture
        {
            fen: 'r1bqk2r/ppppbppp/2n2n2/8/2BNP3/2N5/PPP2PPP/R1BQK2R SXSSSXXSsxsssxxs EHeh b KQkq - 11 6',
            square: 'c6', verbose: false, moves: ['Ne5', 'Nxd4', 'Nb4', 'Na5', 'Nb8']
        },
        {
            fen: 'r1b1kbnr/1PQ1pppp/p1p1b3/8/1P6/P1N4p/2PP1PqP/R1B1K1NR SXSXSXSSsxsxssss EHeh w KQkq - 24 13',
            square: 'b7', verbose: false, moves: ['bxa8=Q', 'bxa8=R', 'bxa8=B', 'bxa8=N', 'bxa8=E', 'bxa8=H',
                'b8=Q', 'b8=R', 'b8=B', 'b8=N', 'b8=E', 'b8=H',
                'bxc8=Q+', 'bxc8=R+', 'bxc8=B', 'bxc8=N', 'bxc8=E+', 'bxc8=H']
        },  // promotion
        {
            fen: '1r3r2/1pp2pk1/p4q1p/P3B3/2B5/2PP2BP/1P2n1P1/3b1nK1 - EHeh w - - 58 30',
            square: 'g1', verbose: false, moves: ['Kh1']
        },
        {
            fen: 'B4r1k/p1p1Npbp/1p2pN1p/6n1/8/1P4PP/P1P1nP1K/R4n2 - EHeh w - - 70 36',
            square: 'h2', verbose: false, moves: ['Kh1', 'Kg2']
        },
        {
            fen: 'B4r1k/p1p1Npbp/1p2pN1p/6n1/8/1P4PP/P1P1nP1K/R4n2 - EHeh w - - 70 36',
            square: 'a1', verbose: false, moves: ['Rxf1']
        },
        {
            fen: 'r1b1k2r/ppp2ppp/2n2n2/3qP3/1b6/2NQ1N2/PPP2PPP/R1B1KB1R SXSXSSXSsxsxsxxs EHeh b KQkq - 15 8',
            square: 'e8', verbose: false, moves: ['Kf8', 'Ke7', 'Kd7', 'Kd8',
                'Kf8/E', 'Kf8/H', 'Ke7/E', 'Ke7/H', 'Kd7/E', 'Kd7/H', 'Kd8/E', 'Kd8/H',
                'O-O', 'O-O/E', 'O-O/H', 'O-O/Eh8', 'O-O/Hh8']
        },  // castling
        {
            fen: 'r1b1k1r1/ppp2pPp/2n2P2/3q4/8/2Pp1N2/P1P2PPP/R1B1KB1R SXSXSSXSsxsxsxsx EHeh b KQq - 27 14',
            square: 'e8', verbose: false, moves: ['Kd7', 'Kd8', 'Kd7/E+', 'Kd7/H', 'Kd8/E+', 'Kd8/H']
        },  // no castling
        {
            fen: 'r1bqk2r/ppp1bppp/3p1nn1/8/3NPP2/1BN5/PPP3PP/R1BQK2R SXSSSXXSsxsssxxs EHeh w KQkq - 16 9',
            square: 'e1', verbose: false, moves: ['Kd2', 'Ke2', 'Kf2', 'Kf1',
                'Kd2/E', 'Kd2/H', 'Ke2/E', 'Ke2/H', 'Kf2/E', 'Kf2/H', 'Kf1/E', 'Kf1/H',
                'O-O', 'O-O/E', 'O-O/H', 'O-O/Eh1', 'O-O/Hh1']
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR SSSSSSSSssssssss EHeh w KQkq - 0 1',
            square: 'g1', verbose: false, moves: ['Nf3', 'Nh3', 'Nf3/E', 'Nf3/H', 'Nh3/E', 'Nh3/H']
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR SSSSSSSSssssssss EHeh w KQkq - 0 1',
            square: 'b1', verbose: false, moves: ['Na3', 'Nc3', 'Na3/E', 'Na3/H', 'Nc3/E', 'Nc3/H']
        }
    ];

    positions.forEach(function (position) {
        it(position.fen + ' ' + position.square, function () {
            var game = new SChess();
            game.load(position.fen);
            assert.equal(game.fen(), position.fen, 'gen fen: ' + game.fen());
            var gen_moves = game.moves({ square: position.square });
            var new_fen = game.fen();
            assert.equal(gen_moves.length, position.moves.length, new_fen + " " + gen_moves.join(','));
            gen_moves.forEach(function (move) {
                assert.include(position.moves, move);
            });
        });

    });

});

/*
describe("Move generation", function () {
    var game = new SChess();
    var tests = [
        {
            fen: '1r3r2/1pp2pk1/p4q1p/P3B3/2B5/2PP2BP/1P2n1P1/3b1nK1/NPPPqrrppn w - - 58 30',
            moves: ['Kh1']
        },
        {
            fen: 'rnb1kb1r/ppp1pppp/5n2/8/7q/2N2P2/PPPPN1PP/R1BQKB1R/Pp w KQkq - 10 6',
            moves: ['g3', 'Ng3', '@f2', '@g3']
        },
        {
            fen: 'rnb1kb1r/ppp1pppp/8/3N4/7q/5P2/PPPPN1PP/R1BQKB1R/NPp w KQkq - 12 7',
            moves: ['g3', 'Ng3', '@f2', '@g3', 'N@f2', 'N@g3']
        },
        {
            fen: 'r1bq1rk1/1pp1npp1/1b1pbN1p/pP1Np3/P1B1P3/2PP1N2/5PPP/R2Q1RK1/ b - - 27 14',
            moves: ['gxf6', 'Kh8']
        },
        {
            fen: '4r1nk/1pp1PNb1/1b1pb1pp/pP2p3/P3P2Q/2PP4/5PPP/R2Q1RK1/Bnrn b - - 53 27',
            moves: ['Bxf7', 'Kh7']
        },
        {
            fen: '5nnk/1ppbr1bb/3p1pN1/pP1Pp1pB/P3Pp1N/2PP4/6PP/R2Q2K1/qrr b - - 79 40',
            moves: ['Bxg6', 'Nxg6']
        },
        {
            fen: '5nnk/1ppbr1b1/3p1pN1/pP1Pp1pB/P3Pp2/2PP4/6PP/R2Q2K1/Bnqrr b - - 81 41',
            moves: ['Nxg6', 'Kh7']
        },
        {
            fen: '6nk/1ppbr1b1/3p1pBr/pP1Pp1pB/P3Pp2/2PPq3/6PP/R2Q2K1/Nnnr w - - 86 44',
            moves: ['Kf1', 'Kh1', 'N@f2']
        },
        {
            fen: 'r4rk1/pp1q1ppB/3pbp2/4r3/2P1Q3/1P3PPP/P3nPBK/5R2/NPPBnpn b - - 53 27',
            moves: ['Kh8']
        },
        {
            fen: 'r4r1k/pp3pP1/3p2n1/5NPB/2P1p3/1Pb2pPP/P3BPBK/5R2/PQPnnrq b - - 83 42',
            moves: ['Bxg7', 'Kg8', 'Kh7']
        },
        {
            fen: 'r4r1k/pp3pn1/3p2nQ/5NPB/2P1p3/1P3pPP/P3BPBK/5R2/BPppnrq b - - 89 45',
            moves: ['Kg8', '@h7', 'N@h7', 'R@h7', 'Q@h7']
        }
    ];
    tests.forEach(function (test) {
        it(test.fen, function () {
            game.load(test.fen);
            var in_hand = game.get_hand().w;
            var gen_moves = game.moves();
            assert.equal(gen_moves.length, test.moves.length, gen_moves.join(', ') + ", w-hand: " + in_hand);
            test.moves.forEach(function (move) {
                assert.include(gen_moves, move);
            });
        });
    });
});
*/

describe("In Check", function () {
    var game = new SChess();
    var fens = [
        '8/8/8/8/5k2/8/5ePP/6NK - - w - - 1 1',
        '8/8/8/8/5k2/8/5hPP/6NK - - w - - 1 1',
        '8/8/8/8/8/3k4/8/e2K4 - - w - - 1 1',
        'h7/8/8/8/8/6k1/4n3/7K - - w - - 1 1',
        'r1b1e1r1/pppk1pPp/2n2P2/3q4/8/2Pp1N2/P1P2PPP/R1B1KB1R - - w KQ - 28 15'
    ];
    fens.forEach(function (fen) {
        it(fen, function () {
            game.load(fen);
            assert(game.in_check());
        });
    });
});

describe("Checkmate", function () {

    var game = new SChess();
    var checkmates = [
        '8/8/8/8/5k2/8/5ePP/6NK - - w - - 1 1',
        '8/8/8/8/5k2/8/5hPP/6NK - - w - - 1 1',
        '8/8/8/8/8/3k4/8/e2K4 - - w - - 1 1',
        'h7/8/8/8/8/6k1/4n3/7K - - w - - 1 1',
    ];

    checkmates.forEach(function (checkmate) {
        game.load(checkmate);

        it(checkmate, function () {
            assert(game.in_checkmate());
        });
    });

});



describe("Stalemate", function () {

    var stalemates = [
        '8/8/8/8/8/4h1k1/8/7K - - w - - 1 1',
        '8/8/8/8/8/6k1/6e1/7K - - w - - 1 1',
    ];

    stalemates.forEach(function (stalemate) {
        var game = new SChess();
        game.load(stalemate);

        it(stalemate, function () {
            assert(game.in_stalemate())
        });

    });

});

/*
describe("Threefold Repetition", function () {

    var positions = [
        {
            fen: 'Bn3r2/p1ppqp1k/1p2p2p/7N/KB4P1/1PP4P/P1P1QP2/1rb5/NRBPRPn b - - 63 32',
            moves: ['N@b2', 'Ka3', 'Nc4', 'Ka4', 'Nb2', 'Ka3', 'Nc4', 'Ka4', 'Nb2']
        },
        {
            fen: 'r1b1k2r/pppp2p1/1b5p/1N1Nnp2/8/2P5/P1PKP1PP/R2Q1B1R/NQBPpp b kq - 27 14',
            moves: ['Nc4', 'Kd3', 'Nb2', 'Kd2', 'Nc4', 'Kd3', 'Ne5', 'Kd2', 'Nc4']
        },
        {
            fen: 'r2q3r/pbpPNkp1/1pp1p1N1/1B2p3/8/5P1p/P1P2P1P/R4RK1/PBBNPqn w - - 58 30',
            moves: ['N@g5', 'Kf6', 'Ne4', 'Kf7', 'Ng5', 'Kf6', 'Ne4', 'Kf7', 'Ng5']
        },
    ];

    positions.forEach(function (position) {
        var game = new SChess();
        game.load(position.fen);

        it(position.fen, function () {

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
*/

describe("FEN", function () {

    var positions = [
        { fen: '8/8/8/8/8/8/8/8 - - w - - 0 1', should_pass: true },
        { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR SSSSSSSSssssssss EHeh w KQkq - 0 1', should_pass: true },
        { fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR SSSSSSSSssssssss EHeh b KQkq e3 0 1', should_pass: true },
        { fen: '1nbqkbn1/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/1NBQKBN1 SSSSSSSSssssssss EHeh b - - 1 2', should_pass: true },
        { fen: 'r1bqk1nr/pppp1ppp/4p1n1/1N2P3/5P1b/1BN5/PPP3PP/R1BQK2R SSSSSSSSssssssss EHeh w KQkq - 20 11', should_pass: true },
        { fen: 'B4r1k/p1p1Npbp/1p2pN1p/6n1/8/1P4PP/P1P1nP1K/R4n2 SSSSSSSSssssssss EHeh w - - 70 36', should_pass: true },
        { fen: 'r4r1k/ppp2Bpp/2np1p2/4pb1B/5p2/3P4/PPP2QPP/RN1K3R SSSSSSSSssssssss EHeh w - - 34 18', should_pass: true },
        { fen: 'r6k/ppp2Ppp/2np1p1b/8/4P2Q/5P2/PPP1p1pP/RN1KR3 SSSSSSSSssssssss EHeh w - - 66 34', should_pass: true },
        { fen: 'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKBER SSSSSSXSssssssss Heh b KQkq - 1 1', should_pass: true },
        { fen: 'rhbqkbnr/pppppppp/2n5/8/8/5N2/PPPPPPPP/RNBQKBER SSSSSSXSsxssssss He w KQkq - 2 2', should_pass: true },

        /* incomplete FEN string */
        { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBN/ w KQkq - 0 1', should_pass: false },

        /* bad digit (9)*/
        { fen: 'rnbqkbnr/pppppppp/9/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1', should_pass: false },

        /* bad piece (X)*/
        { fen: '1nbqkbn1/pppp1ppX/8/4p3/4P3/8/PPPP1PPP/1NBQKBN1/ b - - 1 2', should_pass: false },
    ];

    positions.forEach(function (position) {
        var game = new SChess();

        it(position.fen + ' (' + position.should_pass + ')', function () {
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


describe("Make Move", function () {

    var positions = [
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR SSSSSSSSssssssss EHeh w KQkq - 0 1',
            legal: true,
            move: 'e4',
            next: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR SSSSSSSSssssssss EHeh b KQkq e3 0 1'
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR SSSSSSSSssssssss EHeh w KQkq - 0 1',
            legal: true,
            move: { from: 'b1', to: 'c3', piece: 'n', promotion: 'q', s_piece: 'e' },
            next: 'rnbqkbnr/pppppppp/8/8/8/2N5/PPPPPPPP/REBQKBNR SXSSSSSSssssssss Heh b KQkq - 1 1'
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR SSSSSSSSssssssss EHeh w KQkq - 0 1',
            legal: false,
            move: 'e5'
        },
        {
            fen: 'r1bqk2r/ppppbppp/2n2n2/4p3/2BPP3/2N2N2/PPP2PPP/R1BQK2R SXSSSXXSsxsssxxs EHeh b KQkq - 9 5',
            legal: true,
            move: 'exd4',
            captured: 'p',
            next: 'r1bqk2r/ppppbppp/2n2n2/8/2BpP3/2N2N2/PPP2PPP/R1BQK2R SXSSSXXSsxsssxxs EHeh w KQkq - 0 6'
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR SSSSSSSSssssssss EHeh w KQkq - 0 1',
            legal: true,
            move: 'Nf3/E',
            next: 'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKBER SSSSSSXSssssssss Heh b KQkq - 1 1'
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKBER SSSSSSXSssssssss Heh b KQkq - 1 1',
            legal: true,
            move: 'Na6/H',
            next: 'rhbqkbnr/pppppppp/n7/8/8/5N2/PPPPPPPP/RNBQKBER SSSSSSXSsxssssss He w KQkq - 2 2'
        },
        {
            fen: 'rnbqk2r/pppp1pp1/5n1p/2b1p3/2B1P3/2N2N2/PPPP1PPP/REBQK2R SXSSSXXSsssssxxs Heh w KQkq - 0 5',
            legal: false,
            move: 'O-O/He1',
            next: 'rnbqk2r/pppp1pp1/5n1p/2b1p3/2B1P3/2N2N2/PPPP1PPP/REBQHRK1 SXSSXXXXsssssxxs eh b kq - 1 5'
        },
        {
            fen: 'rnbqk2r/pppp1pp1/5n1p/2b1p3/2B1P3/2N2N2/PPPP1PPP/REBQK2R SXSSSXXSsssssxxs Heh w KQkq - 0 5',
            legal: true,
            move: 'O-O/Hh1',
            next: 'rnbqk2r/pppp1pp1/5n1p/2b1p3/2B1P3/2N2N2/PPPP1PPP/REBQ1RKH SXSSXXXXsssssxxs eh b kq - 1 5'
        },
        {
            fen: 'rnbqk2r/pppp1pp1/5n1p/2b1p3/2B1P3/2N2N2/PPPP1PPP/REBQK2R SXSSSXXSsssssxxs Heh w KQkq - 0 5',
            legal: false,
            move: 'O-O/Ee1'
        },
        {
            fen: 'rnbqk2r/pppp1pp1/5n1p/2b1p3/2B1P3/2N2N2/PPPP1PPP/REBQK2R SXSSSXXSsssssxxs Heh w KQkq - 0 5',
            legal: false,
            move: 'O-O/Eh1'
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKBER SSSSSSXSssssssss Heh w KQkq - 1 1',
            legal: true,
            move: 'Eh3',
            next: 'rnbqkbnr/pppppppp/8/8/8/5N1E/PPPPPPPP/RNBQKB1R SSSSSSXSssssssss Heh b KQkq - 2 1'
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/5N1E/PPPPPPPP/RNBQKB1R SSSSSSXSssssssss Heh w KQkq - 1 1',
            legal: true,
            move: 'Exh7',
            captured: 'p',
            next: 'rnbqkbnr/pppppppE/8/8/8/5N2/PPPPPPPP/RNBQKB1R SSSSSSXSssssssss Heh b KQkq - 0 1'
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/5N1E/PPPPPPPP/RNBQKB1R SSSSSSXSssssssss Heh w KQkq - 1 1',
            legal: false,
            move: 'Eg4',
        },
        {
            fen: 'rnbqk2r/pppp1pp1/5n1p/2b1p3/2B1P3/2N2N2/PPPP1PPP/REBQK2R SXSSSXXSsssssxxs Heh w KQkq - 0 5',
            legal: true,
            move: {'from': 'e1', 'to': 'g1', 'piece': 'k', 's_piece': 'h'},
            next: 'rnbqk2r/pppp1pp1/5n1p/2b1p3/2B1P3/2N2N2/PPPP1PPP/REBQHRK1 SXSSXXXXsssssxxs eh b kq - 1 5'
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR SSSSSSSSssssssss EHeh w KQkq - 0 1',
            legal: true,
            move: 'Nf3/E',
	    move: { 'from': 'g1', 'to': 'f3', 'piece': 'n', 's_piece': 'e' },
            next: 'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKBER SSSSSSXSssssssss Heh b KQkq - 1 1'
        },
    ];

    positions.forEach(function (position) {
        var game = new SChess();
        game.load(position.fen);
        it(position.fen + ' (' + position.move + ' ' + position.legal + ')', function () {
            var result = game.move(position.move);
            if (position.legal) {
                assert.isOk(result);
                assert.equal(position.next, game.fen(), "result move: " + JSON.stringify(result));
                assert.equal(position.captured, result.captured);
            } else {
                assert.isNotOk(result);
            }
        });
    });
});

describe("Undo", function () {
    var positions = [
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR SSSSSSSSssssssss EHeh w KQkq - 0 1',
            legal: true,
            move: 'e4',
            next: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR SSSSSSSSssssssss EHeh b KQkq e3 0 1'
        },
        {
            fen: 'r1bqk2r/ppppbppp/2n2n2/4p3/2BPP3/2N2N2/PPP2PPP/R1BQK2R SXSSSXXSsxsssxxs EHeh b KQkq - 9 5',
            legal: true,
            move: 'exd4',
            captured: 'p',
            next: 'r1bqk2r/ppppbppp/2n2n2/8/2BpP3/2N2N2/PPP2PPP/R1BQK2R SXSSSXXSsxsssxxs EHeh w KQkq - 0 6'
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR SSSSSSSSssssssss EHeh w KQkq - 0 1',
            legal: true,
            move: 'Nf3/E',
            next: 'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKBER SSSSSSXSssssssss Heh b KQkq - 1 1'
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKBER SSSSSSXSssssssss Heh b KQkq - 1 1',
            legal: true,
            move: 'Na6/H',
            next: 'rhbqkbnr/pppppppp/n7/8/8/5N2/PPPPPPPP/RNBQKBER SSSSSSXSsxssssss He w KQkq - 2 2'
        },
        {
            fen: 'rnbqk2r/pppp1pp1/5n1p/2b1p3/2B1P3/2N2N2/PPPP1PPP/REBQK2R SXSSSXXSsssssxxs Heh w KQkq - 0 5',
            legal: true,
            move: 'O-O/H',
            next: 'rnbqk2r/pppp1pp1/5n1p/2b1p3/2B1P3/2N2N2/PPPP1PPP/REBQHRK1 SXSSXXXXsssssxxs eh b kq - 1 5'
        },
        {
            fen: 'rnbqk2r/pppp1pp1/5n1p/2b1p3/2B1P3/2N2N2/PPPP1PPP/REBQK2R SXSSSXXSsssssxxs Heh w KQkq - 0 5',
            legal: true,
            move: 'O-O/Hh1',
            next: 'rnbqk2r/pppp1pp1/5n1p/2b1p3/2B1P3/2N2N2/PPPP1PPP/REBQ1RKH SXSSXXXXsssssxxs eh b kq - 1 5'
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKBER SSSSSSXSssssssss Heh w KQkq - 1 1',
            legal: true,
            move: 'Eh3',
            next: 'rnbqkbnr/pppppppp/8/8/8/5N1E/PPPPPPPP/RNBQKB1R SSSSSSXSssssssss Heh b KQkq - 2 1'
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/5N1E/PPPPPPPP/RNBQKB1R SSSSSSXSssssssss Heh w KQkq - 1 1',
            legal: true,
            move: 'Exh7',
            captured: 'p',
            next: 'rnbqkbnr/pppppppE/8/8/8/5N2/PPPPPPPP/RNBQKB1R SSSSSSXSssssssss Heh b KQkq - 0 1'
        },
    ];
    positions.forEach(function (test) {
        it(test.move, function () {
            var game = new SChess();
            game.load(test.fen);
            game.move(test.move);
            assert.equal(test.next, game.fen());
            game.undo();
            assert.equal(test.fen, game.fen());
        });
    });


});

describe("History", function () {

    var game = new SChess();
    var tests = [
        {
            verbose: false,
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR SSSSSSSSssssssss EHeh w KQkq - 0 1',
            moves: [
                'd4', 'd6', 'e4', 'e5', 'dxe5', 'dxe5', 'Qxd8/E#'
            ]
        }
    ];

    tests.forEach(function (t, i) {
        it(i.toString(), function () {
            var game = new SChess();
            game.load(t.fen);
            t.moves.forEach(function (move) {
                game.move(move);
            });
            var history = game.history({ verbose: t.verbose });
            assert.equal(history.length, t.moves.length);
            t.moves.forEach(function (move) {
                assert.include(history, move);
            });
            history.forEach(function (move) {
                assert.include(t.moves, move);
            });
        });
    });
});

describe("Perft", function () {
    var perfts = [
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR SSSSSSSSssssssss EHeh w KQkq - 0 1',
            depth: 3, nodes: 24830
        },
        {
            fen: 'rnbqkbnr/pppp1ppp/8/8/3pP3/8/PPP2PPP/RNBQKBNR SSSSSSSSssssssss EHeh w KQkq - 4 3',
            depth: 3, nodes: 335384
        }
    ];

    perfts.forEach(function (perft) {
        var game = new SChess();
        game.load(perft.fen);

        it(perft.fen, function () {
            var nodes = game.perft(perft.depth);
            assert.equal(perft.nodes, nodes);
        });

    });
});

describe("SChess hand", function () {
    it("hand for start pos", function () {
        var game = new SChess();
        var hand = game.get_hand();
        assert.deepEqual({
             w: [{type: game.ELEPHANT, color: 'w'}, {type: game.HAWK, color: 'w'}],
             b: [{type: game.ELEPHANT, color: 'b'}, {type: game.HAWK, color: 'b'}]
        }, hand);
    });
    it("placing s-pieces", function () {
        var game = new SChess();
        game.move('e4');
        game.move('e5');
        game.move('Nf3/E');
        assert.deepEqual({
             w: [{type: game.HAWK, color: 'w'}],
             b: [{type: game.ELEPHANT, color: 'b'}, {type: game.HAWK, color: 'b'}]
        }, game.get_hand());
        game.move('Nc6');
        assert.deepEqual({
             w: [{type: game.HAWK, color: 'w'}],
             b: [{type: game.ELEPHANT, color: 'b'}, {type: game.HAWK, color: 'b'}]
        }, game.get_hand());
        game.move('Bc4/H');
        assert.deepEqual({
             w: [],
             b: [{type: game.ELEPHANT, color: 'b'}, {type: game.HAWK, color: 'b'}]
        }, game.get_hand());
        game.move('Qf6/H');
        assert.deepEqual({
             w: [],
             b: [{type: game.ELEPHANT, color: 'b'}]
        }, game.get_hand());
    });
});

describe("Regression tests", function() {
    it("r3rh2/p2q4/b2p2pp/Ppp1p1p1/2Q1N2P/5P1P/1R2P1B1/2B1K2R SXSXSSSSsxxsssss - w q - 3 39, Qa2", function() {
        var game = new SChess('r3rh2/p2q4/b2p2pp/Ppp1p1p1/2Q1N2P/5P1P/1R2P1B1/2B1K2R SXSXSSSSsxxsssss - w q - 3 39');
        game.move('Qa2');
    });
    it("Not toggling e/h bits correctly, which caused fen generation issues", function() {
        var game = new SChess();
        game.move('d4');
        game.move('d5');
        game.move('Bf4');
        game.move('Bf5');
        game.move('Nf3');
        game.move('Nc6');
        game.move('Nc3');
        game.move('Qd7');
        game.move('e3');
        game.move('O-O-O/He8');
        game.move('Qd2');
        game.move('e6');
        game.move('Bb5');
        game.move('Bb4');
        game.move('O-O/Hh1');
        game.move('Nf6');
        game.move('Rfe1');
        game.move('Hd6');
        game.move('Rad1/E');
        game.move('Bg6');
        game.move('Ec1');
        game.move('Rhe8/E');
        var valid = game.validate_fen(game.fen());
        assert.isOk(valid.valid);
    });
    it("Capturing a piece disables piece placement", function() {
        var game = new SChess();
        game.load("rn1qkbnr/pbpppppp/1p6/8/8/6P1/PPPPPP1P/RNBQKBNR SXSSSSSSssxsssss EHeh b KQkq - 3 3");
        game.move("Bxh1");
        assert.equal(game.fen(), "rn1qkbnr/p1pppppp/1p6/8/8/6P1/PPPPPP1P/RNBQKBNb SXSSSSSXssxsssss EHeh w Qkq - 0 4");
    });
    describe("Castling with s_piece without s_square defaults to king square", function() {
        it("kside white", function() {
            var game = new SChess();
            game.load("r2qkbnr/ppp1pppp/2n1b3/3p4/8/4PN2/PPPPBPPP/RNBQK2R SSSSSSSSssssssss EHeh w KQkq - 4 4");
            var castleMove = game.move("O-O/E");
            assert.deepEqual(castleMove,
                {from: "e1", to: "g1", s_piece: "e", color: "w", "flags": "k", san: "O-O/E", piece: "k"});
            assert.equal(game.fen(),
                "r2qkbnr/ppp1pppp/2n1b3/3p4/8/4PN2/PPPPBPPP/RNBQERK1 SSSSXSSXssssssss Heh b kq - 5 4")
        });
        it("qside white", function() {
            var game = new SChess();
            game.load("r3k2r/ppp1ppbp/2nqbnp1/3p4/3P4/2NQPN2/PPPBBPPP/R3K2R SSSSSSSSssssssss EHeh w KQkq - 2 8");
            var castleMove = game.move("O-O-O/H");
            assert.deepEqual(castleMove,
                {from: "e1", to: "c1", s_piece: "h", color: "w", "flags": "q", san: "O-O-O/H", piece: "k"});
            assert.equal(game.fen(),
                "r3k2r/ppp1ppbp/2nqbnp1/3p4/3P4/2NQPN2/PPPBBPPP/2KRH2R XSSSXSSSssssssss Eeh b kq - 3 8")
        });

    });

    describe("castling placement on rook square", () => {
        it("generates castling moves with rook-square placement", () => {
            var game = new SChess();
            game.load("r3kbnr/ppp1pppp/2nq4/3p1b2/2B1P3/5NE1/PPPP1PPP/RNBQ1RK1 SSSSXXXXsxxxssss Heh b kq - 7 5");
            var moves = game.moves({verbose:true});
            assert(moves.some(move => move.from === "e8" && move.to === "c8"));
            assert(moves.some(move => move.from === "e8" && move.to === "c8" && move.s_square === "a8"));
        });
        it("places spiece on rook square", () => {
            var game = new SChess();
            game.load("r3kbnr/ppp1pppp/2nq4/3p1b2/2B1P3/5NE1/PPPP1PPP/RNBQ1RK1 SSSSXXXXsxxxssss Heh b kq - 7 5");
            var moveObject = {from: "e8", to: "c8", s_piece: "h", s_square: "a8"};
            var move = game.move(moveObject);
            assert.equal(game.fen(), "h1kr1bnr/ppp1pppp/2nq4/3p1b2/2B1P3/5NE1/PPPP1PPP/RNBQ1RK1 SSSSXXXXxxxxxsss He w - - 8 6");
            assert.deepInclude(move, moveObject);
        });
    });
});
