define([],function() {
    var Notification = function(){
        this.id=null;
        this.show=function(){
            //$("#"+this.id).show();
            $("#"+this.id).show( 'slide', {direction:"up"}, 500 );
        };
        this.hide=function(){
            $("#"+this.id).hide( 'slide', {direction:"up"}, 500 );
        },
        this.error=function(){
            chain = '<div class="ui-state-error ui-corner-all" style="padding: 0 .7em;">'+
                        '<p>'+
                            '<span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>'+
                                    '<strong>Servicio no disponible, intente m&aacute;s tarde</strong>'+
                        '</p>'+
                    '</div>';
            $('#'+this.id + ' .contentNotification').html(chain);
            $('#close_'+this.id).hide();
            $('#'+this.id + ' .dinamicPanel-spinner').hide();
        }
    };
    var counter=0;
    var id='Notification';
    var idBase = 'BaseNotifications';
    var root='map';
    var appendTo = function(){
        $("#"+arguments[0]).append(arguments[1])  
    };
    var getNewId = function(){
        counter+=1;
        return id+counter;  
    };
    var getId = function(){
        return id+counter;  
    };
    var appendBase = function(){
        var chain = '<div id="'+idBase+'" class="Notifications"></div>';
        appendTo(root,chain);
    };
    var buildNotification = function(text){
        var chain=  '<div id="'+getNewId()+'" style="width:300px;display:none" class="Notification">'+
                        '<div id="close_'+getId()+'" class="dinamicPanel-sprite dinamicPanel-close-short" style="position:absolute;right:10px;top:5px"></div>'+
                        '<div class="dinamicPanel-spinner ajax-loader" style="position:absolute;left:10px;top:5px"></div>'+
                        '<div class="contentNotification">'+text+'</div>'+
                    '<div>';
        return chain;
    };
    var create = function(){
        var params = arguments[0];
        var chain = buildNotification(params.message);
        appendTo(idBase,chain);
        var notification = new Notification();
        notification.id = getId();
        $("#close_"+getId()).click(function(){
           notification.hide();
        });
        notification.show();
        return notification;
    };
    var destroy = function(){
        $("#"+arguments[0]).remove();
    };
    return {
        show:function(){
            return create(arguments[0]);
        },
        hide:function(){
            destroy(arguments[0])
        },
        load:function(){
            appendBase();
        }
    };
});