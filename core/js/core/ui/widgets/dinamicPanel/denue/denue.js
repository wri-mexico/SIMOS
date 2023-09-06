// JavaScript Document
define(function(){
	var module = 
		   {
			//sobreescritas----------------------------------   
			getLayer:function(){}, //sobreescrita
			//-----------------------------------------------
			defultIdLayer:0,
			lastLayersActivated:'',
			dataSource:{},
			outLayers:[],
			seltPrint:false,
			init:function(main){
				var obj = this;
				this.main = main;
				this.map = main.options.map;
				var localUrl = require.toUrl("dinamicPanelPath");
					localUrl = localUrl.split('?')[0];
					localUrl+='denue/';

				$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'denue.css?ver='+mdmVersion}).appendTo('head');
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'module-denue-sprite.css?ver='+mdmVersion}).appendTo('head');
				
				setTimeout(function(){
					obj.updateVisibleStatus();
				},1000);
			},
			eventListener:function(evt){
				var obj = this;
				var main = obj.main;
				var idEvt = (typeof(evt) == 'object')?evt.id:evt;
				var val = (typeof(evt) == 'object')?evt.value:null;
				switch(idEvt){
					case 'identify':
						obj.closeTotals();
					break;
					case 'showResult':
						obj.closeTotals();
					break;
					case 'showDetail':
						obj.closeTotals();
					break;
					case 'tabChange':
						obj.updateVisibleStatus();
					break;	
					case 'mapChange':
						obj.updateVisibleStatus();
						obj.updateDownloadStatus();
					break;
					case 'createForm':
						obj.createMinitools();
					break;	
					case 'whatshere':
						obj.searchDenueByCat(null,null,val);
					break;
				}
			},
			excludeLayer:function(){
				var obj = this;
				var main = obj.main;
				var exludeId = obj.toolConfig.excludeLayer;
				
				if(exludeId){
					var list = exludeId.split(',');
					var ob = {exludeList:list};
					$("#layersDisplay").layerDisplay('exludeLayer',ob);	
				}
			},
			processSearch:function(list){
				var obj = this;
				var main = obj.main;
				var tlist = list.list;
				if(!tlist)
					list.list = [];
				
				
				var sourceSize = list.list.length;	
				var source = list.searchType;
				//marca como proceso ejecutado
				if(source == 'search'){
					var dataSource = $.extend(true,{},obj.dataSource.searchLayer);
					dataSource.params.q = list.text;
					dataSource.params.df = 'nombre';
					main.getData(dataSource,{},function(data){
						if(data && data.response.numFound > 0){
							var Llist = data.response.docs;
							//siempre tatara de completar 10 elementos
							var numToInsert = (sourceSize >= 7)?3:(10-sourceSize);
							var count = 0;
							list.total+= Llist.length;
							
							for(var x in Llist){
								var item = {
									    func:function(item){obj.clickOnLayer(item)},
										label:Llist[x].nombre,//.split(',').join(),
										busqueda:'',//Llist[x].busqueda.split(',').join(),
										id : Llist[x].id,
										styleClass:'dinamic-denue-item-layer',
										name : Llist[x].nombre, //renombra nombre por name
										type : 'layer', //renombra tipo por type
										position : {geo:'', merc:''},//reubica locacion y coord_merc
										tools:[{icon:'dinamicPanel-sprite dinamicPanel-sendLayer',
												title:'Agregar capa del DENUE'
												}],
										group:{
											idGroup:'denue',
											labelGroup:'Denue',
											id:Llist[x].id,
											onChange:function(group){
												obj.updateOutLayers(group);
											}
										}
									}
								list.list.splice(count,0,item);
								count++;
								if(count >= numToInsert)
									break;
							}
							list.list = list.list.splice(0,10);
							main.processData(list);
						}else{
							main.processData(list);
						}
					});	
				}else{
					main.processData(list);
				}
			},
			updateOutLayers:function(group){
				var obj = this;
				var main = obj.main;
				var tab = main.currentTool;
				obj.outLayers = group.list;
				obj.loadLayers();
			},
			updateVisibleStatus:function(){
				var obj = this;
				var main = obj.main;
				var tab = main.currentTool;
				var res = obj.map.getResolution();

				if(tab == 'search' && res <= obj.visibleScale){
					if(obj.lastLayersActivated == ''){
						obj.loadLayers();	
					}
					$('#'+main.id+'_minitools').show();
					if(obj.isOpen()){
						obj.searhOnView();
					}
				}else{
					$('#'+main.id+'_minitools').hide();
					if(obj.isOpen()){
						obj.closeTotals();
					}
					
					if(tab == 'search' && main.pagination){
						main.clearSearch();	
					}
					
					//desactiva peticion de vista de capas
					if(obj.lastLayersActivated != ''){
						obj.lastLayersActivated ='';
						var params = {layers:'',scian:'',tipoturista:''};
						MDM6('setParams',{layer:'Denue',params:params});
					}
				}
			},
			//click en layer incrustada en resultados de busqueda
			clickOnLayer:function(layer){
			},
			//-----------------------------Codigo Locale-----------------------
			list:[],
			loadData:function(denue){
				this.list = denue.tools;
				this.toolConfig = denue;
				this.dataSource = denue.dataSources;
				this.visibleScale = denue.visibleScale;
				this.defultIdLayer = denue.denueSearchLayerId;
			},
			createMinitools:function(){
				var obj = this;
				var main = obj.main;
				
				var tools = obj.list;	 
				var timer;
				//insertar estructura
				var cadena = '<div id="minitools_btns" class="minitools-btns"></div>';
					cadena+= '<div class="minitools-control"><div class="module-denue-sprite module-denue-down"></div><div class="module-denue-sprite module-denue-up"></div></div>';
					cadena+= '<div id="minitools_tools_container" class="minitools-tools"></div>';
					cadena+= '<div class="module-denue-bottom-minitools"><div id="minitools_btn_clear" class="module-denue-sprite module-denue-sprite-clear" title="Apagar selecci&oacute;n"></div></div>';
				
				$('#'+obj.main.id+'_minitools')
				.html(cadena).attr('opened',false)
				.on('mouseleave',function(){
					clearTimeout(timer);
					timer = setTimeout(function(){
						$('#'+obj.main.id+'_minitools').attr('opened',false);
					},4000);
				})
				.on('mouseenter',function(){
					clearTimeout(timer);
				});
				
				
				$('.minitools-control').click(function(){
					var status = ($('#'+obj.main.id+'_minitools').attr('opened') == 'true');
					$('#'+obj.main.id+'_minitools').attr('opened',!status);	
				});
				
				$('#minitools_btn_clear').click(function(e){
					obj.clearLayers();
					obj.closeTotals();
					e.stopPropagation();	
				})
				
				
				
				for(var x in tools){
					var tool = tools[x];
					var text = tool.text;
					
					var margin = (tool.size < 28)?Math.round((30-tool.size)/2)-1:0;
					
					cadena = '<div id="container_'+x+'" pos="'+x+'" title="'+tool.desc+'" type="'+tool.type+'" class="'+((tool.type=='btn')?'denue-item-item':'')+' denue-item-container" style="float:'+tool.float+';padding-right:'+margin+'px;padding-bottom:'+margin+'px;margin-top:'+margin+'px">'
					cadena+= '	<div id="'+x+'"  pos="'+x+'"  class="'+((tool.type=='tool')?'denue-item-item':'')+' denue-item-icon '+tool.icon+'" ></div>';			
					cadena+= '	<div class="denue-tool-led"></div>';
					
					if(text){
						cadena+= '<label class="denue-item-label">'+text+'</label>';
					}
					
					cadena+= '</div>';
					
					if (tool.type == 'tool'){
						$('#minitools_tools_container').append(cadena);	
					}
					if (tool.type == 'btn'){
						$('#minitools_btns').append(cadena);	
					}
								
				}
				
				$('.denue-item-item').each(function(index, element) {
					$(this).click(function(){
						var status = $(this).attr('status');
						var id = $(this).attr('id');
						var tool = obj.list[$(this).attr('pos')];
						if (tool.type == 'tool'){
							status = (status != 'active')?'active':'inactive';
							$(this).attr('status',status);
							$('#container_'+id).attr('status',status);
						}
						obj.action(status,tool);
					});
				});
			 },
			 //Layer control----------------------------------------
			 action:function(action,tool){
				var obj = this;
				action = action || 'btn';
				switch (action){
					case 'active': case 'inactive':
						obj.list[tool.id].active = (action == 'active');
						obj.loadLayers();
						if(action == 'active'){
							var index = $('.denue-item-container[type=tool]').index($('#container_'+tool.id));
							//if(index > 7){
							$('#container_'+tool.id).fadeOut('slow',function(){
								$('#container_'+tool.id).prependTo('#minitools_tools_container');
								$('#container_'+tool.id).fadeIn('slow');
							});
							//}
						}
					break;
				}
				if(tool.type == 'btn'){
					switch(tool.keyWord){
						case 'searchLocal':
							obj.searhOnView();
						break;	
					}
				}
			},
			activateLayers:function(layers){
				var obj = this;
				var tools = obj.list;
				var type = typeof(layers);
				
				$('.denue-item-container').each(function(index, element) {
                    $(this).attr('status','deactive');
                });
				$('.denue-item-item').each(function(index, element) {
                    $(this).attr('status','deactive');
                });
				
				for(var x in tools){
					var tool = obj.list[x];
					tool.active = false;
				}
				for(var x in layers){
					var tool = obj.list[layers[x]];
					tool.active = true;
					
                    $('#container_'+layers[x]).attr('status','active');
                    $('#'+layers[x]).attr('status','active');
				}
				obj.loadLayers();
			},
			clearLayers:function(){
				var obj = this;
				var tools = obj.list;
				for(var x in tools){
					var tool = obj.list[x];
					tool.active = false;
				}
				$('.denue-item-container[status=active]').attr('status','deactive');
				$('.denue-item-item[status=active]').attr('status','deactive');
				obj.loadLayers();
			},
			loadLayers:function(force){
				var obj = this;
				var tools = obj.list;
				var layers = [obj.defultIdLayer]; //defaul value 99999
				var llayers = [];
				var countLayers = 0;
				for(var x in tools){
					var tool = obj.list[x];
					var active = tool.active;
					if(tool.type == 'tool')
						if(!obj.isOpen()){ //si no esta abierto la lista de lo que hay aqui
							if(active){
								llayers.push(tool.keyWord);
								countLayers++;
							}
						}else{
							llayers.push(tool.keyWord);
							countLayers++;
						}
				}
				
				if(countLayers > 0){
					obj.excludeLayer();	
				}else{
					llayers.push('0');
				}
				
				var layersToShow = llayers.join();
				
				if(layersToShow != obj.lastLayersActivated){
					obj.lastLayersActivated = layersToShow;
					
					var params = {layers:layers.join(),scian:'',tipoturista:llayers.join()};
					//outLayers
					var outLayers = obj.outLayers;
					var strIds = [];
					for(var x in outLayers){
						var layer = outLayers[x];
						if(layer.active)
							strIds.push(layer.id);
					}
					if(strIds.length > 0){
						params.scian = strIds.join();
					}else{
						params.scian = '0';
					}
					
					MDM6('setParams',{layer:'Denue',params:params});
				}
			},
			searhOnView:function(view){
				var obj = this;
				var main = obj.main;
				var map = obj.map;
				
				var location = main.getMapCenter();
				var distance = location.distance;
                location = location.centroid.lat+', '+location.centroid.lon;
				var dataSource = $.extend(true,{},obj.dataSource.view);
				
				dataSource.params.pt = location;
				//dataSource.params.d = distance/1000;
				
				
				var pointBot = map.transformToGeographic(map.getExtent().lat[0],map.getExtent().lat[1]);
				var pointTop = map.transformToGeographic(map.getExtent().lon[0],map.getExtent().lon[1]);
				
				var x1 = pointTop.lon,
					y1 = pointTop.lat,
					x2 = pointBot.lon,
					y2 = pointBot.lat;
				
				
				dataSource.params.fq ='locacion:["'+y1+','+x1+'" TO "'+y2+','+x2+'"]';
				
				obj.lastResult = null;	
				main.getData(dataSource,{},function(data){
					if(data){
						var count = data.response.numFound;
						var data = data.facet_counts.facet_fields.tipo;
						if(data){
							if(count > 0){
								obj.lastResult = data;
								obj.printTotals();
							}else{
								main.searchNotFound();		
							}
						}
					}
				});
				
			},
			getTool:function(filter,value){
				var obj = this;
				var tools = obj.list;
				var layers = [];
				var res = null;
				for(var x in tools){
					var val = tools[x][filter];
					if(val){
						if(val == value){
							res = tools[x];
							break;	
						}
					}
				}
				if(!res)console.log('No existe el filtro en la configuracion de la herramienta de denue');
				return res;
			},
			clearTotals:function(){
				
			},
			enableTools:function(){
				$('#denue_tools_disable').remove();
				$('#minitools_tools_container').css('opacity','');
			},
			disableTools:function(){
				var obj = this;
				var w = $('#minitools_tools_container').width();
				var h = $('#minitools_tools_container').height();

				$('#minitools_tools_container').css({'opacity':'0.3'});
				
				var cadena = '<div id="denue_tools_disable" class="denue-tools-disable" ';
					cadena+= 'style="width:'+w+'px;"'
					cadena+= '>';
					cadena+= '</div>'
					
				$('#denue_tools_disable').remove();
				$('#minitools_tools_container').append(cadena);
			},
			isOpen:function(){
				var obj = this;
				var id = $('#denue_totals').attr('id');
				if(id)
					return true 
				else 
					return false;
			},
			closeTotals:function(){
				var obj = this;
				$('#denue_totals').remove();
				obj.loadLayers();
				obj.enableTools();
			},
			printTotals:function(){
				var obj = this;
				var main = obj.main;
				var results = obj.lastResult;
				if(results && results.length > 0){
					obj.disableTools();
					main.hiddeResults();
					
					
					//mostrar resultados
					var cadena = '';
					var field = [];
					var toolList = [];
					var data = [];
					//convertir a vector
					for(var x in results){
						if(data.length == 0 || data[data.length-1].length > 1 ){
							data.push([results[x]]);
						}else{
							data[data.length-1][1] = results[x];
						}
					}
					//ordenado de matris de 2 dimensiones
					data.sort(function(a, b) {if (a[0] === b[0]) {
							return 0;
						}
						else {
							return (a[0] < b[0]) ? -1 : 1;
						}
					});
					var cadena1 = '';
					var cadena2 = '';
					count= 0;
					var sum = 0;
					for(var x in data){
						if(data[x][1] > 0)
						 sum++;	
					}
					for(var x in data){
						var field = data[x];
							if(field[1] > 0){
								var tool = obj.getTool('filter',field[0]);
								if(count < Math.ceil(sum/2)){
									cadena1+= '<div class="denue-detail-item" text="'+field[0]+'"><div class="denue-detail-color" style="background-color:'+tool.color+'"></div><label>'+field[0]+'</label><span>'+field[1]+'</span></div>';	
								}else{
									cadena2+= '<div class="denue-detail-item" text="'+field[0]+'"><div class="denue-detail-color" style="background-color:'+tool.color+'"></div><label>'+field[0]+'</label><span>'+field[1]+'</span></div>';	
								}
								//si existe esa herramienta
								if(tool){
									toolList.push(tool.id);
								}
								count++;
							}
					}
					if (!obj.isOpen()){
						main.clearSearch();
						obj.lastLayersActivated = '';
						var tcadena = '<div id="denue_totals" class="denue-totals" style="display:none">';
							tcadena+= '	<div class="denue-totals-header">';
							tcadena+= '		<div class="denue-totals-title">Informaci&oacute;n en la vista</div>';
							tcadena+= '		<div id="denue_totals_close" class="denue-totals-close module-denue-sprite module-denue-sprite-close"></div>';
							tcadena+= '	</div>';
							tcadena+= '	<div id="denue_totals_list" class="denue-totals-list">';
							tcadena+= '		<div id="denue_totals_list1" class="denue-totals-list-sub">'+cadena1+'</div>';
							tcadena+= '		<div id="denue_totals_list2" class="denue-totals-list-sub">'+cadena2+'</div>';
							tcadena+= '	</div>';
							tcadena+= '</div>';
						
						$(tcadena).insertAfter('#'+main.id+'_minitools');
						$('#denue_totals').slideDown('fast');
						$('#denue_totals_close').click(function(){
							obj.closeTotals();	
						})
						
						
					}else{
						$('#denue_totals_list1').html(cadena1);
						$('#denue_totals_list2').html(cadena2);
					}
					
					$('.denue-detail-item').each(function(index, element) {
                            $(this).click(function(){
								var text = $(this).attr('text');
								obj.activateLayers([obj.getTool('filter',text).id]);
								obj.searchDenueByCat(text);
							});
                    });
					
					obj.activateLayers(toolList);	
					
				}else{
					main.searchNotFound();	
				}
			},
			searchDenueByCat:function(text,index,coords){
				var obj = this;	
				var main = obj.main;
				var map = obj.map;
				var rowSize = 10;
				
				
				//control de paginado
				index = (index)?index:1;
				index--;
				
				
				var dataSource = $.extend({},obj.dataSource.searchInLayer);
				var startRow = index*rowSize;
				dataSource.params.start = startRow;
				
				
				var location = main.getMapCenter();
					location = location.centroid.lat+', '+location.centroid.lon;
				
				var pointBot = map.transformToGeographic(map.getExtent().lat[0],map.getExtent().lat[1]);
				var pointTop = map.transformToGeographic(map.getExtent().lon[0],map.getExtent().lon[1]);
				
				var x1 = pointTop.lon,
					y1 = pointTop.lat,
					x2 = pointBot.lon,
					y2 = pointBot.lat;
				
				//revision de cambio de coodenadas entre paginados
				var strCoords = ''
				if(coords){
					var plocation = map.transformToGeographic(coords.centroid.lon,coords.centroid.lat);
					var location = 	plocation.lat+', '+plocation.lon;
					var pointBot = map.transformToGeographic(coords.extent[0],coords.extent[1]);
					var pointTop = map.transformToGeographic(coords.extent[2],coords.extent[3]);
					
					x1 = pointTop.lon;
					y1 = pointTop.lat;
					x2 = pointBot.lon;
					y2 = pointBot.lat;
				}else{
					coords = {
						centroid:{
							lat:main.getMapCenter().centroid.lat,
							lon:main.getMapCenter().centroid.lon
						},
						extent:[
							map.getExtent().lat[0],
							map.getExtent().lat[1],
							map.getExtent().lon[0],
							map.getExtent().lon[1]
						]
					}
						
				}
				
				if(text){
					dataSource.params.fq = 'tipo:"'+text+'"';
					strCoords = 'locacion:["'+y1+','+x1+'" TO "'+y2+','+x2+'"]+tipo:"'+text+'"';
				}else{
					dataSource.params.fq = '';
					strCoords = 'locacion:["'+y1+','+x1+'" TO "'+y2+','+x2+'"]';
				}
					
					
					
					

				
				dataSource.params.pt = location;
				dataSource.params.fq =strCoords;
				
				obj.lastResult = null;	
				main.getData(dataSource,{},function(data){
						var  object = {};
						if(data){
							object.total = data.response.numFound;
							
							var listA = data.response.docs;
							object.list = [];
							for (var x in listA){
								var item = listA[x];
								var label = '';
								var busqueda = item.busqueda.split(',');
								item.func = function(item){
									obj.main.mapExtend(item.position.merc.split(',').reverse());
									obj.map.Mark.event({action:'showPopup',items:[item.domId],type:'serch'})
								};
								item.onMouseOver = function(item){
									obj.map.Mark.event({action:'select',items:[item.domId],type:'serch'})
								},
								item.onMouseOut = function(item){
									obj.map.Mark.event({action:'unselect',items:[item.domId],type:'serch'})
								},
								item.nombre = item.nombre;
								label = item.busqueda;
								item.label = label; //extrae etiqueta marcada
								item.id = item.gid; delete item['gid']; //renombra gid por id
								item.name = item.nombre;
								item.type = main.stringAsType(item.tipo);
								item.position = {geo:item.locacion, merc:item.coord_merc}; delete item['locacion'];delete item['coord_merc']; //reubica locacion y coord_merc
								object.list.push(item);
							};
							var pagination = {
										total:object.total,
										page:index+1,
										currentRegNum:object.list.length,
										searchText:text,
										pageSize:rowSize,
										coords:coords,
										call:function(item){
											obj.searchDenueByCat(item.searchText,item.page,item.coords);	
										}
										};
							
							
							object.pagination = pagination;
							
							
							main.processData(object);
						}
				});
			},
			download:function(){
				var obj = this;
				var extent = obj.map.getExtent();
				var x1 = extent.lat[0],
					y1 = extent.lat[1],
					x2 = extent.lon[0],
					y2 = extent.lon[1];
					
				var polygon = 'POLYGON(('+x1+' '+y1+','+x2+' '+y1+','+x2+' '+y2+','+x1+' '+y2+','+x1+' '+y1+'))';
				
				//obtencion de datos
				var getData = function(func){
					var centroid = obj.map.getDistanceFromCentroid().centroid;
					var centroid = obj.map.transformToMercator(centroid.lon,centroid.lat);
					
					
					
					var mainObj = {
						resolution:obj.map.getResolution(),
						centroid:'POINT('+centroid.lon+' '+centroid.lat+')',
						polygon:polygon
					};
					
					mainObj = JSON.stringify(mainObj);
					var params = mainObj;
					
					var dataSource = $.extend(true,{},obj.toolConfig.dataSources.download);
					dataSource.data = params;
					
					$.ajax(dataSource).done(function(data) {
						if(data && data.response.success){
						   if($.isFunction(func))
						   		func(data);
						}
					}).error(function(){
						obj.map.Notification({message:'La funcionalidad de descargas no esta disponible, favor de intentarlo m&aacute;s tarde',time:4500});
					});
					
				}
				
				getData(function(data){
					obj.createDownloadUI(data);
				});
					
			},
			updateDownloadStatus:function(){
				var obj = this;
				if($('#denue_download').attr('id'))
					obj.download();	
			},
			createDownloadUI:function(data){
				var obj = this;
				if(data){
					var list = data.data.list;
					
						var edos = data.edos;
						var muns = data.muns;
						var locs = data.locs;
						
						
						var cadena = '<div id="denue_download" class="denue-download-container">';
							cadena+= '	<div class="denue-download-header"><div class="denue-download-title">Descarga de establecimientos del DENUE</div><div id="denue-download-close" class="module-denue-sprite module-denue-sprite-close"></div></div>';
							cadena+= '	<hr />';
							cadena+= '  <label class="denue-download-type">'+data.data.type+'</label>';
							cadena+= '	<div class="denue-download-list">';
							
							if(list.length > 0){
								var type = (data.data.type == 'localidad')?'loc':
											(data.data.type == 'municipal')?'mun':
											(data.data.type == 'estatal')?'edo':'nac';
											
								for(var x in list){
									var item = list[x];
									cadena+= '<div class="denue-download-list-item" idref="'+item.cvegeo+'">';	
									cadena+= '	<div class="denue-download-list-icon module-denue-sprite module-denue-sprite-'+type+'"></div>';	
									cadena+= '	<div class="denue-download-list-text">'+item.name+'</div>';	
									cadena+= '	<div class="denue-download-list-icon-download module-denue-sprite module-denue-sprite-download"></div>';
									cadena+= '</div>';	
								}
								
							}else{
								cadena+= '<label class="denue-download-notFound">No se encontraron elementos en la vista actual</label>';	
							}
							
							cadena+= '	</div>';
							if(obj.map.getResolution() <= 76.437028271){
								cadena+= '	<div class="denue-download-bottom-tools">';
								cadena+= '		<div id="denue-download-view" title="Descargar los datos de la vista actual"><div class="module-denue-sprite module-denue-sprite-viewDownload"></div><label>Descargar vista actual</label></div>';
								cadena+= '	</div>';
							}
							
							cadena+= '</div>';
						$('#denue_download').remove();
						$('#panel-center').append(cadena);
						$('#denue-download-close').click(function(){
							$('#denue_download').remove();	
						})
						$('.denue-download-list-item').each(function(){
							$(this).click(function(){
								var session = obj.map.idSession;
								var gid = $(this).attr('idref');
								var url = obj.toolConfig.urlDownloadService;
								window.open(url+'?idSesion='+session+'&claveGeoestadistica='+gid);
							});
						});
						$('#denue-download-view').click(function(){
							var extent = obj.map.getExtent();
							var x1 = extent.lat[0],
								y1 = extent.lat[1],
								x2 = extent.lon[0],
								y2 = extent.lon[1];
								
							var pg1 = obj.map.transformToGeographic(x1,y1);
							var pg2 = obj.map.transformToGeographic(x2,y2);
							
							var polygon = 'POLYGON(('+pg1.lon+' '+pg1.lat+','+pg2.lon+' '+pg1.lat+','+pg2.lon+' '+pg2.lat+','+pg1.lon+' '+pg2.lat+','+pg1.lon+' '+pg1.lat+'))';
							var session = obj.map.idSession;
							var url = obj.toolConfig.urlDownloadService;
							window.open(url+'?idSesion='+session+'&poligonoRecorte='+polygon);
						});
				}
				
			}
		}
		
	return module;
});