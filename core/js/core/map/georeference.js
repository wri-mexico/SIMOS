define(['OpenLayers','timer','modal','features','dataSource'],function(OL,Timer,Modal,Features,dataSource) {
    var Map;
    
    var removeEmptySpaces = function(cadena){
		 var resultado = "";
		 resultado = cadena.replace(/^\s*|\s*$/g,"");
		 return resultado;
    };
    
    var itemSelected = null;  
    var getContentBuffer = function(){
        var cadena ='<div align="left" style="font-size:110%;margin-left:20px;margin-top:10px;margin-bottom:5px">'+
                        'Tama&ntilde;o del &aacute;rea de influencia (metros)'+
                    '</div>'+
                    '<div style="width:300px">'+
                            '<input id="geo_buff" type="text" placeholder="Metros" value="" class="ui-corner-all inputItem " style="font-size:100%">'+    
                    '</div>'+
                    '<div style="padding-top:12px"><button id="geo_btn_add_buff">Calcular</button></div>';
                
        return cadena;
    };
	
    var modalBuffer = Modal.create({
                    title:'Asignar georreferencia',
                    content:getContentBuffer(),
                    events:{
                        onCancel:function(){
                            modalBuffer.hide();
                        },
                        onCreate:function(){
                            var btn = $("#geo_btn_add_buff");
                            var input = $("#geo_buff");
                            btn.button({icons:{primary:'ui-icon-circle-check'}}).click(function(){
                                var id = itemSelected.id;
                                var size = removeEmptySpaces(input.val());
                                if(size.length>0){
                                    var tipo = itemSelected.data.type;
                                    Features.addBufferToBuffer(id,size,tipo,false,itemSelected.lonlat);
                                    modalBuffer.hide();
                                }
                            });
                            ////
                            input.bind("keypress", function(evt) {
                                var result=true;
                                var otherresult = 12;
                                if(window.event != undefined){
                                    otherresult = window.event.keyCode;
                                }
                                var charCode = (evt.which) ? evt.which : otherresult;
                                if (charCode <= 11) { 
                                    return true; 
                                } 
                                else {
                                    if(charCode == 13){
                                        btn.click();
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
                        },
                        onShow:function(){
                            var input = $("#geo_buff");
                            input.val('').focus();
                        }
                    }
    });
    
    /////////////////
     var getContentIdentifyBuffer = function(){
        var cadena ='<div align="left" style="font-size:110%;margin-left:20px;margin-top:10px;margin-bottom:5px">'+
                        'Tama&ntilde;o del &aacute;rea de influencia (metros)'+
                    '</div>'+
                    '<div style="width:300px">'+
                            '<input id="geo_buff_identify" type="text" placeholder="Metros" value="" class="ui-corner-all inputItem " style="font-size:100%">'+    
                    '</div>'+
                    '<div style="padding-top:12px"><button id="geo_btn_add_buff_identify">Calcular</button></div>';
                
        return cadena;
    };
    
    var dataBufferIdentify=null;
    var modalBufferIdentify = Modal.create({
                    title:'Asignar georreferencia',
                    content:getContentIdentifyBuffer(),
                    events:{
                        onCancel:function(){
                            modalBuffer.hide();
                        },
                        onCreate:function(){
                            var btn = $("#geo_btn_add_buff_identify");
                            var input = $("#geo_buff_identify");
                            btn.button({icons:{primary:'ui-icon-circle-check'}}).click(function(){
                                $("#mdm6DinamicPanel").dinamicPanel('showPanel','geoPanel');
                                var size = removeEmptySpaces(input.val());
                                if(size.length>0){
                                    
                                    dataBufferIdentify.size = size;
                                    Features.addArea(dataBufferIdentify);
                                    modalBufferIdentify.hide();
                                    
                                }
                            });
                            ////
                            input.bind("keypress", function(evt) {
                                var result=true;
                                var otherresult = 12;
                                if(window.event != undefined){
                                    otherresult = window.event.keyCode;
                                }
                                var charCode = (evt.which) ? evt.which : otherresult;
                                if (charCode <= 11) { 
                                    return true; 
                                } 
                                else {
                                    if(charCode == 13){
                                        btn.click();
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
                        },
                        onShow:function(){
                            var input = $("#geo_buff_identify");
                            input.val('').focus();
                        }
                    }
    });
    //////////////
    var getContentPoint = function(){
        var cadena ='<div align="left" style="font-size:110%;margin-left:20px;margin-top:10px;margin-bottom:5px">'+
                        'Tama&ntilde;o del &aacute;rea de influencia (metros)'+
                    '</div>'+
                    '<div style="width:300px">'+
                            '<input id="geo_buff_point" type="text" placeholder="Metros" value="" class="ui-corner-all inputItem " style="font-size:100%">'+    
                    '</div>'+
                    '<div style="padding-top:12px"><button id="geo_btn_add_buff_point">Calcular</button></div>';
                
        return cadena;
    };
    
    var modalPoint = Modal.create({
                    title:'Asignar georreferencias',
                    content:getContentPoint(),
                    events:{
                        onCancel:function(){
                            modalPoint.hide();
                        },
                        onCreate:function(){
                            var btn = $("#geo_btn_add_buff_point");
                            var input = $("#geo_buff_point");
                            btn.button({icons:{primary:'ui-icon-circle-check'}}).click(function(){
                                var size = removeEmptySpaces(input.val());
                                if(size.length>0){
                                    Features.bufferForAllMarker('georeference',size);
                                    modalPoint.hide();
                                }
                            });
                            ////
                            input.bind("keypress", function(evt) {
                                var result=true;
                                var otherresult = 12;
                                if(window.event != undefined){
                                    otherresult = window.event.keyCode;
                                }
                                var charCode = (evt.which) ? evt.which : otherresult;
                                if (charCode <= 11) { 
                                    return true; 
                                } 
                                else {
                                    if(charCode == 13){
                                        btn.click();
                                        return true;
                                    }else{
                                       
                                        var keyChar = String.fromCharCode(charCode);
                                        var keyChar2 = keyChar.toLowerCase();
                                        var re =  /[0-9]/;
                                        var result = re.test(keyChar2);
                                    }
                                return result; 
                                } 
                            });
                        },
                        onShow:function(){
                            var input = $("#geo_buff_point");
                            input.val('').focus();
                        }
                    }
    });
    	
    var buildStructureAddress = function(data,lonlat){
	var resp = {
	    sections:{
		header:{left:[]},
		top:{left:[],right:[]},
		middle:{left:[],right:[]},
		bottom:{left:[]}
	    },
	    lonlat:lonlat,
	    item:null
	}
	var h = resp.sections.header;
	var t = resp.sections.top;
	var m = resp.sections.middle;
	var b = resp.sections.bottom;
	
	h.left.push({label:'Referencia',value:'',edit:true,id:'geoReferencia'});
	
	t.left.push({label:'Exterior',value:data.numeroExterior,edit:true,id:'geoExterior'});
	t.left.push({label:'Interior',value:'',edit:true,holder:'',id:'geoInterior'});
	
	t.right.push({label:'',value:data.numeroAnterior,fontSize:'165%'});
	
	m.left.push({label:'Tipo de vialidad',value:data.tipoVialidad});
	m.left.push({label:'Nombre de vialidad',value:data.vialidad});
	m.left.push({label:'Nombre de asentamiento humano',value:data.asentamiento});
	m.left.push({label:'Codigo postal',value:data.codigoPostal,edit:true,id:'geoCP'});
	
	
	m.right.push({label:'Nombre entre vialidad 1',value:data.entrevialidad1});
	m.right.push({label:'Tipo entre vialidad 1',value:data.tipoEntrevialidad1});
	m.right.push({label:'Nombre entre vialidad 2',value:data.entrevialidad2});
	m.right.push({label:'Tipo entre vialidad 2',value:data.tipoEntrevialidad2});
	m.right.push({label:'Nombre entre vialidad posterior',value:'',edit:true,id:'geoEntrevialidad'});
	m.right.push({label:'Tipo entre vialidad posterior',value:'Avenida'});
	
	b.left.push({label:'Localidad',value:data.localidad});
	b.left.push({label:'Clave de localidad',value:data.cveloc}); //clave de locadlidad
	b.left.push({label:'Nombre del municipio o delegaci&oacute;n',value:data.municipio});
	b.left.push({label:'Clave del municipio o delegaci&oacute;n',value:data.cvemun});
	b.left.push({label:'Nombre del estado o del distrito federal',value:data.entidad});
	b.left.push({label:'Clave del estado o del distrito federal',value:data.ent});
	
	return resp;
    };
    
    
    var georeferenceAddress=function(wkt,lonlat,getResponse){
	var params = {
                         url:dataSource.georeferenceAddress.url,//+'point='+wkt,
			 
                         type:dataSource.georeferenceAddress.type,
                         format:dataSource.georeferenceAddress.dataType,
                         //params:{point:wkt},
                         extraFields:{lonlat:lonlat,getResponse:getResponse},
                         contentType:dataSource.georeferenceAddress.contentType,
                         //xhrFields:mdmp_sources.global.xhrFields,
                         events:{
                             success:function(data,extra){
                                   var messages=null;
				   if(!extra.getResponse){
					if(data){
					     if(data.response.success){
						 var info = data.data.value;
						 $("#map").georeferenceAddress(buildStructureAddress(info,extra.lonlat));
					     }else{
						 messages=data.response.message;
						 //falta linea para remover last marker
					     }
					}else{
					  messages=[];
					  messages.push('Servicio no disponible, intente m&aacute;s tarde');
					}
					if(messages){
					       for(var x=0;x<messages.length;x++){
						    MDM6('newNotification',{message:messages[x],time:5000});
					       }
					       MDM6('removeLastItemGeoreference');
					}
				   }else{
					extra.getResponse(data);
				   }
                             },
                             before:function(){
                              
                             },
                             error:function(a,b,c){
                                 MDM6('newNotification',{message:'Servicio no disponible, intente m&aacute;s tarde',time:5000});
                             },
                             complete:function(){
                              
                             }
                         }
                     }
	var request = MDM6('newRequest',params);
	request.setParams(JSON.stringify({point:wkt}));
	request.execute();
	//requestGeoreferenceAddress.setParams(JSON.stringify(parametros));
    };
    MDM6('define','reverseGeocoding',function(lonlat,evento){
	var wkt = 'POINT'+'('+lonlat.lon + ' '+lonlat.lat+')';
	georeferenceAddress(wkt,lonlat,evento);
    });
    //////////////
       
    return {
        showModalBuffer:function(item){
            itemSelected = item;
            modalBuffer.show();
        },
        showModalGeoPoints:function(){
            modalPoint.show();
        },
        showModalBufferIdentify:function(){
            dataBufferIdentify = arguments[0];
            modalBufferIdentify.show();
        },
	showModalGeoAddress:function(a,b,c){
	    georeferenceAddress(a,b,c);
	}
    };
});