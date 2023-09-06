var MDM6API = {};
var MDM6;
define(function(){
   (function( $, window ) {
            var Events = {
                    options:null,
                    init : function( options ) {
                            var defaults = {
                                    'css':              [],
                                    'js':               [],
                                    'panel':            null,
                                    'onLoad':           $.noop,
                                    'aditionalLayers':  [],
                                    'cargacapa':null,
                                    'onMoveEnd':        $.noop,
                                    'onZoomEnd':        $.noop,
                                    'onIdentify':       $.noop,
                                    'btnTogglePanels':false,
                                    'header':null
                                    /*
                                    'customTools':{
                                        'identify':{'event':$.noop},
                                        'polygon':{'event':$.noop},
                                        'square':{'event':$.noop}
                                    }*/
                            };//PRUEBA
                            this.options = $.extend( defaults, options );
                            
                            //Events.ejemplo.call( this, this.options );
                            //Events.ejemplo(this.options);
                    },
                    onLoad:function(){
                        if(this.options!=null){
                            this.options.onLoad.call(this);
                        }
                    },
                    onMoveEnd:function(){
                        if(this.options!=null){
                            this.options.onMoveEnd.call(this);
                        }
                    },
                    onZoomEnd:function(){
                        if(this.options!=null){
                            this.options.onZoomEnd.call(this);
                        }
                    },
                    onIdentify:function(){
                        if(this.options!=null){
                            this.options.onIdentify.call(this,arguments[0]);
                        }
                    },
                    execute:function(f){
                        this.options[f]();
                    },
                    getCapa:function(){
                        
                    },
                    extraEvents:function(){
                        var obj = Events;
                        var id='mdm6DinamicPanel';
                        if(obj.options.btnTogglePanels){
                          
                           $("#"+id+"_search").mouseenter(function(){
                              $("#"+id+"_search,#"+id+"_toolSet").css('opacity','1');
                           }).mouseleave(function(){
                           
                              $("#"+id+"_search,#"+id+"_toolSet").css('opacity','0.3');
                           });
                           $("#"+id+"_search").mouseout();
                        }
                    },
                    load:function(type){
                        var path = 'projects/';
                        var o = this.options;
                        switch(type){
                            case 'css':
                                if((o)&&(o[type])&&(o[type].length>0)){
                                    for(x in o[type]){
                                        var css = $("<link>");
                                        css.attr({
                                            rel:  "stylesheet",
                                            type: "text/"+type,
                                            href: path+o[type][x]
                                        });
                                        $("head").append(css);
                                    }
                                }
                            break;
                        }
                    },
                    loadPanels:function(){
                        var o = this.options;//Events.options;
                        if((o)&&(o.panel)){
                            for(x in o.panel){
                                var side = x;
                                var data = o.panel[x];
                                var params = data;
                                params['position']=x;
                                $("#panel-"+side).panel(params);
                            }
                            if(o.btnTogglePanels){
                                setTimeout(function(){
                                    $(".toggle_panels").show();
                                },1500);
                                
                            }
                        }
                    },
                    loaderHeader:function(){
                        var response = null;
                        var o = this.options;//Events.options;
                        if((o)&&(o.header)){
                           response = o.header;
                           $("#header").html('');
                        }
                        return response;
                    },
                    getAditionalLayers:function(source){
                        var o = this.options;
                        if(o){
                            for(var x in this.options['aditionalLayers']){
                                source.push(this.options['aditionalLayers'][x]);
                            }
                        }
                        return source;
                    },
                    setPanel:function(panel,html,event){
                        $("#panel-"+panel).panel('setData',html,event);
                    },
                    setOptions:function(options){
                        Events.options = $.extend( Events.options, options );
                    },
                    isBtnPanelActive:function(){
                        if(Events.options.btnTogglePanels){
                            $(".toggle_panels").show();
                        }
                    },
                    
                    setParams:$.noop,
                    goCoords:$.noop,
                    onLogging:$.noop,
                    getResolution:$.noop,
                    getZoomLevel:$.noop,
                    getExtent:$.noop,
                    updateSize:$.noop,
                    setRestrictedExtent:$.noop,
                    /*
                    customTool:function(){
                        var a = arguments;
                        var o = this.options;
                        if(o.customTools[a[0]]){
                            o.customTools[a[0]].event.apply(this,[a[1]]);
                        }  
                    },*/
                    define:function(func,event){
                        Events[func]=event;
                    }
            };
    
            $.fn.MDM6 = function(e) {
                    if (Events[e] ) {
                        return Events[e].apply( this, Array.prototype.slice.call(arguments, 1) )
                    } else if ( typeof e === 'object' || ! e ) {
                        Events.init.apply( this, arguments );
                    } else {
                            //no existe el metodo
                    }
            };
            MDM6 = $.fn.MDM6;
    })( jQuery, window );
});
