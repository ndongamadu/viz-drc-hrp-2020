const geodataLink = 'data/rdc.json';
const nationalbyClusterURL = 'https://proxy.hxlstandard.org/data.csv?dest=data_edit&strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uGpZX4Ze_pk7yICc1ExWSbAuYD6MYMginWkXgcX99FQ%2Fedit%23gid%3D1962340639';
const byClusterURL = 'https://proxy.hxlstandard.org/data.csv?dest=data_edit&strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uGpZX4Ze_pk7yICc1ExWSbAuYD6MYMginWkXgcX99FQ%2Fedit%3Fusp%3Dsharing';
const clusterDataURL = 'https://proxy.hxlstandard.org/data.csv?dest=data_edit&strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uGpZX4Ze_pk7yICc1ExWSbAuYD6MYMginWkXgcX99FQ%2Fedit%3Fpli%3D1%23gid%3D1216774376';
// const indicatorsListURL = 'https://proxy.hxlstandard.org/data.csv?dest=data_edit&strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uGpZX4Ze_pk7yICc1ExWSbAuYD6MYMginWkXgcX99FQ%2Fedit%3Fpli%3D1%23gid%3D1216774376';
const indicatorsDataURL = 'data/global.csv';

const config = [
      { 
        "nationalbyClusterURL": 'https://proxy.hxlstandard.org/data.csv?dest=data_edit&strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uGpZX4Ze_pk7yICc1ExWSbAuYD6MYMginWkXgcX99FQ%2Fedit%23gid%3D1962340639',
        "byClusterURL": 'https://proxy.hxlstandard.org/data.csv?dest=data_edit&strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uGpZX4Ze_pk7yICc1ExWSbAuYD6MYMginWkXgcX99FQ%2Fedit%3Fusp%3Dsharing',
        "clusterDataURL": 'https://proxy.hxlstandard.org/data.csv?dest=data_edit&strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uGpZX4Ze_pk7yICc1ExWSbAuYD6MYMginWkXgcX99FQ%2Fedit%3Fpli%3D1%23gid%3D1216774376',
        "indicatorsDataURL": 'data/global.csv'
      },
      {
        "nationalbyClusterURL": 'https://proxy.hxlstandard.org/data.csv?dest=data_edit&strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uGpZX4Ze_pk7yICc1ExWSbAuYD6MYMginWkXgcX99FQ%2Fedit%23gid%3D54391145',
        "byClusterURL": 'https://proxy.hxlstandard.org/data.csv?dest=data_edit&strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uGpZX4Ze_pk7yICc1ExWSbAuYD6MYMginWkXgcX99FQ%2Fedit%23gid%3D960993453',
        "clusterDataURL": 'https://proxy.hxlstandard.org/data.csv?dest=data_edit&strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uGpZX4Ze_pk7yICc1ExWSbAuYD6MYMginWkXgcX99FQ%2Fedit%3Fpli%3D1%23gid%3D1216774376',
        "indicatorsDataURL": 'data/global.csv'
      }
];

//let trimestreNumber = 0;
let trimestreNumber = config.length -1;
$('#trimestreSelect').val(trimestreNumber);

let geodata;
let nationalbyCluster;
let byClusterData;
let workbookIndicators;

let clusterArr = [];
let provincesArr = [];
let zoneSanteArr = [];
let provincesAndZSData = [];

let indicatorsByCluster = [];

let choroplethData = [];

let indicatorsData ;
 
$( document ).ready(function() {

  function getData() {
    Promise.all([
      d3.json(geodataLink),
      d3.csv(config[trimestreNumber].nationalbyClusterURL),
      d3.csv(config[trimestreNumber].byClusterURL),
      d3.csv(config[trimestreNumber].clusterDataURL),
      d3.csv(config[trimestreNumber].indicatorsDataURL)
    ]).then(function(data){
      geodata = topojson.feature(data[0], data[0].objects.zsante);

      data[1].forEach( function(element, index) {
        element['#inneed+all'] = +element['#inneed+all'];
        element['#targeted+all'] = +element['#targeted+all'];
        element['#reached+all'] = +element['#reached+all'];
        element['#indicator+gap'] = +element['#indicator+gap'];
        // clusterArr.includes(element['#cluster+name']) ? '' : clusterArr.push(element['#cluster+name']);
      });

      nationalbyCluster = data[1];

      data[2].forEach( function(element, index) {
        element['#reached+all+pct'] = +element['#reached+all+pct'];
        element['#inneed+all'] = +element['#inneed+all'] ;
        element['#targeted+all'] = +element['#targeted+all'] ;
        element['#reached+all'] = +element['#reached+all'] ;

        element['#inneed+cluster+food_security'] = +element['#inneed+cluster+food_security'];
        element['#inneed+cluster+shelter'] = +element['#inneed+cluster+shelter'];
        element['#inneed+cluster+nfi'] = +element['#inneed+cluster+nfi'];
        element['#inneed+cluster+nutrition'] = +element['#inneed+cluster+nutrition'];
        element['#inneed+cluster+health'] = +element['#inneed+cluster+health']; 
        element['#inneed+cluster+protection'] = +element['#inneed+cluster+protection'];
        element['#inneed+cluster+education'] = +element['#inneed+cluster+education'];
        element['#inneed+cluster+wash'] = +element['#inneed+cluster+wash'];

        element['#targeted+cluster+food_security'] = +element['#targeted+cluster+food_security'];
        element['#targeted+cluster+shelter'] = +element['#targeted+cluster+shelter'];
        element['#targeted+cluster+nfi'] = +element['#targeted+cluster+nfi'];
        element['#targeted+cluster+nutrition'] = +element['#targeted+cluster+nutrition'];
        element['#targeted+cluster+health'] = +element['#targeted+cluster+health']; 
        element['#targeted+cluster+protection'] = +element['#targeted+cluster+protection'];
        element['#targeted+cluster+education'] = +element['#targeted+cluster+education'];
        element['#targeted+cluster+wash'] = +element['#targeted+cluster+wash'];

        element['#reached+cluster+food_security'] = +element['#reached+cluster+food_security'];
        element['#reached+cluster+shelter'] = +element['#reached+cluster+shelter'];
        element['#reached+cluster+nfi'] = +element['#reached+cluster+nfi'];
        element['#reached+cluster+nutrition'] = +element['#reached+cluster+nutrition'];
        element['#reached+cluster+health'] = +element['#reached+cluster+health']; 
        element['#reached+cluster+protection'] = +element['#reached+cluster+protection'];
        element['#reached+cluster+education'] = +element['#reached+cluster+education'];
        element['#reached+cluster+wash'] = +element['#reached+cluster+wash'];

        var obj = {'province': element['#adm1+name'], 'zsante': element['#adm3+name']};
        provincesAndZSData.push(obj);

        var obj2 = {'zsante': element['#adm3+name'], 'pct': element['#reached+all+pct']};
        choroplethData.push(obj2);
      });

      byClusterData = data[2];

      data[3].forEach( function(item) {
        var obj = {'cluster': item['#cluster+name'], 'ind': item['#indicator+name'], 'code': item['#indicator+code']};
        indicatorsByCluster.push(obj);
        clusterArr.includes(item['#cluster+name']) ? '' : clusterArr.push(item['#cluster+name']);
      });
      indicatorsData = data[4];



      initialize();

      //remove loader and show vis
      $('.loader').hide();
      $('main').css('opacity', 1);

    }) ;

  }

  function initialize() {
    var x = ['x'];
    var reachedArr = ['Pers. Atteintes'];
    var gapArr = ['Gap'];
    var keyfigsArr = [];

    nationalbyCluster.sort(sortByReached);

    nationalbyCluster.forEach( function(item) {
       reachedArr.push(item['#reached+all']);
       gapArr.push(item['#indicator+gap']);
       x.push(item['#cluster+name']);
     }); 
    
    var maxReached  = d3.max(nationalbyCluster, function(d) { return d['#reached+all'];});
    var maxPin      = d3.max(nationalbyCluster, function(d) { return d['#inneed+all'];});
    var maxTargeted = d3.max(nationalbyCluster, function(d) { return d['#targeted+all'];});
    var maxGap = ((maxReached / maxTargeted) *100 ).toFixed(2);
    
    keyfigsArr.push(maxPin);
    keyfigsArr.push(maxTargeted);
    keyfigsArr.push(maxReached);
    keyfigsArr.push(maxGap);

    var provincesArr = [];
    provincesAndZSData.forEach( function(item) {
      provincesArr.includes(item.province) ? '' : provincesArr.push(item.province);
    });
    
    $('#provinceSelect').multipleSelect('destroy');
    $('#provinceSelect').empty();
    provincesArr.sort();
    var provinceSelect = d3.select('#provinceSelect')
            .selectAll("option")
            .data(provincesArr)
            .enter().append("option")
              .text(function(d) { return d; })
              .attr("value", function(d){ return d; });

    $('#provinceSelect').multipleSelect({
      placeholder: 'Séléctionner province'
    });
    $('#provinceSelect').val('Nord-Kivu');
    $('#provinceSelect').multipleSelect('refresh');
    
    var provinceSelected = $('#provinceSelect').val();
  
    // zone de sante select
    $('#zoneSanteSelect').multipleSelect('destroy');
    $('#zoneSanteSelect').empty();
    var data = provincesAndZSData.filter(function(d){ return d.province=='Nord-Kivu'; });
    var zones = [];
    data.forEach( function(item) {
      zones.includes(item.zsante) ? '' : zones.push(item.zsante);
    });
    zones.sort();
    var zonesSanteSelect = d3.select('#zoneSanteSelect')
            .selectAll("option")
            .data(zones)
            .enter().append("option")
              .text(function(d) { return d; })
              .attr("value", function(d){ return d; });

    $('#zoneSanteSelect').multipleSelect();
    $('#zoneSanteSelect').prepend('<option value="">Séléctionner zone de santé</option>');
    $('#zoneSanteSelect').val($('#zoneSanteSelect option:first').val());
    $('#zoneSanteSelect').removeAttr("disabled");
    trimestreNumber == 1 ? d3.select('#zoneSanteSelect').attr("disabled", "disabled") : '';
    $('#zoneSanteSelect').multipleSelect('refresh');

    //cluster select
    $('#clusterSelect').multipleSelect('destroy');
    $('#clusterSelect').empty();
    clusterArr.sort();
    var clusterSelect = d3.select('#clusterSelect')
        .selectAll("option")
        .data(clusterArr)
        .enter().append("option")
          .text(function(d){ return d; })
          .attr("value", function(d) { return d; });

    $('#clusterSelect').multipleSelect();
    $('#clusterSelect').prepend('<option value="">Séléctionner cluster</option>');
    $('#clusterSelect').val($('#clusterSelect option:first').val());
    $('#clusterSelect').multipleSelect('refresh');

    // indicators select
    $('#indicateurSelect').multipleSelect('destroy');
    $('#indicateurSelect').empty();
    $('#indicateurSelect').multipleSelect();
    $('#indicateurSelect').prepend('<option value="">Séléctionner activité</option>');
    $('#indicateurSelect').val($('#indicateurSelect option:first').val());
    $('#indicateurSelect').multipleSelect('refresh');
    trimestreNumber == 1 ? d3.select('#indicateurSelect').attr("disabled", "disabled") : '';
    $('#indicateurSelect').multipleSelect('refresh');

    generateMap(geodata);
    generateStackedBar([x, reachedArr, gapArr]);
    generateKeyFigures(keyfigsArr);
    drawTable();
    // getIndicatorData("SO2_IN2");

    
  } //initialize



  $('#resetMap').on('click', function(e){
    console.log("reset charts graphe")
    initialize();
  });

  $('#trimestreSelect').on('change', function(d){
    trimestreNumber = $('#trimestreSelect').val();
    
    //remove loader and show vis
    $('.loader').show();
    $('main').css('opacity', 0);

    getData();


  });

  var sortByReached = function sort_by_reached(d1, d2) {
      if (d1['#reached+all'] > d2['#reached+all']) return -1;
      if (d1['#reached+all'] < d2['#reached+all']) return 1; 
      return 0;
  } //sort_by_reached



  getData();

  
});