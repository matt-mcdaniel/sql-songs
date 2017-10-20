const printSong = (...columns) => result => {
    let printable = '';

    if (columns.includes('artist')) {
        printable += result.artist + ' ';
        if (columns.includes('song')) printable += '- ';
    }

    if (columns.includes('song')) {
        printable += result.song + ' ';
    }

    if (columns.includes('year')) {
        printable += `(${result.year})`;
    }

    console.log(printable || JSON.stringify(result, null, 2));
};

module.exports = {printSong};
