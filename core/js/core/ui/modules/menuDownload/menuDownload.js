define(['tree'],function(tree) {
(function($){
	
	$.widget("mdm6.menuDownload", {
	    id:'menu_download',
	    root:'panel-center',
            options: {
			items:[
				{item:'denue',event:$.noop()},
				{item:'mapa',event:$.noop()}
			],
			mapImage:null
            },
            _create: function(){
		this.buildItems();
		this.events();
            },
	    uploadImage:function(image){
		
		var obj=this;
		$("#"+obj.root +' .baseMapImage').attr('src','img/mapaBase/'+image);
	    },
	    
	    buildItems:function(){
		var obj=this;
		var o = obj.options.items;
		var baselayer = MDM6('getActualBaseLayer');
		var pathImage = 'img/mapaBase/'+tree.baseLayers[baselayer].img;
		var chain='<div id="'+obj.id+'" class="no-print">'+
				'<div class="header">'+
					'<div class="label">Informaci&oacute;n a descargar</div>'+
					'<div class="icon_close"><div class="template_menuDownload_buttons tmd_close"></div></div>'+
				'</div>'+
				'<div class="divisor"></div>'+
				'<div class="content_menu_download">'+
					// '<div class="item_option" option="0">'+
					// 	'<div>'+
					// 		'<div class="option_denue"></div>'+
					// 	'</div>'+
					// 	'<div class="reference">DENUE</div>'+
						
					// '</div>'+
					'<div class="item_option item_map" option="1">'+
						'<div>'+
							'<img class="baseMapImage" style="width:100%;"  src="'+pathImage+'">'+
						'</div>'+
						'<div class="reference">Mapa</div>'+
					'</div>'+
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
				var option = parseInt($(this).attr('option'));
				obj.hide();
				obj.options.items[option].event();
				
			});
		});
	    },
            _init: function(){
		if(this.onlyImage){
			delete this.onlyImage;
		}else{
			this.show();
		}
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
				case "mapImage":
				    this.uploadImage(value);
				    this.onlyImage=true;
				break;
			}
                }
            });
	    
})(jQuery);
});