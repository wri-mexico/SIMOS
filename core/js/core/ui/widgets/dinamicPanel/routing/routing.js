define(function(){
	var module = 
		   {
			eventListener:function(evt){
				var obj = this;
				var main = obj.main;
				var idEvt = (typeof(evt) == 'object')?evt.id:evt;
				var val = (typeof(evt) == 'object')?evt.value:null;
				switch(idEvt){
					case 'showDetail': case 'closeDetail':
						
					break;
					case 'tabChange':
						if (evt.value == 'routePanel'){
							if(obj.started){
								obj.createStructure();
							}else{
								/*obj.disclaimer(function(){
									obj.createUI();
									main.panelTransparency();
									obj.started = true;
									obj.createStructure();
								});*/
								obj.createUI();
								main.panelTransparency();
								obj.started = true;
								obj.createStructure();
							}
						}else{
							obj.hideStructure();
						}
					break;	
					case 'createForm':
						if(!obj.started){
						}
					break;	
				}
			},
			createStructure:function(){
				var obj = this;	
				obj.map.activeCtl({control:'routing',active:true});
				obj.tabActive = true;
				obj.createUIConfig();
				obj.printList();
				obj.showRutes();
				obj.showDetail();
			},
			hideStructure:function(){
				var obj = this;
				obj.removeUIConfig();
				obj.hideRutes();
				obj.hideDetail();
				
				//verifica que las ruta queden como procesadas
				var routes = obj.routeDataProcessed.current;
				for(var x in routes){
					routes[x].status = 1

				}
				
			},
			disclaimer:function(func){
				var obj = this;
				
				var localUrl = require.toUrl("modules");
					localUrl = localUrl.split('?')[0];
					localUrl+='/routing/';
				
				
				var cadena=  '<div id="module-routing-disclaimer" title="Aviso">';
					cadena+= '</div>';
				
				$("#panel-center").append(cadena);
				$('#module-routing-disclaimer').load(localUrl+'routingTerms.html');
				
				$( "#module-routing-disclaimer" ).dialog({
					width:550,
					height:370,
					resizable: false,
					closeOnEscape: true,
					close: function(event, ui){
						$(this).dialog('destroy').remove();
					},
					modal: true,
					buttons: {
						Cerrar: function() {
						  $(this).dialog('close');
					    }
					   /*Acepto: function() {
						  $(this).dialog('close');
						  if($.isFunction(func))
						  	func();
					   },
					   'No acepto': function() {
						  $(this).dialog('close');
					   } */
					}
				});
				
			},
			configData:{
				routes:[
					{id:'optimal',label:'&Oacute;ptima',color:'#CCDEF4'},
					{id:'free',label:'Libre',color:'#E7E3C5'}
				],
				fuel:{
					type:[
						{id:'Premium',label:'Premium',cost:14.38},
						{id:'Magna',label:'Magna',cost:13.57},
						{id:'Diesel',label:'Diesel',cost:14.20},
						{id:'Gas',label:'Gas',cost:7.81},
						{id:'Elec',label:'El&eacute;ctrico',cost:0}
					],
					fuelColor:{
						'Premium':'#9c3504',
						'Magna':'#199795',
						'Disel':'#B25B07',
						'Gas':'#1F8EBE',
						'Elec':'#555'
					},
					yieldMin:2,
					yieldMax:50
				},
				vehicles:[
					{id:'moto',label:'Motocicleta',_label:'Motocicleta',fuel:1,yield:32},
					{id:'car',label:'Autom&oacute;vil',_label:'Automóvil',extraAxle:5,trail:'trail',fuel:1,yield:17},
					{id:'bus',label:'Autob&uacute;s',_label:'Autobús',axle:[2,3,4],extraAxle:5,trail:'trailbig',fuel:2,yield:4},
					{id:'truck',label:'Cami&oacute;n',_label:'Camión',axle:[2,3,4,5,6,7,8,9],extraAxle:5,trail:'trailbig',fuel:2,yield:2}
				],
				currentSelection:{
					vehicle:1,
					fuel:0,
					yield:17,
					extraAxle:0,
					axle:0
				}	
			},
			started:false,
			dataSource:{},
			outLayers:[],
			routeData:[],
			itinerary:[],
			routeDataProcessed:{
				current:{
					optimal:{
						status:0,list:[]
					},
					free:{
						status:0,list:[]
					}
				},
				last:{
					optimal:{
						status:0,list:[]
					},
					free:{
						status:0,list:[]
					}
				}
			},
			routeItenerary:{current:{
					optimal:{
						status:0,list:[]
					},
					free:{
						status:0,list:[]
					}
				},
				last:{
					optimal:{
						status:0,list:[]
					},
					free:{
						status:0,list:[]
					}
				}
			},
			limitCount:5,
			init:function(main){
				var obj = this;
				this.main = main;
				this.map = main.options.map;
				this.sakbe = this.map.Routing.sakbe;
				
				var localUrl = require.toUrl("dinamicPanelPath");
					localUrl = localUrl.split('?')[0];
					localUrl+='routing/';
				obj.localPath = localUrl;
				
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'routing.css?ver='+mdmVersion}).appendTo('head');
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'module-routing-sprite.css?ver='+mdmVersion}).appendTo('head');

				amplify.subscribe('routing', function(data){
					obj.onClickRoute(data);	
				});
				
				//Obtiene datos de los combustibles
				obj.loadFuelData();
			},
			captureLocation:function(element){
				var obj = this;
				var main = obj.main;
				var rlist = [];
				element.autocomplete({ 
					source: function(request, response){
						obj.sakbe.destinySearch(request.term,function(data){
							var list = data;
							rlist = list;
							var r = [];
							for(var x in list){
								var item = list[x];
								//var point = 'POINT('+item.coord_merc.split(',')[1]+' '+item.coord_merc.split(',')[0]+')'
								r.push({label:item.nombre,obj:item});
							}
							response(r);
						});
					},
					minLength: 3,
					select: function( event, ui ) {
						if(ui.item)
							obj.onClickRoute(ui.item.obj)
					},
					open: function() {
						$( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
					},
					close: function() {
						$( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
					}
				});
			},
			getDataFromMapPoint:function(pos){
				var obj = this;
				var point = pos.point.substring(6,pos.point.length-1).split(' ');
				obj.sakbe.lineSearch(point[0],point[1],parseInt(pos.scale),function(data){
					var data = data[0];
					if(data && data.geojson)
							obj.onClickRoute(data);
				});
			},
			onClickRoute:function(data){
				var obj = this;
				if(data.scale){
					obj.getDataFromMapPoint(data);
				}else{
					var list = obj.routeData;
					for(var x in list){
						var item = list[x];
						if(item.edit){
							list[x] = data;
							break;
						}
					}
					
					obj.processRoute();
				}
			},
			loadFuelData:function(){
				var obj = this;
				var main = obj.main;
				obj.sakbe.getFuels(function(dataRes){//success
					obj.configData.fuel.type = [];
					var fuels = dataRes;
					if(fuels){ //si encontro cmbustibles
						for(var x in fuels){
							var item = fuels[x];
							var name = item.tipo
							var val = item.costo;
							obj.configData.fuel.type.push({id:name,label:name,cost:val});
						}
						obj.configData.fuel.type.push({id:'Elec',label:'El&eacute;ctrico',cost:0});
					}
					
				});
				
			},
			loadData:function(data){
				var obj = this;
				var main = obj.main;
				
				obj.dataSource = data.dataSource;
				
				 var url = 'http://10.1.30.101:9090/solr/busq-redcardestinos/shard';
				 var params = {
								q: 'tinajas',
								wt:'json',
								indent:true,
								facet:true,
								'facet.field':'tipo'
							  }; 
				
				$.ajax({
				  'url': url,
				  'data':  params,
				  'success': function(data) { 
				  		
				  },
				  'dataType': 'jsonp',
				  'jsonp': 'json.wrf'
				});
				
			},
			minutesToTime:function(mins){
				var secs = mins*60;
				var hrs = Math.floor(mins/60);
				secs = secs-(hrs*3600);
				mins = Math.floor(secs/60);
				var secs = Math.floor(secs%60);
				return hrs+'h '+mins+'m '+secs+'s';
			},
			processRoute:function(){
				var obj = this;
				var main = obj.main;
				var list = obj.routeData;
				var pathList = [];
				var getRoute = function(type, index){
				//inicia el spinner de proceso
					obj.spinner();
					
					if (!index){
						obj.routeDataProcessed.current[type].list = [];
						index = 0;
						var tempData = obj.routeDataProcessed.current[type];
						obj.routeDataProcessed.current[type] = {status:0,list:[]};
						obj.routeDataProcessed.last[type] = tempData;
					}
					
					var id_1 = (pathList[index].id_dest || pathList[index].id_routing_net);
					var id_2 = (pathList[index+1].id_dest || pathList[index+1].id_routing_net);
					
					
					var nameProcess = '_'+id_1+'_'+id_2;
					var lastList = obj.routeDataProcessed.last[type].list;	
					var exists = null
					//verifica si el tramo a calcular no se ha solicitado en la misma sesion de navegador
					for(var x in lastList){
						if (nameProcess == lastList[x].id){
							exists = lastList[x];
							break;
						}
					}
						//si ya ha sido solicitado, solo la incorpora al listado actual, de lo contrario la solicita
						/*
						if(exists){ //si ese punto ya fue procesado omite 
							obj.routeDataProcessed.current[type].list.push(exists);
							if(index < pathList.length-2){
								getRoute(type, index+1);
							}else{
								obj.routeDataProcessed.current[type].status = 1;
								obj.routeDataProcessed.current[type].typeRoute = type;
								obj.routeDataProcessed.last[type] = obj.routeDataProcessed.current[type];
								obj.printRouteData();
							}	
						}else{*/
							var t_type = (type == 'free')?'suggested':type; //ajuste necesario por movimiento en rutas
							var pathType = $.inArray(t_type,['optimal','free','suggested']); //tipo de ruta 
							var currentConfig = obj.configData.currentSelection;
							
							var vehicle = currentConfig.vehicle;
							switch(vehicle){
								case 2:
									vehicle+=(currentConfig.axle-2);
								break;
								case 3:
									vehicle+=2(currentConfig.axle-2);
								break;
							}
							
							var id_1 = (pathList[index].id_dest || pathList[index].id_routing_net);
							var id_2 = (pathList[index+1].id_dest || pathList[index+1].id_routing_net);

							var bitac = 'id_s ='+id_1+', id_t='+id_2; //cadena de bitacora, para comparar los procesos ya realizados
							
							obj.sakbe.routing('calc',pathList[index],pathList[index+1],pathType,vehicle,currentConfig.extraAxle,null,null, //null block lines,scale
								function(data){
									obj.saveStats({text:bitac,type:'routing'});
									obj.routeDataProcessed.current[type].typeRoute = type;
									var list = obj.routeDataProcessed.current[type].list;
									var item = {id:nameProcess,value:data} 
										item.startPoint = pathList[index];
										item.endPoint = pathList[index+1];
										
									list.push(item);
									if(index < pathList.length-2){
										//si faltan aun mas puntos por calcular se manda a llamar la funcion de forma recursiva a si mis a con diferente posiscion de procesamiento (INDICE)
										getRoute(type, index+1);
									}else{
										//una vez que se ha terminado con todos los tramos se solicita impresion en mapa
										obj.routeDataProcessed.current[type].status = 1;
										obj.printRouteData();
									}
								},null,function(){
								   alert('error en servicio Sakbe ');	
								}
							);
						//}
				}
				
				if (list.length > 1){
					var count = 0;
					for (var x in list){
						var item = list[x];
						var isEdit = item.edit;
						if(!isEdit){
							pathList.push(item);	
						}
					}
					if(pathList.length > 1){
						getRoute('optimal');
						getRoute('free');
					}
				}else{
					obj.map.Routing.event({action:'delete',type:'pay'});
					obj.map.Routing.event({action:'delete',type:'free'});
					obj.hideDetail();
				}
				
				obj.printRouteMarks();
				obj.printList();
				
			},
			showRutes:function(){
				var obj = this;
				obj.printRouteMarks();
				obj.printRouteData();
			},
			hideRutes:function(){
				var obj = this;
				obj.map.Mark.event({action:'delete',items:'all',type:'routing'});
				obj.map.Routing.event({action:'delete',type:'pay'});
				obj.map.Routing.event({action:'delete',type:'free'});
			},
			hideSegment:function(){
				var obj = this;
				obj.map.Routing.event({action:'delete',type:'segment'});
			},
			showSegment:function(geo){
				var obj = this;
				obj.map.Routing.event({action:'add',geometry:geo,type:'segment'});
			},
			hideTolls:function(list){
				var obj = this;
				obj.map.Mark.event({action:'delete',items:'all',type:'routing'});
				obj.printRouteMarks();
			},
			printTolls:function(list){
				var obj = this;
				for(var ms in list){
					var item = list[ms];
					var point = item.punto_caseta;
					if(point){
						var nomcaseta = item.direccion.substr(item.direccion.indexOf('caseta')+7,item.direccion.length);
						point = JSON.parse(point).coordinates;
						var params = {lon:point[0],lat:point[1],type:'routing',params:{nom:nomcaseta,desc:nomcaseta,image:'route_toll'}};
						item.idMark = obj.map.Mark.add(params);
					}
				}
				return list;
			},
			selectMark:function(id){
				var obj = this;
				obj.map.Mark.event({action:'select',items:[{id:id}],type:'routing'});
			},
			unselectMark:function(id){
				var obj = this;
				obj.map.Mark.event({action:'unselect',items:[{id:id}],type:'routing'});
			},
			printRouteMarks:function(){
				var obj = this;
				var list = obj.routeData;
				var listMark = [];
				obj.map.Mark.event({action:'delete',items:'all',type:'routing'});
				//filtra elementos que no son imprimibles
				for (var x in list){
						var item = list[x];
						var isEdit = item.edit;
						if(!isEdit){
							listMark.push(item);	
						}
				}
				if(listMark.length > 0){
					for (var x in listMark){
						var item = listMark[x];
						var typeMark = (x == 0)?'routea':
									   (x == list.length-1)?'routeb':'routing_'+x;
						var point = JSON.parse(item.geojson).coordinates;
						//sakbe ajustar
						if(point[1] < 50){
							point = obj.map.transformToMercator(point[0],point[1]);
							point = [point.lon,point.lat];
						}
								//point.substring(6,point.length-2).split(' ');
						var params = {lon:point[0],lat:point[1],type:'routing',params:{nom:item.nombre,desc:item.nombre,image:typeMark}};
						if(!typeMark)
							delete params.params.image;
							
						item.idMark = obj.map.Mark.add(params);
					}
				}
			},
			getPointFromItem:function(item){
				return(item.geojson.substring(item.geojson.lastIndexOf('[')+1,item.geojson.lastIndexOf(']')));
			},
			showUniqueRoute:function(type){
				var obj = this;
				//inverted
				var typesConversor = {'optimal':'free','free':'pay','suggested':'suggested'};
				obj.map.Routing.event({action:'delete',type:typesConversor[type]});	
			},
			printRouteData:function(type){
				var obj = this;
				//verifica que ruta estan terminadas y aun no han sido impresas
				var routes = obj.routeDataProcessed.current;
				//verifica que todas las rutas hayan concluido
				var ready = true;
				for(var x in routes){
					if(!routes[x].status)
						ready = false;
				}
				if(ready){
					obj.spinner(false);
					obj.hideDetail();
					//orden de impresion
					var listRoutes = [routes.free,routes.optimal];
					
					for(var x in listRoutes){
						var route = listRoutes[x];
						var list = route.list;
						var toll = false;
						for(var y in list){
							var segment = list[y];
							if(segment.value[0].peaje == 't')
								toll = true;
						}
						route.toll = toll;
					}
					if(!(listRoutes[0].toll) && !(listRoutes[1].toll))
						listRoutes[0].status = 0;
					
					
					for(var x in listRoutes){
						var route = listRoutes[x];
						var status = route.status;
						var printed = route.printed;
						var type = route.typeRoute;
						
						route.length = 0;
						route.time = 0;
						
						if(route.status){ //si el status de la ruta es procesada, y aun no ha sido impresa
							//elimina lineas y marcas
							var typesConversor = {'optimal':'pay','free':'free'};
							obj.map.Routing.event({action:'delete',type:typesConversor[type]});
							route.printed = true;	
							var list = route.list;
							//print Lines
							for(var y in list){
								var segment = list[y];
								//extrae punto inicial
								route.length+= segment.value[0].long_km;
								route.time+= segment.value[0].tiempo_min;
								var geo = segment.value[0].geojson;
								obj.map.Routing.event({action:'add',geometry:geo,type:typesConversor[type]});
							}
						}
					}
					//Muestra detalle de las rutas
					obj.showDetail();
				}
			},
			newItem:function(pos){
				pos = parseInt(pos,10);
				var obj = this;
				var main = obj.main;
				var list = obj.routeData;
				
				for(var x in list){
					var item = list[x];
					if(item.edit){
						if(x <= pos)
							pos--;
						list.splice(x,1);
					}
				}
				
				var item = {name:'',id:-1,edit:true};
				
				if (list.length == 0){
					list.push(item);
				}else{
					list.splice(pos,0,item);
				}
			},
			removeItem:function(pos){
				pos = parseInt(pos,10);
				var obj = this;
				var main = obj.main;
				var list = obj.routeData;
				list.splice(pos,1);
				obj.processRoute();
			},
			swapItem:function(pos){
				pos = parseInt(pos,10);
				var obj = this;
				var main = obj.main;
				var list = obj.routeData;
				
				var item_a = list[pos];
				list[pos] = list[pos+1];
				list[pos+1] = item_a;
				
				obj.processRoute();
			},
			spinner:function(ban){
				var obj = this;
				if(ban === undefined || ban){
					var width = $('#mdm6DinamicPanel_results').width();
					var height = $('#mdm6DinamicPanel_results').height();
					
					var cadena = '<div id="module-routing-spinner" style="width:'+width+'px;height:'+height+'px"><center><div class="module-routing-spinner-label">Procesando Ruta...</br><div class="module-routing-spinner-img"></div></center></div></div>';
					$('#module-routing-spinner').remove();
					$('#mdm6DinamicPanel_results').prepend(cadena);
				}else{
					$('#module-routing-spinner').remove();
				}
			},
			printList:function(){
				var obj = this;
				var main = obj.main;
				var list = obj.routeData;
				
				var cadena = '';
				if(list.length < 2)  //por default agrega los 2 primeros puntos con el click
					obj.newItem(list.length);
				
				if(list.length == 1 && list[0].edit){
					$('.module-routing-clear-btn').css('display','none');			
				}else{
					$('.module-routing-clear-btn').css('display','block');			
				}
				
				if(list.length > 0){
					
					for(var x in list){
						var item = list[x];
						var edit = item.edit;
						var id = item.id_dest || 'error';

						
						//Agrega boton plus al inicio de lista
						if(x == 0 && !(list.length == 1 && edit) && list.length < obj.limitCount){
							cadena+= '	<div class="module-routing-point-side-tool" idpos="'+(x)+'" >';
							cadena+= '			<div idpos="'+(x)+'" class="module-routing-item-add module-routing-sprite module-routing-sprite-plus"></div>';
							cadena+= '	</div>';
						}
						
						var type = (x == 0)?{label:'A',title:'Origen'}:
									(list.length > 1 && x == list.length-1)?{label:'B',title:'Destino'}:
									{label:x,title:'Punto Intermedio '+x};
							cadena+= '	<div class="module-routing-point" edit="'+((edit)?'true':'false')+'" inner="'+((x > 0 && list.length > 1 && x != list.length-1)?'true':'false')+'" idpos="'+x+'" idref="'+id+'" title="'+type.title+'">';
							cadena+= '		<div class="module-routing-point-letter">'+type.label+'</div>';
							cadena+= '		<div class="module-routing-point-info">';
							cadena+= '			<div class="module-routing-point-info-text">';
							
							if(edit){
								cadena+= '				<input type="text" class="module-routing-inputField" placeholder="Buscar ubicaci&oacute;n geogr&aacute;fica"/>';
							}else{
								cadena+= '				<div class="module-routing-inputField">'+item.nombre+'</div>';	
							}
							
							cadena+= '			</div>';
							if(true){
							//if(!edit){
								cadena+= '			<div idpos="'+(x)+'" title="eliminar punto de ruta" class="module-routing-item-close module-routing-sprite module-routing-sprite-close02"></div>';
							}else{
								cadena+= '			<div idpos="'+(x)+'" class="module-routing-item-ok module-routing-sprite module-routing-sprite-ok"></div>';		
							}
							cadena+= '		</div>';
							cadena+= '	</div>';
							
							if(x < list.length -1){
								cadena+= '	<div class="module-routing-point-separator" idpos="'+(x+1)+'" >';
								cadena+= '		<div class="module-routing-point-tools">';
								cadena+= '			<div idpos="'+(x)+'" title="invertir puntos de ruta" class="module-routing-item-swap module-routing-sprite module-routing-sprite-swap"></div>';
								
								if(list.length < obj.limitCount)
									cadena+= '			<div idpos="'+(parseInt(x,10)+1)+'" title="agregar un nuevo punto de ruta" class="module-routing-item-add module-routing-sprite module-routing-sprite-plus"></div>';
								
								cadena+= '		</div>';
								cadena+= '	</div>';
							}	
					}
					//Agrega boton plus al final de lista
					if(x == list.length - 1 && !(list.length == 1 && edit) && list.length < obj.limitCount){
							cadena+= '	<div class="module-routing-point-side-tool" idpos="'+(x)+'" >';
							cadena+= '			<div idpos="'+(parseInt(x,10)+1)+'" class="module-routing-item-add module-routing-sprite module-routing-sprite-plus"></div>';
							cadena+= '	</div>';
					}
				}else{
				 	//si no existen puntos
				 	cadena+= '	<div class="module-routing-point" inner="'+((x > 0 && list.length > 1 && x != list.length-1)?'true':'false')+'" idpos="'+x+'" idref="'+id+'" title="'+type.title+'">';
					cadena+= '		<div class="module-routing-point-letter">'+type.label+'</div>';
					cadena+= '		<div class="module-routing-point-info">';
					cadena+= '			<div class="module-routing-point-info-text"><div class="module-routing-inputField">'+item.name+'</div><input type="text" class="module-routing-inputField" style="display:none"/></div>';
					cadena+= '			<div idpos="'+(x)+'" class="module-routing-item-close module-routing-sprite module-routing-sprite-close02"></div>';
					cadena+= '		</div>';
					cadena+= '	</div>';
				}
				
				$('#module_routing_points').html(cadena);
				
				$('.module-routing-inputField').each(function(){
					obj.captureLocation($(this));
					$(this).focus();
				});
				
				
				$('.module-routing-item-add').each(function(){
					$(this).click(function(e){
						var pos = $(this).attr('idpos');
						obj.newItem(parseInt(pos,10));
						obj.printList();
						e.stopPropagation();
					});
				});
				$('.module-routing-item-close').each(function(){
					$(this).click(function(e){
						var pos = $(this).attr('idpos');
						obj.removeItem(parseInt(pos,10));
						obj.printList();
						e.stopPropagation();
					});
				});
				$('.module-routing-item-swap').each(function(){
					$(this).click(function(e){
						var pos = $(this).attr('idpos');
						obj.swapItem(parseInt(pos,10));
						obj.printList();
						e.stopPropagation();
					});
				});
				
				
					
			},
			createUI:function(){
				var obj = this;
				var main = obj.main;
				
				var cadena = '<div class="module-routing-container">';	
					cadena+= '	<div id="module_routing_points" class="module-routing-innerPoints module-routing-line">';
					cadena+= '	</div>';	
					cadena+= '	<div class="module-routing-config">';
					cadena+= '	</div>';
					cadena+= '</div>';
					
				$('#'+main.id+'_route_result').html(cadena).css({'display':'block'});
				
			},
			removeUIConfig:function(){
				$('#module_routing_config').remove();
				$('#disclaimer_routing').remove();
			},
			createUIConfig:function(){
			 var obj = this;
			 var main = obj.main; 
			 $('#module_routing_config').remove();
			 
			 var configData = obj.configData;
			 var current = configData.currentSelection;
			 
			 var vehicles = configData.vehicles;
			 var vehicle = vehicles[current.vehicle];
			 
			 var fuel = configData.fuel.type[current.fuel];
			 	 fuel.color = configData.fuel.fuelColor[fuel.id];
				 
			 var yield = current.yield;
			 var extraAxle = current.extraAxle;
			 
			 var isAxle = vehicle.extraAxle;
			 var axle = vehicle.axle;
			 
			 var caxlex = '';
			 if(isAxle){
				 caxlex = '<div class="module-routing-combo-label"><label>Ejes<br/>excedentes</label></div>';
				 caxlex+= '<select id="module_routing_axles">';
				 for(var x = 0;x < vehicle.extraAxle;x++){
					caxlex+= '<option value="'+x+'" '+((extraAxle == x)?'selected="selected"':'')+'>'+x+'</option>';	 
				 }
				 caxlex+= '</select>';
			 }
			 
			 var caxle = '';
			 if(axle){
				 caxle = '<div class="module-routing-combo-label"><label>N&uacute;mero<br/>de ejes</label></div>';
				 caxle+= '<select id="module_routing_vehicle_axles">';
				 for(var x in vehicle.axle){
					caxle+= '<option value="'+vehicle.axle[x]+'" '+((current.axle == vehicle.axle[x])?'selected="selected"':'')+'>'+(vehicle.axle[x])+'</option>';	 
				 }
				 caxle+= '</select>';
			 }
			 
			 
			 var cadena = '<div id="module_routing_config">';
			 	 cadena+= '		<div class="module-routing-menu-container">'
				 cadena+= '			<div id="module-routing-menu" class="module-routing-menu" style="display:none">'
				 cadena+= '				<div id="module-routing-menu-title"></div>';
				 cadena+= '				<div id="module-routing-menu-close" class="module-routing-menu-close module-routing-sprite module-routing-sprite-close02"></div>';
				 cadena+= '				<div id="module-routing-menu-content" class="module-routing-menu-content">';
			 	 cadena+= '				</div>';
				 cadena+= '			</div>';
				 cadena+= '		</div>';
				 cadena+= '		<div id="module-routing-config-ui">';
				 cadena+= '			<div id="module_routing_config_title">'+vehicle.label+'</div>';
				 cadena+= '			<div id="module_routing_vehicle">';
				 cadena+= '				<div class="module-routing-axle-container">'+caxlex+'</div>';
				 cadena+= '				<div id="module-routing-trail-container" class="module-routing-trail-container" type="'+((isAxle && extraAxle > 0)?vehicle.trail:'')+'">';
				 cadena+= '					<div class="module-routing-sprite module-routing-sprite-trail"></div>';
				 cadena+= '					<div class="module-routing-sprite module-routing-sprite-trailbig"></div>';
				 cadena+= '				</div>';
				 cadena+= '				<div class="module-routing-vehicle-container" type="'+vehicle.id+'">';
				 cadena+= '					<div class="module-routing-sprite module-routing-sprite-moto"></div>';
				 cadena+= '					<div class="module-routing-sprite module-routing-sprite-car"></div>';
				 cadena+= '					<div class="module-routing-sprite module-routing-sprite-bus"></div>';
				 cadena+= '					<div class="module-routing-sprite module-routing-sprite-truck"></div>';
				 cadena+= '				</div>';
				 cadena+= '				<div class="module-routing-vehicle-edit module-routing-sprite module-routing-sprite-pencil"></div>';
				 cadena+= '				<div class="module-routing-vehicle-axle-container">'+caxle+'</div>';
				 cadena+= '			</div>';
				 cadena+= '			<div class="module-routing-line-separator"></div>';
				 cadena+= '			<div id="module-routing-fuel-container" class="module-routing-fuel-container">';
				 cadena+= '				<div class="module-routing-fuel-title">Combustible</div>';
				 cadena+= '				<div class="module-routing-fuel-icon module-routing-sprite module-routing-sprite-'+fuel.id+'"></div>';
				 cadena+= '				<div class="module-routing-fuel-info">';
				 cadena+= '					<label>$'+fuel.cost.toFixed(2)+' lt.</label><br/>';
				 cadena+= '					<label style="color:'+fuel.color+'">'+fuel.label+'</label>';
				 cadena+= '				</div>';
				 cadena+= '				<div class="module-routing-fuel-edit module-routing-sprite module-routing-sprite-pencil"></div>';
			 	 cadena+= '			</div>';
				 
				 cadena+= '			<div id="module-routing-fuelYield-container" class="module-routing-fuelYield-container">';
				 cadena+= '				<div class="module-routing-fuelYield-title">Rendimiento</div>';
				 cadena+= '				<div class="module-routing-fuelYield-icon module-routing-sprite module-routing-sprite-performance"></div>';
				 cadena+= '				<div class="module-routing-fuelYield-info">';
				 cadena+= '					<label>'+yield+' Km/lt.</label>';
				 cadena+= '				</div>';
				 cadena+= '				<div class="module-routing-fuelYield-edit module-routing-sprite module-routing-sprite-pencil"></div>';
			 	 cadena+= '			</div>';
				 
				 cadena+= '			<div class="module-routing-bestroute">';
				 cadena+= '				<div class="module-routing-fuelYield-metadata-icon"></div>';
				 cadena+= '				<div class="module-routing-fuelYield-metadata-info"></div>';
				 cadena+= '				<div class="module-routing-fuel-metadata-totals"></div>';
				 cadena+= '			</div>';
				 
				 cadena+= '			<div class="module-routing-freeroute">';
				 cadena+= '				<div class="module-routing-fuel-metadata-icon"></div>';
				 cadena+= '				<div class="module-routing-fuel-metadata-info"></div>';
				 cadena+= '				<div class="module-routing-fuel-metadata-totals"></div>';
				 cadena+= '			</div>';
				 cadena+= '		</div>';
				 cadena+= '</div>';
			 
			 
			 $('#mdm6DinamicPanel_results').after(cadena);
			 
			 $('#module_routing_axles').change(function(){
					var val = parseInt($('#module_routing_axles option:selected').val(),10);
					current.extraAxle = val;
					obj.showDetail();
					$('#module-routing-trail-container').attr('type',((val == 0)?'':vehicle.trail));
			 });
			 $('#module_routing_vehicle_axles').change(function(){
					var val = parseInt($('#module_routing_vehicle_axles option:selected').val(),10);
					current.axle = val;
					obj.showDetail();
			 });
			 $('#module-routing-menu-close').click(function(){
					obj.createUIConfig();
			 });
			 //menu tipo de vehiculo
			 $('#module-routing-trail-container, .module-routing-vehicle-container, .module-routing-vehicle-edit').click(function(e){
				obj.createMenuVehicle();
				e.stopPropagation();
			 });
			 $('.module-routing-fuel-container').click(function(e){
				obj.createMenuFuel();
				e.stopPropagation();
			 });
			 $('.module-routing-fuelYield-container').click(function(e){
				obj.createMenuYield();
				e.stopPropagation();
			 });
			 
			 //disclaimer
			 cadena = '<div id="disclaimer_routing" class="module-routing-disclaimer-container routing-dinamicPanel-segment">';	
			 cadena+= ' 	<div class="module-routing-disclaimer-btn"><div class="icon-disclaimer"></div><label>Aviso</label></div>'
			 cadena+= ' 	<div class="module-routing-clear-btn"><div class="module-routing-sprite module-routing-sprite-clear"></div><label>Limpiar ruta</label></div>'
			 cadena+= '</div>';
			 
			 $('#disclaimer_routing').remove();
			 $('#mdm6DinamicPanel_results').before(cadena);
			 
			 $('.module-routing-disclaimer-btn').click(function(){
				obj.disclaimer(function(){});
			 });
			 $('.module-routing-clear-btn').click(function(){
				obj.routeData = [];
				obj.closeItinerary();
				obj.hideRutes();
				obj.printList(); 
				$('#module_routing_detail').remove();
			 });
			 
		    },
			createMenu:function(content,title){
				var obj = this;
				$('#module-routing-menu-content').html(content);
				$('#module-routing-menu-title').html(title)
				var width = $('#module_routing_config').width();
				var height = $('#module_routing_config').height();
				$('#module-routing-menu').css('width',width+'px');
				var ht = $('#module-routing-menu').height();
				
				$('#module-routing-config-ui').css('display','none');
				
				$('#module_routing_config').css('height',height+'px')
											.animate({'height':(ht+10)+'px'},300,function(){
													$('#module-routing-menu').fadeIn();	
				});
			},
			createMenuVehicle:function(){
				var obj = this;
				var main = obj.main; 
				var configData = obj.configData;
				var current = configData.currentSelection;
				 
				var vehicles = configData.vehicles;
				var vehicle = vehicles[current.vehicle];
				
				var cadena = '';
				for(var x in vehicles){
					var item = vehicles[x];
					//{id:'bus',label:'Autobus',axle:[2,3,4],extraAxle:5,trail:'trailbig'}
					var margin = (x > 1)?'margin-left:-29px':'';
					cadena+= '<div class="module-routing-vehicle-item" idpos="'+x+'">';	
					cadena+= '	<div class="module-routing-vehicle-item-title">'+item.label+'</div>';
					cadena+= '	<div class="module-routing-sprite module-routing-sprite-'+item.id+'" style="'+margin+'"></div>';
					cadena+= '</div>';
				}
				obj.createMenu(cadena,'Seleccione el Veh&iacute;culo');
				$('.module-routing-vehicle-item').each(function(index, element) {
                    $(this).click(function(){
						var pos = parseInt($(this).attr('idpos'),10);
						var v = vehicles[pos]
						current.vehicle = pos;
						current.extraAxle = 0;
						current.axle = (v.axle)?2:0;
						current.fuel = v.fuel;
						current.yield = v.yield;
						
						obj.createUIConfig();
						obj.showDetail();
					});
                });
			},
			createMenuFuel:function(){
				var obj = this;
				var main = obj.main; 
				var configData = obj.configData;
				var current = configData.currentSelection;
				 
				var vehicles = configData.vehicles;
				var vehicle = vehicles[current.vehicle];
				var fuel = configData.fuel.type;
				
				var cadena = '';
				for(var x in fuel){
					var item = fuel[x];
						item.color = configData.fuel.fuelColor[item.id];
					//{id:'bus',label:'Autobus',axle:[2,3,4],extraAxle:5,trail:'trailbig'}
					cadena+= '<div class="module-routing-fuel-item" idpos="'+x+'">';	
					cadena+= '	<div class="module-routing-fuel-item-icon module-routing-sprite module-routing-sprite-'+item.id+'"></div>';
					cadena+= '	<div class="module-routing-fuel-item-label" style="color:'+item.color+'">'+item.label+'</div>';
					if (item.cost > 0)
						cadena+= '	<div class="module-routing-fuel-item-label">$'+item.cost.toFixed(2)+' lt.</div>';
					cadena+= '</div>';
				}
				obj.createMenu(cadena,'Seleccione el combustible');
				$('.module-routing-fuel-item').each(function(index, element) {
                    $(this).click(function(){
						var pos = parseInt($(this).attr('idpos'),10);
						current.fuel = pos;
						obj.createUIConfig();
						obj.showDetail();
					});
                });
			},
			createMenuYield:function(){
				var obj = this;
				var main = obj.main; 
				var configData = obj.configData;
				var current = configData.currentSelection;
				var _yield = configData.fuel;

				var cadena = '';
				for(var x = _yield.yieldMin; x < _yield.yieldMax; x++){
					//{id:'bus',label:'Autobus',axle:[2,3,4],extraAxle:5,trail:'trailbig'}
					var color = '';

						if (x < 6)
							color = '#edb7b1';

						if (x > 5 && x < 11)
							color = '#eddab1';

						if (x > 10 && x < 16)
							color = '#eae7af';
						
						if (x > 15 && x < 21)
							color = '#c7e5ae';
						
						if (x > 20)
							color = '#b6efa5';
							
					cadena+= '<div class="module-routing-yield-item" idpos="'+x+'" style="background-color:'+color+'">'+x+'</div>';	

				}
				obj.createMenu(cadena,'Seleccione el rendimiento Km/lt.');
				$('.module-routing-yield-item').each(function(index, element) {
                    $(this).click(function(){
						var pos = parseInt($(this).attr('idpos'),10);
						current.yield = pos;
						obj.createUIConfig();
						obj.showDetail();
					});
                });
			},
			showDetail:function(){
				var obj = this;
				obj.createRouteDetail();
			},
			hideDetail:function(){
				var obj = this;
				$('#module_routing_detail').remove();
			},
			//segmento para el despliegue del detalle.
			createRouteDetail:function(){
				var obj = this;
				var routes = obj.configData.routes;
				var dataRoutes = obj.routeDataProcessed.current;
				
				var configData = obj.configData;
				var current = configData.currentSelection;
				 
				var vehicles = configData.vehicles;
				var vehicle = vehicles[current.vehicle];
				 
				var fuel = configData.fuel.type[current.fuel];
					fuel.color = configData.fuel.fuelColor[fuel.id];
					 
				var yield = current.yield;
				var extraAxle = current.extraAxle;
				 
				var isAxle = vehicle.extraAxle;
				var axle = vehicle.axle;
				
				if(dataRoutes.optimal.list.length > 0){
					$('#module_routing_detail').remove();
					
					var cadena = '<div id="module_routing_detail" class="routing-dinamicPanel-segment">';
						cadena+= '	<div class="module-routing-detail-header">';
						
						var firstToll = null;
						var printCount = 0;
						for(var x in routes){
							var item = dataRoutes[routes[x].id];
								item.label = routes[x].label;
								item.color = routes[x].color;
							
							var canPrint = true;
							if(firstToll == null){
								firstToll = item.toll;
							}else{
								canPrint = !(firstToll == item.toll && !(item.toll));//imprimir solo si parecen distintas
							}	
							if(canPrint){ //es recomendable imprimir el detalle?
								printCount++;
								var list = item.list;
								//suma de rutas
								item.vehicle_cost = 0;
								item.fuel_cost = ((item.length)/yield)*fuel.cost;
								
								var vehicleName = 'rate_'+vehicle.id;
								var axle_name = (vehicle.id == 'car')?'rate_ligth_axle':'rate_exed_axle';
								if(current.axle > 0)
								   vehicleName+='_'+current.axle;
								
								for(var y in list){
									var data = list[y].value[0];
									item.vehicle_cost+= data.costo_caseta;
									/*if(current.extraAxle > 0){
										item.vehicle_cost+=(current.extraAxle*data[axle_name]);
									}*/
								}
									
								var cost = 0;
								item.distance = item.length;
								item._time = item.time/60;
									
								cadena+= '	<div type="'+routes[x].id+'" class="module-routing-detail-header-route" style="background-color:'+item.color+'">';
								cadena+= '		<div class="module-routing-dh-title"><span class="module-routing-dh-notebook-icon ui-icon ui-icon-info"></span>Opci&oacute;n '+(parseInt(x,10)+1)+'</div>';	
								cadena+= '		<div class="module-routing-dh-info-distance">';	
								cadena+= '			<div class="module-routing-dh-lb-left-width">Distancia</div>';
								cadena+= '			<div class="module-routing-dh-lbBig-left">'+(item.distance).toFixed(1)+'</div>';	
								cadena+= '			<div class="module-routing-dh-lb-left"> Km</div>';
								cadena+= '		</div>';	
								cadena+= '		<div class="module-routing-dh-info-time">';	
								cadena+= '			<div class="module-routing-dh-lb-left-width">Tiempo</div>';
								cadena+= '			<div class="module-routing-dh-lb-left-bold">'+(obj.minutesToTime(item.time))+'</div>';	
								cadena+= '		</div>';	
								cadena+= '		<div class="module-routing-dh-info-cost">';	
								cadena+= '			<div class="module-routing-dh-info-cost-total">';	
								cadena+= '				<div class="module-routing-dh-lb-left-width">Costo T.</div>';
								cadena+= '				<div class="module-routing-dh-lb-left-bold">$'+(item.fuel_cost+item.vehicle_cost).formatMoney(1)+'</div>';	
								cadena+= '			</div>';
								cadena+= '			<div class="module-routing-dh-info-cost-total">';	
								cadena+= '				<div class="module-routing-dh-lb-left-width">Comb.</div>';
								cadena+= '				<div class="module-routing-dh-lb-left-bold">$'+item.fuel_cost.formatMoney(1)+'</div>';	
								cadena+= '			</div>';
								cadena+= '			<div class="module-routing-dh-info-cost-total">';	
								cadena+= '				<div class="module-routing-dh-lb-left-width">Casetas</div>';
								cadena+= '				<div class="module-routing-dh-lb-left-bold">$'+item.vehicle_cost.formatMoney(1)+'</div>';	
								cadena+= '			</div>';
								cadena+= '		</div>';
								cadena+= '	</div>';
							}
						}
						cadena+= '	</div>';
						cadena+= '</div>';
					$('#module_routing_config').after(cadena)
					$('#module_routing_detail').attr('routeCount','count_'+printCount);	
					
					$('.module-routing-detail-header-route').each(function(){
						$(this).click(function(){
							var type = $(this).attr('type');
							
							$('.module-routing-detail-header-route').each(function(){ 
								$(this).css('display','none');
							});
							$(this).css({'display':'block',width:'100%'}).unbind('click');
							
							obj.createItinerary(type);
						});
					});
					
				}//fin condicion existen
				
				
			},
			closeItinerary:function(){
				var obj = this;
				$('#mdm6DinamicPanel_results').css('display','block');
				obj.createUIConfig();
				obj.showRutes();
				obj.showDetail();
			},
			exportItinerary:function(type){
				var obj = this;
				var main = obj.main;
				
				var itinerary = obj.itinerary;
				var rows = [];
				var cols = [{label:'Descripción'},{label:'Posición'},{label:'Distancia (m)'},{label:'Tiempo (mins)'},{label:'Costo peaje'}];
				var totals = ['Totales','',0,0,0];
				for(var x in itinerary){
					var item = itinerary[x];
					var row = []
						row.push(item.direction);
						row.push((item.position)?item.position:'');
						
						var length = (item.length && item.length > 0)?item.length.toFixed(2):'';
						row.push(length);
						if(length != '')
							totals[2]+=parseFloat(length,10);
						
						var time = (item.time_min && item.time_min> 0)?item.time_min.toFixed(2):'';
						row.push(time);
						if(time != '')
							totals[3]+=parseFloat(time,10);
						
						var cost = (item.vehicle_cost && item.vehicle_cost > 0)?item.vehicle_cost.formatMoney():'';
						row.push(cost);
						if(cost != '')
							totals[4]+=parseFloat(cost,10);
							
					rows.push(row);
				}
				//anexo de totales
				totals[2] = totals[2].toFixed(2);
				totals[3] = totals[3].toFixed(2);
				totals[4] = totals[4].toFixed(2);
				rows.push(totals);
				
				if(itinerary.length > 0)
					main.exportList('Itinerario',cols,rows,type);

			},
			printItinerary:function(type){
				var obj = this;
				obj.spinner(false);
				obj.showUniqueRoute(type);
				obj.itinerary = [];
				var tolls = {};
				
				var iconConvertion = {
						icon_0:'module-routing-sprite module-routing-sprite-fordward',
						icon_1:'module-routing-sprite module-routing-sprite-left01',
						icon_2:'module-routing-sprite module-routing-sprite-right01',
						icon_3:'module-routing-sprite module-routing-sprite-left02',
						icon_4:'module-routing-sprite module-routing-sprite-right02',
						icon_7:'module-routing-sprite module-routing-sprite-ferry',
						icon_8:'module-routing-sprite module-routing-sprite-tollbooth-ticket',
						icon_9:'module-routing-sprite module-routing-sprite-tollbooth'
				}
				
				var main = obj.main;
				var list = obj.routeItenerary.current[type].list;
				
				if(list.length > 0){
					
					$('#mdm6DinamicPanel_results').slideUp('fast');
					$('#module_routing_config').slideUp('fast').remove();
					
					var routeData = obj.routeData;
					var configData = obj.configData;
					var current = configData.currentSelection;
					var vehicles = configData.vehicles;
					var vehicle = vehicles[current.vehicle];
					var fuel = configData.fuel.type[current.fuel];
						fuel.color = configData.fuel.fuelColor[fuel.id];
					var yield = current.yield;
					var extraAxle = current.extraAxle;
					var isAxle = vehicle.extraAxle;
					var axle = vehicle.axle;
					
					var mrkPoint = function(item){
						var point = JSON.parse(item.geojson).coordinates;
						point = obj.map.transformToMercator(point[0],point[1]);
						point = obj.map.transformToDegrees(point.lon,point.lat);
						var cadena = '	<div markpos="'+item.pos+'" class="module-routing-itinerary-item module-routing-itinerary-markpoint">';
						cadena+= '		<div class="module-routing-itinerary-item-icon">'+item.label+'</div>';
						cadena+= '		<div class="module-routing-itinerary-item-info">';
						cadena+= '			<div class="module-routing-itinerary-item-direction">'+item.direction+'</div>';
						cadena+= '			<div class="module-routing-itinerary-item-time">'+point.lon+', ' +point.lat+'</div>';
						cadena+= '		</div>';
						cadena+= '	</div>';
						
						var ob = {direction:item.direction,position:point.lon+', '+point.lat,name:item.name,label:item.label};
						return {html:cadena,ob:ob};
					}
					
					if(list.length > 0){
						$('#module_routing_itinerary').remove();
						var cadena = '<div id="module_routing_itinerary">';
							cadena+= '	<div class="module-routing-itinerary-header">';
							cadena+= '		<div class="module-routing-itinerary-hd-option" type="all">Todo</div>';
							cadena+= '		<div class="module-routing-itinerary-hd-option" type="caseta">Casetas</div>';
							cadena+= '		<div title="regresar" class="module-routing-itinerary-hd-close module-routing-sprite module-routing-sprite-back" ></div>';
							cadena+= '		<div class="module-routing-itinerary-hd-dcontainer">';
							cadena+= '		</div>';
							cadena+= '	</div>';
							cadena+= '	<div class="module-routing-itinerary-contailer" type="all">';
							
						obj.printTolls(list);
						
						for(var ms in list){
								
								var item = list[ms];
								
								if(item.markPoint && item.startPoint){
									var titem = mrkPoint({label:item.label,direction:'Inicia recorrido desde: '+item.startPoint.nombre,pos:ms,name:item.startPoint.nombre,geojson:item.geojson});
									cadena+= titem.html;
									obj.itinerary.push(titem.ob);
								}
								if(!item.markPoint){
									item.vehicle_cost = 0;
									item.fuel_cost = (item.long_km/yield)*fuel.cost;
									
									var vehicleName = '	rate_'+vehicle.id;
									var axle_name = (vehicle.id == 'car')?'rate_ligth_axle':'rate_exed_axle';
									
									if(current.axle > 0)vehicleName+='_'+current.axle;
									
									//calculo de costo
									if(item.punto_caseta){
										item.vehicle_cost = (item.costo_caseta)+(item.eje_excedente*extraAxle);
									}
									
									item.turn = item.giro;
									
									item.icon = iconConvertion['icon_'+item.turn];
									var idSegment = item.turn;
									
									var type = (idSegment == 7 || idSegment == 8 || idSegment == 9)?'caseta':'giro';
									item.distance = item.long_m/1000;
									cadena+= '	<div idpos="'+ms+'" class="module-routing-itinerary-item" type="'+type+'" idtype="'+type+'">';
									cadena+= '		<div class="module-routing-itinerary-item-icon"><div class="'+item.icon+'"></div></div>';
									cadena+= '		<div class="module-routing-itinerary-item-info">';
									cadena+= '			<div class="module-routing-itinerary-item-direction">'+item.direccion+'</div>';
									if(item.vehicle_cost > 0){
										cadena+= '			<div class="module-routing-itinerary-item-cost">$'+item.vehicle_cost.formatMoney()+'</div>';	
									}else{
										cadena+= '			<div class="module-routing-itinerary-item-time">'+obj.minutesToTime(item.tiempo_min)+'</div>';
										cadena+= '			<div class="module-routing-itinerary-item-length">'+(item.distance).toFixed(2)+'km</div>';
									}
									cadena+= '		</div>';
									cadena+= '	</div>';
									
									obj.itinerary.push(item);
								}
								if(item.markPoint && item.endPoint){
									var cadenaPunto = (item.label != 'B')?'Arribo a punto intermedio en ':'Arribo a destino ';
									var titem = mrkPoint({label:item.label,direction:cadenaPunto+item.endPoint.nombre,pos:ms,name:item.endPoint.nombre,geojson:item.geojson});
									cadena+= titem.html;
									obj.itinerary.push(titem.ob);
								}
						}
						
						cadena+= '	</div>';
						
						//download btns
						cadena+= '	<div class="module-routing-itinerary-btools">';
						cadena+= '		<div type="xls" class="module-routing-itinerary-dwfile module-routing-sprite module-routing-sprite-file-xls"></div>';
						cadena+= '		<div type="csv" class="module-routing-itinerary-dwfile module-routing-sprite module-routing-sprite-file-csv"></div>';
						cadena+= '		<div type="pdf" class="module-routing-itinerary-dwfile module-routing-sprite module-routing-sprite-file-pdf"></div>';
						cadena+= '	</div>';
						
						cadena+= '</div>';
						
						$('#module_routing_detail').append(cadena);
						$('.module-routing-itinerary-hd-close').click(function(){
							obj.closeItinerary();
						});
						$('.module-routing-itinerary-hd-option').each(function(){
							$(this).click(function(){
								var type = $(this).attr('type');
								$('.module-routing-itinerary-contailer').attr('type',type);	
							});
						});
						$('.module-routing-itinerary-item').each(function(){
							var pos = $(this).attr('idpos');
							if(pos){
								pos = parseInt(pos,10);
								var item = list[pos];
								var geo = item.geojson;
								$(this).mouseenter(function(){
									obj.showSegment(geo);
									if(item.idMark)
										obj.selectMark(item.idMark);
										
								}).mouseleave(function(){
									obj.hideSegment();
									if(item.idMark)
										obj.unselectMark(item.idMark);
								}).click(function(){
									main.mapExtend(geo);	
								});
							}
						});
						$('.module-routing-itinerary-markpoint').each(function(){
							var pos = $(this).attr('markpos');
							if(pos){
								pos = parseInt(pos,10);
								var item = list[pos];
								var geo = item.geojson;
								$(this).click(function(){
									main.mapExtend(geo);	
								});
							}
						});
						$('.module-routing-itinerary-dwfile').each(function(){
							$(this).click(function(){
								var type = $(this).attr('type');
								if(type != 'pdf')
									obj.exportItinerary($(this).attr('type'))
								else
									obj.itineraryToPdf();
									
							});
						});
						
						
					}
				}
			},
			createItinerary:function(type){
				var obj = this;
				var main = obj.main;
				var list = obj.routeData;
				var pathList = [];
				var getRoute = function(type, index){
				//inicia el spinner de proceso
					obj.spinner();
					if (!index){
						index = 0;
						var tempData = obj.routeItenerary.current[type];
						obj.routeItenerary.current[type] = {status:0,list:[]};
						obj.routeItenerary.last[type] = tempData;
					}
					
					var nameProcess = '_'+pathList[index].id_dest+'_'+pathList[index+1].id_dest;
					var lastList = obj.routeDataProcessed.last[type].list;	
					var exists = null;
					
					//verifica si el tramo a calcular no se ha solicitado en la misma sesion de navegador
					/*for(var x in lastList){
						if (nameProcess == lastList[x].id){
							exists = lastList[x];
							break;
						}
					}
						//si ya ha sido solicitado, solo la incorpora al listado actual, de lo contrario la solicita
						if(exists){ //si ese punto ya fue procesado omite 
							obj.routeItenerary.current[type].list.push(exists);
							if(index < pathList.length-2){
								getRoute(type, index+1);
							}else{
								obj.routeItenerary.current[type].status = 1;
								obj.routeItenerary.current[type].typeRoute = type;
								obj.routeItenerary.last[type] = obj.routeItenerary.current[type];
								obj.printItinerary(type);
							}	
						}else{
					*/		
							
							var pathType = $.inArray(type,['optimal','free','suggested']); //tipo de ruta 
							var currentConfig = obj.configData.currentSelection;
							
							var vehicle = currentConfig.vehicle;
							switch(vehicle){
								case 2:
									vehicle+=(currentConfig.axle-2);
								break;
								case 3:
									vehicle+=2(currentConfig.axle-2);
								break;
							}

							//var bitac = 'id_s ='+pathList[index].id_dest+', id_t='+pathList[index+1].id_dest; //cadena de bitacora, para comparar los procesos ya realizados
							
							obj.sakbe.routing('detail',pathList[index],pathList[index+1],pathType,vehicle,currentConfig.extraAxle,null,null, //null block lines, scale
								function(data){
									//el nuevo tramo procesado es almacenado en el vector de resultados de ruta actual
									obj.routeItenerary.current[type].typeRoute = type;
									var t_list = obj.routeItenerary.current[type].list;
									
									if(t_list.length == 0){
										var item = {id :nameProcess};
											item.startPoint = pathList[index];
											item.markPoint = true;
											item.label = 'A';
											item.position = index;
											item.geojson = pathList[index].geojson;
											t_list.push(item);	
									}
									
									for(var x in data){
										t_list.push(data[x]);	
									}
									var item = {id:nameProcess};
										item.endPoint = pathList[index+1];
										item.markPoint = true;
										item.label = (pathList.length < 3)?'B':
													  (index+1 == (pathList.length-1))?'B':
													  	index+1;
														
										item.position = index+1;
										item.geojson = pathList[index+1].geojson;
										
									t_list.push(item);
									
									if(index < pathList.length-2){
										//si faltan aun mas puntos por calcular se manda a llamar la funcion de forma recursiva a si mis a con diferente posiscion de procesamiento (INDICE)
										getRoute(type, index+1);
									}else{
										//una vez que se ha terminado con todos los tramos se solicita impresion en mapa
										obj.routeItenerary.current[type].status = 1;
										obj.printItinerary(type);	
									}
								}
							);
							
						//}
				}
				if (list.length > 1){
					var count = 0;
					for (var x in list){
						var item = list[x];
						var isEdit = item.edit;
						if(!isEdit){
							pathList.push(item);	
						}
					}
					if(pathList.length > 1){
						getRoute(type);
					}
				}else{
					obj.map.Routing.event({action:'delete',type:'segment'});
				}
			},
			saveStats:function(data){
				var obj = this;
				var dataSource = obj.dataSource;
				var mainObj = {
					project:obj.map.proyName,
					session:obj.map.idSession,
					layer:data.text,
					type:data.type
				};
				
				mainObj = JSON.stringify(mainObj);
				var params = mainObj;
				
				var dataSource = $.extend(true,{},dataSource.saveStats);
				dataSource.data = params;
				
				$.ajax(dataSource).done(function(data) {
					if(data && data.response.success){
					}
				}).error(function(){
					//obj.options.map.Notification({message:'Fall&oacute; al guardar las estadisticas de uso',time:4500});
				});
			},
			itineraryToPdf:function(){
				var obj = this;
				var main = obj.main;
				
				var configData = obj.configData;
				var current = configData.currentSelection;
				var vehicles = configData.vehicles;
				var vehicle = vehicles[current.vehicle];
				var fuel = configData.fuel.type[current.fuel];
				var yield = current.yield;
				var extraAxle = current.extraAxle;
				var isAxle = vehicle.extraAxle;
				var axle = vehicle.axle;
				
				
				var imgs = {
								logo:null,
								header:null,
								routing:null,
								a:null,
								b:null,
								'1':null,'2':null,'3':null,'4':null,'5':null,
								icon_0:null,icon_1:null,icon_2:null,icon_3:null,icon_4:null,
								icon_5:null,icon_8:null,icon_9:null
								
							} 
							
				var getImageFromUrl = function(url, _img,callback) {
					var img = new Image();
					img.onload = function() {
						imgs[_img] = img;
						callback(img);
					};
					img.src = url;
				}
				
				var checkstart = function(){
					var ready = true;
					for(var y in imgs){
						if (!imgs[y]){
							ready = false;
							break;	
						}
					}
					return ready;
				}
				
				for(var x in imgs){
					getImageFromUrl(obj.localPath+'icons/'+x+'.png',x,function(img){
						if (checkstart()){
							createPdf();	
						};
					});		
				}
				var createPdf = function(){
					var doc = new jsPDF('p','pt','letter');
					
					var itinerary = obj.itinerary;
					
					//header-------------------------------------------------------------------------------------------------
						var top = 70;
						doc.setFontSize(15);doc.setTextColor(0, 50, 97);
						doc.addImage(imgs['header'], 'PNG',0,0);
						doc.addImage(imgs['logo'], 'PNG',425,26);
						
						doc.text('Trazado de ruta',123,top+45);
						doc.addImage(imgs['routing'], 'PNG',20,top+29);
						doc.setFontSize(11);
						doc.addImage(imgs['a'], 'PNG',123,top+55);
						doc.text(itinerary[0].name,145,top+70);
						doc.addImage(imgs['b'], 'PNG',123,top+85);
						doc.text(itinerary[itinerary.length-1].name,145,top+100);
					//resume values-----------------------
						top = 220;
						doc.setDrawColor(85,143,199);doc.setFillColor(85,143,199);
						doc.rect(45,top+30,515,18,'F');
						var texts = [
										{label:'Tiempo',value:0,type:'t'},
										{label:'Distancia',value:0,type:'d'},
										{label:'Combustible',value:0,type:'m'},
										{label:'Casetas',value:0,type:'m'},
										{label:'Costo total',value:0,type:'m'}
									]
						for(var x in itinerary){
							var item = 	itinerary[x];
							var c_comb = (item.distance)?fuel.cost*(item.distance/yield):0; //combustible en base a la distancia
							if(item.tiempo_min)texts[0].value+=item.tiempo_min;
							if(item.distance)texts[1].value+=item.distance;
							if(item.distance)texts[2].value+=c_comb;
							if(item.vehicle_cost)texts[3].value+=item.vehicle_cost;
							if(item.distance)texts[4].value+=c_comb+item.vehicle_cost;
						}
						var left = 45;
						for(var x= 1;x <= texts.length ;x++){
							var xpos = left+((515/texts.length)*x);
							var wseg = (515/texts.length)-25;
							doc.setFontSize(10);doc.setTextColor(0, 50, 97);
							doc.text(texts[x-1].label,xpos-wseg,top+8);
							
							doc.setFontSize(10);doc.setTextColor(85,143,199);
							
							if(texts[x-1].type =='m')
								doc.text('$'+texts[x-1].value.formatMoney(),xpos-wseg,top+20);
							if(texts[x-1].type =='t')
								doc.text(obj.minutesToTime(texts[x-1].value),xpos-wseg,top+20);
							if(texts[x-1].type =='d')
								doc.text(texts[x-1].value.toFixed(2)+'km',xpos-wseg,top+20);
							
							if(x < texts.length){
								doc.setDrawColor(85,143,199);doc.setFillColor(85,143,199);
								doc.rect(xpos,top,3,30,'F');
							}
							
						}
					//vehicle details-------------------------------------------

					
					
					var v_des = vehicle._label;
						if(current.axle && current.axle > 0)
							v_des+= ' '+current.axle+' ejes'
						if(extraAxle > 0)
							v_des+= ', '+extraAxle+' ejes excedentes'
					
					v_des+=', combustible:'+fuel.label+' ($'+fuel.cost.formatMoney()+'), Rendimiento:'+yield+'km/lt';
					
					doc.setFontSize(9);doc.setTextColor(255,255,255);
					doc.text(v_des,left+10,top+41);
					
					//------------------
					var specialElementHandlers = {
						// element with id of "bypass" - jQuery style selector
						'#bypassme': function(element, renderer){
							// true = "handled elsewhere, bypass text extraction"
							return true
						}
					}
					//conformacion de contenido de pdf
					var element = $('#map');
					obj.map.getImageMap('png',{event:function(img){
						
						var margins = {
								top: 20,
								bottom: 60,
								left: 20,
								width: 720
							};
							var width = $('#map').width();
							var height = $('#map').height();
							height = Math.round(((1/width)*570)*height);
							

							doc.rect(15,295,580,height+10);
							doc.addImage(img, 'PNG',20,300,570,height);
							doc.addPage();
							
							var height = 800;
							var left = 20;
							var top = 20;
							var count = 0;
							var space = 60;
							for(var x in itinerary){
								var item = 	itinerary[x];
								doc.setFontSize(10);doc.setTextColor(85,143,199);
								
								if(item.label){
									doc.addImage(imgs[(''+item.label).toLowerCase()], 'PNG',left,top+(count*space));
									if(item.position){
										doc.text('Posición:'+item.position,left+40,top+(count*space)+20);
									}
								}
								if(item.turn != undefined && item.turn >= 0){
									doc.addImage(imgs['icon_'+item.turn], 'PNG',left,top+(count*space));
								}
								
								doc.text((item.direction || item.direccion),left+40,top+(count*space));
								
								if(item.tiempo_min){
									doc.text('Tiempo:'+obj.minutesToTime(item.tiempo_min),left+40,top+(count*space)+20);
								}
								if(item.distance){
									doc.text('Distancia:'+item.distance.toFixed(2)+'km',left+150,top+(count*space)+20);
								}
								if(item.distance){
									var c_comb = (item.distance)?fuel.cost*(item.distance/yield):0; //combustible en base a la distancia
									doc.text('Combustible:'+c_comb.formatMoney(),left+250,top+(count*space)+20);
								}
								if(item.vehicle_cost){
									doc.text('Caseta:'+item.vehicle_cost.formatMoney(),left+350,top+(count*space)+20);
								}
								
								count++;
								if(count == 12){
									count = 0;
									doc.addPage();	
								}
								
								
							}
							
							doc.save('itinerario.pdf');
						}

					});
					
					/*html2canvas(element, {
						"proxy":'http://10.1.30.102:8181/downloadfile/download',
						onrendered: function (canvas) {
						var margins = {
								top: 20,
								bottom: 60,
								left: 20,
								width: 720
							};

							doc.rect(15,295,580,400);
							var img =  canvas.toDataURL('image/png',1.0);
							doc.addImage(img, 'PNG',20,300,570,390);
							doc.addPage();
							
							var height = 800;
							var left = 20;
							var top = 20;
							var count = 0;
							var space = 60;
							for(var x in itinerary){
								var item = 	itinerary[x];
								doc.setFontSize(10);doc.setTextColor(85,143,199);
								
								if(item.label){
									doc.addImage(imgs[item.label.toLowerCase()], 'PNG',left,top+(count*space));
									if(item.position){
										doc.text('Posición:'+item.position,left+40,top+(count*space)+20);
									}
								}
								if(item.turn != undefined && item.turn >= 0){
									doc.addImage(imgs['icon_'+item.turn], 'PNG',left,top+(count*space));
								}
								
								doc.text(item.direction,left+40,top+(count*space));
								
								if(item.time_min){
									doc.text('Tiempo:'+obj.minutesToTime(item.time_min),left+40,top+(count*space)+20);
								}
								if(item.distance){
									doc.text('Distancia:'+item.distance.toFixed(2)+'km',left+150,top+(count*space)+20);
								}
								if(item.fuel_cost){
									doc.text('Combustible:'+item.fuel_cost.formatMoney(),left+250,top+(count*space)+20);
								}
								if(item.vehicle_cost){
									doc.text('Caseta:'+item.vehicle_cost.formatMoney(),left+350,top+(count*space)+20);
								}
								
								count++;
								if(count == 12){
									count = 0;
									doc.addPage();	
								}
								
								
							}
							
							doc.save('itinerario.pdf');
							
							
							
						}
					});*/
				} //create pdf
			}
		 } // Main
		   
		   
  return module;
});