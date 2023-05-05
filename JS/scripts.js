var dados_mapa = [
  ['Paises', 'Casos'],
  ['0', 0]
];

var dadosGrafico = [
  ['status', 'total'],
];

async function carregarDados() {
  await fetch('https://covid19-brazil-api.now.sh/api/report/v1/countries')
    .then(Response => Response.json())
    .then(dados => prepararDados(dados))
}

function prepararDados(dados) {
  let totalCasos = 0;
  let totalMortes = 0;

  if (dados['data'].length > 0) {
    dados_mapa = [['Paises', 'Casos',]];

    //laço For para percorrer todos os dados
    for (let i = 0; i < dados['data'].length; i++) {
      pais = dados['data'][i].country;
      casos = dados['data'][i].confirmed;
      dados_mapa.push([pais, casos]);
      totalCasos = totalCasos + dados['data'][i].confirmed;
      totalMortes = totalMortes + dados['data'][i].deaths;
    }
    dadosGrafico.push(['confirmados', totalCasos]);
    dadosGrafico.push(['mortes', totalMortes]);
    desenhaGraficoMapa();
    desenharPizza();
  }
}
//--------------------mapa---------------------//

google.charts.load('current', {
  'packages': ['geochart'],
});
google.charts.setOnLoadCallback(desenhaGraficoMapa);

function desenhaGraficoMapa() {
  let data = google.visualization.arrayToDataTable(dados_mapa);

  let options = {
    heigth: 700, width: 800,
    backgroundColor: '#a1d5ee'
  };

  let chart = new google.visualization.GeoChart(document.getElementById('mapa1'));

  chart.draw(data, options);
};
//
function obterDados() {
  let dados = [
    ['País', '%'],
    ['Mexico', 20.060,],
    ['United States', 107.072],
    ['Brazil', 701.494],
    ['Canada', 123.456],
    ['France', 5.000],
    ['RU', 234]
  ];
  return dados;
};


//--------------pizza-----------------//

google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(desenharPizza);

function desenharPizza() {

  let data = google.visualization.arrayToDataTable(dadosGrafico);

  let options = {
    is3D:true

  };

  var chart = new google.visualization.PieChart(document.getElementById('grafico-pizza'));

  chart.draw(data, options);
}


//-----------------tabela--------------------//


async function carregarDados2() {

  //chamada a API para obter os dados
  await fetch('https://covid19-brazil-api.now.sh/api/report/v1')
    .then(Response => Response.json())
    .then(dados2 => prepararDados2(dados2))                 //chamando função para gerar HTML dinâmico
}


//função para preparar os dados e gerar o HTML dinâmico
function prepararDados2(dados2) {
  console.log(dados2)

  //variável para manipular o tbody do html
  let linhas = document.getElementById('linhas');
  linhas.innerHTML = '';

  //laço For para percorrer todos os dados recebidos
  for (let i = 0; i < dados2['data'].length; i++) {
    let auxLinha = '';

    //linha zebrada
    if (i % 2 != 0)
      auxLinha = '<tr class="listra">';
    else
      auxLinha = '<tr>';

    //Continuar inserindo o código e o nome da moeda
    auxLinha = auxLinha + '<td>' + dados2['data'][i].uf + '</td>' +
      '<td>' + dados2['data'][i].state + '</td>' +
      '<td>' + dados2['data'][i].cases + '</td>' +
      '<td>' + dados2['data'][i].deaths + '</td>' +
      '<td>' + dados2['data'][i].suspects + '</td>' +
      '<td>' + dados2['data'][i].refuses + '</td>' +
      '</tr>';

    // Inserindo o html gerado (linha) no innerHTML da TBody
    linhas.innerHTML = linhas.innerHTML + auxLinha;


  }
}




























document.addEventListener(  "DOMContentLoaded",
                            function(event) {
                                carregarDados();
                                carregarDados2();
                            }
);