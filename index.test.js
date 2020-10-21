const { deserializeAccountNumber } = require('./index');
const { isValidChecksum } = require('./index');
const { processAccountNumbersFile } = require('./index');

const assert = require('assert');

assert.equal(deserializeAccountNumber(
    "    _  _     _  _  _  _  _  _ " +
    "  | _| _||_||_ |_   ||_||_|| |" +
    "  ||_  _|  | _||_|  ||_| _||_|"
    ), '1234567890'
);

assert.equal(deserializeAccountNumber(
    "    _  _     _  _  _  _  _  _ " +
    "  | _| _||_| _ |_   ||_||_|| |" +
    "  ||_  _|  | _||_|  ||_| _||_|"
    ), '1234?67890'
);


assert.equal(isValidChecksum('345882865'), true);
assert.equal(isValidChecksum('111111111'), false);


assert.doesNotThrow(_ => processAccountNumbersFile('./fixtures/input.txt'));