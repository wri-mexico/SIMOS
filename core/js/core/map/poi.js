define(['OpenLayers','marker','modal','features','request'],function(OL,Marker,Modal,Features,Request) {    
    
    var Map;
    var modal;
    var init = function(){
        Map = arguments[0];
        administratorPoi.restore();
        
    };
    var eventManager={
        events:{},
        set:function(){
            var a = arguments;
            var obj=eventManager;
            obj.events[a[0]]=a[1];
        },
        execute:function(e){
            var a = arguments[0];
            var obj = eventManager;
            if(obj.events[a]){
                obj.events[a](e);
            }
        }
    };

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
    var Poi = function(){
        var _mark = {
            initialized:false,
            data:{
                id:'',
                name:'',
                description:'',
                location:{
                    lon:0,
                    lat:0
                },
                date:null,
                time:null,
                zoom:0
            },
            labels:{
                day:[
                    'Domingo',
                    'Lunes',
                    'Martes',
                    'Mi&eacute;rcoles',
                    'Jueves',
                    'Viernes',
                    'S&aacute;bado'
                ],
                month:[
                    'Enero',
                    'Febrero',
                    'Marzo',
                    'Abril',
                    'Mayo',
                    'Junio',
                    'Julio',
                    'Agosto',
                    'Septiembre',
                    'Octubre',
                    'Noviembre',
                    'Diciembre'
                ]
            },
            set:function(){
                var obj = _mark;
                $.extend(obj.data,arguments[0]);
            },
            ubicate:function(){
                var obj = _mark;
                var l = obj.data.location;
                var lonlat = new OL.LonLat(parseFloat(l.lon),parseFloat(l.lat));
                Map.map.setCenter(lonlat,obj.data.zoom);
                obj.select();
            },
            select:function(){
                var obj = _mark;
                Marker.event({action:'unselect',items:'all',type:'poi'});
		Marker.event({action:'select',items:[{id:obj.data.id}],type:'poi'});
            },
            getInfoDate:function(){
		var d = new Date();
		var c_day = d.getDay();
		var c_date = d.getDate();
		var c_month = d.getMonth();
		var c_year = d.getFullYear();
                return {day:c_day,number:c_date,month:c_month,year:c_year}; 
            },
            getInfoTime:function(){
		var d = new Date();
                return {hour:d.getHours(),minutes:d.getMinutes(),seconds:d.getSeconds()}
	    },
            getDate:function(){
                var obj = _mark.data;
                var labels = _mark.labels;
                return labels.day[obj.date.day] + " " + obj.date.number + ", " + labels.month[obj.date.month] + " " + obj.date.year;
            },
            getTime:function(){
                var obj = _mark.data;
                var chain = obj.time.hour+':'+obj.time.minutes+':'+obj.time.seconds;
                return chain;
            },
            addInfoCreacion:function(){
                var obj = _mark;
                obj.initialized=true;
                obj.data.date=obj.getInfoDate();
                obj.data.time=obj.getInfoTime();
            },
            setData:function(p){
                var obj = _mark;
                var params = {nom:p.name}
                obj.set(p);
                Marker.event({action:'set',items:[{id:obj.data.id}],type:'poi',params:params});
            }
        };
        return {
            declare:function(){
                _mark.set(arguments[0]);
                if(!_mark.initialized){
                    if(_mark.data.time==null){
                        _mark.addInfoCreacion();
                    }
                    _mark.initialized=true;
                }
            },
            ubicate:function(){
                _mark.ubicate();
            },
            getInfo:function(){
                return {
                    date:_mark.getDate(),
                    time:_mark.getTime(),
                    lonlat:_mark.data.location,
                    zoom:_mark.data.zoom,
                    name:_mark.data.name,
                    id:_mark.data.id
                }
            },
            getData:function(){
                return _mark.data;
            },
            setData:function(){
                _mark.setData(arguments[0]);
            },
            getFormat:function(){
                return _mark.getDate();
            }
        }
    };
    
    var administratorPoi = (function(){
        var _admin = {
            idStorage:'Pois',
            reg:{},
            poiSelected:null,
            modalBuffer:null,
            modalUniqueBuffer:null,
            modal:null,/*
            poi:{
                coords:null,
                id:null
            },*/
            getContentModalUniqueBuffer:function(){
              var cadena = '<div align="left" style="font-size:110%;margin-left:20px;margin-top:10px;margin-bottom:5px">'+
                                'Tama&ntilde;o del &aacute;rea de influencia (metros) '+
                            '</div>'+
                            '<div style="width:300px">'+
                                '<input id="Poi_unique_buffers_meters" type="text" placeholder="metros" value="" class="ui-corner-all inputItem " style="font-size:100%">'+    
                            '</div>'+
                            '<div style="padding-top:12px"><button id="Poi_btn_add_unique_buffer">Calcular</button></div>';
        
              return cadena;
            },
            getContentModalBuffer:function(){
              var cadena = '<div align="left" style="font-size:110%;margin-left:20px;margin-top:10px;margin-bottom:5px">'+
                                'Tama&ntilde;o del &aacute;rea de influencia (metros) '+
                            '</div>'+
                            '<div style="width:300px">'+
                                '<input id="Poi_buffers_meters" type="text" placeholder="metros" value="" class="ui-corner-all inputItem " style="font-size:100%">'+    
                            '</div>'+
                            '<div style="padding-top:12px"><button id="Poi_btn_add_buffer">Calcular</button></div>';
        
              return cadena;
            },
            getContentModal:function(){
              var cadena = '<div align="left" style="font-size:110%;margin-left:20px;margin-top:10px;margin-bottom:5px">'+
                                'Ingrese el nombre'+
                            '</div>'+
                                
                            '<div style="width:300px">'+
                                '<input id="Poi_input" type="text" placeholder="Nombre" value="" class="ui-corner-all inputItem " style="font-size:100%">'+    
                            '</div>'+
                                
                            '<div style="padding-top:12px"><button id="Poi_btn_add">Agregar</button></div>';
        
              return cadena;
            },
            getName:function(){
                var input = $("#Poi_input");
                return input.value();
            },
            eventCreateModal:function(){
                var acept = $("#Poi_btn_add");
                var input = $("#Poi_input");
                acept.button({icons:{primary:'ui-icon-circle-check'}}).click(function(){
                    var newPoi = Marker.getLastMarker();
                    newPoi.custom.nom = input.val();
                    _admin.add(newPoi);
                    _admin.modal.hide();
                });
                ////
                input.bind("keypress", function(evt) {
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
                            acept.click();
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
            eventShowModal:function(){
                $("#Poi_input").val('').focus();
            },
            eventCreateModalAddBuffer:function(){
                var acept = $("#Poi_btn_add_buffer");
                var input = $("#Poi_buffers_meters");
                acept.button({icons:{primary:'ui-icon-circle-check'}}).click(function(){
                    var distance = parseFloat(input.val())
                    _admin.generateBuffers(distance);
                    _admin.modalBuffer.hide();
                });
                input.bind("keypress", function(evt) {
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
                            acept.click();
                            return true;
                        }else{
                            var keyChar = String.fromCharCode(charCode);
                            var keyChar2 = keyChar.toLowerCase();
                            var re =  /[0-9]/;
                            var result = re.test(keyChar2);
                            /*
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
                            }*/
                        }
                    return result; 
                    } 
                });
                /////
            },
            eventShowModalAddBuffer:function(){
                $("#Poi_buffers_meters").val('').focus();
            },
            /////
            
            eventCreateModalAddUniqueBuffer:function(){
                var acept = $("#Poi_btn_add_unique_buffer");
                var input = $("#Poi_unique_buffers_meters");
                acept.button({icons:{primary:'ui-icon-circle-check'}}).click(function(){
                    var distance = parseFloat(input.val())
                    _admin.addCustomBuffer(distance);
                    _admin.modalUniqueBuffer.hide();
                });
                input.bind("keypress", function(evt) {
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
                            acept.click();
                            return true;
                        }else{
                            var keyChar = String.fromCharCode(charCode);
                            var keyChar2 = keyChar.toLowerCase();
                            var re =  /[0-9]/;
                            var result = re.test(keyChar2);
                            /*
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
                            }*/
                        }
                    return result; 
                    } 
                });
                /////
            },
            eventShowModalAddUniqueBuffer:function(){
                $("#Poi_unique_buffers_meters").val('').focus();
            },
            
            add:function(){
                var poi = arguments[0];
                var obj = _admin;
                var coords = poi.geometry;
                if(!obj.find(poi.id)){
                    var params= {
                        id:poi.id,
                        description:'',
                        name:poi.custom.nom,
                        location:{
                            lon:coords.x,
                            lat:coords.y
                        },
                        zoom:Map.map.getZoom()
                    }
                    var newPoi = new Poi;
                    //var newPoi = jQuery.extend({},Poi);
                    newPoi.declare(params);
                    obj.reg[poi.id]=newPoi;
                    //eventManager.execute('added',poi.id);
                    var response = {id:poi.id,type:'poi',data:{name:poi.custom.nom,type:'point',date:obj.reg[poi.id].getFormat()}};
                    eventFinishedCreation.execute(response);
                    obj.modal.hide();
                }
            },
            del:function(){
                var obj = _admin;
                var a = arguments[0];
                if(obj.find(a.id)){
                    Marker.event({action:'delete',items:[{id:a.id}],type:'poi'});
                    try{
                        delete obj.reg[a.id];
                    }catch(e){}
                }
            },
            set:function(id,params){
                var obj = _admin;
                if(obj.find(id)){
                    //obj.reg[a.id].declare(a);
                    obj.reg[id].setData(params);
                }
            },
            find:function(id){
                var obj = _admin;
                var exist = false;
                if(obj.reg[id]){
                    exist=!exist;
                }
                return exist;
            },
            get:function(id){
               var obj = _admin;
               var response = null;
               if(obj.find(id)){
                    response = obj.reg[id];
               }
               return response;
            },
            reset:function(){
                var params = {action:'delete',items:'all',type:'poi'};
                Marker.event(params);
                amplify.store('Pois',null);
            },
            store:function(){
                var obj = _admin;
                var datos = [];
                for(x in obj.reg){
                    var i = obj.reg[x];
                    datos.push(i.getData());
                    //console.log(obj.reg[x].getData());
                }
                if(datos.length>0){
                    amplify.store('Pois',datos);
                }
            },
            restore:function(){
                //restore information from storage
                var obj = _admin;
                var storedPois = amplify.store('Pois');
                if(storedPois){
                    for(x in storedPois){
                        var i = storedPois[x];
                        var params = {
                            lon:i.location.lon,
                            lat:i.location.lat,
                            type:'poi',
                            params:{
                                nom:i.name,
                                desc:'',
                                func:null
                                }
                            };
                        Marker.add(params);
                        var lastPoi = Marker.getLastMarker();
                        obj.add(lastPoi);
                    }
                }
            },
            start:function(){
                Map.activeControl({control:'poi',active:true});
            },
            finish:function(){
                
            },
            replayModal:function(){
                var a = arguments[0];
                var obj = _admin;
                obj.modal.show();
            },
            cancelInsert:function(event){
                var poi = Marker.getLastMarker();
                var params = {action:'delete',items:[{id:poi.id}],type:'poi'};
                Marker.event(params);
                //eventManager.execute('canceled',null);
                eventCalceledCreation.execute(null);
            },
            generateBuffers:function(meters){
                var obj = _admin;
                for(x in obj.reg){
                    var i = obj.reg[x];
                    var info = i.getData();
                    var wkt = Features.getWktFromCentroid(info.location,meters,40);
                    Features.add({
                        wkt:wkt,
                        zoom:false,
                        store:true,
                        params:Features.getFormat('buffer','polygon')
                    });
                }
                
            },
            addCustomBuffer:function(meters){//for apply buffer a unique poi
                var obj = _admin;
                var i = obj.reg[obj.poiSelected];
                var info = i.getData();
                var wkt = Features.getWktFromCentroid(info.location,meters,40);
                Features.add({
                        wkt:wkt,
                        zoom:false,
                        store:true,
                        params:Features.getFormat('buffer','polygon')
                });
            },
            showModalAddBuffers:function(){
                var obj = _admin;
                obj.modalBuffer.show();
                
            }
        };
        _admin.modal=Modal.create({
                    title:'Nuevo punto de inter&eacute;s',
                    content:_admin.getContentModal(),
                    events:{
                        onCancel:_admin.cancelInsert,
                        onCreate:_admin.eventCreateModal,
                        onShow:_admin.eventShowModal
                    }
        });
        _admin.modalBuffer=Modal.create({
                    title:'Asignar &aacute;reas de influencia',
                    content:_admin.getContentModalBuffer(),
                    events:{
                        //onCancel:_admin.cancelInsert,
                        onCreate:_admin.eventCreateModalAddBuffer,
                        onShow:_admin.eventShowModalAddBuffer
                    }
        });
        _admin.modalUniqueBuffer=Modal.create({
                    title:'Asignar &aacute;rea de influencia',
                    content:_admin.getContentModalUniqueBuffer(),
                    events:{
                        //onCancel:_admin.cancelInsert,
                        onCreate:_admin.eventCreateModalAddUniqueBuffer,
                        onShow:_admin.eventShowModalAddUniqueBuffer
                    }
        });
        return {
            add:function(){
                _admin.add(arguments[0]);
            },
            store:_admin.store,
            start:_admin.start,
            finish:_admin.finish,
            showModal:_admin.replayModal,
            restore:_admin.restore,
            generateBuffers:_admin.showModalAddBuffers,
            setData:function(id,params){
                _admin.set(id,params);
            },
            remove:function(){
                _admin.del(arguments[0]);
            },
            locate:function(){
                var poi = _admin.get(arguments[0].id);
                if(poi!=null){
                    poi.ubicate();
                }
            },
            select:function(){
                var id = arguments[0].id;
                Marker.event({action:'unselect',items:'all',type:'poi'});
		Marker.event({action:'select',items:[{id:id}],type:'poi'});
            },
            addBuffer:function(){
                _admin.poiSelected=arguments[0].id;
                _admin.modalUniqueBuffer.show();
            }
            
        }
    }());
    
    var eventFinishedCreation = {
        func:null,
        setFunction:function(){
                eventFinishedCreation.func=arguments[0];
        },
        execute:function(a){
            if(eventFinishedCreation.func){
                eventFinishedCreation.func(a);
            }
        }
    };
    var eventCalceledCreation = {
        func:null,
        setFunction:function(){
                eventCalceledCreation.func=arguments[0];
        },
        execute:function(a){
            if(eventCalceledCreation.func){
                eventCalceledCreation.func(a);
            }
        }
    };
    
    var action = function(){
        //{action:'delete',poi:''}
        var a = arguments[0];
        var item = {id:a.poi};
        switch(a.action){
            case 'delete':
                administratorPoi.remove(item);
                break;
            case 'ubicate':
                administratorPoi.locate(item);
                break;
            case 'set':
                administratorPoi.setData(a.poi,a.params.data);
                break;
            case 'addBuffer':
                administratorPoi.addBuffer(item);
                break;
            case 'select':
                administratorPoi.select(item);
                break;
            case 'export':
                Export();
                break;
        }
    };
    
    var requestExport = Request.New({
        url:'http://10.1.30.101:8080/GeneraKML/save2KML.do',
        params:'',
        extraFields:'',
        events:{
            success:function(data,extra){
                console.log('exportado');
            },
            before:function(){
                //console.log("antes");
            },
            error:function(e,e2){
                console.log(e)
                console.log(e2)
                console.log("error");
            },
            complete:function(){
               // console.log("terminado");
                
            }
        }
    });
    var getkml = function(){
            var pois = Marker.getPois();
            var kml = null;
            if(pois.length>0){
                var format = new OL.Format.KML({
                    'foldersName':"Mapa Digital de Mexico V6.0",
                    'foldersDesc':'Puntos de interes generados',
                    'maxDepth':10,
                    'extractStyles':true,
                    'extractAttributes':true,
                    'internalProjection': Map.projection.used,
                    'externalProjection': Map.projection.used
                });
                kml = format.write(pois);
            }
            return kml;
    };
    var Export = function(){
        var kml = getkml();
        $("#texkml").val(kml);
        var url = "http://10.1.30.101:8080/GeneraKML/save2KML.do";
        $("#exportKml").attr('action',url+'?kmlfile='+kml)
        $("#exportKml").submit();
        //requestExport.setParams({kmlfile:kml});
        //requestExport.execute();
    };
    
    return {
        add:administratorPoi.add,
        load:init,
        start:administratorPoi.start,
        finish:administratorPoi.finish,
        showModal:administratorPoi.showModal,
        /*
        setEventAdded:function(e){
            eventManager.set('added',e);
        },
        */
        setEventAdded:eventFinishedCreation.setFunction,
        setEventCanceled:eventCalceledCreation.setFunction,
        /*
        setEventCanceled:function(e){
            eventManager.set('canceled',e);
        },*/
        store:administratorPoi.store,
        generateBuffers:administratorPoi.generateBuffers,
        event:action
    }
});