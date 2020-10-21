const fs = require('fs');
const readline = require('readline');

// Pretty display of the serialized number
const zero =
    " _ " +
    "| |" +
    "|_|";

const one =
    "   " +
    "  |" +
    "  |";

const two =
    " _ " +
    " _|" +
    "|_ ";

const three =
    " _ " +
    " _|" +
    " _|";

const four =
    "   " +
    "|_|" +
    "  |";

const five =
    " _ " +
    "|_ " +
    " _|";

const six =
    " _ " +
    "|_ " +
    "|_|";

const seven =
    " _ " +
    "  |" +
    "  |";

const eight =
    " _ " +
    "|_|" +
    "|_|";

const nine =
    " _ " +
    "|_|" +
    " _|";

// Utility object to map the "weird" string to a real number
const stringToNumber = {};
stringToNumber[zero] = 0;
stringToNumber[one] = 1;
stringToNumber[two] = 2;
stringToNumber[three] = 3;
stringToNumber[four] = 4;
stringToNumber[five] = 5;
stringToNumber[six] = 6;
stringToNumber[seven] = 7;
stringToNumber[eight] = 8;
stringToNumber[nine] = 9;

// Main method, take the path to a file then output the results to both a file and console
const processAccountNumbersFile = (filePath) => {
    fs.writeFile('tmp/output.txt', '', err => {
        if (err) throw err;
        let outputFileStream = fs.createWriteStream('./tmp/output.txt');


        const readInterface = readline.createInterface({
            input: fs.createReadStream(filePath),
            output: process.stdout,
            console: false
        });

        let tmpArray = [];
        readInterface.on('line', line => {
            tmpArray.push(line);
            if (tmpArray.length === 3) {
                let accountNumber = deserializeAccountNumber(tmpArray.join(''));
                outputAccountNumber(accountNumber, outputFileStream);
            } else if (tmpArray.length === 4) {
                // The empty line, we reset
                tmpArray = []
            }
        })
    });
};

// Take the concatenated account number string
const deserializeAccountNumber = (serialized_numbers) => {
    if (serialized_numbers.length % 9 !== 0) {
        throw "Invalid serialized number";
    }

    // Let's recreate the 2D array, then zip the 9 characters together
    let groupedByThree = chunk(serialized_numbers.split(""), 3);
    let groupedByLine = chunk(groupedByThree, groupedByThree.length / 3);

    let resultArray = zip(groupedByLine).map((serialized_number) => {
        let serialized_string = serialized_number.flat().join('');
        let resultingNumber = stringToNumber[serialized_string];

        return (typeof resultingNumber !== 'undefined') ? resultingNumber : '?'
    });

    return resultArray.join('');
};

// Validate the checksum formula
const isValidChecksum = (accountNumber) => {
    return accountNumber
        .split('')
        .map(v => parseInt(v))
        .reduce((sum, value, index) =>  sum + (9 - index + 1) * value) % 11 === 0
};

const outputAccountNumber = (accountNumber, writeStream) => {
    let message = '';
    
    if (accountNumber.includes("?")) {
        message = `${accountNumber} ILL`;
    } else if (!isValidChecksum(accountNumber)) {
        message = `${accountNumber} ERR`;
    } else {
        message = accountNumber
    }

    console.log(message);
    writeStream.write(message);
    writeStream.write('\n')
};


// Utility methods to emulate Lodash functionality

const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
    );


const zip = (rows) => [...rows[0]].map((_,c) => rows.map(row => row[c]));

module.exports = {
    processAccountNumbersFile,
    deserializeAccountNumber,
    isValidChecksum
};
