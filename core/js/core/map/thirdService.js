
var Gordis = null;
var velociraptor=null;
var addServiceG = null;
var setServiceG = null;
var eventGordis = null;

define(['OpenLayers','request','mapLayers','features','config','dataSource'],function(OL,Request,Layer,Features,config,DataSource) {
    var projection = 'EPSG:900913';
    var Map;
    var request;
    var counter=0;
    var textService='Service';
    var textId='S';
    var init = function(m){
        Map = m;
    };
    
    var event = function(a){
        if(typeof(a.data)!="undefined"){
            for(var x in a.data){
                var i = a.data[x];
                i.action=a.action;
                i = validateAction(i);
                action(i);
            }
        }else{
            a = validateAction(a);
            action(a);
        }
    }
    
    var validateAction =function(i){
        if((i.action=='set')&&(typeof(Map.Layers["'"+i.id+"'"]))=='undefined'){
            i.action='add';
        }
        return i;
    }
    var action = function(){
        //{action:'remove',items:'all',type:'poi'}
        //{action:'hide',items:'[id1,id2],type:'poi'}
        //{action:'show',items:'all',type:'poi'}
        //{action:'get',type:'wms',path:'http://vmap0.tiles.osgeo.org/wms/vmap0',catchEvent:function(){}};
        var a = arguments[0];
        switch(a.action){
            case 'get':
                getParams(a);
                break;
            case 'add':
                var create = verifyExistence(a);
                if(create){
                    addService(a);
                }
                break;
            case 'delete':
                removeService(a);
                break;
            case 'set':
                if(a.type=='WFS'){
                    a.GetFeature = true;
                    if(a.active){
                        verifyService(a);
                    }else{
                        setService(a);
                    }
                    
                }else{
                    if(Map.Layers["'"+a.id+"'"]){
                        setService(a);
                    }else{
                        var create = verifyExistence(a);
                        if(create){
                            addService(a);
                        }
                    }
                }
                
                break;
        }
    };
    eventGordis = action;
    var getParams = function(a){
        //a.type = 'WMTS';
       verifyService(a);
    };
    
    var verifyExistence = function(a){
        var create = false;
                var layers=[];
                for(var x in a.selected.layers){
                    var i = a.selected.layers[x].layer;
                    layers.push(i);
                }
                if((a.active)&&(layers.length>0)){
                    create = true;
                }
                if(Map.Layers["'"+a.id+"'"]){
                    create = false;
                }
       
        return create;
    }
    var addService = function(a){
        //a.selected.srs='EPSG:4326';
        
        var toReproject = (a.selected.srs=='EPSG:900913')?false:true;
        var newLayer=null;
        var layers=[];
        var matrixIds=null;
        var matrixSet=null;
        for(var x in a.selected.layers){
            var i = a.selected.layers[x].layer;
            layers.push(i);
            if(a.type=='WMTS'){
                for(var n in a.data.layers){
                    if(a.selected.layers[x].layer == a.data.layers[n].layer){
                        matrixSet = a.data.layers[n].tileMatrixSet;
                        matrixIds = a.data.layers[n].matrixIds;
                        break;
                    }
                }
                
            }
        }
        
        switch(a.type){
            case 'WMS':
                if(toReproject){
                    var bounds;
                    newLayer = new OL.Layer.TMS(a.id, a.path,
                                                {
                                                 layers: layers.join(','),
                                                 format: a.selected.format,
                                                 type: a.selected.format.replace('image/',''),
                                                 getURL:getWmsUrl,//getWmsUrlNotTiled,//getWm//getWmsUrl
                                                 opacity: a.opacity,
                                                 singleTile: false,
                                                 deltaX: 0.0013,
                                                 deltaY: 0.00058,
                                                 ratio:1
                                                },{
                                                 //transitionEffect: 'resize',
                                                 buffer:0,
                                                 ratio:1
                                                }
                                    );
                    newLayer['srsToReproject']=a.selected.srs;
                    newLayer['typeService']='TMS';
                }else{
                    newLayer = new OL.Layer[a.type]( a.id,a.path,{layers: layers.join(','),format:a.selected.format},{opacity:a.opacity,singleTile: a.tiled} );
                }
                break;
            case 'WFS':
                newLayer = '';
                /**/
                 var styleMap = new OL.StyleMap({
                    strokeColor: "black",
                    strokeWidth: 2,
                    strokeOpacity: 0.5,
                    fillOpacity: 0.2
                });
                var proj = new OpenLayers.Projection(projection);
                
                var newLayer = new OL.Layer.Vector(a.id, {
                    //strategies: [new OL.Strategy.BBOX()],
                    projection: a.selected.srs,
                    styleMap: styleMap
                });
                /*
                var newLayer = new OL.Layer.Vector(a.id, {
                    strategies: [new OL.Strategy.BBOX()],
                    protocol: new OL.Protocol.WFS({
                        version: a.version,
                        srsName: a.selected.srs, // this is the default
                        url: a.path,
                        featureType: layers.join(',')//,
                        //featureNS: "http://www.openplans.org/topp"
                    }),
                    projection: a.selected.srs, 
                    styleMap: styleMap
                });
                */
                newLayer['srsToReproject']=a.selected.srs;
                newLayer['typeService']='WFS';
                /**/
                break;
            case 'WMTS':
                /*
                layer:layer.identifier,
                                title:layer.title,
                                formats:validFormats.formats,
                                srs:[projection],
                                tileMatrixSet:projection,
                                matrixIds:extract.contents.tileMatrixSets[projection].matrixIds
                                */
                newLayer = '';
                var newLayer = new OpenLayers.Layer.WMTS({  
                    name: a.id,  
                    url: a.path,  
                    layer: layers.join(","),  
                    //singleTile: false,
                    matrixSet: matrixSet,  
                    matrixIds: matrixIds,  
                    format: a.selected.format,  
                    style: "default",  
                    isBaseLayer: false
                });                  
                Map.map.addLayer(newLayer);   
                newLayer['typeService']='WMTS';
                break;
            case 'TMS':
                
                newLayer = '';
                var newLayer = new OL.Layer.TMS( a.id,
                    a.path,
                    {
                        layername: layers.join(","),
                        format: a.selected.format,
                        type:a.selected.format.replace('image/',''),
                        //serverResolutions:config.mapConfig.resolutions,
                        //resolutions:  config.mapConfig.resolutions
                        zoomOffset:5
                    }
                );
                newLayer.isBaseLayer=false;
                
                Map.map.addLayer(newLayer);   
                newLayer['typeService']='TMS';
                break;
        }
        if(newLayer!=null){
            newLayer.isBaseLayer=false;
            velociraptor = newLayer;
            Map.Layers["'"+newLayer.name+"'"]=newLayer;
            Map.map.addLayer(newLayer);
            if(a.type=="WFS"){
               a.GetFeature=true;
                verifyService(a);
            }
        }
    };
    addServiceG = addService;
    var setService = function(params,data){
        var Layer = Map.getLayer(params.id);
        var layers=[];
        for(var x in params.selected.layers){
            var i = params.selected.layers[x].layer;
            layers.push(i);
        }
        if(Layer){
            var s = params.selected;
            var format = s.format;
            layers = layers.join(',');
            /*
            if((s!=undefined)&&(s.layers!=undefined)){
                if(layers==''){
                    params.active=false;
                }else{
                    params.active=true;
                }
            }
            */
            if(((params.type=='WMS')||(params.type=='WMTS'))&&(params.active)){
                var newParams = {format:format,layers:layers};
                Map.setParamsToLayer({
                            layer:params.id,
                            params:newParams
                });
            }
            if(params.opacity!=undefined){
                Map.setOpacity(Layer,params.opacity);
            } 
            if(typeof(params.active)!="undefined"){
                Layer.setVisibility(params.active);
            }
            /*
            if(params.position!=Layer.position){
                var pos = getPosition(params.position);
                Layer.position = pos;
                Map.setIndex(params.id,pos);
            }
            */
            if((params.type=='WFS')&&(params.active)){
                /*
                Layer.protocol.setFeatureType(layers); 
		Layer.refresh({force: true});
		*/
                Layer.removeFeatures(Layer.features);
                
                /*
                var gmlOptions = {
                    featureType: "feature"
                };
                var gmlOptionsIn = OL.Util.extend(
                    OL.Util.extend({}, gmlOptions)
                );
                
                var format = new OL.Format.GML.v3(gmlOptionsIn);
                format.internalProjection= new OL.Projection(projection);
                format.externalProjection=new OL.Projection(params.selected.srs);
                */
                var theParser = new OL.Format.GML();
                theParser.internalProjection = new OL.Projection(projection);
                theParser.externalProjection = new OL.Projection(params.selected.srs);
                theParser.extractStyles      = false;
                theParser.extractAttributes  = true;
                var features = theParser.read(data);
                
                
                if(params.selected.srs!=projection){
                    var newFeatures = [];
                    for(var x in features){
                        var wkt = features[x].geometry+'';
                        var r = Features.getFeatureFromWKTMercator(wkt);
                        newFeatures.push(r.features[0]);
                    }
                    features = newFeatures;
                    /*
                    var newFeatures=[];
                    for(var x in features){
                        var elemento = features[x].clone();
                        newFeatures.push(elemento);
                    }
                    for(x in newFeatures){
                        var e = newFeatures[x];
                        e.geometry = e.geometry.transform(params.selected.srs,projection);
                    }
                    features = newFeatures;
                    */
                    amplify.publish( "layerDisplaySpinner",{status:false,label:'Cargando servicio'} );
                }
                
                /*
                var gformat = new OL.Format.GeoJSON();
                var geojson_format = new OL.Format.GeoJSON({
                    'internalProjection': new OpenLayers.Projection(projection),
                    'externalProjection': new OpenLayers.Projection(params.selected.srs)
                });*/
                //var features = geojson_format.read(data);
                Layer.addFeatures(features);
                
            }
            
        }
    }
    setServiceG = setService;
    var getPosition = function(p){
        if(p>1){
            p+=4;
        }
        return p;
    }
    var removeService = function(params){
        var Layer = Map.getLayer(params.id);
        if(Layer){
            if(params.type=='WFS'){
                Layer.removeFeatures(Layer.features);
            }
            delete Map.Layers["'"+params.id+"'"];
            Layer.destroy();
        }
    }
    
    /********************************************************/
    
    var verifyService = function(a){
        a.type = a.type.toUpperCase();
        //a.path = a.path.replace(/[\u003F]/gi,'');
        var sign = a.path.indexOf('?');
        var sufix='';
        if(a.type!='TMS'){
            if(sign==((a.path.length)-1)){
                a.path = a.path.replace(/[\u003F]/gi,'');
                sufix='?';
            }
            if(sign<0){
                sufix='?';
            }
        }
        a.path=a.path+sufix;
        if(a.type=='TMS'){
            var path = a.path;
            if(a.href){
                path = a.href;
            }
            var version = (a.version)?a.version:'1.0.0';
            if(path[path.length-1]!='/'){
                path+='/';
                a.path+='/';
            }
            path+=version+'/';
        }else{
            if(a.GetFeature){
               var layersSelected=[];
                for(var x in a.selected.layers){
                    var i = a.selected.layers[x].layer;
                    layersSelected.push(i);
                }
                var path = a.path+"&service="+a.type+"&version="+a.version+"&request=GetFeature&typeName="+layersSelected.join(",")+"&outputFormat="+a.formatRequest;
                amplify.publish( "layerDisplaySpinner",{status:true,label:'Cargando servicio'} );
                //var path = a.path+"&service="+a.type+"&version=1.1.1&request=GetFeature&typeName="+layersSelected.join(",")+"&outputFormat=json"; 
            }else{
                //var path = a.path+"&service="+a.type+"&version=1.1.1&request=GetCapabilities";
                var version = (a.version)?a.version:'1.1.1';
                var path = a.path+"&service="+a.type+"&version="+version+"&request=GetCapabilities";
                
            }
        }
        var params = {url:path};
        $.ajax({
            type:'POST',
            //timeout:5000,
            dataType: "text",
            contentType:"application/json",
            url: DataSource.files.download,
            //url:'http://10.106.12.12:8080/downloadfile/download',
            //url:'json/tms.txt',
            data:JSON.stringify(params),
            success: function(data){
                switch(a.type){
                    case 'WMS':
                         parseData(data,a);
                        break;
                    case 'WFS':
                        if(a.GetFeature){
                            setService(a,data);    
                        }else{
                            parseDataWfs(data,a);
                        }
                        break;
                    case 'TMS':
                        parseDataTms(data,a);
                        break;
                    case 'WMTS':
                        parseDataWmts(data,a);
                        break;
                }
            },
            error:function(e,b){
              if(e.statusText=='timeout'){
                var response = {valid:false,message:'Se ha excedido el tiempo de espera',data:{layers:[],formats:[]},selected:{},type:a.type};
                if(a.catchEvent){
                        a.catchEvent(response);
                }
              }
            }
        });

    }
    var getData = function(a,p,b){
        var response = {
            title:'',
            layers:a[p.property][p.layers],
            version:a.version,
            type:b.type,
            url:b.path
        };
        response.title = (a[p.title])?a[p.title]:a.service.title;
        //a[p.title].title,
        return response;  
    };
    var getPropertyOfService = function(service){
        var response='';
        switch(service){
            case 'WMS':
                response ={
                    property:'capability',
                    layers:'layers',
                    title:'service',
                    name:'name'
                };
                break;
            case 'WFS':
                response = {
                    property:'featureTypeList',
                    layers:'featureTypes',
                    title:'serviceIdentification',
                    name:'name'
                };
                break;
            case 'WMTS':
                response = {
                    property:'contents',
                    layers:'layers',
                    title:'serviceIdentification',
                    matrix:'tileMatrixSets',
                    name:'identifier'
                }
            default: 
        }
        return response;
    };
    var incrementCounter=function(){
        counter+=1;
    }
    var getCounter=function(){
        return counter;
    }
    var getName=function(){
        return textService+getCounter();
    }
    var getId=function(){
        return textId+getCounter();
    }
    var parseData = function(a,b) {
        incrementCounter();
        var response = {valid:false,message:'Fuente de informaci&oacute;n no valida',data:{layers:[],formats:[]},selected:{},type:b.type,position:Map.getOverlays()+1};
        if(b.type=='TMS'){
            var format = new OL.Format.WMSDescribeLayer();    
        }else{
            var format = new OL.Format[b.type+'Capabilities']();
        }
        var extract = format.read(a);
        var property = getPropertyOfService(b.type);
        if(extract[property.property]){
            var data = getData(extract,property,b);
            if(data.layers){
                var layers='';
                for(var x in data.layers){
                    //console.log(data.layers[x].formats);//array ['image/jpeg','image/png']
                    /**/
                    switch(data.type){
                        case 'WMS':
                            var toReproject = (data.layers[x].srs[projection])?false:true;
                            break;
                        case 'WFS':
                            var toReproject = (data.layers[x].srs.indexOf(projection)!=-1)?false:true;
                            break;
                        case 'WMTS':
                            var toReproject = true;
                            for(var y in data.layers[x].tileMatrixSetLinks){
                                var i = data.layers[x].tileMatrixSetLinks[y].tileMatrixSet;
                                if(i==projection){
                                    toReproject=false;
                                    break;
                                }
                            }
                            break;
                        case 'TMS':
                            break;
                        default: 
                    }
                    /**/
                    
                        if(b.type=='WFS'){
                            response.version = data.version;
                        }
                        response.valid=true;
                        response.message='';
                        var Srs =null;
                        var vectorSrs=[];
                        for(var srs in data.layers[x].srs){
                            Srs=srs;
                            var actualSrs = (b.type=='WFS')?data.layers[x].srs:srs;
                            actualSrs = actualSrs.toUpperCase();
                            var projections = ['EPSG:900913','EPSG:4326'];
                            for(var g in projections){
                                if(actualSrs.indexOf(projections[g])!=-1){
                                    vectorSrs.push(projections[g]);
                                }
                            }
                            //var proj = Srs.split(':');
                            //if((Srs)&&(proj[1].length>=4)){
                            //    vectorSrs.push(Srs);
                           // }
                        }
                        var validFormats = (b.type=='WFS')?{empty:false}: getValidFormats(data.layers[x].formats);
                        var validSRS = getValidSrs(vectorSrs);
                        if((!validFormats.empty)&&(!validSRS.empty)){
                            response.data.layers.push({
                                layer:data.layers[x][property.name],
                                title:data.layers[x].title,
                                formats:validFormats.formats,//data.layers[x].formats,
                                srs:vectorSrs
                                });
                            var formats = validFormats.formats;//data.layers[x].formats;
                            if(!response.data.srs){
                                response.data.srs=[];
                            }
                            //response.data.srs= $.extend(response.data.srs,vectorSrs); 
                            response.data.srs = addSrs(response.data.srs,validSRS.srs);
                            response.data.formats = $.extend(response.data.formats,formats);
                            response.path=b.path;
                        }
                        response.selected={layers:[],format:''},
                        response.tiled=false;
                        response.label=getName();
                        response.id=getId();
                        response.opacity=1;
                        response.active=true;
                    
                }
            }
        }
        if(b.catchEvent){
            if(response.data.layers.length==0){
                response.valid = false;
                response.message='Fuente de informaci&oacute;n no valida';
            }
            Gordis = response;
            b.catchEvent(response);
        }
    };
   
    var parseDataWfs = function(a,b){
        incrementCounter();
        var response = {valid:false,message:'Fuente de informaci&oacute;n no valida',data:{layers:[],formats:[]},selected:{},type:b.type,position:Map.getOverlays()+1};
        var format = new OL.Format[b.type+'Capabilities']();
        var extract = format.read(a);
        var property = getPropertyOfService(b.type);
        if(extract[property.property]){
            var data = getData(extract,property,b);
            if(data.layers){
                var layers='';
                for(var x in data.layers){
                        var layer = data.layers[x];
                        //var toReproject = (layer.srs.indexOf(projection)!=-1)?false:true;
                        response.version = data.version;
                        response.valid=true;
                        response.message='';
                        
                        var srsLayer = getValidSrsToWFS(layer.srs);
                        if(response.valid){
                            response.data.layers.push({
                                layer:layer.name,
                                title:layer.title,
                                formats:['image/vectorial'],//data.layers[x].formats,
                                srs:[srsLayer.srs]
                                });
                            if(!response.data.srs){
                                response.data.srs=[];
                            }
                            response.data.srs = addNewSrs(response.data.srs,srsLayer.srs);
                            response.data.formats = ['image/vectorial'];
                            response.path=b.path;
                            
                        }
                        response.selected={layers:[],format:'image/vectorial'},
                        response.tiled=false;
                        response.label=getName();
                        response.id=getId();
                        response.opacity=1;
                        response.formatRequest = getFormatRequest(extract.capability.request.getfeature.formats); 
                        response.active=true;
                    
                }
            }
        }
        if(b.catchEvent){
            if(response.data.layers.length==0){
                response.valid = false;
                response.message='Fuente de informaci&oacute;n no valida';
            }
            Gordis = response;
            b.catchEvent(response);
        }
    }
    var getFormatRequest = function(formats){
        var validFormats = ['GML3','GML2','GML','JSON'];
        var response = '';
        for(var x in formats){
            var format = formats[x].toUpperCase();
            for(var n in validFormats){
                if(format.indexOf(validFormats[n])!=-1){
                    response = validFormats[n];
                    break;
                }
            }
            if(response!=''){
                break;
            }
        }
        return response;
    }
    var getValidSrsToWFS = function(srs){
        var newSrs='';
        var valid = false;
        var validSrs = ['EPSG:900913','EPSG:3857','EPSG:4326'];
        for(var x in validSrs){
            if(srs.indexOf(validSrs[x])!=-1){
                newSrs = validSrs[x];
                if(validSrs[x]==validSrs[1]){
                    newSrs=validSrs[0];
                }
                valid = true;
                break;
            }
        }
        return {valid:valid,srs:newSrs};
    }
    var parseDataTms = function(a,b) {
        incrementCounter();
        var response = {valid:false,message:'Fuente de informaci&oacute;n no valida',data:{layers:[],formats:[]},selected:{},type:b.type,position:Map.getOverlays()+1};
        
        var doc = new OpenLayers.Format.XML().read(a);
        var format = new OpenLayers.Format.TMSCapabilities();
        var obj = format.read(doc);
        if(obj.services){
            b.href = obj.services[0].href;
            verifyService(b);
        }else{
            if(obj.tileMaps){
                for(var x in obj.tileMaps){
                    
                        var i = obj.tileMaps[x];
                        if(i.srs==projection){
                            response.valid=true;
                            var formats = getValidFormatsTMS(i);
                            response.data.layers.push({
                                layer:i.title,
                                title:i.title,
                                formats:formats,
                                srs:[i.srs]
                                });
                            
                            if(!response.data.srs){
                                response.data.srs=[];
                            }
                            //response.data.srs= $.extend(response.data.srs,vectorSrs); 
                            response.data.srs = addNewSrs(response.data.srs,i.srs);
                            response.data.formats = addNewFormatTms(response.data.formats,formats);
                            response.path=b.path;
                        }        
                        response.selected={layers:[],format:''},
                        response.tiled=false;
                        response.label=getName();
                        response.id=getId();
                        response.opacity=1;
                        response.active=true;
                        
                }
                
            }
            if(b.catchEvent){
                if(response.data.layers.length==0){
                    response.valid = false;
                    response.message='Fuente de informaci&oacute;n no valida';
                }
                b.catchEvent(response);
            }
        }
    };
    var addNewFormatTms = function(source,formats){
        var s = source.join(',');
        s = s.toLowerCase();
        for(var y in formats ){
            var f = formats[y].toLowerCase();
            if(s.indexOf(f)==-1){
                source.push(formats[y]);
            }
        }
        if(source.length==0){
            source = formats;
        }
        
        return source;
    }
    var getValidFormatsTMS = function(layer){
        var validFormats = ['png','jpeg'];
        var response =[];
        var url = layer.href.toLowerCase();
        for(var x in validFormats){
            if(url.indexOf(validFormats[x])!=-1){
                response.push('image/'+validFormats[x]);
            }
        }
        if(response.length==0){
            response.push('image/'+validFormats[0]);
        }
        return response;
    }
    var parseDataWmts = function(a,b){
        //http://v2.suite.opengeo.org/geoserver/gwc/service/wmts
        incrementCounter();
        var response = {valid:false,message:'Fuente de informaci&oacute;n no valida',data:{layers:[],formats:[]},selected:{},type:b.type,position:Map.getOverlays()+1};
        var format = new OL.Format[b.type+'Capabilities']();
        var extract = format.read(a);
        var property = getPropertyOfService(b.type);
        if(extract[property.property]){
            var data = getData(extract,property,b);
            if(data.layers){
                var layers='';
                for(var x in data.layers){
                    var toReproject = true;
                    var layer = data.layers[x];
                    var matrixSet = null;
                    for(var y in layer.tileMatrixSetLinks){
                                var i = layer.tileMatrixSetLinks[y].tileMatrixSet;
                                var valid =['EPSG:900913','900913','Google','3857'];
                                for(var u in valid){
                                    if(i.indexOf(valid[u])!=-1){
                                        toReproject=false;
                                        matrixSet = i;
                                        break;
                                    }
                                    if(extract.contents.tileMatrixSets[i].supportedCRS){
                                        if(extract.contents.tileMatrixSets[i].supportedCRS.indexOf(valid[u])!=-1){
                                            matrixSet=i;
                                            toReproject=false;
                                            break;
                                        }
                                    }
                                }
                    }
                    response.version = data.version;
                    response.valid=true;
                    response.message='';
                    
                    
                    var validFormats = getValidFormats(layer.formats);
                    if((!toReproject)&&(!validFormats.empty)){    
                            
                            response.data.layers.push({
                                layer:layer.identifier,
                                title:layer.title,
                                formats:validFormats.formats,
                                srs:[projection],
                                tileMatrixSet:matrixSet,
                                matrixIds:extract.contents.tileMatrixSets[matrixSet].matrixIds
                                });
                            
                            if(!response.data.srs){
                                response.data.srs=[];
                            }
            
                            response.data.srs = [projection];
                            response.data.formats = addNewFormatTms(response.data.formats,validFormats.formats);
                            response.path=b.path;
                    }
                        response.selected={layers:[],format:''},
                        response.tiled=false;
                        response.label=getName();
                        response.id=getId();
                        response.opacity=1;
                        response.active=true;
                    
                }
            }
        }
        if(b.catchEvent){
            if(response.data.layers.length==0){
                response.valid = false;
                response.message='Fuente de informaci&oacute;n no valida';
            }
            Gordis = response;
            b.catchEvent(response);
        }
    }
    var addNewSrs = function(source ,srs){
        var info = source;
        
        for(var x in info){
            var i = info[x];
            if(i.indexOf(srs)==-1){
                info.push(i);
            }
        }
        if(info.length==0){
            info.push(srs);
        }
        return info;
    }
    var addSrs = function(source ,srs){
        var info = source.join(',');
        for(var x in srs){
            var i = srs[x];
            if(info.indexOf(i)==-1){
                source.push(i);
            }
        }
        return source;
    }
    var getValidFormats = function(formats){
        var response = [];
        var empty =true;
        var Formats = formats.join(',');
        Formats = Formats.toLowerCase();
        var validFormats = ['png','jpeg'];
        var prefix = 'image/';
        for(var x in validFormats){
            var f = validFormats[x];
            if(Formats.indexOf(prefix+f)!=-1){
                response.push(prefix+f);
                empty=false;
            }
        }
        return {empty:empty,formats:response};
    };
    var getValidSrs = function(a){
        var response = [];
        var empty =true;
        var SRS = a.join(',');
        SRS = SRS.toUpperCase();
        var validSRS = ['EPSG:4326','EPSG:900913'];
        for(var x in validSRS){
            var f = validSRS[x];
            if(SRS.indexOf(f)!=-1){
                response.push(f);
                empty=false;
            }
        }
        return {empty:empty,srs:response};
    };
    var getWmsUrl = function(bounds,srs) {
            
          // recalculate bounds from Google to WGS
            var proj = new OL.Projection(this.srsToReproject);
	    var auxBounds =  $.extend({}, bounds);
            bounds.transform(Map.map.getProjectionObject(), proj);
	    var coordinates=null;
          // this is not necessary for most servers display overlay correctly,
          //but in my case the WMS  has been slightly shifted, so I had to correct this with this delta shift
          
            bounds.left += this.deltaX;
            bounds.right += this.deltaX;
            bounds.top += this.deltaY;
            bounds.bottom += this.deltaY;
	    /*
            if(bounds.bottom<1){
                return false;
            }*/
	    coordinates =(bounds.bottom<1)?auxBounds:bounds;
            
            var url = this.url;
            url += "&REQUEST=GetMap";
            url += "&SERVICE=WMS";
            url += "&VERSION=1.1.1";
            url += "&LAYERS=" + this.layers;
            url += "&FORMAT=" + this.format;
            url += "&TRANSPARENT=TRUE";
            url += "&SRS=" + "EPSG:4326";
            url += "&BBOX=" + coordinates.toBBOX();
            url += "&WIDTH=" + this.tileSize.w;
            url += "&HEIGHT=" + this.tileSize.h;
            return url;
        

    }
    
    var getWmsUrlNotTiled = function(bounds,srs) {
            
            var extentMap = Map.map.baseLayer.getExtent();
            var cloneExtentMap = extentMap.clone();
            cloneExtentMap = cloneExtentMap.transform(Map.map.getProjectionObject(), 'EPSG:4326');
            console.log(cloneExtentMap);
          // recalculate bounds from Google to WGS
            var proj = new OL.Projection(this.srsToReproject);
            var auxBounds =  bounds.clone();
            auxBounds.transform(Map.map.getProjectionObject(), proj);
          
          // this is not necessary for most servers display overlay correctly,
          //but in my case the WMS  has been slightly shifted, so I had to correct this with this delta shift
            
            //coordinates =(.bottom<1)?auxBounds:bounds;
            
            var fixed = {
                        '5':0.815,
                        '6':0.19,//1.7
                        '7':0,
                        '8':0
            }
            var deltaY = 0;
            try{
                       var section = "'"+Map.map.getZoom()+"'";
                       deltaY = fixed[eval(section)];
                       deltaY = (deltaY)?deltaY:0;
                       deltaY = 0.8; 
            }catch(e){
                        deltaY = 0;
            }
            deltaY=0;
            //console.log("es " +  deltaY);
            bounds.left += this.deltaX;
            bounds.right += this.deltaX;
            bounds.top += deltaY; //this.deltaY;
            bounds.bottom += deltaY; //this.deltaY;
          
                      //construct WMS request
            //var r2 = map.baseLayer.getExtent();
            //var r= r2.clone();
            //r.transform(mercator,geographic);

           
            var url = this.url;
            url += "&REQUEST=GetMap";
            url += "&SERVICE=WMS";
            url += "&VERSION=1.1.1";
            url += "&LAYERS=" + this.layers;
            url += "&FORMAT=" + this.format;
            url += "&TRANSPARENT=TRUE";
            url += "&SRS=" + "EPSG:4326";
            //url += "&BBOX=" + auxBounds.left+","+auxBounds.bottom+","+auxBounds.right+","+auxBounds.top;//r.left+","+r.bottom+","+r.right+","+r.top;
            
            url += "&BBOX=" + cloneExtentMap.left+","+cloneExtentMap.bottom+","+cloneExtentMap.right+","+cloneExtentMap.top;
            url += "&WIDTH=" + this.tileSize.w;
            url += "&HEIGHT=" + this.tileSize.h;
            return url;

    }
    
    function get_wms_url(bounds) {

        // recalculate bounds from Google to WGS
           var proj = new OpenLayers.Projection("EPSG:4326");
            bounds.transform(Map.map.getProjectionObject(), proj);
        
        // this is not necessary for most servers display overlay correctly,
        //but in my case the WMS  has been slightly shifted, so I had to correct this with this delta shift
        
                    bounds.left += this.deltaX;
                    bounds.right += this.deltaX;
                    bounds.top += this.deltaY;
                    bounds.bottom += this.deltaY;
        
                    //construct WMS request
        
                  var url = this.url;
                    url += "&REQUEST=GetMap";
                    url += "&SERVICE=WMS";
                    url += "&VERSION=1.1.1";
                    url += "&LAYERS=" + this.layers;
                    url += "&FORMAT=" + this.format;
                    url += "&TRANSPARENT=TRUE";
                    url += "&SRS=" + "EPSG:4326";
                    url += "&BBOX=" + bounds.toBBOX();
                    url += "&WIDTH=" + this.tileSize.w;
                    url += "&HEIGHT=" + this.tileSize.h;
                    return url;

    }
        
    return{
        conect:function(a,b){
            conect(a,b);
        },
        initialize:function(m){
            init(m);
        },
        event:event
    };
});