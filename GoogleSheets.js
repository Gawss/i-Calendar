const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

function SpreadSheet(year, month, day, dayName, response){

    // If modifying these scopes, delete token.json.
    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
    const TOKEN_PATH = 'token.json';

    // Load client secrets from a local file.
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), authenticateUser);
    });

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getNewToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getNewToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
            });
        });
    }

    /**
     * Prints the names and majors of students in a sample spreadsheet:
     * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
     * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
     */

    let dateColumn = 0;
    let numDayColumn = 1;
    let activityColumn = 2;
    
    let findDate = false;
    let resp = '';

    function authenticateUser(auth) {
        const sheets = google.sheets({version: 'v4', auth});
        sheets.spreadsheets.values.get({
            spreadsheetId: '1FDxpLbMYTik2akzuPX7oZ5H31MMRtqgILsEugMR_FCo',
            range: 'A2:D',
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            const rows = res.data.values;
            
            if (rows.length) {
                for (var i = 0; i < rows.length; i++) {
                    let row = rows[i];
                    let dateFromSheets = row[dateColumn].split("/");
                    let dayFromSheets = dateFromSheets[0];
                    let monthFromSheets = dateFromSheets[1];
                    let yearFromSheets = dateFromSheets[2];

                    if(yearFromSheets == year && monthFromSheets == month && dayFromSheets == day){
                        console.log('Date found: ' +  row);
                        if(row[activityColumn] !== undefined){
                            resp = 'Me preguntaste por un ' 
                                    + dayName
                                    + '\n' 
                                    + 'El tipo de día es: ' + row[numDayColumn]
                                    + '\n' 
                                    + 'Y tiene las siguientes actividades: ' 
                                    + '\n' 
                                    + row[activityColumn];
                        }

                        findDate = true;

                    }
                }
            } else {
                console.log('No data found.');
            }
            if(findDate === true){
                response.json({
                    fulfillmentText: resp
                })
            }else{
                response.json({
                    fulfillmentText: "No tengo certeza"
                })
            }
        });
    }
}

module.exports = {
    SpreadSheet
}