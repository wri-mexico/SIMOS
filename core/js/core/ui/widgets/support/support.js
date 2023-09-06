
(function($){
	
	$.widget("mdm6.support", {
	    clock:null,
	    visible:false,
	    infoPhoneVisible:false,
	    id:'popup_support',
            options: {
		template:'template_support',
		pefixTemplate:'ts_',
                items:[
			{label:'Orientaci&oacute;n telef&oacute;nica',description:'01 800 111 46 34',icon:'phone'},
			{label:'Chat uno a uno',url:'http://desarrollowww.inegi.org.mx/inegi/chat/#top',icon:'chat'},
			{label:'Atenci&oacute;n a usuarios',url:'http://www.inegi.org.mx/sistemas/buzon/buzon.aspx?c=2652&s=inegi',icon:'email'},
			{label:'Twitter INEGI Informa',url:'http://twitter.com/inegi_informa',icon:'twitter'},
			{label:'INEGI en Facebook',url:'http://www.facebook.com/pages/INEGI-Informa/180299958681029',icon:'facebook'},
			{label:'Manual del usuario',url:'docs/musua_mdmlinea.pdf',icon:'manual'}
		]
            },
	    
            _create: function(){
		var items = this.getItems();
                this.buildBubble(items);
		this.events();
            },
	    getInfoPhones:function(){
		var chain='<div class="phones">'+
					'<div class="headerPhones">Nacional sin costo</div>'+
					'<div>01 800 111 46 34</div>'+
					'<div class="margintop headerPhones">Internacional</div>'+
					'<div>(c&oacute;digo internacional)+(52)+(449) 910 53 00</div>'+
					'<div style="margin-bottom:10px">Ext. 5301</div>'+
			  '</div>';
		return chain;
	    },
	    getItems:function(){
		var obj=this;
		var o = obj.options;
		var chain='';
		for(var x in o.items){
			var i = o.items[x];
			var extra = (i.icon=='phone')?obj.getInfoPhones():'';
			chain+='<div>'+
					'<div class="icon_support"><div class="'+o.template+' '+o.pefixTemplate+i.icon+'"></div></div>'+
					'<div class="label_support item_'+i.icon+'">'+
						((i.url)?
						 '<a  href="'+i.url+'" target="_blank">'+i.label+'</a>'
						 :
						 '<a>'+i.label+'</a>'
						)+
						
					'</div>'+
					extra+
				 
				'</div>';
		}
		return chain;
	    },
	    clearClock:function(){
		obj=this;
		if(obj.clock){
			clearTimeout(obj.clock);
		}
	    },
	    defineClock:function(){
		var obj=this;
		obj.clearClock();
		obj.clock=setTimeout(function(){
			obj.hide();	
		},5000);
	    },
	    buildBubble:function(items){
		var  obj=this;
		var o = obj.options;
		var chain = '<div id="'+obj.id+'" class="PopupElementItem top-right-support" style="position:absolute;z-index:2000;" class="triangle-border">'+
                                    '<div align="center" class="contOL">'+items+'</div>'+
                        '</div>';
		$('body').append(chain);
	    },
	    display:function(){
		var obj = this;
		if(obj.visible){
			obj.clearClock();
			obj.hide();
		}else{
			obj.defineClock();
			obj.show();
		}
	    },
	    events:function(){
		var obj=this;
		var o = this.options;
		$('.phones').hide();
		
		var idIcon = 'mdmToolBar_contact'
		$("#"+obj.id).css({top:93+'px',right:5+'px'});
		$("#"+idIcon+",#"+obj.id).mouseenter(function(){
			obj.clearClock();
		
		}).mouseleave(function(){
			obj.defineClock();
		});
		$("#"+obj.id+" .item_phone").click(function(){
			if(obj.infoPhoneVisible){
				obj.hideInfoPhone();
			}else{
				obj.showInfoPhone();
			}
		});
	    },
            _init: function(){
                this.display();
            },
            
            show: function(){
                $("#"+this.id).show();
		this.visible=true;
               
            },
            hide: function(){
		$("#"+this.id).hide();
                this.visible=false;
            },
	    showInfoPhone:function(){
		$(".phones").show();
		this.infoPhoneVisible=true;
	    },
	    hideInfoPhone:function(){
		$(".phones").hide();
		this.infoPhoneVisible=false;
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