(function($){
	    $.widget("mdm6.georeferenceAddress", {
            options: {
                modal:{
                        item:null,
                        params:{
                                    title:'Agregar domicilio'
                        }
                },
		sections:{
                        header:{
                                    left:[
                                                {label:'etiqueta',value:'205',edit:true},
                                    ]
                        },
                        top:{
                                    //lefTitle:'Numero de domicilio',
                                    left:[{label:'Exterior',value:210,edit:true},{label:'Interior',value:"",edit:true}],
                                    //rightTitle:'Numero exterior mas cercano',
                                    right:[{label:'Numero exterior',value:208}]
                        },
                        middle:{
                                    left:[
                                                {label:'etiqueta',value:'205',edit:true},
                                                {label:'etiqueta',value:'205'}
                                    ],
                                    right:[
                                                {label:'etiqueta',value:'205',edit:true},
                                                {label:'etiqueta',value:'205'}
                                    ]
                        },
                        bottom:{
                                    left:[
                                                {label:'etiqueta',value:'205',edit:true},
                                                {label:'etiqueta',value:'205'}
                                    ]
                        }
                },
                lonlat:{
                        lon:0,
                        lat:0
                },
                item:null,
                temporal:null
            },
	    
            _create: function(){
                var obj = this;
		obj.buildInterface();
            },
            _init: function(){
                //if( this.options.autoOpen ){
                    //this.open();
                //}
                var l = this.options.lonlat;
                this.show(l.lon,l.lat);
            },
            show:function(lon,lat){
                        var obj = this;
                        this.options.modal.item.show();
            },
            getStructure:function(){
                        var obj = this;
                        var o = obj.options;
                        var chain=''+
                        '<div class="georeferenceAddress">'+
                                    '<div class="header">'+
                                                '<div class="left"></div>'+
                                    '</div>'+
                                    '<div class="top">'+
                                                '<div class="left"></div>'+
                                                '<div class="right"></div>'+
                                    '</div>'+
                                    '<div class="middle">'+
                                                '<div class="left"></div>'+
                                                '<div class="right"></div>'+
                                    '</div>'+
                                    '<div class="bottom">'+
                                                '<div class="left"></div>'+
                                    '</div>'+
                                    '<div class="buttons" align="right">'+
                                                '<hr>'+
                                                '<button id="cancel_georfAddr">Cancelar</button>'+
                                                '<button id="add_georfAddr">Aceptar</button>'+
                                    '</div>'+
                                    
                        '</div>';
                        return chain;
            },
            fillData:function(){
                        var obj = this;
                        var s = obj.options.sections;
                        $(".georeferenceAddress .top .left").html('');
                        $(".georeferenceAddress .top .right").html('');
                        $(".georeferenceAddress .middle .left").html('');
                        $(".georeferenceAddress .middle .right").html('');
                        $(".georeferenceAddress .bottom .left").html('');
                        for(var x in s){
                                    var chain='';
                                    var segmento =' ';
                                    if(typeof(s[x])=='object'){
                                                for(var y in s[x]){
                                                            segmento=' .'+y;
                                                            var b = s[x][y];
                                                            chain='';
                                                            var top = 10;
                                                            for(var f in b){
                                                                        chain+=obj.getItem(b[f],top);
                                                                        top+=35;
                                                            }
                                                            $(".georeferenceAddress ."+x+segmento).append(chain);
                                                            
                                                }
                                    } else{
                                           chain+=getItem(s[x]);
                                           $(".georeferenceAddress ."+x+segmento).append(chain);
                                    }
                                    
                        }
                        var cont =  '<div style="position:absolute;right:50%;left:0px;top:0px;bottom:0px;">'+
                                                obj.getItem(s.top.left[0],30)+
                                    '</div>'+
                                    '<div style="position:absolute;right:0px;left:50%;top:0px;bottom:0px;">'+
                                                obj.getItem(s.top.left[1],30)+
                                    '</div>'+
                                    '<div style="position:absolute;top:8px;left:10px;font-size:110%;font-weight:bold;">N&uacute;mero de domicilio</div>';
                                    
                        $(".georeferenceAddress .top .left").html(cont);
                        
                        var cont2 = '<div>'+
                                                obj.getItem(s.top.right[0],35)+
                                    '</div>'+
                                    '<div style="position:absolute;left:10px;top:8px;font-size:110%;">N&uacute;mero exterior m&aacute;s cercano</div>';
            
                        $(".georeferenceAddress .top .right").html(cont2);
            },
            storeData:function(){
                        var obj = this;
                        var s = obj.options.sections;
                        for(var x in s){
                                    if(typeof(s[x])=='object'){
                                                for(var y in s[x]){
                                                            var b = s[x][y];
                                                            for(var f in b){
                                                                        if(b[f].edit){
                                                                                    b[f].value = obj.removeEmptySpaces($("#"+b[f].id).val());          
                                                                        }  
                                                            }
                                                            
                                                }
                                    }  
                        }
            },
            getItem:function(p,top){
                        p.value=(p.value==null)?'':p.value;
                        var chain = '<div style="position:absolute;left:10px;right:10px;top:'+top+'px">'+
                                                '<div style="width:100%;" align="left">'+p.label+'</div>'+
                                                '<div style="width:100%">'+
                                                            ((p.edit)?
                                                             '<input '+((p.id)?' id="'+p.id+'"':'')+' style="width:100%;height:16px;position:absolute:bottom:0px;border:1px solid #DDDDDD;border-radius:4px;font-size:100%;padding-left:5px;" placeholder="'+((p.holder)?p.holder:'')+'" value="'+p.value+'"></div>'
                                                            :
                                                            '<div style="position:absolute;bottom:2px;width:99%;'+((p.fontSize)?'font-size:'+p.fontSize:'')+'" align="right">'+p.value+'</div>'+
                                                            '<div style="width:100%;height:15px;position:absolute:bottom:0px;border-bottom:1px solid black;border-right:1px solid black;border-left:1px solid black;"></div>'
                                                            )+
                                                '</div>'+
                                    '</div>';
                        return chain;
            },
            removeEmptySpaces:function(cadena){
		 var resultado = "";
		 resultado = cadena.replace(/^\s*|\s*$/g,"");
		 return resultado;
            },
            isFilled:function(){
                        var obj = this;
                        var response = true;
                        var s = obj.options.sections;
                        for(var x in s){
                                    if(typeof(s[x])=='object'){
                                                for(var y in s[x]){
                                                            var b = s[x][y];
                                                            for(var f in b){
                                                                        if(b[f].edit){
                                                                                    var valor = obj.removeEmptySpaces($("#"+b[f].id).val());
                                                                                    if(valor.length==0){
                                                                                                var evento = function(){
                                                                                                            $("#"+b[f].id).attr('background','red');
                                                                                                            setTimeout(function(){
                                                                                                                        $("#"+b[f].id).attr('background','');
                                                                                                            },3000);    
                                                                                                };
                                                                                                $("#"+b[f].id).popup({root:'panel-center',title:'Introduzca la informaci&oacute;n solicitada',text:'',timer:3000,event:evento});
                                                                                                response = false;
                                                                                    }
                                                                        }  
                                                            }
                                                            
                                                }
                                    }  
                        }
                        return response;
            },
            buildInterface:function(){
                        var obj=this;
                        var params = obj.options.modal.params;
                        params['modal']=true;
                        params['content']=obj.getStructure();
                        params['events']={
                                    onCancel:function(){
                                                if(obj.options.item==null){
                                                            MDM6('removeLastItemGeoreference');
                                                }
                                    },
                                    
                                    onCreate:function(){
                                                //obj.fillData();
                                                $("#cancel_georfAddr").button().click(function(){
                                                            if(obj.options.item==null){
                                                                        MDM6('removeLastItemGeoreference');
                                                            }
                                                            obj.options.modal.item.hide();
                                                });
                                                $("#add_georfAddr").button().click(function(){
                                                            /**/
                                                            //var isfilled = obj.isFilled();
                                                            var isfilled = true;
                                                            if(isfilled){
                                                                        var chain = 'Ubicaci&oacute;n ';
                                                                        var coords = MDM6('toGeographic',obj.options.lonlat.lon,obj.options.lonlat.lat);
                                                                        var feature;
                                                                        obj.storeData();//almacena cambios asignados
                                                                        if((obj.options.temporal==null)||(obj.options.item==null)){
                                                                                    var temporal = MDM6('getTemporalGeoParams');
                                                                                    obj.options.temporal = temporal;
                                                                        }else{
                                                                                    var temporal = obj.options.temporal;
                                                                        }
                                                                        var params = temporal.data;
                                                                        //params.nom = '';
                                                                        //params.name='';
                                                                        //if(obj.options.temporal==null){
                                                                        params.desc=chain+coords.lon.toFixed(5) + ", "+coords.lat.toFixed(5);
                                                                        params.description=chain+coords.lon.toFixed(5) + ", "+coords.lat.toFixed(5);
                                                                        //}
                                                                        
                                                                        if(obj.options.item==null){
                                                                                   feature = MDM6('getLastMarker');
                                                                                   obj.options.item = feature;
                                                                        }else{
                                                                                   feature = obj.options.item; 
                                                                        }
                                                                        
                                                                        params.address = $.extend({}, obj.options);
                                                                        MDM6('markerEvent',{action:'set',items:[{id:feature.id}],type:'georeference',params:params});
                                                                        MDM6('setTemporalGeoParams',temporal);
                                                                        temporal = MDM6('getTemporalGeoParams');
                                                                        MDM6('eventFinishedCeationGeo',temporal);
                                                                        /**/
                                                                        obj.options.modal.item.hide();
                                                            }
                                                });
                                    },
                                    onShow:function(){
                                                obj.fillData();
                                    }
                        }
                        obj.options.modal.item = MDM6('getModal',params);
            },
            destroy: function(){
                var element = this.element; 
                position = $.inArray(element, $.ui.panel.instances);
                if(position > -1){
                    $.ui.panel.instances.splice(position, 1);
                }
                $.Widget.prototype.destroy.call( this );
                },
                 
                _getOtherInstances: function(){
                    var element = this.element;
                    
                    return $.grep($.mdm6.panel.instances, function(el){
                        return el !== element;
                    });
            },
            _setOption: function(key, value){
                this.options[key] = value;
                switch(key){
                    case "sections":
                        
                    break;
                    }
                }
            });
})(jQuery);
