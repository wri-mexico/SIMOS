$.widget( "custom.baseMapMini", {
      id:'',
      // default options
      options: {
		imgPath:'img/',
		data:[],
        msg:'',
        align:'',
        distance:0,
		baseSelection:function(id){},
        informame:function(msg){}   
      },
      distancia:function(val){
         var obj = this;
         var align = obj.options.align;
         var dis = (val === undefined)?obj.options.distance:val;
         
         obj.element.css(align,dis+'px');
         
      },
      // the constructor
      _create: function() {
        var obj = this;
        obj.id = obj.element.attr('id');
        
        this.element
          // add a class for theming
          .addClass("custom-baseMapMini no-print").attr('closed',true).attr('enable',true)
          // prevent double click to select text
          .disableSelection();
          
		  var 	cadena = '<div id="'+obj.id+'_selection" class="baseMap-selection"></div>';
		  		cadena+= '<div id="'+obj.id+'_mosaic" class="baseMap-mosaicItems"></div>'
				cadena+= '<div id="'+obj.id+'_label" class="baseMap-selectionLabel">Prueba</div>'
				
		  
          obj.element.html(cadena);
        this._refresh();
      },
 
      // called when created, and later when changing options
      _refresh: function() {
        // trigger a callback/event
		var obj = this;
		var img_sel = $('#'+obj.id+'_selection');
		var img_mosaic = $('#'+obj.id+'_mosaic');
		var list = obj.options.data;
		
		var item_sel = null;
		var idSel = '';
		for (var x in list){
			idSel = x;
			item_sel = list[x];
			break;	
		}
		
		var cadena = '';
			cadena+= '<div id="baseMap_selection" label="'+item_sel.label+'" alt="'+item_sel.label+'" title="'+item_sel.label+'" idref="'+idSel+'" class="baseMap-item-selected">';
			cadena = '  <div class="baseMap-selection-tool"></div>';
			cadena+= '	<img id="baseMap_img_selected" style="width:112px" src="'+obj.options.imgPath+'/'+item_sel.img+'"/>';
			cadena+= '</div>';
			img_sel.html(cadena);
			
			cadena = '';
		
		for (var x in list){
			var item = list[x];	
			var label = item.label;
			var img = item.img;
			cadena+= '<div id="item_mosaic_'+x+'" alt="'+item.label+'" title="'+item.label+'" idref="'+x+'" class="baseMap-item-mosaic">';
			cadena+= '	<img class="baseMap-item-img baseMap-mos-img-short " src="'+obj.options.imgPath+'/'+img+'"/>';
			cadena+= '</div>';
			/*
				type:'Wms',
                label:'Topogr&aacute;fico - INEGI',
                img:'Wms.jpg',		             
                 url:['http://gaiamapas3.inegi.org.mx/mdmCache/service/wms?'],
                layer:'MapaBaseTopografico',
                rights:'&copy; INEGI 2013',
                tiled:true,
				legendlayer:['c100','c101','c102','c102-r','c102m','c103','c109','c110','c111','c112','c200','c201','c202','c203','c206','c300','c301','c302','c310','c311','c354','c762','c793','c795'],
                desc:'REPRESENTACION DE RECURSOS NATURALES Y CULTURALES DEL TERRITORIO NACIONAL A ESCALA 1: 250 000, BASADO EN IMAGENES DE SATELITE DEL  2002 Y TRABAJO DE CAMPO REALIZADO EN 2003'
			*/
		}
		img_mosaic.html(cadena);
		$('.baseMap-selection-tool').click(function(e){
			$('#baseMap_img_selected').click();
		});
		$('#baseMap_img_selected').click(function(e){
			var closed = (obj.element.attr('closed') == 'true');
			var enable = (obj.element.attr('enable') == 'true');
			
			if (enable){
				obj.element.attr('enable','false');
				if(closed){
					obj.element.attr('closed','false');
					$(this).animate({'width':'225px'},500,function(){
						img_mosaic.animate({'width':'112px'},500,function(){
							obj.element.attr('enable','true');	
						});
					});
				}else{
					obj.element.attr('closed','true');
					$(this).animate({'width':'112px'},500,function(){
						img_mosaic.animate({'width':'0px'},500,function(){
							obj.element.attr('enable','true');	
						});
					});
				}
			}
			e.stopPropagation();
		});
		
		$('.baseMap-item-mosaic').each(function(){
			$(this).click(function(e){
				var id = $(this).attr('idref');
				obj.selectItem(id);
				e.stopPropagation();	
			});	
			
		});
		
		obj.selectItem(idSel,false);
		
        this._trigger( "change" );
      },
 	  selectItem:function(id,propagate){
		var obj = this;
		
		if (!propagate)
			obj.options.baseSelection(id);
			
		var objImg = $('.baseMap-item-mosaic[idref='+id+']');
		var item = obj.options.data[id];
		$('#baseMap_img_selected').attr('src',obj.options.imgPath+'/'+item.img);
		objImg.slideUp('fast',function(){
			$('.baseMap-item-mosaic-selected').slideDown('slow').removeClass('baseMap-item-mosaic-selected');			
			$(this).addClass('baseMap-item-mosaic-selected');
		});
		var layers = obj.options.layers;
		var label = item.label;
		$('#baseMap_selection').attr('label',label).attr('alt',label).attr('title',label);
		$('#'+obj.id+'_label').html(label);
	  },
      // events bound via _on are removed automatically
      // revert other modifications here
      _destroy: function() {
        // remove generated elements
        this.changer.remove();
 
        this.element
          .removeClass( "custom-baseMapMini" )
          .enableSelection()
          .css( "background-color", "transparent" );
      },
 
      // _setOptions is called with a hash of all options that are changing
      // always refresh when changing options
      _setOptions: function() {
        // _super and _superApply handle keeping the right this-context
        this._superApply( arguments );
        this._refresh();
      },
 
      // _setOption is called for each individual option that is changing
      _setOption: function( key, value ) {
        this._super( key, value );
      }
    });