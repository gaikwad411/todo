const express = require('express')
const app = express()
const path = require('path');

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));

app.get('/jquery.js', (req, res) => res.sendFile(path.join(__dirname, 'node_modules', 'jquery', 'dist', 'jquery.min.js')));


app.listen(3000, () => console.log('Example app listening on port 3000!'));