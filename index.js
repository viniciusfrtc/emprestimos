const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const listaUsuarios = require('./data/usuarios.json');
const session = require('express-session');
const calc = require('./calculos');



const app = express();

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('assets'));
app.use(bodyParser.urlencoded());
app.use(session({secret: 'emprestimos'}));

let result, nomeUsuario;


app.get('/', (request, response) => {
    response.render('index');
});

app.get('/sobre', (request, response) => {
    response.render('sobre');
});

app.get('/login', (request, response) => {
    response.render('login');
});

app.post('/login', (request, response) => {
    if(request.body.email == '' || request.body.email == ''){
      response.status(400).render('login',{erro: 'Preencha todos os campos'});
    } else {
        for (let usuario of listaUsuarios){
          if(request.body.email == usuario.email && request.body.senha == usuario.senha){
            request.session.email = request.body.email;
            response.redirect('simulacao');
            return;
          };
        };
        response.render('login', {erro: 'Email ou senha inválidos'});
    };
});

app.get('/simulacao', (request, response) => {

  if(request.session.email){
    let nomeUsuario;
    for (let usuario of listaUsuarios){
      if(usuario.email == request.session.email){
        nomeUsuario = usuario.nome;
      };
    };

    response.render('simulacao', {nomeUsuario: nomeUsuario});
  } else {
    response.redirect('login');
  };
});

app.post('/simulacao', (request, response) => {

  result = calc.juros(request.body.valor, request.body.parcelas, request.body.renda);
  if (result){
    response.render('resultado', {result: result});
  } else {
    response.render('resultadoerro', {result: result});
  };
});

app.get('/resultado', (request, response) => {

  if(request.session.email){
    response.render('resultado');
  } else {
    response.redirect('login');
  };
});

app.listen(3000, () => {
    console.log('Servidor inicializado');
});
