const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const app = express();

// Settings
app.set('port', process.env.PORT || 3000);

// Middleware
app.use(express.static(path.resolve(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(bodyparser.urlencoded({extended: false}));
app.use(require('./news.js'));

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});