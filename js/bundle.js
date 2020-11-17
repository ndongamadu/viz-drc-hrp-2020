// window.$ = window.jQuery = require('jquery');
let ochaBlue = '#418FDE';
let ochaOrange = '#ECA154';

let clusterBarchart ;





function generateStackedBar(data){

	clusterBarchart = c3.generate({
		bindto: '#barchart',
		size: { height: 470 },
		padding: {right: 15},
	    data: {
	        x: 'x',
	        columns: data,
	        type: 'bar',
	        groups: [
	            ['Pers. Atteintes', 'Gap']
	        ]
	    },
	    color: {
	    	pattern: [ochaBlue, ochaOrange]
	    },
	    axis: {
	        rotated : true,
	      x: {
	          type : 'category',
	          tick: {
	          	outer: false
	          }
	      },
	      y: {
	      	tick: {
	      		outer: false,
	      		format: d3.format('.2s'),
	      		count: 5,
	      	}
	      } 
	    }
	});
}//generateStackedBar

function updateClusterChart(data) {
	// var data = getAdm3ClusterData(adm3);
	clusterBarchart.load({
		columns: data,
		unload: true
	});
}//updateClusterChart


function getAdm3ClusterData(adm3) {
	var x = ['x'];
	var reachedArr = ['Pers. Atteintes'];
	var gapArr = ['Gap'] ;
	
	
	var data = byClusterData.filter(function(d) { return d['#adm3+name']==adm3; });
	var reachedList = [];
	for (var i = 0; i < clustersEn.length; i++) {
		var tag = 'cluster+'+clustersEn[i];

		var obj = {
			'cluster': clustersEn[i],
			'pin': data[0]['#inneed+'+tag],
			'reached': data[0]['#reached+'+tag],
			'targeted': data[0]['#targeted+'+tag],
			'gap': (data[0]['#targeted+'+tag] - data[0]['#reached+'+tag])
		};
		reachedList.push(obj);
	}
	reachedList.sort(function(a, b){
		return a.reached > b.reached ? -1 : 
				a.reached < b.reached ? 1 : 0 ;
	});

	for (var i = 0; i < reachedList.length; i++) {
		x.push(getClusterFr(reachedList[i].cluster));
		reachedArr.push(reachedList[i].reached);
		// positive gap value
		var gap = reachedList[i].gap;
		gap < 0 ? gap = -gap : '';
		gapArr.push(gap);
	}

	var maxReached  = d3.max(reachedList, function(d) { return d.reached;});
    var maxPin      = d3.max(reachedList, function(d) { return d.pin;});
    var maxTargeted = d3.max(reachedList, function(d) { return d.targeted;});
    var maxGap = ((maxReached / maxTargeted) *100 ).toFixed(2);
    var maxGapRetranche = 100 - maxGap ;
    generateKeyFigures([maxPin, maxTargeted, maxReached, maxGap]);
	
	return {'columns':[x, reachedArr, gapArr], 'pieChart': [maxGap, maxGapRetranche]};
}//getAdm3ClusterData


function generateKeyFigures(arr) {

	var kf1 = '<div class="col-3 keyfig"><div class="num">'+d3.format(".4s")(arr[0])+'</div><h4>Pers. dans le besoin</h4></div>';
	var kf2 = '<div class="col-3 keyfig"><div class="num">'+d3.format(".4s")(arr[1])+'</div><h4>Pers. ciblées</h4></div>';
	var kf3 = '<div class="col-3 keyfig"><div class="num">'+d3.format(".4s")(arr[2])+'</div><h4>Pers. atteintes</h4></div>';
	var kf4 = '<div class="col-3 keyfig"><div class="num">'+arr[3]+'% </div><h4>Pers. atteintes(%)</h4></div>';
	$('#keyfigures').html('')
	$('#keyfigures').append(kf1);
	$('#keyfigures').append(kf2);
	$('#keyfigures').append(kf3);
	$('#keyfigures').append(kf4);
} //generateKeyFigures

function generatePieChart(name, data) {
	var pin = ['Atteintes', data[0]];
	var cible = ['Gap', data[1]];

	var chart = c3.generate({
		bindto: '.pieChart',
		title: {
			text: name,
			position: 'upper-left'
		},
	    data: {
	        columns: [cible, pin],
	        type : 'pie'
	    },
	    color: {
	    	pattern: [ochaBlue, ochaOrange]
	    }
	}); 
}









function updateZoneSanteSelect() {
	var provinceSelected = $('#provinceSelect').val();
	if (provinceSelected != "") {
		var data = provincesAndZSData.filter(function(d){ return d.province==provinceSelected; });
		var zones = [];
		data.forEach( function(item) {
			zones.includes(item.zsante) ? '' : zones.push(item.zsante);
		});
		zones.sort();
		$('#zoneSanteSelect').empty();
		var zsanteSelect = d3.select('#zoneSanteSelect')
				.selectAll("option")
				.data(zones)
				.enter().append("option")
					.text(function(d){ return d; })
					.attr("value", function(d) { return d; });

		$('#zoneSanteSelect').prepend('<option value="">Séléctionner zone de santé</option>');
	    $('#zoneSanteSelect').val($('#zoneSanteSelect option:first').val());
		$('#zoneSanteSelect').multipleSelect('refresh');	
	}

} //updateZoneSanteSelect

function updateFromZSante(zone_sante) {
	if (trimestreNumber == 1) {

	} else {
		var prov =  provincesAndZSData.filter(function(d){ return d.zsante==zone_sante; })[0].province;
		$('#provinceSelect').val(prov);
		$('#provinceSelect').multipleSelect('refresh');

		updateZoneSanteSelect();
		$('#zoneSanteSelect').val(zone_sante);
		$('#zoneSanteSelect').multipleSelect('refresh');
	}
} //updateFromZSante

function updateIndicatorSelect(argument) {
	var clusterSelected = $('#clusterSelect').val();
	if (clusterSelected != "") {
		var data = indicatorsByCluster.filter(function(d){ return d.cluster==clusterSelected; });
		var inds = [];
		data.forEach( function(item) {
			inds.includes(item.ind) ? '' : inds.push(item.ind);
		});

		$('#indicateurSelect').empty();
		inds.sort();
		var indSelect = d3.select('#indicateurSelect')
			.selectAll("option")
			.data(inds)
			.enter().append("option")
				.text(function(d){ return d;})
				.attr("value",function(d){ return d; });

		$('#indicateurSelect').prepend('<option value="">Séléctionner activité</option>');
    	$('#indicateurSelect').val($('#indicateurSelect option:first').val());
		$('#indicateurSelect').multipleSelect('refresh');
	}
}//updateIndicatorSelect


function drawTable(type, data) {
	if (type==undefined) type="autre";
	var colones = [];
	var dataT = [];
	if (type=='zsante') {
		colonnes = ["Cluster", "Activité", "Pers. Ciblées", "Pers. Atteintes", "% Pers. Atteintes"];
	} else if (type=='indicateur') {
		colonnes = ["Territoire", "Zone de Santé", "Personnes Ciblées", "Personnes Atteintes", "% Personnes Atteintes"];
	} else if (type='autre'){
		colonnes = ["Territoire", "Zone de Santé", "Personnes Ciblées", "Personnes Atteintes", "% Personnes Atteintes"];
	}

	d3.select('#datatable').select("tr").selectAll("th").remove();

	var headers = d3.select('#datatable')
			.select("tr")
			.selectAll("th")
			.data(colonnes)
			.enter().append("th")
				.text(function(d){ return d; });

	var selectedProvince = $('#provinceSelect').val();
	
	selectedProvince == "" ? selectedProvince = "Nord-Kivu" : '';
	
	if (data == undefined) {
		var dtArr = byClusterData.filter(function(d){ return d['#adm1+name'] == selectedProvince; });
		var dTable = [];
		dtArr.forEach( function(item) {
			var pct = (item['#reached+all+pct']).toFixed(2);
			dataT.push([item['#adm2+name'], item['#adm3+name'], d3.format(',d')(item['#targeted+all']),d3.format(',d')(item['#reached+all']), pct+"%"]);
		});
	} else {
		dataT = data;
	}


	if($.fn.dataTable.isDataTable( '#datatable' )){
	  $('#datatable').dataTable().fnClearTable();
	} else {
	  $('#datatable').DataTable({
	    data : [],
	    "bFilter" : false,
	    "bLengthChange" : false,
	    "pageLength": 20,
	    dom: 'Bfrtip',
	    buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
	  });
	}
	$('#datatable').dataTable().fnAddData(dataT);
} //drawTable


function updateTablePerCluster() {
	// we are sure that theses filters aren't ""
 	var selectedProvince = $('#provinceSelect').val();
	var selectedCluster = $('#clusterSelect').val();

	var clster = getClusterEN(selectedCluster);

	var data = byClusterData.filter(function(d){ return d['#adm1+name']==selectedProvince; });
	var dataT = [];

	data.forEach( function(item) {
		var cible = Number(item['#targeted+cluster+'+clster]) ;
		var atteint = item['#reached+cluster+'+clster] ;
		var pct = 0;
		if (cible != 0) {
			pct = ((atteint/cible)*100).toFixed(2);
		}
		dataT.push([item['#adm2+name'], item['#adm3+name'], d3.format(',d')(cible), d3.format(',d')(atteint), pct+"%"]);
	});

	drawTable("autre", dataT);

} //updateTablePerCluster

function updateTablePerZSante() {
	var selectedZsante = $('#zoneSanteSelect').val();
	var selectedCluster = $('#clusterSelect').val();
	
	var data = indicatorsData.filter(function(d){ return d["Zone de Santé"]==selectedZsante ;});

	var datatab = [];
	var clusters = clusterArr ;
	if (selectedCluster !="") {
		clusters = clusterArr.filter(function(d){ return d == selectedCluster;});
	}

	clusters.forEach( function(clster) {
		var arr = indicatorsByCluster.filter(function(d){ return d.cluster == clster; });
		var indics = arr.map(function(d){ return d.code; });
		indics.forEach( function(ind) {
			var ciblees = +data[0][ind+"_Total cible"];
			var atteintes = +data[0][ind+"_atteint"];
			var pct = 0;
			if (ciblees != 0) {
				pct = ((atteintes/ciblees)*100).toFixed(2);
			}
			var name = getindicatorNameFromCode(ind);
			datatab.push([clster, name, d3.format(',d')(ciblees), d3.format(',d')(atteintes), pct+"%"]);
		});
		
	});

	drawTable('zsante', datatab); 
} //updateTablePerZSante


function updateTablePerIndicator() {

	var selectedInd = $('#indicateurSelect').val();
	var indCode ;
	indicatorsByCluster.forEach( function(element) {
		element.ind == selectedInd ? indCode = element.code : '';
	});
	var data = indicatorsData ;
	var selectedProvince = $('#provinceSelect').val();
	if (selectedProvince != "") {
		data = indicatorsData.filter(function(d){ return d["Province"]==selectedProvince ;});
	}
	var datatab = [];

	data.forEach( function(item) {
		var ciblees = +item[indCode+'_Total cible'];
		var atteintes = +item[indCode+'_atteint'];
		var pct = 0;
		if (ciblees != 0) {
			pct = ((atteintes/ciblees)*100).toFixed(2);
		}
		datatab.push([item['Territoire'], item['Zone de Santé'], ciblees, atteintes, pct]);

	});
	drawTable('indicateur', datatab); 
} //updateTablePerIndicator


function getindicatorNameFromCode(code) {
	var arr = indicatorsByCluster.filter(function(d){
		return d.code == code ;
	});
	return arr[0].ind;
}//getindicatorNameFromCode


$('#zoneSanteSelect').on('change', function(){
	$('#indicateurSelect').val($('#indicateurSelect option:first').val());
	d3.select('#indicateurSelect').attr("disabled", "disabled");
	$('#indicateurSelect').multipleSelect('refresh');
});

$('#indicateurSelect').on('change', function(){
	$('#zoneSanteSelect').val($('#zoneSanteSelect option:first').val());
	d3.select('#zoneSanteSelect').attr("disabled", "disabled");
	$('#zoneSanteSelect').multipleSelect('refresh');
});


$('#provinceSelect').on('change', function(d){
	// if (trimestreNumber == 1) {
	// 	d3.select('#zoneSanteSelect').attr("disabled", "disabled");
	// 	d3.select('#indicateurSelect').attr("disabled", "disabled");
	// 	$('#zoneSanteSelect').multipleSelect('refresh');
	// }
	updateZoneSanteSelect();
});

$('#clusterSelect').on('change', function(d){
	// if (trimestreNumber == 1) {
	// 	d3.select('#zoneSanteSelect').attr("disabled", "disabled");
	// 	d3.select('#indicateurSelect').attr("disabled", "disabled");
	// 	$('#zoneSanteSelect').multipleSelect('refresh');
	// }
	updateIndicatorSelect();
});

$('#apply').on('click', function(d){
	
	var selectedProvince = $('#provinceSelect').val();
	var selectedZsante = $('#zoneSanteSelect').val();
	var selectedCluster = $('#clusterSelect').val();
	var selectedInd = $('#indicateurSelect').val();

	if (selectedZsante !="") {
		updateTablePerZSante();
		var data = getAdm3ClusterData(selectedZsante);	
		updateClusterChart(data.columns);
		info.update(selectedZsante);

	} else if (selectedInd !="") {
		updateTablePerIndicator();
		
	} else if (selectedCluster != "") {
		if(selectedProvince != "") {
			updateTablePerCluster();
		} else {
			drawTable();
		}

	} else if (selectedProvince != ""){
		drawTable();
	}

	// if nothing is selected call reset();

	// updateTablePerProvince();
	if (trimestreNumber != 1) {
		$('#zoneSanteSelect').removeAttr("disabled");
		$('#zoneSanteSelect').multipleSelect('refresh');

		$('#indicateurSelect').removeAttr("disabled");
		$('#indicateurSelect').multipleSelect('refresh');
	} 


});

$('#reset').on('click', function(d){
	//reinit Province and cluster selects to first/default value
	$('#provinceSelect').val('Nord-Kivu');
    $('#provinceSelect').multipleSelect('refresh');

    $('#clusterSelect').val($('#clusterSelect option:first').val());
	$('#clusterSelect').multipleSelect('refresh');
	drawTable();
});













function hxlProxyToJSON(input){
    var output = [];
    var keys=[]
    input.forEach(function(e,i){
        if(i==0){
            e.forEach(function(e2,i2){
                var parts = e2.split('+');
                var key = parts[0]
                if(parts.length>1){
                    var atts = parts.splice(1,parts.length);
                    atts.sort();                    
                    atts.forEach(function(att){
                        key +='+'+att
                    });
                }
                keys.push(key);
            });
        } else {
            var row = {};
            e.forEach(function(e2,i2){
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
}

let clustersEn = ['food_security', 'shelter', 'nfi', 'nutrition', 'health', 'protection', 'education', 'wash'];


function getClusterFr(cluster) {
    var fr = "";
    cluster=="food_security" ? fr = "Sécurité Alimentaire" : 
    cluster=="shelter" ? fr = "Abris" : 
    cluster=="nfi" ? fr = "Article Ménager Essentiel" : 
    cluster=="nutrition" ? fr = "Nutrition" : 
    cluster=="health" ? fr = "Santé" : 
    cluster=="protection" ? fr = "Protection" : 
    cluster=="education" ? fr = "Education" :
    cluster=="wash" ? fr = "WASH" : '';
    
    return fr;
} //getClusterFr


function getClusterEN(clusteur) {
    var en = "";
    clusteur=="Sécurité Alimentaire" ? en = "food_security" : 
    clusteur=="Abris" ? en = "shelter" : 
    clusteur=="Article Ménager Essentiel" ? en = "nfi" : 
    clusteur=="Nutrition" ? en = "nutrition" : 
    clusteur=="Santé" ? en = "health" : 
    clusteur=="Protection" ? en = "protection" : 
    clusteur=="Education" ? en = "education" :
    clusteur=="WASH" ? en = "wash" : '';
    
    return en;
} //getClusterFr





let map;
let geojson;
let info;

let mapColor  = '';
let ochaNeutral = '#999999';

let higherColor = '#CD3A1F';
let higherLightColor = '#144372';
let middleColor = '#1F69B3';
let middleLightColor = '#418FDE';
let lightColor = '#D4E5F7';
let lowerColor = '#82B5E9';
let veryLowerColor = '#E9F2FB';
let naColor =  '#BFBFBF';//'#F2F2F2';

let mapJoinColumnName = '';
let targetedByAdm3 = {};

function generateMap(geom) {
  byClusterData.forEach( function(item) {
    var pt = item['#reached+all+pct'] ;
    isNaN(pt) ? pt = 0 : '';
    targetedByAdm3[item['#adm3+name']] = {'pct': pt};
   }); 

	map !=undefined ? map.remove() : null;
    
    map = L.map('map',
    {
      maxZoom : 10,
      minZoom: 4
    });
    var stamenMap = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20,
        ext: 'png'
    });

    var jawgmap =
    L.tileLayer('https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: 22,
        accessToken: 'BJUY4Y0kCLP3b4fRCbZQlOT6UVaOWuGTd5OphzbCVXqJjNJcZPOwi9o71ZGayTyx'
    }); 

    stamenMap.addTo(map); 
    
    geojson = L.geoJson(geom,
              { 
                style:style,
                onEachFeature: onEachFeature
              }).addTo(map);

    map.fitBounds(geojson.getBounds()); 

    var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function(map){
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [higherColor, higherLightColor, middleColor,middleLightColor, lowerColor,veryLowerColor, naColor],
      labels = [' > 100 ',
                '70 - 99',
                '40 - 69',
                '20 - 39',
                '10 - 19',
                '1 - 9',
                '0++'];

      div.innerHTML += '<p>Pers. atteintes (%)</p';
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML += 
            '<i style="background:' + grades[i] + '"></i> ' +
            labels[i] + '<br>';
      }

      return div;
    };

    legend.addTo(map);

    // add reset button 
     info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (adm3) {
      var deflt = "<h4>Séléctionner sur une zone de santé</h4>";
      
      if (adm3 == undefined) {
        this._div.innerHTML = deflt ;
      } else {
        this._div.innerHTML = '<h3> Zone de Santé '+ adm3 + '</h3>';
       
      }
 
    };
    info.addTo(map);
} //generateMap


function style(feature) {
	return {
	    fillColor: getColor(feature.properties.Nom),
	    weight: 2,
	    opacity: 1,
	    color: ochaNeutral,
	    dashArray: '3',
	    fillOpacity: 0.7
	  };
}

function getColor(adm3Name) {

  var percentageAtteinte = 0;
  targetedByAdm3[adm3Name] !=undefined? percentageAtteinte = targetedByAdm3[adm3Name].pct : '';

  return  (percentageAtteinte >= 100) ? higherColor :
          (99 > percentageAtteinte && percentageAtteinte >= 70)  ? higherLightColor :
          (69 > percentageAtteinte && percentageAtteinte >= 40)  ? middleColor :
          (39 > percentageAtteinte && percentageAtteinte >= 20)  ? middleLightColor :
          (19 > percentageAtteinte && percentageAtteinte >= 10)  ? lowerColor : 
          (9 > percentageAtteinte && percentageAtteinte >= 1)  ? veryLowerColor : naColor;
} //getColor 

function mapClicked (e) {
	var layer = e.target ;
  var adm3 = layer.feature.properties.Nom ;
  var data = getAdm3ClusterData(adm3);	
	layer.on('popupopen', function(d){
		generatePieChart(adm3, data.pieChart);
	});
  updateClusterChart(data.columns);
  updateFromZSante(adm3);
  updateTablePerZSante();
  info.update(adm3);

  $('#indicateurSelect').val($('#indicateurSelect option:first').val());
  d3.select('#indicateurSelect').attr("disabled", "disabled");
  $('#indicateurSelect').multipleSelect('refresh');
}

function onEachFeature(feature, layer) {
	var div = L.DomUtil.create('div', 'pieChart');
  	layer.on({
      mouseover: showName,
      mouseout: resetHighlight,
      click: mapClicked
  	}).bindPopup(div);
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  e.target.closePopup();
}//resetHighlight

function showName(e) {
  var adm3 = e.target.feature.properties.Nom ;

  var popup = L.popup()
   .setLatLng(e.latlng) 
   .setContent((adm3).toUpperCase())
   .openOn(map);
}//showName












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