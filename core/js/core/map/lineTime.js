define(['OpenLayers','config','tree','request','timer','dataSource'],function(OL,config,tree,Request,Timer,dataSource) {
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    (function($){
        $.widget("mdm6.lineTime",{
            options:{
            },
            _create:function(){
                
            },
            _init:function(){
                
            },
             _setOption:function(key,value){
                this.options[key]=value;
                switch(key){
                    case "parte":
                    break;
                }
            },
            destroy:function(){
                var element = this.element;
                $.Widget.prototype.destroy.call(this);
            }
        });
    })(jQuery);
   
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var data = {
        Tree:null,
        Map:null,
        timer:null,
        request:{
            //url:'http://10.1.30.102/TableAliasV60/lineatiempo',
            //url:'json/linetime.do',
            url:dataSource.timeLine,
            data:null
        },
        map:{
            name:'LineTime',
            server: '',//config.mapConfig.timeLine.layers,//config.mapConfig.layers.time,
            div:'lineTime_map',
            moved:true,
            percent:70
        },
        layers:{
            availables:{},
            addAvailable:function(){
                var p = arguments[0];
                data.layers.availables[p.layer]=p;
            }
        },
        years:{
            availables:{},
            add:function(){
                var a = arguments[0];
                var y = this.availables;
                for(x in a){
                    if(x!='0001'){
                        if(y[x]){
                        }else{
                            y[x]=true;
                        }
                    }
                }
            },
            width:48,// 1px por cada border -> width =50
            widthYear:10
        },
        idBtn:'mdm6Layers_layerManager_btnTime',
        popup:{
            id:'lineTime',
            title:'Linea de tiempo',
            clase:'Popup-square',
            visible:false,
            enable:false
        },
        modal:{
            id:'ModalLineTime',
            title:'Mapa din&aacute;mico: ',
            clase:'Modal-window',
            visible:false,
            created:false,
            animation:false,
            images:{
                layer:null,
                pos:0,
                years:null,
                image:0,
                last:'',
                total:0,
                loaded:0,
                positions:null
            }
            
        },
        blocker:{
            id:'lineTimeBlocker'
        },
        
        root:'map'//source
    };
    /*
    var Mapa = function(){
        this.map=null;
        this.setParams = function(p){
            var layer = this.map.layers[1];
            if(layer){
                var status = true;
                if(p.layers!=''){
                    p['firm'] = ""+ Math.floor(Math.random()*11) + (Math.floor(Math.random()*101));
                    layer.mergeNewParams(p);
                }else{
                    status=false;
                }
                layer.setVisibility(status);
            }
        }
        this.goCoords = function(){
            this.map.zoomToExtent(arguments[0]);
        }
        this.getExtent = function(){
            return data.Map.map.getExtent();
        }
        this.getExtentToGeometry = function(){
            return arguments[0].toGeometry()+"";
        }
        this.init = function(){
                var c = config.mapConfig;
                this.map = new OL.Map({
                    div: data.map.div+'_base',
                    controls:[],
                    projection: 'EPSG:900913',
                    resolutions: c.resolutions,
                    layers: [
                        new OL.Layer.WMS(
                            tree.baseLayers.B1.label, 
                            tree.baseLayers.B1.url,
                            {layers: tree.baseLayers.B1.layer}, 
                            {buffer: 0}
                        )
                    ]
                    //eventListeners:getListenersMap()
                });
                this.goCoords(this.getExtent());
        }
    }
    var Map = new Mapa();
    */
    var defineTimer = function(){
        var layers = data.layers.availables;
        var capas=[];
        for(x in layers){
            capas.push(x);
        }
        var event = function(){
            var bounds = data.Map.map.getExtent();
            var extent = bounds.toGeometry()+"";
            
            capas = capas.toString();
            var params = {layers:capas,extent:extent}
            makeConection(params);
        }
        data.timer = Timer.define(2000,event,true,true);
    };
    var request = Request.New({
        url:data.request.url,
        contentType:"application/json; charset=utf-8",
        events:{
            success:function(response){
                if(response.response.success){
                    showYearsAvailables(response.data.value);
                }else{
                    //console.log(response.message);
                }
                data.map.moved=false;
            },
            error:function(e){
                //console.log('error lineTime')
            }
        }
    });
    var getSections = function(){
        var d = new Date();
        var actualYear = '2005';// d.getFullYear(); 
        var a = arguments[0];
        var cadena='';
        for(x in a){
            var i = a[x];
            cadena+= '<div class="itemLineTime">'+
                                    '<div class="lineTimeSecLab" style="display:none">'+
                                        '<span id="lineTime_'+i.layer+'" class="playLineTime ui-icon ui-icon-circle-triangle-e" style="display:none"></span>'+
                                    '</div>'+
                                    '<div class="lineTime_view"><div id="lineTime_view_'+x+'" class="layerDisplay-sprite layerDisplay-iconEye_'+((i.visible)?'a':'d')+'" style="display:none"></div></div>'+
                                    '<div id="lineTime_'+i.layer+'_label" class="labelLineTime" align="left">'+i.label+' ('+actualYear+')</div>'+
                                    '<div class="lineTimeSlider">'+
                                        '<div id="lineTime_'+i.layer+'_slider" class="slider"></div>'+
                                    '</div>'+
                        '</div>';
        }
        return cadena;
    };
    
    var getVisibleLayers = function(){
        var result = null;
        var layers = getSource();
        for(x in layers){
            if(layers[x].visible){
                if(result==null){
                    result=[];
                }
                result.push(x);
            }
        }
        return result;
    };
    var setParamsToTimeLine = function(){
        var layers = getVisibleLayers();
        if(layers!=null){
            layers = layers.toString();
        }else{
            layers='';
        }
        data.Map.setParamsToLayer({
                layer:'lineTime',
                params:{layers: layers}
        });
    };
    var addImage = function(){
        var p = arguments[0];
        var path = p.server+
        "&LAYERS="+p.layer+"&TRANSPARANT=true&FORMAT=image/png&SERVICE=WMS&VERSION=1.1.1&"+
        "REQUEST=GetMap&STYLES=&FIRM=11&SRS=EPSG:900913&BBOX="+p.extent+"&WIDTH="+p.width+"&HEIGHT="+p.height+"&TIME="+p.time;
        var hidden = (p.hidden)?'display:none':'';
        var cadena = '<img id="lineTime_image_'+p.year+'_'+p.time+'" style="position:absolute;left:0px;'+hidden+'"  src="'+path+'">';
        var map = $("#"+p.root).append(cadena);
        $('#lineTime_image_'+p.year+'_'+p.time).bind('load', function() {
            checkImageLoading();
        });
    };
    var getContent = function(){
        var a = arguments[0];
        var cadena = '';
        cadena = getSections(a);
        cadena+='<div id="lineTime_years" style="position:absolute;top:25px;left:18px;right:12px;bottom:5px;z-index:-1"></div>';
        cadena+= '<div id="lineTime_separator" style="height:20px;padding-left:12px;padding-right:12px;">'+//width:300px;
                '</div>';
        return cadena;
    };
    
    var getInterface = function(){
        var a = arguments[0];
        var chain = '<div id="'+a.data.id+'" style="display:none" class="'+a.data.clase+'">'+
                        '<div align="center" class="titleOL" style="border-bottom:solid #CCCCCC 2px;">'+
                            '<div align="left" id="'+a.data.id+'_title">'+a.data.title+'</div>'+
                            '<span title="cerrar" id="lineTime_'+a.data.id+'_btnClose" class="closeLineTime ui-icon ui-icon-circle-close"></span>'+
                        '</div>'+
                        '<div align="center" class="contOL">'+
                            a.content+
                        '</div>'+
                    '</div>';
        return chain;
    };
    var showPopupYearSections = function(){
        var a = ['1960','1970','1980','1990','2000','2010'];
        //var a = data.years.availables;
        var contenido = '';
        var sections=0;
        for(x in a){
            contenido+=getSectionYearPopup(a[x]);
            if(x<(a.length-1)){
                contenido+=getSectionSeparatorPopup();
            }
            sections+=2;
        }
        sections-=1;
        //console.log("las secciones son " + sections);
        var segmento =data.years.width;
        var borderPixel = 2;
        $("#lineTime_years").html('').append(contenido);
        $("#lineTime_separator").css('width',(((segmento+borderPixel)*sections))+"px");
        
        $(".lineTimeSlider").each(function(){
            var id = $(this).children('div').attr('id');
            var lon = id.length-7;
            id = id.substring(9,lon);
            var anio = parseInt(a[0]);
            var cadena = '';
            for(var x=1;x<56;x++){
                cadena+=getYearsNotAvailables(anio,10,id);
                //console.log(cadena);
                anio+=1;
            }
            $(this).css('')
            $(this).children('div').append(cadena);
        });
    };
    var assingEvents = function(){
        $(".slider").each(function(){
            var year = 1960;
            var id = $(this).attr('id');
            var lon = id.length-7;
            id = id.substring(9,lon);
            $(this).slider({
                value:45,
                min: 0,
                max: 54,
                step: 1,
                slide: function( event, ui ) {
                    var etiqueta = data.layers.availables[id].label+" ("+(year+ui.value)+")";
                    $("#lineTime_"+id+"_label").html(etiqueta);
                },
                stop:function(event, ui){
                    var response={dates:'',layer:id};
                    var items = data.request.data[id].data[year+ui.value];
                    if(items){
                        //response.dates=items[0] + "/"+items[items.length-1];
                        response.dates=items[0];
                    }else{
                    //////////////////
                        var anio = parseInt(year+ui.value);
                        var origen = data.request.data[id].data;
                        var newanio = 0;
                        for(x in origen){
                            var a = parseInt(x);
                            if(a<anio){
                                newanio=a;
                            }
                        }
                        if(newanio==0){
                            for(x in origen){
                                var a = parseInt(x);
                                newanio=a;
                                break;
                            }
                        }
                        var position = newanio-year;
                        $('#lineTime_'+id+'_slider').slider( "value", position );
                        items = data.request.data[id].data[year+position];
                        response.dates=items[0];
                    }
                    ///////////////////
                        
                        var newLayer = response.dates;
                        var fuente = data.Tree.getTemporalStore();
                        var position = fuente.Vectorial.item[id];
                        var grupo = fuente.Vectorial.position[position].group;
                        var params = [{id:id,active:true,group:grupo}];
                        data.Tree.addToRepository(params);
                    
                }
            });
            $(this).slider('disable');
            
        });
        $("#lineTime_"+data.popup.id+"_btnClose").click(function(){
                toggleVisibility(data.popup);
        });
        $(".playLineTime").each(function(){
            $(this).click(function(){
                var layer = $(this).attr('id').replace('lineTime_','');
                showModal(layer);
            });
        });
        $("#"+data.idBtn).click(function(){
            if(data.popup.enable){
                toggleVisibility(data.popup);
            }
        });
        showPopupYearSections();
        var registro={flag:true,id:'',slider:''};
        $(".lineTime_view").each(function(){
            
            var reg = jQuery.extend({},registro);
            reg.id = $(this).children().attr('id');
            reg.id = reg.id.replace('lineTime_view_','');
            reg.flag = (data.layers.availables[reg.id].visible);
            reg.slider = 'lineTime_'+reg.id+'_slider';
            $(this).children().click(function(){
                var item = $(this);
                reg.flag = !reg.flag;
                statusDisabled({layer:reg.id,slider:reg.flag,play:true,eye:true,visible:reg.flag,disable:true});
                if(!reg.flag){
                    item.removeClass('layerDisplay-iconEye_a').addClass('layerDisplay-iconEye_d');
                }else{
                    item.removeClass('layerDisplay-iconEye_d').addClass('layerDisplay-iconEye_a');
                }
                $("#"+reg.id).click();
                setParamsToTimeLine();
            });
        });
    };
    
    var visibilityLayerTime =function(id,status){
        var source = data.layers.availables;
        if(source[id]){
            source[id].visible = status;
            var item = $("#lineTime_view_"+id);
            if(!status){
                    item.removeClass('layerDisplay-iconEye_a').addClass('layerDisplay-iconEye_d');
                    toggleVisibility(data.popup);
            }else{
                    item.removeClass('layerDisplay-iconEye_d').addClass('layerDisplay-iconEye_a');
            }
            data.popup.enable=status;
            statusDisabled({layer:id,eye:true,play:true,slider:status,visible:status});
        }
    };
    
    var stop = function(){
        $("#lineTime_btn_animation").removeClass('icon_stop').addClass('icon_play');
        $("#slider-modal" ).draggable( "enable").removeClass('lineTime_slider_modal_disabled');
        
    };
    var play = function(){
        var info = data.modal.images;
        var images = data.request.data[info.layer].data;
        if((info.years[info.pos])&&(data.modal.animation)){
            var year = info.years[info.pos];
            if(images[year][info.image]){
                $("#"+info.last).fadeOut();
                var imagen = images[year][info.image];
                var id = 'lineTime_image_'+year+'_'+imagen;
                $("#"+id).fadeIn();
                info.last=id;
                $("#slider-modal").css('left',info.positions[year][info.image].position+"px");
                info.image+=1;
            }else{
                info.pos+=1;
                info.image=0;
            }
            setTimeout(function(){
                play();
            },2000);
               
        }else{
            info.image=0;
            info.pos=0;
            stop();
        }
    };
    
    var assingEventsModal = function(){
        $("#lineTime_"+data.modal.id+"_btnClose").click(function(){
            if(data.modal.animation){
                $("#lineTime_btn_animation").click();
            }
            $("#"+data.modal.id+",#"+data.blocker.id).hide();
            
        });
        $("#lineTime_btn_animation").click(function(){
            data.modal.animation=!data.modal.animation;
            if(data.modal.animation){
                $(this).removeClass('icon_play').addClass('icon_stop');
                $("#slider-modal" ).draggable( "disable").addClass('lineTime_slider_modal_disabled');
                play();
            }else{
                stop();
            }
        });
    };
    var getSource = function(){
        return data.layers.availables;
    };
    var toggleVisibility = function(){
        var a = arguments[0];
        a.visible=!a.visible;
        $("#"+a.id).toggle(a.visible);
        if(a.visible){
            execute();
        }
    };
    var addComponents = function(){
        var source = getSource();
        var params = {data:data.popup,content:getContent(source)};
        $("#"+data.root).append(getInterface(params));
    };
    var getContentModal = function(){
        var dims = getDimentionsFromMap();
        var cadena ='<div style="padding-top:5px;padding-bottom:2px;padding-left:2px;padding-right:2px;">'+
                        '<div style="background:#DCDDDF;padding-top:5px;padding-left:10px;padding-right:10px;padding-bottom:10px;">'+
                            '<div id="'+data.map.div+'" style="width:'+dims.width+'px;height:'+dims.height+'px;background:white;position:relative;">'+
                                //'<div id="'+data.map.div+'_base" style="width:'+dims.width+'px;height:'+dims.height+'px;position:absolute:top:0px;">'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div style="height:50px;padding-top:10px">'+
                        '<div style="float:left;height:100%;width:9%">'+
                            '<div style="padding-top:8px">'+
                                '<div  id="lineTime_btn_animation" class="lineTime_icons icon_play"></div>'+
                            '</div>'+
                        '</div>'+
                        '<div style="position:relative;float:left;height:100%;width: 90%;border: 2px solid #BBBCC0;">'+
                        '<div id="lineTime_modal" style="position:absolute;top:5px;left:5px;right:5px;bottom:5px;"></div>'+
                        '</div>'+
                        '<div id="lineTime_blocker" style="position:absolute;bottom:10px;left:10px;right:10px;top:30px;background:#DCDDDF;padding-top:5px;padding-left:10px;padding-right:10px;padding-bottom:10px;">'+
                            '<div style="background:white;height:100%;">'+
                                '<div style="font-size:170%;padding-top:20%;padding-right:20%;padding-left:20%">'+
                                    '<img src="img/spinner.gif">'+
                                    '<div style="border-bottom: 10px solid #DDDDDD">Cargando animaci&oacute;n</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
        return cadena;
    };
    var clearYears = function(){
        $(".lineTime_year").each(function(){
            $(this).css('background','white');
        });
    };
    
    var statusDisabled = function(){//{layer:x,slider:true,play:true,view:true}
        var a = arguments[0];
        var layer = a.layer
        var item = data.layers.availables[a.layer];
        var status = 'disable';
        if(a.slider){
           status = 'enable';
        }
        $("#lineTime_"+a.layer+"_slider").slider(status);
        
        if(a.play){
            $("#lineTime_"+layer).show();
        }else{
            $("#lineTime_"+layer).hide();
        }
        if(a.eye){
            $("#lineTime_view_"+layer).show();
        }else{
            $("#lineTime_view_"+layer).hide();
        }
        if(a.visible!=undefined){
            item.visible = a.visible;
        }
        item.enable = a.disable;
        if(item.visible==false){
            $("#lineTime_"+a.layer+"_slider").slider('disable');
        }
    };
    var showYearsAvailables = function(){
        var items = arguments[0];
        data.request.data = items;
        clearYears();
        for(x in items){
                var segment = items[x];
                var paramsDisabled = {layer:x,slider:true,play:true,eye:true,disable:true};
                if(items[x]==null){
                    paramsDisabled={layer:x,slider:false,play:false,eye:false,disable:false};
                }
                statusDisabled(paramsDisabled);
                for(e in segment){
                    var years = segment[e];
                    for(y in years){
                        if(y!='0001'){
                            $("#lineTime_"+x+"_year_"+y).css('background','gray');
                        }
                    }
                }
        }
    };
    var getDimentionsFromMap = function(){
        var percent = data.map.percent;
        var map = $("#map");
        var width = map.width();
        var height = map.height();
        var newWidth = (percent*width)/100;
        var newHeight = (percent*height)/100;
        return {width:newWidth,height:newHeight};
    };
    var showModal = function(){
        $("#lineTime_blocker").show();
        var a = arguments[0];
        var m = data.modal;
        if(!m.created){
            var params = {data:m,content:getContentModal()};
            var blocker = '<div id="'+data.blocker.id+'" class="ui-widget-overlay" style="z-index:3000"></div>';
            $("#"+data.root).append(blocker).append(getInterface(params));
            //Map.init();
            assingEventsModal();
            m.created=true;
        }
        m.visible=false;
        var branch = data.layers.availables;//data.layers.get();
        $("#"+data.modal.id+"_title").html(data.modal.title+'<label style="font-weight:bold;">'+branch[a].label+'</label>');
        toggleVisibility(m);
        //Map.setParams({layers:a});
        builSecuenceImages(a);
        buildLineTimeModal(a);
        $("#"+data.blocker.id).show();
    };
    var makeConection = function(){
        var p = arguments[0];
        var params = {tablas:p.layers,proyName:dataSource.proyName/*'mdm5'*/,extent:p.extent};
        request.setParams(JSON.stringify(params));
        request.execute();
    };
    var getSectionYearPopup = function(){
        var cadena = '<div style="position:relative;float:left;width:'+data.years.width+'px;height:100%;border: 1px solid #DDDDDD;">'+
                        '<div style="position:absolute;top:0px;left:5px;right:5px;bottom:0px;background:#EEF0EF;"></div>'+
                        '<div style="position:absolute;bottom:0px;right:0px;left:0px;background:#BBBCC0;">'+arguments[0]+'</div>'+
                    '</div>';
        return cadena;
    };
    var getSectionSeparatorPopup = function(){
        return '<div style="position:relative;float:left;width:'+data.years.width+'px;height:100%;border: 1px solid #FFFFFF;"></div>';    
    };
    var getYearsNotAvailables = function(){
        var cadena = '<div id="lineTime_'+arguments[2]+'_year_'+arguments[0]+'" class="lineTime_year" style="float:left;position:relative;width:'+arguments[1]+'px;height:8px;z-index:1"></div>';
        return cadena;
    };
    var checkImageLoading = function(){
        var info = data.modal.images; 
        info.loaded+=1;
        if(info.loaded == (info.total+1)){
           $("#lineTime_blocker").fadeOut();
        }
    };
    
    var calculateExtent = function(){
        var factorLon = 2800000;
        var factorLat = 2100000;
        var centroid = data.Map.map.getCenter();
        var px2 = centroid.lon+factorLon;
        var py2 = centroid.lat+factorLat;
        var px1 = centroid.lon-factorLon; 
        var py1 = centroid.lat-factorLat;
        return px1+','+py1+','+px2+','+py2;
    };
    var builSecuenceImages = function(){
        var layer = arguments[0];
        var map = $("#lineTime_map");
        map.html('');
        //var extent = calculateExtent();
        var extent = data.Map.map.getExtent();
        var source = data.request.data[layer].data;
        var width = map.width();
        var height = map.height();
        var extentImage = extent.left+','+extent.bottom+','+extent.right+','+extent.top;//extent;//
        var years = [];
        for(x in source){
            if(x!='0001'){
                years.push((x*1));
            }
        }
        data.modal.images.loaded=0;
        data.modal.images.total=0;
        var params ={
                    root:'lineTime_map',
                    server:config.mapConfig.timeLine.base.url,
                    layer:config.mapConfig.timeLine.base.layer,
                    width:width,
                    height:height,
                    extent:extentImage,
                    year:'base',
                    time:'',
                    hidden:false
                }
        addImage(params);
        for(x in years){
            var images = source[years[x]];
            for(i in images){
                var params ={
                    root:'lineTime_map',
                    server:data.map.server,
                    layer:layer,
                    width:width,
                    height:height,
                    extent:extentImage,
                    year:years[x],
                    time:images[i],
                    hidden:true
                }
                addImage(params);
                data.modal.images.total+=1;
            }   
        }
        data.modal.images.layer=layer;
        data.modal.images.years=years;
        //Map.map.zoomExtent(extent);
    };
    var buildLineTimeModal = function(){
        var positions = {};
        var layer = arguments[0];
        var source = data.request.data[layer].data;
        $("#lineTime_modal").html('');
        var width = ($("#lineTime_modal").width())-4;
        var arreglo = [];
        var arregloPositions=[];
        for(x in source){
            if(x!='0001'){
            arreglo.push((x*1))
            }
        }
        var segmento = width/arreglo.length;
        var cadena='';
        var counter=0;
        var bandera = true;
        for(x in arreglo){
            bandera=!bandera;
            var color=(bandera)?'white':'#C9C8CD';
            var colorinsider = (bandera)?'#CBCCCE':'#A3A4A8';
            cadena+='<div style="position:relative;float:left;width:'+segmento+'px;height:100%;background:'+color+'">'+
                '<div style="padding-top:14px;"><div style="background:'+colorinsider+'">'+arreglo[x]+'</div></div>'+
            '</div>';
            var items = data.request.data[layer].data[arreglo[x]];
            var regs = [];
            for(i in items){
                counter+=segmento/items.length;
                var registro = {position:counter,item:items[i],year:arreglo[x]};
                arregloPositions.push(registro);
                regs.push(registro);
            }
            positions[arreglo[x]]=regs;
        }
        data.modal.images.positions = positions;
        var slider = '<div id="slider-modal" style="position: absolute; top: -6px; width: 20px; height: 52px;">'+
                            '<div style="position:absolute;background:white;top:0px;left:0px;right:0px;height:19px;border: 1px solid black;">'+
                                '<div style="position:absolute;top:0px;right:4px;left:3px;bottom:3px;background:gray"></div>'+
                            '</div>'+
                            '<div style="position:absolute;background:white;bottom:0px;left:0px;right:0px;height:18px;border: 1px solid black;">'+
                                '<div style="position:absolute;top:3px;right:4px;left:3px;bottom:0px;background:gray"></div>'+
                            '</div>'+
                    '</div>';
        
        $("#lineTime_modal").html(cadena+slider);
        $("#slider-modal").draggable({ axis: "x" ,containment: "#lineTime_modal",cursor:'pointer',stop: function( event, ui ) {
            var result=null;
            for(x in arregloPositions){
                if(ui.position.left<=arregloPositions[x].position){
                    result=arregloPositions[x];
                    break;
                }
            }
            if(result!=null){
                $("#"+data.modal.images.last).fadeOut();
                var id = 'lineTime_image_'+result.year+'_'+result.item;
                $("#"+id).fadeIn();
                data.modal.images.last=id;
            }
        }});
        
    };
    var setMovedMap =function(){
        data.map.moved = arguments[0];
    };
    var execute = function(){
        if((data.timer)&&(data.popup.visible)&&(data.map.moved)){
            data.timer.execute();
        }
    };
    var spetialModule = function(capas){
        var year = 1960;
        var layers = capas.split(',');
        var source = data.layers.availables;
        var positions = [];
        for(x in layers){
            if(source[layers[x]]){
                if(source[layers[x]].visible){
                    replace = true;
                    var valor = $('#lineTime_'+layers[x]+'_slider').slider( "option", "value" );
                    var newLayer = data.request.data[layers[x]].data[year+valor];
                    if(newLayer){
                            capas = capas.replace(layers[x],newLayer[0]);
                    }else{
                        positions.push(x);
                    }
                    
                }
            }
        }
        if(positions.length>0){
            for(var i = positions.length;i>=0;i--){
                layers.splice(positions[i],1);
                capas = layers.toString();
            }
            
        }
        return capas;
    };
    
    var init = function(){
        /*data.Map = arguments[0];
        data.Tree = arguments[1];
        addComponents();
        assingEvents();
        defineTimer();
        execute();
        data.timer.execute();*/
    };
    return{
        load:init,
        execute:execute,
        addLayerAvailable:data.layers.addAvailable,
        getLayers:getVisibleLayers,
        setMovedMap:setMovedMap,
        setVisibilityLayerTime:visibilityLayerTime,
        spetialModule:spetialModule
    };
});