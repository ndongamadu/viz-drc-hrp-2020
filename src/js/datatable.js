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












