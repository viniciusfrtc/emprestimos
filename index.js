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




app.get('/', (request, response) => {
  response.render('index');
});

app.get('/sobre', (request, response) => {
  response.render('sobre');
});

app.get('/login', (request, response) => {
  response.render('login');
});

//Este post do login confere se o email e a senha bate com o que temos no data/usuarios.json. Se um dos campos estiver vazio, retorna o
//"preencha todos os campos". O for percorre o arquivo usuarios.json procurando o email e senha que correspondam, e se houver, ele
//redireciona para a página "simulacao". Se não encontrar, aparece a mensagem de "email ou senha inválidos".

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

// A partir daqui, o usuário que tiver logado no site terá o cookie que guarda seu login, e todas as páginas adiante são bloqueadas para
// apenas usuários logados. Caso ele não esteja logado, será redirecionado a página "login".

app.get('/simulacao', (request, response) => {

  if(request.session.email){
    let nomeUsuario;
    for (let usuario of listaUsuarios){
      if(usuario.email == request.session.email){
        nomeUsuario = usuario.nome;
      };
    };
//Para usar o handlebars, e exibir o nome do usuário na página, temos que declarar como objeto o nomeUsuario dentro do render. Isso só pode ser feito
//dentro da requisição, e tem que ser desta forma (testei de outros jeitos e só assim funcionou).
    response.render('simulacao', {nomeUsuario: nomeUsuario});
  } else {
    response.redirect('login');
  };
});

//Aqui fazemos a simulação do empréstimo. A requisição post pega o que o usuário inseriu nos campos, e na variável result eu guardo o resultado da
//da função juros do calculos.js. Isso é importante porque a função retorna FALSO caso algum dos critérios de limite da proposta de empréstimo
//sejam extrapolados. Declaro todas as variáveis que serão incluídas no HTML como objeto (assim como anteriormente) para o handlebars funcionar.

app.post('/simulacao', (request, response) => {

  let result = calc.juros(request.body.valor, request.body.parcelas, request.body.renda);
  if (result){
    response.render('resultado', {result: result, pgto: calc.parcelas(request.body.valor, request.body.parcelas, request.body.renda, result), parcelas: request.body.parcelas});
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

app.get('/resultadoerro', (request, response) => {

  if(request.session.email){
    response.render('resultadoerro');
  } else {
    response.redirect('login');
  };
});

app.listen(3000, () => {
    console.log('Servidor inicializado');
});
