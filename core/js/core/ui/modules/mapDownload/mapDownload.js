
(function($){
	
	$.widget("mdm6.menuMapDownload", {
	    id:'menu_mapDownload',
	    root:'panel-center',
            options: {
			data:[
				{format:'png'},
				{format:'tiff'},
				{format:'gif'},
				{format:'jpeg'},
				{format:'pdf'}
			]
            },
            _create: function(){
		this.buildItems();
		this.events();
            },
	    getItems:function(){
		var chain='';
		var obj=this;
		var items = obj.options.data;
		for(var x in items){
			var i = items[x];
			chain+='<div class="item_option" format="'+i.format+'">'+
						'<div>'+
							'<div class="template_menu_mapDownload_formats tmmd_'+i.format+'"></div>'+
						'</div>'+
						//'<div class="reference">opc</div>'+
						
				'</div>';
		}
		return chain;
	    },
	    buildItems:function(){
		var obj=this;
		var o = obj.options.items;
		var chain='<div id="'+obj.id+'" class="no-print">'+
				'<div class="header">'+
					'<div class="label">Seleccione el formato a descargar</div>'+
					'<div class="icon_close"><div class="template_menu_mapDownload_buttons tmmd_close"></div></div>'+
				'</div>'+
				'<div class="divisor"></div>'+
				'<div class="content_menu_mapDownload">'+
					obj.getItems()+
				'</div>'+
			  '</div>'
		$("#"+obj.root).append(chain);
	    },
	    events:function(){
		var obj=this;
		$("#"+obj.id +" .icon_close").click(function(){
			obj.hide();
		});
		$("#"+obj.id +" .item_option").each(function(){
			$(this).click(function(){
				var format =$(this).attr('format');
				MDM6('exportMap',format);
				
			});
		});
	    },
            _init: function(){
                this.show();
            },
            
            show: function(){
                $("#"+this.id).show();
		this.visible=true;
               
            },
            hide: function(){
		$("#"+this.id).hide();
                this.visible=false;
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
