let ochaBlue = '#418FDE';
let ochaOrange = '#ECA154';

let clusterBarchart ;

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

function generateStackedBar(data){

	clusterBarchart = c3.generate({
		bindto: '#barchart',
		size: { height: 450 },
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
	      	show: false,
	      	tick: {
	      		outer: false
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

    generateKeyFigures([maxPin, maxTargeted, maxReached, maxGap]);
	
	return {'columns':[x, reachedArr, gapArr], 'pieChart': [maxTargeted, maxPin]};
}//getAdm3ClusterData


function generateKeyFigures(arr) {

	var kf1 = '<div class="col-3 keyfig"><div class="num">'+d3.format("~s")(arr[0])+'</div><h4>Pers. dans le besoin</h4></div>';
	var kf2 = '<div class="col-3 keyfig"><div class="num">'+d3.format("~s")(arr[1])+'</div><h4>Pers. ciblées</h4></div>';
	var kf3 = '<div class="col-3 keyfig"><div class="num">'+d3.format("~s")(arr[2])+'</div><h4>Pers. atteintes</h4></div>';
	var kf4 = '<div class="col-3 keyfig"><div class="num">'+arr[3]+'% </div><h4>Pers. atteintes(%)</h4></div>';
	$('#keyfigures').html('')
	$('#keyfigures').append(kf1);
	$('#keyfigures').append(kf2);
	$('#keyfigures').append(kf3);
	$('#keyfigures').append(kf4);
} //generateKeyFigures

function generatePieChart(name, data) {
	var pin = ['PIN', data[1]];
	var cible = ['Pers. ciblées', data[0]];

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








