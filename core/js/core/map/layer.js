define(['OpenLayers','config','tree'],function(OL,config,tree) {
    
   
    var matrixIds = new Array(26);
    for (var i=0; i<26; ++i) {
        matrixIds[i] = /*"EPSG:900913:"*/ ""+(i+1);
    }

    var getTemplate = function(){
        var template = {
            type:'',
            name:'',
            url:'',
            isBase:true,
            layer:'',
            matrixSet:'',
            matrixIds:matrixIds,
            style:'',
            info:{
                sphericalMercator: '',
                type: '',
                name:'',
                numZoomLevels: 17 ,
                layers:'',
                format:'',
                key:'',
                maxResolution:config.mapConfig.resolutions[0],
                minZoomLevel:5,
                zoomOffset: 5,
                tato:0,
                layername:''
            },
            params:{
                tiled:'',
                effect:'',
                buffer:0,
                ratio:1
            }
        }
        return template;
    };
    
    var getTypeLayer = function(e){
        var o = e.toLowerCase();
        switch(o){
            case 'google':
            case 'bing':
                var fi = o[0].toUpperCase();
                o = fi+(o.substring(1,o.length));
                break; 
            case 'esri': o = 'xyz';
            default : o = o.toUpperCase();
        }
        return o;
    };
    
    var buildLayer = function(s,i,ov){
        var type = getTypeLayer(i.type);
        var t = getTemplate();
        t.type=type;
        t.name=s;//x;
        t.url = i.url;
        t.info.type = i.layer;
        
        if(type=='Bing'){
            delete t.name;
            t.info.name = s;
            t.info.key = i.key;
            delete t.info.zoomOffset
        }else{
            delete t.info.name;
            delete t.info.key;
        }
        if(type!='Google'){
            delete t.info.numZoomLevels;
        }else{
            t.info.numZoomLevels = 17;
        }
        if(type!='WMS'){
            delete t.info.layers;
            delete t.info.format;
            delete t.params.effect;
            delete t.params.buffer;
        }else{
            t.info.layers = (i.layer)?i.layer:'';
            t.info.format = (i.format)?i.format:'jpeg';
            t.params.tiled = false;
            if(i.tiled!=undefined){
                t.params.tiled = i.tiled;
            }
            t.params.effect = false;
            t.params.buffer=0;
        }
        if(type=='XYZ'){
            if(!ov){
                delete t.info.sphericalMercator;
            }
           delete t.params;
           delete t.info.maxResolution;
           delete t.info.minZoomLevel;
        }else{
            delete t.info.sphericalMercator;
        }
        if(type=='OSM'){
            delete t.info;
            delete t.params;
            delete t.url;
        }
        if((type!='Bing')&&(type!='Google')&&(type!='TMS')){
           try{
               delete t.info.type;
           }catch(e){}
        }else{
            delete t.params;
            if(type!='TMS'){
                delete t.url;
            }
        }
        if(type=='TMS'){
            delete t.params;
            t.info.layername=i.layer;
            t.info.type='jpeg';
            delete t.info.maxResolution;
            delete t.info.minZoomLevel;
            delete t.info.zoomOffset;
        }else{
            delete t.layername;
        }
        
        if(type=='WMTS'){
            delete t.params;
            delete t.info;
            t.matrixSet = i.matrixSet;
            //t.projection= "EPSG:4326";
            if(i.matrixIds){
                
            }else{
                delete t.matrixIds;
            }
            t.layer = i.layer;
        }else{
            delete t.layer;
            delete t.matrixIds;
            delete t.matrixSet;
            delete t.style;
        }
        if(ov){
            try{t.info.numZoomLevels=3}catch(e){}
            try{t.info.maxResolution=4891.969809375}catch(e){}
            try{t.info.minZoomLevel=2;}catch(e){}
            try{t.info.zoomOffset=0;t.info.sphericalMercator=true;}catch(e){}
            if(type=='Bing'){
                delete t.info.sphericalMercator;
                delete t.info.zoomOffset;
                delete t.info.minZoomLevel;
            }
            if(type=='XYZ'){
                delete t.info.maxResolution;
                delete t.info.minZoomLevel;
            }
            if(type=='Google'){
                delete t.info.maxResolution;
                delete t.info.zoomOffset;
                delete t.info.sphericalMercator;
            }
            if(type=='WMS'){
                delete t.info.maxResolution;
                delete t.info.zoomOffset;
                delete t.info.sphericalMercator;
                delete t.info.numZoomLevels;
            }
        }
        return t;
    };
    
    var getParamsLayer = function(d){
        var r = null;
        var cantidad = 0;
        for(x in d){
                    if(cantidad==0){r={}}
                    cantidad++;
                    var i = d[x];
                    switch(x){
                        case 'format': r[x] = 'image/'+i;break;
                        case 'effect': r['transitionEffect'] = i;break;
                        case 'tiled': if(!i){
                                            r['singleTile']=!i;
                                        }
                                        break;
                        case 'type': try{r[x]=eval(i)}catch(e){r[x]=i;};break;
                        default : r[x] = i;
                    }
        }
        if(cantidad==1){
            var valid = true;
            var redefine = null;
            for(x in r){
                if(x!='sphericalMercator'){ 
                redefine = r[x];
                }else{
                    valid=false;
                }
            }
            if(valid){
                r = redefine;
            }
        }
        return r;
    };
     
    var getNewLayer = function(p){
            var f=[];
            var properties= getParamsLayer(p.info);
            var params= getParamsLayer(p.params);
            var isBase=false;
            try{isBase=(p.isBase)?true:false;}catch(e){}
            if(p.name){
                f.push(p.name);
            }
            if(p.url){
                f.push(p.url);
            }
            if(p.style){
                f.push(p.style);
            }
            f.push(properties);
            f.push(params);
            if(p.type=='WMTS'){
                var newLayer = new OL.Layer[p.type](p);
            }else{
                var newLayer = new OL.Layer[p.type](f[0],f[1],f[2],f[3]);
            }
            if(p.type=='WMS'){
                if(properties.layers ==''){
                    newLayer.setVisibility(false);
                }
            }
            return newLayer;
    };
    return{
        getTemplate:getTemplate,
        buildLayer:buildLayer,
        getParamsLayer:getParamsLayer,
        getNewLayer:getNewLayer
    };
});