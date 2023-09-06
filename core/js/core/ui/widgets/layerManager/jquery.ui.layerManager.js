//Autor: Jos� de Jes�s Loera Velasco
//Requiere mouseWheel
 $.widget("custom.layerManager", {
     isMobile:false,
	 autoSlider_bottom:false,
     id:'',
     enableBC:true, //bottom carrucel enabled
     enableRC:true,
     BC_timer:0,
     RC_timer:0,
     currentBase:'B1',
     // default options
     options: {
		 startTheme:null,
         bc_timeCourtain:2500,
         rc_timeCourtain:2500,
         red: 255,
         green: 0,
         blue: 0,
         baseLayers:[],
         layers:[],
         themeLayers:[],
         timeLayers:[],
         //
         baseImgUrl:'img/mapaBase/',
         themeImgUrl:'img/temas/',
         // callbacks
         verSelection:function(id){},
         horSelection:function(id){},
         openLayerSelected:function(){},
         openLayerConf:function(){},
		 openHCarrucel:function(){},
		 closeHCarrucel:function(){},
		 autoOpenBottomCarrucel:false,
		 autoCloseBottomCarrucel:true,
		 autoOpenRightCarrucel:false,
		 onOpenMiniMapBox:function(){},
         onBaseMap:function(){},
		 onTimeBtn:function(){},
         change: null,
         random: null
     },
     setBaseMapComment:function(){
        var obj = this;
        var text = obj.options.baseLayers[obj.currentBase].desc;
        text = (text === undefined)?'':text;
        var nombre = obj.options.baseLayers[obj.currentBase].label;
        nombre = (nombre === undefined)?'':nombre;
        //
        $('#'+obj.id+'_layerManager_btnBaseLayer').attr('alt',text).attr('title',text);
        $('#'+obj.id+'_layerManager_baseMapBox').attr('alt',text).attr('title',text);
        
        //nombres
        $('#'+obj.id+'_layerManager_baseMapBox').html(nombre)
        $('#'+obj.id+'_layerManager_btnBaseLayer div').html(nombre);
     },
	 getCurrentBaseMap:function(){
		var obj = this;	 
		return obj.currentBase;
	 },
     getBaseLayers:function(){
        var obj = this;
        var list = [];
        var layers = obj.options.layers.groups;
		var baseMap = $.extend({},true,obj.options.baseLayers[obj.currentBase]);
        var baseLayer = baseMap.legendlayer;
        var baseUrlLegend = baseMap.urlLegend;
        for (var x in baseLayer){
            if (baseLayer[x].substr(0,4) == 'img_'){
                var nombre = baseLayer[x].split('.')[0];
                list[nombre] = {position:9999}
            }
        }
        for(var x in layers){
            var lgroup = layers[x].layers;
            for (var i in baseLayer){
                var slayer = lgroup[baseLayer[i]];
                if (!(slayer === undefined)){
					var tlayer = {layer:slayer};					
					if (!(baseUrlLegend === undefined))
						  tlayer.urlLegend = baseUrlLegend;
                    list[baseLayer[i]] = tlayer;
                }
            }
        }
        return list;
     },
     openRightCarrucel:function(){
        var obj = this;
        if (obj.enableRC){
            obj.enableRC = false;
            $('#'+obj.id+'_v_container').animate({width:'230px'},200,function(){
              obj.enableRC = true;
            });
        }
     },
     isRightCarrucelOpen:function(){
        var obj = this;
        return ($('#'+obj.id+'_v_container').width() > 220);
     },
     closeRightCarrucel:function(){
        var obj = this;
        if (obj.enableRC){
            obj.enableRC = false;
            $('#'+obj.id+'_v_container').animate({width:'0px'},200,function(){
            obj.enableRC = true;
            });
        }
     },
     switchRightCarrucel:function(){
        var obj = this;
        if ($('#'+obj.id+'_v_container').width() > 5){
            obj.closeRightCarrucel()}
        else {obj.openRightCarrucel();}
     },
     switchBottomCarrucel:function(){
       var obj = this; 
       if (obj.isBottomCarrucelOpen()){
          obj.closeBottomCarrucel();
       }else{
          obj.openBottomCarrucel();
       }
     },
     isBottomCarrucelOpen:function(){
        var obj = this;
        var height = $('#'+obj.id+'_h_container').height();
        return (height > 30);
     },
     openBottomCarrucel:function(){
        var obj = this;
        if (obj.enableBC){
            obj.enableBC = false;
			obj.options.openHCarrucel(136);
            $('#'+obj.id+'_h_container').animate({height:'136px'},200,function(){
              obj.enableBC = true;
            });
        }
     },
     closeBottomCarrucel:function(){
        var obj = this;
        if (obj.enableBC){
            obj.enableBC = false;
			obj.options.closeHCarrucel(0);
            $('#'+obj.id+'_h_container').animate({height:'28px'},200,function(){
            obj.enableBC = true;
            });
        }
     },
     rightCarrucel:function(){
        var obj = this;
        var data=obj.options.baseLayers;
        var count = 0;for(var x in data){count++;}
        var height = 140*count;
        var cadena = '<div id="'+obj.id+'_v_c_slider" style="top:0px;height:'+height+'px;" class="layerManager_v_c_slider">';
            for (var x in data){
                cadena+= '<div idref="'+x+'" class="layerManager_v_c_item layerManager-box-sizing">';
                cadena+= '  <div class="layerManager-v-dataContainer">';
                cadena+= '      <div class="layerManager_v_c_item_img layerManager-box-sizing layerManager-color-b-80"><img src="'+obj.options.baseImgUrl+data[x].img+'"></div>';
                cadena+= '      <div class="layerManager_v_c_item_label layerManager-box-sizing">'+data[x].label+'</div>';
                cadena+= '  </div>';
                cadena+= '  <div class="layerManager-hoverSelection"></div>';
                cadena+= '</div>';
            }
            cadena+= '</div>'
        $('#'+obj.id+'_v_content').html(cadena);
        
        $('.layerManager_v_c_item').each(function(){
              $(this).click(function(){
                var id = $(this).attr('idref');
                obj.currentBase = id;
                obj.setBaseMapComment();
                obj.options.verSelection(id);
              });
         });
        
     },
     //Custom functions----------------------------------------------------
     bottomCarrucel:function(){
        var obj = this;
        var data=obj.options.themeLayers;
        var count = 0;for(var x in data){count++;}
        var width = 198.3*count;
        var cadena = '<div id="'+obj.id+'_h_c_slider" style="width:'+width+'px" class="layerManager_h_c_slider">';
            for (var x in data){
                cadena+= '<div idref="'+x+'" class="layerManager_h_c_item">';
                cadena+= '  <div class="layerManager-h-dataContainer">';
                cadena+= '      <div idref="'+x+'" class="layerManager_h_c_item_img layerManager-box-sizing layerManager-color-b-80"><img src="'+obj.options.themeImgUrl+data[x].img+'"></div>';
                cadena+= '      <div idref="'+x+'" class="layerManager_h_c_item_label layerManager-box-sizing">'+data[x].label+'</div>';
                cadena+= '  </div>';
                cadena+= '  <div class="layerManager-h-hoverSelection"></div>';
                cadena+= '</div>';
            }
            cadena+= '</div>';
            
        $('#'+obj.id+'_h_content').html(cadena);
        
        $('.layerManager_h_c_item_label').each(function(){
            $(this).click(function(e){
                obj.switchBottomCarrucel();
                e.stopPropagation();  
            });
        });
        
        
        $('.layerManager_h_c_item_img').each(function(){
              $(this).click(function(e){
                var id = $(this).attr('idref');
				obj.selectTheme(id);
                e.stopPropagation();
              });
         });
        
     },
	 selectTheme:function(id){
		var obj = this;
        contenidoTema(id);
		var layers = obj.options.themeLayers[id];
        obj.options.horSelection(layers);    
	 },
     scrollBottomCarrucel:function(value,source){
        var obj = this;
        if (!(value === undefined)){
            var width_s = $('#'+obj.id+'_h_c_slider').width(); //slider
            var width_c = $('#'+obj.id+'_h_content').width(); //slider
            var pos = $('#'+obj.id+'_h_c_slider').position();
            
            var step = (!(source === undefined))?value*25:value;
            var diferencia = pos.left;
            var dif = (width_s+(pos.left))-width_c;
            if (value > 0){
                diferencia = (pos.left < 0)?(Math.abs(pos.left) > step)?pos.left+step:0:0; 
            }else{
                diferencia = (dif > step)?pos.left+step:pos.left+dif;
                if ((dif+value) <= 180)diferencia = (width_c-width_s);
            }
            $('#'+obj.id+'_h_c_slider').css('left',diferencia+'px');
        }
     },
     scrollRightCarrucel:function(value,source){
        var obj = this;
        if (!(value === undefined)){
            var width_s = $('#'+obj.id+'_v_c_slider').height(); //slider
            var width_c = $('#'+obj.id+'_v_content').height(); //slider
            var pos = $('#'+obj.id+'_v_c_slider').position();
            
            var step = (!(source === undefined))?value*25:value;
            var diferencia = pos.top;
            var dif = (width_s+(pos.top))-width_c;
            if (value > 0){
                diferencia = (pos.top < 0)?(Math.abs(pos.top) > step)?pos.top+step:0:0; 
            }else{
                diferencia = (dif > step)?pos.top+step:pos.top+dif;
                if ((dif+value) <= 140){
					diferencia = width_c-width_s;
				}
            }
            $('#'+obj.id+'_v_c_slider').css('top',diferencia+'px');
        }
     },
     openMiniMapBox:function(){
        var obj = this;
        var ban = $('#'+obj.id+'_miniMap_box').attr('switching');
        if (ban == 'false' || ban === undefined){
            $('#'+obj.id+'_layerManager_collapsedTools').hide();
            $('#'+obj.id+'_miniMap_box').attr('switching',true).removeClass('layerManager-hidde');
            $('#'+obj.id+'_v_container').animate({bottom:'137px'},200,function(){
                
            });
            $('#'+obj.id+'_miniMap_box').animate({height:'135px'},200,function(){
                $('#'+obj.id+'_miniMap_box').attr('switching',false);
				obj.options.onOpenMiniMapBox();
            });
        }
     },
     closeMiniMapBox:function(){
        var obj = this;
        var ban = $('#'+obj.id+'_miniMap_box').attr('switching');
        if (ban == 'false' || ban === undefined){
            $('#'+obj.id+'_miniMap_box').attr('switching',true);
            $('#'+obj.id+'_v_container').animate({bottom:'30px'},200,function(){
            
            });
            $('#'+obj.id+'_miniMap_box').animate({height:'28px'},200,function(){
                $('#'+obj.id+'_miniMap_box').attr('switching',false).addClass('layerManager-hidde');
                $('#'+obj.id+'_layerManager_collapsedTools').show();
            });
        }
     },
	 isOpenMiniMapBox:function(){
		var obj = this;
		var box_h = $('#'+obj.id+'_miniMap_box').height();
        return (box_h > 100);
	 },
	 miniMapBoxHeight:function(){
		var obj = this;
		var box_h = $('#'+obj.id+'_miniMap_box').height();
        return (box_h);
	 },
     switchMiniMapBox:function(){
        var obj = this;
        if (obj.isOpenMiniMapBox()){
            obj.closeMiniMapBox();
        }else{
            obj.openMiniMapBox();
        }
     },
     //Widget Factory------------------------------------------------------
     // the constructor
     _create: function() {
         var obj = this;
         obj.isMobile = $.isMobile;
         obj.id = obj.element.attr('id');
         this.element
         // add a class for theming
         .addClass("custom-layerManager layerManager-border no-print");
         // prevent double click to select text
         //.disableSelection();
         var cadena = '<div id="'+obj.id+'_h_container" class="layerManager-h-container layerManager-shadow-n">';
             cadena+= '     <div id="'+obj.id+'_h_content" class="layerManager_h_content"></div>';
             cadena+= '     <div id="'+obj.id+'_h_btnLeft" class="layerManager_h_btnLeft layerManager-color-b-40"><span class="layerManager-sprite layerManager-icon-arrow-w"></span></div>';
             cadena+= '     <div id="'+obj.id+'_h_btnRight" class="layerManager_h_btnRight layerManager-color-b-40"><span class="layerManager-sprite layerManager-icon-arrow-e"></span></div>';
             cadena+= '</div>';
			 
             cadena+= '<div id="'+obj.id+'_layerManager_btnTime" class="layerManager-timeBtn">';
             cadena+= ' <span class="layerManager-sprite layerManager-iconTime"></span>';
             cadena+= '</div>';
             
             cadena+= '<div id="'+obj.id+'_miniMap_box" class="layerManager-miniMap-box layerManager-border layerManager-shadow-n">';
             cadena+= '     <div id="'+obj.id+'_miniMap" class="layerManager-miniMap layerManager-shadow-inset"></div>';
             
             cadena+= '     <div id="'+obj.id+'_layerManager_btnLayers" class="layerManager-btnLayers">';
             cadena+= '         <span class="layerManager-sprite layerManager-iconEye"></span>';
             cadena+= '     </div>';
             
             cadena+= '     <div id="'+obj.id+'_layerManager_btnLayerConf" class="layerManager-btnLayersConf">';
             cadena+= '         <span class="layerManager-sprite layerManager-iconLayers-m"></span>';
             cadena+= '     </div>';
             
             cadena+= '     <div id="'+obj.id+'_layerManager_btnCollapse" class="layerManager-btnCollapse layerManager_btnCollapse_set">';
             cadena+= '         <span class="layerManager-sprite layerManager-iconCollapse"></span>';
             cadena+= '     </div>';
             
             cadena+= '     <div id="'+obj.id+'_layerManager_btnBaseLayer" class="layerManager-btnBaseLayer layerManager_baseMapBox_set">';
             cadena+= '         <div class="layerManager-btnLayers-selection">Mapa base</div>';
             cadena+= '         <span class="layerManager-sprite layerManager-iconOptions"></span>';
             cadena+= '     </div>';
             cadena+= '</div>';
             
             cadena+= '<div class="layerManager-miniMap-leftLine"></div>';
             
             cadena+= '<div id="'+obj.id+'_layerManager_collapsedTools" style="display:none" class="layerManager-collapsedTools layerManager-shadow-n">';
             cadena+= '     <div id="'+obj.id+'_layerManager_btnCollapse" class="layerManager-btnCollapse_c layerManager_btnCollapse_set">';
             cadena+= '         <span class="layerManager-sprite layerManager-iconCollapse"></span>';
             cadena+= '     </div>';
             cadena+= '     <div id="'+obj.id+'_layerManager_btnLayerConf2" class="layerManager-btnLayersConf_c">';
             cadena+= '         <span class="layerManager-sprite layerManager-iconLayers-m"></span>';
             cadena+= '     </div>';
             cadena+= '     <div id="'+obj.id+'_layerManager_btnLayers2" class="layerManager-btnLayers_c">';
             cadena+= '         <span class="layerManager-sprite layerManager-iconEye"></span>';
             cadena+= '     </div>';
             cadena+= '     <div id="'+obj.id+'_layerManager_baseMapBox" class="layerManager_baseMapBox ui-corner-all layerManager-border layerManager_baseMapBox_set">Mapa base';
             cadena+= '     </div>';
             cadena+= '</div>';
             
             
             var cadena_v = '<div id="'+obj.id+'_v_container" class="layerManager-v-container layerManager-shadow-n ">';
                 cadena_v+= '     <div id="'+obj.id+'_v_content" class="layerManager_v_content"></div>';
                 cadena_v+= '     <div id="'+obj.id+'_v_btnTop" class="layerManager_v_btnTop layerManager-color-b-40"><span class="layerManager-sprite layerManager-icon-arrow-n"></span></div>';
                 cadena_v+= '     <div id="'+obj.id+'_v_btnBottom" class="layerManager_v_btnBottom layerManager-color-b-40 layerManager-box-sizing"><span class="layerManager-sprite layerManager-icon-arrow-s"></span></div>';
                 cadena_v+= '</div>';
                 
         obj.element.html(cadena);
         obj.element.parent().append(cadena_v)
         obj.bottomCarrucel();
         obj.rightCarrucel();
         obj.closeMiniMapBox();
         obj.setBaseMapComment();
         
		 //Autoapertura del carrucel inferior
		 if (!obj.isMobile && obj.options.autoOpenBottomCarrucel){
            obj.element.mouseenter(function(){
				if(!obj.autoSlider_bottom){
				   obj.openBottomCarrucel();
				};
            });
         }
		 
		 //Autoapertura del carrucel derecha
		 if (!obj.isMobile && obj.options.autoOpenRightCarrucel){
			$('#'+obj.id+'_v_container').mouseenter(function(){
               clearTimeout(obj.RC_timer);
            }).mouseleave(function(){
               obj.RC_timer = setTimeout(function(){
                   obj.closeRightCarrucel();
               },obj.options.rc_timeCourtain);
            })
		 }
		 
		 //Autocerrado del carrucel inferior
		 var autoCloseBottom = obj.options.autoOpenBottomCarrucel || obj.options.autoCloseBottomCarrucel;
		 if (!obj.isMobile && autoCloseBottom){
			obj.element.mouseleave(function(){
				if(!obj.autoSlider_bottom){
				   obj.BC_timer = setTimeout(function(){
					   obj.closeBottomCarrucel();
				   },obj.options.bc_timeCourtain);
				}
            }).mouseenter(function(){
				if(!obj.autoSlider_bottom){
				   clearTimeout(obj.BC_timer);
				};
            });
         }
		 
         
		 if (!obj.isMobile && obj.options.autoOpenBottomCarrucel)
			$('.layerManager_sliderControl').fadeIn();
		 
         //capas base
         $('.layerManager_baseMapBox_set').each(function(){
            $(this).click(function(e){
              obj.switchRightCarrucel();
              e.stopPropagation();
            });
         });
         //Collapse
         $('.layerManager_btnCollapse_set').each(function(){
            $(this).click(function(e){
              obj.switchMiniMapBox();
              e.stopPropagation();
            });
         });
         $('#'+obj.id+'_layerManager-btnCollapse_c').click(function(e){
              obj.switchMiniMapBox();
              e.stopPropagation();
         });
         
         $('#'+obj.id+'_h_container').bind('mousewheel',function(e,delta){
            obj.scrollBottomCarrucel(delta,'wheel');
            e.stopPropagation();
         });
         
         $('#'+obj.id+'_v_container').bind('mousewheel',function(e,delta){
            obj.scrollRightCarrucel(delta,'wheel');
            e.stopPropagation();
         });
         
         $('#'+obj.id+'_h_btnLeft').click(function(){
              obj.scrollBottomCarrucel(180); 
         });
         $('#'+obj.id+'_h_btnRight').click(function(){
              obj.scrollBottomCarrucel(-180); 
         });
         $('#'+obj.id+'_v_btnTop').click(function(){
              obj.scrollRightCarrucel(140); 
         });
         $('#'+obj.id+'_v_btnBottom').click(function(){
              obj.scrollRightCarrucel(-140); 
         });
         
         $('#'+obj.id+'_layerManager_btnLayerConf').click(function(){
			obj.closeMiniMapBox();
            obj.options.openLayerConf();           
         });
         $('#'+obj.id+'_layerManager_btnLayerConf2').click(function(){
			obj.closeMiniMapBox();
            obj.options.openLayerConf();           
         });
        $('#'+obj.id+'_layerManager_btnLayers').click(function(){
			obj.options.openLayerSelected();           
        });
        $('#'+obj.id+'_layerManager_btnLayers2').click(function(){
			var empty = $(this).attr('empty');
			if (!empty || empty == 'false')
				obj.options.openLayerSelected();           
        });
        $('#'+obj.id+'_layerManager_btnTime').click(function(){
			obj.options.onTimeBtn();
		});
         //Eventos de mapas base
         
		 if(obj.options.startTheme){
			setTimeout(function(){
				obj.selectTheme(obj.options.startTheme);
			},1000);
		 }
		 
		 
         setTimeout(function(){
           // obj.scrollRightCarrucel(-3000);
         },200);
         this._refresh();
     },
     
	 //set Slider Control
	 autoSliderBottom:function(ban){
		 	var obj = this;
			obj.autoSlider_bottom = ban;
	 },
     // called when created, and later when changing options
     _refresh: function() {
         // trigger a callback/event
         this._trigger("change");
     },
     // events bound via _on are removed automatically
     // revert other modifications here
     _destroy: function() {
         // remove generated elements
         $('#'+obj.id+'_v_container').remove();
         this.changer.remove();
         this.element.removeClass("custom-layerManager").enableSelection().css("background-color", "transparent");
     },
     // _setOptions is called with a hash of all options that are changing
     // always refresh when changing options
     _setOptions: function() {
         // _super and _superApply handle keeping the right this-context
         this._superApply(arguments);
         this._refresh();
     },
     // _setOption is called for each individual option that is changing
     _setOption: function(key, value) {
         // prevent invalid color values
         //if (/red|green|blue/.test(key) && (value < 0 || value > 255)) {
         //    return;
         //}
         this._super(key, value);
     }
 });
