const path = require('path');

module.exports = {
    devServer : {
        proxy : {
            '/api' : {
                target : 'http://localhost:5000'
            },
            '/upload' : {
                target : 'http://localhost:5000'
            }
        }
    }
};