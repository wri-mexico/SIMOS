var GeoRss;var Route;var getLonlat;
var demoTraking = null;
var altitude=false;
var wmsR;
define(['OpenLayers','config','mapControls','mapStyles','tree','mapLayers','mapTree','features','wps','marker','popup','georeference','linetime','poi','notification','escuelas','modal','help','request','tutorial','thirdService','geolocation','cluster','dataSource','routing','toolsConfig','printControl'],function(OL,config,ctl,mapStyle,tree,Layer,Tree,Features,wps,Marker,Popup,Georeference,LineTime,Poi,Notification,Escuelas,Modal,Help,Request,Tutorial,TS,Geolocation,Cluster,DataSource,Routing,toolsConfig,printControl) {
    var Base;
    var Prueba = null;
    var re = config.mapConfig.restrictedExtent;
    var e = config.mapConfig.initialExtent;
    var defineIndexLayers = function(){
        for(x in Map.Layers){
            var layer = Map.Layers[x];
            if(!layer.isBaseLayer){
                   Map.map.setLayerIndex(layer,layer.position);
            }
        }
    };
    var Map={
        Layers:{},
        Ov:{
            ctl:null,
            layers:[],
            id:'mdm6Layers_miniMap'
        },
        map:null,
        projection:{
            used:config.mapConfig.projection,
            base:'EPSG:900913'
        },
        extent:new OL.Bounds(e.lon[0],e.lon[1], e.lat[0],e.lat[1]),
        restrictedExtent:new OL.Bounds(re.lon[0],re.lon[1], re.lat[0],re.lat[1]),
        controls:{},
        loaded:false,
        factorZoom:0.001,
        render:null,
        addLayer:null,
        getLayer:null,
        onMap:false,
        onFeature:false,
        activeControl:null,
        getExtent:null,
	getResolution:null,
        setParamsToLayer:null,
        transformToMercator:null,
	transformToGeographic:null,
	updatesize:null,
	getWidth:null,
	getParamFromUrl:null,
	setOpacity:null,
	setIndex:null,
	getOverlays:null,
	goCoords:null,
	cluster:{active:false,moreLevels:false,recordCardOnCluster:false,onlyDisplayRecordCard:false,geometry:false,whatshere:false},
	economic:false,
    enableAditionalDenue:null
    };
    var initialOLDefinitions = function(){
        OL.Util.onImageLoadErrorColor = "transparent";
        defineRender();
    };
    var getScale = function(){
	//var scale = Math.floor(Map.map.getScale());
	var scale = (Map.map.getZoom()+1);
        return scale; 
    };
    var getscale = function(){
	var scale = Math.floor(Map.map.getScale());
	//var scale = (Map.map.getZoom()+1);
        return scale; 
    };
    var zoomToLayer = function(){
        var a  = arguments;
        //Map.map.zoomToScale(a[0]);
	Map.map.zoomTo(parseInt(a[0])-1);
	
    };
    var getOverlays=function(){
	var couter=0;
	for(var x in Map.Layers){
	    var l = Map.Layers[x];
	    if(!l.isBaseLayer){
		couter+=1;
	    }
	}
	return couter-4;
    }
    Map.getOverlays = getOverlays;
    var getPxFromLonlat = function(lon,lat){
	return Base.getViewPortPxFromLonLat({lon:lon,lat:lat});
    }
    var getQueryString = function () {
	var query_string = null;
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	if(vars!=''){
	    query_string = {};
	    for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		    
		if (typeof query_string[pair[0]] === "undefined") {
		  query_string[pair[0]] = pair[1];
		    
		} else if (typeof query_string[pair[0]] === "string") {
		  var arr = [ query_string[pair[0]], pair[1] ];
		  query_string[pair[0]] = arr;
		    
		} else {
		  query_string[pair[0]].push(pair[1]);
		}
	    } 
	}
	  return query_string;
    }
    var starLine = function(id,lon,lat){
	var point = getPxFromLonlat(lon,lat)
	var item = $("#"+id);
	var offset = item.offset();
	var pos = {x:(item.width())+offset.left,y:offset.top+(item.height()/2)}
	var points = [{x: pos.x, y: pos.y}, {x: point.x, y: point.y+55}]
		
	var svgContainer = d3.select("#demo").append("svg:svg")
		    .attr("width",$('body').width())
		    .attr("height",$('body').height())
		    
		    
		svgContainer.append("svg:g")
		    .attr("id","g-1")
     
		var line = d3.svg.line()
		    .x(function(d) { return d.x; })
		    .y(function(d) { return d.y; })
		    .interpolate("cardinal")
		    .tension(0);
		
		d3.select("#g-1").append("svg:path").attr("d", line(points)).attr("id", "myPath");
		
		var myPoint = points[points.length-1];
		
		d3.select("#g-1").append("svg:circle")
				.attr("cx", myPoint.x)
				.attr("cy", myPoint.y)
				.attr("r", 4);
				
    }

    var loadOverview = function(i,s){
        if(!s){
            s = Map.Ov.id;
        }
        var m = Map.projection;
        var re = Map.restrictedExtent.clone();
        if(Map.Ov.ctl){
            Map.Ov.ctl.destroy();
        }
        var template = Layer.buildLayer(x,tree.baseLayers[i],true);
        var layer = Layer.getNewLayer(template);
        var c = config.mapConfig;
        var options = {
            numZoomLevels: 3,
            projection: Map.projection.base,
            resolutions:[78271.516953125,19567.87923828125,4891.969809375,2445.9849046875,1222.99245234375] 
            //maxExtent: re.transform(m.used,m.base)
        };
        Map.Ov.ctl = new OL.Control.OverviewMap({
            layers:[layer],
            'div': OpenLayers.Util.getElement(s),
            mapOptions: options
        });
	//console.log(Map.Ov.ctl);
	//Map.Ov.ctl.size = new OL.Size(190,112);
        Map.map.addControl(Map.Ov.ctl);
	//$(".olControlOverviewMapElement").css({top:"0px",left:"0px",right:"0px",bottom:"0px",position:"relative"});
        $(".olControlOverviewMapElement").children().css({width:'100%',height:'100%'});
        
    };
    MDM6('define','updateOverview',function(){
	    loadOverview(Map.map.baseLayer.name);
    });
    
    var setVectorial = function(type){
        var c = config.mapConfig;
        var nameLayer = 'Vectorial';
        var url = (type=='vectorial')? c.layers[0].url:c.layers[0].alternativeUrl;
        var layer = getLayer(nameLayer);
        if(layer){
	    if(layer.visibility){
		layer.url = url;
		setParamsToLayer({
		    layer:nameLayer,
		    params:{}
		});
	    }
        }
    };
    
    var setBaseLayer = function(i){
        var layer = getLayer(i);
        if(layer){
            Map.map.setBaseLayer(layer);
            setVectorial(layer.clasification);
            loadOverview(i);
            inserCopyRights(tree.baseLayers[layer.name].rights);
            if(layer.name=='B8'){
                setParamsToLayer({
                    layer:'B8',
                    params:{time: '2013-10-10'}
                });
            }
	    if($("#menu_download").attr('id')){
		var img = tree.baseLayers[layer.name].img;
		$('#panel-center').menuDownload({mapImage:img});
	    }
        }
    };
    
    var addEvents = function(item){
        
        var events = item.item.events;
        for(x in item.events){
            events.register(x,item.item,item.events[x]);
        }
        
    };
    
    var inserCopyRights = function(){
        var a = arguments[0];
        var r = $('.copyRights');
        if(r.attr('class')){
            r.html(a);
        }else{
            var cadena = '<div class="containerCopyRights"><div class="copyRights" align="center">'+a+'</div></div>';
	    cadena +='<div id="bottom_messages" align="center">&nbsp;</div>';
            $("#panel-center").append(cadena);
        }
    };
    var coordinatesMap={lon:0,lat:0};
    var getListenersMap = function(){
        
        var listeners = {
                "mouseover":function(){
                    Map.onMap = true;
                },
                "mouseout":function(){
                    Map.onMap=false;
                   if(!Features.isClusterActive()){
                        Popup.clear();
                   }
                },
                "moveend": function(){
                   
                    //LineTime.setMovedMap(true);
                    //LineTime.execute();
                    var cluster = getLayer('Cluster');
                    if(cluster){
                        //Cluster.execute();
                    }
                    MDM6('onMoveEnd');
                    amplify.publish( 'hideTutorialDenue');
                    amplify.publish( 'hideTutorialCE');
                },
                "move":function(){
                    //var cluster = getLayer('Cluster');
                    //if(cluster){
                    //    cluster.setVisibility(false);
                    //}
                    if(Features.isClusterActive()){
                        Features.deactivateCluster();
                        Popup.clear();
                   }
		   Cluster.clear();
                },
                "zoomend": function(){
		    var lastResolution = getLasResolution();
		    var resolution = getResolution();
		    if(resolution>=lastResolution){
			try{
			    amplify.publish('mapReload');
			}catch(e){}
			var cluster = getLayer('Cluster');
			if(cluster){
			    //Cluster.execute();
			}
			MDM6('onZoomEnd');
			enableClusters();
			
		    }else{
		    
			setTimeout(function(){
			    Map.map.zoomTo(14);
			},1000);
			
			
		    }
		    amplify.publish( 'hideTutorialDenue');
            amplify.publish( 'hideTutorialCE');
                },
                "mousemove":function(e){
                    var i = Features.reg.selected;
                    var ctl = Features.controls.Editor;
                    if(i.id){
                                var valid = ((i.item=='feature')||(i.item=='point'))?true:false;
				if((Map.onMap)&&(valid)&&(ctl.active==null)){
                                 
                                       // if(i.item!='point'){
                                       //     Popup.clear();
                                       // }
                                        var event = function(){
                                            Features.showInfo();
                                        }
					
                                        Popup.defineTimer(event);
				}
				
		    }
		    if((Map.cluster.active)&&(Map.cluster.geometry)){
			try{
			    var resolution = Map.map.getResolution();
			    if(resolution<4891.969809375){
				var xy = Map.map.controls[1].lastXy;
				var coords = Map.map.getLonLatFromPixel(new OL.Pixel(xy.x, xy.y));
				var wkt = 'POINT('+coords.lon+' '+coords.lat+')';
				Cluster.showGeometry({wkt:wkt,resolution:getResolution(),time:1000});
			    }
			}catch(e){}
			
		    }
		    if(Map.onMap){
			var xy = Map.map.controls[1].lastXy;
			if(xy){
			    var coords = Map.map.getLonLatFromPixel(new OL.Pixel(xy.x, xy.y));
			    if((coordinatesMap.lon!=coords.lon)&&(coordinatesMap.lat!=coords.lat)){
				coordinatesMap.lon = coords.lon;
				coordinatesMap.lat = coords.lat;
				if(clockAltitude){
				    clearTimeout(clockAltitude);
				}
				clockAltitude = setTimeout(function(){
				    requestAltitude.setParams(JSON.stringify({x:coords.lon,y:coords.lat}));
				    requestAltitude.execute();
				},500);
				
			    }
			    
			}
		    }
                },
                "updatesize":function(){
                    Popup.resetLimits();
                }
            }
        return listeners;
    };
    getformatNumber = function(nStr){
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		//alert('antes');
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
    };
    var insertBaseLayers = function(){
        var c = config.mapConfig;
        
        for(x in tree.baseLayers){
            var valid = true;
            try{
                var i = tree.baseLayers[x];
                var template = Layer.buildLayer(x,i);
                if(i.type=='Wms'){
                    template.params['transitionEffect']='resize';
                }
                if(template.type=='Google'){
                    if(typeof google === "undefined"){
                        valid=!valid;
                        Notification.show({message:'El servicio de Google no esta disponible',time:5000});
                    }
                }
                template.clasification= (i.clasification)?i.clasification.toLowerCase():'vectorial';
            }catch(e){
                valid=false;
            }
                if(valid){
                    addLayer(template);
                    if (template.type=='Google') {
                         Map.map.layers[Map.map.layers.length-1].mapObject.setTilt(0);
                    }
                   
                }
            //}catch(e){}
        }
        //console.log(Map.Layers);
    };
    
    var addLayer = function(p){
        if(!Map.Layers[p.type]){
            var isBase=false;
            try{isBase=(p.isBase)?true:false;}catch(e){}
            var properties= Layer.getParamsLayer(p.info);
            var newLayer = Layer.getNewLayer(p);
            newLayer.clasification = p.clasification;
            newLayer.isBaseLayer = isBase;
            newLayer['position']=(isBase)?0:p.position;
            var Name = (p.name)?p.name:properties.name;
            Map.Layers["'"+Name+"'"]=newLayer;
            Map.map.addLayer(newLayer);
        }else{
            /*
            setParamsToLayer({
                layer:p.,
                params:
            });
            */
        }
        defineIndexLayers();
    };
    var addGeorss = function(name,value,params){
	var newl = new OL.Layer.GeoRSS(name, value,params);
	Map.map.addLayer(newl);
	Map.Layers["'"+name+"'"]=newl;
    }
    Map.addLayer = addLayer;
    
    var updateSize = function(){
	Map.map.updateSize();
    };
    var getExtent = function(){
        var a = arguments[0];
        var m = Map.projection;
        var newProj = (a=='geographic')?m.used:m.base;
        var e = Map.map.getExtent();
        var lon = new OL.LonLat(e.left,e.bottom).transform(m.base,newProj);
        var lat = new OL.LonLat(e.right,e.top).transform(m.base,newProj);
        return {lon:[lon.lon,lon.lat],lat:[lat.lon,lat.lat]};
    };
    var getLasResolution=function(){
	var res = config.mapConfig.resolutions[config.mapConfig.resolutions.length-1];
	res = res+'';
	var cadena = res.split('.');
	var a = '';
	for(var x in cadena[1]){
	    var c = cadena[1][x];
	    if(x<=8){
		a+=c;
	    }
	}
	return parseFloat(cadena[0]+'.'+a);
    }
    var getResolution = function(){
	var res = Map.map.getResolution();
	res = res+'';
	var cadena = res.split('.');
	var a = '';
	for(var x in cadena[1]){
	    var c = cadena[1][x];
	    if(x<=8){
		a+=c;
	    }
	}
	return parseFloat(cadena[0]+'.'+a);
    }
    Map.getResolution = getResolution;
    var transformToDegrees = function(lon,lat){
        var lonlat = transformToGeographic(lon,lat);
        var Lon = ctl.transformToDegrees(lonlat.lon.toFixed(5))+ 'W';
        var Lat = ctl.transformToDegrees(lonlat.lat.toFixed(5))+ 'N';
        return {lon:Lon,lat:Lat};
    };
    var transformToGeographic = function(lon,lat){
        var m = Map.projection;
        var point = new OL.LonLat(lon,lat).transform(m.base,m.used);
        return {lon:point.lon,lat:point.lat};
    };
    Map.transformToGeographic = transformToGeographic;
    var transformToMercator = function(lon,lat){
        var m = Map.projection;
        var point = new OL.LonLat(lon,lat).transform(m.used,m.base);
        return {lon:point.lon,lat:point.lat};
    };
    Map.transformToMercator = transformToMercator;
    Map.getExtent = getExtent;
    var getWidth = function(){
        var width=0;
        var extent = Map.map.getExtent().toBBOX();
	extent = extent.split(',');
        //var point = transformToGeographic(parseFloat(extent[0]),parseFloat(extent[2]));
        //var width =  (Math.abs(point.lon-point.lat))/parseFloat($("#map").width());
        var width =  (Math.abs(parseFloat(extent[0])-parseFloat(extent[2])))/parseFloat($("#map").width());
        return width;
    };
    Map.getWidth = getWidth;
    var extentMap = function(){
        goCoords(Map.extent);
    };
    var zoomIn = function(){
        Map.map.zoomIn();
    };
    var zoomOut = function(){
        Map.map.zoomOut();
    };
    var setRestrictedExtent=function(newExtent){
        var m = Map.projection;
        var cloneExtent = newExtent.clone();
        Map.map.setOptions({restrictedExtent: cloneExtent.transform(m.used,m.base)});
        var newResolution = Map.map.getResolution();
        Map.map.setOptions({minResolution:newResolution});
    };
    var getZoomLevel=function(){
	return (Map.map.getZoom())+1;
    };
    var redefineExtent = function(){
	var a = arguments;
	if(typeof(a[0]) == 'string'){
	    var response = Features.getFeatureFromWKT(a[0]);
	    var extent = response.bounds;
	}else{
	    var extent = new OL.Bounds(a[0],a[1],a[2],a[3]);
	}
	//if(Map.map.restrictedExtent == null) {
                Map.map.setOptions({restrictedExtent: extent});
        //    } else {
        //        Map.map.setOptions({restrictedExtent: null});
        //}
	//goCoords(extent);
	//setRestrictedExtent(extent);
	Map.map.zoomToExtent(extent);
	var actualResolution = Map.map.getResolution();
	setResolutions(actualResolution);
	
    };
    var mirrorCluster = function(){
	var height = $("#background_nodes").height();
	if(height){
	    var svg = $('#nodos').html();
	    var data = '<svg height="'+height+'" width="'+height+'"><circle cx="'+(height/2)+'" cy="'+(height/2)+'" r="'+(height/2)+'" fill="#131313"></circle></svg>';
	    canvg('background_nodes_mirror_canvas', data);
	    canvg('nodos_mirror_canvas', svg);
	    $("#background_nodes_mirror,#nodos_mirror").css("display","");
	    
	    var recorCardIconSvg = $("#circle_icon_svg").html();
	    if(recorCardIconSvg){
		canvg('circle_icon_mirror_canvas', recorCardIconSvg);
	    }
	}
    }
    var clearMirrorCluster = function(){
	$("#background_nodes_mirror,#nodos_mirror").css("display","none");
    }
    
    var enableExportMap = true;
    var exportNotification=null;
    var exportMap = function(format,aditionals){
	var hideDetailCluster = false;
	if(enableExportMap){
	    Marker.buildMirror();
	    mirrorCluster(); 
	    enableExportMap=false;
	    var element = (aditionals)?$("#content"):$('#main');
	    var items = $("#mdm6DinamicPanel,#mdm6Layers,#scaleControl,#baseMapMini,#mdmToolBar,.section_share,.more_info,.popup_close,#menu_mapDownload,#mdm6Layers_v_container,#background_nodes,#nodos,#floatingLegend");
	    if(exportNotification==null){
		if ((typeof aditionals != 'undefined')&&(aditionals!=null)){
		    exportNotification = Notification.show({message: 'Exportando itinerario...'});
		}else{
		    exportNotification = Notification.show({message: 'Exportando mapa...'});
		}
	    
	    }else{
		exportNotification.show();
	    }
		    if(Map.cluster.active){
			if($("#detailCluster").css('display')!='none'){
			    $("#detailCluster").hide();
			    hideDetailCluster=true;
			}
			
		    }
		    
		    items.css({display:'none'});
		    var ie = isExplorer();
		    html2canvas(element, {
			//"proxy": "js/proxyImage.php",
			"proxy":DataSource.files.download,
			//"logging": true, //Enable log (use Web Console for get Errors and Warnings)
			onrendered: function (canvas) {
				if ((typeof aditionals != 'undefined')&&(aditionals!=null)){
				    var imgData = canvas.toDataURL('image/'+format,1.0);
				    aditionals.event(imgData);
				}else{
				    if(format=='pdf'){
					var widthMap = parseFloat($("#map").width());
					var heightMap = parseFloat($("#map").height());
					var altoNew = (28*heightMap)/widthMap;
					
					var imgData = canvas.toDataURL('image/png',1.0);
					var doc = new jsPDF('l','cm','letter');
					doc.addImage(imgData, 'PNG',0,0, 28,altoNew);
					doc.save('mdm.pdf');
				    }else{
		    
					var img = $('<img>'); //Equivalent: $(document.createElement('img'))
					img.attr('src', canvas.toDataURL("image/"+format,1.0));
					
					var src = img.attr('src');
					
					if(!ie){
					    var a = $("<a>")
						.attr("href", src)
						.attr("download", "mdm."+format)
						.appendTo("body");
					    a[0].click();
					    a.remove();
					}
				    }
				    
				    if((ie)&&(format!='pdf')){
					 modalImage.show();
					$("#imageDownload").attr('src',"");
					$("#imageDownload").attr('src',canvas.toDataURL("image/"+format,1.0));
				    }
				}   
				    exportNotification.hide();
				    enableExportMap=true;
				    //alert("fin imagen");
				    
			}
		    });
		    
	    items.css({display:''});
	    if(hideDetailCluster){
			$("#detailCluster").show();
	    }
	    Marker.clearMirror();
	    clearMirrorCluster();
	}else{
	    Notification.show({message:'Actualmente esta generando una descarga espere hasta que finalize',time:3000});	
	}
    };
    var setResolutions = function(resolution){
	var c = config.mapConfig;
	var pos = c.resolutions.indexOf(resolution);
	console.log(resolution);
	if(pos!=-1){
	    var newResolutions=[];
	    newResolutions = $.extend(newResolutions,c.resolutions);
	    newResolutions = newResolutions.slice(pos,newResolutions.length);
	    console.log(newResolutions);
	    Map.map.setOptions({resolutions: newResolutions});
	}
	
    };
    
    var addCustomControls = function(){
        Map.controls = ctl.getCustom({'Poligonos':getLayer('Poligonos')},Map);
        for(x in Map.controls) {
                Map.map.addControl(Map.controls[x]);
        }
        addEventControls();
    };
    var getControl = function(name){
        return Map.controls[name];
    };
    
    var report = function(event) {
        //console.log(event.type, event.feature ? event.feature.id : event.components);
    };
    
    var addEventControls = function(){
        var idContainer = 'medidaG';
        
        addEvents({
            item:getControl('georeferencePolygon'),
            events:{
                activate:function(){
                    
                },
                deactivate:function(){
                    //eventDisableCtl.execute('measure');
                },
                measure:function(e){
                    if(e.measure>0){
                        Features.add({
                            wkt:e.geometry+'',
                            zoom:false,
                            store:true,
                            params:Features.getFormat('georeference','polygon')
                        });
                        Features.showGeoModal();
                    }else{
                        $("#mdm6DinamicPanel_geo_btnEndAction").click();
                    }
                },
                measurepartial:function(e){
                    
                }
            }   
        });
        
        addEvents({
            item:getControl('georeferenceLine'),
            events:{
                activate:function(){},
                deactivate:function(){
                    //eventDisableCtl.execute('measure');
                },
                measure:function(e){
                    if(e.measure>0){
                        Features.add({
                            wkt:e.geometry+'',
                            zoom:false,
                            store:true,
                            params:Features.getFormat('georeference','line')
                        });
                        Features.showGeoModal();
                    }else{
                        $("#mdm6DinamicPanel_geo_btnEndAction").click();
                    }
                },
                measurepartial:function(e){
                    
                }
            }   
        });
        
        addEvents({
            item:getControl('polygonH'),
            events:{
                activate:function(){},
                deactivate:function(){
                     eventDisableCtl.execute('buffer');
                },
                done:function(){/*console.log('done')*/},
                featureadded:function(e){
                    var params = Features.getFormat('buffer','polygon');
                    Features.addProperties(e.feature,params);
                    Features.setArguments(e.feature,params);
                    Features.addToReg(e.feature);
                    Features.added({id:e.feature.id,type:'buffer',data:{name:e.feature.custom.name,type:'polygon',measure:Features.getArea(e.feature,false)}});
                }
            }   
        });
        
        addEvents({
            item:getControl('measurePolygon'),
            events:{
                activate:function(){/*console.log('activado')*/},
                deactivate:function(){
                    eventDisableCtl.execute('measure');
                },
                measure:function(e){
                    if(e.measure>0){
                        Features.add({
                            wkt:e.geometry+'',
                            zoom:false,
			    store:true,
                            params:Features.getFormat('measure','polygon')
                        });
                    }else{
                        $("#mdm6DinamicPanel_measure_btnEndAction").click();
                    }
                },
                measurepartial:function(e){}
            }   
        });
        
        
        addEvents({
            item:getControl('measureLine'),
            events:{
                activate:function(){/*console.log('activado')*/},
                deactivate:function(){
                    eventDisableCtl.execute('measure');
                },
                measure:function(e){
                    if(e.measure>0){
                        Features.add({
                            wkt:e.geometry+'',
                            zoom:false,
                            store:true,
                            params:Features.getFormat('measure','line')
                        });
                    }else{
                        $("#mdm6DinamicPanel_measure_btnEndAction").click();
                    }
                },
                measurepartial:function(e){}
            }   
        });
       /*
        addEvents({
            item:getControl('polygonH'),
            events:{
                beforefeaturemodified: function(e){console.log('antes modificar')},
                featuremodified: report,
                afterfeaturemodified: report,
                vertexmodified: report,
                sketchmodified: report,
                sketchstarted: report,
                sketchcomplete: report,
                activate:function(){console.log('activado')},
                deactivate:function(){console.log('deactivado')},
                done:function(){console.log('done')},
                featureadded:function(e){console.log(e)}
            }   
        });
        */
        addEvents({
            item:getControl('identify'),
            events:{
                activate:function(){/*console.log('activado')*/},
                deactivate:function(){/*console.log('deactivado')*/}
            }   
        });
	addEvents({
            item:getControl('customPolygon'),
            events:{
                activate:function(){},
                deactivate:function(){
                    activeControl({control:'identify',active:true});
                },
                measure:function(e){
                    if(e.measure>0){
			var wkt = e.geometry+'';
			if(this.Event){
			    this.Event(wkt);
			}
			//MDM6('customTool','polygon',wkt);
                    }else{
                    }
                }
            }   
        });
        /*
        var selectedFeature = function(){
            var Ctl = Features.getCtls();
            var s = Ctl.Select;
            var h = Ctl.Hover;
            if(s.active){
                
            }
            if(h.active){
            }
        }
        
        addEvents({
            item:getLayer('Poligonos'),
            events:{
                featureselected:selectedFeature
            }
        });
        */
        
        
    };
    
    var defineRender = function(){
        var renderer = OL.Util.getParameters(window.location.href).renderer;
        renderer = (renderer) ? [renderer] : OL.Layer.Vector.prototype.renderers;
        Map.render = renderer;
	Map.render = ["Canvas","SVG", "VML"];
    };
    
    var activeControl = function(p){
            p.control = (p.control=='none')?'identify':p.control;
            for(x in Map.controls) {
                var control = Map.controls[x];
                if(p.control == x && p.active) {
                    control.activate();
		    if(p.event){
			control.Event = p.event;
		    }
		    if(p.onDeactivate){
			addEvents({
			    item:control,
			    events:{
				deactivate:p.onDeactivate
			    }
			});
			
		    }
                } else {
                    control.deactivate();
		    
                }   
            }
    };
    Map.activeControl = activeControl;
    
    var addVector = function(){
        addLayer({
                type:'Vector',
                name:'Poligonos',
                position:1,
                info:{
                    renderers:Map.render,
                    styleMap:new OL.StyleMap({
				
                                "default": new OL.Style(OL.Util.applyDefaults({
                                    fillColor: "${fColor}",
                                    strokeWidth: "${lSize}",//1
                                    strokeColor: "${lColor}",//#59590E
                                    strokeDashstyle: "${lType}",//dash
                                    //label : "${nombre}",
                                    labelAlign: "center",
                                    fontColor: "#000000",
                                    fontWeight: "bold",
                                    labelOutlineColor: "white",
                                    labelOutlineWidth: 3,
                                    fontFamily: "Courier New, monospace",
                                    fontSize: "16px",
				    fillOpacity:0.2

                                }, OL.Feature.Vector.style["default"])),
                                
                                "vertex": new OL.Style(OL.Util.applyDefaults({
                                    fillColor: "${fColor}",
                                    strokeWidth: 1,
                                    externalGraphic: "${image}",
                                    graphicWidth: "${gWith}",
                                    graphicHeight: "${gHeight}",
                                    //graphicName: "square",
                                    strokeColor: "#59590E",
                                    strokeDashstyle: "line",
                                    //label : "${nombre}",
                                    labelAlign: "center",
                                    fontColor: "#000000",
                                    fontWeight: "bold",
                                    labelOutlineColor: "white",
                                    labelOutlineWidth: 3,
                                    fontFamily: "Courier New, monospace",
                                    fontSize: "16px"
				    

                                }, OL.Feature.Vector.style["vertex"]))
                    })
                }
        });
        
        
        /**/
        var styleCluster = new OpenLayers.Style({
                    pointRadius: "${radius}",
                    fillColor: "#ffcc66",
                    fillOpacity: 0.8,
                    strokeColor: "#cc6633",
                    strokeWidth: "${width}",
                    strokeOpacity: 0.8,
                    label : "${total}",
                    labelAlign: "center",
                    fontColor: "#000000",
                    fontWeight: "bold",
                    //externalGraphic: "${image}",
                    //graphicWidth: "35",
                    //graphicHeight: "50",
                    fontFamily: "Courier New, monospace",
                    fontSize: "10px"
                    //labelOutlineColor: "white",
                    //labelOutlineWidth: 3,
                    //graphicYOffset:-43,
                    //labelYOffset:17
                }, {
                    context: {
                        
                        width: function(feature) {
                            return (feature.cluster) ? 2 : 1;
                        },
                        radius: function(feature) {
                            var pix = 2;
                            //var pix="";
                            if(feature.cluster) {
                                
                                pix = Math.min(feature.attributes.count, 7) + 2;
                                
                            }
                            return pix;
                        },
                        total: function(feature) {
                            var total = 1;
                            if(feature.cluster) {
                                total = feature.attributes.count;
                            }
                            total = (total==1)?"":total; 
                            return total;
                        }
                        
                    }
                });
                /*
                Estrategia = [
                    new OpenLayers.Strategy.Fixed(),
                    new OpenLayers.Strategy.AnimatedCluster({
                        distance: 45,
                        animationMethod: OpenLayers.Easing.Expo.easeOut,
                        animationDuration: 10
                    })

                ]*/
                Estrategia = new OL.Strategy.Cluster();
                /*
                Estrategia = new OpenLayers.Strategy.AttributeCluster({
                                    attribute:'clazz'
                            });
                            */
                /*
                clusters = new OpenLayers.Layer.Vector("Clusters", {
                    strategies: [strategy],
                    styleMap: new OpenLayers.StyleMap({
                        "default": style,
                        "select": {
                            fillColor: "#8aeeef",
                            strokeColor: "#32a8a9"
                        }
                    })
                });
                */
        /**/
        addLayer({
                type:'Vector',
                name:'Cluster',
                position:1,
                info:{
                    renderers:Map.render,
                    strategies:[Estrategia],
                    styleMap:styleCluster
                }
        });
    };
    var setCustomControls = function(p){
        Map.controls = p;
    };
    var getCustomControls = function(){
        return Map.controls;
    };
    var addEventsBase = function(){
        var loadStart = function(){
	    
        }
        var loadEnd=function(){
          if(!Map.loadEnd){
	    if(config.startupConfig.ui.startupTotorial){
		Tutorial.load();
	    }
            Map.loadEnd=true;
            MDM6('onLoad');
	    updateSize();
	    locateUbication();
            try{
                amplify.publish( 'mapAfterLoad');
            }catch(e){
                
            }
          }
	 
        }
        addEvents({
            item:getLayer('B1'),
            events:{
                loadstart:loadStart,
                loadend:loadEnd
            }   
        });
        
    };
    var setOpacity = function(){
        var a = arguments;
        if(a[0]){
            a[0].setOpacity(a[1]);
        }
    };
    Map.setOpacity = setOpacity;
    var changeOpacity = function(){
        var a = arguments;
        setOpacity(getLayer('Vectorial'),a[0]);
        setOpacity(getLayer('Text'),a[0]);
    };
    
    var getLayer=function(name){
        return (Map.Layers["'"+name+"'"])?Map.Layers["'"+name+"'"]:null;
    };
    Map.getLayer = getLayer;

    var equalParams = function(a,b){
	var response=true;
	for(var x in a){
	    var param = x.toUpperCase();
	    if(b[param]!=a[x]){
		response=false;
		break;
	    }
	}
	return response;
    };
    
    var setParamsToLayer = function(p){
        var layer = getLayer(p.layer);
	var force = (p.forceRefresh)?p.forceRefresh:true;
	var sameInformation=false;
        if(layer){
            var status = true;
	    if(!force){
		sameInformation = equalParams(p.params,layer.params);
	    }
            if(p.params.layers!=''){
		if((!force)&&(!sameInformation)||(force)){
		    p.params['firm'] = ""+ Math.floor(Math.random()*11) + (Math.floor(Math.random()*101));
		    var bandera = true;
		    if(layer.typeService){
		    	if(layer.typeService=='TMS'){
			    if(p.params.format){
				var f = p.params.format.split('/');
				layer.options.format=p.params.format;
				layer.options.type=f[1];
				layer.type=f[1];
				layer.format=p.params.format;
			    }
			    if(p.params.layers){
				layer.options.layers=p.params.layers;
				layer.layers=p.params.layers;
			    }
			}
			if(layer.typeService=='WFS'){
			    layer.protocol.setFeatureType(p.params.layers); 
			    layer.refresh({featureType: p.params.layers,force: true});
			}
			
		    }
		    if(layer.typeService!='WFS'){
			layer.mergeNewParams(p.params);
		    }
		}
            }else{
                status=false;
            }
            layer.setVisibility(status);
        }
    };
    Map.setParamsToLayer = setParamsToLayer;
    /*
    var goCoords = function(){
            var m = Map.projection;
            var a = arguments;
            var f = Map.factorZoom;
            var p;
            var bandera =false;
            if(typeof(a[0]) == 'object'){
                var t=a[0];
            }else{
                if(typeof(a[0]) == 'string'){
                    var response = Features.getFeatureFromWKT(a[0]);
                    var t = response.bounds;
                    Map.map.zoomToExtent(t);
                    bandera=true;
                }else{
                    if((!a[2])&&(!a[3])){
                        
                        // a[2] = a[0]+f;
                        // a[3] = a[1]+f;
                        // a[0]-=-f; 
                        // a[1]-=f;
                        
                        var lonlat = new OL.LonLat(parseFloat(a[0]),parseFloat(a[1]));
                        Map.map.setCenter(lonlat,12);
                    }else{
                        var t=new OL.Bounds(a[0],a[1],a[2],a[3]);
                    }
                }
            }
            if(!bandera){
                p=t.clone();
                Map.map.zoomToExtent(p.transform(m.used,m.base));
            }
    };
    */
    var locateUbication = function(){
	var params = getQueryString();
	if(params==null){
	    Geolocation.findMyLocation({zoom:8});
	}
    };
    var getParamFromUrl=function(param){
	    var result = null;
	    param = param.replace(/[[]/,"\[").replace(/[]]/,"\]");
	    var regexS = "[\?&]"+param+"=([^&#]*)";
	    var regex = new RegExp( regexS );
	    result = regex.exec( window.location.href );
	    if(result){
		result=unescape(result[1]);
	    }
	    return result;
    };
    
    Map.getParamFromUrl = getParamFromUrl;
    var goCoords = function(){
            var m = Map.projection;
            var a = arguments;
            var f = Map.factorZoom;
            var p;
	    var zoomLevel = false;
            var bandera =false;
            var geographic=false;
            var geojson=false;
            for(var x in arguments){
                if(arguments[x]=='geographic'){
                    geographic=!geographic;
                }
		if(typeof(arguments[x])=='object'){
		    if(arguments[x].zoomLevel){
			zoomLevel=parseInt(arguments[x].zoomLevel);
		    }
		}
            }
            if(typeof(a[0]) == 'object'){
                var t=a[0];
            }else{
                if(typeof(a[0]) == 'string'){
                    var geojson=false;
                    try {
                        geojson = Features.isGeoJson(a[0]);
                    } catch(e) {
                         
                    }
                    if (geojson) {
                        var wkt = Features.getFeatureFromGeojson(a[0]);
                        var response = Features.getFeatureFromWKT(wkt);
                    }else{
                        var response = Features.getFeatureFromWKT(a[0]);
                    }
		    
		    
		    if(geographic){
			var t = response.bounds.transform(m.used,m.base);
		    }else{
			var t = response.bounds;
		    }
                    Map.map.zoomToExtent(t);
                    bandera=true;
                }else{
                    if((typeof(a[2])!='number')&&(typeof(a[3])!='number')){
		    //if((!a[2])&&(!a[3])){
                        bandera=!bandera;
                        if(geographic){
                            var punto = transformToMercator(a[0],a[1]);
                        }else{
                            var punto = {lon:a[0],lat:a[1]};
                        }
                        var lonlat = new OL.LonLat(parseFloat(punto.lon),parseFloat(punto.lat));
                        Map.map.setCenter(lonlat,12);
                    }else{
                        bandera=!bandera;
                        if(geographic){
                           var min = transformToMercator(a[0],a[1]);
                           var max = transformToMercator(a[2],a[3]);
                           var t=new OL.Bounds(min.lon,min.lat,max.lon,max.lat);
                        }else{
                            var t=new OL.Bounds(a[0],a[1],a[2],a[3]);
                        }
                        Map.map.zoomToExtent(t);
			if((typeof(a[4])=='number')){
			    var centroid = Map.map.getCenter();
			    Map.map.setCenter(centroid,(a[4])-1);
			}
                    }
                }
            }
            if(!bandera){
                p=t.clone();
                //Map.map.zoomToExtent(p);
                Map.map.zoomToExtent(p.transform(m.used,m.base));
            }
	    if(zoomLevel){
		    var centroid = Map.map.getCenter();
		    Map.map.setCenter(centroid,zoomLevel-1);
	    }
    };
    Map.goCoords = goCoords;
    var resetTree = function(){
        var V='Vectorial';
        var T='Text';
        Tree.reset();
        var i = '';
        setParamsToLayer({
                layer:V,
                params:{layers: i}
            });
        setParamsToLayer({
                layer:T,
                params:{layers: i}
            });
    };
    var reloadLayer=function(){
        var a = arguments;
        var l =(a[1][a[0]])?Tree.get(a[0]):null;
        if(l){
            var i = Tree.serialize(l);
            //i = LineTime.spetialModule(i);
            //console.log(i);
            setParamsToLayer({
                layer:a[0],
                params:{layers: i}
            });
        }
    };
    function setIndex(name,pos){
	var source = [];
	for(var x in Map.map.layers){
	    var i = Map.map.layers[x];
	    if((!i.isBaseLayer)&&(i.name.indexOf('Select')==-1)){
		source.push({name:i.name,index:x});
	    }
	}
	var Layer = getLayer(name);
	if(Layer){
	    var index = source[pos-1].index;
	    Map.map.setLayerIndex(Layer,index);
	}
	
	
	
    }
    Map.setIndex = setIndex;
    
    var enableClusters = function(){
	var source = DataSource.cluster.enableOn;
	var moreLevels = DataSource.cluster.moreLevels;
	var status=false;
	var onlyRecorcard=true;
	var data = Tree.getActiveLayers();
	var resolution = getResolution();
	var showGeometry = (resolution>2)?true:false;
	var showDetailCluster = false;
	/*
	for(var x in moreLevels){
	    if(moreLevels[x]==resolution){
		showDetailCluster=true;
		break;
	    }
	}
	*/
	for(var x in moreLevels){
	    var level = moreLevels[x]+'';
	    var res = resolution+'';
	    if(level.indexOf(res)!=-1){
		showDetailCluster=true;
		break;
	    }
	}
	for(x in data){
	    if(data[x].id==source.layer){
		status=true;
		Map.cluster.onlyDisplayRecordCard=false;
		break;
	    }
	}
	if(!status){
	    Cluster.clear();
	}
	Map.cluster.active=status;
	Map.cluster.moreLevels=showDetailCluster;
	Map.cluster.recordCardOnCluster=showDetailCluster;
	Map.cluster.geometry = showGeometry;
	Map.cluster.whatshere=false;
	
    };
    var enableAditionalDenue = function(){
	var resolution = getResolution();
	var moreLevels = DataSource.cluster.moreLevels;
	var layer = Map.getLayer('Denue');
	var totalItems = (layer)? layer.params.LAYERS:'';
	totalItems = totalItems.split(',');
	/*
	if((layer.params.SCIAN)||(totalItems.length>1)){
	    if((layer.params.SCIAN!='0')||(totalItems.length>1)){
		Map.cluster.active=true;
	    }
	}
	*/
	
	var showDetailCluster = false;
	for(var x in moreLevels){
	    var level = moreLevels[x]+'';
	    var res = resolution+'';
	    if(level.indexOf(res)!=-1){
		showDetailCluster=true;
		break;
	    }
	}
	Map.cluster.whatshere=false;
	if((layer)&&(totalItems.length>=1)&&(resolution<=toolsConfig.denue.visibleScale)){
	    if(layer.params['TIPOTURISTA']){
		if((layer.params['TIPOTURISTA'].length>0)&&(layer.params['TIPOTURISTA']!='0')){ 
		    if(!Map.cluster.active){
			Map.cluster.active=true;
		    }
		    //Map.cluster.onlyDisplayRecordCard=true;
		    Map.cluster.onlyDisplayRecordCard=false;
		    Map.cluster.whatshere=layer.params['TIPOTURISTA'];
		}
	    }
	}
	Map.cluster.moreLevels=showDetailCluster;
	Map.cluster.recordCardOnCluster=showDetailCluster;
	Map.cluster.geometry = false;
    
    var vectorialLayer = Map.getLayer('Vectorial');
	var vectorialLayers= vectorialLayer.params.LAYERS;
    Map.economic = (vectorialLayers.indexOf('ceco2014')!=-1)?true:false;
    }
    Map.enableAditionalDenue = enableAditionalDenue;
    var reloadTree=function(){
        var V='Vectorial';
        var T='Text';
        Tree.registerChanges();
        var a = Tree.layersAlterated();
        //console.log(a);
        reloadLayer(V,a);
        reloadLayer(T,a);
        Tree.cleanRepository();
	enableClusters();
    };
    /////////////////////////////////// old
    /*
    var loadTree = function(){
        var c = config.mapConfig;
        Tree.load();
        Tree.defineTimer(reloadTree);
        var v = Tree.get('Vectorial');
        var t = Tree.get('Text');
        //var l = LineTime.getLayers();
        if(v){
            v= Tree.serialize(v);
            var templae = c.layers
            addLayer({
                type:'WMS',
                name:'Vectorial',
                url:c.layers.vectorial,
                isBase:false,
                position:1,
                info:{
                    layers:v,
                    format:'png'
                },
                params:{
                    tiled:false,
                    effect:false,
                    buffer:0,
                    ratio:1
                }
        });
        }
        if(t){
            t = Tree.serialize(t);
            addLayer({
                type:'WMS',
                name:'Text',
                url:c.layers.text,
                isBase:false,
                position:2,
                info:{
                    layers:t,
                    format:'png'
                },
                params:{
                    tiled:false,
                    effect:false,
                    buffer:0,
                    ratio:1
                }
        });
        }
        if(l){
            l=l.toString();
            addLayer({
                type:'WMS',
                name:'lineTime',
                url:c.layers.time,
                isBase:false,
                position:3,
                info:{
                    layers:v,
                    format:'png'
                },
                params:{
                    tiled:false,
                    effect:false,
                    buffer:0,
                    ratio:1
                }
        });
        }
    };
    */
    /////////////////////////// old
    ////////////////////////////// new
    var buildExtentByPoint = function(x,y,incrementPixel){
	
    }
    var loadTree = function(){
        var layers = config.mapConfig.layers;
        layers = MDM6('getAditionalLayers',layers);
        Tree.load();
        Tree.defineTimer(reloadTree);
        for(var x in layers){
            var id = layers[x].label;
            var layer = Tree.get(id);
            //if(layer){
                var template = Layer.buildLayer(id,layers[x]);
                template.isBase=false;
                template.position=x+1;
                //console.log(template);
                addLayer(template);
            //}
        }
    };
    
    /////////////////////////////////////new
    var insertCtl = function(){
        var cadena = '<button id="ctlPol" style="position:absolute;top:0px;left:0px;z-index:50000">activa polygon</button>';
        //$("#map").append(cadena);
        $("#ctlPol").click(function(){
            activeControl({control:'polygonH',active:true});
        });
        
        var cadena = '<button id="ctlstopprog" style="position:absolute;top:-50px;left:0px;z-index:50000">activa stoppropag</button>';
        //$("#map").append(cadena);
        $("#ctlstopprog").click(function(){
            activeControl({control:'stopPropag',active:true});
        });
        
        
        var cadena = '<button id="ctlPol2" style="position:absolute;top:50px;left:0px;z-index:50000">desactiva polygon</button>';
        //$("#map").append(cadena);
        $("#ctlPol2").click(function(){
            activeControl({control:'pan',active:true});
        });
        
        var cadena = '<div style="position:absolute;top:100px;left:0px;z-index:50000"><input id="scaleG" value=""><button id="getScaleG">get Scale</button></div>';
        //$("#map").append(cadena);
        $("#getScaleG").click(function(){
            var P = getLayer('Poligonos');
            var idF = P.features[0].id;
            //var params = {edition:true,action:'rotate',/*scale:$("#scaleG").val(),*/id:idF};
            var params = {edition:true,action:'rotate',angle:$("#scaleG").val(),id:idF};
            Features.event(params);
        });
        
        var cadena = '<div style="position:absolute;top:130px;left:0px;z-index:50000"><input id="scaleResize" value=""><button id="getScaleResize">set resize</button></div>';
        //$("#map").append(cadena);
        $("#getScaleResize").click(function(){
            var P = getLayer('Poligonos');
            var idF = P.features[0].id;
            var params = {edition:true,action:'resize',scale:$("#scaleResize").val(),id:idF};
            Features.event(params);
        });
        
        var cadena = '<div style="position:absolute;top:200px;left:0px;z-index:50000"><input id="lonR" value=""><input id="latR" value=""><button id="moveF">move</button></div>';
        //$("#map").append(cadena);
        $("#moveF").click(function(){
            var P = getLayer('Poligonos');
            var idF = P.features[0].id;
            var params = {edition:true,action:'drag',lon:$("#lonR").val(),lat:$("#latR").val(),id:idF};
            Features.event(params);
        });
    
        
        var cadena = '<div style="position:absolute;top:150px;left:0px;z-index:50000"><button id="getScaleG2">hacer</button><button id="getScaleG3">deshacer</button></div>';
        //$("#map").append(cadena);
        $("#getScaleG2").click(function(){
            var P = getLayer('Poligonos');
            var f = P.features[0];
            f.Events.execute({action:'redo'});
            
        });
        $("#getScaleG3").click(function(){
            var P = getLayer('Poligonos');
            var f = P.features[0];
            f.Events.execute({action:'undo'});
        });
        
        
        var cadena = '<div style="position:absolute;top:400px;left:0px;z-index:50000"><button id="delAll">eliminar todas</button><button id="delLast">burrar ultima</button></div>';
        //$("#map").append(cadena);
        $("#delAll").click(function(){
           var params = {action:'hide',items:'all',type:'poi'};
           Marker.event(params);
            
        });
        $("#delLast").click(function(){
            var Layer = getLayer('Markers');
           var lastMarker = Layer.features[Layer.features.length-1];
           var params = {action:'hide',items:[{id:lastMarker.id}],type:'poi'};
           Marker.event(params);
        });
        
        var cadena = '<div style="position:absolute;top:450px;left:0px;z-index:50000"><button id="showAll">mostrar todas</button><button id="showLast">mostrar ultima</button></div>';
        //$("#map").append(cadena);
        $("#showAll").click(function(){
           var params = {action:'show',items:'all',type:'poi'};
           Marker.event(params);
            
        });
        $("#showLast").click(function(){
            var Layer = getLayer('Markers');
           var lastMarker = Layer.features[Layer.features.length-1];
           var params = {action:'show',items:[{id:lastMarker.id}],type:'poi'};
           Marker.event(params);
        });
        
        var cadena = '<div style="position:absolute;top:450px;left:400px;z-index:50000"><button id="geopoint">geo puntos</button><button id="geoline">geo line</button><button id="geopolygon">geo polygon</button><button id="geoexport">geo polygon</button></div>';
        //$("#map").append(cadena);
        $("#geopoint").click(function(){
           activeControl({control:'georeferencePoint',active:true});
            
        });
        $("#geoline").click(function(){
           activeControl({control:'georeferenceLine',active:true});
            
        });
        $("#geopolygon").click(function(){
           activeControl({control:'georeferencePolygon',active:true});
            
        });
        
        $("#geoexport").click(function(){
            Georeference.Export();
        });
        
        var cadena = '<div style="position:absolute;top:350px;left:500px;z-index:50000"><button id="convert">conver to buff</button></div>';
        //$("#map").append(cadena);
        $("#convert").click(function(){
            var P = getLayer('Poligonos');
            var f = P.features[0];
            Features.convertToBuffer(f.id); 
        });
        
        var cadena = '<div style="position:absolute;top:350px;left:800px;z-index:50000"><input id="valorbuffer" type="text"><button id="reset">addbuffertobuffer</button></div>';
        //$("#map").append(cadena);
        $("#reset").click(function(){
            var P = getLayer('Poligonos');
            var f = P.features[0];
            Features.convertToBuffer(f.id);
            //Features.addBufferToBuffer(f.id,$("#valorbuffer").val());
            /*
            var P = getLayer('Poligonos');
            var f = P.features[0];
            //Features.addBufferToBuffer(f.id,10);
            var params = {select:true,id:f.id};
            //Features.event({id:f.id,action:'set',params:{data:{name:'prueba',unit:'british'}}});
            Features.event(params);
            
            Features.event({action:'hide',items:'all'});
            */
        });
        
        var cadena = '<div style="position:absolute;top:250px;left:800px;z-index:50000"><button id="reset2">pois</button></div>';
       // $("#map").append(cadena);
       /*
        $("#reset2").click(function(){
            //Features.event({action:'show',items:'all'});
            activeControl({control:'poi',active:true});
        });
        */
        var cadena = '<div id="files" style="position:absolute;top:250px;left:20px;z-index:50000;height:200px;background:red;"><button id="reset2">kml</button><button id="reset3">kml</button></div>';
        //$("#map").append(cadena);
        $("#reset2").click(function(){
           /*
           var notification = Notification.show({message:'Generando &Aacute;rea'});
           
           setTimeout(function(){
                notification.error();
            },40000);
            */
            //var wkt = $("#wktn").val();
            //Features.add({wkt:wkt,store:false,zoom:true,params:Features.getFormat('buffer','polygon')});
            //var lon=-11735253.667984;
            //var lat=2954947.0024818;
            //var lonlat = transformToDegrees(lon,lat);
            //console.log(lonlat);
            //finishMeasure();
            //Popup.add('reset2','hola','nada malo');
            $("#files").popup({text:'dfsdfsdfsdfsf szb </br> ffsafsdafdsfdasfs </br> fdsfsfsdfdsafsa </br> fsdfsdafsdafsafsa<br>fdsfasfasfadfasfsfas'});
            $("#mdm6DinamicPanel_geoPanel_tab").popup({title:'Crear georeferencias'});
            $("#mdm6Layers_layerManager_baseMapBox").popup({title:'georeferenciacion',text:''});
            $("#mdm6DinamicPanel_btnSearch").popup({title:'georeferenciacion',text:''});
            $("#mdm6Layers_layerManager_btnLayers2").popup({title:'georeferenciacion',text:''});
            $("#scaleControl").popup({text:'dfsdfsdfsdfsf szb </br> ffsafsdafdsfdasfs </br> fdsfsfsdfdsafsa </br> fsdfsdafsdafsafsa<br>fdsfasfasfadfasfsfas'});
            
        });
        var cadena = '<div id="files" style="position:absolute;top:250px;left:20px;z-index:50000;height:10px;background:red;"><input id="grados" value=""><button id="reset3">kml</button><button id="reset4">kml2</button><button id="reset5">Procesa</button></div>';
        $("#map").append(cadena);
        $("#reset3").click(function(){
            //$("#panel-left").panel({width:'300px',position:'left',type:'static',title:'panel izquierdo',load:function(event,ui){console.log("cargado");console.log(event);console.log(ui)}});
            $("#panel-right").panel({width:'300px',position:'right',type:'static',title:'panel izquierdo',load:function(event,ui){console.log("cargado");console.log(event);console.log(ui)}});
	    $("#panel-bottom").panel({height:'300px',position:'bottom',type:'static',title:'panel inferior',load:function(event,ui){console.log("cargado");console.log(event);console.log(ui)}});
           
        });
        $("#reset4").click(function(){
            //Notification.show({message:'El servicio de Google no esta disponible',time:5000});
            calculate([{id:'a1'},{id:'a2'},{id:'a3'},{id:'a4'},{id:'a5'},{id:'a6'},{id:'a7'},{id:'a8'},{id:'a9'},{id:'a10'},{id:'a11'}],'treecomp');
        });
	
	$("#reset5").click(function(){
	    var result = moca2($("#grados").val());
	    console.log(result);
	});
       
        var cadena ='<div id="treecomp" style="background:transparent;position:absoltue;top:300px;left:400px;width:150px;height:150px;position:absolute;z-index:50000">'+
                            '<div id="a1" style="position:absolute;" class="dinamicPanel-sprite dinamicPanel-geo-big"></div>'+
                            '<div id="a2" style="position:absolute;" class="dinamicPanel-sprite dinamicPanel-geo-big"></div>'+
                            '<div id="a3" style="position:absolute;" class="dinamicPanel-sprite dinamicPanel-geo-big"></div>'+
                            '<div id="a4" style="position:absolute;" class="dinamicPanel-sprite dinamicPanel-geo-big"></div>'+
                            '<div id="a5" style="position:absolute;" class="dinamicPanel-sprite dinamicPanel-geo-big"></div>'+
                            '<div id="a6" style="position:absolute;" class="dinamicPanel-sprite dinamicPanel-geo-big"></div>'+
                            '<div id="a7" style="position:absolute;" class="dinamicPanel-sprite dinamicPanel-geo-big"></div>'+
                            '<div id="a8" style="position:absolute;" class="dinamicPanel-sprite dinamicPanel-geo-big"></div>'+
			    '<div id="a9" style="position:absolute;" class="dinamicPanel-sprite dinamicPanel-geo-big"></div>'+
			    '<div id="a10" style="position:absolute;" class="dinamicPanel-sprite dinamicPanel-geo-big"></div>'+
			    '<div id="a11" style="position:absolute;" class="dinamicPanel-sprite dinamicPanel-geo-big"></div>'+
                    '</div>';
        $("#map").append(cadena);
         $("#treecomp").mouseenter(function(){
            $("#a1" ).animate({ "left": "+=50px" }, "medium" );
            $("#a2" ).animate({ "left": "+=50px","top": "-=50px" }, "medium" );
            $("#a3" ).animate({ "top": "-=50px" }, "medium" );
            $("#a4" ).animate({ "left": "-=50px","top": "-=50px" }, "medium" );
            $("#a5" ).animate({ "left": "-=50px"}, "medium" );
            $("#a6" ).animate({ "left": "-=50px","top": "+=50px" }, "medium" );
            $("#a7" ).animate({ "top": "+=50px" }, "medium" );
            $("#a8" ).animate({ "left": "+=50px","top": "+=50px" }, "medium" );
        });
        $("#treecomp").mouseleave(function(){
            $("#a1" ).animate({ "left": "-=50px" }, "medium" );
            $("#a2" ).animate({ "left": "-=50px","top": "+=50px" }, "medium" );
            $("#a3" ).animate({ "top": "+=50px" }, "medium" );
            $("#a4" ).animate({ "left": "+=50px","top": "+=50px" }, "medium" );
            $("#a5" ).animate({ "left": "+=50px"}, "medium" );
            $("#a6" ).animate({ "left": "+=50px","top": "-=50px" }, "medium" );
            $("#a7" ).animate({ "top": "-=50px" }, "medium" );
            $("#a8" ).animate({ "left": "-=50px","top": "-=50px" }, "medium" );
        });
        
        setTimeout(function(){
            $("#treecomp").children('div').each(function(){
                $(this).position({
                    of:$("#treecomp"),
                    at:"center"+ " " +"center"
                });
            });
        },500);
        
        ///////////////////////////////////
        
        ///////////////////////////////////
    };
    
        var radians, maxRadians, target, radius, originX, originY, inc, timer;
      
        var radius = 50;
        var radians = 0;
        var maxRadians = 2 * Math.PI;
        var inc = 280 / 360;
    var calculate = function(total,root){
	var item = {
	    width: $("#a1").width(),
	    heigth:$("#a1").heigth()
	};
	var totalItems = 8;
	var position = $("#"+root).offset();
	var originX = 60;
        var originY = 60;
        for(i=0;i<total.length;i++){
          var x, y;
          x = originX + (Math.cos(radians) * radius);
          y = originY + (Math.sin(radians) * radius);
          $("#"+total[i].id).css('left',x+"px");
          $("#"+total[i].id).css('top',y+"px");
          radians += inc;
          if (radians > maxRadians) {
            //radians -= maxRadians;
          }
        }
    };

    window.onbeforeunload = function() {
       Tree.store();
       //Poi.store();
    };
    
    var ApiEvents = function(){
        var evento = function(params){
            setParamsToLayer({
                    layer:params.layer,
                    params:params.params,
		    forceRefresh:params.forceRefresh
            });
        }
        MDM6('define','setParams',evento);
        
        var eventoCoordenadas =function(){
            goCoords.apply(this,arguments);
        }
        MDM6('define','goCoords',eventoCoordenadas);
	MDM6('define','getResolution',getResolution);
	MDM6('define','setRestrictedExtent',redefineExtent);
	MDM6('define','getZoomLevel',getZoomLevel);//pat
	MDM6('define','getExtent',getExtent);
	MDM6('define','updateSize',updateSize);
	MDM6('define','addMarker',Marker.add);
	MDM6('define','hideMarkers',function(tipo){
	    Marker.event({action:'delete',items:'all',type:tipo});
	});
    MDM6('define','setStatusLayer',Tree.addToRepository);
	MDM6('define','customPolygon',function(){
	    var a = arguments[0];
	    var defaultParams = {fColor:"none",lSize:2,lColor:"blue",lType:"line",type:'buffer'};
	    var params = $.extend(defaultParams, a.params);
	    if(a.action){
		if(a.action=='add'){
		    MDM6('addPolygon',a.wkt,params);
		}else{
		    MDM6('deletePolygons');
		}
	    }
	});
	MDM6('define','addPolygon',function(wkt,params){
	    Features.addSpetialFeature(wkt,params);
	});
	MDM6('define','deletePolygons',Features.deleteSpetialFeature);
	MDM6('define','getSizeMap',function(){
	    return {width:$("#map").width(),height:$("#map").height()};
	})
	MDM6('define','enableCustomTool',function(){
	    var a = arguments[0];
	    //a={control:'customPolygon',active:true,event:function()}
	    if(a.control){
		var ctl = a.control;
		a.control='custom'+ctl.charAt(0).toUpperCase() + ctl.slice(1);
	    }
	    activeControl(a);
	});
	
    MDM6('define','setOpacity',function(layer,opacity){
	    setOpacity(getLayer(layer),opacity);
	});
	MDM6('define','getModal',function(){
	    return Modal.create(arguments[0]);
	});
	MDM6('define','newRequest',function(){
	    return Request.New(arguments[0]);
	});
	MDM6('define','newNotification',function(){
	    return Notification.show(arguments[0]);
	});
	MDM6('define','getUrlParam',function(){
	    return getParamFromUrl(arguments[0]);
	});
	MDM6('define','addGeorss',addGeorss);
	MDM6('define','getLayer',getLayer);
	//MDM6('define','getExtent',function(){
	//    return config.mapConfig.initialExtent;
	//});
	MDM6('define','toMercator',transformToMercator);
	MDM6('define','toGeographic',transformToGeographic);
	MDM6('define','createGeorreference',function(a){
	$("#mdm6DinamicPanel").dinamicPanel('showPanel','geoPanel');
	Georeference.showModalBuffer(a);
	});
	MDM6('define','markerEvent',Marker.event);
	MDM6('define','setZoomLevel',function(a){
	    var lonlat = new OL.LonLat(a.lon,a.lat);
	   Map.map.setCenter(lonlat,a.zoomLevel);
	});
	MDM6('define','addLayer',function(a){
	    Map.map.addLayer(a);
	});
	MDM6('define','updateCluster',function(a){
	    a.whatshere=Map.cluster.whatshere;
	    Cluster.update(a);
	});
	MDM6('define','showRecordCard',function(a){
	    //if(Map.cluster.recordCardOnCluster){
		Cluster.showRecordCard(a);
	    //}
	});
	MDM6('define','showRecordCardMarker',function(a){
		Cluster.showRecordCard(a);
	});
	MDM6('define','showLabelCluster',Cluster.showLabel);
	MDM6('define','hideLabelCluster',Cluster.hideLabel);
	MDM6('define','getMousePosition',Cluster.getMousePosition);
	MDM6('define','compactCluster',Cluster.compact);
	MDM6('define','updateDetailCluster',Cluster.updateDetailCluster);
	MDM6('define','destroyDetailCluster',Cluster.destroyDetailCluster);
	MDM6('define','moreLevesCluster',function(){return Map.cluster.moreLevels});
	MDM6('define','setCenter',function(lon,lat){
	    var lonlat = new OL.LonLat(lon,lat)
	    Map.map.setCenter(lonlat);
	});
	MDM6('define','getLonLatFromPrixel',function(a){
	    return Map.map.getLonLatFromPixel(a);
	});
	MDM6('define','isFirstNodes',function(){return Cluster.isFirstNodes()});
	MDM6('define','clearClusters',function(){Cluster.clear()});
	MDM6('define','setClearItems',function(status){Cluster.setClearItems(status)});
	MDM6('define','printExtent',function(lon,lat,lon2,lat2){
	    var extent = new OL.Bounds(lon,lat,lon2,lat2);
	
	    var siteStyle = {
		// style_definition
	    };
	    var info = extent.toGeometry();
	    var points = info.components[0].components;
	    var linearRing = new OL.Geometry.LinearRing(points);
	    var geometry = new OL.Geometry.Polygon([linearRing]);
	    var feature = new OpenLayers.Feature.Vector(geometry, null, siteStyle);
	    var params = {fColor:"red",lSize:2,lColor:"blue",lType:"line",type:'buffer'};
	    MDM6('addPolygon',feature.geometry+'',params);
	    
	});
	MDM6('define','exportMap',exportMap);
	MDM6('define','getActualBaseLayer',getActualBaseLayer);
	MDM6('define','printMap',function(html){
	    printControl.printHtml(html); 
	});
    }
    var isExplorer=function(){
	    var response = false;
    
	    var ua = window.navigator.userAgent;
	    var msie = ua.indexOf("MSIE ");
    
	    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
		response=true;
	    }
    
	    return response;
    }
    var isIE = function(){
	var ie = (function(){
            var undef,
                v = 3,
                div = document.createElement('div'),
                all = div.getElementsByTagName('i');
        
            while (
                div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                all[0]
            );
        
            return v > 4 ? v : undef;
        
        }());
	return ie;
    }
    var getIeVersion = function(){
	var version=null;

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer, return version number
            version = parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));

	return version;
    }
    /**/
    /**/
    var getDocumentMode = function(){
	var mode;
	var agentStr = navigator.userAgent;
        if (agentStr.indexOf("Trident/5.0") > -1) {
            if (agentStr.indexOf("MSIE 7.0") > -1)
                mode = "ie9";//vista de compatibilidad
            else
                mode = "ie9";
        }
        else if (agentStr.indexOf("Trident/4.0") > -1) {
            if (agentStr.indexOf("MSIE 7.0") > -1)
                mode = "ie8";//vista de compatibilidad
            else
                mode = "ie8";
        }
        else
            mode = "ie7";

	return mode;
    }
    var testBrowserCompatibility = function(){
	var option = true;
	var ie = isIE();
	var ieVer = getIeVersion();
	var mode = getDocumentMode();
	
	if((ie)&&(mode!=ie)&&(ieVer<9)){
	    option=false;
	}else{
	    
	}
	if(!option){
	    showScreen(option);
	}
	//showScreen();
	/**/
	/*
	var params = {
		url:"http://mapserver.inegi.org.mx/InformaCartPart/informaCartPart.do?",
		params:'',
		type:'get',
		format:'html',
		events:{
		    success:function(data,extraFields){
			console.log(data);
		    },
		    before:function(a,extraFields){
		       
		    },
		    error:function(a,b,extraFields){
			    console.log(a.status)
		    },
		    complete:function(a,b,extraFields){
			
		    }
		}
	}
	var newRequest = Request.New(params);
	
	var parametros = {
	    sistema:'MDM',
	    x:-11974520.215691,
	    y:3489658.6524744,
	    epsg:3857,
	    extent:'-13170606.834131,1410571.483407,-9516305.3863815,4091370.9390516',
	    ux:-11387330.964486,
	    uy:2497849.9920983
	 };
	 
	newRequest.setParams(parametros);
        newRequest.execute();
	*/
	//cartografiaModal.show();
	/**/
	return option;
    };
    
    var showScreen = function(){
	var showStep = function(a){
	    var step = Help.ie.steps[(a-1)];
	    var imagen = 'help/img/ie/'+step.img;
	    var texto = step.text;
	    $('.image').children().attr('src',imagen);
	    $('.text').children().html(texto);
	    $(".selected").removeClass('selected');
	    $("div[step='"+a+"']").addClass('selected');
	    $(".steps").html('Paso '+a);
	    if(a>1){
		$(".rightRow").removeClass('hidden');
		$(".leftRow").removeClass('hidden');
	    }
	    if(a==1){
		$(".leftRow").addClass('hidden');
		$(".rightRow").removeClass('hidden');
	    }
	    if(a==(Help.ie.steps.length)){
		$(".rightRow").addClass('hidden');
	    }
	    $(".rightRow").attr('next',a+1);
	    $(".leftRow").attr('next',a-1);
	    
	}
	var getSteps = function(a){
	    var chain='';
	    for(x in Help.ie.steps){
		chain+='<div><div step="'+(parseInt(x)+1)+'"></div></div>';
	    }
	    return chain;
	}
	var events = function(){
	    $("div[step]").each(function(){
		$(this).click(function(){
		    var step = $(this).attr('step');
		    showStep(parseInt(step));
		});
	    });
	    
	    $(".rightRow,.leftRow").click(function(){
		var step = $(this).attr('next');
		showStep(parseInt(step));
	    });
	    
	   
	}
	var print = function(){
	    var chain = '<div class="helpScreen">'+
			    '<div class="header">'+
				'<label>Mapa Digital de M&eacute;xico en l&iacute;nea</label>'+    
				'<span>'+Help.ie.header+'</span>'+
				'<div class="help_template logo_mdm"></div>'+
				'<div align="center">'+
				    getSteps()+
				'</div>'+
				'<div></div>'+
			    '</div>'+
			    '<div section>'+
				'<div browsers>'+
				    '<div leftRow class="help_template leftRow"></div>'+
				    '<div class="content">'+
					'<div class="image">'+
					    '<image src=""/>'+
					'</div>'+
					'<div class="text">'+
					    '<span></span>'+
					'</div>'+
				    '</div>'+
				    '<div rightRow class="help_template rightRow"></div>'+
				'</div>'+
				'<div class="steps">Paso 1</div>'+
			    '</div>'+
			'</div>';
	    $('body').html(chain);
	    showStep(1);
	}
	$.when(
                $('<link>', {rel: 'stylesheet',type: 'text/css',href: 'css/help.css'}).appendTo('head'),
                $.Deferred(function( deferred ){
                        $( deferred.resolve );
                })
        ).done(function(){
                print();
		events();
        });
    };
    /*
    var initialMessage = function(){
        if(ie){
            if(document.documentMode!=ie){
                //ieModal.show();
            }
        }
    };
    */
    /*
    var getContentIEModal = function(){
        var steps='';
	for(var x in Help.ie.steps){
	    steps +='<div id="step_'+x+'" class="step_option">Paso '+(parseInt(x)+1)+'</div>';
	}
	
	var cadena ='<div style="width:700px;">'+
			'<div style="background:#DBDBDB;padding-top:10px;padding-bottom:10px;font-size:110%;">'+Help.ie.header+'</div>'+
			'<div style="width:700px;height:340px;border-bottom: 2px solid #DDDDDD;">'+
			    '<div style="position:relative;float:left;height:100%;width:232px;background:#F8F8F8">'+
				'<p id="step_text" align="justify" style="position:absolute;left:10px;right:10px;font-size:110%;">'+Help.ie.steps[0].text+'</p>'+
			    '</div>'+
			    '<div style="position:relative;float:left;height:100%;width:468px;">'+
				'<img id="step_image" style="width:468px;height:340px" src="help/img/ie/'+Help.ie.steps[0].img+'">'+
			    '</div>'+
			'</div>'+
			'<div style="width:700px;background:#DBDBDB">'+
			    steps+
			'</div>'+
		    '</div>';        
        return cadena;
    };
    
    var ieModal = Modal.create({
                    title:Help.ie.titleWindow,
                    content:getContentIEModal(),
                    events:{
                        onCancel:function(){
                            
                        },
                        onCreate:function(){
			    for(var x in Help.ie.steps){
				$("#step_"+x).click(function(){
				    var pos = parseInt($(this).attr('id').replace('step_',''));
				    $("#step_text").html(Help.ie.steps[pos].text);
				    $("#step_image").attr("src",'help/img/ie/'+Help.ie.steps[pos].img);
				    $("._active").removeClass('_active');
				    $(this).addClass('_active');
				});
			    }
			    $("#step_0").addClass('_active');
			    
                        },
                        onShow:function(){
                            
                        }
                    }
        });
    */
    var clockAltitude = null;
    var requestAltitude = Request.New({
            url:DataSource.mousePosition.elevation.url,
            contentType:"application/json; charset=utf-8",
            params:'',
            events:{
                success:function(data,extraFields){
                    var msg=null;
                    if(data){
                        if(data.response.success){
			    var altitude = getformatNumber(data.data.elevation);
			    $("#coordinates_map .altitude").html('Altitud: '+altitude+'msnm');
                        }else{
                             msg='Altitud no disponible';
                        }
                    }else{
                        msg='Servicio de altitud no disponible';
                    }
                    if(msg!=null){
                        //var notification = Notification.show({message:msg});
                        //notification.show();
			$("#coordinates_map .altitude").html('');
                    }
                },
                before:function(a,extraFields){
                   
                },
                error:function(a,b,extraFields){
                    
                    //var notification = Notification.show({message:'Serviciode altitud no disponible'});
                    //notification.show();
		    $("#coordinates_map .altitude").html('');
                        
                },
                complete:function(a,b,extraFields){
                    
                }
            }
    });
    var addDivsCanvas = function(){
	    var chain=  '<div id="background_nodes_mirror">'+
			    '<canvas id="background_nodes_mirror_canvas"></canvas>'+
			'</div>'+
			'<div id="nodos_mirror">'+
			    '<canvas id="nodos_mirror_canvas"></canvas>'+
			'</div>';
	    $("#map").append(chain);
    };
    var init = function(){
	    addDivsCanvas();
	    $('#map').append('<div id="coordinates_map"><div class="altitude"></div></div>');
	    $("#canvasimage").css({height:$("#map").height()+'px',width:$("#map").width()+'px'});
	    M = Map.map;
            //initialMessage();
            //Escuelas.init();
            //jQuery.support.cors = true;
            //MDM6('loadPanels');
	    var actionHeader = MDM6('loaderHeader');
	    if(actionHeader){
		if(actionHeader.content){
		    $('#header').html(actionHeader.content); 
		}
		if(actionHeader.event){
		   actionHeader.event();
		}
	    }
	    OL.Control.Measure.prototype.geodesic = true;
            initialOLDefinitions();
            var c = config.mapConfig;
	    var idMap='map';
	    if(((typeof apiUrl!=='undefined'))&&($("#mapa").length)){
		idMap = idMap+((apiUrl)?'a':'');
		$("#mdm6Layers,#mdm6DinamicPanel").css('display','none')
	    }
            Map.map = new OL.Map({ 
                div: "map",
                controls: ctl.getOL(),
                projection: Map.projection.base,
                displayProjection: config.mapConfig.projection,
                resolutions: c.resolutions,
                eventListeners:getListenersMap()
            });
	    if(typeof apiUrl!=='undefined'){
		if($("#mapa").length){
		    $("#content").addClass('apiMDM6Content');
		    $(".olControlMousePosition").addClass('apiMDM6MousePosition');
		    $(".olControlScaleLine").addClass('apiMDM6ScaleLine');
		    updateSize();
		}
	    }
	    if(!config.startupConfig.ui.layersBar){
		$(".olControlMousePosition").addClass('apiMDM6MousePosition');
		$(".olControlScaleLine").addClass('apiMDM6ScaleLine');
	    }
            insertBaseLayers();
            addEventsBase();
            extentMap();
            setRestrictedExtent(Map.restrictedExtent);
            defineIndexLayers();
            addVector();
            //Marker.addLayer(Map);
            //Georeference.load(Map);
            addCustomControls();
            activeControl({control:'identify',active:true});
            //activeControl({control:'measurePolygon',active:true});
            loadTree();
            Marker.addLayer(Map);
            //loadOverview('B1');
            ctl.defineActions(getControl('polygonH'));
            ctl.defineActions(getControl('measurePolygon'));
            ctl.defineActions(getControl('measureLine'));
            ctl.defineActions(getControl('georeferencePolygon'));
            ctl.defineActions(getControl('georeferenceLine'));
            ctl.addExtra(Map,[getLayer('Poligonos'),getLayer('Markers'),getLayer('Cluster')],getControl('polygonH'));
            //Cluster.load(Map);
            Features.addEvent(getLastMousePosition);
            Popup.resetLimits();
            //LineTime.load(Map,Tree.getMain());
            inserCopyRights(tree.baseLayers['B1'].rights);
	    if(((typeof apiUrl!== 'undefined')&&($("#mapa").length))||(!config.startupConfig.ui.layersBar)){
		$(".copyRights").addClass('apiMDM6Rights');
	    }
            ApiEvents();
	    //Features.loadInitialWindow();
            //Notification.load();
            //getLocation();
            //Poi.load(Map);
            //ctl.setEventIdentify(function(e){console.log(e)});
            //Popup.defineTimer();
            //$("#map").append('<textarea id="wktn" style="position:absolute;bottom:0px;left:200px;z-index:50000"></textarea>');
            //$("#map").append('<button id="bwktn"  style="position:absolute;bottom:-200px;left:200px;z-index:50000"></button>');
            
           
            //insertCtl();
            //wps.init();

            /*
            var Pois = new OpenLayers.Layer.Text( "cvs",
                    { location:"http://localhost/mdm6/js/frameworks/upload/server/php/files/poi.txt",//"poi.txt",
                      projection:Map.projection.base
                    });
            
             console.log(Pois);
            Map.map.addLayer(Pois);
            */
	    //activeControl({control:'routing',active:true});
	    Geolocation.init(Map);
	    Route = Geolocation;
	    //activeControl({control:'cartografia',active:true});
            //Cluster.execute();
	    Tree.runTimer();
	   
	    TS.initialize(Map);
	    //TS.conect('http://vmap0.tiles.osgeo.org/wms/vmap0');
	    //TS.conect('http://gaia.inegi.org.mx/NLB/mdm5.wms');
	    //TS.conect('wms','http://gaia.inegi.org.mx/NLB/mdm5.wms');
	    //TS.conect('wfs','http://demo.opengeo.org/geoserver/wfs');
	    //TS.conect('wmts','http://v2.suite.opengeo.org/geoserver/gwc/service/wmts/');
	    //TS.conect('wmts','http://10.108.10.143:6080/arcgis/rest/services/spot5_wmts_p/ImageServer/WMTS/');
	    //                    http://10.108.10.143:6080/arcgis/rest/services/spot5_wmercator/ImageServer/WMTS?
	    //TS.conect('wmts','http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi');
	    //TS.conect('wmts','http://maps.opengeo.org/geowebcache/service/wmts');
	    
	    //TS.conect('tms','http://tilecache.osgeo.org/wms-c/Basic.py/');
	    
	    //TS.conect('tms','http://tilecache.osgeo.org/wms-c/Basic.py/');
	    
	    //Geolocation.tracMyPosition();
	    
	     
	    var cadena ='<div id="servicios" style="position:absolute;bottom:100px;left:200px;z-index:5000">'+
			    '<button id="sbtn1">servicio1</button>'+
			    '<button id="sbtn2">servicio2</button>'+
			    '<button id="sbtn3">evento 1</button>'+
			    '<button id="sbtn4">evento 2</button>'+
			'</div>';
	    
	    cadena ='<div id="servicios" style="position:absolute;top:100px;left:200px;z-index:5000">'+
			    '<button id="locate">ubicame</button>'+
			    '<button id="track">tracking</button>'+
			    '<button id="snap">snap</button>'+
			    '<button id="endtrack">end</button>'+
			    '<button id="ruta">link</button>'+
			    '<button id="gordis">gordis</button>'+
			    '<button id="imprime">imprime</button>'+
			    '<a href="javascript:window.print()"><img src="print.gif"></a>'+
			'</div>';
	    	 
	    //$("#map").append(cadena);
	    
	    $("#sbtn1").click(function(){
		var evento = function(e){
		    //console.log(e);
		    e.selected.layers.push('states');
		    //e.selected.format='image/jpeg';
		    e.action='set';
		    e.opacity=1;
		    TS.event({action:'set',data:[e]});
		}
	       TS.event({action:'get',type:'wms',path:'http://10.152.11.17:82/mdmCache/service/wms',catchEvent:evento});
	    });
	    $("#sbtn2").click(function(){
		var evento = function(e){
		    //console.log(e);
		    e.selected.layers.push('basic');  
		    e.selected.format='image/png';
		    e.action='add';
		    e.opacity=1;
		    TS.event(e);
		}
	       TS.event({action:'get',type:'tms',path:'http://tilecache.osgeo.org/wms-c/Basic.py/',catchEvent:evento});
	    });
	    
	    
	    $("#sbtn3").click(function(){
		var params = {action:'set',position:2,id:'S2'};
		TS.event(params);    
	    });
	    $("#sbtn4").click(function(){
		var params = {action:'set',position:1,id:'S2'};
		TS.event(params);    
	    });
	    $("#gordis").click(function(){
		//Features.restoreFeatures('georeference');
		//console.log(getControl('identify'));
		//ctl.actionIdentify({lon:-11361017.977566,lat:2509777.7498286});
		
		var g = 'LINESTRING(-11037597.6475203 2206984.21357997,-11037589.7185975 2207101.31431448,-11037612.5494541 2207104.64638342,-11037819.5536181 2207138.69655984,-11037806.0437381 2207198.76787818,-11037793.1981682 2207235.99974466,-11037765.4227647 2207309.96753743,-11037755.0869409 2207335.22631886,-11037697.1469226 2207476.82033064,-11037678.3989533 2207529.86761647,-11037675.0730486 2207553.22314104,-11037673.8392668 2207561.88738238,-11037611.3228466 2207938.5957181,-11037561.2508035 2208188.89747179,-11037528.8441781 2208383.99675112,-11037509.9468986 2208474.26457748,-11037499.2847209 2208501.22623572,-11037488.3619438 2208530.07329788,-11037481.6408668 2208543.65979828,-11037458.7366938 2208588.16809424,-11037447.161528 2208604.35499611,-11037430.4005481 2208626.66581369,-11037418.9548356 2208639.00931436,-11037400.3065035 2208659.56879517,-11037378.6002472 2208677.28898661,-11037334.7861213 2208710.59181162,-11037232.565123 2208788.28857348,-11037196.8124574 2208815.3844782,-11037179.1201685 2208828.7928409,-11037150.0042233 2208852.15015428,-11037106.9777155 2208883.08207847,-11037091.7728181 2208894.01285558,-11037066.6173936 2208913.89108626,-11037039.0772297 2208940.51555768,-11037024.0812517 2208958.89861469,-11037004.4827356 2208986.48146623,-11036985.7731179 2209018.47067416,-11036861.8867256 2209017.77638424,-11036849.2228211 2209092.32998475,-11036820.9095665 2209143.28479531,-11036764.1561225 2209218.10738633,-11036749.3855152 2209236.99863557,-11036677.8030764 2209321.39761341,-11036668.5738002 2209332.54323504,-11036606.4256979 2209409.22825333,-11036565.1410912 2209461.07355266,-11036523.9944247 2209513.40507919,-11036511.7892246 2209528.83858486,-11036458.2472227 2209596.54181989,-11036457.0490861 2209598.05691543,-11036438.8806627 2209619.04449935,-11036436.2248675 2209622.11239343,-11036417.087591 2209650.60400922,-11036397.0895998 2209679.92761406,-11036388.9151001 2209690.364771,-11036370.239548 2209714.20949014,-11036353.7516178 2209736.80933577,-11036335.9466081 2209750.73090539,-11036334.7069359 2209751.70024516,-11036305.212649 2209757.91712858,-11036284.1497107 2209758.58460054,-11036195.0222832 2209761.40846229,-11036190.3263744 2209761.55722601,-11036065.4634394 2209757.92917238,-11036057.866265 2209757.66603893,-11035967.5910825 2209754.53866806,-11035936.1387117 2209753.860984,-11035932.9917988 2209753.84390513,-11035785.5301666 2209746.12571413,-11035650.7343303 2209739.2752061,-11035617.8568438 2209737.60411037,-11035577.0773987 2209735.82951287,-11035557.4065196 2209734.97342552,-11035513.8620751 2209731.26701528,-11035484.5441278 2209724.54748281,-11035473.8515461 2209719.97987956,-11035437.0122935 2209704.24315387,-11035379.2686283 2209666.95483649,-11035357.8279156 2209653.10922125,-11035261.8789734 2209595.97595811,-11035209.1144825 2209562.25375185,-11035192.3909461 2209551.56554555,-11035156.3293119 2209528.5181802,-11035049.4225114 2209460.1919839,-11034926.6926179 2209381.75178017,-11034877.9200193 2209349.99420238,-11034847.2939156 2209333.5242835,-11034841.5755246 2209331.5512318,-11034825.4146577 2209325.97500679,-11034788.0441681 2209313.08045527,-11034716.5136942 2209288.03405996,-11034714.269189 2209287.24810445,-11034697.9486543 2209281.62424949,-11034603.2124347 2209248.97904514,-11034507.0347549 2209215.83659401,-11034458.8024038 2209198.49829953,-11034408.9568324 2209180.57984604,-11034404.3381886 2209178.9195406,-11034397.0208561 2209176.30658154,-11034381.6036147 2209171.60463729,-11034366.1854341 2209166.11819526,-11034347.893024 2209159.5866271,-11034328.8178609 2209152.00965955,-11034314.4493219 2209146.96622629,-11034251.1435116 2209124.74548484,-11034229.9659238 2209117.31192187,-11034214.598647 2209111.91785435,-11034118.5398685 2209078.28984872,-11034024.571369 2209045.30494805,-11033974.0454231 2209027.19510538,-11033927.7369901 2209010.68063158,-11033885.7334093 2208996.8081975,-11033855.4604333 2208991.38399601,-11033826.2474346 2208981.8845931,-11033802.3299118 2208974.17440948,-11033770.7373687 2208963.91104112,-11033735.3909729 2208951.72815792,-11033734.9653004 2208951.58142596,-11033715.1809308 2208941.83981255,-11033695.4135513 2208931.24912585,-11033686.5540441 2208923.99297101,-11033681.9531516 2208914.84147586,-11033652.7030049 2208885.9419952,-11033603.2917274 2208843.5777497,-11033571.0096216 2208815.88666279,-11033533.7302193 2208783.90880215,-11033491.3482889 2208747.55386812,-11033384.6106119 2208664.98174504,-11033375.6611423 2208658.05836967,-11033355.1053992 2208641.00348243,-11033343.9902113 2208633.98468772,-11033336.0030975 2208625.33077356,-11033319.6673226 2208608.51098293,-11033312.1416619 2208601.65536493,-11033291.0650006 2208582.45516771,-11033269.4737854 2208564.60896449,-11033262.2868651 2208558.25972718,-11033248.3216469 2208545.92237126,-11033214.6905237 2208518.06635226,-11033191.0070126 2208499.3284663,-11033179.3099213 2208490.67386236,-11033165.635927 2208480.55648941,-11033143.1672455 2208464.39087334,-11033134.3551623 2208458.16981711,-11033117.7792793 2208446.46767493,-11033091.1340711 2208428.09434982,-11033075.3897494 2208420.26185451,-11033063.5516915 2208414.37264163,-11033028.2546979 2208400.0529227,-11032990.0099323 2208384.83729143,-11032967.3269351 2208380.10492966,-11032766.2707421 2208301.48505725,-11032720.8985283 2208283.74257632,-11032540.1589257 2208213.06414995,-11032503.7600381 2208197.03977837,-11032485.3707665 2208186.15494391,-11032446.0316219 2208171.24109647,-11032438.0448582 2208168.18745276,-11032399.1195087 2208153.30469243,-11032388.3452378 2208148.96452304,-11032345.0778018 2208133.10036577,-11032295.0457141 2208113.9051996,-11032294.8179741 2208113.81755345,-11032247.1493837 2208095.47489632,-11032247.0683976 2208095.44586298,-11032228.2117334 2208088.6914086,-11032187.2542077 2208072.36957846,-11032174.5412554 2208071.04164166,-11032149.4300811 2208061.5087187,-11032139.2427433 2208057.56675815,-11031939.5368319 2207981.887102,-11031909.7960332 2207971.39987754,-11031885.0151498 2207965.37618669,-11031860.6135567 2207961.48317031,-11031833.233165 2207958.80328458,-11031799.0257245 2207959.80585104,-11031771.5343266 2207962.64335127,-11031736.7769636 2207970.00359182,-11031704.4997814 2207979.96163447,-11031665.8087326 2207994.03520592,-11031625.8091789 2208010.20496208,-11031581.5821192 2208026.71320473,-11031533.0763081 2208046.10648897,-11031466.3253544 2208070.66835976,-11031443.8462953 2208075.70985414,-11031342.9300515 2208116.13049001,-11031328.9603432 2208121.77408198,-11031284.6728567 2208141.25266617,-11031215.3212604 2208168.01420299,-11031197.447659 2208175.29280416,-11031180.4435346 2208181.31522857,-11031161.777342 2208186.02998638,-11031141.035919 2208189.00412864,-11031121.6361638 2208190.25273602,-11031090.0061495 2208187.96655865,-11031066.7663201 2208184.44986509,-11031036.0756001 2208176.54189974,-11031011.0711123 2208166.39817554,-11030985.6175757 2208151.86729681,-11030963.5307052 2208137.82967758,-11030927.4586191 2208105.67359369,-11030865.4488956 2208041.14349313,-11030833.1315078 2208011.18687607,-11030692.9578707 2207871.94949273,-11030598.7290995 2207776.51478956,-11030598.6969841 2207776.42512373,-11030579.9656943 2207757.57286394,-11030442.1383852 2207619.01028417,-11030426.6907618 2207603.69270879,-11030415.6747765 2207591.8622421,-11030408.2366054 2207581.91040575,-11030393.2775565 2207561.89603603,-11030384.2532678 2207548.97407962,-11030376.0727017 2207536.06936676,-11030366.7455877 2207519.37002312,-11030353.6431506 2207488.00790904,-11030343.3622488 2207463.39966868,-11030298.0796186 2207355.01059152,-11030284.3942452 2207330.42162179,-11030268.6630524 2207293.87091558,-11030210.8167672 2207162.75479002,-11030184.1562861 2207100.03726336,-11030186.8472693 2207090.33484199,-11030179.0155234 2207072.62689597,-11030171.0386086 2207052.6516883,-11030167.8265872 2207038.01714762,-11030162.220578 2207023.04258589,-11030159.1628767 2207007.27083642,-11030154.329819 2206990.20955398,-11030153.5464378 2206971.91675441,-11030152.5620453 2206937.08183442,-11030153.8345235 2206915.87950664,-11030155.5632846 2206905.70030529,-11030159.2318292 2206886.30796335,-11030165.9260854 2206860.50826409,-11030201.8012282 2206755.94939183,-11030216.1151089 2206715.90843946,-11030230.2208869 2206665.60281915,-11030240.2562134 2206626.93001834,-11030254.5236691 2206548.56736561,-11030270.4882558 2206464.76501628,-11030267.0046951 2206450.17746528,-11030274.3105311 2206438.68110599,-11030287.9462984 2206371.78431538,-11030291.5700586 2206354.00655037,-11030297.8038871 2206339.14904461,-11030304.5322499 2206328.64768028,-11030319.4911922 2206317.09095084,-11030334.7978091 2206311.46006577,-11030355.2642735 2206308.0572781,-11030370.7567962 2206304.16719809,-11030385.7543568 2206297.72048526,-11030398.2275315 2206289.82810832,-11030406.3195441 2206280.65539146,-11030418.8056544 2206262.18082358,-11030436.0673867 2206228.61876968,-11030454.4702357 2206195.03065577,-11030470.3248621 2206162.23969153,-11030492.4562068 2206118.02951999,-11030520.6342804 2206068.70204915,-11030535.6550443 2206035.45513129,-11030645.0991617 2205826.66066547,-11030645.1613207 2205826.54169966,-11030672.5811285 2205774.07735635,-11030738.584255 2205647.78759019,-11030747.9504775 2205629.86629133,-11030796.7129838 2205536.56376658,-11030842.9286543 2205448.13373228,-11030858.1482961 2205419.01193903,-11030887.1457128 2205362.18610977,-11030905.4696463 2205332.41845524,-11030936.0507479 2205272.33143081,-11030941.4429408 2205261.73661129,-11030971.3474245 2205202.97894733,-11031043.9270829 2205058.02858647,-11031059.8220843 2205027.19424058,-11031165.0715968 2204823.02112693,-11031345.5861521 2204477.65921474,-11031355.8062128 2204461.46979114,-11031361.4985789 2204458.18972127,-11031366.634201 2204454.61529004,-11031372.0795064 2204449.63217537,-11031375.8205268 2204445.46340467,-11031378.4651442 2204439.85720551,-11031380.2662135 2204434.23382616,-11031381.8089435 2204427.4732172,-11031381.6881546 2204416.18935875,-11031387.3191146 2204401.42075069,-11031378.4779455 2204395.25267855,-11031369.1784785 2204388.76486817,-11031358.5781305 2204381.36951998,-11031355.5092277 2204379.22929323,-11031308.1405268 2204348.6282951,-11031268.5213133 2204323.39504604,-11031232.1557733 2204300.73518676,-11031193.1889287 2204277.98589234,-11031155.2513746 2204255.88173015,-11031115.5106357 2204230.98289424,-11031044.9449599 2204189.5389609,-11031004.5106006 2204164.84003913,-11030963.316273 2204139.67664205,-11030925.7030277 2204116.70058623,-11030888.0400007 2204093.69404237,-11030849.7532148 2204070.30634752,-11030811.2856816 2204046.80815897,-11030772.1942937 2204022.92870596,-11030735.698347 2204000.63465978,-11030699.8263613 2203978.7216583,-11030660.5544482 2203954.73159483,-11030621.4635085 2203930.85190608,-11030578.299149 2203904.48371277,-11030514.2105959 2203865.33313194,-11030457.0035891 2203830.38604195,-11030396.7087968 2203793.55232736,-11030321.4743122 2203747.59159071,-11030254.4518921 2203707.24897356,-11030198.4253551 2203673.44084422,-11030082.0229504 2203600.98982745,-11030034.6511094 2203570.16525841,-11029982.9827627 2203541.4367422,-11029935.6365256 2203510.41538849,-11029888.9622798 2203482.24981681,-11029841.3032783 2203453.48975913,-11029791.3044681 2203423.31761304,-11029748.9861086 2203397.78013639,-11029740.9053474 2203392.90368495,-11029647.5100979 2203335.22759685,-11029597.7707514 2203304.51082981,-11029546.7552709 2203273.00588234,-11029496.2837901 2203240.72393929,-11029449.9954826 2203210.90090472,-11029399.9613504 2203181.17032957,-11029348.994716 2203149.95838036,-11029301.4255175 2203121.92519359,-11029257.9550283 2203096.44836602,-11029252.4919934 2203093.34297103,-11029204.1016328 2203069.32891864,-11029197.4964622 2203066.0509976,-11029182.9352549 2203058.61022362,-11029168.3246858 2203051.23987127,-11029153.6984475 2203043.86170053,-11029088.0444888 2203000.94791325,-11029065.5433849 2202986.87284515,-11029026.3107339 2202965.69352829,-11028950.884059 2202919.15256026,-11028933.5624052 2202908.70418063,-11028795.6688349 2202824.07204296,-11028661.3142974 2202743.48747625,-11028591.3321045 2202701.16538857,-11028533.904055 2202664.7453396,-11028510.4446732 2202649.86762132,-11028267.1993071 2202500.245776,-11028104.5765652 2202403.51952045,-11028072.2208416 2202384.27441706,-11028009.3123591 2202343.82767517,-11027906.6413127 2202282.46175672,-11027756.0133839 2202189.69198639,-11027599.1919995 2202093.25854682,-11027555.9142439 2202066.21063826,-11027514.7579153 2202040.48834147,-11027495.2583885 2202028.30128993,-11027440.0533653 2201993.79841731,-11027346.2313756 2201937.52464479,-11027154.8281949 2201822.71984393,-11027158.9157324 2201790.4132947,-11027164.1223844 2201749.26199299,-11027184.6742284 2201580.54981855,-11027191.6658261 2201507.72730236,-11027193.8253971 2201459.21407914,-11027203.7848786 2201409.85881454,-11027213.1049729 2201351.61350963,-11027221.3070088 2201302.22797366,-11027228.2208526 2201260.84522944,-11027240.8698641 2201176.76539449,-11027249.1489115 2201127.54152306,-11027257.6168425 2201070.19599809,-11027271.1944875 2200988.68464565,-11027283.9788452 2200907.72838251,-11027284.0230312 2200907.44847351,-11027291.9356525 2200867.06868862,-11027292.1419672 2200866.01586008,-11027338.6994311 2200557.12960855,-11027345.8088243 2200520.51397292,-11027354.0738729 2200455.83797515,-11027355.5873437 2200442.06628169,-11027362.0134899 2200401.54276754,-11027369.7201852 2200347.59582034,-11027388.2230438 2200241.49154253,-11027403.9495358 2200141.67954464,-11027409.6395923 2200096.1463155,-11027411.8824751 2200045.3377188,-11027410.3552386 2200022.07831121,-11027408.7388452 2200004.78649695,-11027405.7433816 2199972.14585691,-11027404.3119898 2199945.98820974,-11027405.7350675 2199910.65193457,-11027407.2876728 2199868.95266074,-11027408.7942836 2199829.51585435,-11027398.762739 2199700.72094994,-11027386.6884911 2199610.07907547,-11027372.6752121 2199552.49909959,-11027359.486179 2199516.57942547,-11027320.5159195 2199379.55150014,-11027297.2130075 2199281.04104389,-11027254.6785617 2199099.15045789,-11027253.4074802 2199093.48086894,-11027232.3643201 2199002.94549689,-11027164.5942532 2198788.94271997,-11026975.4869692 2198195.61759994,-11026957.9166288 2198139.58113958,-11026949.5543127 2198102.15151383,-11026948.6715178 2198046.50621056,-11026984.794073 2197890.90737737,-11026986.2610633 2197884.58819618,-11027000.3172871 2197824.40032673,-11027000.4178906 2197824.05342272,-11027019.4676821 2197758.69759295,-11027028.670065 2197723.53182352,-11027084.1202895 2197459.26972271,-11027096.7822916 2197398.92543142,-11027108.663343 2197349.00634427,-11027169.9717358 2197054.02280175,-11027220.9804975 2196818.92370299,-11027236.2364354 2196752.68165917,-11027278.2627693 2196566.8226184,-11027284.7214564 2196535.64240255,-11027319.6692092 2196365.81169014,-11027326.4381153 2196332.91798345,-11027333.86069 2196298.81319004,-11027342.4090513 2196259.53564106,-11027370.7129293 2196120.97373054,-11027373.1801716 2196108.89538292,-11027394.6561707 2196006.74744989,-11027396.7827759 2195993.92386723,-11027405.8754408 2195939.09341614,-11027408.2456426 2195891.76410214,-11027413.1700326 2195822.56639849,-11027437.3937859 2195640.74520815,-11027441.5781501 2195617.87520009,-11027447.2792301 2195590.23759865,-11027447.5565537 2195588.89323316,-11027456.5634518 2195545.22924198,-11027456.8399519 2195543.88871161,-11027469.9405509 2195485.68610913,-11027478.8044755 2195430.05128967,-11027487.1233304 2195401.23110255,-11027506.3699779 2195353.54407514,-11027537.4597905 2195311.0511295,-11027616.9331071 2195205.20845002,-11027784.4258696 2194982.55439491,-11027794.4128857 2194966.17849993,-11027800.031216 2194948.35299659,-11027801.8836754 2194887.61173609,-11027806.227921 2194814.54758124,-11027809.1288151 2194741.07026836,-11027807.35409 2194690.12363967,-11027808.1738782 2194649.83682619,-11027807.093706 2194569.82406953,-11027808.6141574 2194509.27151321,-11027809.637499 2194424.44382571,-11027812.7879259 2194309.96506005,-11027812.8436629 2194261.53978645,-11027811.8927429 2194235.08722419,-11027813.9520263 2194212.41255346,-11027817.1648674 2194192.68094828,-11027820.9796218 2194177.91127565,-11027829.3117022 2194148.38632915,-11027833.8289207 2194133.6310527,-11027841.2139017 2194116.1066489,-11027866.9095764 2194072.58611578,-11028000.2584204 2193902.24466992,-11028073.7159185 2193801.6928187,-11028139.5923778 2193713.92701611,-11028178.5985311 2193661.93213254,-11028225.1053542 2193602.98275551,-11028296.8050966 2193503.35293364,-11028324.6623508 2193467.71555914,-11028362.5473537 2193419.24947735,-11028540.6797131 2193178.04421533,-11028619.5255606 2193070.97040521,-11028690.4039453 2192975.80360759,-11028735.0314426 2192909.97870597,-11028796.4037304 2192822.43935563,-11028808.6069713 2192802.89385416,-11028814.7741227 2192792.46441822,-11028832.5889592 2192780.56106717,-11028854.7801156 2192756.07413174,-11028892.207649 2192706.17813517,-11028924.0241619 2192665.52046166,-11028990.7860923 2192582.71044092,-11029038.6757435 2192513.543272,-11029062.0646707 2192497.91906675,-11029064.3509046 2192499.47846654,-11029091.3234292 2192511.08548985,-11029122.8946966 2192519.77857922,-11029170.9919667 2192530.08970645,-11029194.7302979 2192534.36091704,-11029195.0892857 2192511.98773766,-11029131.8403334 2192499.81014974,-11029103.7898341 2192489.76017762,-11029084.6198394 2192480.41872935,-11029065.4818624 2192469.4988359,-11029060.2792471 2192465.25403946,-11029048.6892316 2192455.79764803,-11029040.5450175 2192449.15284208,-11029033.0549785 2192443.04165279,-11029006.318989 2192421.39997146,-11028886.2166558 2192310.45454657,-11028802.6720681 2192237.70113728,-11028551.5502013 2192013.07696321,-11028529.9728998 2191992.15066,-11028497.3697696 2191964.08321143,-11028450.6607333 2191923.78582322,-11028441.5890237 2191912.9609461,-11028433.4882637 2191899.63571547,-11028418.1732319 2191855.10783146,-11028413.1790689 2191817.63456234,-11028408.5686164 2191762.5002845,-11028393.252464 2191471.58632391,-11028383.2158152 2191430.37777202,-11028372.0956601 2191392.25680177,-11028363.1767119 2191374.68275888,-11028337.2624669 2191342.76195307,-11028276.9360994 2191282.13892434,-11028146.4198799 2191148.38935309,-11028117.5562129 2191116.40794037,-11028100.1311619 2191102.47645313,-11028063.4747798 2191080.51439608,-11027973.4756635 2191048.54714119,-11027851.6539669 2191005.74453498,-11027758.7401217 2190972.0195671,-11027685.9351213 2190944.64657146,-11027533.6000624 2190888.91273901,-11027377.0430698 2190833.51472955,-11027300.1717891 2190798.84578234,-11027075.5185213 2190712.7741854,-11026730.6254738 2190589.43614032,-11026646.6183458 2190553.34465782,-11026256.957602 2190372.23759706,-11026186.6864975 2190344.91094989,-11026141.9232255 2190327.8673459,-11026085.7901402 2190310.16398476,-11026012.7134119 2190296.35100462,-11025803.2250381 2190273.34981773,-11025724.9700799 2190265.36607006,-11025407.6237544 2190238.8515797,-11025341.9336922 2190234.94383967,-11025330.41823 2190231.69804941,-11025327.6566944 2190230.60305546,-11025305.9580646 2190216.26054965,-11025283.0713065 2190196.86607626,-11025258.1296962 2190160.71874688,-11025251.1580185 2190136.37318717,-11025249.0903531 2190113.85118854,-11025245.623825 2190077.30397456,-11025240.1116523 2189996.60492636,-11025232.9916181 2189953.19611352,-11025219.5370025 2189930.86227113,-11025208.8236162 2189918.76425742,-11025197.6193432 2189910.04916609,-11025184.243733 2189897.53991579,-11025170.7459873 2189887.83197451,-11025157.2688289 2189880.69949979,-11025156.1176691 2189880.14362125,-11025132.6959405 2189868.83352518,-11024969.1310732 2189847.62340467,-11024855.2412657 2189829.98873387,-11024785.4901646 2189830.89159513,-11024705.8122732 2189842.6942445,-11024497.033602 2189877.75657128,-11024317.9834473 2189907.97875904,-11024237.5454399 2189920.73771624,-11023989.2034506 2189960.87713469,-11023889.9066581 2189980.39918887,-11023775.2956753 2190000.98467486,-11023348.6805181 2190069.74193728,-11023298.71217 2190071.26894051,-11023277.0783073 2190057.24507291,-11023238.2172587 2190019.95839832,-11023195.2821578 2189975.80046403,-11023113.8355764 2189894.86069779,-11023054.9867548 2189841.3788719,-11023053.9679148 2189840.45285624,-11023028.9865195 2189825.22782709,-11023006.0086451 2189796.88314346,-11022930.4767539 2189698.03903693,-11022850.5443548 2189594.5791525,-11022783.7240421 2189509.48938407,-11022695.10724 2189391.14560776,-11022625.0577327 2189299.20288356,-11022596.6586648 2189259.0249479,-11022567.6628881 2189220.531115,-11022502.6607269 2189156.40275475,-11022398.6089601 2189050.7427216,-11022366.6877663 2189017.84239952,-11022352.6579888 2189009.99445297,-11022344.7920794 2189009.82975704,-11022271.1032593 2188930.21119666,-11022224.1175482 2188864.76369962,-11022189.8439455 2188782.6186992,-11022150.9116879 2188654.00846442,-11022089.0848056 2188436.70871765,-11022031.3562141 2188238.72253854,-11021996.3124931 2188139.6007446,-11021967.8002067 2188050.79437589,-11021942.0738706 2187990.31858935,-11021895.3498484 2187912.43973303,-11021849.5860267 2187842.49723655,-11021745.9810312 2187688.78927891,-11021616.4426972 2187484.78071021,-11021525.9987026 2187292.90263047,-11021435.8617092 2187086.33209533,-11021410.1389207 2187025.85904193,-11021385.1645048 2186983.49479305,-11021354.4317625 2186947.79448744,-11021329.4342654 2186906.56062647,-11021301.2538969 2186856.21368983,-11021272.2786358 2186790.01895189,-11021245.8749293 2186732.61384612,-11021240.6527722 2186720.20682354,-11021240.5366045 2186720.11869276,-11021229.5610812 2186671.30293894,-11021226.8494881 2186645.78812902,-11021213.481915 2186623.2097515,-11021204.7428499 2186607.6421558,-11021162.2213977 2186524.38045201,-11021148.9557146 2186498.69964201,-11021144.6240807 2186491.51308496,-11021095.9782335 2186446.10791399,-11021066.2839654 2186422.60359715,-11021049.3105981 2186407.40344149,-11021033.3480215 2186397.70016207,-11021005.8386479 2186380.97757435,-11020977.5092009 2186367.92616553,-11020949.4420536 2186359.92890531,-11020909.2316835 2186350.8388082,-11020773.6001437 2186319.15012261,-11020700.9765071 2186304.62553291,-11020629.5885677 2186288.27354195,-11020573.5706355 2186274.67012294,-11020562.6857454 2186271.51103888,-11020562.1958043 2186271.36888113,-11020521.0593179 2186259.43021412,-11020469.6451352 2186246.42382306,-11020355.7104431 2186212.70512705,-11020342.6766429 2186209.45127714,-11020323.21424 2186205.38279745,-11020239.5926921 2186183.62118798,-11020177.6440558 2186170.86235437,-11020129.030652 2186158.25626736,-11020108.4104809 2186151.46675366,-11020077.6968693 2186144.0556594,-11020032.928664 2186130.66835407,-11020015.6000968 2186125.33440526,-11019962.6861744 2186111.53743661,-11019944.3082391 2186107.76340156,-11019862.2671443 2186088.22820311,-11019728.7738246 2186062.11916899,-11019082.6090698 2185940.09165237,-11018620.3143081 2185856.84107151,-11018141.0105097 2185767.0600576,-11017802.9984838 2185703.22446187,-11017786.0965332 2185700.0315828,-11017298.0093178 2185607.79625675,-11016983.5422441 2185548.5399232,-11016808.6297185 2185511.7750859,-11016716.1145951 2185484.77724802,-11016672.4878196 2185471.62733028,-11016604.7011448 2185451.19793516,-11016390.454607 2185385.0641471,-11015983.0373845 2185259.60155435,-11015685.8442541 2185168.65816656,-11015680.5876054 2185167.04954381,-11015207.1225405 2185019.64108092,-11015189.6661469 2185014.67432021,-11015172.7444199 2185007.01668371,-11015171.1074855 2185006.62003121,-11015170.7676363 2185006.5153278,-11014971.2391738 2184945.05611108,-11014683.7796032 2184854.38499395,-11014658.6965095 2184846.19212284,-11014604.072672 2184830.27399296,-11014570.1263251 2184820.02319385,-11014539.2279053 2184810.69274679,-11014534.8824566 2184809.3538285,-11014467.194053 2184788.49773373,-11014429.1980381 2184776.79034644,-11014389.7564164 2184764.63747336,-11014276.7298854 2184730.32937171,-11014202.1763113 2184707.4868178,-11014178.4311461 2184700.37415544,-11014066.7481641 2184666.92028094,-11014029.3466526 2184656.33498077,-11014005.5603237 2184649.60291048,-11013916.087076 2184622.57984435,-11013852.9484355 2184603.00016135,-11013805.3211131 2184588.03834225,-11013698.4352645 2184554.4604303,-11013643.9121586 2184537.07747823,-11013625.2077615 2184531.62666673,-11013601.7425606 2184524.11571729,-11013496.228312 2184493.71672871,-11013449.8140938 2184477.9227851,-11013406.9805849 2184464.3047472,-11013353.2565799 2184445.7061825,-11013176.7067834 2184386.51695825,-11012967.5327163 2184320.49246118,-11012424.205355 2184148.98717508,-11012214.1369395 2184084.23516167,-11012165.2118393 2184079.14426257,-11012114.0832911 2184081.43267124,-11012038.685435 2184091.33754607,-11011988.0522164 2184109.91711922,-11011956.3671027 2184125.34432137,-11011913.6374317 2184152.74365453,-11011840.7356386 2184211.54443661,-11011644.8006341 2184387.25115368,-11011510.7788715 2184508.53471323,-11011510.3927663 2184508.9016682,-11011483.7181265 2184533.28679842,-11011456.7199009 2184557.98168453,-11011430.1782365 2184582.25889164,-11011373.7418369 2184633.88016908,-11011343.9154304 2184661.16150873,-11011313.9523368 2184688.56787031,-11011284.6422722 2184715.3769413,-11011265.1424682 2184733.21277357,-11011259.0714068 2184738.58390834,-11011229.1061355 2184765.09514135,-11011201.4987257 2184793.85753992,-11011146.1473841 2184843.70929146,-11011131.8927261 2184855.95118811,-11011117.7703493 2184869.89205848,-11011079.0795406 2184905.34909456,-11010987.764928 2184989.190586,-11010971.9064145 2185005.46817428,-11010960.537994 2185016.75493334,-11010932.8597936 2185041.76552503,-11010898.1708706 2185071.37324465,-11010837.6316168 2185127.21816607,-11010812.8468396 2185150.93457938,-11010771.6305573 2185186.16724367,-11010756.1522132 2185200.41780976,-11010739.6408729 2185215.6637221,-11010724.8546758 2185229.08131431,-11010700.7799356 2185251.11694111,-11010672.0862102 2185276.27510651,-11010642.9972739 2185304.1382725,-11010596.9092903 2185346.3887807,-11010587.93471 2185354.0389294,-11010528.8623618 2185406.31097006,-11010500.6664276 2185431.81897824,-11010479.3091254 2185452.89595016,-11010445.7689773 2185483.88513228,-11010384.8859271 2185539.89201937,-11010378.8534403 2185546.03670525,-11010363.2058308 2185560.28354749,-11010338.8002233 2185581.97280915,-11010332.2730018 2185587.59788218,-11010291.0450991 2185624.81630704,-11010258.4703662 2185656.38430545,-11010232.8159304 2185681.26906991,-11010205.6736759 2185704.76455826,-11010197.256243 2185712.04469292,-11010180.5827584 2185726.94778848,-11010097.9806272 2185805.04128362,-11010076.845323 2185823.57882389,-11010054.1642456 2185843.43968359,-11010041.4390431 2185855.03626349,-11010034.3988242 2185860.98939677,-11010030.1093809 2185864.45803791,-11009995.5078272 2185894.0501631,-11009995.4023022 2185894.15214921,-11009969.7020337 2185918.73564841,-11009953.9768214 2185931.87813298,-11009938.0508719 2185945.76714093,-11009919.0473807 2185964.49176181,-11009885.6555676 2185996.33212324,-11009879.2892093 2186002.29988085,-11009840.5856571 2186038.09554742,-11009830.8867524 2186046.74498872,-11009806.5848605 2186066.86951268,-11009789.8479016 2186077.84392381,-11009769.8114715 2186085.54228811,-11009748.8666871 2186094.90057455,-11009718.4490913 2186104.13501397,-11009692.0284805 2186109.66686279,-11009643.2816733 2186110.64260198,-11009616.6914022 2186108.36839597,-11009566.5471196 2186095.91407152,-11009456.4682452 2186038.86442116,-11009465.8325568 2186018.06480724,-11009475.4029361 2185988.10034951,-11009484.0799535 2185949.85492047,-11009485.4823973 2185934.44007603,-11009483.7731126 2185914.28792442,-11009481.9327754 2185900.23918529,-11009480.1200864 2185886.72270517,-11009452.5138958 2185840.3322014,-11009427.9160127 2185805.31456699,-11009391.6124574 2185783.33241234,-11009288.6424725 2185733.44584364,-11009191.183491 2185689.53208368,-11009186.5903975 2185687.27701863,-11009110.4183988 2185650.93422067,-11009096.345403 2185644.21973138,-11009087.9667081 2185642.02559747,-11009078.9559534 2185639.6659832,-11008975.8403362 2185593.14371115,-11008864.4472512 2185538.69561624,-11008745.4068938 2185481.82688034,-11008521.6515956 2185376.35652766,-11008485.8227334 2185348.86401066,-11008484.2717279 2185347.67386604,-11008413.05168 2185299.53826599,-11008322.3374914 2185238.84553134,-11008287.5540242 2185216.51118193,-11008250.0959585 2185193.46039441,-11008214.0578225 2185171.4072101,-11008137.0387751 2185122.26607054,-11007865.2468161 2184947.18681991,-11007841.8280511 2184931.57851084,-11007758.5306692 2184889.38830607,-11007685.3111379 2184864.46743223,-11007641.3520385 2184850.78616721,-11007561.0812267 2184827.12402377,-11007460.5559752 2184798.07163185,-11007438.2255735 2184791.22310346,-11007402.4085658 2184777.53752646,-11007401.363513 2184777.27075614,-11007378.7332641 2184762.78447873,-11007354.6973264 2184750.09579123,-11007267.077051 2184699.15074698,-11007183.7671443 2184650.07339974,-11007124.9722743 2184612.98946375,-11007077.1003149 2184586.37405085,-11007055.4522149 2184573.05936563,-11006998.5347794 2184543.59170027,-11006940.1571054 2184514.6117379,-11006899.3138553 2184495.07848954,-11006875.9424783 2184477.70263982,-11006772.3261216 2184395.3214023,-11006737.6615606 2184371.60620701,-11006655.3391717 2184309.54366445,-11006519.0692456 2184214.25596378,-11006485.665163 2184198.21980007,-11006484.5285039 2184197.74788177,-11006474.0614378 2184184.15900067,-11006436.5422798 2184168.58244747,-11006386.4019317 2184148.76446884,-11006350.1488084 2184134.03278033,-11006147.1787286 2184052.2354357,-11005933.3235747 2183967.2283148,-11005816.0090692 2183917.30652806,-11005539.87227 2183804.58301634,-11005409.8377215 2183750.06661779,-11005376.027715 2183736.45614193,-11005309.1915255 2183706.01910108,-11005192.4327395 2183641.37825728,-11005106.793739 2183587.23187893,-11004956.0376126 2183484.24027242,-11004892.372444 2183437.44772553,-11004874.4991357 2183422.10067032,-11004865.4165188 2183413.42114397,-11004859.2272485 2183407.34924367,-11004850.5984555 2183397.51606017,-11004822.6717952 2183309.45049861,-11004835.2419107 2183231.53775567,-11004913.1087217 2182920.40151368,-11004938.4027142 2182849.75310844,-11004952.384228 2182811.33353748,-11004959.4675643 2182787.87525718,-11004965.4479067 2182771.94919496,-11004978.4086434 2182737.28558728,-11005005.1657183 2182672.69976644,-11005016.0233729 2182648.38030319,-11005032.4911888 2182625.12897331,-11005049.7536367 2182608.50706699,-11005063.1594126 2182596.52297486,-11005082.2575389 2182581.8307335,-11005169.3019198 2182508.18286614,-11005194.215627 2182485.11756237,-11005214.4368807 2182461.94893527,-11005233.3470539 2182430.9804108,-11005249.6268618 2182401.58664642,-11005258.2490502 2182384.3257777,-11005266.9076989 2182360.74094816,-11005295.5669846 2182276.72400599,-11005314.2919952 2182213.34132861,-11005317.8769222 2182205.41014175,-11005345.130334 2182129.05610792,-11005352.0974381 2182120.30661328,-11005317.5047734 2182104.66570921,-11005007.9568747 2181999.49670376,-11004835.6050083 2181941.43556919,-11004735.7579357 2181914.45883915,-11004624.0268735 2181869.62933349,-11004563.7232841 2181835.21588828,-11004546.6904376 2181819.73433789,-11004521.8588959 2181797.16419388,-11004460.0550288 2181694.0587356,-11004357.9445675 2181506.97567077,-11004239.7657485 2181283.93063745,-11004216.8824196 2181251.20798383,-11004182.3171121 2181213.14057392,-11004128.2013835 2181144.11973983,-11004103.4858308 2181118.13935568,-11004080.4919339 2181090.50126903,-11004058.8129629 2181079.84860858,-11004040.3922964 2181074.35478638,-11003998.6081618 2181058.17099807,-11003939.9770787 2181041.61482997,-11003834.3231492 2181017.23648821,-11003797.5563815 2181002.85874808,-11003769.2129537 2180988.66717053,-11003682.4985141 2180946.05485052,-11003592.6003099 2180894.89368747,-11003494.4646434 2180835.0718838,-11003414.6385204 2180785.82849125,-11003384.6483323 2180769.90435907,-11003336.2010845 2180750.18032331,-11003274.4250753 2180723.37880097,-11003171.0151986 2180673.612321,-11003130.2289211 2180650.55475056,-11003106.2043281 2180631.4826908,-11003031.0261837 2180600.99236195,-11002913.8810272 2180562.78924868,-11002861.2818563 2180553.01948535,-11002787.8262749 2180557.75253471,-11002748.629029 2180556.88343694,-11002721.775317 2180548.12549897,-11002694.9215282 2180539.36751795,-11002681.4052533 2180539.06776121,-11002666.3585606 2180546.89651631,-11002653.8364196 2180562.94372947,-11002642.5167778 2180585.81958624,-11002629.9348731 2180604.586327,-11002602.18692 2180636.62084514,-11002566.2993285 2180669.83511849,-11002541.4332736 2180693.77105405,-11002524.6769978 2180717.88692761,-11002514.6788929 2180742.15277488,-11002512.8204498 2180765.23872512,-11002512.6323027 2180773.82041774,-11002512.1347752 2180796.51343053,-11002507.6624555 2180815.46026308,-11002499.2246088 2180830.23781781,-11002481.3550998 2180843.4455479,-11002463.5450854 2180853.93382114,-11002422.488546 2180876.15011079,-11002366.4146483 2180904.83519112,-11002322.2379674 2180921.3884844,-11002282.5129236 2180890.39713516,-11002240.9037185 2180850.71870802,-11002217.5874843 2180824.1950994,-11002189.675621 2180787.03064654,-11002122.3148385 2180685.26248811,-11002118.6808245 2180679.7722192,-11002012.1423808 2180521.07278954,-11001985.0214722 2180482.32517936,-11001901.2982331 2180360.40249449,-11001864.6217751 2180303.933774,-11001756.6742705 2180138.29360813,-11001749.1308804 2180127.2667675,-11001712.8651586 2180074.25431686,-11001713.9345898 2180083.18231687,-11001711.7425595 2180090.43443401,-11001709.2068855 2180098.16391336,-11001705.6739673 2180102.7150216,-11001700.5174146 2180107.09309714,-11001694.8862624 2180109.12938216,-11001686.7159756 2180109.38001915,-11001677.7721495 2180105.72264502,-11001670.1832514 2180099.06918842,-11001662.1839038 2180091.54201514,-11001653.4799351 2180084.51717244,-11001639.706214 2180038.08907701,-11001623.3990135 2179996.67998052,-11001609.4254454 2179961.19657628,-11001587.4099256 2179886.48409346,-11001501.2838572 2179748.77802512,-11001331.1934128 2179476.81720432,-11001292.5543963 2179410.71480143,-11001209.8916913 2179289.6664968,-11001126.7603874 2179182.78811986,-11001046.8847903 2179125.21377575,-11000960.8471915 2179076.6914667,-11000896.6102116 2179060.85690015,-11000802.7560098 2179047.96822732,-11000564.5805426 2179028.90124273,-11000250.312987 2179010.85169005,-11000079.2129582 2179002.89222482,-10999990.2791576 2178975.32295523,-10999982.2556103 2178972.65899386,-10999958.7856947 2178964.86634187,-10999935.2388668 2178957.04823024,-10999917.6105891 2178951.19513617,-10999871.7528923 2178912.2374631,-10999850.1261588 2178885.64426052,-10999802.244453 2178821.53737461,-10999775.2566687 2178742.32123452,-10999767.9733359 2178651.61665064,-10999781.4159473 2178596.24362831,-10999832.4464802 2178437.87919257,-10999891.5787598 2178324.46177803,-10999903.5109878 2178276.50335726,-10999911.4377584 2178197.7290929,-10999901.4241183 2178132.52123839,-10999878.1632075 2178072.6572943,-10999868.7837699 2178055.10183641,-10999847.9352098 2178016.07966714,-10999784.2194331 2177944.54878991,-10999749.7712017 2177927.20001053,-10999675.7465988 2177896.0430252,-10999587.3658992 2177879.67053452,-10999529.8635878 2177887.11962944,-10999396.4612303 2177913.24356852,-10999287.3653704 2177938.72363467,-10999214.7030574 2177950.90740766,-10999144.0869348 2177952.7515617,-10999095.0106341 2177942.98740945,-10999053.6503085 2177925.29899018,-10999003.0422037 2177889.83613215,-10998968.3952496 2177854.57756335,-10998937.6248308 2177804.61295718,-10998916.3155114 2177747.87089904,-10998904.5247146 2177684.26692819,-10998889.1476859 2177584.31351886,-10998852.5084512 2177500.66709726,-10998806.5815108 2177422.34832566,-10998736.6610352 2177369.73002136,-10998692.9025127 2177346.45320593,-10998676.9721954 2177337.97919968,-10998662.0703473 2177330.05236326,-10998646.4879509 2177321.76340532,-10998564.6516037 2177277.09939924,-10998487.8720412 2177235.19485044,-10998470.1357187 2177224.51409956,-10998415.5999245 2177191.67290847,-10998406.456893 2177186.1670122,-10998400.763151 2177182.73822222,-10998273.3142303 2177104.38798047,-10998232.6728403 2177079.40311592,-10998202.5743413 2177060.89948008,-10998191.1488005 2177051.16831012,-10998109.1241703 2176980.12056621,-10998044.3537026 2176930.73618058,-10997924.8117872 2176837.69064694,-10997907.8526122 2176815.05809382,-10997898.6254423 2176806.22274563,-10997806.4038779 2176717.91669203,-10997684.4290694 2176601.57582926,-10997557.9841047 2176476.93649404,-10997434.3609251 2176340.56491469,-10997385.8330361 2176249.6297784,-10997367.3697393 2176208.53076504,-10997352.444347 2176159.88345844,-10997337.6698121 2176104.45918619,-10997325.2143367 2176058.41039468,-10997313.3370907 2176024.24053803,-10997305.5383568 2175996.09552136,-10997294.4467735 2175964.48618587,-10997280.4203874 2175913.31706892,-10997267.6824841 2175879.97570151,-10997252.4315891 2175847.12471367,-10997217.7189904 2175719.14034204,-10997186.2991365 2175616.72780554,-10997176.9106436 2175582.08926928,-10997156.7147135 2175507.57694564,-10997133.1880717 2175429.07424932,-10997096.3022551 2175345.18567617,-10997065.7382637 2175280.08539169,-10997039.5853198 2175243.9002443,-10996927.2577114 2175143.05684158,-10996889.4920495 2175109.27289288,-10996740.1187568 2174983.63764028,-10996654.0594539 2174913.89630904,-10996574.5858807 2174851.08336161,-10996547.0524815 2174821.03843032,-10996530.1751369 2174802.62140631,-10996515.6132897 2174776.29527398,-10996505.7954584 2174752.38909494,-10996437.9703802 2174583.80984406,-10996422.9691305 2174544.60024185,-10996420.2540163 2174537.5037168,-10996403.0982236 2174500.22912541,-10996387.2214291 2174450.15831248,-10996353.7445413 2174367.8742206,-10996343.4790915 2174337.13350052,-10996335.5694965 2174314.07318751,-10996311.112206 2174239.79117758,-10996300.6834245 2174207.13147321,-10996278.0072751 2174116.56935779,-10996244.2166282 2173988.44517681,-10996232.3385452 2173951.76294634,-10996204.3781258 2173857.31303347,-10996184.7580631 2173798.75931049,-10996158.0692096 2173725.12850223,-10996150.2159898 2173704.54202189,-10996137.0421119 2173679.10008113,-10996069.3145781 2173521.17835456,-10996028.8429724 2173414.30897188,-10995970.2211949 2173234.36549462,-10995946.8074936 2173161.30218161,-10995875.7169865 2172940.08152139,-10995870.6406798 2172920.57649657,-10995861.1746006 2172887.37143438,-10995850.8323349 2172851.0925925,-10995847.5659627 2172840.19997949,-10995843.9367268 2172826.80594179,-10995837.7625794 2172808.18462281,-10995836.3133252 2172803.8134286,-10995820.3614457 2172753.22004848,-10995819.8507006 2172751.59998432,-10995807.7752823 2172716.47491888,-10995781.0308135 2172638.67990617,-10995759.563681 2172581.40922366,-10995735.269663 2172511.42888829,-10995728.4921701 2172477.99179896,-10995716.8450451 2172421.23674999,-10995712.3998918 2172392.78457094,-10995711.0764454 2172381.79472654,-10995732.7828688 2172190.43225048,-10995747.0459089 2172154.13038599,-10995753.6346689 2172140.72168679,-10995758.7250399 2172134.05795583,-10995762.9274751 2172126.92225887,-10995769.8137783 2172120.29914364,-10995780.3021555 2172113.30548897,-10995792.3947193 2172108.32314791,-10995849.3543891 2172145.45211109,-10995891.9246645 2172185.25406189,-10995921.8524505 2172208.57692247,-10996021.1974323 2172282.04637021,-10996104.080794 2172344.35944342,-10996201.0554594 2172420.17529001,-10996240.4313124 2172450.60307692,-10996305.2622324 2172496.18962308,-10996309.1938723 2172496.89427307,-10996407.8801033 2172550.60010427,-10996497.7023167 2172590.94173792,-10996500.1022388 2172594.27983214,-10996600.6032365 2172642.69769988,-10996653.8401097 2172669.72637671,-10996639.8823016 2172698.8398169,-10996712.7887924 2172732.41626263,-10996762.2941645 2172627.60958516,-10996769.2935008 2172615.90410601,-10996801.1867662 2172545.44344095,-10996805.6981735 2172531.98704921,-10996825.1253744 2172491.75112588)';
		var g = "MULTILINESTRING((-11383915.282275 2497119.64059821,-11383791.4734942 2497023.3930387,-11383768.9384333 2497005.32583884,-11383930.4492041 2496888.86638543,-11383959.1043871 2496873.29665941,-11383975.9011263 2496865.90763183,-11383985.2084569 2496862.80386634,-11383990.6909607 2496860.97556922,-11384030.5989157 2496852.99042411,-11384050.3322415 2496852.08883658,-11384078.021677 2496851.76705974,-11384113.6318994 2496853.71379641,-11384173.9729994 2496857.01244544,-11384245.7324318 2496861.33536522,-11384352.3197779 2496868.45666654,-11384499.2157179 2496877.16890795,-11384623.9132869 2496884.41094021,-11384711.9522497 2496890.06014667,-11384750.6071116 2496892.12097775,-11384804.9030191 2496896.03390045,-11384814.7909246 2496896.57070997,-11384821.4502039 2496896.93215337,-11384830.540833 2496897.42561139,-11384878.8157018 2496900.13623945,-11384884.0879103 2496900.44477262,-11384905.5241779 2496901.69923891,-11384947.6019112 2496902.60617719,-11384955.1644273 2496903.0527266,-11385023.9151663 2496907.29993602,-11385085.2896382 2496911.45311831,-11385112.2027928 2496912.69297177,-11385125.4675795 2496913.30399525,-11385264.284573 2496921.96200521,-11385280.714839 2496922.15149685,-11385316.8266381 2496924.06495688,-11385373.4571945 2496928.1296321,-11385379.0374787 2496928.53017338,-11385392.1133608 2496929.46864739,-11385406.5124239 2496930.5021021,-11385461.9711282 2496933.76495403,-11385537.6136632 2496939.27429912,-11385612.6283057 2496944.30465927,-11385661.2521171 2496947.5602495,-11385717.1692313 2496950.79257058,-11385802.5238085 2496956.68611604,-11385861.3417475 2496960.93813661,-11385874.9497447 2496965.36687661,-11385884.2181016 2496970.91859688,-11385899.7559308 2496976.36681122,-11385904.1087615 2496975.89731548,-11385909.6059161 2496974.73414314,-11385916.4707259 2496969.88067443,-11385920.5894299 2496966.87636758,-11385921.043738 2496964.80121961),(-102.28147 21.87867,-102.28203 21.87873,-102.28214 21.87874,-102.28433 21.87898,-102.28482 21.87902,-102.28548 21.87909,-102.28598 21.87914,-102.28683 21.87922,-102.28712 21.87926,-102.28794 21.87935,-102.28824 21.87937,-102.28846 21.87938,-102.28902 21.87938,-102.28904 21.87938,-102.29034 21.87929,-102.29085 21.87926,-102.29143 21.87922,-102.29186 21.87919,-102.29275 21.87913,-102.29304 21.8791,-102.29354 21.87904,-102.29367 21.87902,-102.29376 21.87899,-102.29382 21.87898,-102.29407 21.87892,-102.29491 21.87873,-102.29496 21.87872,-102.29504 21.87871,-102.29587 21.87852,-102.29595 21.8785,-102.29698 21.87826,-102.297 21.87826,-102.29773 21.87808,-102.29887 21.87781,-102.29896 21.87779,-102.29897 21.87779,-102.29951 21.87766,-102.30037 21.87742,-102.30113 21.8772,-102.30125 21.87717,-102.3014 21.87714,-102.30183 21.87701,-102.30314 21.87663,-102.30765 21.87539,-102.3082 21.87524,-102.3088 21.87507,-102.30898 21.87503,-102.30914 21.87498,-102.30932 21.87494,-102.30954 21.87488,-102.31028 21.87467,-102.31081 21.87455,-102.31128 21.87442,-102.31133 21.8744,-102.31185 21.8743,-102.31193 21.87428,-102.312 21.87425,-102.31204 21.87424,-102.3122 21.87421,-102.31237 21.87415,-102.31292 21.87395,-102.31335 21.87379,-102.31369 21.87364,-102.31396 21.87353,-102.31425 21.87342,-102.31442 21.87336,-102.31459 21.8733,-102.31482 21.87321,-102.31514 21.87308,-102.31517 21.87307,-102.31594 21.87276,-102.31726 21.87222,-102.31846 21.87173,-102.31856 21.87169,-102.31865 21.87166,-102.31874 21.87163))";
		Routing.event({action:'add',geometry:g,type:'segment',params:{title:'informa',description:'datos'}})
		setTimeout(function(){
		    Routing.event({action:'delete',type:'pay'});
		},2000)
		
		/*
		var g = {"direction":"Gire a la derecha en Avenida Insurgentes Norte",
			"turn":2,
			"line":"LINESTRING(-11037819.5536181 2207138.69655984,-11037806.0437381 2207198.76787818,-11037793.1981682 2207235.99974466,-11037765.4227647 2207309.96753743,-11037755.0869409 2207335.22631886,-11037697.1469226 2207476.82033064,-11037678.3989533 2207529.86761647,-11037675.0730486 2207553.22314104,-11037673.8392668 2207561.88738238,-11037611.3228466 2207938.5957181,-11037561.2508035 2208188.89747179,-11037528.8441781 2208383.99675112,-11037509.9468986 2208474.26457748,-11037499.2847209 2208501.22623572,-11037488.3619438 2208530.07329788,-11037481.6408668 2208543.65979828,-11037458.7366938 2208588.16809424,-11037447.161528 2208604.35499611,-11037430.4005481 2208626.66581369,-11037418.9548356 2208639.00931436,-11037400.3065035 2208659.56879517,-11037378.6002472 2208677.28898661,-11037334.7861213 2208710.59181162,-11037232.565123 2208788.28857348,-11037196.8124574 2208815.3844782,-11037179.1201685 2208828.7928409,-11037150.0042233 2208852.15015428,-11037106.9777155 2208883.08207847,-11037091.7728181 2208894.01285558,-11037066.6173936 2208913.89108626,-11037039.0772297 2208940.51555768,-11037024.0812517 2208958.89861469,-11037004.4827356 2208986.48146623,-11036985.7731179 2209018.47067416)",
			"centroid":"010100002031BF0D007A9D735F680D65C106B2E7D8C7D84041"
			};
		Routing.event({action:'add',geometry:g.line,description:g.direction,type:'segment'});
		
		
		
		*/
		
		var params = {lon:-11394874.503839,lat:2512338.90335061,type:'routing',params:{nom:'Identificaci&oacute;n',desc:'informacion',image:'cyclone'}};
		var marca = Marker.add(params);
		var marca = [marca];
		setTimeout(function(){
		    Marker.event({action:'select',items:marca,type:'routing'});
		    
		},3000);
		mirrorCluster();
	    });
	    $("#imprime").click(function(){
		Marker.buildMirror();
		exportMap('gif');
		Marker.clearMirror();
		//exportMap('png');
		
	    });
	    
	    
	    var eventos={
		Stop:function(){
		    Route.event({action:'endTracking'});
		},
		byCar:function(){
		    Route.event({action:'starSnap'});
		},
		Walking:function(){
		    Route.event({action:'stopSnap'})
		}
		
	    }
	    demoTraking = function(){
		Route.event({action:'runDemo',eventCatch:function(e){$("#map").tracking({data:e,controller:eventos});}})
	    }
	    $("#locate").click(function(){
		Route.event({action:'runDemo',eventCatch:function(e){$("#map").tracking({data:e,controller:eventos});}})
		});
	    $("#track").click(function(){
		Route.event({action:'starTracking',eventCatch:function(e){$("#map").tracking({data:e,controller:eventos});}})
		});
	    $("#snap").click(function(){Route.event({action:'starSnap'})});
	    $("#endtrack").click(function(){Route.event({action:'endTracking'})});
	    $("#ruta").click(function(){
		
		//console.log(getPxFromLonlat(-11044172.4761245,2139087.50120208));
		starCluster();
	    });
	    activeControl({control:'identify',active:true});
	    onResizeWindow();
	    
	    
	    var pointProve = new OL.LonLat(-102,22).transform('EPSG:4326','EPSG:9102008');
    };
    
    var onResizeWindow=function(){
	$( window ).resize(function() {
	    updateSize();
	});
    };
    var intersectExtent = function(lon,lat){
	var response = false;
	//var extent = Map.map.getExtent();
	var extent = Map.map.restrictedExtent;
	var geometria = extent.toGeometry();
	var point = new OL.Geometry.Point(lon,lat);
	
	if(geometria.intersects(point)){
	    response = {lon:lon,lat:lat};
	}else{
	    point = new OL.Geometry.Point(lat,lon);
	    if(geometria.intersects(point)){
		response = {lon:lat,lat:lon};
	    }
	}
	return response;
    }
    var isValidCoordinate = function(lon,lat){
	lon = parseFloat(lon);
	lat = parseFloat(lat);
	var r = transformToMercator((lon)*-1,lat);
	var response = intersectExtent(r.lon,r.lat);
	if(!response){
	    var r = transformToMercator(lon,(lat)*-1);
	    response = intersectExtent(r.lon,r.lat);
	}
	return response;
    }
    var eventDisableCtl={
        func:null,
        set:function(){
            var obj = eventDisableCtl;
            obj.func= arguments[0];
        },
        execute:function(e){
            var obj = eventDisableCtl;
            if(obj.func){
                obj.func(e)
            }
        }
    };
    var getDistanceFromCentroid = function(){
        var extent = Map.map.getExtent();
        var centroid = Map.map.getCenter();
        var point1 = new OL.Geometry.Point(centroid.lon,centroid.lat);  
        var point2 = new OL.Geometry.Point(extent.right,extent.top);
        var r = transformToGeographic(point1.x,point1.y);
        return {centroid:r,distance:point1.distanceTo(point2)}
    };
    var getLastMousePosition = function(){
        var ctl = Map.map.controls[1];
        var px = ctl.lastXy;
        var lonlat = Map.map.getLonLatFromPixel(px);
        return {px:px,lonlat:lonlat};
    };
    var finishMeasure = function(){
        try{
            var line=getControl('measureLine');
            var polygon = getControl('measurePolygon');
            var finished = false;
            //console.log(polygon);
            if(line.active){
                line.handler.finishGeometry();
                finished = true;
            }
            if(polygon.active){
                polygon.handler.finishGeometry();
                finished = true;
            }
        }catch(e){
            var finished=false;
        }
        return finished;
    };
    var getActualBaseLayer=function(){
	return Map.map.baseLayer.name;
    }
    var finishGeoreference = function(){
        try{
            var line=getControl('georeferenceLine');
            var polygon = getControl('georeferencePolygon');
            var finished = false;
            //console.log(polygon);
            if(line.active){
                line.handler.finishGeometry();
                finished = true;
            }
            if(polygon.active){
                polygon.handler.finishGeometry();
                finished = true;
            }
        }catch(e){
            var finished=false;
        }
        return finished;
    };
    var getWmsParams=function(){
	var extent = getExtent();
	return {
	    LAYERS:'',
	    FORMAT:'image/png',
	    SERVICE:'WMS',
	    VERSION:'1.1.1',
	    REQUEST:'GetMap',
	    FIRM:""+ Math.floor(Math.random()*11) + (Math.floor(Math.random()*101)),
	    SRS:Map.projection.base,
	    BBOX:extent.lon[0]+","+extent.lon[1]+","+extent.lat[0]+","+extent.lat[1],
	    WIDTH:$("#map").width(),
	    HEIGHT:$("#map").height()
	}
    }
    var getContentDownloadImage = function(){
	var chain=  'De clic derecho para guardar la imagen </br></br>'+
		    '<img id="imageDownload" src="" style="width:400px;" oncontextmenu="return true">';
	return chain;
    };
    var modalImage = Modal.create({
                    title:'Descargar imagen',
                    content:getContentDownloadImage(),
                    events:{
                        onCancel:function(){
                            modalImage.hide();
                        },
                        onCreate:function(){
                       
                        },
                        onShow:function(){
                        }
                    }
    });
    return{
        init:init,
	getZoomLevel:getZoomLevel,
	getWmsParams:getWmsParams,
	testBrowserCompatibility:testBrowserCompatibility,
        getExtent:getExtent,
	getResolution:getResolution,
        setBaseLayer:setBaseLayer,
	setRestrictedExtent:redefineExtent,
        loadOverview:loadOverview,
        statusLayer:Tree.addToRepository,
        getActiveLayers:Tree.getActiveLayers,
        getScale:getScale,
        getscale:getscale,
        zoomToLayer:zoomToLayer,
        changeOpacity:changeOpacity,
        activeCtl:activeControl,
        getDistanceFromCentroid:getDistanceFromCentroid,
        extent:extentMap,
        zoomIn:zoomIn,
        zoomOut:zoomOut,
        transformToGeographic:transformToGeographic,
        transformToDegrees:transformToDegrees,
        transformToMercator:transformToMercator,
        goCoords:goCoords,
        getWidth:getWidth,
	intersectExtent:intersectExtent,
	isValidCoordinate:isValidCoordinate,
	getActualBaseLayer:getActualBaseLayer,
	getImageMap:exportMap,
        Poi:{
            event:Poi.event,
            generateBuffers:Poi.generateBuffers
        },
        Mark:{
            event:Marker.event,
            add:Marker.add,
            addBufferAll:Georeference.showModalGeoPoints
        },
        Tree:{
            event:{
                reset:resetTree,
		addAditionals:function(){
		    Tree.activateLayers(getParamFromUrl('layers'));
		}
            }
        },
        Feature:{
            event:Features.event,
            addBuffer:Features.addBufferToBuffer,
            convertToBuffer:Features.convertToBuffer,
            exportGeoreference:Features.exportGeoreference,
            importGeoreference:Features.getFile,
            addBufferGeoreference:Georeference.showModalBuffer,
            finishGeoreference:finishGeoreference,
            finishMeasure:finishMeasure,
            addArea:Georeference.showModalBufferIdentify,
	    getAllForStore:Features.getFeatures,
	    restore:Features.restoreFeatures
        },
	Service:{
	    event:TS.event  
	},
        event:{
            setFeatureAdded:Features.setAdded,
            setFeatureCanceled:Features.canceled,
            setEventCatchMeasure:ctl.setEventCatchMeasure,
            setEventDisableCtl:eventDisableCtl.set,
            setEventIdentify:ctl.setEventIdentify,
            setEventPoiAdded:Poi.setEventAdded,
            setEventPoiCanceled:Poi.setEventCanceled,
            setEventGeoAdded:Features.setGeoAdded,
	    identify:ctl.actionIdentify,
	    exportMap:exportMap
        },
	Tracking:{
	    event:Geolocation.event,
	    Export:Features.exportGPX
	},
        Notification:Notification.show,
        showDataImporter:Features.showDataImporter,
	Popup:{
            add:Popup.add,
            set:Popup.set
        },
	Routing:{
	    event:Routing.event
	}
        
    }
});

var gordis = function(){
    var element = $('#main');
    var items = $("#mdm6DinamicPanel,#mdm6Layers,#scaleControl,#baseMapMini,#mdmToolBar,.section_share,.more_info,.popup_close,#menu_mapDownload,#mdm6Layers_v_container,#background_nodes,#nodos");
     items.css({display:'none'});
     html2canvas(element, {
			
			"proxy":'http://10.1.30.102:8181/downloadfile/download',
			
			onrendered: function (canvas) {
					var imgData = canvas.toDataURL('image/png',1.0);
					var doc = new jsPDF('l','cm','letter');
					doc.addImage(imgData, 'PNG',0,0.7, 28,20);
					doc.save('mdm.pdf');
			}
		    });
    items.css({display:''});
}

