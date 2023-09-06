define([],function() {    
       
    var moduleWindow =function(){
        var _window={
            root:'',
            data:{
                id:'',
                title:'',
                content:'',
                events:{
                    onCreate:null,
                    onShow:null,
                    onClose:null,
                    onCancel:null
                },
                width:200,
                btnClose:true,
                modal:false
            },
            created:false,
            declare:function(initParams){
                var obj = _window;
                $.extend(obj.data,initParams);
            },
            assingEvents:function(){
                var obj = _window;
                var id=obj.data.id;
                $("#"+id+"_btnClose").click(function(){
                    obj.hide();
                    if(obj.data.events.onCancel!=null){
                            obj.data.events.onCancel();
                    }
                });
                $("#"+id).draggable();
            },
            getPosition:function(){
                var obj = _window;
                var parent = $("#"+obj.root);
                var window = $("#"+obj.data.id);
                var left = ((parent.width() / 2) - (window.width() / 2));
                var top = (parent.height() / 2) - (window.height() / 2);
                top-=55;
                return {left:left,top:top};
            },
            setPosition:function(){
               var obj=_window;
               var pos = obj.getPosition();
               $("#"+obj.data.id).css({left:pos.left+'px',top:pos.top+'px'});
               $("#"+obj.data.id).css({left:pos.left+'px',top:pos.top+'px'});
            },
            getInterface:function(){
                var obj = _window;
                var i = obj.data;
                var contStyle = (obj.data.contentStyle)?obj.data.contentStyle:'';
                var chain = ((obj.data.modal)?'<div id="'+i.id+'_blocker" class="ui-widget-overlay" style="display:none;z-index:3000"></div>':'')+
                            '<div id="'+i.id+'" style="display:none;" class="Modal Modal-window">'+
                                '<div align="center" class="titleOL" style="border-bottom:solid #CCCCCC 2px;">'+
                                    '<div align="left" id="'+i.id+'_title">'+i.title+'</div>'+
                                    ((obj.data.btnClose)?'<span title="cerrar" id="'+i.id+'_btnClose" class="closeLineTime ui-icon ui-icon-circle-close"></span>':'')+
                                '</div>'+
                                '<div id="'+i.id+'_content" style="'+contStyle+'" align="center" class="contOL">'+
                                    i.content+
                                '</div>'+
                            '</div>';
                return chain;
            },
            build:function(){
                var obj = _window;
                $("#"+obj.root).append(obj.getInterface());
                obj.assingEvents();
            },
            show:function(){
                var obj = _window;
                var i=obj.data;
                $("#"+i.id).fadeIn();
                $("#"+i.id+"_blocker").fadeIn();
                obj.setPosition();
                if(obj.data.events.onShow!=null){
                    obj.data.events.onShow();
                }
            },
            hide:function(){
                var obj = _window;
                var id = obj.data.id;
                $("#"+id).fadeOut();
                $("#"+id+"_blocker").fadeOut();
                if(obj.data.events.onClose!=null){
                            obj.data.events.onClose();
                }
            },
            setTitle:function(){
                var obj = _window;
                obj.data.title = arguments[0];
                $("#"+obj.data.id+"_title").html(obj.data.title);
                
            },
            run:function(){
                var obj = _window;
                if(!obj.created){
                    obj.build();
                    if(obj.data.events.onCreate!=null){
                        obj.data.events.onCreate();
                    }
                    obj.created=true;
                }
                obj.show();
            }
        };
        return {
            init:function(){
                _window.data.id=arguments[0].id,
                _window.root = arguments[0].root;
            },
            declare:_window.declare,
            show:_window.run,
            hide:_window.hide,
            setAttr:function(){
                switch(arguments[0]){
                    case 'title':
                            _window.setTitle(arguments[1]);
                        break;
                }
            }
        };
    }
    
    var moduleModal = (function(){
        var _modal = {
            root:'panel-center',
            idModal:'Modal',
            counter:0,
            getId:function(){
                var obj = _modal;
                obj.counter+=1;  
                return obj.idModal+obj.counter;  
            },
            getModal:function(){
                var obj = _modal;
                var data = {id:obj.getId(),root:obj.root};
                var newModal = new moduleWindow;
                //var newModal = jQuery.extend({},moduleWindow);
                newModal.init(data);
                return newModal;
            }
        };
        return {
            create:function(settings){
                settings.id = _modal.getId();
                var modal = _modal.getModal();
                modal.declare(settings);
                return modal;
            }
        }
    }());
    
    return {
        create:moduleModal.create
    };
});