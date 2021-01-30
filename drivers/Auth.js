const fs = require('fs');

class Auth {
    /** 
     * @throws Error
     * @returns object|void */
    static getAccountAccess() {
        return this._readAndParseAccountAccess();
    }

    /**
     * @throws Errora
     * @returns object|void
     */
    static _readAndParseAccountAccess() {
        if (! fs.existsSync('account_access.json')) {
            throw Error('account access file does not exist');
        }

        try {
            return JSON.parse(fs.readFileSync('account_access.json'));
        } catch (e) {
            throw Error('account access file exists, but was corrupted');
        }
    }
}

module.exports = Auth;