define(['modules/nav/nav'],function(nav){
		var map = null;
		var tree = null;
		var paramsReady = false;
		var mapReady = false;
		var dataSources = null;
var obj ={
			getIdLayers:function(callback){
				var obj = this;
				//obtiene Buscables e identificables
				var dataSource = $.extend(true,{},dataSources.layersSeaIde);
				var proyName = dataSources.proyName;
				var obj = this;
				var params = {proyName:proyName,where:''};
				dataSource.data = params;
				$.ajax(dataSource).done(function( data ) {
					var list = data.data.fieldTypes;	
					if (!(list === undefined) && list.length > 0){
						var buscables = [];
						var identificables = [];
						for (var x in list){
							if (list[x].type.indexOf('I') > -1){
								identificables.push(list[x]);
							}
							if (list[x].type.indexOf('B') > -1){
								buscables.push(list[x]);
							}
						}
						data.buscables = buscables;
						data.identificables = identificables;
						if($.isFunction(callback))
							callback({buscables:buscables, identificables:identificables});
					}
				  });
			},
			onMapLoad:function(){
				var obj = this;
				var localUrl = require.toUrl("ui").split('/');	
				localUrl.pop();
				localUrl = localUrl.join('/');
				
				mapReady = true;
				obj.checkStart();
			},
			//reviza url por layers que vengan en ella
			activeUrlLayers:function(url){
				var obj = this;
				var s = $.getURLParam('s');
				
				if(!url && s){ //si la ruta procede de compartir y no ha sido cargada la url de la base de datos
					obj.loadFromShare(s);
				}else{
					if (url){
						var stateObj = { foo: "bar" };
						history.replaceState(stateObj, "page 2", "?"+url);			
					}
					var v = $.getURLParam('v');
					var c = $.getURLParam('coordinates'); //coordenadas
					var theme = $.getURLParam('theme');
					var layers = $.getURLParam('layers');
					var l = null;
					if(layers){
						l = layers.split(',');
					}
					if(theme){
						var themes = $.extend(true,{},tree.themes);	
						var t = null;
						for(var x in themes){
							var item = themes[x];
							if(item.name.toLowerCase() == theme.toLowerCase()){
								item.idref = x;
								t=item;
								break;
							}
						}
						if(t){
							obj.map.bootTheme = t.idref;
						}
					}
					if(c){ //prioridad a coordenadas incluidas en url
						var z =  $.getURLParam('z');
						c = decodeURIComponent(c);
						var lon,lat= null;
						try{
							c = eval(c);
							var x1,y1,x2,y2 = null;
							if(c.length == 4){
								x1 = c[0],
								y1 = c[1],
								x2 = c[2],
								y2 = c[3];

								lon = (x1+x2)/2;
								lat = (y1+y2)/2;
							}else{
								lon = c[0];
								lat = c[1];
							}
							obj.startUpCoords = function(){
								if(z){ //si viene el zoom, solo acerca apunto central
									obj.map.goCoords(lon,lat,{zoomLevel:parseInt(z,10)},'geographic');	
								}else{
									if(c.length == 4){
										obj.map.goCoords(x1,y1,x2,y2,'geographic');
									}else{
										obj.map.goCoords(lon,lat,'geographic');	
									}
								}
							}
							
						}catch(err){
							
						}
					}else{
						if(v){ //si trae vista
							var v = Base64.decode(v).split(',');
							var list = {};
							for(var x in v){
								 var item = v[x].split(':');  
								 list[item[0]] = item[1];
							}
							l = list.l;
							if(l)
								l = list.l.split('|');
						}
					}
					
					if(l){
						var groups = tree.layers.groups;
						//Reset tree
						for(var x in groups){
							var list = groups[x].layers;
							for (var x in list){
								  	var item = list[x];
									item.active = false;
									if (!(item.texts === undefined))item.texts.active = false;
							}
						}
						//-------------------------------
						for(var x in groups){
							var gLayers = groups[x].layers;
							for(var y in l){
								var idLayer = l[y];
								var isText = (idLayer.substring(0,1) == 't');
								idLayer = (isText)?idLayer.substring(1,(idLayer.length)):idLayer;
								var exist = gLayers[idLayer];
								if(exist){
									if(!isText){
										exist.active = true;		
									}else{
										exist.texts.active = true;		
									}
								}
							}
						}
					}
					paramsReady = true;
					obj.checkStart();		
				}
			},
			adjustUrlToIE:function(){//detecta y ajusta la URL de ser necesario
				var r = null;
				//var nav = navigator.userAgent.toLowerCase();
				//var nav = navigator.product.toLowerCase();
				//var ver = navigator.appVersion;
				/*
				if ( $.browser.msie ) {
				  var v =$.browser.version;
				  debugger;
				}else{
				   r = true;	
				}
				*/
				return true;
			},
			init:function(_map,_tree,sources){
				var obj = this;
				obj.map = _map;
				if (obj.adjustUrlToIE()){
					dataSources = sources;
					tree = _tree;
					nav.init(_map);
					obj.activeUrlLayers();
				}
			},
			loadFromShare:function(link,func){
				var obj = this;
			},
			checkStart:function(){
				var obj = this;
				if(paramsReady &&  mapReady){
				   obj.afterInit();
				   //nav Events
				   nav.setEvent(obj.map);
				   //carga de valores cargados en compartir
				   obj.loadShareValues();
				   //carga coordenadas y zoom enviados como parametro
				   if(obj.startUpCoords && $.isFunction(obj.startUpCoords)){
				   	obj.startUpCoords()
				   }
				   //carga capas identificables
				   obj.getIdLayers(function(data){
						$("#mdm6DinamicPanel").dinamicPanel({
								bufferLayers:data.identificables
						});	
				    });
					//si vienen coordenadas con el mapa nos lleva a ellas
					
				}
			},
			afterInit:function(){}
		}
	return obj;
});