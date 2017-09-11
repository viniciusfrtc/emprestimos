//o output deve ser entre 3 e 8%



exports.juros = (vlrSol, parcelas, renda) => {

let razao = vlrSol/renda;

let juros = 3;

if (razao > 25){

  return false;

}

juros = juros + 3.5*(razao/25);

let anos = parcelas/12;

juros = juros + 2.5*(anos/4);

juros = Math.round(juros*100)/100;

return juros;

};
