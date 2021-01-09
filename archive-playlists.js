const fs = require('fs');
const { exit } = require('process');

const spotify = require('./spotify');

const authorizationFilePath = './account_access.json';

// ensure auth file exists
if (!fs.existsSync(authorizationFilePath)) {
    console.log('account authorization not found, please run through account authorization');
    exit;
}

// parse auth file
let authorizationFragment;
try {
    authorizationFragment = JSON.parse(fs.readFileSync(authorizationFilePath, 'utf-8'));
} catch (e) {
    console.log('authorization could not be parsed, please run through account authorization again');
    exit;
}

const x = new spotify(authorizationFragment);

x.getUser();