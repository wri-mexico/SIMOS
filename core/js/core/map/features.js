var alternoM =null;
define(['OpenLayers','config','timer','marker','popup','request','modal','dataSource','notification','cluster','escuelas'],function(OL,config,Timer,Markers,Popup,Request,Modal,dataSource,Notification,Cluster,Escuelas) {//
    config.mapConfig.projection,'config'
    var clusterSelected = false;
    var idContainerMeasure ='medidaG';
    var idInfFeat='InfoFeature';
    var getLastMousePosition;
    
    var storeFeature = function(i){
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
                                        reg.data[extra.id].custom['db']=data.data.id;
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
                storer.setExtraFields({id:i.id});
                storer.execute();  
    };
    
    var addBuffer = Request.New({
        //url:'http://10.28.19.73:8080/TableAliasV60/buffer.do',
        //url:'http://10.1.30.102/TableAliasV60/buffer.do',
        url:dataSource.geometry.addBuffer.url,
        type:dataSource.geometry.addBuffer.type,
        format:dataSource.geometry.addBuffer.dataType,
        contentType:dataSource.geometry.addBuffer.contentType,
        params:'',
        events:{
            success:function(data,extraFields){
                var messages=[];
                if(data){
                    if(data.response.success){
                        
                            var oldFeature = reg.get(extraFields.id);
                            var copyFeature = $.extend({},reg.get(extraFields.id));
                            //var wkt = data.datos[0].data;
                            var wkt = data.data.buffer.geometry;
                            //var params = {wkt:wkt,store:false,zoom:false,params:format.get('buffer','polygon')};
                            var params = {wkt:wkt,store:false,zoom:false,params:format.get('georeference','polygon')};
                            create(params);
                            eventFinishedCeationGeo.execute(temporalGeoParams);
                            
                            if(extraFields.replace){
                                    oldFeature.destroy();
                                    var feature = getLastFeature();
                                    delete reg.data[feature.id];
                                    feature.id = copyFeature.id;
                                    feature.custom['db']=copyFeature.custom.db;
                                    reg.data[copyFeature.id]=feature;
                            }else{
                                    //console.log('asociando'+data.datos[0].id);
                                    var feature = getLastFeature();
                                    //feature.custom['db']=data.datos[0].id;
                                    feature.custom['db']=data.data.buffer.id;
                            }
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
            },
            before:function(a,extraFields){
                //console.log('lanzando ajax')
                if(extraFields.notification){
                    extraFields.notification.show();
                }
                //console.log("antes");
            },
            error:function(a,b,extraFields){
                //console.log('error')
               MDM6('newNotification',{message:'Servicio no disponible',time:5000});
            },
            complete:function(a,b,extraFields){
                if(extraFields.notification){
                    extraFields.notification.hide();
                }
            }
        }
    });
    
    
    var format = {
        buffer:{
            polygon:{
                fColor:"green",
                lSize:1,
                lColor:"black",
                lType:"line",
                type:'buffer',
                name:'buffer',
                item:'feature'
            }
        },
        measure:{
            line:{
                    lColor:'#59590E',
                    lSize:3,
                    lType:'dash',
                    type:'measure',
                    name:'Measure line',
                    item:'feature',
                    unit:'metric'
                },
            polygon:{
                        fColor:'#EEEEEE',
                        lColor:'#D7D7D7',
                        lSize:2,
                        lType:'line',
                        type:'measure',
                        name:'Measure',
                        item:'feature',
                        unit:'metric'
                    }
        },
        
        georeference:{
            line:{
                    lColor:'black',
                    lSize:3,
                    lType:'line',
                    type:'georeference',
                    name:'geo line',
                    item:'feature',
                    unit:'metric'
                },
            polygon:{
                        fColor:'yellow',
                        lColor:'black',
                        lSize:1.5,
                        lType:'line',
                        type:'georeference',
                        name:'geo polygon',
                        item:'feature',
                        unit:'metric'
                    },
            route:{
                    lColor:'black',
                    lSize:3,
                    lType:'line',
                    type:'georeference',
                    name:'geo line',
                    item:'feature',
                    unit:'metric'
                }
        },
        
        get:function(){
            var f = $.extend({},format[arguments[0]][arguments[1]]);
            var tipo = (f.fColor)?'polygon':'line';
            if(arguments[1]=='route'){
                tipo=arguments[1];
            }
            f.name = reg.label[tipo].get();
            f['store']=true;
            return f;
        }
    };
    var contextual = {
        visible:false,
        id:'contextBuff',
        source:{rotate:"Rotar",drag:"Arrastrar",resize:"Redimensionar",vertices:"Editar"/*,del:"Eliminar"*/},
        show:function(f,p){
            this.clear();
            this.build(f,p);
            this.events(f);
            this.visible=true;
        },
        getParams:function(i){
            i=i.replace('Buff','');
            i = i.toLowerCase();
            var p={type:i};
            if(i=='resize'){
                p['aspectRadio']=true;
            }
            if(i=='vertices'){
                p['vertices']=5;
                p['irregular']=false;
            }
            return p;
        },
        clear:function(){
            $("#"+this.id).remove();
            this.visible=false;
        },
        events:function(f){
                var obj=this;
                $(".customBuff").each(function(){
                    $(this).mouseenter(function(){
                        $(this).css('background','#DDDDDD');
                    }).mouseleave(function(){
                        $(this).css('background','none');
                    });
                });
                
                for(x in this.source){
                    var i = this.source[x];
                    $("#Buff"+x).click(function(){
                        obj.action($(this).attr('id'),f);
                    });
                }
                $("#"+this.id).mouseleave(function(){
                    obj.clear();
                });
        },
        action:function(option,feature){
            var obj = this;//modificater
            cleanInfo();
            controls.Editor.deactivate();
            controls.Editor.activate();
            var params = obj.getParams(option);
            activateEvent(params);
            controls.Hover.deactivate();
            controls.Select.deactivate();
            controls.Editor.selectFeature(feature);
            obj.clear();
            Map.activeControl({control:'none',active:true});
        },
        build:function(f,p){
            var c = '<div id="contextBuff" class="ui-corner-all dinamicPanel-shadow dinamicPanel-border dinamicPanel-box-sizing" style="position:absolute;z-index:50000;top:'+p.px.y+'px;left:'+p.px.x+'px;background:white">'+
                    '<div style="margin:5px;">'+
                    '<div>'+f.custom.name+'<hr></div>';
            for(x in this.source){
                c+='<div class="customBuff" id="Buff'+x+'"><div style="margin:5px">'+this.source[x]+'</div></div>';
            }
            c+='</div></div>';
            $("#map").append(c);
        }
    };
    var reg = {
        label:{
            polygon:{
                counter:0,
                text:'&Aacute;rea',
                get:function(){
                    this.counter++;
                    return ConvertToHtml(this.text)+" "+this.counter;
                }
            },
            line:{
                counter:0,
                text:'Distancia',
                get:function(){
                    this.counter++;
                    return this.text+" "+this.counter;
                }
            },
            point:{
                counter:0,
                text:'Punto',
                get:function(){
                    this.counter++;
                    return this.text+" "+this.counter;
                }
            },
            address:{
                counter:0,
                text:'Direcci&oacute;n',
                get:function(){
                    this.counter++;
                    return this.text+" "+this.counter;
                }
            },
            route:{
                counter:0,
                text:'Ruta',
                get:function(){
                    this.counter++;
                    return this.text+" "+this.counter;
                }
            }
        },
        selected:{
            id:null,
            type:null,
            item:null
        },
        setSelected:function(){
            var a = arguments;
            this.selected.id=a[0];
            this.selected.type=a[1];
            this.selected.item=a[2];
            this.clicked = (a[3])?a[3]:false;
        },
        data:{},
        type:{},
        add:function(i){
            var data = reg.data;
            var type = reg.type;
            var t = i.custom.type;
            data[i.id]=i;
            if(!type[t]){
                type[t]={};
            }
            type[t][i.id]="";
            //if((i.custom.type=='buffer')&&(i.custom.store)){
            if((i.custom.store)){
                storeFeature(i);
            }
        },
        get:function(i){
            var data = reg.data;
            response = (data[i])?data[i]:null;
            return response;
        }
    };
    var controls = {
            Editor:null,
            Select:null,
            Hover:null,
            Feature:null
        };
    var itemSelected = {
        buffer:{
            selected:{
                fill:'auto',
                line:'#00FFFF'
            }
        },
        measure:{
            selected:{
                fill:"#059650",
                line:'black'
            }
        },
        changeStatusSelected: function(e){
            var item = e.custom;
            var L = Layer.styleMap.styles.select.defaultStyle;
            var source = (item.type=='buffer')?this.buffer.selected:this.measure.selected;
            L['fillColor'] = ((source.fill=='auto')?item.fColor:source.fill);
            L['strokeColor'] = ((source.line=='auto')?item.lColor:source.line);
            //L['fillOpacity']="0.2";
        },
        item:null,
        setItem:function(i){
            this.item = i;
        },
        draw:function(){
            if(this.item){
                var item = this.item.custom;
                var source = (item.type=='buffer')?this.buffer.selected:this.measure.selected;
                var params = {
                    fColor:((source.fill=='auto')?item.fColor:source.fill),
                    lSize:3,
                    lColor:((source.line=='auto')?item.lColor:source.line),
                    lType:"line"
                };
                setArguments(this.item,params);
            }
        },
        clean:function(){
            if(this.item){
                setArguments(this.item,this.item.custom);
            }
        },
        define:function(f,draw){
                this.changeStatusSelected(f);
                this.clean();
                this.setItem(f);
                if(draw){
                    this.draw();
                }
        }
    };
    var changeStyleVertex = function(){
            var a  = arguments;
            var path = 'img/features/';
            var format = '.png';
            var L = Layer.styleMap.styles.vertex.defaultStyle;
            var p = {
                fillColor:null,
                externalGraphic:null,
                graphicWidth:null,
                graphicHeight:null,
                graphicName: null
            };
            switch(a[0]){
                case 'resize':
                case 'rotate':
                case 'drag':
                    p.externalGraphic=(path+a[0]+format);
                    p.graphicWidth=25;
                    p.graphicHeight=25;
                    break;
                case 'vertices':
                    p.fillColor="white";
                    p.graphicName="square";
                    break;
            }
            for(x in p){
                if(p[x]!=null){
                    L[x]=p[x];
                }else{
                    delete L[x];
                }
            }
    };
    var Layer;
    var Map;
    var enableFeatureCtl = function(status){
        if(status){
            Feature.activate();
        }else{
            Feature.deactivate();
        }
    };
    var  defineActions = function(Ctl){
        OL.Event.observe(document, "keydown", function(evt) {
            var handled = false;
            switch (evt.keyCode) {
                case 90: // z
                    if (evt.metaKey || evt.ctrlKey) {
                        if(Ctl.active){
                            Ctl.undo();
                            handled = true;
                        }
                        
                    }
                    break;
                case 89: // y
                    if (evt.metaKey || evt.ctrlKey) {
                        if(Ctl.active){
                            Ctl.redo();
                            handled = true;
                        }
                    }
                    break;
                case 27: // esc
                    if(Ctl.active){
                        Ctl.cancel();
                        //cancel();
                        eventCancel.func();
                        handled = true;
                    }
                    break;
            }
            if (handled) {
                OL.Event.stop(evt);
            }
        });
    };
    var cancel = function(){
        
    };
    var eventCancel ={
        func:null,
        setFunction :function(){
            eventCancel.func=arguments[0];
        }
    };
    var cleanInfo = function(){
        //$("#"+idInfFeat).remove();
        if(!clusterSelected){
            Popup.clear();
        }
    };

    var getDistance = function(){
        var f = arguments[0];
        var formated = (arguments[1])?arguments[1]:false;
        var system = f.custom.unit;
		var fgeographic = f.clone();
        fgeographic.geometry = fgeographic.geometry.transform('EPSG:900913','EPSG:9102008'); 
        var m = fgeographic.geometry.getGeodesicLength('EPSG:9102008');
        //var m = f.geometry.getLength();
        if(formated){
            if(system=='metric'){
                var units = "m";
                if(m>=1000){
                    units="k"+units;
                    m = ((m)/1000);
                }
            }else{
                m = m*3.2808399;
                var units = "ft";
                if(m>=5280){
                    units="mi";
                    m = ((m)/5280);
                }
            }
            
            m = m.toFixed(3);
            m = getNumberFormated(m)+ " " + units;
        }
        return m;
    };
    var getArea = function(){
        var f = arguments[0];
        var formated = (arguments[1])?arguments[1]:false;
        var system = f.custom.unit;
        
        var fgeographic = f.clone();
        fgeographic.geometry = fgeographic.geometry.transform('EPSG:900913','EPSG:9102008'); 
        var m = fgeographic.geometry.getGeodesicArea('EPSG:9102008');
        //var m = f.geometry.getGeodesicArea('EPSG:9102008');
        //var m = f.geometry.getArea();
        if(formated){
            if(system=='metric'){
                var units = "m<sup>2</sup>";
                if(m>=1000000){
                    //m=m*0.000001;
                    m = ((m)/1000000);
                    units = "k"+units;
                }
            }else{
                m=m*10.7639104;
                var units = "ft<sup>2</sup>";
                if(m>=27878400){
                    m = ((m)/27878400);
                    units = "mi<sup>2</sup>";
                }
            }
            m = m.toFixed(3);
            m = getNumberFormated(m)+ " " + units;
        }
        return m;
    };
    var buildPopup = function(f,p,t){
        var params = {};
        //console.log(f);
        if(t=='cluster'){
            params['title']=f.custom.claveOri;
            params['prev']=f.custom.nombreCT;
            params['icons'] = [
                {clase:'dinamicPanel-sprite dinamicPanel-gallery-short',label:'Ver galeria',func:function(){
                    amplify.publish('uiGallery',{id:f.custom.claveOri});
                    setTimeout(function(){
                        $(".lightGallery-gallery-title").html(f.custom.nombreCT);
                        $(".lightgallery-shadow").each(function(){
                            $(this).attr('title',f.custom.nombreCT);
                        });
                    },500);
                    }},
                {clase:'dinamicPanel-sprite dinamicPanel-add-short',label:'Ver ficha',func:function(){
                    Escuelas.verFicha();
                    $("#escuela").html(f.custom.nombreCT);
                    $("#escuelaid").html(f.custom.claveOri);
                    }}
                
            ];
        }else{
            if(f.custom.getArea){
                var a = (f.custom.fColor)?getArea(f,true):getDistance(f,true);
                var titleFeature = (f.custom.title)?f.custom.title:f.custom.name;
                var descriptionFeature = (f.custom.description)?f.custom.description:a; 
                params['title']=titleFeature;
                params['prev']=descriptionFeature;
            }else{
                params['title']=f.custom.nom;
                params['element']='point';
                if(typeof(f.custom.desc)!='undefined'){
                    params['prev']=f.custom.desc;
                }
                
            }
        }
        params['px']=p;
        params['item']=t;
        Popup.show(params);
    };
    var showInfo = function(){
        var changeCoords =true;
        var type='point';
        switch(reg.selected.type){
            case 'poi':
            case 'identify':
            case 'search':
            case 'point':
                var f = Markers.reg.data[reg.selected.id];
                break;
            case 'line':
            case 'point':
                    type = 'feature';
                    var f = Georeference.reg.data[reg.selected.id];
                break;
            case 'cluster':
                    var f = Cluster.reg.data[reg.selected.id];
                    type='cluster';
                break;
            case 'earthquake':
            case 'flood':
            case 'cyclone':
            case 'tsunami':
            case 'volcano':
            case 'custom':
                var f = Markers.reg.data[reg.selected.id];
                break;
            default:
                type = 'feature';
                var f = reg.data[reg.selected.id];
                changeCoords=false;
                break;
        }
        if(f){
            var b = f.geometry.bounds;
            var position = getLastMousePosition();
            var point = (changeCoords)?Map.map.getPixelFromLonLat(b.getCenterLonLat()):position.px;
            //var point = Map.map.getPixelFromLonLat(b.getCenterLonLat());
            buildPopup(f,point,type);
        }
    };
    var showPopup = function(id,type){
            var f = Markers.reg.data[id];
            var b = f.geometry.bounds;
            var position = getLastMousePosition();
            var point = (changeCoords)?Map.map.getPixelFromLonLat(b.getCenterLonLat()):position.px;
            //var point = Map.map.getPixelFromLonLat(b.getCenterLonLat());
            buildPopup(f,point,type);
    };
    MDM6('define','showPopupForMarker',function(id,type){showPopup(id,type)});
    var getControls = function(layers){
        var k = "key";
        controls.Editor = new OL.Control.ModifyFeature(
                            layers[0],{
                                onModificationEnd:function(e){
                                        //console.log(e);
                                        controls.Hover.activate();
                                        var lastActiveMode = getActiveModeForEditor(controls.Editor.mode);
                                        //var params = {action:lastActiveMode,id:e.id};
                                        
                                        //e.Events.store(params);
                                },
                                onModification:function(e){
                                    console.log(e);
                                }
                            }
                        );
        controls.Select = new OL.Control.SelectFeature(
                            layers,
                            {
                                clickout: true,
                                toggle: false,
                                multiple: false,
                                hover: false,
                                toggleKey: "ctrl"+k, // add selection
                                multipleKey: "shift"+k, // remove selection
                                box: false,
                                onSelect: function(e){
                                    clusterSelected=true;
                                    if(e.cluster){
                                            //clusterSelected = true;
                                            if(e.cluster.length==1){
                                                showInfo();
                                                //amplify.publish('uiGallery',{id:e.cluster[0].custom.claveOri});
                                            }
                                    }else{
                                        if(e.custom.item!='point'){
                                            //itemSelected.changeStatusSelected(e);
                                            //itemSelected.clean();
                                            //itemSelected.setItem(e);
                                            itemSelected.define(e,false);
                                        }else{
                                            showInfo();
                                            var mark = Markers.reg.data[e.id].custom;
                                            if(mark.func){
                                               mark.func(mark);
                                            }
                                        }       
                                    }
                                },
                                onBeforeSelect: function(feat) {
                                    return false;  
                                },
                                onUnselect:function(){
                                    controls.Editor.deactivate();    
                                }
                            }
                        );
        controls.Hover = new OL.Control.SelectFeature(
                            layers,
                            {
                                multiple: false,
                                hover: true,
                                toggleKey: "ctrl"+k, // remove selection
                                multipleKey: "shift"+k, // add selection,
                                onSelect: function(e){
                                    setTimeout(function(){
                                        if(e.cluster){
                                            if(e.cluster.length==1){
                                                reg.setSelected(e.cluster[0].id,e.cluster[0].custom.type,e.cluster[0].custom.item);
                                            }
                                        }else{
                                            reg.setSelected(e.id,e.custom.type,e.custom.item);
                                        }
                                        },0);
                                    controls.Hover.unselectAll();
                                    controls.Select.activate();
                                },
                                onUnselect:function(e){
                                        cleanInfo();
                                        itemSelected.draw();
                                        reg.setSelected(null,null,null,null);
                                }
                            }
                        );
        return controls;
    };
    var getCtls = function(){
        return controls;
    };
    var setSources = function(){
        var a = arguments;
        controls.Feature = a[0];
        Layer = a[1];
        Map = a[2];
        Layer.styleMap.styles.select.defaultStyle['strokeWidth'] = 3;
    };
    var getActiveModeForEditor = function(){
        var a = arguments;
        var c = OL.Control.ModifyFeature;
        var event = null;
        var E=['ROTATE','DRAG','RESIZE','VERTICES'];
        for(x in E){
            if(a[0]==c[E[x]]){
                event = E[x];
                break;
            }
        }
        if(controls.Editor.createVertices){
            event=E[E.length-1];
        }
        return event;
    };
    var activateEvent = function(){
        var a = arguments;
        changeStyleVertex(a[0].type);
        var c = OL.Control.ModifyFeature;
        var mode = c.RESHAPE;
        controls.Editor.createVertices=false;
        switch(a[0].type){
            case 'rotate':
                mode = c.ROTATE; //|
                break;
            case 'resize':
                mode = c.RESIZE; //|
                //mode=2;
                if(a[0].aspectRadio){
                   // mode = ~c.RESHAPE;//&=
                }
                break;
            case 'drag':
                mode = c.DRAG; //|
            break;
            case 'vertices':
                controls.Editor.createVertices = true;
                if(a[0].vertices){
                    var sides = a[0].vertices;
                    sides = Math.max(3, isNaN(sides) ? 0 : sides);
                    controls.Feature.handler.sides = sides;
                }
                if(a[0].irregular){
                    controls.Feature.handler.irregular = a[0].irregular;
                }
            break; 
            
        }
        controls.Editor.mode = mode;
    };
    
    var init = function(){
        var cadena = '<div id="muecas" style="position:absolute;top:0px;right:0px;z-index:50000;background:white;width:200px;height:50px;">'+
                        '<button id="newFeature">Agregar</button>'+
                        //'<button id="getWkt">Muestra wkt</button>'+
                        '<button id="redibuja">redraw</button>'+
                        '<div id="medidaG"></div>'+
                    '</div>';
        $('#map').append(cadena);
        
        $("#newFeature").click(function(){
            var wkt = 'POLYGON((-11913810.566026 3277817.0099005,-12740553.46381 2548913.5083036,-12339411.939441 2182015.7726005,-11967622.233929 2137988.0443161,-11723023.74346 2064608.4971755,-11268070.551188 3316952.7683755,-11077283.728623 2813079.8780099,-11131095.396526 3502847.6211318,-11913810.566026 3277817.0099005))';
            create({wkt:wkt,store:false,zoom:true,params:{fColor:"red",lSize:1,lColor:"black",lType:"line",type:'buffer'}});
        });
        /*
        $("#getWkt").click(function(){
            console.log(getWktFromLastFeature());
        });
        */
        
        $("#redibuja").click(function(){
            var params = {fColor:"green",type:'buffer',lSize:1,lColor:"black",lType:"dash",persist:true};
            setArguments(getLastFeature(),params);
        });
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
    var getFeatureFromWKTMercator = function(){
        var a = arguments;
        var projection = new OL.Projection('EPSG:900913');
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
    
    var addProperties = function(){
        var c = 'custom';
        var f = 'Events';
        var a = arguments;
        a[0][c];
        a[0][c] = a[1];
        a[0][c]['getArea']=true;
        if(!a[0][f]){
            a[0][f];
            a[0][f]={
                pos:0,
                reg:[],
                store:function(){
                    var obj = this;
                    var a = arguments;
                    obj.pos++;
                    if(obj.reg.length>=3){
                        obj.reg.shift();
                        obj.pos=3;
                    }
                    obj.reg.push(a[0]);
                },
                execute: function(){
                        var obj = this;
                        var a = arguments;
                        var tot = obj.reg.length;
                        var p =obj.pos+0;
                        var valid =true;
                        var factor = -1;
                        if(a[0].action=='redo'){
                            if(p==0){
                                p++;
                            };
                            factor=1;
                        }else{
                            if(p>tot){
                                p--;
                            };
                        }
                        if((p==0)||(p>tot)){
                            valid=false;
                        }
                        if(valid){
                            var r = obj.reg[p-1];
                            var c = $.extend({}, r);
                            if(c.angle){
                                c.angle = (c.angle*factor);
                            }
                            if(c.scale){
                                if(factor!=1){
                                    c.scale = 100/(c.scale/100);
                                }
                            }
                            c['notStore']=true;
                            action(c);
                            if(a[0].action=='redo'){
                                p++;
                            }else{
                                p--
                            }
                            obj.pos=p;
                        }
                }
            }
        }
    };
    
    var create = function(){
        //a[0]={wkt:'',store:true,color:'',zoom:true}
        var a = arguments;
        var store = (a[0].store)?a[0].store:false;
        var zoom = (a[0].zoom)?a[0].zoom:false;
        var data = getFeatureFromWKT(a[0].wkt);
        if(data.valid){
            Layer.addFeatures(data.features);
            if(zoom){
                Map.map.zoomToExtent(data.bounds);
            }
            var lastFeature = getLastFeature();
            addProperties(lastFeature,a[0].params);
            setArguments(lastFeature,a[0].params);
            if(!store){
                //storeDB();
                lastFeature.custom.store=store;
            }
            reg.add(lastFeature);
            var tipo = (a[0].params.fColor)?'polygon':'line';
            var Measure = (a[0].params.fColor)?getArea(lastFeature,false):getDistance(lastFeature,false);
            var params = {id:lastFeature.id,type:a[0].params.type,data:{name:a[0].params.name,type:tipo,measure:Measure,description:a[0].params.description}};
            if(a[0].params.type=='georeference'){
                temporalGeoParams = params;
            }
            if(a[0].params.type=='measure'){
                eventFinishedCeation.execute(params);
            }
            //eventFinishedCeation.execute({id:lastFeature.id,type:a[0].params.type,data:{name:a[0].params.name,type:tipo,measure:Measure}});
        }else{
            alert("elemento no valido");
        }
    };
    var createMultiple = function(){
        var totalParams=[];
        var a = arguments;
        var store = (a[1].store)?a[1].store:false;
        var zoom = (a[1].zoom)?a[1].zoom:false;
        var totalFeatures = [];
        for(var x in a[0]){
            var data = getFeatureFromWKT(a[0][x].wkt);
            if(data.valid){
                var feat = data.features[0];
                addProperties(feat,a[0][x].params);
                setArguments(feat,a[0][x].params);
                if(!store){
                    //storeDB();
                    feat.custom.store=store;
                }
                reg.add(feat);
                var tipo = (a[0][x].params.fColor)?'polygon':'line';
                var Measure = (a[0][x].params.fColor)?getArea(feat,false):getDistance(feat,false);
                var params = {id:feat.id,type:a[0][x].params.type,data:{name:a[0][x].params.name,type:tipo,measure:Measure,description:a[0][x].params.description}};
                if(a[0][x].params.type=='georeference'){
                    if(a[0][x].params.data){
                        if(a[0][x].params.data.tracking){
                            params.data.tracking=a[0][x].params.data.tracking;
                        }
                    }
                    totalParams.push(params);
                }
                if(a[0][x].params.type=='measure'){
                    totalParams.push(params);
                }
                totalFeatures.push(feat);
            }
        }
        Layer.addFeatures(totalFeatures);
        /*
        if(zoom){
            Map.map.zoomToExtent(data.bounds);
        }
        */
        return totalParams;
    };
    var getWktFromLastFeature = function(){
            return Layer.features[Layer.features.length-1].geometry + '';
    };
    var storeDB = function(){
        var a = arguments;
        var wkt = (!a[0])?getWktFromLastFeature():a[0];
        //Request({geometry:wkt});//a modificar
        
    };
    var getLastFeature = function (){
        return Layer.features[Layer.features.length-1]; 
    };
    var setArguments = function(){
        var a = arguments;
        a[0].attributes = a[1];
        if(a[1].persist){
            //a[0]['custom']=a[1];
            addProperties(a[0],a[1]);
        }
       Layer.redraw();
    };
    var getNumberFormated = function(n){
		n += '';
		x = n.split('.');
		x1 = x[0];
		//alert('antes');
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
    };
    
    $('#map').bind('contextmenu', function(e){
            
            var point = getLastMousePosition();
            var i = reg.selected;
                    var ctl = controls.Editor;
                    if(i.id){
                                var valid = ((i.item=='feature')||(i.item=='point'))?true:false;
				if((Map.onMap)&&(valid)&&(ctl.active==null)){
                                    var f = reg.data[i.id];                                 
                                    contextual.show(f,point);
				}
				
            }
            
           /*
            var f = getFeatureIntersected(point);
            if(f){
                    contextual.show(f,point);
            }
            */
            
        return false;
    }); 
    
    var getFeatureIntersected = function(){
        var a = arguments;
        var f=null;
        var point = new OL.Geometry.Point(a[0].lonlat.lon,a[0].lonlat.lat);
        //var wkt = new OL.Format.WKT();
        //var point = wkt.read("POINT("+a[0].lonlat.lon+" "+a[0].lonlat.lat+")");
        for(var x=0;x<Layer.features.length;x++){
            var i = Layer.features[x];
            var intersect = i.geometry.intersects(point);
            if(intersect){
                f=i;
               break;
            }
        }
        return f;
    };
    var addEvent = function(i){
        getLastMousePosition = i;
        importer('initialize'); 
        exporter('initialize');
        var evento = function(){
            clusterSelected = false;
        }
        Popup.setEvent(evento);
        //loadInitialWindow();
        MDM6('loadBtnPanels');
        MDM6('loadPanels');
        /*graficado*/
        //graph.setParams({geometry:i.geometry+''});
        //graph.setExtraFields({id:i.id});
        //graph.execute();//fatman
        /*graficdo*/
    };
    
    var removeAll = function(){
        var a = arguments;
        var source = getSource('all',a[0]);
        for(x in source){
            var item = (source[x].id)?source[x].id:x;
            remove(item);
            
        }
    }
    var remove = function(){
        var id = arguments[0];
        var f = reg.get(id);
        if(f){
            controls.Editor.deactivate();
            reg.data[id].destroy();
            delete reg.data[id];
            delete reg.type[f.custom.type][id];
        }
    };
    var convertToBuffer = function(){
        var a = arguments;
        var feature = reg.get(a[0]);
        var size = a[1];
        if(feature){
            var tipo = (feature.custom.fColor)?'polygon':'line';
            var wkt = feature.geometry+'';
            if(tipo=='line'){
                addBufferToBuffer(feature.id,size,tipo);
            }else{
                var params = {wkt:wkt,store:true,zoom:false,params:format.get('buffer','polygon')};
                //
                create(params);
            }
        }
    };
    var addBufferToBuffer = function(id,size,type,replace,LonLat){
        replace = (replace)?replace:false;
        var f;
        if(type=='point'){
            f = Markers.reg.get(id);
            if(f){
                var g = f.geometry;
                var lonlat = {lon:g.x,lat:g.y};
                addBufferToPoint(lonlat,size);
            }else{
                
                addBufferToPoint(LonLat,size);
            }
        }else{
            f = reg.get(id);
            if(f){
                var notification = Notification.show({message:'Generando &Aacute;rea'});
                //console.log(f.geometry+'');
                //console.log('lanzando')
                console.log("mandara:"+f.custom.db);
                addBuffer.setExtraFields({id:f.id,type:type,replace:replace,notification:notification});
                //addBuffer.setParams({proyName:dataSource.proyName/*'mdm5'*/,gid:f.custom.db,labelReg:f.custom.name,size:size,tabla:'geometrias',where:''});
                addBuffer.setParams(JSON.stringify({id:f.custom.db,size:size}));
                addBuffer.execute();
            }
        }
    };
    var addArea = function(id,table,size){//{id:'',table:'',size:''}
        var params = arguments[0];
        var notification = Notification.show({message:'Generando &Aacute;rea'});
        console.log("mandara:"+params.id);
        addBuffer.setExtraFields({id:'',type:'georeference',replace:false,notification:notification});
        //addBuffer.setParams({proyName:dataSource.proyName/*'mdm5'*/,gid:params.id,labelReg:'',size:params.size,tabla:params.table,where:''});
        addBuffer.setParams(JSON.stringify({id:params.id,table:params.table,size:params.size}));
        addBuffer.execute();
    };
    var setData = function(){
        var f = arguments[0];
        var p = arguments[1].data;
        var items = ['name','unit','description'];
        for (x in items){
            var i = items[x];
            if(p[i]){
                f.custom[i]=p[i];
                f.attributes[i]=p[i];
            }
        }
    };
    var getSource = function(){
        var a = arguments;
        var source;
        if(a[0]=='all'){
            if(a[1]){
                source = reg.type[a[1]];
            }else{
                source = reg.data;
            }
        }else{
            source = a[0];
        }
        return source;
    };
    var addBufferToPoint = function(lonlat,meters){
        var sides = 40;
        var wkt = getWktFromCentroid(lonlat,meters,40);
                    create({
                        wkt:wkt,
                        zoom:false,
                        store:true,
                        params:format.get('georeference','polygon')//format.get('buffer','polygon')
        });
        eventFinishedCeationGeo.execute(temporalGeoParams);
    };
    var getWktFromCentroid = function(lonlat,meters,sides){
        var feature = OL.Geometry.Polygon.createRegularPolygon({x:lonlat.lon,y:lonlat.lat},meters,sides);
        return feature+'';
    };
    var setVisibility = function(){//items,tipo,boolean
        var a = arguments;
        var source = getSource(a[0],a[1]);
        var prop = getPropertieVisibility(a[2]);
        for(x in source){
            var item = (source[x].id)?source[x].id:x;
            reg.data[item].style = prop;
            
        }
        Layer.redraw();
    };
    var getPropertieVisibility = function(){ 
        var a = arguments;
        return (a[0])?null:{display:"none"};
    };
    var locateAndZoom = function(){
        var f = arguments[0];
        Map.map.zoomToExtent(f.geometry.bounds);
    };
    var getData = function(){
        var f = arguments[0];
        var response = {id:f.id,type:'georeference',data:{name:f.custom.name,type:'polygon',description:f.custom.description,db:f.custom.db}};
        return response;
    };
    var action = function(){
        var a = arguments;
        var result=null;
        var f = reg.get(a[0].id);
        if((f)||(a[0].items)){
            var param = null;
            if(!a[0].items){
                var g = f.geometry;
                var centroid = g.getCentroid();
            }
            switch(a[0].action){
                case 'rotate':
                    var e = (a[0].angle)?a[0].angle:null;
                    param=(e>360)?360:e;
                    break;
                case 'resize':
                    param = (a[0].scale)?(a[0].scale)/100:null;
                    break;
                case 'drag':
                    param = a[0].lon;
                    centroid:a[0].lat;
                    break;
                case 'delete':
                    remove(a[0].id);
                    break;
                case 'set':
                    setData(f,a[0].params);
                    break;
                case 'hide':
                    setVisibility(a[0].items,a[0].type,false);
                    Layer.redraw();
                    break;
                case 'show':
                    setVisibility(a[0].items,a[0].type,true);
                    Layer.redraw();
                    break;
                case 'locate':
                    locateAndZoom(f);
                    break;
                case 'get':
                    result = getData(f);
                    break;
            }
            if(param!=null){
                var action =(a[0].action =='drag')?'move': a[0].action+"";
                g[action](param, centroid);
                Layer.redraw();
            }
            if(a[0].edition){
                    contextual.action(a[0].action,f);
            }
            if(a[0].select){
                itemSelected.define(f,true);
            }else{
                itemSelected.clean();
            }
            //add event made
            if(!a[0].notStore){
                if(!a[0].items){
                    if(f.Events){
                        f.Events.store(a[0]);
                    }
                }
            }
        }
        if(result!=null){
            return result;
        }
    };
    var eventFinishedCeation = {
        func:null,
        setFunction:function(){
                eventFinishedCeation.func=arguments[0];
        },
        execute:function(a){
            if(eventFinishedCeation.func){
                eventFinishedCeation.func(a);
            }
        }
    };
    var eventFinishedCeationGeo = {
        func:null,
        setFunction:function(){
                eventFinishedCeationGeo.func=arguments[0];
        },
        execute:function(a,b){
            if(eventFinishedCeationGeo.func){
                eventFinishedCeationGeo.func(a,b);
            }
        }
    };
    MDM6('define','eventFinishedCeationGeo',function(p){
        eventFinishedCeationGeo.execute(p);
    });
    MDM6('define','getLastMarker',function(){
        return Markers.getLastMarker();
    });
    var getFromReg = function(){
        var a = arguments;
        return reg.get(a[0])
    };
    
    var temporalGeoParams;
    
    
    var logging = Request.New({
        url:dataSource.logging,
        //contentType:"application/json; charset=utf-8",
        params:'',
        events:{
            success:function(data,extraFields){
                var close = false;
                var mensaje='Servicio no disponible intente m&aacute;s tarde';
                if(data){
                    if(data[0].status){
                        MDM6('onLogging',data);
                        geoInitialModal.hide();
                        MDM6('loadPanels');
                        MDM6('isBtnPanelActive');
                        MDM6('extraEvents');
                        close=true;
                    }else{
                        var mensaje =data[0].usuario;
                    }
                    
                }
                if(close){
                    
                }else{
                    var c = $("#cont_init_error");
                    var i = $("#text_init_error");
                    i.html(mensaje);
                    c.show();
                    setTimeout(function(){c.hide()},5000);
                }
            },
            before:function(a,extraFields){
               
            },
            error:function(a,b,extraFields){
                    var mensaje = 'Servicio no disponible';
                    var c = $("#cont_init_error");
                    var i = $("#text_init_error");
                    i.html(mensaje);
                    c.show();
                    setTimeout(function(){c.hide()},5000);
            },
            complete:function(a,b,extraFields){
                
            }
        }
    });
    var getContentInitialModal = function(){
        var cadena ='<div align="left" style="font-size:110%;margin-left:20px;margin-top:10px;margin-bottom:5px">'+
                        'Usuario '+
                    '</div>'+
                    '<div style="width:300px">'+
                            '<input id="init_user" type="text" placeholder="Usuario" value="" class="ui-corner-all inputItem " style="font-size:100%">'+    
                    '</div>'+
                    '<div align="left" style="font-size:110%;margin-left:20px;margin-top:10px;margin-bottom:5px">'+
                        'Contrase&ntilde;a'+
                    '</div>'+
                    '<div style="width:300px">'+
                            '<input id="init_pass" type="password" placeholder="Contrase&ntilde;a" value="" class="ui-corner-all inputItem " style="font-size:100%">'+    
                    '</div>'+
                    '<div style="padding-top:12px"><button id="init_in">Ingresar</button></div>'+
                    '<div style="height:10px;"></div>'+
                    
                    '<div id="cont_init_error" class="ui-widget" style="display:none">'+
                            '<div style="padding: 0 .7em;" class="ui-state-error ui-corner-all">'+
                                    '<p id="text_init_error"></p>'+
                            '</div>'+
                    '</div>';
                
        return cadena;
    };
    var geoInitialModal = Modal.create({
                    title:'Seguridad',
                    btnClose:false,
                    content:getContentInitialModal(),
                    events:{
                        onCancel:function(){
                        },
                        onCreate:function(){
                            var usuario = $("#init_user");
                            var pass = $("#init_pass");
                            var btn = $("#init_in");
                            var expre = /^\s*|\s*$/g;
                            btn.button({icons:{primary:'ui-icon-circle-check'}}).click(function(){
                                var u = usuario.val();
                                var p = pass.val();
                                u=u.replace(expre,"");
                                p=p.replace(expre,"");
                                var params = {cuenta:u,pass:p};
                                //logging.setParams(JSON.stringify(params));
                                logging.setParams(params);
                                logging.execute();
                            });
                        },
                        onShow:function(){
                            var usuario = $("#init_user");
                            var pass = $("#init_pass");
                            pass.val('');
                            usuario.val('').focus();
                        }
                    }
    });
    
    var loadInitialWindow = function(){
        geoInitialModal.show();
    }
    
    var getContentGeoModal = function(){
        var cadena ='<div align="left" style="font-size:110%;margin-left:20px;margin-top:10px;margin-bottom:5px">'+
                        'Nombre '+
                    '</div>'+
                    '<div style="width:300px">'+
                            '<input id="geo_name" type="text" placeholder="Nombre" value="" class="ui-corner-all inputItem " style="font-size:100%">'+    
                    '</div>'+
                    '<div align="left" style="font-size:110%;margin-left:20px;margin-top:10px;margin-bottom:5px">'+
                        'Descripci&oacute;n'+
                    '</div>'+
                    '<div style="width:300px">'+
                            '<textarea id="geo_desc" class="ui-corner-all textAreaItem " placeholder="Descripci&oacute;n"  style="height:70px;font-family:arial"></textarea>'+
                            //'<input id="geo_desc" type="text" placeholder="Descripci&oacute;n" value="" class="ui-corner-all inputItem " style="font-size:100%">'+    
                    '</div>'+
                    '<div style="padding-top:12px"><button id="geo_btn_add">Aceptar</button></div>';

                
        return cadena;
    };
    var haveHtml = function(text){
        var response = false;
        if (text.match(/<(\w+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/)) {
           response=true;
        }
        return response;
    };
    var filtraCaracEspecial = function(cadena){
		var cadenaTmp = cadena;
		cadenaTmp = cadenaTmp.replace(/[\u00E1]/gi,'&aacute;');
		cadenaTmp = cadenaTmp.replace(/[\u00E9]/gi,'&eacute;');
		cadenaTmp = cadenaTmp.replace(/[\u00ED]/gi,'&iacute;');
		cadenaTmp = cadenaTmp.replace(/[\u00F3]/gi,'&oacute;');
		cadenaTmp = cadenaTmp.replace(/[\u00FA]/gi,'&uacute;');
		//cadenaTmp = cadenaTmp.replace(/[\u00F1]/gi,'&nacute;');
		
		cadenaTmp = cadenaTmp.replace(/[\u00C1]/gi,'&Aacute;');
		cadenaTmp = cadenaTmp.replace(/[\u00C9]/gi,'&Eacute;');
		cadenaTmp = cadenaTmp.replace(/[\u00CD]/gi,'&Iacute;');
		cadenaTmp = cadenaTmp.replace(/[\u00D3]/gi,'&Oacute;');
		cadenaTmp = cadenaTmp.replace(/[\u00DA]/gi,'&Uacute;');
		//cadenaTmp = cadenaTmp.replace(/[\u00D1]/gi,'N');
		
		return cadenaTmp;
	}
    var ConvertToHtml = function(texto){
		
		var ta=document.createElement("textarea");
		ta.innerHTML=texto.replace(/</g,"&lt;").replace(/>/g,"&gt;");
		return ta.value;
    };
    this.filtraCaracEspecial = function(cadena){
		var cadenaTmp = cadena;
		cadenaTmp = cadenaTmp.replace(/[\u00E1]/gi,'a');
		cadenaTmp = cadenaTmp.replace(/[\u00E9]/gi,'e');
		cadenaTmp = cadenaTmp.replace(/[\u00ED]/gi,'i');
		cadenaTmp = cadenaTmp.replace(/[\u00F3]/gi,'o');
		cadenaTmp = cadenaTmp.replace(/[\u00FA]/gi,'u');
		cadenaTmp = cadenaTmp.replace(/[\u00F1]/gi,'n');
		
		cadenaTmp = cadenaTmp.replace(/[\u00C1]/gi,'A');
		cadenaTmp = cadenaTmp.replace(/[\u00C9]/gi,'E');
		cadenaTmp = cadenaTmp.replace(/[\u00CD]/gi,'I');
		cadenaTmp = cadenaTmp.replace(/[\u00D3]/gi,'O');
		cadenaTmp = cadenaTmp.replace(/[\u00DA]/gi,'U');
		cadenaTmp = cadenaTmp.replace(/[\u00D1]/gi,'N');
		
		return cadenaTmp;
    };
    var removeLastItemGeoreference = function(){
        var feature;
        switch(temporalGeoParams.data.type){
            case 'point':
                feature = Markers.getLastMarker();
                Markers.event({action:'delete',items:[{id:feature.id}],type:'georeference'});
                break;
            case 'address':
                feature = Markers.getLastMarker();
                Markers.event({action:'delete',items:[{id:feature.id}],type:'georeferenceAddress'});
                break;
            default:
                feature = getLastFeature();
                action({action:'delete',id:feature.id});
        }
    };
    MDM6('define','removeLastItemGeoreference',removeLastItemGeoreference);
    MDM6('define','setTemporalGeoParams',function(){
        temporalGeoParams = arguments[0];
    });
    MDM6('define','getTemporalGeoParams',function(){
        return temporalGeoParams;
    });
    var geoModal = Modal.create({
                    title:'Nueva georreferencia',
                    content:getContentGeoModal(),
                    events:{
                        onCancel:function(){
                            /*
                            var feature;
                            if(temporalGeoParams.data.type=='point'){
                                feature = Markers.getLastMarker();
                                Markers.event({action:'delete',items:[{id:feature.id}],type:'georeference'});
                            }else{
                                feature = getLastFeature();
                                action({action:'delete',id:feature.id});
                            }
                            */
                            removeLastItemGeoreference();
                        },
                        onCreate:function(){
                            var btn = $("#geo_btn_add");
                            var Name = $("#geo_name");
                            var Description = $("#geo_desc");
                            btn.button({icons:{primary:'ui-icon-circle-check'}}).click(function(){
                                var feature;
                                var Nombre = removeEmptySpaces(Name.val());
                                var Descripcion = removeEmptySpaces(Description.val());
                                Descripcion = (Descripcion.length==0)?ConvertToHtml('Sin descripci&oacute;n'):Descripcion;
                                var params = temporalGeoParams.data;
                                if(temporalGeoParams.data.type=='point'){
                                    feature = Markers.getLastMarker();
                                    if(Nombre.length>0){
                                        params.nom = Nombre;//Name.val();
                                        params.name = Nombre;//Name.val();
                                    }
                                    params.desc = Descripcion;//Description.val();
                                    params.desc = (params.desc==undefined)?ConvertToHtml('Sin descripci&oacute;n'):params.desc;
                                    params.description = params.desc;
                                    Markers.event({action:'set',items:[{id:feature.id}],type:'georeference',params:params});
                                    
                                }else{
                                    feature = getLastFeature();
                                    if(Nombre.length>0){
                                        params.name = Nombre;//Name.val();
                                    }
                                    params.description = Descripcion;//Description.val();
                                    action({action:'set',id:feature.id,params:temporalGeoParams});
                                }
                                eventFinishedCeationGeo.execute(temporalGeoParams);
                                geoModal.hide();
                            });
                            ////
                            Description.bind("keypress", function(evt) {
                                var result=true;
                                var otherresult = 12;
                                if(window.event != undefined){
                                    otherresult = window.event.keyCode;
                                }
                                var charCode = (evt.which) ? evt.which : otherresult;//window.event.keyCode;  
                                if (charCode <= 11) { 
                                    return true; 
                                } 
                                else {
                                    if(charCode == 13){
                                        btn.click();
                                        return true;
                                    }else{
                                        /*
                                        var keyChar = String.fromCharCode(charCode);
                                        var keyChar2 = keyChar.toLowerCase();
                                        var re =  /[\u00E0-\u00E6\u00E8-\u00EB\u00EC-\u00EF\u00F2-\u00F6\u00F9-\u00FC\u0061-\u007a\u00f10-9 ]/;
                                        var result = re.test(keyChar2);
                                        var attribute = $("#msgpoi").attr('attr');
                                        if(!result){
                                            if(attribute == "0"){
                                                $("#msgpoi").attr('attr','1').removeClass('invisible');
                                            }
                                            $("#msgcont").html(' "'+keyChar+'"' + ' Caracter no valido');
                                        }else{
                                            if(attribute == "1"){
                                                $("#msgpoi").attr('attr','0').addClass('invisible');
                                            }
                                        }
                                        */
                                    }
                                return result; 
                                } 
                            });
                            /////
                        },
                        onShow:function(){
                            var Name = $("#geo_name");
                            var Description = $("#geo_desc");
                            Description.val('');
                            Name.val('').focus();
                        }
                    }
        });
    var getGeoFeatures = function(p){
        if(reg.type.georeference){
            for(var x in reg.type.georeference){
                //var elemento = jQuery.extend(true,{},reg.get(x));
                var feature = reg.get(x);
                var elemento = feature.clone();
                elemento.attributes = feature.custom;
                p.push(elemento);
            }
        }
        return p;
    };
    var getRouteFeature = function(e){
        var route=null;
        if(reg.type.georeference){
            var feature = reg.data[e.id];
            route=feature.clone();
            route.attributes.tracking=e.data.tracking;
        }
        return route;
    };
    var importerModal;
    var showModalFromImporterData = function(title,content){
        importerModal = null;
        importerModal = Modal.create({
                    title:title,
                    content:content,
                    modal:false,
                    contentStyle:'height:300px;overflow:auto'
        });
        importerModal.show();
        
    };
    
    var exporter = function(opc,feature){
        var id = 'Exporter'
        var idTa = 'kmlfile';//'TaExporter';
        var root = 'map';
        //var service = "http://10.1.30.101:8080/GeneraKML/save2KML.do";
        var service = dataSource.kml.save;
        var serviceGPX = dataSource.gpx.save;
        var load = function(){
            var cadena = '<form id="'+id+'" action="" method="POST" enctype="multipart/form-data" style="display:none">'+
                        '<textarea id="I'+idTa+'" name="file" rows="1" cols="1"></textarea>'+
                        '<input type="submit" value="Submit">'+
                    '</form>';
            $("#"+root).append(cadena);
        }
        var getFormat = function(){
            var geoFeatures = [];
            geoFeatures = Markers.getGeo(geoFeatures);
            geoFeatures = Markers.getGeoAddress(geoFeatures);
            geoFeatures = getGeoFeatures(geoFeatures);

            if(geoFeatures.length>0){
                for(x in geoFeatures){
                    var elemento = geoFeatures[x];
                    elemento.geometry = elemento.geometry.transform('EPSG:900913',config.mapConfig.projection);
                }
            }
                var Format = null;
                if(geoFeatures.length>0){
                    var format = new OL.Format.KML({
                        'foldersName':"Mapa Digital de Mexico V6.0",
                        'foldersDesc':'Georeferencias generadas',
                        'maxDepth':10,
                        //'extractStyles':true,
                        'extractAttributes':true//,
                        //'internalProjection': Map.projection.used,
                        //'externalProjection': Map.projection.used
                    });
                    Format = format.write(geoFeatures);
                }
                
                return Format;
        }
        var getFormatGPX = function(f){
            //console.log(reg);
            //console.log(f);
            var geoFeatures = [];
            geoFeatures.push(getRouteFeature(f))
            if(geoFeatures.length>0){
                for(x in geoFeatures){
                    var elemento = geoFeatures[x];
                    elemento.geometry = elemento.geometry.transform('EPSG:900913',config.mapConfig.projection);
                }
            }
            for(var x in f.data.tracking){
                var i = f.data.tracking[x];
                var point = new OL.Geometry.Point(i.longitude,i.latitude);
                var mark =  new OL.Feature.Vector(point);
                mark.attributes = $.extend(map.attributes, i);
                mark.attributes.description=JSON.stringify(i);
                geoFeatures.push(mark);
            }
            var Format = null;
            if(geoFeatures.length>0){
                    var format = new OL.Format.GPX({
                        'creator':"Mapa Digital de Mexico V6.0",
                        'defaultDesc':'Ruta generada',
                        'extractWaypoints':true,
                        'extractTracks':true,
                        'extractRoutes':true,
                        'extractAttributes':true,
                        'maxDepth':10
                       
                    });
                    Format = format.write(geoFeatures);
            }
            return Format;
        }
        var Export = function(format,path){
            var url = path;
            //var format = getFormat();
            var input = $("#"+idTa);
            var exporter = $("#"+id);
            input.val(format);
            $("#Ikmlfile").val(format);
            exporter.attr('action',url);
            //exporter.attr('action',url+'?kmlfile='+format);
            //console.log(format);
            exporter.submit();
            exporter.attr('action','');
        }
        switch(opc){
            case 'export':
                var kml = getFormat();
                Export(kml,service);
                break;
            case 'initialize':
                load();
                break;
            case 'exportGPX':
                var gpx = getFormatGPX(feature);
                //console.log(gpx)
                Export(gpx,serviceGPX);
                break;
        }
    };
    
    var removeEmptySpaces = function(cadena){
		 var resultado = "";
		 resultado = cadena.replace(/^\s*|\s*$/g,"");
		 return resultado;
    };
    var dataFile =null;
    var importer = function(opc,data,typeFile){
        //var Archivo = '<kml xmlns="http://earth.google.com/kml/2.0"><Folder><name>Mapa Digital de Mexico V6.0</name><description>Georeferencias generadas</description><Placemark><name>OpenLayers_Feature_Vector_462</name><description>No description available</description><Point><coordinates>-11610508.437845,2353234.7159286</coordinates></Point><ExtendedData><Data name="nom"><value>punto de origen</value></Data><Data name="desc"><value>primer acercamiento</value></Data><Data name="image"><value>img/marks/georeference_active.png</value></Data><Data name="gWith"><value>35</value></Data><Data name="gHeight"><value>50</value></Data><Data name="type"><value>georeference</value></Data><Data name="item"><value>point</value></Data></ExtendedData></Placemark><Placemark><name>pacman</name><description>videojuegos</description><Polygon><outerBoundaryIs><LinearRing><coordinates>-11737699.652888,3277817.0099005 -11967622.233929,2954947.0024818 -11468641.313373,2861999.5761036 -11488209.19261,3140841.855238 -11502885.102038,3380548.3758974 -11723023.74346,3625146.8663661 -11928486.475454,3566443.2286536 -12055677.690498,3390332.3155161 -12016541.932023,3224005.3419974 -11918702.535835,3365872.4664693 -11771943.441554,3409900.1947536 -11737699.652888,3277817.0099005</coordinates></LinearRing></outerBoundaryIs></Polygon><ExtendedData><Data name="fColor"><value>green</value></Data><Data name="lColor"><value>green</value></Data><Data name="lSize"><value>2</value></Data><Data name="lType"><value>line</value></Data><Data name="type"><value>georeference</value></Data><Data name="item"><value>feature</value></Data><Data name="unit"><value>metric</value></Data><Data name="getArea"><value>true</value></Data></ExtendedData></Placemark><Placemark><name>OpenLayers_Feature_Vector_457</name><description>No description available</description><LineString><coordinates>-11111527.517288,3126165.9458099 -10705494.02311,2656536.8441099 -11365909.947376,2436398.202688 -10465787.502451,2343450.7763099</coordinates></LineString><ExtendedData><Data name="fColor"><value>blue</value></Data><Data name="lSize"><value>3</value></Data><Data name="lColor"><value>blue</value></Data><Data name="lType"><value>line</value></Data></ExtendedData></Placemark></Folder></kml>';
        var idbtn ='mdm6DinamicPanel_geo_btnImport';
        var idError ='mdm6DinamicPanel_geo_errorFile'; 
        var id = 'file';//'Datafile'
        var root = 'map';
        var Filei=null;
        //var service = 'http://10.1.30.101:8080/GeneraKML/readKML.do';
        var service = dataSource.kml.read;
        var serviceGPX = dataSource.gpx.read;
        var showError = function(status){
            if(status){
                $("#"+idError).fadeIn();
                setTimeout(function(){
                    $("#"+idError).fadeOut();
                },3000);
            }else{
                $("#"+idError).hide();
            }
        };
        var load = function(){
            var chain = '<input type="file" name="'+id+'" id="'+id+'" data-url="" style="display:none"/>';
            $("#"+root).append(chain);
            $('#'+id).fileupload({
                dataType: 'json',
                //contentType: "application/json; charset=utf-8",
                add: function (e, data) {
                    showError(false);
                    var d = data.files[0];
                    var nombre = (typeof(d.name)!="undefined")?d.name:d.fileName;
                    var validFile=false;
                    var path='';
                    if(nombre.indexOf('.kml')!=-1){
                        validFile=true;
                        path=service;
                    }
                    if(nombre.indexOf('.gpx')!=-1){
                        validFile=true;
                        path=serviceGPX;
                    }
                    if(validFile){
                        data.url=path;
                        //$("#"+id).attr('data-url',path);
                        //if(nombre.indexOf('.kml')!=-1){
                        dataFile = data;
                        setTimeout(function(){
                             $('#'+idbtn).css('display','none');
                            $('#'+idbtn+'ing').css('display','');
                            dataFile.submit();
                        },100);
                        
                    }else{
                        dataFile = null;
                        showError(true);
                    }
                }
            });
             
            $('#'+id).bind('fileuploadsend', function (e, data) {
               
            });
            $('#'+id).bind('fileuploaddone', function (e, data) {
                var response = data.result;
                if(response.response.success){
                    var files=['kml','gpx'];
                    var text='';
                    var typeFile='';
                    for(var x in files){
                        var i = files[x];
                        if(response.data[files[x]]){
                            typeFile=files[x];
                            text=unescape(response.data[typeFile]);
                            break;
                        }
                    }
                    importer('import',text,typeFile);
                    /*
                    var kml = unescape(response.kml);
                    importer('import',kml);*/
                }else{
                    showError(true);
                }
                $('#'+idbtn).css('display','');
                $('#'+idbtn+'ing').css('display','none');
            });
            
        };
        var getFile = function(){
            $("#"+id).click();
        };
        var getTypeFeature = function(chain){
            var tipo = null;
            var tipos = ['POINT','POLYGON','LINE'];
            for(x in tipos){
                if(chain.indexOf(tipos[x])!=-1){
                    tipo = tipos[x];
                }
            }
            if(tipo){
                tipo = tipo.toLowerCase();
            }
            return tipo;
        };
        var readFormat = function(text,typeFile){
            var pointsGpx=[];
            var item = 'georeference';
            typeFile = typeFile.toUpperCase();
            var paramsRead;
            //text = '<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="Mapa Digital de Mexico V6.0" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><trk><name>Ruta 1</name><desc>Ruta generada</desc><trkseg><trkpt lon="-102.291568" lat="21.88525600000001"/><trkpt lon="-102.291568" lat="21.88525600000001"/></trkseg></trk><wpt lon="-102.291568" lat="21.885256"><name>OpenLayers_Feature_Vector_425</name><desc>Ruta generada</desc></wpt><wpt lon="-102.291568" lat="21.885256"><name>OpenLayers_Feature_Vector_427</name><desc>Ruta generada</desc></wpt></gpx>';
            switch(typeFile){
                case 'GPX': paramsRead = {extractWaypoints: true,extractTracks: true,extractRoutes: true,extractAttributes: true};
                    break;
                case 'KML':paramsRead = {/*extractStyles: true,*/extractAttributes:true};
                    break;
            }
            g =  new OL.Format[typeFile](paramsRead);
            html = "";
            var totalPolygons=[];
            $("#mdm6DinamicPanel").dinamicPanel('showPanel','geoPanel');
            features = g.read(text);
            var totalTemporalGeoParams=[];
            for(var x in features) {
                features[x].geometry = features[x].geometry.transform(config.mapConfig.projection,'EPSG:900913');
                var wkt = features[x].geometry+"";
                var type = getTypeFeature(wkt);
                //console.log(wkt)
                var info = features[x].attributes;
                var Name = (typeof info.name=="undefined")?'Sin titulo':info.name;
                //console.log(info.name);
                /**/
                var Description = info.description;
                //var Description = (haveHtml(info.description))?'icono':info.description;
                temporalGeoParams=null;
                if(type){
                    if(type=='point'){
                        if(typeFile!='GPX'){
                            var lon =features[x].geometry.x;
                            var lat = features[x].geometry.y;
                            if(typeof lon ==='undefined'){
                                lon=features[x].geometry.components[0].x;
                            }
                            if(typeof lat ==='undefined'){
                                lat=features[x].geometry.components[0].y;
                            }
                            /*
                            var lonlat = Map.transformToMercator(lon,lat);*/
                            var params = {lon:lon,lat:lat,type:item,params:{nom:Name,desc:Description}};
                            Markers.add(params);
                            var geoPoint = Markers.getLastMarker();
                            temporalGeoParams = {id:geoPoint.id,type:item,data:{name:Name,type:type,description:Description}};
                        }else{
                            Description=info.desc;
                            pointsGpx.push(JSON.parse(Description));
                        }
                    }else{
                        //wkt = features[x].geometry+'';
                        var params = format.get(item,type);
                        params.name = Name;
                        params.description = Description;
                        if(typeFile=='GPX'){
                            params.data={};
                            var tracks = [];
                            for(var g in features[x].geometry.components){
                                var c = features[x].geometry.components[g];
                                var lonlat = Map.transformToGeographic(c.x,c.y);
                                var trackPrams = {
                                    accuracy: null,
                                    altitude: null,
                                    altitudeAccuracy: null,
                                    heading: null,
                                    latitude: lonlat.lat,
                                    longitude: lonlat.lon,
                                    speed: null
                                }
                                tracks.push(trackPrams);
                            }
                            params.data.tracking=tracks;
                        }
                        /*
                        create({//amodificar
                                wkt:wkt,
                                zoom:false,
                                params:params,
                                store:true//true
                        });
                        */
                        totalPolygons.push({wkt:wkt,params:params});
                    }
                    //eventFinishedCeationGeo.execute(temporalGeoParams);
                    if(temporalGeoParams!=null){
                        totalTemporalGeoParams.push(temporalGeoParams);
                    }
                }
            }
            if(totalPolygons.length>0){
                 if(typeFile=='GPX'){
                    totalPolygons[0].params.data.tracking = pointsGpx;
                 }
                var resp = createMultiple(totalPolygons,{zoom:false,store:true});
                //for(x in resp ){
                    var extra = $.extend(totalTemporalGeoParams, resp);
                    totalTemporalGeoParams = extra;
                  //  totalTemporalGeoParams.push(resp[x]);
                //}
               
            }
            eventFinishedCeationGeo.execute(totalTemporalGeoParams,true);
        };
        var Import = function(url){
            OL.Request.GET({
                url: url,
                success: readFormat
            });
        };
        switch(opc){
            case 'getFile':
                getFile();
                break;
            case 'initialize':
                load();
                break;
            case 'import':
                //Import(data);
                readFormat(data,typeFile);
                break;
        }
    };
    var bufferForAllMarker = function(type,meters){
        var type = arguments[0];
        var reg = Markers.reg.type[type];
        for(x in reg){
            var id = x;
            var mark = Markers.reg.data[id];
            var lonlat = {lon:mark.geometry.x,lat:mark.geometry.y};
            var wkt = getWktFromCentroid(lonlat,meters,40);
            create({
                        wkt:wkt,
                        zoom:false,
                        store:true,
                        params:format.get(type,'polygon')
            });
            eventFinishedCeationGeo.execute(temporalGeoParams);
        }
    };
    
    var getTypeFeature = function(chain){
            var tipo = null;
            var tipos = ['POINT','POLYGON','LINE'];
            for(x in tipos){
                if(chain.indexOf(tipos[x])!=-1){
                    tipo = tipos[x];
                }
            }
            if(tipo){
                tipo = tipo.toLowerCase();
            }
            return tipo;
    };
    var getWktFeature = function(i,data){
        for(var x in data){
            if(data[x].id==i.db){
                i.wkt = data[x].wkt;
                break;
            }
        }
    };
    var restoreMeasures = function(data,source){
        var totalTemporalGeoParams=[];
        var totalPolygons =[];
        var temporalGeoParams=null;
        for(var x in source){
            var i = source[x];
            getWktFeature(i,data);
            var type = getTypeFeature(i.wkt);
            temporalGeoParams = null;
            if(type){
                var params = format.get(i.type,type);
                params.name = i.name;
                params.description = i.description;
                totalPolygons.push({wkt:i.wkt,params:params});
            }  
        }
        if(totalPolygons.length>0){
            var resp = createMultiple(totalPolygons,{zoom:false,store:true});         
            totalTemporalGeoParams = resp;
        }
        
        eventFinishedCeation.execute(totalTemporalGeoParams,true);
    };
    var restoreGeoreferences = function(data,source){//gordis
        var totalTemporalGeoParams=[];
        var totalPolygons =[];
        var temporalGeoParams=null;
        for(var x in source){
            var i = source[x];
            getWktFeature(i,data);
            var type = getTypeFeature(i.wkt);
            temporalGeoParams = null;
            if(type){
                if(type=='point'){
            
                    var f = getFeatureFromWKT(i.wkt);
                    var geometry = f.features[0].geometry;
                    var lon =geometry.x;
                    var lat =geometry.y;
                    if(typeof lon ==='undefined'){
                        lon=geometry.components[0].x;
                    }
                    if(typeof lat ==='undefined'){
                        lat=geometry.components[0].y;
                    }                
                    var params = {lon:lon,lat:lat,type:i.type,params:{nom:i.nom,desc:i.desc}};
                    Markers.add(params);
                    var geoPoint = Markers.getLastMarker();
                    temporalGeoParams = {id:geoPoint.id,type:'georeference',data:{name:i.nom,type:((i.type=='georeferenceAddress')?'address':type),description:i.desc}};
                    if(i.type=='georeferenceAddress'){
                        temporalGeoParams.data.address=i.address;
                    }
                    
                }else{
                    var params = format.get(i.type,type);
                    params.name = i.name;
                    params.description = i.description;
                    totalPolygons.push({wkt:i.wkt,params:params});
                }
            }
            if(temporalGeoParams!=null){
                totalTemporalGeoParams.push(temporalGeoParams);
            }
        }
        
        if(totalPolygons.length>0){
            var resp = createMultiple(totalPolygons,{zoom:false,store:true});         
            //var extra = $.extend(totalTemporalGeoParams, resp);
            //totalTemporalGeoParams = extra;
            totalTemporalGeoParams = totalTemporalGeoParams.concat(resp);
        }
        
        eventFinishedCeationGeo.execute(totalTemporalGeoParams,true);
       
    };
    
    var requestRestoreFeatures = function(typeFeature,i){
                    //var gordis = {"georeference":[{"lColor":"black","lSize":3,"lType":"line","type":"georeference","name":"Distancia 1","item":"feature","unit":"metric","store":true,"getArea":true,"db":1206083,"description":"Sin descripción"},{"fColor":"yellow","lColor":"black","lSize":1.5,"lType":"line","type":"georeference","name":"Área 1","item":"feature","unit":"metric","store":true,"getArea":true,"db":1206084,"description":"Sin descripción"},{"nom":"Punto 1","desc":"Sin descripción","image":"img/marks/georeference.png","gWith":"35","gHeight":"50","type":"georeference","item":"point","db":1206082}]} ;
                    //var  gordis = {"georeference":[{"nom":"Direcci&oacute;n 1","desc":"Ubicaci&oacute;n -102.80483, 25.70253","image":"img/marks/georeferenceAddress.png","gWith":"35","gHeight":"50","type":"georeferenceAddress","item":"point","db":1214829,"address":{"disabled":false,"create":null,"sections":{"top":{"left":[{"label":"Exterior","value":"1","edit":true,"id":"geoExterior"},{"label":"Interior","value":"2","edit":true,"holder":"","id":"geoInterior"}],"right":[{"label":"","value":"","fontSize":"165%"}]},"middle":{"left":[{"label":"Tipo de vialidad","value":""},{"label":"Nombre de vialidad","value":""},{"label":"Nombre de asentamiento humano","value":""},{"label":"Codigo postal","value":"2","edit":true,"id":"geoCP"}],"right":[{"label":"Nombre entre vialidad 1","value":""},{"label":"Tipo entre vialidad 1","value":""},{"label":"Nombre entre vialidad 2","value":""},{"label":"Tipo entre vialidad 2","value":""},{"label":"Nombre entre vialidad posterior","value":"3","edit":true,"id":"geoEntrevialidad"},{"label":"Tipo entre vialidad posterior","value":"Avenida"}]},"bottom":{"left":[{"label":"Localidad","value":""},{"label":"Clave de localidad","value":""},{"label":"Nombre del municipio o delegaci&oacute;n","value":""},{"label":"Clave del municipio o delegaci&oacute;n","value":""},{"label":"Nombre del estado o del distrito federal","value":""},{"label":"Clave del estado o del distrito federal","value":"05"}]}}}}]} ;
                    //var gordis2 = {"measure":[{"lColor":"#59590E","lSize":3,"lType":"dash","type":"measure","name":"Distancia 1","item":"feature","unit":"metric","store":true,"getArea":true,"db":1213068},{"fColor":"#EEEEEE","lColor":"#D7D7D7","lSize":2,"lType":"line","type":"measure","name":"Área 1","item":"feature","unit":"metric","store":true,"getArea":true,"db":1213069}]};
                   //i = (typeFeature=='georeference')?gordis.georeference:gordis2.measure;
                     var restore = Request.New({
                    url:dataSource.geometry.restore.url,
                    type:dataSource.geometry.restore.type,
                    format:dataSource.geometry.restore.dataType,
                    params:'',
                    extraFields:'',
                    contentType:dataSource.geometry.restore.contentType,
                    events:{
                        success:function(data,extra){
                                var messages=[];
                                if(data){
                                    if(data.response.success){
                                        if(extra.typeFeature=='georeference'){
                                            restoreGeoreferences(data.data.geometries,extra.source);
                                        }else{
                                            restoreMeasures(data.data.geometries,extra.source);
                                        }
                                        
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
                
                var a = [];
                for(var x in i){
                    var item = i[x];
                    a.push(item.db);
                }
                restore.setUrl(dataSource.geometry.restore.url+'?ids='+a.join(','));
                //restore.setParams({ids:a.join(',')});
                restore.setExtraFields({source:i,typeFeature:typeFeature});
                restore.execute();  
    };
    
    
    var getFeaturesForStore = function(){//is used for store information about all feature.
        var structure = {};
        for(var x in reg.data){
            var f = reg.data[x].custom;
            if(!structure[f.type]){
                structure[f.type]=[];
            }
            structure[f.type].push($.extend({},f));
        }
        var types=['georeference','georeferenceAddress'];
        for(var x in types){
            var type=types[x];
            var marks = Markers.reg.type[type];
            for(var y in marks){
                var m = Markers.reg.data[y].custom;
                if(!structure[type]){
                    structure[type]=[];
                }
                var item = $.extend({},m);
                if(item.address){
                    delete item.address.item;
                    delete item.address.temporal;
                    delete item.address.modal;
                    delete item.address.create;
                    delete item.address.disabled;
                }
                structure[type].push(item);
            }
        } 
        return structure;
    };
    
    var builderGraphs = function(datos){
        buildGraph({item:'PieGraph',type:'pie',data:datos});
        //buildGraph({item:'BarGraph',type:'bar',data:datos});
    };
    
    var buildGraph = function(){
        var a = arguments[0];
        switch(a.type){
            case 'pie':
            break;
        }
    }
    var getFeatureFromGeojson = function(data){
        /*var in_options = {
                'internalProjection': new OpenLayers.Projection(Map.projection.base),
                'externalProjection': new OpenLayers.Projection(Map.projection.used)
        }
*/
        var format = new OpenLayers.Format.GeoJSON(/*in_options*/);
        var features = format.read(data);
        return features[0].geometry+'';
    }
    var isGeoJson = function(data){
         var format = new OpenLayers.Format.GeoJSON(/*in_options*/);
         var features = format.read(data);
         return ((features.length>0)?true:false);
    }
    /*codigo para graficado */
    var graph = Request.New({
        //url:'http://10.1.30.102:8181/seg/summary/jz/2',//dataSource.logging,
        //url:'http://10.1.30.102:8181/seg/summary/jc/68',//dataSource.logging,
        //url:'http://10.1.30.102:8181/seg/summary/ja/137',//dataSource.logging,
        //url:'json/jz.do',
        //url:'json/jc.do',
        url:'json/ja.do',
        contentType:"application/json; charset=utf-8",
        params:'',
        events:{
            success:function(data,extraFields){
                var msg=null;
                if(data){
                    if(data.success){
                        var datos = data.data.value;
                        builderGraph(datos);
                    }else{
                         msg='Graficado no disponible';
                    }
                }else{
                    msg='Servicio de graficado no disponible';
                }
                if(msg!=null){
                    var notification = Notification.show({message:msg});
                    notification.show();
                }
            },
            before:function(a,extraFields){
               
            },
            error:function(a,b,extraFields){
                    var notification = Notification.show({message:'Servicio de graficado no disponible'});
                    notification.show();
            },
            complete:function(a,b,extraFields){
                
            }
        }
    });
    /**/
    return {
        setVisibility:setVisibility,
        restoreFeatures:requestRestoreFeatures,
        getFeatures:getFeaturesForStore,
        remove:remove,
        removeAll:removeAll,
        defineAction:defineActions,
        setSources:setSources,
        activateEvent:activateEvent,
        getControls:getControls,
        init:init,
        setArguments:setArguments,
        getLastFeature:getLastFeature,
        getFormated:getNumberFormated,
        add:create,
        addMultiple:createMultiple,
        getCtls:getCtls,
        addToReg:reg.add,
        addEvent:addEvent,
        event:action,
        addProperties:addProperties,
        showInfo:showInfo,
        cleanInfo:cleanInfo,
        reg:reg,
        setAdded:eventFinishedCeation.setFunction,
        added:eventFinishedCeation.execute,
        //addBufferToBuffer:convertToBuffer,
        addBufferToBuffer:addBufferToBuffer,
        canceled:eventCancel.setFunction,
        getFormat:format.get,
        getArea:getArea,
        getDistance:getDistance,
        controls:controls,
        getFeatureFromWKT:getFeatureFromWKT,
        getFeatureFromWKTMercator:getFeatureFromWKTMercator,
        getWktFromCentroid:getWktFromCentroid,
        
        setGeoAdded:eventFinishedCeationGeo.setFunction,
        geoAdded:eventFinishedCeationGeo.execute,
        setTemporalGeoParams: function(){
            temporalGeoParams = arguments[0];
        },
        getTemporalGeoParams:function(){
            return temporalGeoParams;
        },
        showGeoModal:function(){
            geoModal.show();
        },
        exportGeoreference:function(){
            exporter('export');
        },
        exportGPX:function(feature){
            exporter('exportGPX',feature)  
        },
        importGeoreference:function(e){
            importer('import',e);
        },
        getFile:function(data){
            importer('getFile',data);
        },
        bufferForAllMarker:bufferForAllMarker,
        addArea:addArea,
        isClusterActive:function(){
            return clusterSelected;
        },
        deactivateCluster:function(){
            clusterSelected=false;
        },
        loadInitialWindow:loadInitialWindow,
        showDataImporter:function(title,content){
            showModalFromImporterData(title,content);
        },
        addSpetialFeature:function(wkt,params){
            var features = reg.type['buffer'];
            if(features){
                for(var x in features){
                    action({action:'delete',id:x});
                }
            }
            create({wkt:wkt,store:false,params:params});
        },
        deleteSpetialFeature:function(){
            var features = reg.type['buffer'];
            if(features){
                for(var x in features){
                    action({action:'delete',id:x});
                }
            }
        },
        getFeatureFromGeojson:getFeatureFromGeojson,
        isGeoJson:isGeoJson
    }
});


    