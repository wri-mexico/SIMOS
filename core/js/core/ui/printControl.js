define(function(){
	var sources, layerTree, mapPointer = null;
	var legends = function(){return [];};
	return{
		init:function(dataSources,tree,map){
			var obj = this;
			
			sources = dataSources;
			layerTree = tree;
			mapPointer = map;
			
			if (window.matchMedia) {
				var mediaQueryList = window.matchMedia('print');
				mediaQueryList.addListener(function(mql) {
					if (mql.matches) {
						//beforePrint();
					} else {
						obj.printEnd();
					}
				});
			}
		},
		//Metodos de impresion predefinidos---------------------------------
		printHtml:function(html){
			var obj = this;
			
			/*
			$('#printContainer').remove();
			$('body').append('<div id="printContainer" class="print"><iframe id="printHtml"></iframe></div>');
			$('#printHtml').contents().find('body').append(html);
			document.getElementById("printHtml").contentWindow.print();	
			*/
			//$('#map').removeClass('no-print');
			obj.injectStructure(html);
			//obj.printData();
			obj.printEvent();
		},
		printMap:function(){
			var obj = this;
			if (mapPointer){
				$('#map').removeClass('no-print');
				
				cadena = obj.getViewDataAsDom();
				cadena+= obj.getFeaturesAsDom();
				cadena+= obj.getLegendsAsDom();
				cadena+= obj.getQrLinkAsDom();	
				
				obj.injectStructure(cadena);
				obj.printEvent();
			}
		},
		//-------------------------------------------------------------------
		getCurrentFeatures:function(){
			return {};	
		},
		getLegends:function(func){
			if($.isFunction(func)){
				legends = func;	
			}
			return legends();
		},
		printEnd:function(){
			var obj = this;	
			//$('#printContainer').remove();
			obj.deleteStructure();
		},
		injectStructure:function(content){
			var obj = this;
			$('#printContainer').remove();
			$('body').append(
				'<div id="printContainer" class="print">'+
				' 	<div id="print_page_break" class="print-page-break"></div>'+
				'	<div id="printArea">'+content+
				'	</div>'+
				'</div>'
			);
			
			$('#printArea').html(content);
		},
		deleteStructure:function(){
			//$('#printContainer').remove();
		},
		printData:function(){
			$('#printContainer').prepend('<div style="width:100%;height:55px;"></div>')
			$('#print_page_break').remove();
			$('#map').addClass('no-print');
		},
		printEvent:function(){
			var obj = this;
			obj.afterImageLoad(function(){
					window.print();
			});
		},
		getViewDataAsDom:function(){
			var obj = this;
			var map = mapPointer;
			var pointBot = map.transformToGeographic(map.getExtent().lat[0],map.getExtent().lat[1]);
			var pointTop = map.transformToGeographic(map.getExtent().lon[0],map.getExtent().lon[1]);
			
			var x1 = pointTop.lon,
			    y1 = pointTop.lat,
				x2 = pointBot.lon,
				y2 = pointBot.lat;
			
			var topLeft = x1+', '+y1,
				topRight = x2+', '+y1,
				botRight = x2+', '+y2,
				botLeft = x1+', '+y2;
				
			var scale = '1 : '+map.getScale().formatMoney(0, ' ', ' ');

			var cadena = '<div class="print-title">'+sources.proyAlias+'</div>';
				cadena+= '<div class="print-title2 print-top-border">Datos de la vista</div>';
				
				cadena+= '<div class="print-info-block width-50"><label>Escala:</label><label>'+scale+'</label></div>';
				
				cadena+= '<div class="print-title3">Coordenadas</div>';
				cadena+= '<div class="print-info-block width-50"><label>Superior Izquierda:</label><label>'+topLeft+'</label></div>';
				cadena+= '<div class="print-info-block width-50"><label>Superior Derecha:</label><label>'+topRight+'</label></div>';
				cadena+= '<div class="print-info-block width-50"><label>Inferior Izquierda:</label><label>'+botLeft+'</label></div>';
				cadena+= '<div class="print-info-block width-50"><label>Inferior Derecha:</label><label>'+botRight+'</label></div>';
			
			return cadena;
		},
		getFeaturesAsDom:function(){
			var obj = this;
			var features = obj.getCurrentFeatures();
			var geos = features.geo;
			var measures = features.measures;
			var cadena = '';
				if (geos.length > 0 && features.currentTab == 'geo'){
					cadena+= '<div class="print-title2 print-top-border">Geometr&iacute;as</div>';
					for (var x in geos){
						var geo = geos[x];
						var value = obj.convertionUnit('metric',geo.data.type,geo.data.measure);
						cadena+= '<div class="print-info-block width-50"><img src="img/print/'+geo.data.type+'Icon.png" class="print-left"/><label>'+geo.data.name+'</label>'+((value)?'<label>'+value+'</label>':'')+'</div>';
					}
				}
				if (measures.length > 0 && features.currentTab == 'measure'){
					cadena+= '<div class="print-title2 print-top-border">Mediciones</div>';
					for (var x in measures){
						var measure = measures[x];
						var value = obj.convertionUnit('metric',measure.data.type,measure.data.measure);
						cadena+= '<div class="print-info-block width-50"><img src="img/print/'+measure.data.type+'Icon.png" class="print-left"/><label>'+measure.data.name+'</label>'+((value)?'<label>'+value+'</label>':'')+'</div>';
					}
				}
			return cadena;
		},
		getQrLinkAsDom:function(){
			var obj = this;
			var cadena = '<div class="print-page-break"></div>';
			cadena+= '<div class="print-title2-right print-top-border">Vis&iacute;tanos en : http://gaia.inegi.org.mx/mdm6/</div>';
			cadena+= '<div id="qrImage" class="qrImage"><img src="img/print/qrMDM.jpg" /></div>';
			return cadena;
		},
		getLegendsAsDom:function(){
			var obj = this;
			var legends = obj.getLegends();
			var cadena = '';
			cadena+= '<div class="print-title2 print-top-border">Leyendas de informaci&oacute;n</div>';
			for(var x in legends){
						cadena+= '<div class="print-image-legend"><img src="'+legends[x]+'"/></div>';	
			}
			return cadena;
		},
		convertionUnit:function(type,poly,value){
            var result = value;
            var label = 'm';
            var post = (poly == 'measureLine' || poly == 'line')?'':'&sup2;';
            var banMetros = (type == 'metric' || type === undefined);
            //var banMetros = (type == 'metric');
            var banCuad = (post != '');
            if (banMetros){
                if (!banCuad){
                    label = (value > 1000)?'km':label;
                    value = (value > 1000)?(value/1000):value;
                }else{
                    label = (value > 1000000)?'km':label;
                    value = (value > 1000000)?(value/1000000):value;
                }
            }else{
                label = 'yr';
                if (!banCuad){
                    value = value*1.0936133;
                    label = (value > 1760)?'mi':label;
                    value = (value > 1760)?(value/1760):value;
                }else{
                    value = value*1.1960;
                    label = (value > 3097600)?'mi':label;
                    value = (value > 3097600)?(value/3097600):value;
                }
            }
			if (value){
				return value.formatMoney(3, '.', ',')+' '+label+post;	
			}else{
				return null;	
			}
            
     	}, 
		afterImageLoad:function(func){
			var $img = $('#printContainer img'),
				totalImg = $img.length;
			
			var waitImgDone = function() {
				totalImg--;
				if (!totalImg){ 
					if($.isFunction(func)){
						func();	
					}
				}
			};
			if(totalImg){
				$('img').each(function() {
					$(this)
						.load(waitImgDone)
						.error(waitImgDone);
				});	
			}else{
				if($.isFunction(func)){
						func();	
					}
			}
		}
	}
})