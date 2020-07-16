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