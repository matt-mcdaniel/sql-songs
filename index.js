const mysql = require('mysql');
const inquirer = require('inquirer');

const {printSong} = require('./utility');
const DatabaseController = require('./controller.js');
const {questions} = require('./constants');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'top_songs_db'
});

connection.connect(startQuery);

function startQuery() {
    console.log('\n');

    const controller = new DatabaseController(connection);

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'How would you like to interact with the songs/albums DB?',
                choices: [
                    questions.SONGS_BY_NAME,
                    questions.SONGS_BY_ARTIST,
                    questions.SONGS_BETWEEN_DATES,
                    questions.POPULAR_ARTISTS
                ]
            }
        ])
        .then(answers => {
            switch (answers.action) {
                case questions.SONGS_BY_NAME:
                    controller.getSongsBySongName().then(results => {
                        if (!results.length) console.log('No results');
                        results.forEach(printSong('artist', 'song', 'year'));
                        startQuery();
                    });
                    break;
                case questions.SONGS_BY_ARTIST:
                    controller.getSongsByArtist().then(results => {
                        if (!results.length) console.log('No results');
                        results.forEach(printSong('song', 'year'));
                        startQuery();
                    });
                    break;
                case questions.SONGS_BETWEEN_DATES:
                    controller.getSongsBetweenDates().then(results => {
                        if (!results.length) console.log('No results');
                        results.forEach(printSong('artist', 'song', 'year'));
                        startQuery();
                    });
                    break;
                case questions.POPULAR_ARTISTS:
                    controller.getPopularArtists().then(results => {
                        if (!results.length) console.log('No results');
                        results.forEach(printSong('artist'));
                        startQuery();
                    });
                    break;
            }
        });
}
