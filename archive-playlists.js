const fs = require('fs');
const { exit } = require('process');

const authorizationFilePath = './account_access.json';

(async function () {
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

    // create instance of driver
    const SpotifyDriver = new (require('./SpotifyDriver'))(authorizationFragment);

    const userInfo = await SpotifyDriver.getUser();

    console.log(userInfo);
})();
