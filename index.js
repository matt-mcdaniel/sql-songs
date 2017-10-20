const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'top_songs_db'
});

const songsByArtist = 'Search songs by artist';
const popularArtists = 'Show popular artists';
const songsBetweenDates = 'Show songs between dates';
const songsByName = 'Search songs by name';

connection.connect(promptAction);

function promptAction() {
    console.log('\n');
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'How would you like to interact with the songs/albums DB?',
                choices: [songsByName, songsByArtist, songsBetweenDates, popularArtists]
            }
        ])
        .then(answers => {
            switch (answers.action) {
                case songsByArtist:
                    getSongsByArtist();
                    break;
                case popularArtists:
                    getPopularArtists();
                    break;
                case songsBetweenDates:
                    getSongsBetweenDates();
                    break;
                case songsByName:
                    getSongsBySongName();
                    break;
            }
        });
}

// Search for artist
function getSongsByArtist() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'artist',
                message: 'Please enter an artist'
            }
        ])
        .then(answers => {
            connection.query(
                'SELECT song FROM top5000 WHERE ?',
                {artist: answers.artist},
                (err, results) => {
                    if (err) throw err;
                    results.forEach(result => console.log(result.song));
                    promptAction();
                }
            );
        });
}

// Show artists, hits who appear in top 5000 songs DB more than 15 times
function getPopularArtists() {
    connection.query(
        `
        SELECT artist, count(*) AS counter
        FROM top5000
        GROUP BY artist
        HAVING counter > 15
        ORDER BY counter DESC
    `,
        (err, results) => {
            if (err) throw err;
            results.forEach(result =>
                console.log(`${result.artist} - ${result.counter} hits`)
            );
            promptAction();
        }
    );
}

// Show songs between date range
function getSongsBetweenDates() {
    console.log('Find song hits between two years');
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'startDate',
                message: 'Starting Date:'
            },
            {
                type: 'input',
                name: 'endDate',
                message: 'Ending Date:'
            }
        ])
        .then(answers => {
            const query = 'SELECT * FROM top5000 WHERE year BETWEEN ? AND ?';
            connection.query(
                query,
                [answers.startDate, answers.endDate],
                (err, results) => {
                    if (err) throw err;
                    results.forEach(result => {
                        const printable = `${result.artist} - ${result.song} (${result.year})`;
                        console.log(printable);
                    });
                    promptAction();
                }
            );
        });
}

// Search for any song by name
function getSongsBySongName() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'songName',
                message: 'Enter name of song'
            }
        ])
        .then(answers => {
            const query = 'SELECT * FROM top5000 WHERE song LIKE ?';
            connection.query(query, [answers.songName], (err, results) => {
                if (err) throw err;
                results.forEach(result => {
                    const printable = `${result.artist} - ${result.song} (${result.year})`;
                    console.log(printable);
                });
                promptAction();
            });
        });
}
