function updateZoneSanteSelect() {
	var provinceSelected = $('#provinceSelect').val();

	var data = provincesAndZSData.filter(function(d){ return d.province==provinceSelected; });
	var zones = [];
	data.forEach( function(item) {
		zones.includes(item.zsante) ? '' : zones.push(item.zsante);
	});

	$('#zoneSanteSelect').empty();
	var zsanteSelect = d3.select('#zoneSanteSelect')
			.selectAll("option")
			.data(zones)
			.enter().append("option")
				.text(function(d){ return d; })
				.attr("value", function(d) { return d; });

	$('#zoneSanteSelect').multipleSelect('refresh');

} //updateZoneSanteSelect

function updateFromZSante(zone_sante) {
	var prov =  provincesAndZSData.filter(function(d){ return d.zsante==zone_sante; })[0].province;
	$('#provinceSelect').val(prov);
	$('#provinceSelect').multipleSelect('refresh');

	updateZoneSanteSelect();
	$('#zoneSanteSelect').val(zone_sante);
	$('#zoneSanteSelect').multipleSelect('refresh');
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
		var indSelect = d3.select('#indicateurSelect')
			.selectAll("option")
			.data(inds)
			.enter().append("option")
				.text(function(d){ return d;})
				.attr(function(d){ return d; });
		$('#indicateurSelect').multipleSelect('refresh');
	}
}//updateIndicatorSelect