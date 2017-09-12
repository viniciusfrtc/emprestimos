

//Calcula a taxa de juros a.m. para o empréstimo. A taxa é meramente ilustrativa, para simular alguma interação entre as variáveis.
//A taxa varia entre 3% e 9%, de acordo com as condições apresentadas.

exports.juros = (vlrSol, parcelas, renda) => {
//Razão entre o valor pedido e a renda do usuário.
  let razao = vlrSol/renda;
//Taxa de juros mínima.
  let juros = 3;
//Coloquei como limite uma razão de 25 (50000 reais de empréstimo para 2000 de salário). Este if testa se o empréstimo simulado ultrapassa o valor máximo,
//o número máximo de parcelas ou a razão empréstimo/salário estipulada. Caso ultrapasse, retorna um FALSE que direciona a simulação do empréstimo para a
//página "resultadoerro".
  if (razao > 25 || vlrSol > 50000 || parcelas > 48){

    return false;

  };
//A razão empréstimo/salário aumenta os juros em até 3,5%.
  juros = juros + 3.5*(razao/25);
//O prazo de pagamento aumenta os juros em até 2,5%.
  juros = juros + 2.5*(parcelas/48);
//Arredondamento dos juros para 2 casas decimais.
  juros = Math.round(juros*100)/100;

  return juros;

};


//função que calcula o número de parcelas, para exibir na página de resultado
exports.parcelas = (vlrSol, parcelas, renda, juros) => {

  let montante = vlrSol;
//Simulação do cálculo de juros compostos.
  for(i = 0; i < parcelas; i++){

    montante = montante * (1 + (juros/100));
  };

  return pgto = Math.round(montante/parcelas);

};
