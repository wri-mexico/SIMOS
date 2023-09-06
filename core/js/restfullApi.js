var restFullApi;
define([],function(){
   (function( $, window ) {
            var Events = {
                    root:'mapa',
                    path:'',
                    request:null,
                    removeSource:function(){
                        delete apiGenerator;
                    },
                    printStructure:function(){
                        var obj = Events;
                        var header = '<div id="header">'+
                                          '<div class="headerBackground">'+
                                                  '<img id="headerLogoINEGI" src="img/headerINEGI.png"/>'+
                                                  '<img id="headerLogoMDM" src="img/headerMDM.png"/>'+
                                          '</div>'+
                                      '</div>';
                        var mapChain = ''+
                                '<div id="main">'+
                                    (($("#mapa").length)?'':header)+
                                    '<div id="content">'+
                                        '<div id="panel-left"></div>'+
                                        '<div id="middle">'+
                                            '<div id="panel-center">'+
                                                '<div id="map"></div>'+
                                            '</div>'+
                                            '<div id="panel-bottom"></div>'+
                                        '</div>'+
                                        '<div id="panel-right"></div>'+
                                    '</div>'+
                                '</div>';
                        if($("#"+obj.root).length){
                            $("#"+obj.root).html(mapChain);
                        }else{
                            $('body').html(mapChain);
                        }
                    },
                    defineRequest:function(Request){
                        /**/
                        var obj = Events;
                        obj.request = Request.New({
                            url: apiUrl+'json/key.do',
                            contentType:"application/json; charset=utf-8",
                            params:'',
                            events:{
                                success:function(data,extra){
                                    var msg=null;
                                    if(data){
                                        if(data.success){
                                            var obj = extra.obj;
                                            obj.printStructure();
                                            extra.evento();
                                            obj.removeSource();
                                        }else{
                                             msg='Obtenga una llave valida';
                                        }
                                    }else{
                                        msg='Servicio no disponible';
                                    }
                                    if(msg!=null){
                                        alert(msg);
                                    }
                                },
                                error:function(a,b,extraFields){
                                    alert('Servicio no disponible');
                                }
                            }
                        });
                    },
                    getPath:function(){
                        return this.path;  
                    },
                    init:function(request,map,ui){
                        var obj = Events;
                        var valid = true;
                        obj.defineRequest(request);
                        if(apiGenerator){
                            //this.path = apiUrl;
                            /*
                            obj.request.setParams(apiGenerator.params);
                            obj.request.setExtraFields({obj:obj,evento:evento});
                            obj.request.execute();
                            */
                            obj.printStructure();
                            //map.Tree.event.addAditionals();
                            ui.init(map);
                            amplify.publish( 'mapBeforeLoad');
                            map.init();
                            obj.removeSource();
                        }else{
                            evento();
                        }
                    }
            };
            $.fn.restFullApi = function(e) {
                    if (Events[e] ) {
                        return Events[e].apply( this, Array.prototype.slice.call(arguments, 1) )
                    } else if ( typeof e === 'object' || ! e ) {
                        Events.init.apply( this, arguments );
                    } else {
                            //no existe el metodo
                    }
            };
            restFullApi = $.fn.restFullApi;
    })( jQuery, window );
});
