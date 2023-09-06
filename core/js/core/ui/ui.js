requirejs.config({
    paths: {
		dataSource:'../config/dataSourceConfig',
		mapConfig:'../config/mapConfig',
        iconRouter:'../config/iconRouter',
        dp_translate:'../config/dataTranslate',
		startupConfig:'../config/controlsConfig',
		systemAddons:'core/ui/systemAddons',
		printControl:'core/ui/printControl',
		denueControl:'core/ui/widgets/dinamicPanel/denue/denue',
		routingControl:'core/ui/widgets/dinamicPanel/routing/routing',
        dinamicPanel:'core/ui/widgets/dinamicPanel/jquery.ui.dinamicPanel',
		dinamicPanelPath:'core/ui/widgets/dinamicPanel/',
		floatingLegend:'core/ui/widgets/floatingLegend/jquery.ui.floatingLegend',
        layerManager:'core/ui/widgets/layerManager/jquery.ui.layerManager',
        layerDisplay:'core/ui/widgets/layerDisplay/jquery.ui.layerDisplay',
		timeLine:'core/ui/widgets/timeLine/jquery.ui.timeLine',
		ecoTool:'core/ui/widgets/ecoTool/jquery.ui.ecoTool',
		infoCard:'core/ui/widgets/infoCard/jquery.ui.infoCard',
        customAutocomplete:'core/ui/widgets/autocomplete/jquery.ui.customAutocomplete',
        smartDataTable:'core/ui/widgets/smartDataTable/jquery.ui.smartDataTable',
        scaleControl:'core/ui/widgets/scaleControl/jquery.ui.scaleControl',
		toolBar:'core/ui/widgets/toolBar/jquery.ui.toolBar',
		baseMapMini:'core/ui/widgets/baseMapMini/jquery.ui.baseMapMini',
        notification:'core/ui/widgets/notification/notification',
        
        lightGallery:'core/ui/widgets/lightGallery/jquery.ui.lightGallery',
        
        fancyBox:'core/ui/widgets/fancyBox/jquery.fancybox',
        
        optionalPanel:'core/ui/widgets/panel/panel',
		georeferenceAddress:'core/ui/widgets/georeferenceAddress/georeferenceAddress',
		recordCard:'core/ui/widgets/recordCard/recordCard',
		detailCluster:'core/ui/widgets/detailCluster/detailCluster',
		networkLink:'core/ui/widgets/networkLink/networkLink',
		modules:'core/ui/modules',
		toolsConfig:'../config/toolsConfig',
		tracking:'core/ui/widgets/tracking/jquery.ui.tracking',
		trackingInfo:'core/ui/widgets/trackingInfo/jquery.ui.trackingInfo',
		helper:'core/ui/widgets/helper/helper',
		helperLabels:'core/ui/widgets/helper/labels',
		startUp:'core/ui/startUp',
		share:'core/ui/modules/share/share',
		support:'core/ui/widgets/support/support',
		menuDownload:'core/ui/modules/menuDownload/menuDownload',
		mapDownload:'core/ui/modules/mapDownload/mapDownload',
		sakbe:'core/ui/modules/sakbe/sakbe'
    },
    shim:{
        dinamicPanel:{
            exports:'dinamicPanel',
            deps:['fancyBox','lightGallery','optionalPanel','dp_translate','georeferenceAddress']
            },
		floatingLegend:{exports:'floatingLegend'},
		layerManager:{exports:'layerManager'},
		layerDisplay:{exports:'layerDisplay'},
		timeLine:{exports:'timeLine'},
		ecoTool:{exports:'ecoTool'},
		infoCard:{exports:'infoCard'},
		customAutocomplete:{exports:'customAutocomplete'},
		smartDataTable:{exports:'smartDataTable'},
		scaleControl:{exports:'scaleControl'},
		toolBar:{exports:'toolBar'},
		lightGallery:{exports:'lightGallery'},
		fancyBox:{exports:'fancyBox'},
		optionalPanel:{exports:'optionalPanel'},
		georeferenceAddress:{exports:'georeferenceAddress'},
		recordCard:{exports:'recordCard'},
		detailCluster:{exports:'detailCluster'},
		networkLink:{exports:'networkLink'},
		tracking:{exports:'tracking'},
		trackingInfo:{exports:'trackingInfo'},
		helper:{exports:'helper'}
    }
});

define([
	'dataSource',
	'mapConfig',
	'toolsConfig',
	'startUp',
	'share',
	'iconRouter',
	'startupConfig',
	'systemAddons',
	'printControl',
	'denueControl',
	'routingControl',
	'dinamicPanel',
	'floatingLegend',
	'dp_translate',
	'layerManager',
	'layerDisplay',
	'timeLine',
	'ecoTool',
	'infoCard',
	'tree',
	'customAutocomplete',
	'smartDataTable',
	'scaleControl',
	'toolBar',
	'optionalPanel',
	'baseMapMini',
	'georeferenceAddress',
	'recordCard',
	'detailCluster',
	'tracking',
	'trackingInfo',
	'helper',
	'support',
	'menuDownload',
	'mapDownload',
	'sakbe'
	],function(
	dataSource,
	mapConfig,
	toolsConfig,
	startUp,
	share,
	iconRouter,
	controls,
	systemAddons,
	printControl,
	denueControl,
	routingControl,
	dinamicPanel,
	floatingLegend,
	dp_translate,
	layerManager,
	layerDisplay,
	timeLine,
	ecoTool,
	infoCard,
	tree,
	customAutocomplete,
	smartDataTable,
	scaleControl,
	toolBar,
	optionalPanel,
	baseMapMini,
	georeferenceAddress,
	recordCard,
	detailCluster,
	tracking,
	trackingInfo,
	helper,
	support,
	menuDownload,
	mapDownload,
	sakbe
){
	systemAddons.init();
	//agrega Listado de elementos a modulos
	denueControl.loadData(toolsConfig.denue);
	routingControl.loadData(toolsConfig.routing);
	//conecta el evento de click en capas con la creacion de las mismas en el administrador
	denueControl.clickOnLayer = function(layer){
		$("#layersDisplay").layerDisplay('createNewLayer',layer);	
	};
	denueControl.getLayer = function(idLayer){
		return $("#layersDisplay").layerDisplay('getLayer',idLayer);	
	};
	
    //ajustes de despliegues
    // API------------------------------------------------
    MDM6API.layers ={
			    		events:{
			    			onActiveLayer:function(evt){
			    				if ($.isFunction(evt)){
			    					evt();
			    					}
			    			},
			    			onDeactiveLayer:function(evt){
			    				if ($.isFunction(evt)){
			    					evt();
			    					}
			    			}	
			    		},
			    		methods:{
				    		switchMainList:function(){$("#layersDisplay").layerDisplay('switchMainList');},
				    		switchList:function(){},
				    		getLayers:function(){return$.extend({},tree.layers.groups);},
				    		getActiveLayers:function(){$("#layersDisplay").layerDisplay('getActiveLayers');},
				    		getBaseLayers:function(){$("#mdm6Layers").layerManager('getBaseLayers');}
			    		},
						list:tree
			    	};
	
	MDM6API.legend ={
    					methods:{
    						refresh:function(){$("#mdm6DinamicPanel").dinamicPanel('refreshLegend');}
    					}	
    				};	
	
	MDM6API.ui = {};
	MDM6API.ui.gallery ={ 
					methods:{
						showGallery:function(data){$("#mdm6DinamicPanel").dinamicPanel('showGallery',data);}
					}
			};
    
    var refreshMapLayers = function(map){
		var layers = $("#layersDisplay").layerDisplay('getActiveLayers');
		//carga de capas activas desde el inicio
		for (var x in layers){
			var layer = layers[x];
			var params = [{id:layer.idLayer,active:true,group:layer.idGroup}];
			MDM6API.layers.events.onActiveLayer(layer,$("#layersDisplay").layerDisplay('getLayers'));
			map.statusLayer(params);
			setTimeout(function(){
				$("#mdm6DinamicPanel").dinamicPanel('refreshLegend');
			},800);
		}	
	}
    
    
    var init = function(map){
		MDM6API.mapCore = map;
		printControl.init(dataSource,tree,map);  //despues de cargar las capas buscables
		printControl.getLegends(
				function(){
							var leg = $("#mdm6DinamicPanel").dinamicPanel('getLegendList');
							return  leg;
						  }
				);
		printControl.getCurrentFeatures = function(){
			return $("#mdm6DinamicPanel").dinamicPanel('getAllFeatures');
	};		
	
	var baseUrl = ((typeof apiUrl!=='undefined')?((apiUrl)?apiUrl:''):'');
        MDM6('load','css');
		$.when(
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/dinamicPanel/jquery.ui.dinamicPanel.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/dinamicPanel/panelForms.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/dinamicPanel/sprites.css'+'?ver='+mdmVersion}).appendTo('head'),
				
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/floatingLegend/jquery.ui.floatingLegend.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/floatingLegend/sprite.css'+'?ver='+mdmVersion}).appendTo('head'),
				
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/layerManager/jquery.ui.layerManager.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/layerManager/sprite.css'+'?ver='+mdmVersion}).appendTo('head'),
				
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/timeLine/jquery.ui.timeLine.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/timeLine/timeline-sprite.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/timeLine/effects.css'+'?ver='+mdmVersion}).appendTo('head'),
				
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/ecoTool/jquery.ui.ecoTool.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/infoCard/jquery.ui.infoCard.css'+'?ver='+mdmVersion}).appendTo('head'),
				
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/layerDisplay/jquery.ui.layerDisplay.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/layerDisplay/icons.css'+'?ver='+mdmVersion}).appendTo('head'),
				
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/baseMapMini/jquery.ui.baseMapMini.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/autocomplete/jquery.ui.customAutocomplete.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/smartDataTable/jquery.ui.smartDataTable.css'+'?ver='+mdmVersion}).appendTo('head'),
				
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/scaleControl/jquery.ui.scaleControl.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/scaleControl/scaleControl-sprite.css'+'?ver='+mdmVersion}).appendTo('head'),
				
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/toolBar/jquery.ui.toolBar.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/toolBar/mdm-toolBar.css'+'?ver='+mdmVersion}).appendTo('head'),
				
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/baseMapMini/jquery.ui.baseMapMini.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/tooltip/jquery.ui.tooltip.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/lightGallery/jquery.ui.lightGallery.css'+'?ver='+mdmVersion}).appendTo('head'),
				
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/fancyBox/jquery.fancybox.css?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/fancyBox/helpers/jquery.fancybox-buttons.css?ver='+mdmVersion}).appendTo('head'),
				
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/panel/panel.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/networkLink/networkLink.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/recordCard/recordCard.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/detailCluster/detailCluster.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/georeferenceAddress/georeferenceAddress.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/tracking/css/jquery.ui.tracking.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/trackingInfo/css/jquery.ui.trackingInfo.css'+'?ver='+mdmVersion}).appendTo('head'),
				
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/detailCluster/template.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/recordCard/template.css'+'?ver='+mdmVersion}).appendTo('head'),
				
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/helper/helper.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/helper/template.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/widgets/support/support.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/modules/menuDownload/menuDownload.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href: baseUrl+'js/core/ui/modules/mapDownload/mapDownload.css'+'?ver='+mdmVersion}).appendTo('head'),
				
				$.Deferred(function( deferred ){
					$( deferred.resolve );
				})
			).done(function(){
				
				
				map.idSession = $.fn.createIdSession();
				map.proyName = dataSource.proyName;
				map.serviceVersion = dataSource.servicesVersion;
				//IsMobile
				var isMobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));  
				
				//Local Manage-------------------------------------------------------------------------------
				var layerAdmin={
						activateLayer:function(layer){
							var params = [{id:layer.idLayer,active:true,group:layer.idGroup}];
							MDM6API.layers.events.onActiveLayer(layer,$("#layersDisplay").layerDisplay('getLayers'));
							map.statusLayer(params);
							setTimeout(function(){
							$("#mdm6DinamicPanel").dinamicPanel('refreshLegend');
							},800);
						},
						deActivateLayer:function(layer){
							var params = [{id:layer.idLayer,active:false,group:layer.idGroup}];
							MDM6API.layers.events.onDeactiveLayer(layer,$("#layersDisplay").layerDisplay('getLayers'));
							map.statusLayer(params);
							setTimeout(function(){
							$("#mdm6DinamicPanel").dinamicPanel('refreshLegend');
							},800);
						},
				}
				
				//------------------------------------------------------------------------------
				var cadena = '<div id="mdmTimeLine"></div><div id="mdm6DinamicPanel"></div><div id="mdm6Layers"></div><div id="scaleControl"></div><div id="baseMapMini" style="display:none"></div><div id="mdmToolBar"></div><div id="floatingLegend"></div>';
				$("#panel-center").append(cadena);
					//********************************************DESPUES DE INICIAR MODULO DE ARRANQUE *********************/
					//despues de iniciar valores
				startUp.afterInit = function(){
						var defaultLayers = [];//['c100','c101','c102'];
						var layers = $.extend({},tree.layers.groups);
						
						for (var x in defaultLayers){
							var layer = defaultLayers[x];
							for (var i in layers){
								if (!(layers[i].layers[layer] === undefined)){
									var idLayer = layer;
									layer = layers[i].layers[defaultLayers[x]];
									layer.idGroup = i;
									layer.idLayer = idLayer;
									defaultLayers[x] = layer;
									break;
								}
							}
						}
						//Sakbe API
						sakbe.init(map,toolsConfig);
						//infoCard - economico
						var launchInfoCard = function(vars){
							$('#ecoInfoCard').remove();
							var cadena = '<div id="ecoInfoCard"></div>';
							$("#panel-center").append(cadena);
							$('#ecoInfoCard').infoCard({
								getGralValues:function(){
									return vars
								},
								getVarsData:function(){
									return	$('#ecoTool').ecoTool('getVarsData');
								},
								showVarInfo:function(id){
									$('#ecoTool').ecoTool('openDialogVar',id);
								},
								dataSources:toolsConfig.ecoTool.dataSources,
								printControl:printControl
								});
						}
						//EcoTool----------------------
						var launchEcoTool = function(map){
							if($('#ecoTool').attr('id') === undefined){
								var cadena = '<div id="ecoTool"></div>';
								$("#panel-center").append(cadena);
								var ecoConfig = toolsConfig.ecoTool;
								$('#ecoTool').ecoTool({noDataStrat:ecoConfig.specialStrats,colorRamps:ecoConfig.colorRamps,defaultData:ecoConfig.defaultData,edos:ecoConfig.edos,var_vals:ecoConfig.vars_vals,var_gs:ecoConfig.vars_gs,dataSource:ecoConfig.dataSources,
														getResolution:function(){
															return map.getResolution();
														},
														refreshLayer:function(data){
															if(data){
																var params = {'LAYERS':'d100,d101'}
																if(data.geo.id == '00'){
																	params['MAPAESTATAL'] = data.theme.id;
																	params['MAPAMUNICIPAL'] = 0;
																}else{
																	params['MAPAESTATAL'] = 0
																	params['MAPAMUNICIPAL'] = data.theme.id;
																}
																MDM6('setParams',{
																	layer:'Economico',
																	params:params
																	});
															}else{
																MDM6('setParams',{
																	layer:'Economico',
																	params:{forceRefresh:true}
																	});
															}
														},
														notInGeoArea:function(vars,pos){
															map.event.identify({lon:pos.lon,lat:pos.lat},true);
														},
														inGeoArea:function(vars,data){
															if($('#ecoInfoCard').attr('id')){
																$('#ecoInfoCard').infoCard('addGeo',data);
															}else{
																launchInfoCard(vars);
															}
														},
														onStart:function(){
															$("#mdm6Layers").layerManager('closeBottomCarrucel');
														},
														onClose:function(){
															MDM6('setParams',{
																layer:'Economico',
																params:{'LAYERS':'d100,d101','MAPAESTATAL':0,'MAPAMUNICIPAL':0}
																});
															if($('#ecoInfoCard').attr('id'))
																$('#ecoInfoCard').remove();
															
														},
														getExternalStatus:function(){
															var r = null;
															if($('#ecoInfoCard').attr('id')){
																r =  $('#ecoInfoCard').infoCard('getCurrentData');
															}
															return r;
														},
														onTransparency:function(data){
															MDM6('setOpacity','Economico',data/100);
														},
														extent:function(wkt){
															map.goCoords(wkt);	
														},
														systemMessage:function(msg){
															map.Notification({message:msg,time:3000});
															var dialog = '<div id="ecoNotification" title="Información">';
																dialog+= '	Ha cambiado el corte geográfico, se cambiará la selección de subsector o variable económica.';
																dialog+= '</div>';
																
															$('body').append(dialog);
															$('#ecoNotification').dialog({
																resizable:false,
																width:350,
																modal: true,
																height:250,
																buttons: {
																	"Aceptar": function() {
																	  $( this ).dialog( "close" );
																	}
																  }
																});
														}
													 });
							}
						};
						
						//ScaleControl
						$("#scaleControl").scaleControl({
							isMobile:isMobile,
							onZoomIn:function(){
								map.zoomIn(); 
							},
							onExtent:function(){
								map.extent(); 
							},
							onZoomOut:function(){
								map.zoomOut();
							},
							onGps:function(){
								 var eventos={
									Stop:function(){
										map.Tracking.event({action:'endTracking'});
									},
									byCar:function(){
										map.Tracking.event({action:'starSnap'});
									},
									Walking:function(){
										map.Tracking.event({action:'stopSnap'});
									}
									
								 }
								 map.Tracking.event({action:'starTracking',eventCatch:function(e){$("#map").tracking({data:e,controller:eventos});}});
							},
							onPos:function(){
								map.Tracking.event({action:'showPosition'})
							}
						});
						//Panel dinamico de busquedas
						$("#mdm6DinamicPanel").dinamicPanel({
							modules:[denueControl,routingControl],
							bufferLayers:tree.identificables,
							recurrentIdentify:defaultLayers,
							translateSearch:dp_translate.search,
							translateLayer:function(name){
								var layer = $('#mdmTimeLine').timeLine('convertlayer',name);
								return layer;
							},
							dataSource:dataSource,
							autocomplete:false,
							//translate_params:dp_translate.params,
							//translate_results:dp_translate.results,
							mapConfig:mapConfig,
							getActiveLayers:function(){
								var r = $("#layersDisplay").layerDisplay('getActiveLayers');
								return r;
							},
							getIcon:function(text){
							  return iconRouter.getIcon(text);  
							},
							getBaseLayers:function(){
							   return $("#mdm6Layers").layerManager('getBaseLayers');
							},
							onRefreshLegend:function(text){
								$('#floatingLegend').floatingLegend('changeContent',text);	
							},
							onLegendWindow:function(){
								$('#floatingLegend').floatingLegend('open');
							},
							map:map
						});
						amplify.subscribe( 'uiGallery', function(data){
							$("#mdm6DinamicPanel").dinamicPanel('showGallery',data);
						});
						//despliegue de leyendas
						$('#floatingLegend').floatingLegend();
						//manejador de capas
						$("#mdm6Layers").layerManager({
											   startTheme:map.bootTheme,
											   autoOpenBottomCarrucel:controls.ui.autoOpenThemeBar,
											   baseLayers:tree.baseLayers,
											   layers:tree.layers,
											   themeLayers:tree.themes,
											   timeLayers:[],
											   verSelection:function(id){
													map.setBaseLayer(id);
													$("#mdm6DinamicPanel").dinamicPanel('refreshLegend');
											   },
											   horSelection:function(layers){
												$("#layersDisplay").layerDisplay('setActiveLayers',layers);
												$("#mdm6DinamicPanel").dinamicPanel('refreshLegend');
											   },
											   openLayerSelected:function(){
													$("#layersDisplay").layerDisplay('switchShortList');
											   },
											   openLayerConf:function(){
													$("#layersDisplay").layerDisplay('switchMainList');
											   },												   
											   onOpenMiniMapBox:function(){
													$("#layersDisplay").layerDisplay('adjustMarginShortList');
											   },
											   onTimeBtn:function(){
													$('#mdmTimeLine').timeLine('show');											   
											   },
											   openHCarrucel:function(height){
												   var base = $('#mdm6Layers').height();
												   $('#mdmTimeLine').animate({'bottom':(height)+'px'});
											   },
											   closeHCarrucel:function(height){
												   var base = $('#mdm6Layers').height();
												   $('#mdmTimeLine').animate({'bottom':(base)+'px'},'fast');
											   }
						});
						//despliegue de capas
						var cadena = '<div id="layersDisplay"></div>';
						$("body").append(cadena);
						var defaultLayers = map.getActiveLayers();//[{id:'c102',group:'G5'},{id:'t102',group:'G5'},{id:'c110',group:'G5'},{id:'t700',group:'G5'}];
						
						$('#mdmTimeLine').timeLine({
								map:map,
								urlSlider:toolsConfig.timeLine.layers,
								layersList:tree.layers,
								getCurrentTransparency:function(){
									return $("#layersDisplay").layerDisplay('getTransparency');	
								},
								externalActivate:function(layer){
									$('#mdmTimeLine').timeLine('show');
									layerAdmin.activateLayer(layer);
								},
								externalDeactivate:function(layer){
									layerAdmin.deActivateLayer(layer);
								},
								internalDeactivate:function(layer){
									 $("#layersDisplay").layerDisplay('closeLayer',layer);
								},
								onTimePlayerOpen:function(){
									$("#mdm6Layers").hide();
									$("#scaleControl").hide();
									$("#mdm6DinamicPanel").hide();	
									$("#mdmToolBar").hide();
									$('#floatingLegend').floatingLegend('bringToFront');	
								},
								onTimePlayerClose:function(){
									if ((controls.ui.layersBar)){
										$("#mdm6Layers").show();
									}
										
									$("#scaleControl").show();
									$("#mdm6DinamicPanel").show();	
									$("#mdmToolBar").show();
									$('#floatingLegend').floatingLegend('sendToNormalPosition');	
								},
								onTimeout:function(text){
									map.Notification({message:text,time:3000});	
								}
							}).css('bottom','29px');
						
						$("#layersDisplay").layerDisplay({layers:tree.layers.groups,map:map,
										 dataSource:dataSource,
										 //defaultLayers:defaultLayers,
										 onResetActiveStatus:function(){
											$('#mdmTimeLine').timeLine('resetActiveStatus'); 
										 },
										 onActiveLayer:function(layer){
												var isTime = layer.time;
												var special = layer.specialLayer;
												if(!isTime){
													layerAdmin.activateLayer(layer);
												}else{
													$('#mdmTimeLine').timeLine('activateLayer',layer.idLayer);	
												}
												if(special && special == 'Economico'){
													launchEcoTool(map);
												}
												setTimeout(function(){
													amplify.publish( 'onActiveLayer');
												},100);
											},
										 onDeactiveLayer:function(layer){
												var isTime = layer.time;
												var special = layer.specialLayer;
												if(!isTime){
													layerAdmin.deActivateLayer(layer);
												}else{
													$('#mdmTimeLine').timeLine('deactivateLayer',layer.idLayer);		
												}
												if(special && special == 'Economico'){
													$('#ecoTool').remove();	
												}
												setTimeout(function(){
													amplify.publish( 'onDeactiveLayer');
												},100);
											},
										 onThemeLayers:function(layers){
											map.Tree.event.reset();
											if (layers != false && layers.length > 0){
												var tLayers = [];
												for (var x in layers){
													var layer = layers[x];
													var isTime = layer.time;
													if(!isTime){
														tLayers.push({id:layer.idLayer,active:true,group:layer.idGroup});
													}else{
														$('#mdmTimeLine').timeLine('activateLayer',layer.idLayer);		
													}
												}
												map.statusLayer(tLayers);
												setTimeout(function(){
													amplify.publish( 'onActiveLayer');
												},100);
											}
											$("#mdm6DinamicPanel").dinamicPanel('refreshLegend');
										 },
										 onSetScale:function(scale){
											map.zoomToLayer(scale);
										 },
										 onChangeOpacity:function(val){
											map.changeOpacity(val);
										 },
										 getBottomMargin:function(){
											return $("#mdm6Layers").layerManager('miniMapBoxHeight');
										 },
										 onRefreshLists:function(data){
											var sum = data.layers.length+data.services.length+data.outlayers.length;
											$('#mdm6Layers_layerManager_btnLayers2').attr('empty',(sum == 0));
										 },
										 saveStats:function(data){
											saveStats(data);	 
										 }
										 });
							
							
							$('#mdmToolBar').toolBar({
								onAction:function(id){
										switch (id){
											case 'contact': 
												$('.headerBackground').support();
											break;
											case 'share': 
												share.share();
											break;
											case 'print': 
												printControl.printMap();
											break;
											case 'download': 
												$('#panel-center').menuDownload({
														items:[
																{item:'denue',event:function(){
																	denueControl.download();	
																}},
																{item:'mapa',event:function(){
																	$('#panel-center').menuMapDownload();
																}}
															]
												});
												
												/*var tool = toolsConfig.toolBar.download;
												var res = map.getResolution();
												var func = tool.call;
												if($.isFunction){
													func(res);
												}*/
											break;	
										}
								}
							});
		//---------------------------- Activacion selectiva de elementos de interfaz -------------------
							if (!(controls.ui.layersBar)){
								 $("#mdm6Layers").css('display','none');	
							}
							if (controls.ui.miniBaseMap){
								$('#baseMapMini').css('display','');
								$('#baseMapMini').baseMapMini({
									data:tree.baseLayers,imgPath:'img/mapaBase',
									baseSelection:function(id){
										map.setBaseLayer(id);
										$("#mdm6DinamicPanel").dinamicPanel('refreshLegend');
								}
							});
						}
			
					//----------------------------Registro de eventos involucrados con interfaz-------------------
						
						MDM6('define','onMoveEnd',function(){
							$("#mdm6DinamicPanel").dinamicPanel('externalEvent','mapChange');
							amplify.publish( 'onMoveEnd');
						});
						
						amplify.subscribe( 'mapReload', function(){
							var mapScale = map.getScale();
							$("#layersDisplay").layerDisplay('setZoomIcon',mapScale);
						});
						
						amplify.subscribe( 'onActiveLayer', function(){
						});
						amplify.subscribe( 'onDeactiveLayer', function(){
						});
						
						amplify.subscribe( "identifyEconomic",function(data){
							if ($('#ecoTool').attr('id')){
								$('#ecoTool').ecoTool('checkPoint',data);
							}else{
								map.event.identify({lon:data.lon,lat:data.lat},true);
							}
						});
						
						MDM6('define','privateSearch',function(text,func){
							$("#mdm6DinamicPanel").dinamicPanel('privateSearch',{text:text,func:func});
						});
						
						map.loadOverview('B1','mdm6Layers_miniMap');
						$('#mdm6DinamicPanel_inputSearch').focus();
						//map.event.setEventIdentify(function(data){
						map.event.setEventIdentify(function(data){
							$("#mdm6DinamicPanel").dinamicPanel('identifyPoint',data);    
						});
						refreshMapLayers(map);
						
			} //After init vals
			//********************************************FIN MODULO DE ARRANQUE **************************/												 
			amplify.subscribe( 'mapAfterLoad', function(){
				startUp.onMapLoad();
			});
			amplify.subscribe( 'whatsHere', function(data){
				denueControl.eventListener({id:'whatshere',value:data});
			});
			amplify.subscribe( 'layerDisplaySpinner', function(data){
				$("#layersDisplay").layerDisplay('controlSpinner',data);
			});
			//startup control
			share.init(map,dataSource);
			//startup control
			startUp.loadFromShare = function(link){
				share.getValuesFromShare(link,startUp.activeUrlLayers);		
			}
			startUp.loadShareValues = function(link){
				share.loadShareValues();		
			}
			startUp.init(map,tree,dataSource);	
			
			
			
		});
        
    };
    return {init:init};
});