const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const regex = require('./regex');

const app = express();
const port = 8000;

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', '*');
    res.append('Access-Control-Allow-Methods', '*');
    res.append('Access-Control-Allow-Headers', '*');
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/logs', (req, res) => {
    fs.readFile('transactions.log','utf8', (err, string) => {
        if (err) {
            errMsg = 'Error reading the file: ' + err;
            console.log(errMsg);
            res.status(500).send(errMsg);
        } else {
            const query = req.header('query');
            package = regex(string, query);
            res.status(200).send(package);
        }
    })
})

app.post('/logs', (req, res) => {
    console.log(req.body);
    fs.appendFile('transactions.log', '$%' + JSON.stringify(req.body) + '%$\n', (err) => {
        if (err) {
            const errMsg  = 'Problem writing to file: ' + err;
            console.log(errMsg);
            res.status(500).send(errMsg);
        } else {
            res.status(200).send("Transaction has been successfully logged.");
        }
    });
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})