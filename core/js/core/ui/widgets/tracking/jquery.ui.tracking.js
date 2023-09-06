//Limitado a 10 elementos por capa
//solo despliega capas que se encuentran en el listado de capas proporcionado
$.widget( "custom.tracking", {
	  options:{
		  root:'body',
		  mode:'car',
		  controller:{
			  Stop:$.noop,
			  byCar:$.noop,
			  Walking:$.noop,
			  },
		   data:[
				{
				accuracy: 25000,
				altitude: 100,
				altitudeAccuracy: 150,
				heading: null,
				latitude: 21.87310027604835,
				longitude: -102.3148235644163,
				speed: 23,
				street: "Avenida Licenciado Adolfo López Mateos Poniente",
				distance: 0
				},
				{
				accuracy: 30000,
				altitude: 100,
				altitudeAccuracy: 120,
				heading: null,
				latitude: 21.873903182382154,
				longitude: -102.31288629191808,
				speed: 24,
				street: "Calle 26 de Marzo",
				distance: 245.128
				},
				{
				accuracy: 35000,
				altitude: 100,
				altitudeAccuracy: 120,
				heading: null,
				latitude: 21.874513506280294,
				longitude: -102.31074058777111,
				speed: 26,
				street: "Avenida Licenciado Adolfo López Mateos Poniente",
				distance: 491.119
				},
				{
				accuracy: 20000,
				altitude: 100,
				altitudeAccuracy: 120,
				heading: null,
				latitude: 21.875146727289952,
				longitude: -102.3083505795781,
				speed: 60,
				street: "Avenida Licenciado Adolfo López Mateos Poniente",
				distance: 767.15
				},
				{
				accuracy: 21000,
				altitude: null,
				altitudeAccuracy: 110,
				heading: 100,
				latitude: 21.875664835741496,
				longitude: -102.30622549019486,
				speed: 40,
				street: "Avenida Licenciado Adolfo López Mateos Poniente",
				distance: 767.15
				},
				{
				accuracy: 29000,
				altitude: 100,
				altitudeAccuracy: 120,
				heading: null,
				latitude: 21.875668272242347,
				longitude: -102.30621187671181,
				speed: 50,
				street: "Avenida Licenciado Adolfo López Mateos Poniente",
				distance: 10019
				}
				]
      },
	  
	  show:function(){
		  $(".tracking-stop-window").show();
	  },
	  hide:function(){
          $(".tracking-stop-window").hide();
	  },
	  
	  createStructure:function(){
		
	  },
	  
	  
	  //
//	  $(".category-menu-container").each(function(){
//			$(this).click(function(){
//				//borrar los menús encendidos
//				$('.category-selected').removeClass("category-selected");
//			  
//				//encender menú seleccionado
//				$(this).addClass("category-selected");
//			
//				tipo=$(this).attr('tipo');
//				$('#act-field .geo-all-label').html(tipo);
//				
//			});
//		});
//	  
	  
	  ///
	  
	  _init:function(){
		var obj=this;
		this.show();
		
		if (obj.options.mode == "walk"){
			obj.options.controller.Walking();
			
			$('.tracking-walk-mode').addClass("category-selected");	
			
			
		}else{
			obj.options.controller.byCar();
			$('.tracking-car-mode').addClass("category-selected");	
		}
	
		$('.tracking-walk-mode').click(function(e){
			obj.options.controller.Walking();
			$('.category-selected').removeClass("category-selected");
			$(this).addClass("category-selected");	
		});
	  
	  	$('.tracking-car-mode').click(function(e){
			obj.options.controller.byCar();
			$('.category-selected').removeClass("category-selected");
			$(this).addClass("category-selected");	
		});
	  
	  },

	  buildStructure:function(){
	  	var chain = '<div class="tracking-stop-window">'+
					   	    
					   		'<div class="tracking-menu">'+
									'<div class="tracking-stop-icon trackingSprite tracking_stop"></div>'+
								 	
									'<div class="tracking-walk-mode">'+
										'<div id="walking-off" class="caminandoStop trackingSprite tracking_walk"></div>'+
									'</div>'+
									
									'<div class="tracking-car-mode">'+ 
								    	'<div id="byCar-off" class="enAutoStop trackingSprite tracking_car"></div>'+
									'</div>'+
									
									
									'<div class="tracking-line-border"></div>'+
									'<div class="tracking-menu-line1"></div>'+
									'<div class="tracking-menu-line2"></div>'+
							'</div>'+
						
							'<div class="tracking-stop-info" >'+
								'<div class="tracking-gps-img trackingSprite tracking_gps"></div>'+
							//campos informacion
								'<div class="tracking-speed-name"><p id="tracking-speed-name">Velocidad</p></div>'+
								'<div class="tracking-menu-line3"></div>'+
								'<div class="tracking-speed-data"><p id="tracking-speed-data"></p></div>'+
								
								'<div class="tracking-distance">'+
										'<div style="float:left; width:50%;"><label class="tracking-distance-name">Distancia</label></div>'+
										'<div style="float:left; width:50%;"><label id="tracking-distance-data"></label></div>'+
								'</div>'+
								
								'<div class="tracking-menu-line4" style="display:none"></div>'+ //linea ver más
								
								'<div class="tracking-moreInfo" style="display:none">'+//ver mas
									
									'<div class="tracking-exactitud">'+
										'<div style="float:left; width:50%; height:100%"><label class="tracking-exactName">Exactitud</label></div>'+
										'<div style="float:left; width:40%; height:100%;"><label id="tracking-accuracy-data"></label></div>'+
									'</div>'+
									
									'<div class="tracking-altitud">'+
										'<div style="float:left; width:50%; height:100%"><label class="tracking-heightName">Altitud</label></div>'+
										'<div style="float:left; width:40%; height:100%;"><label id="tracking-altitude-data"></label></div>'+
									'</div>'+
									
									'<div class="tracking-latitud">'+
										'<div style="float:left; width:50%; height:100%"><label class="tracking-latName">latitud</label></div>'+
										'<div style="float:left; width:40%; height:100%;"><label id="tracking-latitude-data"></label></div>'+
									'</div>'+
									
									'<div class="tracking-longitud">'+
										'<div style="float:left; width:50%; height:100%"><label class="tracking-lonName">longitud</label></div>'+
										'<div style="float:left; width:40%; height:100%;"><label id="tracking-longitude-data"></label></div>'+
									'</div>'+
									
									'<div class="tracking-upIcon trackingSprite tracking_up"></div>'+	
								'</div>'+//fin de ver más
							
							'</div>'+
							//fin campos de informacion	
								//ver mas
								'<div class="tracking-more">'+
                                      '<div class="tracking-downIcon trackingSprite tracking_down"></div>'+
								      '<div class="tracking-moreText"> ver mas </div>'+
									
								'</div>'+	
				 			
								
				  '</div>' //fin stop window
					
						       
					
		$(""+this.options.root).append(chain);
		
	 },
	  
	  
	  //llenado de datos
	    fillData:function(data){
			
	 	    for(var x in data){
			var i= data[x];
                        var valor = null;
						if(data[x]!=null){
							switch(x){
								  case 'speed':
											valor = this.getSpeed(i);
											break;
								  case 'accuracy':
											valor=this.esEntero(i, 4, '');
											//valor = i;
											break;
								  case 'altitude':
											valor = this.esEntero(i, 4, 'm' );
											//i.toFixed(4)+' '+'m';
											break;
								  case 'latitude':
											valor=this.esEntero(i, 5, '');
											//valor = i.toFixed(5);
											break;
								  case 'longitude':
											valor=this.esEntero(i, 5, '');
											//valor = i.toFixed(5);
											break;
								  case 'distance':
											valor = this.getDistance(i);
											break;
							}//fin del switch
							
							
						}//fin del if
					else{
						valor=0;
						var s=0;
						switch(x){
								  case 'speed':
											valor = this.getSpeed(s);
											break;
								  case 'accuracy':
											valor=this.esEntero(s, 4, '');
											//valor = i;
											break;
								  case 'altitude':
											valor = this.esEntero(s, 4, 'm' );
											//i.toFixed(4)+' '+'m';
											break;
								  case 'latitude':
											valor=this.esEntero(s, 5, '');
											//valor = i.toFixed(5);
											break;
								  case 'longitude':
											valor=this.esEntero(s, 5, '');
											//valor = i.toFixed(5);
											break;
								  case 'distance':
											valor = this.getDistance(s);
											break;
							}//fin del switch
						
						}//fin del else
					
					$("#tracking-"+x+"-data").html(valor);
		    }//fin del for
	  
	  },//fin function
	  
	  	 esEntero:function(num, numDecimales, prefix){
			   var decimal = num % 1 != 0
                    if(decimal){
						 return num.toFixed(numDecimales)+' '+prefix;  
                          
                    }else{
                         return (parseInt(num))+' '+prefix;
                    }
			  },
          
          
          getSpeed:function(speed){
                    var prefix=' m/s';
                    if(speed>=1000){
                              speed=speed*3.6;
                              prefix=' km/h';
                    }
                    var decimal = speed % 1 != 0
                    if(decimal){
                         return speed.toFixed(4)+prefix;  
                    }else{
                         return (parseInt(speed))+prefix;
                    }
          },
		  
		 
		 getDistance:function(distance){
			 		var obj=this;
                    var prefix=' m';
					var decimales=4;
                    if(distance>=1000){
                              distance=distance/1000;
                              prefix=' km';
                    }
					var distance=this.esEntero (distance, decimales, prefix);
					return distance;
          },
		  
	  events:function(){
                    var obj = this;
                    $('.tracking-downIcon').click(function(e){
			obj.switchStatus();
			obj.fillData(obj.options.data); 	
                    });
                    
                    $('.tracking-moreText').click(function(e){
                            obj.switchStatus();
                            obj.fillData(obj.options.data); 	
                    });
                    
                    $('.tracking-upIcon').click(function(e){
                             obj.switchStatus();
                    });
                    $(".tracking_stop").click(function(){
                        obj.options.controller.Stop();
                        obj.hide();
                    });
                    $(".tracking_car").click(function(){
                        obj.options.controller.byCar();
                       
                    });
                    $(".tracking_walk").click(function(){
                        obj.options.controller.Walking();
                        
                    });        
          },
          // the constructor
          _create: function() {
            var obj = this;
                    obj.buildStructure();
                    obj.fillData(obj.options.data);
                    obj.events();
          },
	  
	//ver más abrir y cerrar
	  
	  open:function(){
			var obj = this;
			$('.tracking-stop-window').css("height",'185px');
			$('.tracking-moreInfo').css("display",'');
			$('.tracking-menu-line4').css("display",'');
			$('.tracking-more').css("display",'none');
		},
		
	  close:function(){
			var obj = this;
			$('.tracking-stop-window').css("height",'100px');
			$('.tracking-moreInfo').css("display",'none');
			$('.tracking-more').css("display",'');
			$('.tracking-menu-line4').css("display",'none');
			
	  },
	  isOpen:function(){
		  	var obj = this;
			return $('.tracking-stop-window').height() > 100;
	  },
	  
	 switchStatus:function(){
		    var obj = this;
			if (obj.isOpen())
				obj.close()
				else
				obj.open()
	  },
	  
	  // fin abrir cerrar
	
	
	  
      
      // called when created, and later when changing options
      _refresh: function(){
        // trigger a callback/event
        this._trigger( "change" );
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
        this._superApply( arguments );
        this._refresh();
      },
 
      // _setOption is called for each individual option that is changing
	  //aquí pegué lo que me dijo many 
		   _setOption: function(key, value){
					this.options[key] = value;
					switch(key){
						case "data":
							 this.fillData(value);
						break;
						
						}
					}
				});
			
		//fin de lo que pegué que many me dijo que pegara 	