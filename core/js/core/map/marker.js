
define(['OpenLayers','config','dataSource','request'],function(OL,config,dataSource,Request) {
    var Map;
    var Data = {
        reg:{
            data:{}, 
            type:{},
            add:function(i,t,p){
                var c = 'custom';
                i[c]=p;
                i[c]['type']=t;
                i[c]['item']='point';
                var d = Data.reg;
                var data = d.data;
                var type = d.type;
                data[i.id]=i;
                if(!type[t]){
                    type[t]={};
                }
                type[t][i.id]="";
            },
            get:function(i){
                var data = Data.reg.data;
                response = (data[i])?data[i]:null;
                return response;
            }
        },
        layer:null,
        layerMirror:null,
        image:{
            active:'active',
            path: ((typeof apiUrl!=='undefined')?((apiUrl)?apiUrl:''):'')+'img/marks/',
            format:'.png',
            width:'35',
            height:'50',
            measure:'px'
        },
        getImage :function(){
            var a = arguments[0];
            return this.image.path+a+this.image.format;
        }
    };
    
    var defineLayer = function(map){
        Map = map;
        var p ={
                type:'Vector',
                name:'Markers',
                position:3,
                info:{
                    renderers:["SVG","Canvas", "VML"],//Map.render,
                    styleMap:new OL.StyleMap({
                                "default": new OL.Style(OL.Util.applyDefaults({
                                    fillOpacity:1,
                                    externalGraphic: "${image}",
                                    graphicWidth: "${gWith}",
                                    graphicHeight: "${gHeight}",
                                    labelAlign: "center",
                                    fontColor: "#000000",
                                    fontWeight: "bold",
                                    labelOutlineColor: "white",
                                    labelOutlineWidth: 3,
                                    fontFamily: "Courier New, monospace",
                                    fontSize: "16px",
                                    pointRadius: 10,
                                    graphicYOffset:-43,
                                    graphicOpacity:1
                                    
                                }, OL.Feature.Vector.style["default"])),
                                
                                "select": new OL.Style(OL.Util.applyDefaults({
                                    fillOpacity:1,
                                    externalGraphic: "${image}",
                                    graphicWidth: "${gWith}",
                                    graphicHeight: "${gHeight}",
                                    labelAlign: "center",
                                    fontColor: "#000000",
                                    fontWeight: "bold",
                                    labelOutlineColor: "white",
                                    labelOutlineWidth: 3,
                                    fontFamily: "Courier New, monospace",
                                    fontSize: "16px",
                                    pointRadius: 10,
                                    graphicYOffset:-43,
                                    graphicOpacity:1
                                    
                                }, OL.Feature.Vector.style["default"])),
                                "temporary": new OL.Style(OL.Util.applyDefaults({
                                    fillOpacity:1,
                                    externalGraphic: "${image}",
                                    graphicWidth: "${gWith}",
                                    graphicHeight: "${gHeight}",
                                    labelAlign: "center",
                                    fontColor: "#000000",
                                    fontWeight: "bold",
                                    labelOutlineColor: "white",
                                    labelOutlineWidth: 3,
                                    fontFamily: "Courier New, monospace",
                                    fontSize: "16px",
                                    pointRadius: 10,
                                    graphicYOffset:-43,
                                    graphicOpacity:1
                                    
                                }, OL.Feature.Vector.style["default"]))
                    })
                }
        };
        Map.addLayer(p);
        Data.layer = Map.getLayer('Markers');
        var p2 ={
                type:'Vector',
                name:'Markers2',
                position:3,
                info:{
                    renderers:["Canvas","SVG", "VML"],
                    styleMap:new OL.StyleMap({
                                "default": new OL.Style(OL.Util.applyDefaults({
                                    fillOpacity:1,
                                    externalGraphic: "${image}",
                                    graphicWidth: "${gWith}",
                                    graphicHeight: "${gHeight}",
                                    labelAlign: "center",
                                    fontColor: "#000000",
                                    fontWeight: "bold",
                                    labelOutlineColor: "white",
                                    labelOutlineWidth: 3,
                                    fontFamily: "Courier New, monospace",
                                    fontSize: "16px",
                                    pointRadius: 10,
                                    graphicYOffset:-43,
                                    graphicOpacity:1
                                    
                                }, OL.Feature.Vector.style["default"])),
                                
                                "select": new OL.Style(OL.Util.applyDefaults({
                                    fillOpacity:1,
                                    externalGraphic: "${image}",
                                    graphicWidth: "${gWith}",
                                    graphicHeight: "${gHeight}",
                                    labelAlign: "center",
                                    fontColor: "#000000",
                                    fontWeight: "bold",
                                    labelOutlineColor: "white",
                                    labelOutlineWidth: 3,
                                    fontFamily: "Courier New, monospace",
                                    fontSize: "16px",
                                    pointRadius: 10,
                                    graphicYOffset:-43,
                                    graphicOpacity:1
                                    
                                }, OL.Feature.Vector.style["default"])),
                                "temporary": new OL.Style(OL.Util.applyDefaults({
                                    fillOpacity:1,
                                    externalGraphic: "${image}",
                                    graphicWidth: "${gWith}",
                                    graphicHeight: "${gHeight}",
                                    labelAlign: "center",
                                    fontColor: "#000000",
                                    fontWeight: "bold",
                                    labelOutlineColor: "white",
                                    labelOutlineWidth: 3,
                                    fontFamily: "Courier New, monospace",
                                    fontSize: "16px",
                                    pointRadius: 10,
                                    graphicYOffset:-43,
                                    graphicOpacity:1
                                    
                                }, OL.Feature.Vector.style["default"]))
                    })
                }
        };
        Map.addLayer(p2);
        Data.layerMirror = Map.getLayer('Markers2');
    };
    
    var buildMirror = function(){
        
        var newFeatures=[];
        for(var x in Data.layer.features){
            var feature = Data.layer.features[x];
            var f = feature.clone();
            newFeatures.push(f);
        }
        Data.layerMirror.destroyFeatures();
        Data.layerMirror.addFeatures(newFeatures)
        Data.layer.setVisibility(false);
        Data.layerMirror.setVisibility(true);
    };
    var clearMirror = function(){
        Data.layer.setVisibility(true);
        Data.layerMirror.setVisibility(false);
    }
    
    var setArguments = function(){
       var a = arguments;
       a[0].attributes = a[1];
       Data.layer.redraw();
    };
    
    var getParamsforType = function(){
        var a = arguments;
        var p=a[0];
        var i = Data.image;
        p['image']=Data.getImage(a[1]);
        p['gWith']=i.width;
        p['gHeight']=i.height;
        p['type']=a[1];
        if(typeof(a[2])!='undefined'){
             p['group']=a[2];
        }
        if(typeof(p.description)!='undefined'){
            p['description']=p.description;
        }
        
        return p;
    };
    var getFeatureFromWKT = function(){
        var a = arguments;
        var projection = new OL.Projection(config.mapConfig.projection);
        var f = new OL.Format.WKT(projection).read(a[0]);
        var b;
        var v = false;
        if(f){
                if(f.constructor != Array) {
                    f = [f];
                }
                for(x in f){
                    if (!b) {
                        b = f[x].geometry.getBounds();
                    } else {
                        b.extend(f[x].geometry.getBounds());
                    }
                }
                v = true;
        }
        return {features:f,valid:v,bounds:b};
    };
    var getLastMarker = function (){
        return Data.layer.features[Data.layer.features.length-1]; 
    };
    var storeMarker = function(i){
                var storer = Request.New({
                    url:dataSource.geometry.store.url,
                    type:dataSource.geometry.store.type,
                    format:dataSource.geometry.store.dataType,
                    params:'',
                    extraFields:'',
                    contentType:dataSource.geometry.store.contentType,
                    events:{
                        success:function(data,extra){
                                var messages=[];
                                if(data){
                                    if(data.response.success){
                                        extra.item.custom['db']=data.data.id;
                                    }else{
                                        messages.push(data.response.message);
                                    }
                                }else{
                                     messages.push('Servicio para almacenar georeferencias no disponible');
                                }
                                
                                if(messages.length>0){
                                    for(var x=0;x<messages.length;x++){
                                        MDM6('newNotification',{message:messages[x],time:5000});
                                    }
                                }
                            //reg.data[extra.id].custom['db']=data[0];
                        },
                        before:function(){
                            //console.log("antes");
                        },
                        error:function(a,b,c){
                            MDM6('newNotification',{message:'El servicio  para almacenar georeferencias no esta disponible',time:5000});      
                        },
                        complete:function(){
                           // console.log("terminado");
                        }
                    }
                });
                
                storer.setParams(JSON.stringify({geometry:i.geometry+''}));
                storer.setExtraFields({item:i});
                storer.execute();  
    };
    var create = function(){
        //a[0]={wkt:'',lon:'',lat:'',store:true,type:'',zoom:true,params:{nom:'',desc:''}}
        var a = arguments[0];
        var store = (a.store)?a.store:false;
        var zoom = (a.zoom)?a.zoom:false;
        var store = (a.store)?a.store:false;
        var showPopup = (a.showPopup)?a.showPopup:false;
        var lon,lat,marker;
        var insert=true;
        if(a.wkt){
            var info = getFeatureFromWKT(a.wkt);
            if(info.valid){
                lon = info.bounds.bottom;
                lat = info.bounds.top;
            }else{
                insert=false;
            }
        }else{
            lon = a.lon;
            lat = a.lat;
        }
        if(insert){
            var marker = [new OL.Feature.Vector(new OL.Geometry.Point(lon, lat))];
            var tipo = (a.params.image)?a.params.image:a.type;
            marker[0].attributes=getParamsforType(a.params,tipo);
            if(tipo!=a.type){
                marker[0].attributes['pathImage']=tipo;
            }
            Data.layer.addFeatures(marker);
            if(zoom){
                Map.map.setCenter(new OpenLayers.LonLat(lon,lat), zoom);
            }
            Data.reg.add(marker[0],a.type,a.params);
            if(store){
                storeMarker(marker[0]);
            }
            if(showPopup){
                MDM6('showPopupForMarker',marker[0].id,a.type);
            }
            return marker[0].id;
        }
    };
    var getPropertieVisibility = function(){ 
        var a = arguments;
        return (a[0])?null:"display:none"
    };
    
    var setVisibility = function(){
        var a = arguments;
        var source = getSource(a[0],a[1]);
        var prop = getPropertieVisibility(a[2]);
        for(x in source){
            var item = (source[x].id)?source[x].id:x;
            Data.reg.data[item].style = prop;
        }
        if(Data.layer.features.length>0){
            Data.layer.redraw();
        }
    };
    var cleanMarksSelected = function(){
        var a = arguments;
        var source = getSource(a[0],a[1]);
        for(x in source){
            var item = (source[x].id)?source[x].id:x;
            if(item!=a[0]){
                item=source[x];
            }
            //var item = source[x];
            var mark = Data.reg.data[item];
            var oldFeatures = jQuery.extend({},mark.custom);
            mark.attributes=oldFeatures;
        }
        if(Data.layer.features.length>0){
            Data.layer.redraw();
        }
    };
    var select = function(){
        var a = arguments;
        cleanMarksSelected(a[0],a[1]);
        var source = getSource(a[0],a[1]);
        var segment=Data.image.active;
        var Mark = null;
        for(x in source){
            var item = (source[x].id)?source[x].id:x;
            //var item = source[x];
            if(item!=a[0]){
                item=source[x];
            }
            var mark = Data.reg.data[item];
            var newAttibutes = jQuery.extend({},mark.attributes);
            if(typeof mark.attributes.pathImage == "undefined"){
                var image = mark.attributes.type;
            }else{
                var image = (mark.attributes.type!=mark.attributes.pathImage)?mark.attributes.pathImage:a[1];
            }
            
            newAttibutes.image = Data.getImage(image+'_'+segment);
            mark.attributes=newAttibutes;
            Mark = mark;
        }
        if(Data.layer.features.length>0){
            Data.layer.redraw();
            animateMark(Mark);
        }
    };
    var animateMark = function(feature) {
        clearInterval(window.moveInterval);
        var item = $("#"+feature.geometry.id);
        var yPos = parseFloat(item.attr('y'));
        var count=0;
        var speed=5;
        var total = 30;
        var yNewPos = yPos-total;
        var plus = true;
        var laps =0;
        var move = function(){
            
            if (count>total) {
                    laps+=1;
                    if(laps>2){
                        clearInterval(window.moveInterval);
                    }else{
                        total=total-7;
                        switch(laps){
                            case 1:
                                plus=false;
                                yNewPos=yPos+0;
                                count=0;
                                break;
                            case 2:
                                plus=true;
                                count=0;
                                yNewPos = yPos-total;
                                break;
                            case 3:
                                plus=false;
                                yNewPos=yPos+0;
                                count=0;
                                break;
                                
                        }
                    }
            }else{
               
                if(plus){
                     var pos = yNewPos+count
                }else{
                     var pos = yNewPos-count
                }
                item.attr('y',pos);
                count+=1;
            }
        };
        window.moveInterval = window.setInterval(move,speed);
    };
    var remove = function(){
        var a = arguments;
        var source = getSource(a[0],a[1]);
        for(x in source){
            var item = (source[x].id)?source[x].id:x;
            Data.reg.data[item].destroy();
            delete Data.reg.data[item];
            delete Data.reg.type[a[1]][item];
        }
    };
    var showPopup = function(){
        var a = arguments;
        var source = getSource(a[0],a[1]);
        for(x in source){
            
            var item = source[x];
            var e = Data.reg.data[item];
            
            if(typeof(e.custom.desc) == 'object'){
                var lonlat = new OL.LonLat(e.geometry.x,e.geometry.y);
                var px = Map.map.getPixelFromLonLat(lonlat);
                MDM6('showRecordCardMarker',{/*lonlat:lonlat*/id:e.custom.desc.id,xy:{x:px.x,y:px.y}});
            }
        }
    };
    var deleteByGroup  = function(group,tipo){
        var a = arguments;
        var items = [];
        for(var x in Data.reg.data){
            var item = Data.reg.data[x];
            if(item.custom.group==group){
                items.push({id:item.id});
            }
        }
        if(items.length>0){
            remove(items,tipo);
        }
    
        
        
    };
    var hideByGroup  = function(group,tipo){
        var a = arguments;
        var items = [];
        for(var x in Data.reg.data){
            var item = Data.reg.data[x];
            if(item.custom.group==group){
                items.push({id:item.id});
            }
        }
        if(items.length>0){
            setVisibility(items,tipo,false);
        }
        
        
    };
    var showByGroup  = function(group,tipo){
        var a = arguments;
        var items = [];
        for(var x in Data.reg.data){
            var item = Data.reg.data[x];
            if(item.custom.group==group){
                items.push({id:item.id});
            }
        }
        if(items.length>0){
            setVisibility(items,tipo,true);
        }
        
        
    };
    var getSource = function(){
        var a = arguments;
        var source;
        if(a[0]=='all'){
            source = Data.reg.type[a[1]];
        }else{
            source = a[0];
        }
        return source;
    };
    var setData = function(){
        var a = arguments;
        var source = getSource(a[0],a[1]);
        var items = ['nom','desc','address'];
        for(x in source){
            var item = (source[x].id)?source[x].id:x;
            var mark = Data.reg.data[item];
            for(i in items){
                var param = items[i];
                if(a[2][param]){
                    mark.custom[param]=a[2][param];
                }
            }
            
        }
    };
    var getGeo = function(a){
        var source = getSource('all','georeference');
        for(x in source){
            var item = (source[x].id)?source[x].id:x;
            var feature = Data.reg.data[item];
            var elemento = feature.clone();
            //var elemento = $.extend(true,{},Data.reg.data[item]);
            elemento.attributes['name']=elemento.attributes.nom;
            elemento.attributes['description'] = (typeof(elemento.attributes.address)=="undefined")?elemento.attributes.desc:getHtmlAddress(elemento.attributes.address);
            //elemento.attributes['description']=elemento.attributes.desc;
            a.push(elemento);
        }
        return a;
    };
    var getGeoAddress = function(a){
        var source = getSource('all','georeferenceAddress');
        for(x in source){
            var item = (source[x].id)?source[x].id:x;
            var feature = Data.reg.data[item];
            var elemento = feature.clone();
            //var elemento = $.extend(true,{},Data.reg.data[item]);
            elemento.attributes['name']=elemento.attributes.nom;
            elemento.attributes['description'] = (typeof(elemento.attributes.address)=="undefined")?elemento.attributes.desc:getHtmlAddress(elemento.attributes.address);
            //elemento.attributes['description']=elemento.attributes.desc;
            a.push(elemento);
        }
        return a;
    }
    var getHtmlAddress = function(o){
        var chain='<table bordercolor="#CCCCCC" style="border-collapse:collapse;">';
        
        var s = o.sections;
        for(var x in s){
            if(typeof(s[x])=='object'){
                for(var y in s[x]){
                        var b = s[x][y];
                        for(var f in b){          
                            chain+='<tr style="border-color:#CCCCCC; border-style:dotted ; border-width:2px;"><td>'+b[f].label +'</td><td style="border-left-style:dotted;border-left-width: 2px;border-color:#CCCCCC" >'+b[f].value+'</td></tr>';
                        }
                }
            }  
        }
        chain+='</table>';
        return chain;
    };
    var locateAndZoom = function(){
        var id = arguments[0];
        var f = Data.reg.get(id);
        var lon = f.geometry.x;
        var lat = f.geometry.y;
        //var zoom = Map.map.getZoom();
        var zoom =  config.mapConfig.resolutions.length-1;
        Map.map.setCenter(new OL.LonLat(lon,lat),zoom);
    };
    var action = function(){
        //{action:'remove',items:'all',type:'poi'}
        //{action:'hide',items:'[id1,id2],type:'poi'}
        //{action:'show',items:'all',type:'poi'}
        var a = arguments[0];
        switch(a.action){
            case 'delete':
                remove(a.items,a.type);
                break;
            case 'hide':
                setVisibility(a.items,a.type,false);
                break;
            case 'show':
                setVisibility(a.items,a.type,true);
                break;
            case 'select':
                select(a.items,a.type);
                break;
            case 'unselect':
                cleanMarksSelected(a.items,a.type);
                break;
            case 'set':
                setData(a.items,a.type,a.params);
                break;
            case 'locate':
                locateAndZoom(a.id);
                break;
            case 'deleteByGroup':
                deleteByGroup(a.group,a.type);
                break;
            case 'hideByGroup':
                hideByGroup(a.group,a.type);
                break;
            case 'showByGroup':
                showByGroup(a.group,a.type);
                break;
            case 'showPopup':
                showPopup(a.items,a.type);
                break;
        }
    };
    var removeLast = function(){
        var marker = getLastMarker();
        remove([{id:marker.id}],arguments[0]);
    };
    
    return {
        addLayer:defineLayer,
        add:create,
        event:action,
        reg:Data.reg,
        getLastMarker:getLastMarker,
        removeLast:removeLast,
        getGeo:getGeo,
        getGeoAddress:getGeoAddress,
        buildMirror:buildMirror,
        clearMirror:clearMirror
    };
});