define(['OpenLayers','mapStyles','features','marker','georeference','popup','poi','modal','config','dataSource','request','notification','cluster'],function(OL,mapStyle,Features,Marker,Georeference,Popup,Poi,Modal,config,dataSource,Request,Notification,Cluster) {
    var idContainerMeasure='medidaG'; 
    var CtlsFeature;
    var Map;
    var requestRouting = Request.New({
            url:dataSource.routing.movePoint,
            contentType:"application/json; charset=utf-8",
            params:'',
            events:{
                success:function(data,extraFields){
                    var msg=null;
                    if(data){
                        if(data.response.success){
			    var response = data.data.Point;
                            var point = response.point;
                            point = point.substring(6,point.length-1);
                            point = point.split(' ');
                            extraFields.evento(response);
			    //console.log(data);
                        }else{
                             msg='No existe una ubicaci&oacute;n valida';
                        }
                    }else{
                        msg='Servicio de ruteo no disponible';
                    }
                    if(msg!=null){
                        var notification = Notification.show({message:msg,time:5000});
                        notification.show();
                        //createItems(extraFields.data);
                        //showLocation(extraFields.data);
                    }
                },
                before:function(a,extraFields){
                   
                },
                error:function(a,b,extraFields){
                    
                    var notification = Notification.show({message:'Servicio de Ruteo no disponible'});
                    notification.show();
                        
                },
                complete:function(a,b,extraFields){
                    
                }
            }
    });
    
    var getHoverEvent = function(f){
	return new OL.Class(OL.Control, {                
			defaultHandlerOptions: {
			    'delay': 500,
			    'pixelTolerance': null,
			    'stopMove': true
			},
	
			initialize: function(options) {
			    this.handlerOptions = OL.Util.extend(
				{}, this.defaultHandlerOptions
			    );
			    OL.Control.prototype.initialize.apply(
				this, arguments
			    ); 
			    this.handler = new OL.Handler.Hover(
				this,
				{'pause': this.onPause, 'move': this.onMove},
				this.handlerOptions
			    );
			}, 
	
			onPause: function(evt) {
			   f.pause(evt);
			},
			onMove: function(evt) {
			    if(f.move){
				f.move(evt);
			    }
			}
		});
    };
    var getClickEvent = function(f,Map){
        return new  OL.Class(OL.Control, {                
                defaultHandlerOptions: {
                    'single': true,
                    'double': false,
                    'pixelTolerance': 0,
                    'stopSingle': true,
                    'stopDouble': false
                },
                initialize: function(options) {
                    this.handlerOptions = OL.Util.extend(
                        {}, this.defaultHandlerOptions
                    );
                    OL.Control.prototype.initialize.apply(
                        this, arguments
                    ); 
                    this.handler = new OL.Handler.Click(
                        this, {
                            'click': this.trigger
                        }, this.handlerOptions
                    );
                },
                trigger: function(e) {
                    //var Lonlat = Map.map.getLonLatFromViewPortPx(e.xy);
                    f(e);
		}
        });
    };
    var getCustomControl = function(){
	return new OL.Control();
    };
    var getControlsMap = function(){
        return [
                new OL.Control.Navigation({
                    dragPanOptions: {
                        enableKinetic: true
                    },
		    documentDrag: true
                }),
                new OL.Control.MousePosition({
		    formatOutput: function(lonLat) {
			var digits = parseInt(this.numDigits);
			var newHtml =
			    //this.prefix +
			    //lonLat.lon.toFixed(digits) +
			    //this.separator +
			    //lonLat.lat.toFixed(digits) +
			    //this.suffix//+
			   // " "+
			transformToDegrees(lonLat.lon.toFixed(digits))+ 'W'+//W
			this.separator+
			transformToDegrees(lonLat.lat.toFixed(digits))+'N';
			return newHtml;
			
		    }
		}),
                new OL.Control.ScaleLine()//,
		//new OL.Control.LayerSwitcher()
		//new OL.Control.ExportMap()
            ];
	
    };
    var eventCatchMeasure={
	func:null,
	set:function(){
	    eventCatchMeasure.func=arguments[0];
	}
    };
    var eventIdentify={
        func:null,
        set:function(){
	    //console.log("d");
            var obj = eventIdentify;
            obj.func= arguments[0];
        },
        execute:function(e){
            var obj = eventIdentify;
            if(obj.func){
                obj.func(e)
            }
        }
    };
    
    var transformToDegrees = function(base){
        var t, t2;
        var prefix = '';
        if(base <0){
            //prefix='-';
        } 
        base = Math.abs(base);
        var degrees = Math.floor(base);
        var minutes = Math.floor(t = ( base - degrees ) * 60);
        var seconds = Math.floor(t2 = ( t - minutes ) * 6000);
        seconds = seconds / 100.00;
        return ("" + prefix+  degrees + "\u00B0 " + minutes + "\u0027 " +seconds +"\u0022 " );
    };
    
    var getCartografiaModal = function(){
	var chain = '<iframe marginheight="0" marginwidth="0" style="width:800px;height:434px" id="cartografiaParticipativa" src=""></iframe>';
	return chain;
    }
    var cartografiaModal = Modal.create({
                    title:'',
		    modal:true,
                    content:getCartografiaModal()
        });
    var showModalCartografia = function(lonLat){
	var id = "cartografiaParticipativa";
	var path = 'http://intranet.dggma.inegi.org.mx:8080/InformaCartPart/informaCartPart.do';
	var sistema = 'MDM';
	var extent = Map.map.getExtent();
	var epsg=3857;
	var ux=-11387330.964486;
	var uy=2497849.9920983;
	var response = path+'?sistema='+sistema+'&x='+lonLat.lon+'&y='+lonLat.lat+'&epsg='+epsg+'&extent='+extent+'&ux='+ux+'&uy='+uy;
	
	cartografiaModal.show();
	$("#"+id).attr('src',response);
    }
    var getCustomControls = function(layers,Map){
        var style = mapStyle.getVector();
        var c = OL.Control;
        var h = OL.Handler;
        var r = mapStyle.getRender();
        var p = layers.Poligonos;
	var g = Map.getLayer('Georeference');
        var controls = {
                rectangleZoomOut: new c.ZoomBox({
                  out: true
                  }
                ),
                rectangleZoomIn: new c.ZoomBox({
                  out: false
                  }
                ),
		cartografia: new (getClickEvent(function(e){
			Marker.event({action:'delete',items:'all',type:'identify'});//identify
			var lonlat = Map.map.getLonLatFromViewPortPx(e.xy);
			var params = {lon:lonlat.lon,lat:lonlat.lat,type:'identify',params:{nom:'Identificaci&oacute;n',desc:'informacion'}};
			Marker.add(params);
			showModalCartografia(lonlat);
			},
		    Map
		)),
		identify: new (getClickEvent(function(e){
		    /*
			var conf = config.startupConfig.map.identify;
			var lonlat = Map.map.getLonLatFromViewPortPx(e.xy);
			
			var evento = function(){
			    if(conf.createMarker){
				Marker.event({action:'delete',items:'all',type:'identify'});//identify
				var params = {lon:lonlat.lon,lat:lonlat.lat,type:'identify',params:{nom:'Identificaci&oacute;n',desc:'informacion'}};
				Marker.add(params);
			    }
			    if(conf.enable){
				eventIdentify.execute({lon:lonlat.lon,lat:lonlat.lat});
			    }
			    MDM6('onIdentify',{lon:lonlat.lon,lat:lonlat.lat,width:Map.getWidth()});
			}
			Map.enableAditionalDenue();//parche para verificar encencido de otra capa
			
			if(Map.cluster.active){
			    if(Map.cluster.onlyDisplayRecordCard){
				Cluster.showRecordCard({lonlat:lonlat,xy:{x:e.xy.x,y:e.xy.y},denue:false,evento:evento});
			    }else{
				Cluster.show({xy:e.xy,lonlat:lonlat,evento:evento});
			    }
			}else{
			    evento();
			}
			
		    */
			    actionIdentify(e);
			},
			
		    Map
		)),
		routing: new (getClickEvent(function(e){
			var conf = config.startupConfig.map.identify;
			var lonlat = Map.map.getLonLatFromViewPortPx(e.xy);
	
			var evento = function(lon,lat){
			    //Marker.event({action:'delete',items:'all',type:'identify'});//identify
			    var params = {lon:lon,lat:lat,type:'identify',params:{nom:'Identificaci&oacute;n',desc:'informacion'}};
			    Marker.add(params);
			    //eventIdentify.execute({lon:lon,lat:lat});
			    //MDM6('onIdentify',{lon:lon,lat:lat,width:Map.getWidth()});
			}
            amplify.publish( "routing",{resolution:Map.map.getResolution(),scale:Map.map.getScale(),point:"POINT("+lonlat.lon+" "+lonlat.lat+")"});
			/*
			requestRouting.setParams(JSON.stringify({resolution:Map.getResolution(),point:"POINT("+lonlat.lon+" "+lonlat.lat+")"}));
			requestRouting.setExtraFields({data:lonlat,evento:function(a){
			    amplify.publish( "routing",a);
			}});
			requestRouting.execute();
            */
			},
			
		    Map
		)),
                poi: new (getClickEvent(function(e){
		    Marker.event({action:'unselect',items:'all',type:'poi'});
		    var lonlat = Map.map.getLonLatFromViewPortPx(e.xy);
		    var params = {lon:lonlat.lon,lat:lonlat.lat,type:'poi',params:{nom:'punto',desc:'descripcion'}};
		    Marker.add(params);
		    var lastPoi = Marker.getLastMarker();
		    Marker.event({action:'select',items:[{id:lastPoi.id}],type:'poi'});
		    Poi.showModal(lonlat);
		    },Map)
		),
		georeferencePoint: new (getClickEvent(function(e){
			Marker.event({action:'delete',items:'all',type:'identify'});//identify
			var lonlat = Map.map.getLonLatFromViewPortPx(e.xy);
			var nombre = Features.reg.label.point.get();
			var params = {lon:lonlat.lon,lat:lonlat.lat,type:'georeference',params:{nom:nombre,desc:'Sin descripcion'},store:true};
			Marker.add(params);
			
			var geoPoint = Marker.getLastMarker();
			var geoParams = {id:geoPoint.id,type:'georeference',data:{name:geoPoint.custom.nom,type:'point'}};
			Features.setTemporalGeoParams(geoParams);
			Features.showGeoModal();
			},
		    Map
		)),
		georeferenceAddress: new (getClickEvent(function(e){
			Marker.event({action:'delete',items:'all',type:'identify'});//identify
			var lonlat = Map.map.getLonLatFromViewPortPx(e.xy);
			var nombre = Features.reg.label.address.get();
			var params = {lon:lonlat.lon,lat:lonlat.lat,type:'georeferenceAddress',params:{nom:nombre,desc:''},store:true};
			Marker.add(params);
			var wkt = 'POINT'+'('+lonlat.lon + ' '+lonlat.lat+')';
			
			var geoPoint = Marker.getLastMarker();
			var geoParams = {id:geoPoint.id,type:'georeference',data:{name:geoPoint.custom.nom,type:'address'}};
			Features.setTemporalGeoParams(geoParams);
			Georeference.showModalGeoAddress(wkt,lonlat,false);
			},
		    Map
		)),
		/*
		georeferencePoint:new (getClickEvent(function(e){
			var lonlat = Map.map.getLonLatFromViewPortPx(e.xy);
			var params = {
			    lon:lonlat.lon,
			    lat:lonlat.lat,
			    type:'point',
			    params:{
				nom:'',
				desc:''
				}
			    }; 
			Georeference.add(params); 
			Georeference.fillInformation('point');
			},
		    Map
		)),
		*/
		georeferenceLine: new c.Measure(
                    OL.Handler.Path, {
                        persist: false,
			immediate:true,
                        handlerOptions: {
                            layerOptions: {renderers: r, styleMap: style}
                        }
                    }
                ),
                georeferencePolygon: new c.Measure(
                    h.Polygon, {
                        persist: false,
			immediate:true,
                        handlerOptions: {
                            layerOptions: {renderers: r,styleMap: style}
                        }
                        
                    }
                ),
		/*
		georeferenceLine:new c.DrawFeature(
                    g, h.Path
                ),
		georeferencePolygon:new c.DrawFeature(
                    g, h.Polygon
                ),
                */
		measureLine: new c.Measure(
                    OL.Handler.Path, {
                        persist: false,
			immediate:true,
                        handlerOptions: {
                            layerOptions: {renderers: r, styleMap: style}
                        }
                    }
                ),
                measurePolygon: new c.Measure(
                    h.Polygon, {
                        persist: false,
			immediate:true,
                        handlerOptions: {
                            layerOptions: {renderers: r,styleMap: style}
                        }
                        
                    }
                ),
                
                polygonH: new c.DrawFeature(
                    p, h.Polygon
                ),
                
                polygonCircle: new c.DrawFeature(
                    p,h.RegularPolygon,{handlerOptions: {sides: 40}}
                ),
                
                SelSquare: new c.ZoomBox({
                  showCoordinates:true 
                  }
                ),
                //SelPoint: new c.Click(),
                
                SelPolygon: new c.DrawFeature(
                    p, h.Polygon
                ),
		customPoint: new (getClickEvent(function(e){
		    if(controls.customPoint.Event){
			var lonlat = Map.map.getLonLatFromViewPortPx(e.xy);
			var wkt = 'POINT'+'('+lonlat.lon + ' '+lonlat.lat+')';
			controls.customPoint.Event(wkt);
		    }
		    //MDM6('customTool','identify',wkt);
		    },Map)
		),
		customPolygon: new c.Measure(
                    h.Polygon, {
                        persist: false,
			immediate:true,
                        handlerOptions: {
                            layerOptions: {renderers: r,styleMap: style}
                        }
                        
                    }
                ),
		customSquare: new c.ZoomBox({
		    zoomBox:function(bounds){
			
			if((typeof bounds.left !== "undefined")){
			    if(controls.customSquare.Event){
				var coord1 = Map.map.getLonLatFromPixel(new OL.Pixel(bounds.left, bounds.bottom)); 
				var coord2 = Map.map.getLonLatFromPixel(new OL.Pixel(bounds.right, bounds.top));
				bounds.left = coord1.lon;
				bounds.bottom = coord1.lat;
				bounds.right = coord2.lon;
				bounds.top = coord2.lat;
				var wkt = bounds.toGeometry()+'';
				controls.customSquare.Event(wkt);
			    }
			    
			}
		    }
		}
                )
		
        }
        for(x in controls) {
                var ctl = controls[x];
                ctl.events.on({
                    "measure": getMeasure,
                    "measurepartial": getMeasure
                });
        }
	
	/*
	OL.Util.extend(controls.customSquare, {
                    draw: function () {
			
			    // this Handler.Box will intercept the shift-mousedown
			    // before Control.MouseDefault gets to see it
			    this.box = new OpenLayers.Handler.Box( controls.customSquare,
				{"done": this.Event}//,
				//{keyMask: OpenLayers.Handler.MOD_SHIFT});
			    this.box.activate();
			//}
                    },

                    Event: function (bounds) {
			if(controls.customSquare.active){
			    console.log(bounds.toGeometry()+'');
			}
                    }
        });
	*/
        return controls;
    };
    var getMeasure = function(event){
	
        var geometry = event.geometry;
	var m =(Map.controls.measurePolygon.active)?geometry.getArea():geometry.getLength();
	//var units = event.units;
        //var order = event.order;
        //var measure = event.measure;
        //var m = measure;
	/*
	var m = "";
	m += measure.toFixed(3) + " " + units;
	if(order!=1){
	    m+="<sup>2</" + "sup>";
	}
	m=Features.getFormated(m);
	*/
	if((Map.controls.measureLine.active)||(Map.controls.measurePolygon.active)){
	    eventCatchMeasure.func(m);
	}
    };
    var getControlStopPropag = function(){
	return new (getHoverEvent({
		    pause:function(e){
		    },
		    move:function(e){
		    }
		}))
    };
    var addExtra = function(map,layers,ctl){
	Map = map;
	CtlsFeature = Features.getControls(layers);
	CtlsFeature['stopPropag'] = getControlStopPropag();
	for(x in CtlsFeature){
	    if(x != 'Feature'){
		Map.map.addControl(CtlsFeature[x]);
	    }
	}
	
	Features.setSources(ctl,layers[0],Map);
	//Features.init();
	CtlsFeature.Editor.deactivate();//activate();
	CtlsFeature.Hover.activate();
	
	CtlsFeature.Editor.virtualStyle['graphicName']="square";
	CtlsFeature.Editor.virtualStyle['fillColor']="white";
	CtlsFeature.Editor.virtualStyle['fillOpacity']=1;
	CtlsFeature.Editor.virtualStyle['strokeWidth']=1;
	CtlsFeature.Editor.virtualStyle['strokeOpacity']=1;
	CtlsFeature.Editor.virtualStyle['strokeColor']="#59590E";
	CtlsFeature.Editor.virtualStyle['pointRadius']=4;
	
	CtlsFeature.Editor.vertexRenderIntent = 'vertex';
	//setTimeout(function(){console.log('activado');CtlsFeature.stopPropag.activate();},3000)
	
    };
    var actionIdentify = function(e,lonlat,disableValidations,onlyIdentify){
            onlyIdentify = (onlyIdentify)?onlyIdentify:false;
			disableValidations = (disableValidations)?disableValidations:false;
			var conf = config.startupConfig.map.identify;
			if(typeof(lonlat)=="undefined"){
			    lonlat = Map.map.getLonLatFromViewPortPx(e.xy);
			    disableValidations = e.disableValidations;
			}else{
			    var Lonlat = new OL.LonLat(parseFloat(lonlat.lon),parseFloat(lonlat.lat));
			    e = Map.map.getPixelFromLonLat(Lonlat);
			}
			
			var evento = function(){
			    if(conf.createMarker){
				Marker.event({action:'delete',items:'all',type:'identify'});//identify
				var params = {lon:lonlat.lon,lat:lonlat.lat,type:'identify',params:{nom:'Identificaci&oacute;n',desc:'informacion'}};
				Marker.add(params);
			    }
			    if(conf.enable){
				eventIdentify.execute({lon:lonlat.lon,lat:lonlat.lat});
			    }
			    MDM6('onIdentify',{lon:lonlat.lon,lat:lonlat.lat,width:Map.getWidth()});
			}
			Map.enableAditionalDenue();//parche para verificar encencido de otra capa
			if (!onlyIdentify) {
                if((Map.cluster.active)&&(!disableValidations)){
                    if(Map.cluster.onlyDisplayRecordCard){
                        Cluster.showRecordCard({lonlat:lonlat,xy:{x:e.xy.x,y:e.xy.y},denue:false,evento:evento});
                    }else{
                        if(!Map.cluster.whatshere){
                            Cluster.show({xy:e.xy,lonlat:lonlat,evento:evento,geometry:Map.cluster.geometry,whatshere:Map.cluster.whatshere});
                        }else{
                            identifyWhatshere(e.xy);
                        }
                    }
                }else{
                    if (Map.economic) {
                        amplify.publish( "identifyEconomic", {lon:lonlat.lon,lat:lonlat.lat,width:Map.getWidth(),resolution:Map.getResolution()} );
                    }else{
                        evento();
                    }
                }
            }else{
                evento();
            }
    }
    
    var defineActions = function(ctl){
	Features.defineAction(ctl); 
    };
    
    var identifyWhatshere = function(xy){
	var resolution = Map.map.getResolution();
	//var pixels = 5*(Map.map.getResolution());
	var pixels = (resolution<0.5)?20:6;
	var centroid = Map.map.getLonLatFromPixel(new OL.Pixel(xy.x, xy.y));
	var point1 = Map.map.getLonLatFromPixel(new OL.Pixel(xy.x+pixels, xy.y-pixels));
	var point2 = Map.map.getLonLatFromPixel(new OL.Pixel(xy.x-pixels, xy.y+pixels));
	amplify.publish( "whatsHere", { extent:[point1.lon,point1.lat,point2.lon,point2.lat],centroid:{lon:centroid.lon,lat:centroid.lat} } );
	//MDM6('customPolygon',{action:'add',wkt:extent.geometry+'',params:{fColor:"red",lSize:2,lColor:"blue",lType:"line",type:'buffer'}});
    }
    
    return {
        getOL:getControlsMap,
        getCustom:getCustomControls,
	defineActions:defineActions,
	addExtra:addExtra,
	setEventCatchMeasure:eventCatchMeasure.set,
	setEventIdentify:eventIdentify.set,
	transformToDegrees:transformToDegrees,
	actionIdentify:function(e,onlyidentify){
	    actionIdentify(null,e,null,onlyidentify);
	}
    };
})