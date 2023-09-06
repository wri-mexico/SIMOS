define(['OpenLayers','timer','cluster'],function(OL,Timer,Cluster) {
     
    var Popup = {
        id:'PopupOL',
        root:'map',
        counter:0,
        created:false,
        visible:false,
        timer:null,
        clock:null,
        viewOrder:['top','bottom','left','right'],
        actualSide:null,
        maxValues:{
            top:79,
            left:120,
            right:120,
            bottom:79
        },
        limits:{},
        deactivateFeatureSelected:null,
        defineTimer:function(event){
            var obj = Popup;
            if(obj.clock){
                obj.clock.clear();
            }
            obj.clock=null;
            obj.clock = Timer.define(obj.timer,event,true,true);
            obj.clock.execute();
        },
        defineLimits:function(){
            var obj = Popup;
            var m = obj.maxValues;
            var e = $("#"+obj.root);
            var w = e.width();
            var h = e.height();
            for(x in m){
                var max = m[x];
                obj.limits[x];
                switch(x){
                    case 'top':
                        obj.limits[x]=max;
                        break;
                    case 'bottom':
                        obj.limits[x]= h-max;
                        break;
                    case 'left':
                        obj.limits[x]= max;
                        break;
                    case 'right':
                        obj.limits[x]=w-max;
                        break;
                }
            }
        },
        add:function(id,title,text){
            var obj = Popup;
            obj.counter+=1;
            var idItem ="Popup_dinamic"+obj.counter;
            $("#"+obj.root).append(obj.getChain(idItem));
            if(title){
                $("#"+idItem+' .titleOL').html(title);
            }
            if(text){
                $("#"+idItem+' .contOL').html(text);
            }
            $("#"+id).mouseenter(function(){
                var e = $(this);
                var top =e.offset().top;
                top-=40;
                var left=e.offset().left;
                obj.hideAllSides(idItem);
                obj.showPermitedSide({x:left,y:top},idItem);
                obj.setPosition({x:left,y:top},'point',idItem);
                $("#"+idItem).fadeIn();
            });
            $("#"+id).mouseleave(function(){
                $("#"+idItem).fadeOut();
            });
            
        },
        show:function(){
            var obj = Popup;
            var a = arguments[0];
            if(!obj.created){
                $("#"+obj.root).append(obj.getChain(obj.id));
                obj.created=true;
                $("#PopupOL .close").click(function(){
                    obj.deactivateFeatureSelected();
                    obj.effect('hide');
                });
            }
            if(!obj.visible){
                obj.hideAllSides(obj.id);
                obj.showPermitedSide(a.px,obj.id);
            }
            obj.setData(a,obj.id);
            obj.setPosition(a.px,a.item,obj.id);
             if(!(typeof(a.prev) == 'object')){
                obj.effect('show');
            }else{
                if(a.prev.tabla.indexOf('denue')==-1){
                    obj.effect('show');
                }else{
                    $("#"+obj.id).hide();
                }
                /*
                if(a.prev.tabla!='cdenue14'){
                    obj.effect('show');
                }else{
                    $("#"+obj.id).hide();
                }
               */
            }
        },
        hide:function(){//modificado
            
            var obj = Popup;
            obj.effect('hide');
            if(obj.clock){
                obj.clock.clear();
            }
        },
        showPermitedSide:function(){
            var obj= Popup;
            var a = arguments[0];
            var id = arguments[1];
            var side = 'left';
            var order = obj.viewOrder;
            var limit = obj.limits;
            for(x in order){
                var opc = order[x];
                var coord = ((opc=='top')||(opc=='bottom'))?a.y:a.x;
                var inlimits = ((a.x>=limit.left)&&(a.x<=limit.right))?true:false;
                if(opc=='top'){
                    if((coord>=limit[opc])&&(inlimits)){
                        side='bottom';
                        break;
                    }
                }
                if(opc=='bottom'){
                    if((coord<=limit[opc])&&(inlimits)){
                        side='top';
                        break;
                    }
                }
                if(opc=='left'){
                    if(coord>=limit[opc]){
                        side='right';
                        break;
                    }
                }
            }
            $("#"+id).addClass('PopupElement ' + side);
            obj.actualSide=side;
        },
        
        hideAllSides:function(id){ 
            $("#"+id).removeAttr('class');
        },
        setPosition:function(){
            var obj = Popup;
            var type = arguments[1];
            var p = arguments[0];
            var id = arguments[2];
            //var item = $("#"+obj.id);
            var item = $("#"+id);
            var np = obj.getPopupPosition(p,type);
            item.css({top:np.y+'px',left:np.x+'px'});
        },
        getAditionalPixels:function(){
            var a = arguments[0];
             pixels = {top:{/*w:10,*/h:10},bottom:{/*w:25,*/h:70},left:{w:10,h:20},right:{w:70,h:20}};
            if(a=='point'){
                var pixels = {top:{/*w:0,*/h:5},bottom:{/*w:35,*/h:103},left:{w:20,h:53},right:{w:80,h:53}};
            }
            return pixels;
        },
        getPopupPosition:function(){
            var obj = Popup;
            var type = arguments[1];
            var p = arguments[0];
            var item = $("#"+obj.id);
            var w = item.width();
            var h = item.height();
            var opc = obj.actualSide;
            var px = obj.getAditionalPixels(type);
            switch(opc){
                    case 'top':
                        //w=w/2;
                        h=h/2;
                        //p.x-=(w+px[opc].w);
                        p.x-=(w-28);
                        p.y+=(h+px[opc].h);
                        break;
                    case 'bottom'://top
                        w=w/2;
                        //p.x-=(w+px[opc].w);
                        p.x-=62;
                        p.y-=(h+px[opc].h);
                        break;
                    case 'left':
                         h=h/2;
                         p.x+=px[opc].w;
                         p.y-=(h+px[opc].h);
                         break;
                    case 'right':
                        h=h/2;
                        p.x-=(w+px[opc].w);
                        p.y-=(h+px[opc].h);
                        break;
            }
            return p;
        },
        getChain:function(id){
            var chain = '<div id="'+id+'" style="position:absolute;z-index:2000;" class="triangle-border">'+
                                    '<div align="center" class="titleOL"></div>'+
                                    '<div align="center" class="contOL"></div>'+
                                    '<span class="close dinamicPanel-sprite dinamicPanel-close-short"></span>'+
                        '</div>';
            return chain;
        },
        setData:function(){
            var a = arguments[0];
            var id = arguments[1];
            $("#"+id+" .contOL").html('');
            $("#"+id+" .titleOL").html('').html(a.title);
            //$("#"+this.id+" .contOL").html('');
            //$("#"+this.id+" .titleOL").html('').html(a.title);
            if(typeof(a.prev) == 'object'){
                 if(a.prev.tabla.indexOf('denue')!=-1){
                        var lonlat = MDM6('getLonLatFromPrixel',a.px);
                        Cluster.showRecordCard({id:a.prev.id,lonlat:lonlat,xy:{x:a.px.x,y:a.px.y}});
                 }else{
                        $("#"+id+" .contOL").html(a.prev.busqueda);
                 }
                 /*
                if(a.prev.tabla=='cdenue14'){
                    var lonlat = MDM6('getLonLatFromPrixel',a.px);
                     Cluster.showRecordCard({lonlat:lonlat,xy:{x:a.px.x,y:a.px.y}});
                }else{
                    $("#"+id+" .contOL").html(a.prev.busqueda);
                }
                */
                
            }else{
                $("#"+id+" .contOL").html(a.prev);
            }
            if(a.icons){
                var icons = '<div style="height:20px;width:160px">';
                for(x in a.icons){
                    icons+='<div class="popupIcon"><div style="float:left" class="'+a.icons[x].clase+'"></div><div style="padding-right: 10px;padding-left: 2px;" class="dinamicPanel-searchLink">'+a.icons[x].label+'</div></div>';
                }
                icons+= '</div>';
                $("#"+id+" .contOL").append(icons);
                
                $(".popupIcon .dinamicPanel-gallery-short").parent().unbind( "click" );
                $(".popupIcon .dinamicPanel-gallery-short").parent().click(function(){
                    a.icons[0].func();
                });
                $(".popupIcon .dinamicPanel-add-short").parent().unbind( "click" );
                $(".popupIcon .dinamicPanel-add-short").parent().click(function(){
                    a.icons[1].func();
                });
                
                //modificado
                
                
                /*
                for(x in a.icons){
                    var clase = a.icons[x].clase;
                    clase = clase.replace('dinamicPanel-sprite ','');
                    var icono = $(".popupIcon ."+clase).parent();
                    icono.unbind( "click" );
                    var item = a.icons[x];
                    var item = {};
                    $.extend( true, item, a.icons[x]);
                    icono.click(function(){
                        console.log(item)
                        item.func();
                    });
                }
                */
            }
        },
        effect:function(){
            var obj = Popup;
            var a = arguments[0];
            var e = $("#"+obj.id);
            if(e){
                if(a=='show'){
                    if(!obj.visible){
                        e.fadeIn();
                    }
                    this.visible=true;
                    
                }else{
                    e.fadeOut();
                    obj.visible=false;
                }
            }
        }
    };
    
    /**************************************************************************/
    $.widget( "custom.popup", {
                data : {
                    div:{
                        id:'',//id,
                        height:0,
                        width:0
                    },
                    popup:{
                        id:'',//id+'_popup',
                        width:0,
                        height:0,
                        corner:'',
                        top:0,
                        left:0,
                        created:false
                    },
                    limits:{
                        top:0,
                        left:0,
                        right:0,
                        bottom:0
                    },
                    padding:{
                        top:17,
                        left:17,
                        right:17,
                        bottom:17
                    }
                },
                options:{
                    viewOrder:['top-left','top-right','bottom-left','bottom-right','left-top','left-bottom','right-top','right-bottom'],
                    timer:null,
                    clock:null,
                    showOn:null,
                    title:'Titulo',
                    text:'Sin contenido',
                    type:'cloud',
                    root:'map',
                    event:$.noop,
                    xy:null,
                    btnClose:false,
                    events:{
                        onMouseOver:$.noop,
                        onMouseOut:$.noop
                    }
                },
                setValues : function(){
                    var settings = this.options
                    var popup = this.data.popup;
                    var body = $("#"+settings.root);
                    var div = this.data.div;
                    var limits = this.data.limits;
                    var p=$("#"+this.data.popup.id);
                    var d=this.element;
                    //popup.left = settings.xy.x;
                    //popup.top = settings.xy.y;
                    popup.left = (settings.xy!=null)? settings.xy.x:d.offset().left+(d.width()/2);
                    popup.top =(settings.xy!=null)?settings.xy.y:(d.offset().top)-47;
                    popup.height = p.height();
                    popup.width = p.width();
                    div.height = p.height();
                    div.width=p.width();
                    limits.top = 0;
                    limits.left= 0;
                    limits.right = body.width();
                    limits.bottom= body.height()-26;
                    
                },
                hideAllSides:function(){
                    $("#"+this.data.popup.id).removeAttr('class');
                },
                isInCoordenates:function(b){
                    var a = $.extend({}, b);
                    /*
                    a.left+=40;
                    a.right+=40;
                    a.bottom+=40;
                    a.top+=40;
                    */
                    var limits = this.data.limits;
                    var result = false;
                    if((a.left>=limits.left)&&(a.top>=limits.top)&&(a.right<=limits.right)&&(a.bottom<=limits.bottom)){
                        return true;
                    }
                  return result;
                },
                showPermitedSide:function(){
                    var settings = this.options;
                    var popup = this.data.popup;
                    var side=null;
                    var order = settings.viewOrder;
                    var limit = this.data.limits;
                    var valid = false;
                    var coords={left:0,right:0,top:0,bottom:0};
                    for(var x in order){
                        switch(order[x]){
                            case 'top-left'://bien
                                coords={
                                    left:popup.left-60,
                                    right:((popup.left-60)+popup.width)+34,
                                    top:popup.top+20,
                                    bottom:popup.top+popup.height+20
                                };
                                $("#area").css({top:coords.top+'px',left:coords.left+'px',height:(popup.height+50)+'px',width:(popup.width+34)+'px',display:'','z-index':50000})
                                if(this.isInCoordenates(coords)){
                                    valid=true;
                                    side=order[x];
                                }
                                break;
                            case 'top-right'://bien
                                coords={
                                    left:(popup.left-(popup.width+34))+60,
                                    right:popup.left+60,
                                    top:popup.top+20,
                                    bottom:popup.top+popup.height+20
                                };
                                $("#area").css({top:coords.top+'px',left:coords.left+'px',height:(popup.height+50)+'px',width:(popup.width+34)+'px',display:'','z-index':50000})
                                if(this.isInCoordenates(coords)){
                                    valid=true;
                                    side=order[x];
                                }
                                break;
                            case 'bottom-right'://bien
                                coords={
                                    left:(popup.left-(popup.width+34))+60,
                                    right:popup.left+60,
                                    top:popup.top-((popup.height+50)+20),
                                    bottom:popup.top-20
                                };
                                $("#area").css({top:coords.top+'px',left:coords.left+'px',height:(popup.height+50)+'px',width:(popup.width+34)+'px',display:'','z-index':50000})
                                if(this.isInCoordenates(coords)){
                                    valid=true;
                                    side=order[x];
                                }
                                break;
                            case 'bottom-left'://bien
                                coords={
                                    left:popup.left-60,
                                    right:popup.left+((popup.width+34)-60),
                                    top:popup.top-((popup.height+50)+20),
                                    bottom:popup.top-20
                                };
                                $("#area").css({top:coords.top+'px',left:coords.left+'px',height:(popup.height+50)+'px',width:(popup.width+34)+'px',display:'','z-index':50000})
                                if(this.isInCoordenates(coords)){
                                    valid=true;
                                    side=order[x];
                                }
                                break;
                            case 'left-top'://bien
                                coords={
                                    left:popup.left+15,
                                    right:(popup.left+(popup.width+34))+15,
                                    top:popup.top-35,
                                    bottom:(popup.top-35)+(popup.height+50)
                                };
                               $("#area").css({top:coords.top+'px',left:coords.left+'px',height:(popup.height+50)+'px',width:(popup.width+34)+'px',display:'','z-index':50000})
                                if(this.isInCoordenates(coords)){
                                    valid=true;
                                    side=order[x];
                                }
                                break;
                            case 'left-bottom'://bien
                                coords={
                                    left:popup.left+15,
                                    right:(popup.left+(popup.width+34))+15,
                                    top:(popup.top-(popup.height+50)+35),
                                    bottom:popup.top+35
                                };
                               $("#area").css({top:coords.top+'px',left:coords.left+'px',height:(popup.height+50)+'px',width:(popup.width+34)+'px',display:'','z-index':50000})
                                if(this.isInCoordenates(coords)){
                                    valid=true;
                                    side=order[x];
                                }
                                break;
                            case 'right-top'://bien
                                coords={
                                    left:popup.left-((popup.width+34)+40),
                                    right:popup.left-40,
                                    top:popup.top-35,
                                    bottom:(popup.top-35)+(popup.height+50)
                                };
                               $("#area").css({top:coords.top+'px',left:coords.left+'px',height:(popup.height+50)+'px',width:(popup.width+34)+'px',display:'','z-index':50000})
                                if(this.isInCoordenates(coords)){
                                    valid=true;
                                    side=order[x];
                                }
                                break;
                            case 'right-bottom':
                                coords={
                                    left:popup.left-((popup.width+34)+40),
                                    right:popup.left-40,
                                    top:(popup.top+35)-(popup.height+50),
                                    bottom:popup.top+35
                                };
                                $("#area").css({top:coords.top+'px',left:coords.left+'px',height:(popup.height+50)+'px',width:(popup.width+34)+'px',display:'','z-index':50000})
                                if(this.isInCoordenates(coords)){
                                    valid=true;
                                    side=order[x];
                                }
                                break;
                        }
                        if(valid){
                            break;
                        }
                        
                    }
                    //$("#"+id+'_popup')
                    $("#"+ this.data.popup.id)
                    .addClass('PopupElementItem ' + side)
                    .css({top:coords.top+'px',left:coords.left+'px'});
                    this.data.popup.corner=side;
                },
                clearTimer:function(){
                    var settings = this.options;
                    if(settings.clock){
                        clearTimeout(settings.clock);
                    }
                },
                defineTimer:function(){
                   var obj=this; 
                   var settings = this.options;
                   this.clearTimer();
                   settings.clock = null;
                   settings.clock = setTimeout(function(){obj.hide()},4000);
                },
                defineProperties:function(){
                    var settings = this.options;
                    this.setValues();
                    this.hideAllSides();
                    this.showPermitedSide();
                },
                show:function(){
                    var obj = this;
                    var settings = this.options;
                    var effect ='';
                    var selectedEffect='fade';
                    
                   // var callback = function(){};
                    //$('#'+this.data.popup.id).show( selectedEffect, {}, 0, callback );
                    
                    $('#'+this.data.popup.id).css({display:''});
                    
                    var idItem = this.data.popup.id;
                    if(settings.timer!=null){
                        setTimeout(function(){
                            $('#'+idItem).css({display:'none'});
                        },settings.timer);
                    }
                },
                
                hide : function(){
                    var obj=this;
                    this.clearTimer();
                    var settings = obj.options;
                    $('#'+this.data.popup.id).hide();
                    
                    if(settings.events){
                        if(settings.events.onMouseOut){
                            settings.events.onMouseOut();
                        }
                    }
                },
                buildCloud : function(){
                    var obj = this;
                    var settings = this.options;
                    var id = this.element.attr('id')+'_popup';
                    if($("#"+id).attr('id')){
                    }else{
                        var popup = '<div id="'+id+'" class="'+'triangle-border'+'" style="'+'position:absolute;z-index:4000;'+'">'+
                                        '<div align="center" class="titleOL">'+settings.title+'</div>'+
                                        '<div align="center" class="contOL">'+settings.text+'</div>'+
                                        ((settings.btnClose)?'<div class="popup_close dinamicPanel-sprite dinamicPanel-close-short"></div>':'')+
                                    '</div>';
                        this.data.popup.id=id;
                        $("#"+settings.root).append(popup);
                    }
                },
                
                _init:function(){
                         
                },
                
                updateTitle:function(a){
                    //$('#'+this.data.popup.id + ' .titleOL').html(a);
                },
                updateContent:function(a){
                    //$('#'+this.data.popup.id + ' .contOL').html(a);
                    this.defineProperties();
                    this.show();
                },
                
                events:function(){
                    var obj=this;
                    var settings = obj.options;
                    var popup = $("#"+this.data.popup.id);
                     if(settings.showOn){    
                        popup.on({
                            mouseenter:function(){
                                //console.log('entre')
                                obj.clearTimer();
                            },
                            mouseleave:function(){
                                //console.log('sali')
                                obj.defineTimer();
                            }
                        });
                    }
                    if(settings.btnClose){
                        var obj = this;
                        $('#'+this.data.popup.id+' .popup_close').click(function(){
                           obj.hide();
                        });
                    }
                    if(settings.event){
                        settings.event();
                    }
                },
            
                _create: function() {
                    this.buildCloud();
                    this.defineProperties();
                    this.show();
                    this.events();
                },
            
                _refresh: function(){
                  // trigger a callback/event
                  this._trigger( "change" );
                },
               
                _destroy: function() {
                    this.element.remove();
                },
          /*
                _setOptions: function() {
                  this._superApply( arguments );
                  this._refresh();
                },
       */
                _setOption: function(key, value){
                          this.options[key] = value;
                                    switch(key){
                                            case "title":
                                                    
                                                    this.updateTitle(value);
                                                break;
                                            case "text":
                                                    this.updateContent(value);
                                            break;
                                            case "xy":
                                                    this.options.xy = value;
                                                break;
                                                                
                                    }
                          }
                }
    );
    /**************************************************************************/
    
    (function($){
        $.fn.popup1 = function(options){
                var id = this.attr('id');
                var settings = $.extend({}, $.fn.popup.defaults, options);
                var data={
                    div:{
                        id:id,
                        height:0,
                        width:0
                    },
                    popup:{
                        id:id+'_popup',
                        width:0,
                        height:0,
                        corner:'',
                        top:0,
                        left:0,
                        created:false
                    },
                    limits:{
                        top:0,
                        left:0,
                        right:0,
                        bottom:0
                    },
                    padding:{
                        top:17,
                        left:17,
                        right:17,
                        bottom:17
                    }
                };
                var setValues = function(){
                    var popup = data.popup;
                    var body = $("#map");
                    var div = data.div;
                    var limits = data.limits;
                    var p=$("#"+popup.id);
                    var d=$("#"+div.id);
                    popup.left = settings.xy.x;
                    popup.top = settings.xy.y;
                    popup.height = p.height();
                    popup.width = p.width();
                    div.height = p.height();
                    div.width=p.width();
                    limits.top = 0;
                    limits.left= 0;
                    limits.right = body.width();
                    limits.bottom= body.height()-26;
                    
                }
                var hideAllSides=function(){
                    $("#"+data.popup.id).removeAttr('class');
                };
                var isInCoordenates=function(b){
                    var a = $.extend({}, b);
                    a.left+=40;
                    a.right+=40;
                    a.bottom+=40;
                    a.top+=40;
                    var limits = data.limits;
                    var result = false;
                    if((a.left>=limits.left)&&(a.top>=limits.top)&&(a.right<=limits.right)&&(a.bottom<=limits.bottom)){
                        return true;
                    }
                  return result;
                };
                var showPermitedSide=function(){
                    var popup = data.popup;
                    var side=null;
                    var order = settings.viewOrder;
                    var limit = data.limits;
                    var valid = false;
                    var coords={left:0,right:0,top:0,bottom:0};
                    for(var x in order){
                        switch(order[x]){
                            case 'top-left'://bien
                                coords={
                                    left:popup.left-60,
                                    right:popup.left+popup.width-60,
                                    top:popup.top+20,
                                    bottom:popup.top+popup.height+20
                                };
                                if(isInCoordenates(coords)){
                                    valid=true;
                                    side=order[x];
                                }
                                break;
                            case 'top-right'://bien
                                coords={
                                    left:popup.left-(popup.width-30),
                                    right:popup.left+30,
                                    top:popup.top+20,
                                    bottom:popup.top+popup.height+20
                                };
                                if(isInCoordenates(coords)){
                                    valid=true;
                                    side=order[x];
                                }
                                break;
                            case 'bottom-right'://bien
                                coords={
                                    left:popup.left-(popup.width-30),
                                    right:popup.left+30,
                                    top:popup.top-(popup.height+80),
                                    bottom:popup.top-80
                                };
                                if(isInCoordenates(coords)){
                                    valid=true;
                                    side=order[x];
                                }
                                break;
                            case 'bottom-left'://bien
                                coords={
                                    left:popup.left-60,
                                    right:popup.left+(popup.width-60),
                                    top:popup.top-(popup.height+80),
                                    bottom:popup.top-80
                                };
                                if(isInCoordenates(coords)){
                                    valid=true;
                                    side=order[x];
                                }
                                break;
                            case 'left-top'://bien
                                coords={
                                    left:popup.left+20,
                                    right:popup.left+(popup.width+20),
                                    top:popup.top-40,
                                    bottom:popup.top+(popup.height-40)
                                };
                                if(isInCoordenates(coords)){
                                    valid=true;
                                    side=order[x];
                                }
                                break;
                            case 'left-bottom'://bien
                                coords={
                                    left:popup.left+30,
                                    right:popup.left+(popup.width+30),
                                    top:popup.top-(popup.height+20),
                                    bottom:popup.top-20
                                };
                                if(isInCoordenates(coords)){
                                    valid=true;
                                    side=order[x];
                                }
                                break;
                            case 'right-top'://bien
                                coords={
                                    left:popup.left-(popup.width+80),
                                    right:popup.left+80,
                                    top:popup.top-35,
                                    bottom:popup.top+(popup.height-35)
                                };
                                if(isInCoordenates(coords)){
                                    valid=true;
                                    side=order[x];
                                }
                                break;
                            case 'right-bottom':
                                coords={
                                    left:popup.left-(popup.width+80),
                                    right:popup.left-80,
                                    top:popup.top-(popup.height+20),
                                    bottom:popup.top-20
                                };
                                if(isInCoordenates(coords)){
                                    valid=true;
                                    side=order[x];
                                }
                                break;
                        }
                        if(valid){
                            break;
                        }
                        
                    }
                    $("#"+id+'_popup')
                    .addClass('PopupElementItem ' + side)
                    .css({top:coords.top+'px',left:coords.left+'px'});
                    data.popup.corner=side;
                };
                /*
                var setPosition = function(){
                    switch(cloud.corner){
                        case 'top':
                            var top = item.top+20;
                            var left=(item.left-(cloud.width+32))+62+(item.width/2);
                        break;
                        case 'bottom':
                                var top = item.top-(cloud.height+118)+40;
                                var left=(item.left+(item.width/2))-62;
                            break;
                        case 'left':
                                var top = (item.top-(cloud.height+118));
                                top=(top+(28+cloud.height))+(item.height/2);
                                var left=item.left;
                                if((settings.xy)){
                                    left+=20;
                                    top+=50;
                                }else{
                                    left+=(cloud.width);
                                }
                            break;
                        case 'right':
                                var top = (item.top-(cloud.height+118));
                                top=(top+(28+cloud.height))+(item.height/2);
                                var left=item.left;
                                if(settings.xy){
                                    top+=50;
                                    left-=20;
                                }
                                left-=(cloud.width+62);
                                 
                            break;
                    }
                   $("#"+id+'_popup').css({top:top+'px',left:left+'px'});
                };
                */
                var clearTimer=function(){
                    if(settings.clock){
                        settings.clock.clear();
                    }
                };
                var defineTimer = function(){
                   clearTimer();
                   settings.clock=null;
                   settings.clock = Timer.define(((settings.timer)?settings.timer:4000),hide,true,true);
                   settings.clock.execute();
                };
                var show=function(){
                    //var start = new Date().getTime();
                        
                    setValues();
                    hideAllSides();
                    showPermitedSide();
                    //setPosition();
                    var effect ='';
                    var selectedEffect='fade';
                    
                    var callback = function(){};
                    $('#'+data.popup.id).show( selectedEffect, options, 0, callback );
                    if(settings.showOn){
                        defineTimer();
                    }
                    if((settings.timer!=null)&&(settings.showOn==null)){
                        defineTimer();
                    }
                    if(settings.event){
                        settings.event();
                    }
                    //$('#'+id+'_popup').show();
                   
                        //var end = new Date().getTime();
                        //console.log('popup' + (end-start))
                };
                var addCloseButton=function(){
                    var chain = '<div class="popup_close dinamicPanel-sprite dinamicPanel-close-short"></div>';
                    $('#'+data.popup.id).append(chain);
                    $('#'+data.popup.id+' .popup_close').click(function(){
                        eventOff();
                    });
                };
                var hide = function(){
                    $('#'+data.popup.id).hide();
                    active=false;
                    if(settings.events){
                        if(settings.events.onMouseOut){
                            settings.events.onMouseOut();
                        }
                    }
                };
                var addChain = function(){
                    //var popup=$('<div>',{id:id+'_popup',class:'triangle-border',style:'position:absolute;z-index:49000;'});
                    var popup = '<div id="'+id+'_popup'+'" class="'+'triangle-border'+'" style="'+'position:absolute;z-index:4000;'+'"></div>';
                    $("#"+settings.root).html(popup);
                    /*
                    popup
                    .append($('<div>',{align:'center',class:'titleOL',text:settings.title}))
                    .append($('<div>',{align:'center',class:'contOL',html:settings.text}));
                    */
                    popup = $('#'+data.popup.id);
                    //popup.html('');
                    popup.html('<div align="center" class="titleOL">'+settings.title+'</div>');
                    popup.html('<div align="center" class="contOL">'+settings.text+'</div>');
                    
                    if(settings.showOn){    
                        popup.on({
                            mouseenter:function(){
                                clearTimer();
                            },
                            mouseleave:function(){
                                defineTimer();
                            }
                        });
                    }
                    if(settings.btnClose){
                        addCloseButton();
                    }
                };
                var eventOn = function(){
                    if(!data.popup.created){
                        addChain();
                        data.popup.created=!data.popup.created;
                    }
                    show();
                };
                var eventOff=function(){
                 hide();
                };
                if(settings.showOn){
                    switch(settings.showOn){
                        case 'hover':
                            this.on({
                                mouseenter:eventOn,
                                mouseleave:eventOff
                            });
                            break;
                        case 'click':
                            this.on({
                                click:function(){
                                    active=!active;
                                    if(active){
                                        eventOn();
                                    }else{
                                        eventOff();
                                    }
                                }
                            });
                            break;
                        case 'now':
                            eventOn();
                            break;
                    }
                }else{
                    if (typeof options === 'string') {
                             switch(options){
                                case 'show':
                                    eventOn();
                                    break;
                                case  'hide':
                                    eventOff();
                                    break;
                                case 'destroy':
                                    //var start = new Date().getTime();
                       
                                    //$('#'+data.popup.id).mouseenter();
                                    $("#nodos_popup").remove()
                                    //$('#'+data.popup.id).hide();
                                   
                                    //var end = new Date().getTime();
                                    
                                    //console.log('destroy' + (end-start))
                                    break;
                                case  'clearTimer':
                                    clearTimer();
                                    break;
                            }
                    }else{
                        eventOn();
                    }
                }
        };
        $.fn.popup.defaults = {
            viewOrder:['top-left','top-right','bottom-left','bottom-right','left-top','left-bottom','right-top','right-bottom'],
            timer:null,
            clock:null,
            showOn:null,
            title:'Titulo',
            text:'Sin contenido',
            type:'cloud',
            root:'map',
            event:$.noop,
            xy:null,
            btnClose:false,
            events:{
                onMouseOver:$.noop,
                onMouseOut:$.noop
            }
        }
    }(jQuery));
    
    return{
        add:Popup.add,
        set:Popup.setData,//{title:'',prev:''}
        show:Popup.show,
        clear:Popup.hide,
        resetLimits:Popup.defineLimits,
        defineTimer:Popup.defineTimer,
        timer:Popup.timer,
        setEvent:function(evento){
            Popup.deactivateFeatureSelected= evento;
        }
    }
});