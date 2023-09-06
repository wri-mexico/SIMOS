define(function(){
	var sources = {
		proyAlias:'Mapa Digital de México',
    	proyName:'mdm6',
		servicesVersion:'DroC',
		mainPath:'http://127.0.0.1:80',
		//Ejemplo de configuracion a busqueda solar Externa
		search:{
			url:'http://127.0.0.1:8080/mdmSearchEngine/busq-entidades/shard',
			type: 'POST',
			contentType : "application/json; charset=utf-8",
			dataType: "jsonp",
			jsonp:'json.wrf',
			params:{
				wt:'json',
				indent:'true',
				facet:'true',
				'facet.field':'tipo',
				'defType':'edismax',
				qf:'busqueda'
			}
       	}, 
        layersSeaIde:{
			url:'http://127.0.0.1:8080/mdmservices/fieldtypes',
			contentType : "application/json; charset=utf-8",
            type: 'POST',
            dataType: "json"
        },
        exportList:{
			url:'http://127.0.0.1:8080/mdmservices/export',
			type: 'POST',
			contentType : "application/json; charset=utf-8",
			dataType: "json",
		},
		saveStats:{
			url:'http://127.0.0.1:8080/mdmservices/stats/layers',
			type: 'POST',
			contentType : "application/json; charset=utf-8",
			dataType: "json",
		},
		share:{
			contentType : "application/json; charset=utf-8",
			url:'http://127.0.0.1:8080/mdmservices/share',
			type: 'POST',
			dataType: "json"
        },
		shareEmail:{
			contentType : "application/json; charset=utf-8",
			url:'http://127.0.0.1:8080/mdmservices/share/email',
			type: 'POST',
			dataType: "json"
        },
        identify:{
			url:'http://127.0.0.1:8080/mdmservices/identify',
			type: 'POST',
			contentType : "application/json; charset=utf-8",
			dataType: "json",
        },
        bufferLayer:{
            url:'http://127.0.0.1:8080/mdmservices/totals',
            contentType : "application/json; charset=utf-8",
            type: 'POST',
            dataType: "json"
        },
        identifyDetail:{
			url:'http://127.0.0.1:8080/mdmservices/query',
            type:'POST',
            contentType : "application/json; charset=utf-8",
            dataType: "json"
        },
        crossSearch:{
            url:'http://127.0.0.1:8080/TableAliasV601/busqueda',
            contentType : "application/json; charset=utf-8",
            type: 'POST',
            dataType: "json"
        },
		deepSearchTranslate:{
            url:'http://127.0.0.1:8080/mdmSearchEngine/busqueda',
            type: 'POST',
            dataType: "json",
			contentType : "application/json; charset=utf-8",
			stringify:true,
			params:{
				tabla: 'geolocator',
				pagina: 1,
				searchCriteria: '',
				proyName: 'mdm6',
				whereTipo: ''
			}
        },
        denue:{
			url:'http://127.0.0.1:8080/solr/denue/select',
	        field:'busqueda',
			type: 'POST',
			dataType: "jsonp",
			jsonp:'json.wrf'
        },
        kml:{
			save:'http://127.0.0.1:8080/mdmexport/kml/download',
			read:'http://127.0.0.1:8080/mdmexport/kml/upload'
		},
		gpx:{
			save:'http://127.0.0.1:8080/mdmexport/gpx/download',
			read:'http://127.0.0.1:8080/mdmexport/gpx/upload'
		},
		geometry:{
			store:{
				url:'http://127.0.0.1:8080/mdmservices/geometry',
				type: 'POST',
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			},
			addBuffer:{
				url:'http://127.0.0.1:8080/mdmservices/buffer',
				type:'POST',
				dataType:'json',
				contentType:'application/json; charset=utf-8'
			},
			restore:{
				url:'http://127.0.0.1:8080/mdmservices/wkt/geometries',
				type: 'GET',
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			},
		},
		timeLine:'json/linetime.do',
       		school:'',
       		//Otras Url de informacion---------------------------------------------mdm61leyendamxsig
       		leyendUrl:'http://127.0.0.1/cgi-bin/mapserv?map=/opt/map/mdm61leyendamxsig.map&Request=GetLegendGraphic&format=image/png&Version=1.1.1&Service=WMS&LAYER=',
       		synonyms:{
       			list:{
        			/*farmacia:['botica','drogeria'],
        			banco:['cajero'],
        			restaurant:['bar','merendero'],
        			hospital:['clinica'],
        			hotel:['motel','posada']*/
       			}
       		},
		routing:{
    			movePoint:'http://127.0.0.1:8080/routing/point/move'
		},
		cluster:{
    		moreLevels:[2.388657133483887,1.1943285667419434,0.5971642833709717,0.29858214168548586],
    		enableOn:{
				layer:'cdenue14'
    		},
    		recordCard:{
				url:'http://mdm5beta.inegi.org.mx:8181/mdmservices/denue/label',
				type:'POST',
				dataType:'json'
    		},
    		nodes:{
				url:'http://mdm5beta.inegi.org.mx:8181/mdmservices/denue/scian',
				type:'POST',
				dataType:'json'
    		},
    		geometry:{
				url:'http://mdm5beta.inegi.org.mx:8181/mdmservices/wkt/feature',
				type:'POST',
				dataType:'json'
    		}
		},
        logging:'http://10.1.32.5/SISEC2013/jerseyservices/ServicioSesionJson',
		georeferenceAddress:{
			url:'http://mdm5beta.inegi.org.mx:8181/mdmservices/reversegeocoding',
			type: 'POST',
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		},
		mousePosition:{
			elevation:{
				url:'http://127.0.0.1:8080/mdmservices/raster/elevation',
				type:'POST',
				dataType:'json'
	    	}
		},
		files:{
	    	download:'http://127.0.0.1:8080/mdmdownloadfile/download'
		}
	};
	return sources;
});
