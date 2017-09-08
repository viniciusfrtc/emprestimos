const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('assets'));
app.use(bodyParser.urlencoded());

let paginaAtiva = 'index';

app.get('/', (request, response) => {
    paginaAtiva = 'index',
    response.render('index');
});

app.get('/sobre', (request, response) => {
    paginaAtiva = 'sobre',
    response.render('sobre');
});

app.get('/simulacao', (request, response) => {
    paginaAtiva = 'simulacao',
    response.render('simulacao');
});


app.listen(3000, () => {
    console.log('Servidor inicializado');
});
