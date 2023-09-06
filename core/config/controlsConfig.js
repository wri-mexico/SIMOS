// JavaScript Document
define(function(){
	var ui = {
			ui:{
					miniBaseMap:false,
					startupTotorial:false,
					layersBar:true, //barra de temas
					autoOpenThemeBar:false,    



				},
			map:{
					geolocation:true,
					elevation:false,
					identify:{
						enable:true,
						createMarker:true
					},
					displayAltitude:false
				},
			system:{
					activeCookie:true
				}
		}
	return ui;
})

 