
(function($){
	var panels=[];
	var enable=false;
	$.fn.togglePanels = function(btn) {
			var action = (enable)?'show':'hide';
			for(var x in panels){
				$("#"+panels[x]).panel(action);
			}
			enable=!enable;
			setTimeout(function(){btn.show();MDM6('updateSize');},650);
	};
	var evento = function(){
		$("#panel-center").append('<div class="toggle_panels"><div class="panel_plantilla pleg"></div></div>');
		$(".toggle_panels").click(function(){
				var btn = $(this);
				btn.hide();
				var clases = ['pleg','repleg'];
				if(enable){
					clases[0]='repleg';
					clases[1]='pleg';
				}
				$(this).children().removeClass(clases[0]).addClass(clases[1]);
				$.fn.togglePanels(btn);
				
		}).hide();
	};
	setTimeout(function(){evento()},1000);	
	$.widget("mdm6.panel", {
            options: {
                type: 'static',//overlay
                width:'100%',
                position:'left',
                height:'100%',
                animation:true,
                title:'titulo',
                map:'middle',
                autoOpen:false,
                effect:'slide',
                timeEffect:600,
		content:'',
		fullSize:true,
		load:$.noop,
                id:'',
		ajustMap:false,
		Map:null,
		internals:[],
		externals:[]
            },
            _create: function(){
                var o = this.options;
                this._isOpen = o.autoOpen;
		this.subpanelActive={internal:null,external:null};
                this._enable=true;
                this.id = $(this.element).attr('id');
                this._pleg = (o.type=='static')?{id:null,size:0}:{id:o.id+'_pleg',size:25};
                $.mdm6.panel.instances.push(this.element);
                var attribute;
                var mapSide;
                switch(o.position){
                    case 'left':
                        attribute='width';
                        break;
                    case 'right':
                        attribute='width';
                        mapSide = '';
                        break;
                    default:
                        attribute='height';
                        break;
                }
                var section = $("#"+this.id);
                var root = $("#"+o.map);
                var size = o[attribute];
                size = (parseFloat(size.replace('px')))+this._pleg.size;
                section.css(attribute,size+'px');
                var pleg = null;
                if(this._pleg.size>0){
		    var pleg = '<div class="'+'custom-panel-pleg-'+o.position+'"><div class="container"><div class="icon"><div class="panel_plantilla pleg_'+o.position+'"></div></div><div class="title" align="center"><div>'+o.title+'</div></div></div></div>';
                    //var pleg = $('<div>',{class:'custom-panel-pleg-'+o.position});
                    section.append(pleg);
		    pleg=$('.custom-panel-pleg-'+o.position);
                }
                var panel = $('<div>',{id:this.id+'_panel-'+o.position});
                panel.css({width:o.width,height:o.height});
                panel.css(attribute,(size-this._pleg.size)+'px');              
                panel.addClass('custom-panel');
		
		if(o.position=='bottom'){
			var positionRight = (o.fullSize)?'0px':'232px';
			//panel.css('right',positionRight);
			//pleg.css('right',positionRight);
			$("#panel-bottom").css('right',positionRight);
			$( "#mdm6Layers").unbind( "mouseenter" );
			//$("#"+this.id).height('25px');
		}
                
                if(o.type=='static'){
			if(o.position!='bottom'){
				root.css(o.position,size+'px');
			}else{
				this.redefineMap(true);
			}
                }else{
		     if(o.position!='bottom'){
			root.css(o.position,(this._pleg.size)+'px');
			$("#"+this.id).height('25px');
		     }
                }
                var titleBar = '';// $('<div>',{id:this.id+'_title',class:'custom-panel-title'});
                //var container = $('<div>',{id:this.id+'_container',class:'custom-panel-container'});
		var container = '<div id="'+this.id+'_container'+'" class="'+'custom-panel-container'+'"></div>';
                panel.append(titleBar);
                panel.append(container);
                section.append(panel);
                if(this._pleg.size>0){
                    section.append(pleg);
                    panel.css(o.position,this._pleg.size+'px');
                }
                if((!o.autoOpen)&&(o.type!='static')){
                    panel.hide();
                }
                var obj = this;
                if(pleg){
                    pleg.click(function(){

                        if(obj._enable){
                            obj.disable();
                            if(obj.isOpen()){
                                obj.hide();
                            }else{
                               obj.show();
                            }
                        }
                    });
                }
		$("#"+this.id+'_container').html(this.options.content);
		var zIndex=(o.position=='bottom')?1:3000;
		if((this.options.type!='static')||(this.options.position=='bottom')){
			zIndex=2900;	
		}
		$("#"+this.id).css('z-index',zIndex);
                this.options.load();
		this.onLoad();
		panels.push(this.id);
		
		//add aditional panels
		this.addAditional(panel,o,true);
		this.addAditional(panel,o,false);
            },
            _init: function(){
                //if( this.options.autoOpen ){
                    //this.open();
                //}
            },
            setData:function(html,event){
		$("#"+this.id+'_container').html(html);
		if(event){
			event();
		}
	    },
	    addAditional:function(panel,o,internal){
		var panels;
		var name ='internal';
		if(internal){
			panels = o.internals;
		}else{
			panels=o.externals;
			name='external';
		}
		//this.addAditional(o.position,o.externals,false,attribute);
		var chain='';
		var ids='';
		for(var x in panels){
			var id=o.position+'_'+panels[x].id+'_'+name;
			if(ids==''){
				ids+='#'+id;
			}else{
				ids+=',#'+id;
			}
			var estilo='';
			if(internal){
				var segment = panels[x].content;
			}else{
				ids+=',#'+id+'_item';
				var segment = '<div id="'+id+'_item" class="item" style="position:absolute;top:0px;width:'+o.width+';right:'+o.width+';bottom:0px;background:white"><div style="position:absolute;top:5px;left:5px;right:5px;bottom:5px;">'+panels[x].content+'</div></div>';
				estilo='left'+':-'+o.width+';z-index:-1';
			}
			chain+='<div id="'+id+'" style="'+estilo+'" class="custom-panel-container-'+((internal)?'internal':'external')+'">'+segment+'</div>';
			
			//<div id="right_1_external" class="custom-panel-container" style="left:-300px"><div style="position:absolute;top:0px;width:300px;right:300px;bottom:0px;background:green">otra informacion</div></div>
		}
		panel.append(chain);
		$(ids).hide();
	    },
            enable:function(){
                this._enable = true;
            },
            disable:function(){
                this._enable = false;
            },
            onLoad:function(){
                this._trigger("onLoad");  
            },
	    redefineMap:function(show){
		var o = this.options;
		var root = 'panel-center';
		if(o.position=='bottom'){
			var value = (show)?o.height:'0';
			value = parseFloat(value.replace('px',''));
			if(o.type=='static'){
				value=value-30
			}
			$("#"+root).css(o.position,value+'px');
			
		}else{
			var value = (show)?o.width:'0';
			root = o.map;
			var params = {};
			value = parseFloat(value.replace('px',''));
			params[o.position]=value+"px";
			$("#"+root).animate(params, 600);
		}
		MDM6('updateSize');
	    },
	    showInternal:function(id){
		var obj = this;
                var o = this.options;
		if((obj.subpanelActive.internal!=null)&&(obj.subpanelActive.internal!=id)){
			var active = obj.subpanelActive.internal;
			obj.hideInternal(active,false);
		}
		var subpanel = $("#"+o.position+'_'+id+'_internal');
		var direction = (o.position=='bottom')?'down':o.position;
		subpanel.show(o.effect,{direction:direction},o.timeEffect,function(){
			obj.enable();
			obj.subpanelActive.internal=id;
		});
                //this.changeStatusOpen();
		this._isOpen = true;
	    },
	    hideInternal:function(id,reset){
		reset = (reset)?reset:true;
		var obj = this;
                var o = this.options;
		var subpanel = $("#"+o.position+'_'+id+'_internal');
		var direction = (o.position=='bottom')?'down':o.position;
                subpanel.hide(o.effect,{direction:direction},o.timeEffect,function(){
			obj.enable();
			if(reset){
				obj.subpanelActive.internal=null;
			}
		});
                //this.changeStatusOpen();
		this._isOpen = false;
	    },
	    showExternal:function(id){
		//$("#right_1_external_item").hide('slide',{direction:'right'},600,function(){$("#right_1_external").hide()});
		var obj = this;
                var o = this.options;
		if((obj.subpanelActive.external!=null)&&(obj.subpanelActive.external!=id)){
			var active = obj.subpanelActive.external;
			obj.hideExternal(active,false);
		}
		var idElement ="#"+o.position+'_'+id+'_external';
		$(idElement).show();
		var subpanel = $(idElement+'_item');
		var direction = (o.position=='bottom')?'down':o.position;
		subpanel.show(o.effect,{direction:direction},o.timeEffect,function(){
			obj.enable();
			obj.subpanelActive.external=id;
		});
                //this.changeStatusOpen();
		this._isOpen = true;
	    },
	    hideExternal:function(id,reset){
		reset = (reset)?reset:true;
		var obj = this;
                var o = this.options;
		var idElement ="#"+o.position+'_'+id+'_external';
		var subpanel = $(idElement+'_item');
		var direction = (o.position=='bottom')?'down':o.position;
                subpanel.hide(o.effect,{direction:direction},o.timeEffect,function(){
			obj.enable();
			if(reset){
				obj.subpanelActive.external=null;
			}
			$(idElement).hide();
		});
                //this.changeStatusOpen();
		this._isOpen = false;
	    },
            show: function(){
                var obj = this;
                var o = this.options;
                var panel = $("#"+this.id+'_panel-'+o.position);
		var direction = (o.position=='bottom')?'down':o.position;
                if(o.position=='bottom'){
			$("#"+this.id).show(o.effect,{direction:direction},o.timeEffect);
		}
		if(o.position!='bottom'){
			$("#"+obj.id).css('width',o.width);
		}
		panel.show(o.effect,{direction:direction},o.timeEffect,function(){
			obj.enable();
			if(o.position=='bottom'){
				obj.redefineMap(true);
			}
            iconItem=$('.custom-panel-pleg-'+o.position).children().children('div:first').children();
            iconItem.removeClass('pleg_'+ o.position);
            iconItem.addClass('repleg_'+ o.position);
		});
		
                this._trigger("onShow");
                //this.changeStatusOpen();
		this._isOpen = true;
		if(o.position!='bottom'){
				obj.redefineMap(true);
		}
            },
            hide: function(){
                var obj = this;
                var o = this.options;
		var id = this.id;
                var panel = $("#"+this.id+'_panel-'+o.position);
		var direction = (o.position=='bottom')?'down':o.position;
                panel.hide(o.effect,{direction:direction},o.timeEffect,function(){
			obj.enable();

			if(o.position=='bottom'){
				if(o.type=='static'){
					//$("#"+panel).css(o.direction,'0px');
				}else{
					$("#"+id).css('height','30px');
				}
			}else{
				$("#"+obj.id).css('width','0px');
			}

            iconItem=$('.custom-panel-pleg-'+o.position).children().children('div:first').children();
            iconItem.removeClass('repleg_'+ o.position);
            iconItem.addClass('pleg_'+ o.position);
		});
		if(o.position=='bottom'){
			if(o.type=='static'){
				$("#"+this.id).hide(o.effect,{direction:direction},o.timeEffect);
			}
		}
                this._trigger("onHide");
                //this.changeStatusOpen();
		this._isOpen = false;
		this.redefineMap(false);
            },
            changeStatusOpen:function(){
                this._isOpen=!this._isOpen;
            },
            isOpen: function(){
                return this._isOpen;
            },
            open:function(){
                if(this.options.type!='static'){
                    this.show();
                }
            },
            close:function(){
                if(this.options.type!='static'){
                    this.hide();
                }
            },
            container:function(a){
              return this.id+'_container';
            },
            title:function(){
              return this.id+'_title';
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
                    case "something":
    
                    break;
                    }
                }
            });
            
            $.extend($.mdm6.panel, {
                instances: []
            });
	    
})(jQuery);