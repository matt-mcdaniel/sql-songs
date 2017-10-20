const inquirer = require('inquirer');

const {questions} = require('./constants');

function DatabaseController(connection) {
    this.connection = connection;

    this.queryPromise = (query, queryObj) => {
        return new Promise((resolve, reject) => {
            this.connection.query(query, queryObj, (err, results) => {
                if (err) throw err;
                return resolve(results);
            });
        });
    };

    // Search for any song by name
    this.getSongsBySongName = function() {
        return inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'songName',
                    message: 'Enter name of song'
                }
            ])
            .then(answers =>
                this.queryPromise('SELECT * FROM top5000 WHERE song LIKE ?', [
                    answers.songName
                ])
            );
    };

    // Search for artist
    this.getSongsByArtist = function() {
        return inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'artist',
                    message: 'Please enter an artist'
                }
            ])
            .then(answers =>
                this.queryPromise('SELECT song, year FROM top5000 WHERE ?', {
                    artist: answers.artist
                })
            );
    };

    // Show songs between date range
    this.getSongsBetweenDates = function() {
        console.log('Find song hits between two years');
        return inquirer
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
                return this.queryPromise(query, [answers.startDate, answers.endDate]);
            });
    };

    // Show artists, hits who appear in top 5000 songs DB more than 15 times
    this.getPopularArtists = function() {
        const query = `
            SELECT artist, count(*) AS counter
            FROM top5000
            GROUP BY artist
            HAVING counter > 15
            ORDER BY counter DESC
        `;
        return this.queryPromise(query);
    };

    return this;
}

module.exports = DatabaseController;
