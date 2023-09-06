define(function(){
	var dataSources = null;
	var sharedValues = null;
	return{
		shareDialog:function(id){
			var obj = this;
			var ruta = document.location.origin+document.location.pathname+'?s=';
				ruta+= Base64.encode(''+id);
			
			var cadena=  '<div id="mdmShareDialog" title="Compartir">';
				
				cadena+= '	<div id="share_byFB" class="mdmShareBtn shareSprite shareSprite-fb"></div>';
				cadena+= '	<a href="https://twitter.com/share?url='+ruta+'" target="_blank" data-text="Realic&eacute; una consulta en el Mapa Digital de M&eacute;xico en l&iacute;nea, a trav&eacute;s del portal de INEGI y deseo compartirla">';
				cadena+= '		<div id="share_byT" class="mdmShareBtn shareSprite shareSprite-t"></div>';
				cadena+= '	</a>';
				cadena+= '	<div id="share_byEmail" class="mdmShareBtn shareSprite shareSprite-email"></div>';
				cadena+= '	<div style="float:left"><input class="mdmShare-input" id="mdmShareURL" type="text" value="'+ruta+'" readonly="true"></br>';
				cadena+= '	<label>Puede compartir el enlace seleccionando el texto del recuadro y copiandolo (Ctrl + C).</label></div>';
				cadena+= '</div>';
				
			$("#panel-center").append(cadena);
			
			$( "#mdmShareDialog" ).dialog({
				width:500,
				height:185,
				resizable: false,
				closeOnEscape: true,
				close: function(event, ui){
					$(this).dialog('destroy').remove();
				},
				modal: true,
				buttons: {
				   Cerrar: function() {
					  $(this).dialog('close');
				   } 
				}
			});
			$('#mdmShareURL').select();
			$('#share_byEmail').click(function(){
				obj.shareByEmail($('#mdmShareURL').val());
			});
			$('#share_byFB').click(function(){
				if(obj.checkSocialApi('facebook')){
					FB.ui({
					  method: 'feed',
					  link: ruta,
					  caption: 'Mapa digital de M&eacute;xico en l&iacute;nea',
					}, function(response){
						
					});
				}
			});
		},
		getValuesFromShare:function(link,func){
			var obj = this;
			try{
				link = Base64.decode(link);
			}catch(err){
				link = null;	
			}
			
			
			var dataSource = $.extend(true,{},dataSources.share);
			dataSource.url+='/find/'+link;
			
			var errorMessage = function(){
				
				var cadena=  '<div id="mdmShareError" title="Error de vista compartida">';
					cadena+= '	<strong><label>Se encontr&oacute; un error al cargar la vista compartida, se procedera a cargar de forma predeterminada </label></strong>';
					cadena+= '</div>';
				
				$("#panel-center").append(cadena);
				$( "#mdmShareError" ).dialog({
					width:350,
					height:130,
					resizable: false,
					close: function(event, ui){
						$(this).dialog('destroy').remove();
					},
					modal: true
				});
				
				setTimeout(function(){
						var url = document.location.origin+document.location.pathname;
						document.location = url;
				},4500);		
			}
			
			$.ajax(dataSource).done(function(data) {
				if(data && data.response.success){
				   if ($.isFunction(func)){
					   var json = JSON.parse(data.data.json);
					   sharedValues = json;
					   func(json.location);
				   }
				}else{
					errorMessage();
				}
			}).error(function(){
				errorMessage();	
			});
		},
		shareByEmail:function(link){
			var obj = this;
			var share = function(email,name,link,func){
				 var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    			 if(name!= '' && pattern.test(email)){
					var dataSource = $.extend(true,{},dataSources.shareEmail);
						dataSource.data = JSON.stringify({
							url:link,
							mail:email,
							name:name
						});
					$.ajax(dataSource).done(function(data) {
						if($.isFunction(func))
							func();
							
					}).error(function(){
						
					});
				 }else{
					 alert('Verifique que los campos contengan información');
				 }
			}
			
			
			var cadena=  '<div id="mdmShareDialogEmail" title="Compartir por correo">';
				cadena+= '	<label>Nombre</label></br>';
				cadena+= '	<input id="mdmShareName" type="text" value="" placeholder="Quien lo env&iacute;a"><br/><br/>';
				cadena+= '	<label>Correo electr&oacute;nico</label></br>';
				cadena+= '	<input id="mdmShareEmail" type="text" value="" placeholder="Destinatario"><br/>';
				cadena+= '</div>';
				
			$("#panel-center").append(cadena);
			$( "#mdmShareDialogEmail" ).dialog({
				width:350,
				height:175,
				resizable: false,
				closeOnEscape: true,
				close: function(event, ui){
					$(this).dialog('destroy').remove();
				},
				modal: true,
				buttons: {
				   Compartir: function() {
					  var correo = $('#mdmShareEmail').val();
					  var name = $('#mdmShareName').val();
					  share(correo,name,link,function(){
					  	$( "#mdmShareDialogEmail" ).dialog('close');
					  });
				   },
				   Cancelar: function() {
					  $(this).dialog('close');
				   } 
				}
			});
		},
		init:function(map,dataSource){
			var obj = this;
			dataSources = dataSource;
			
			obj.map = map;
			
			var localUrl = require.toUrl("modules");
				localUrl = localUrl.split('?')[0];
				localUrl+='/share/';
			$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'share.css?ver='+mdmVersion}).appendTo('head');
			$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'shareSprite.css?ver='+mdmVersion}).appendTo('head');
			
			obj.checkSocialApi();
		},
		checkSocialApi:function(name){
			var r = false;
			if(name == 'facebook' && FB)
				r = true;
			return r;
		},
		loadShareValues:function(){
			var obj = this;
			if(sharedValues){
				var json = sharedValues;
				var search = json.search;
				var map = json.map;
				var baseMap = json.baseMap;
				var wmsServices = json.wmsServices;
				if(search){
					var type = search.type;
					switch (type){
						case 'search':
							setTimeout(function(){
								$('#mdm6DinamicPanel_inputSearch').val(search.data.text);
								$('#mdm6DinamicPanel_btnSearch').click();
							},1000);
						break;
						case 'identify':
							var lon = search.data.lon;
							var lat = search.data.lat;
							setTimeout(function(){
								obj.map.event.identify({lon:lon,lat:lat});
							},2000);
						break;
					}
				}
				if(map){
					var dinamicPanelValues = {};
					var count = 0;
					for(var x in map){
						dinamicPanelValues[x] = map[x];
						count++; 
					}
					if(count > 0){
						$("#mdm6DinamicPanel").dinamicPanel('setActiveFeatures',dinamicPanelValues);
					}
				}
				if(wmsServices){
					$("#layersDisplay").layerDisplay('loadWmsList',wmsServices);
				}
				if(baseMap){
					$('.layerManager_v_c_item[idref='+baseMap+']').click();	
				}
				sharedValues = null;
			}
		},
		share:function(){
			var obj = this;
			
			var searchId = 	$("#mdm6DinamicPanel").dinamicPanel('getActiveSearch');
			var mapSettings = obj.map.Feature.getAllForStore();
			var urlParams = document.location.search.substring(1,document.location.search.length);
			var baseMap = $("#mdm6Layers").layerManager('getCurrentBaseMap');
			var wmsServices = $("#layersDisplay").layerDisplay('getWmsServices');
			var mainObj = {
					location:urlParams,
					search:searchId,
					map:mapSettings,
					baseMap:baseMap,
					wmsServices:wmsServices
				};
			mainObj = JSON.stringify(mainObj);
			console.log(mainObj);
			var params = mainObj;
			
			var dataSource = $.extend(true,{},dataSources.share);
			dataSource.data = params;
			dataSource.url+= '/add';
			
			$.ajax(dataSource).done(function(data) {
				if(data && data.response.success){
				   var id = data.data.id;
				   	obj.shareDialog(id);
				}
			}).error(function(){
				obj.map.Notification({message:'La funcionalidad para compartir no esta disponible por el momento, favor de intentarlo m&aacute;s tarde',time:4500});
			});
		}
	}
});