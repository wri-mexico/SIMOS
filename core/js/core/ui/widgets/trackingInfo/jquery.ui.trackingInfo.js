$.widget("custom.trackingInfo", {
    grafica: null,
    options: {
        root: 'body',
        controler: null,
        prev: null,
        data: [{
            accuracy: 25000,
            altitude: 100,
            altitudeAccuracy: 150,
            heading: null,
            latitude: 21.87310027604835,
            longitude: -102.3148235644163,
            speed: 23,
            street: "Avenida Licenciado Adolfo López Mateos Poniente",
            distance: 0
        }, {
            accuracy: 30000,
            altitude: 100,
            altitudeAccuracy: 120,
            heading: null,
            latitude: 21.873903182382154,
            longitude: -102.31288629191808,
            speed: 24,
            street: "Calle 26 de Marzo",
            distance: 245.128
        }, {
            accuracy: 35000,
            altitude: 100,
            altitudeAccuracy: 120,
            heading: null,
            latitude: 21.874513506280294,
            longitude: -102.31074058777111,
            speed: 26,
            street: "Avenida Licenciado Adolfo López Mateos Poniente",
            distance: 491.119
        }, {
            accuracy: 20000,
            altitude: 100,
            altitudeAccuracy: 120,
            heading: null,
            latitude: 21.875146727289952,
            longitude: -102.3083505795781,
            speed: 60,
            street: "Avenida Licenciado Adolfo López Mateos Poniente",
            distance: 767.15
        }, {
            accuracy: 21000,
            altitude: null,
            altitudeAccuracy: 110,
            heading: 100,
            latitude: 21.875664835741496,
            longitude: -102.30622549019486,
            speed: 40,
            street: "Avenida Licenciado Adolfo López Mateos Poniente",
            distance: 767.15
        }, {
            accuracy: 29000,
            altitude: 100,
            altitudeAccuracy: 120,
            heading: null,
            latitude: 21.875668272242347,
            longitude: -102.30621187671181,
            speed: 50,
            street: "Avenida Licenciado Adolfo López Mateos Poniente",
            distance: 10019
        }]
    },

    show: function() {
        $(".trackingInfo-bgwindow").show();
    },
    hide: function() {
        $(".trackingInfo-bgwindow").hide();
    },

    createStructure: function() {

    },

    _init: function() {
        this.show();
		var obj=this;
		$('.trackingInfo-exactMenu').click(function(e){
			$('.trackingInfo-exactMenu').attr('mode','on');
			$('.trackingInfo-heightMenu').attr('mode','off');
			$('.trackingInfo-speedMenu').attr('mode','off');
		});
		
		$('.trackingInfo-heightMenu').click(function(e){
			$('.trackingInfo-heightMenu').attr('mode','on');
			$('.trackingInfo-exactMenu').attr('mode','off');
			$('.trackingInfo-speedMenu').attr('mode','off');
		});
		$('.trackingInfo-speedMenu').click(function(e){
			$('.trackingInfo-speedMenu').attr('mode','on');
			$('.trackingInfo-exactMenu').attr('mode','off');
			$('.trackingInfo-heightMenu').attr('mode','off');
		});
    },
    buildStructure: function() {
        var chain = '<div class="trackingInfo-bgwindow">'+
							'<label class="trackingInfo-title">Informaci&oacute;n de la Ruta</label>'+
							'<div class="trackingInfo-titleline"></div>'+
							'<div class="trackingInfo-closebtn trackingSprite tracking_close"></div>'+ //close btn
							
							'<div class="trackingInfo-info">'+ 
								
								'<div class="trackingInfo-gps-img trackingSprite tracking_gps_big"></div>'+ //gps
								
								'<div class="trackingInfo-speed-name"><div id="trackingInfo-speed-name">Velocidad</div></div>'+
								
								'<div class="trackingInfo-speed-data"><p id="trackingInfo-speed-data"></p></div>'+
								
								'<div class="trackingInfo-distance-name"><p id="trackingInfo-distance-name">Distancia</p></div>'+
								
								'<div class="trackingInfo-distance-data"><p id="trackingInfo-distance-data"></p></div>'+
								
							'</div>'+
							
							'<div class="trackingInfo-route-title"><p style="font-weight:bold; font-family:arial; font-size:12; margin-left: 24px; margin-top: 0px">Ruta</p></div>'+
							'<div class="trackingInfo-route-window"></div>'+	
							
							// menú gráfica
							'<div class="trackingInfo-menu-container">'+
								'<div class="trackingInfo-exactMenu" mode="off">'+
									'<div id="trackingInfo-exactIcon-off" class="exactIcon-off trackingInfo-exactIcon trackingSprite tracking_exactitud"></div>'+ //exactitud
									'<div id="trackingInfo-exactIcon-on" class="exactIcon-on  trackingInfo-exactIcon trackingSprite tracking_exactitud_on"></div>'+ //exactitud modo on
									'<div id="trackingInfo-exactLabel-off" class="exactLabel-off trackingInfo-exactlabel">exactitud</div>'+
									'<div id="trackingInfo-exactLabel-on" class="exactLabel-on trackingInfo-exactlabel-on ">exactitud</div>'+
								'</div>'+
								'<div class="trackingInfo-heightMenu" mode="off">'+
									'<div id="trackingInfo-heightIcon-off" class="heightIcon-off trackingInfo-heightIcon trackingSprite tracking_height"></div>'+ //height
									'<div id="trackingInfo-heightIcon-on" class="heightIcon-on  trackingInfo-heightIcon trackingSprite tracking_height_on"></div>'+ //height modo on
									'<div id="trackingInfo-heightLabel-off" class="heightLabel-off trackingInfo-heightlabel">altitud</div>'+
									'<div id="trackingInfo-heightLabel-on" class="heightLabel-on trackingInfo-heightlabel-on">altitud</div>'+
								'</div>'+
								'<div class="trackingInfo-speedMenu" mode="off">'+
									'<div id="trackingInfo-speedIcon-off" class="speedIcon-off trackingInfo-speedIcon trackingSprite tracking_speed"></div>'+ //speed
									'<div id="trackingInfo-speedIcon-on" class="speedIcon-on  trackingInfo-speedIcon trackingSprite tracking_speed_on"></div>'+ //speed modo on
									'<div id="trackingInfo-speedLabel-off" class="speedLabel-off trackingInfo-speedlabel">velocidad</div>'+
									'<div id="trackingInfo-speedLabel-on" class="speedLabel-on trackingInfo-speedlabel-on">velocidad</div>'+
								'</div>'+
								
								'<div class="trackingInfo-menuLine"></div>'+
								'<div class="trackingInfo-menuLine2"></div>'+
								
							'</div>'+
							
							'<div class="trackingInfo-graphic" id="graphic-id"></div>'+
						
					'</div>';

        $("" + this.options.root).append(chain);
        $(".trackingInfo-bgwindow").draggable();
    },
    getDataFrom: function(source) {
        var data = [];
        var obj = this;
        for (var x in obj.options.data) {
            var i = obj.options.data[x];
            data.push({
                x: parseFloat(x),
                y: (i[source]==null)?0:i[source],
                name: i.street
            });
        }
        return data;
    },
	
		 esEntero:function(num, numDecimales, prefix){
			   var decimal = num % 1 != 0
                    if(decimal){
						 return num.toFixed(numDecimales)+' '+prefix;  
                          
                    }else{
                         return (parseInt(num))+' '+prefix;
                    }
			  },
	
    //llenado de datos
    fillData: function(data) {
        var obj = this;
        var cont = 0;
        var point = 0;
        var categorias = [];
		var html ='';
        for (var x in data) {

            var i = data[x];
            cont = cont + i.speed;
            point = point + 1;
            categorias.push(parseInt(x) + 1);

            var chain = (i.street) ? i.street : '';
            var title = '';
            if (chain.length > 25) {
                chain = chain.substring(0, 25) + '...';
                title = 'title="' + i.street + '"';
            }
            var longitud = i.longitude;
            var latitud = i.latitude;

            html +='<div class="trackingInfo-data-container">'+
				'<div class="trackingInfo-content" idref="' + point + '">'+
					'<div class="trackingInfo-point">' +
						'<div class="trackingInfo-dataPoint">' + point + '</div>'+
					'</div>' +
					'<div class="trackingInfo-text" ' + title + '>' + chain + '<br>'+
						'(' + (longitud.toFixed(5)) + ', ' + (latitud.toFixed(5)) + ')'+
					'</div>'+
				'</div>'+
			'</div>';
        }
	
	$(".trackingInfo-route-window").html(html);

            // onclick event menu grafica 



        $(".trackingInfo-content").each(function() {
            $(this).mouseover(function() {
                var i = (parseInt($(this).attr('idref'), 10) - 1);
                if (obj.prev) {
                    grafica.series[0].data[obj.prev].setState();
                } else {
                    grafica.series[0].data[0].setState();
                }

                grafica.series[0].data[i].setState('hover');
                obj.prev = i;

                grafica.tooltip.refresh(grafica.series[0].points[i]);

            });
        });
    var prom = cont / data.length;
	var distancia=i.distance;
	var sufix=' m';
	
	var prefijo=' m/s';
	var velocidad=i.speed;
	
		
		if (velocidad==null){
			valor = 0;
			$("#trackingInfo-speed-data").html(valor+' m/s');
			}
		
		else{
			
				if(prom>=1000){
				prom = prom*3.6;
				prefijo=' km/h';
				}
				valor=this.esEntero(prom, 4, prefijo);
					//if(velocidad>0){
		//			velocidad = velocidad.toFixed(4);
		//			}
					//$("#trackingInfo-distance-data").html(velocidad+prefijo);
					$("#trackingInfo-speed-data").html(valor);
		    }
       
   
    if (distancia==null){
		valor= 0;
		$("#trackingInfo-distance-data").html(valor+' m');
		}
	
	else{	
		    
			if(distancia>=1000){
				distancia = i.distance/1000;
				sufix=' km';
			}
			//if(distancia>0){
		//		distancia = distancia.toFixed(4);
		//	}
			
			 valor=this.esEntero(distancia, 4, sufix);
			 $("#trackingInfo-distance-data").html(valor);
	}

    }, //Fin fill Data 


    creaGrafica: function(categorias, datos, etiqueta, unidad) {
        grafica = new Highcharts.Chart({
            chart: {
                renderTo: 'graphic-id'
            },
            title: {
                text: '',
            },
            subtitle: {
                text: '',
            },
            xAxis: {
                categories: categorias
            },
            yAxis: {
                title: {
                    text: etiqueta
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: { //pop-up información
                useHTML: true,
                formatter: function() {
                    var chain = '<div style="width:200px; white-space:normal; text-align:center">' + this.x + ')' + ' ' + this.key + '<br>' + this.y + unidad + '</div>'
                    return (chain);
                },
            },
            legend: {
                enabled: false
            },
            series: [{
                name: ' ',
                data: datos
            }],
            credits: {
                enabled: false
            }
        });

    },
	
	eventosGrafica:function(){
		var obj = this;
		var sufix=' m/s'
		    $('.trackingInfo-speedMenu').click(function() {

			var datos = obj.getDataFrom('speed')
			var transforma = obj.verificaSiConvierto(datos);
			datos = obj.transformamedida(transforma,datos);
			var etiqueta = (transforma)?'Velocidad (km/h)':'Velocidad (m/s)';
			var unidad = (transforma)?'km/h':'m/s';
			
			obj.creaGrafica(obj.categorias, datos, etiqueta, unidad);
		    });
	
		    $('.trackingInfo-heightMenu').click(function() {
			var datos = obj.getDataFrom('altitude');
			var etiqueta = 'Elevacion (metros)';
			var unidad = 'm';
			obj.creaGrafica(obj.categorias, datos, etiqueta, unidad);
		    });
	
		    $('.trackingInfo-exactMenu').click(function() {
			var datos = obj.getDataFrom('accuracy')
			var etiqueta = 'Exactitud (metros)';
			var unidad = 'm';
			obj.creaGrafica(obj.categorias, datos, etiqueta, unidad);
		    });	
	},
	

		  
	 verificaSiConvierto:function(data){
		  	var change= false;
			for( var x in data){
				if(data[x]>=1000){
					change=true;
					break;	
					
				}	
			}
			return change;
	},
	
	 transformamedida:function(transforma, data){
		  	if (transforma){
				for (var x in data) {
					var i = data[x]*3.6;
					i = i.toFixed(4);
			  	 	data[x]=i;
            	}
			}
			
			return data;
	},
	
	
		 	  
    // the constructor
    _create: function() {
        var obj = this;
        obj.buildStructure();
        obj.fillData(obj.options.data);
	    
		obj.eventosGrafica();
		
        var datos = obj.getDataFrom('speed')
		
        var transforma = obj.verificaSiConvierto(datos);
		datos = obj.transformamedida(transforma,datos);
		var etiqueta = (transforma)?'Velocidad (km/h)':'Velocidad (m/s)';
        var unidad = (transforma)?'km/h':'m/s';
        var categorias = [];
        for (var x in obj.options.data) {

            var i = obj.options.data[x];
            //var cont = cont + i.speed;
            //point = point + 1;
            categorias.push(parseInt(x) + 1);
  		}
		 obj.creaGrafica(categorias, datos, etiqueta, unidad);
		
		$('.trackingInfo-speedMenu').attr('mode','on'); // menu speed de la gráfica encendido por default
	

        $(".trackingInfo-closebtn").click(function() {
            obj.hide();
        });
    },


    // called when created, and later when changing options
    _refresh: function() {
        // trigger a callback/event
        this._trigger("change");
    },
    // revert other modifications here
    _destroy: function() {
        this.options.close();
        this.element.remove();
        //.removeClass( "custom-timeline" )
        //.enableSelection().removeAttr('style').html('').removeAttr('class');
    },

    // _setOptions is called with a hash of all options that are changing
    // always refresh when changing options
    _setOptions: function() {
        // _super and _superApply handle keeping the right this-context
        this._superApply(arguments);
        this._refresh();
    },

    // _setOption is called for each individual option that is changing
    //aquí pegué lo que me dijo many 
    _setOption: function(key, value) {
	var obj=this;
        this.options[key] = value;
        switch (key) {
            case "data":
		this.options.data=value;
		
			this.fillData(value);
			var datos=this.getDataFrom('speed');
			var transforma = this.verificaSiConvierto(datos);
			datos = this.transformamedida(transforma,datos);
			var etiqueta = (transforma)?'Velocidad (km/h)':'Velocidad (m/s)';
			var unidad = (transforma)?'km/h':'m/s';
			
			this.creaGrafica(this.categorias, datos, etiqueta, unidad);
                break;

        }
    }
});

//fin de lo que pegué que many me dijo que pegara