
(function($){
	/*
	$.widget("mdm6.networkLink", {
            options: {
		items:[
			{label:'0',sprite:'cementerio',event:$.noop},
			{label:'0',sprite:'cementerio',event:$.noop},
			{label:'0',sprite:'cementerio',event:$.noop},
			{label:'0',sprite:'cementerio',event:$.noop}
		],
		template:'networkLink_template',
		radius:{
			initial:80,
			increment:50
		},
		limit:{
			initial:10,
			increment:4
		}
            },
	    
            _create: function(){
                var obj = this;
		var o = obj.options;
		obj._isOpen = false;
		var id = obj.element.attr('id');
                obj.createNodes({items:o.items});
            },
            _init: function(){
                //if( this.options.autoOpen ){
                    //this.open();
                //}
            },
            defineProperties:function(a){
		var o = this.options;
		var degrees = 360;
		if(!a['step']){
		    var total = a.items.length;
		    a['step']=1;
		    a['radius'] =o.radius.initial;
		    a['limit']=o.limit.initial;
		    a['div']=degrees/a.limit;
		    a['rest']=total-a.limit;
		    a['valid']=true;
		    a['inseted']=0;
		    if(total<a['limit']){
			a['rest']=total;
			a['valid']=false;
		    }
		}else{
		    a['inseted']+=a['limit'];	
		    a['radius']+=o.radius.increment;
		    a['limit']+=o.limit.increment;
		    a['div']=degrees/a.limit;
		    if(a.limit<a.rest){
			a['rest']=a.rest-a.limit;
		    }else{
			a['valid']=false;
		    }
		}
		return a;
	    },
	    createNodes:function(a){
		var o = this.options;
		a = this.defineProperties(a);
		var parentdiv = document.getElementById(this.element.attr('id'));
		var offsetToParentCenter = parseInt(parentdiv.offsetWidth / 2);  //assumes parent is square
		var offsetToChildCenter = 20;
		var totalOffset = offsetToParentCenter - offsetToChildCenter;
		var limite = (a.valid)?a.limit+a.inseted:a.items.length;
		var inicio = (a.inseted==0)?1:a.inseted+1;
		var radius = (a.step==1)?o.radius.initial:o.radius.increment;
		var chain ='';
		for (var i = inicio; i <= limite; ++i){
			var item = a.items[i-1];
			var y = Math.sin((a.div * i) * (Math.PI / 180)) * radius;
			var x = Math.cos((a.div * i) * (Math.PI / 180)) * radius;
			y = (y + totalOffset).toString() + "px";
			x = (x + totalOffset).toString() + "px";
			//parentdiv.appendChild(childdiv);
			
			chain+='<div id="malo" style="z-index:50000;position:absolute;top:'+y+';left:'+x+'" class="'+o.template+' cementerio"></div>';
		}
		this.element.append(chain);
		a.step+=1;
		if(a.valid){
		    this.createNodes(a);
		}
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
            */
	    $.widget("mdm6.networkLink", {
            options: {
		items:[
			{label:'0',sprite:'cementerio',event:$.noop},
			{label:'0',sprite:'cementerio',event:$.noop},
			{label:'0',sprite:'cementerio',event:$.noop},
			{label:'0',sprite:'cementerio',event:$.noop}
		],
		template:'networkLink_template',
		radius:{
			initial:80,
			increment:50
		},
		limit:{
			initial:10,
			increment:4
		}
            },
	    
            _create: function(){
                var obj = this;
		var o = obj.options;
		obj._isOpen = false;
		obj._id = obj.element.attr('id');
		obj._nodes={};
		obj._counter=1;
                obj.createNodes({items:o.items});
            },
            _init: function(){
                //if( this.options.autoOpen ){
                    //this.open();
                //}
            },
            defineProperties:function(a){
		if(!a['step']){
			a['step']=1;
			a['radius'] =80;
			a['limit']=10;
			a['div']=360/a.limit;
			a['rest']=a.items-a.limit;
			a['valid']=true;
			if(a.items<a['limit']){
			    a['rest']=a.items;
			    a['valid']=false;
			}
		}else{
		       
			a['radius']+=50;//45
			a['limit']+=4;
			a['div']=360/a.limit;
			if(a.limit<a.rest){
			    a['rest']=a.rest-a.limit;
			}else{
			    a['valid']=false;
			}
		}
		return a;
	    },
	    createNodes:function(a){
		a = this.defineProperties(a);
		var e = this.element;
		var offsetToParentCenter = parseInt(e.width() / 2);  //assumes parent is square
		var offsetToChildCenter = 20;
		var totalOffset = offsetToParentCenter - offsetToChildCenter;
		var limite = (a.valid)?a.limit:a.rest;
		var chain ='';
		for (var i = 1; i <= limite; ++i){
		    var y = Math.sin((a.div * i) * (Math.PI / 180)) * a.radius;
		    var x = Math.cos((a.div * i) * (Math.PI / 180)) * a.radius;
		    var top = (y + totalOffset).toString() + "px";
		    var left = (x + totalOffset).toString() + "px";
		    var idNode = 'nl_'+this._id+this._counter;
		    //chain +='<div id="'+idNode+'" class="networkLink_template cementerio" style="position:absolute;top:'+top+';left:'+left+'"></div>';
		    chain +='<div id="'+idNode+'" class="networkLink_template cementerio" style="position:absolute;top:0px;left:0px;display:none">'+
				'<div style="color:white;position:absolute;bottom: 10px;width:95%;text-align:center;">125</div>'+
			    '</div>';
		    this._nodes[idNode]={left:left,top:top,event:$.noop};
		    this._counter+=1;
		}
		chain +='<div id="root_'+this._id+'" class="networkLink_template root" style="position:absolute;top:0px;left:0px">'+
				'<div style="color:white;position:absolute;bottom: 10px;width:95%;text-align:center;">125</div>'+
			'</div>';
		e.append(chain);
		a.step+=1;
		if(a.valid){
		    this.createNodes(a);
		}
	    },
	    open:function(){
		this._open=true;
		for(var x in this._nodes){
			var id = x;
			var node = this._nodes[x];
			this.animate(id,node);
		}
	    },
	    close:function(){
		this._open=false;
		var node = {left:'0px',top:'0px',event:$.noop};
		for(var x in this._nodes){
			var id = x;
			this.animate(id,node);
		}
	    },
	    animate:function(id,node){
		if(this._open){
			$("#"+id).fadeIn().animate({
				left:node.left,
				top:node.top
			},400,'easeInOutQuint',function(){
			});
		}else{
			$("#"+id).animate({
				left:node.left,
				top:node.top
			},500,'easeInOutQuint',function(){
				$(this).fadeOut();
			});
		}
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
})(jQuery);
