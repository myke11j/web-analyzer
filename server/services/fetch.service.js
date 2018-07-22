const https = require('https')

module.exports = (END_POINT) => new Promise((resolve, reject) => {
    https.get(END_POINT, (response) => {
        let data = ''
        response.on('data', (d) => {
            data += d;
        });
        response.on('end', () => {
            console.log(`Successfully fetched data from ${END_POINT}`);
            return resolve({ data, statusCode: response.statusCode });
        })
    })
    .on('error', e => reject(e));
});
