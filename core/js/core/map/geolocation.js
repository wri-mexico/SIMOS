define(['OpenLayers','config','features','request','notification'],function(OL,config,Features,Request, Notification) {
    var control;
    var Layer;
    var demo=false;
    var points;
    var marks;
    var route=null;
    var Map;
    var clock;
    var circle;
    var cross;
    var snap=false;
    var requestSnap;
    var func=null;
    var watchPosition=false;
    var myLocationActive=false;
    var firstGeolocation = false;
    var traking = false;
    var totalTime = 0;
    var makeZoom = false;
    var shareLocation=null;
    var initialize = function(){
        points=[];
        marks=[];
        defineRequest();
        control = new OL.Control.Geolocate({
            bind: false,
            geolocationOptions: {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 7000
            }
        });
        control.events.register("locationuncapable",control,function(e) {
	    
            shareLocation = true;
        });
        control.events.register("locationupdated",control,function(e) {
	    totalTime = (getTime())/1000;
	    starTimer();
	    //alert(e.position.coords.speed);
            if (firstGeolocation) {
                locateMe(e);
            }
            if(traking){
                if(snap){
                    requestSnap.setParams(JSON.stringify({geometry:"POINT("+e.point.x+" "+e.point.y+")"}));
                    requestSnap.setExtraFields({data:e});
                    requestSnap.execute();
                }else{
                    createItems(e);
                }
            }
            if((watchPosition)){ 
                showLocation(e);
		if(makeZoom){
		    var lonlat = new OL.LonLat(e.point.x,e.point.y);
                    Map.map.setCenter(lonlat,14);
		    makeZoom=false;
		}
            }
        });
        control.events.register("locationfailed",control,function(e) {
            shareLocation = false;
        });
        Map.map.addControl(control);
        Layer = new OL.Layer.Vector('Route');
        Map.map.addLayer(Layer);
    };
    var getSpeed = function(distance,time){
	var speed = distance/time;
	return speed;
    }
    var createItems = function(e){
        trackMe(e);
        if(func!=null){
	    var r = $.extend({}, e.position.coords);
	    r.speed = getSpeed(r.distance,totalTime);
            func(r);
        }
    };
    var defineRequest = function(){
        /**************/
        requestSnap = Request.New({
            url:'http://10.1.30.102:8181/map/tracking',
            contentType:"application/json; charset=utf-8",
            params:'',
            events:{
                success:function(data,extraFields){
                    var msg=null;
                    if(data){
                        if(data.response.success){
                            var point = data.data.Vialidad.geometry
                            point = point.substring(6,point.length-1);
                            point = point.split(' ');
                            
                            var response = {
                                point: new OL.Geometry.Point(parseFloat(point[0]), parseFloat(point[1])),
                                position:{
                                    coords:extraFields.data.position.coords
                                }
                            }
                            //var newLonlat = Map.transformToGeographic(parseFloat(point[0]),parseFloat(point[1]));
                            //response.position.coords.longitude = newLonlat.lon;
                            //response.position.coords.latitude = newLonlat.lat;
                            response.position.coords.street = data.data.Vialidad.name
                            createItems(response);
                            showLocation(response);
                        }else{
                             msg='Snap no disponible';
                        }
                    }else{
                        msg='Servicio de Snap no disponible';
                    }
                    if(msg!=null){
                        var notification = Notification.show({message:msg});
                        notification.show();
                        createItems(extraFields.data);
                        showLocation(extraFields.data);
                    }
                },
                before:function(a,extraFields){
                   
                },
                error:function(a,b,extraFields){
                    /*
                        var notification = Notification.show({message:'Servicio de graficado no disponible'});
                        notification.show();
                        */
                },
                complete:function(a,b,extraFields){
                    
                }
            }
        });
        /**************/
    }
    var enable = function(){
        control.activate();
    }
     disable = function(){
        control.deactivate();
    }
    var init = function(){
        Map = arguments[0];
        initialize();
    }
    var locateMe=function(e){
	var zoom = (zoomforLocation!=null)?zoomforLocation:14;
        firstGeolocation = false;
        var lonlat = new OL.LonLat(e.point.x,e.point.y);
        Map.map.setCenter(lonlat,zoom);
        disable();
	zoomforLocation = null;
    }
    
    var trackMe = function(e){
        addNewMark(e);
        buildRoute();
    }
    
    var removeLocation = function(){
        if(circle){
            circle.destroy();    
            cross.destroy();
        }
    }
    var removeTrackFeatures = function(){
        points=null;
        points=[];
        for(var x in marks){
            marks[x].destroy();
        }
        if(route){
            removeRoute();
        }
    }
    var removeRoute = function(){
        if(route){
            route.destroy();
            route=null;
        }
    }
    var showLocation = function(e){
        removeLocation();
        //Map.map.setCenter({lon:e.point.x,lat:e.point.y},13);
        var style={
            fillColor: '#131313',
            fillOpacity: 0.65,
            strokeWidth: 0
        };
        circle = new OL.Feature.Vector(
            OL.Geometry.Polygon.createRegularPolygon(
                new OL.Geometry.Point(e.point.x, e.point.y),
                60,
                40,
                0
            ),
            {},
            style
        );
        cross = new OL.Feature.Vector(
                e.point,
                {},
                {
                    externalGraphic:'img/marks/target.png',
                    graphicWidth:24,
                    graphicHeight: 24,
                    graphicXOffset: -12,
                    graphicYOffset:-12
                }
        );
        Layer.addFeatures([cross,circle]);
        pulsate(circle);
    }
    var pulsate = function(feature) {
        var point = feature.geometry.getCentroid(),
            bounds = feature.geometry.getBounds(),
            radius = Math.abs((bounds.right - bounds.left)/2),
            count = 0,
            grow = 'up';
    
        var resize = function(){
            if (count>16) {
                clearInterval(window.resizeInterval);
            }
            var interval = radius * 0.03;
            var ratio = interval/radius;
            switch(count) {
                case 4:
                case 12:
                    grow = 'down'; break;
                case 8:
                    grow = 'up'; break;
            }
            if (grow!=='up') {
                ratio = - Math.abs(ratio);
            }
            if(feature){
                if(feature.geometry){
                    feature.geometry.resize(1+ratio, point);
                    Layer.drawFeature(feature);
                }
                
            }
            count++;
        };
        window.resizeInterval = window.setInterval(resize, 50, point, radius);
    };
    var zoomforLocation=null;
    var findMyLocation = function(p){
	if(p){
	    zoomforLocation=p.zoom;
	}
        disable();
        firstGeolocation = true;
        control.watch=false;
        if(config.startupConfig.map.geolocation){
	    enable();
	}
    }
   
    var addNewMark = function(p){
        var markStyle={
            strokeColor: '#f00',
            strokeWidth: 2,
            fillColor:"#FFF",
            fillOpacity:1,
            pointRadius:6
            
        }
        var Features=[];
        var pointGeometry = new OL.Geometry.Point(p.point.x, p.point.y);
        var mark =  new OL.Feature.Vector(pointGeometry,{},markStyle);
        
        //requestSnap.setParams(JSON.stringify({geometry:mark.geometry+''}));
        //requestSnap.setExtraFields({id:i.id});
        //requestSnap.execute();
        
        marks.push(mark);
        Features.push(mark);
	var dataTracking = $.extend({}, p.position.coords);
        pointGeometry.tracking = dataTracking;
	p.position.coords.distance=0;
	pointGeometry.tracking.distance = p.position.coords.distance;
        points.push(pointGeometry);
        Layer.addFeatures(Features);
    }
    var buildRoute = function(){
        var styleRoute={
            strokeColor: '#f00',
            strokeWidth: 4
        }
        removeRoute();
        var Features=[];  
        var lineGeometry = new OL.Geometry.LineString(points);
        
        route=new OL.Feature.Vector(lineGeometry,{},styleRoute);
        Features.push(route);    
        Layer.addFeatures(Features);
	var LastPoint = points[points.length-1].tracking;
        LastPoint.distance = route.geometry.getLength();
	LastPoint.speed = getSpeed(LastPoint.distance,totalTime);
    }
    var addToGeorreference = function(wkt){
        var params = {wkt:wkt,store:false,zoom:false,params:Features.getFormat('georeference','route')};
        Features.add(params);
        var temporal = MDM6('getTemporalGeoParams');
        route.custom={};
        route.custom.unit = 'metric';
        temporal.data.desc=Features.getDistance(route,true);
        temporal.data.description=temporal.desc;
        temporal.data.tracking=getDataPoints();
        MDM6('eventFinishedCeationGeo',temporal);
    }
    var getDataPoints = function(){
        var data = [];
        for(var x in points){
            data.push(points[x].tracking);
        }
        return data;
    }
    var switchShowPosition = function(){
	if(myLocationActive){
	    endTracking();
	}else{
	    showPosition();
	}
	myLocationActive = !myLocationActive;
    }
    var showPosition = function(){
        disable();
        watchPosition = true;
        traking = false;
        control.watch = true;
	makeZoom = true;
        enable();  
    }
    var starTracking = function(){
	firstGeolocation=true;
        disable();
        watchPosition = true;
        traking = true;
        control.watch=true;
        enable();
	starTimer();
    }
    var start = 0;
    var starTimer = function(){
	start = new Date().getTime();
    }
    var getTime = function(){
	var end = new Date().getTime();
	return time = end-start;
    }
    var endTracking = function(){
        traking = false;
        watchPosition = false;
        disable();
        removeLocation();
        if(points.length>0){
            $("#mdm6DinamicPanel").dinamicPanel('showPanel','geoPanel');
            addToGeorreference(route.geometry+"");
        }else{
            //console.log('no hay datos')
        }
        removeTrackFeatures();
        //removeRoute();
    }
    var runDemo = function(){
        var total=0;
        var source = [
            {
                accuracy: 25000,
                altitude: 100,
                altitudeAccuracy: 150,
                heading: null,
                latitude: 2496300.2569436,
                longitude: -11389635.806415,
                speed: 23
            },
            {
                accuracy: 30000,
                altitude: 100,
                altitudeAccuracy: 120,
                heading: null,
                latitude: 2496392.2202432,
                longitude: -11389422.021602,
                speed: 24
            },
            {
                accuracy: 35000,
                altitude: 100,
                altitudeAccuracy: 120,
                heading: null,
                latitude: 2496469.8516,
                longitude: -11389180.767231,
                speed: 26
            },
            {
                accuracy: 20000,
                altitude: 100,
                altitudeAccuracy: 120,
                heading: null,
                latitude: 2496545.0942997,
                longitude: -11388914.431961,
                speed: 60
            },{
                accuracy: 21000,
                altitude: null,
                altitudeAccuracy: 110,
                heading: 100,
                latitude: 2496589.0646279,
                longitude: -11388672.905146,
                speed: 40
            },{
                accuracy: 29000,
                altitude: 100,
                altitudeAccuracy: 120,
                heading: null,
                latitude: 2496547.4855534,
                longitude: -11388659.967197,
                speed: 50
            }
        ];
        executeDemo(source,total);
    }
    var executeDemo = function(source,total){
        var response = {point:{x:source[total].longitude,y:source[total].latitude},
                        position:{
                            coords:source[total]
                        }
                        };
        if(snap){
            //console.log(Map.transformToGeographic(response.point.x,response.point.y));
            requestSnap.setParams(JSON.stringify({geometry:"POINT("+response.point.x+" "+response.point.y+")"}));
            requestSnap.setExtraFields({data:response});
            requestSnap.execute();
        }else{
            trackMe(response);
            func(source[total]);
        }
        total+=1;
        clock = setTimeout(function(){
            //if(demo){
                if(total<source.length){
                executeDemo(source,total);
                }
            //}
        },3000);
    }
    var event = function(e){
        switch(e.action) {
                case 'showPosition':
		    switchShowPosition();
                    //showPosition();
                    break;
                case 'starTracking':
                    demo=false;
                   if(e.eventCatch){
                        func=e.eventCatch;
                   }
                   starTracking();
                   break;
                case 'endTracking':
                    endTracking();
                    break;
                case 'runDemo':
                    demo=true;
                    snap=true;
                    if(e.eventCatch){
                        func=e.eventCatch;
                    }
                   runDemo();
                    break;
                case 'stopDemo':
                    demo=false;
                    clearTimeout(clock);
                    endTracking();
                    break;
                case 'stopSnap':
                    demo=false;
                    snap=false;
                    break;
                case 'starSnap':
                    demo=false;
                    snap=true;
                    break;
            }
	if(shareLocation!=null){
	    if(!shareLocation){
		Notification.show({message:'Para poder usar esta herramienta debe habilitar la opci&oacute;n compartir ubicaci&oacute;n',time:5000});
	    }
	}
    }
    
    return{
        init:init,
        findMyLocation:findMyLocation,
        event:event
    };
});