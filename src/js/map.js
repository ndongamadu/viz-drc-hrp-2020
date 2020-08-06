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











