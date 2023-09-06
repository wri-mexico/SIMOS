$.widget( "custom.ecoTool", {
  // default options
  options: {
	  edos:[],
	  var_vals:null,
	  var_gs:[],
	  dataDource:null,
	  stratCount:5,
	  noDataStrat:null,
	  colorRamps:[],
	  getResolution:function(){},
	  inGeoArea:function(){},
	  notInGeoArea:function(){},
	  onStart:function(){},
	  onClose:function(){},
	  refreshLayer:function(){},
	  systemMessage:function(msg){}
  },
  configData:{
	maxHeight:550,
	minHeight:200,
	transparency:100,
	title:'Censos Económicos 2014',
	colorRamps:[
	]
  },
  collapsed:true,
  canResize:true,
  currentData:{},
  selectedData:{},
  infoData:null,
  serviceData:{
		sector:[],
		ssector:[]  
  },
  hasChanged:true,
  getGeoInfo:function(geo){
	  var idGeo = geo.cvegeo;
	  var func = geo.callback;
	  var obj = this;
	  var dataSource = $.extend(true,{},obj.options.dataSource.getGeo);
	  	  dataSource.url+= '/'+idGeo;
	  obj.getData(dataSource,{},function(data){
		  if(data.response.success){
				if ($.isFunction(func)){
					func(data);
			    }
		  }
	  });
  },
  extentToCvegeo:function(id){
	 var obj = this;
	 obj.getGeoInfo({cvegeo:id,callback:function(data){
		 obj.options.extent(data.data.extent);
	  }});
  },
  getDataInfoVars:function(){
	  var obj = this;
	  var vals = obj.currentData;
	  var dataSource = $.extend(true,{},obj.options.dataSource.infoVars);
	  obj.getData(dataSource,{},function(data){
		  obj.infoData = data;
	  });
  },
  getVarsData:function(){
	  return this.infoData; 
  },
  openDialogVar:function(_var){
	  var obj = this; 
	  var data = obj.infoData.vars_vals.var_eco.list.concat(obj.infoData.vars_vals.var_relan.list);
	  var varInfo = null;
	  for(var x in data){
		 var item = data[x];  
		 if(item.id == _var)
		 	varInfo = item;
	  }
	
	  if(varInfo){
		  if(!$('#ecoTool-varInfo-dialog').attr('id')){
			  var cadena = '<div title="'+varInfo.nombre+'" id="ecoTool-varInfo-dialog">'+varInfo.html+'</div>';
			  $('#panel-center').append(cadena);
			  $('#ecoTool-varInfo-dialog').dialog({
				    dialogClass: 'ecoTool-varInfo-dialogContainer',
					width:450,
					height:400,
					close: function(event, ui)
					{
						$(this).dialog('destroy').remove();
					}
			  });
			  $('.ecoTool-varInfo-dialogContainer .ui-dialog-title').attr('title',varInfo.nombre);
		  }else{
			  $('#ecoTool-varInfo-dialog').html(varInfo.html).dialog({ title: varInfo.nombre});
			  $('.ecoTool-varInfo-dialogContainer .ui-dialog-title').attr('title',varInfo.nombre);
		  }
	  
	  }
  },
  changeColorMap:function(){
	  var obj = this;
	  var data = obj.currentData;
	  var theme = data.theme;
	  var strats = theme.boundaries;
	  var colors = data.colors.colors; 

	  var dataSource = $.extend(true,{},obj.options.dataSource.themeColor);
	  var params = { 
					"id": theme.id, 
					 "variable": data._var.id, 
				     "boundaries":[]
				    }
	  for(var x in strats){
		    var item = $.extend(true,{},strats[x]);
			var rgb = obj.hexToRgb(colors[x]);
			item.rgb = rgb.r+' '+rgb.g+' '+rgb.b
			params.boundaries.push(item);  
	  }
		obj.getData(dataSource,params,function(data){
			if(data.response.success){
				obj.options.refreshLayer(obj.currentData);	
			}
		});
  },
  mapTheme:function(numStrats){
	  var obj = this;
	  var vals = obj.currentData;
	  var dataSource = $.extend(true,{},obj.options.dataSource.theme);
	  var sector = (vals.ss.id != '')?vals.ss.id:
	  					(vals.s.id != '')?vals.s.id:
							vals.gs.id;
							
	  var numS = (numStrats)?numStrats:5;
	  var params = {
		  	ent:vals.geo.id,
		  	sector:parseInt(sector,10),
			variable:vals._var.id,
			estratos:numS,
			year:vals.years[vals.yearPos]
			
		  }	
		obj.getData(dataSource,params,function(data){
			if(data.response.success){
				var vals = data.data;
				obj.currentData.theme = {};
				for(var x in vals){
					obj.currentData.theme[x] = vals[x];		
				}
				obj.printCurrentValues();
				obj.changeColorMap();
				obj.extentToCvegeo(obj.currentData.geo.id);
				obj.hasChanged = false;
				//obj.options.refreshLayer(obj.currentData);
			}else{
				var message = data.response.message;
				if(message && message == '409'){
					//si se presenta un error disminuye stratos
					if(numS >= 3){
						obj.mapTheme((numS -1));
					}
				}
			}
			},
			function(){
				//si se presenta un error disminuye stratos
				if(numS >= 3){
					obj.mapTheme((numS -1));
				}
			});
  },
  checkPoint:function(pos){
	  var obj = this;
	  var vars  = obj.getCurrentData();
	  var ent = obj.options.getExternalStatus();
	  vars.point = 'POINT('+pos.lon+' '+pos.lat+')';
	  if(!ent)
	  	ent = vars;
		
	  var dataSource = $.extend(true,{},obj.options.dataSource.infoPoint);
		  dataSource.url+= '?point=POINT('+pos.lon+' '+pos.lat+')&ent='+ent.geo.id;
	  obj.getData(dataSource,{},function(data){
		   if(data.response.success){
				if(data.data.values){
					obj.options.inGeoArea(vars,data.data.values);			   
				}else{
					obj.options.notInGeoArea(vars,pos);	
				}
		   }
	  });
	  
  },
  getCurrentData:function(pos){
	  var obj = this;
	  var resolution = obj.options.getResolution();
	  var data = obj.currentData;
	  data.var = data._var;
	  data.resolution = resolution;
	  
	  return data;/*{
				gs:data.gs,
				s:data.s,
				ss:data.ss,
				var:data._var,
				geo:data.geo,
				resolution:resolution
			}*/
  },
  createStructure:function(){
	var obj = this;
	var cadena = '';
		if(obj.isCollapsed()){
			cadena+= '<div class="ecoTool-toolBar">';
			cadena+= '	<div class="ecoTool-mainLogo sprite-ecoTool sprite-ecoTool-ecoLogo"></div>';
			cadena+= '	<div class="ecoTool-toolGroup">'+obj.configData.title;
			cadena+= '	</div>';
			cadena+= '</div>';
			cadena+= '<div id="ecoTool_content" class="ecoTool-content" style="display:none">';
			cadena+= '	<div class="ecoTool-content-header" id="ecoTool_content_header"></div>';
			cadena+= '	<div id="ecoTool_mainEdit" title="Configurar" class="ecoTool-mainEdit sprite-ecoTool sprite-ecoTool-pencil"></div>';
			cadena+= '</div>';
		}else{
			cadena+= '<div class="ecoTool-toolBar">';
			cadena+= '	<div class="ecoTool-mainLogo sprite-ecoTool sprite-ecoTool-ecoLogo"></div>';
			cadena+= '	<div class="ecoTool-toolGroup">';
			cadena+= '		<div id="ecoTool_varBtn" val="2" class="ecoTool-toolBtn" selected="selected">';
			cadena+= '			<div title="Seleccione la actividad económica a mostrar en el mapa" class="ecoTool-varBtn sprite-ecoTool sprite-ecoTool-building"></div>';
			cadena+= '			<label>Actividad</label>';
			cadena+= '		</div>';
			cadena+= '		<div id="ecoTool_geoBtn" val="1" class="ecoTool-toolBtn">';
			cadena+= '			<div title="Seleccione la entidad federativa a consultar" class="ecoTool-geoBtn sprite-ecoTool sprite-ecoTool-world"></div>';
			cadena+= '			<label>Geográfico</label>';
			cadena+= '		</div>';
			cadena+= '		<div id="ecoTool_stratBtn" val="3" class="ecoTool-toolBtn">';
			cadena+= '			<div title="Visualice estratos y cambie el color del mapa" class="ecoTool-stratBtn sprite-ecoTool sprite-ecoTool-graph"></div>';
			cadena+= '			<label>Estratos</label>';
			cadena+= '		</div>';
			cadena+= '	</div>';
			cadena+= '	<div id="ecoTool_pdfBtn">';
			cadena+= '		<div title="Los Censos Económicos 2014 en el Mapa Digital México" class="sprite-ecoTool sprite-ecoTool-pdf"></div>';
			cadena+= '		<label>Documento metodológico</label>';
			cadena+= '	</div>';
			cadena+= '</div>';
			cadena+= '<div id="ecoTool_content" changed="false" class="ecoTool-content" style="display:none">';
			cadena+= '	<div class="ecoTool-content-header" id="ecoTool_content_header"></div>';
			cadena+= '	<div id="ecoTool_mainAccept" title="Cerrar edición" class="ecoTool-mainEdit sprite-ecoTool sprite-ecoTool-ok"></div>';
			cadena+= '	<div id="ecoTool_mainAcceptActive" title="Aplicar cambios" class="ecoTool-mainEdit sprite-ecoTool sprite-ecoTool-okActive"></div>';
			cadena+= '	<div id="ecoTool_cancelBtn"><div title="Cancelar edición" class="sprite-ecoTool sprite-ecoTool-cancel"></div></div>';
			cadena+= '	<div id="ecoTool_content_panels">'; 
			cadena+= '		<div id="ecoTool_content_panel1" class="ecoTool-content-panel" value="panel0" style="display:none"></div>';
			cadena+= '		<div id="ecoTool_content_panel2" class="ecoTool-content-panel" value="panel1"></div>';
			cadena+= '		<div id="ecoTool_content_panel3" class="ecoTool-content-panel" value="panel2" style="display:none"></div>';
			cadena+= '	</div>';
			cadena+= '</div>';
		}
		obj.element.html(cadena);
		$('#ecoTool_cancelBtn').click(function(){
			obj.collapsePanel('cancel');
		});
		$('#ecoTool_pdfBtn').click(function(){
			window.open(obj.options.defaultData.pdfPath);
		});	
		$('#ecoTool_content').click(function(){
			if(obj.element.attr('collapsed') == 'true')
				obj.extendPanel();	
		});
		
		$('#ecoTool_mainEdit').click(function(){
			obj.extendPanel();	
		});
		$('.ecoTool-toolBtn').each(function(){
			$(this).click(function(){
				$('.ecoTool-toolBtn[selected=selected]').each(function(){$(this).removeAttr('selected');});
				$(this).attr('selected','selected');
				var panelNum = $(this).attr('val');
				$('.ecoTool-content-panel').each(function(){
					$(this).hide();	
				});
				$('#ecoTool_content_panel'+panelNum).fadeIn();
				if(panelNum == '2'){
					$('#ecoTool_vars_input_search').focus();	
				}
			});
		});
		if(!obj.isCollapsed()){
			$('#ecoTool_mainAccept,#ecoTool_mainAcceptActive').click(function(){
				obj.collapsePanel();
			});
		}
		$('#ecoTool_content').fadeIn();
		obj.printCurrentValues();
  },
  getGsVar:function(id){
	  var obj = this;
	  var list = obj.options.var_gs;
	  var r = null;
	  for(var x in list){
			if(list[x].id == id)
				r = list[x];
	  }
	  return r;
  },
  printPanels:function(){
	  var obj = this;
	  var panel1 = $('#ecoTool_content_panel1');
	  var panel2 = $('#ecoTool_content_panel2');
	  var panel3 = $('#ecoTool_content_panel3');
	  var edos = obj.configData.edos;
	  var selectedData = obj.selectedData;
	  //Panel 01 -------------------------------------------------------
	  var cadena = '';
	  for(var x in edos){
			var edo = edos[x];
			var isSelected = (edo.id == selectedData.geo.id);
		  	cadena+= '<div class="ecoTool-geoEdo-item" idref="'+edo.id+'" '+((isSelected)?'selected="selected"':'')+'>';
			cadena+= '	<div class="ecoTool-geoEdo-item-label">'+edo.label+'</div>';
			cadena+= '	<div class="ecoTool-geoEdo-icon">';
			cadena+= '		<div class="ecoTool-geoEdo-icon-sel sprite-ecoTool sprite-ecoTool-itemSelected"></div>';
			cadena+= '		<div class="ecoTool-geoEdo-icon-unsel sprite-ecoTool sprite-ecoTool-itemUnselected"></div>';
			cadena+= '	</div>';
			cadena+= '</div>';
	  }
	  panel1.html(cadena);
	  $('.ecoTool-geoEdo-item').each(function(){
			$(this).click(function(){
				if($(this).attr('selected') === undefined){
					var idref = $(this).attr('idref');
					selectedData.geo = edos[parseInt(idref,10)]; 
					$('.ecoTool-geoEdo-item[selected=selected]').removeAttr('selected');
					$(this).attr('selected','selected');
					obj.setChanged()
					obj.refreshVarPanels();
				}
			})
	  });
	 //Panel 02-------------------------------------------------------------
	  var gs = this.options.var_gs;
	  cadena = '<div class="ecoTool-vars-tool-container">';
	  for(var x in gs){
		var item = gs[x];
		cadena+= '<div '+((item.id == obj.currentData.gs.id)?'selected="selected"':'')+'val="'+(parseInt(x,10)+1)+'" idref="'+item.id+'" _name="'+item.name+'" class="ecoTool-vars-category">';
		cadena+= 	'<div class="'+((item.sprite)?item.sprite:'')+'" title="'+item.title+'" ></div>';
		cadena+= 	((!item.sprite)?'<label title="'+item.title+'" >'+item.name+'</label>':'<label title="'+item.title+'" >'+item.label+'</label>');
		cadena+= '</div>';
	  }
	  cadena+= '</div>';
	  cadena+= '<div class="ecoTool-vars-panel-container">';
	  cadena+= '	<div id="ecoTool_vars_panel1" class="ecoTool-vars-panel" ></div>';
	  cadena+= '	<div id="ecoTool_vars_panel2" class="ecoTool-vars-panel" style="display:none"></div>';
	  cadena+= '	<div id="ecoTool_vars_panel3" class="ecoTool-vars-panel" style="display:none"></div>';
	  cadena+= '</div>';
	  panel2.html(cadena);
	  $('.ecoTool-vars-category').each(function(index, element) {
        		$(this).click(function(e) {
					$('#ecoTool_block_ssector').remove();
                    $('.ecoTool-vars-category[selected=selected]').removeAttr('selected');
					$(this).attr('selected','selected');
					var gs = obj.getGsVar($(this).attr('idref'));
					obj.selectedData.gs = {id:gs.id,label:gs.name,title:gs.label};
					obj.selectedData.s = {id:'',label:''};
					obj.selectedData.ss = {id:'',label:''};
					obj.selectedData.total = '';
					obj.setChanged();
					if(gs.id == 0){
						$('#ecoTool_vars_panel1').html('');
					}
					
					obj.printCurrentValues();
					obj.refreshVarPanels();
					//obj.printVarPanels({id:$(this).attr('idref'),name:$(this).attr('_name')});
                });
		});
	  //Panel03 ------------------------------------------------------------
	   var colorRamps = obj.configData.colorRamps;
	   var currentRamp = obj.currentData.colors;
	   cadena = '<div class="ecoTool-strats-container">';
	   cadena+= '	<div class="ecoTool-strats-currentRamp-container">';
	   cadena+= '		<div class="ecoTool-strats-transparency-container">';
	   cadena+= '			<div class="ecoTool-strats-transparency-title">Transparencia</div>';
	   cadena+= '			<div id="ecoTool_strats_trasparencyControl" class="ecoTool-strats-transparency-tool"></div>';
	   cadena+= '		</div>';
	   cadena+= '		<div id="ecoTool_strats_data_container" class="ecoTool-strats-data-container"></div>';
	   cadena+= '	</div>';
	   cadena+= '	<div id="ecoTool_strats_currentRamps_container" class="ecoTool-strats-currentRamps-container"></div>';
	   cadena+= '</div>';
	   panel3.html(cadena);
	   
	   obj.printThemeStats();
	   $( "#ecoTool_strats_trasparencyControl" ).slider({
		  range: "max",
		  min: 1,
		  max: 100,
		  value: obj.configData.transparency,
		  slide: function( event, ui ) {
			obj.currentData.transparency = ui.value;
			obj.configData.transparency = ui.value;
			obj.options.onTransparency(ui.value);
		  }
		});
	   
	   cadena = '';
	   for(var x in colorRamps){
			var ramp = colorRamps[x];   
			cadena+= obj.createRampColor(ramp); 
	   }
	   $('#ecoTool_strats_currentRamps_container').html(cadena);
	   obj.printThemeStats();
	   
	   $('.ecoTool-strats-colorRamp').each(function(){
			$(this).click(function(){
				
				$('.ecoTool-strats-colorRamp[selected=selected]').each(function(index, element) {
						$(this).removeAttr('selected');
				});
				$(this).attr('selected','selected');
				var idref = $(this).attr('idref');
	   			obj.rollbackColor = $.extend(true,{},obj.selectedData.colors);
				obj.selectedData.colors = obj.configData.colorRamps[parseInt(idref,10)];
				obj.currentData.colors = selectedData.colors;
				obj.changeColorMap();
				obj.printThemeStats();njg
			})   
	   })
	   
	   
  },
  createRampColor:function(ramp){
	  	var obj = this;
		var colorRamps = obj.configData.colorRamps;
		var currentRamp = obj.currentData.colors;
		var colors = ramp.colors;
		var snum = obj.options.stratCount;
		var cadena= '<div idref="'+ramp.id+'" class="ecoTool-strats-colorRamp" '+((currentRamp.id == ramp.id)?'selected="selected"':'')+'>';
			for(var x in colors){
				var width = 100/snum;
				cadena+='<div class="ecoTool-strats-ramp-color" style="background-color:'+colors[x]+';width:'+width+'%"></div>';	
			}
			cadena+='</div>';
		return cadena; 
  },
  printThemeStats:function(){
	 var obj = this;
	 var colorRamps = obj.configData.colorRamps;
	 var data = obj.currentData.theme;
	 var currentRamp = obj.currentData.colors;
	 var noDataStrat = obj.options.noDataStrat;
	 var strats = $.extend(true,[],data.boundaries).concat(noDataStrat);

	 var cadena = '<div class="ecoTool-theme-strat-info">';
	 	 var leftStr = '';
		 var rightStr = '';
		 var med = ((strats.length / 2) > (2 % strats.length))?(2 % strats.length)+1:(2 % strats.length);
		 for(var x in strats){
			var item = strats[x];
			var style = item.style;
			
			if(!style){
				var color = currentRamp.colors[x];
				var _cadena = '<div style="float:'+((parseInt(x,10) < med)?'left':'right')+'" class="ecoTool-theme-strat-info-item"><span style="background-color:'+color+'"/>';
					_cadena+= '<label>Estrato: <b>'+item.stratum+'</b></label><label>Frecuencia: <b>'+item.n+'</b></label></div>';		 
			}else{
				var _cadena = '<div style="float:'+((parseInt(x,10) < med)?'left':'right')+'" class="ecoTool-theme-strat-info-item"><span style="'+style+'"/>';
					_cadena+=  '<label style="padding-top:6px;">'+item.label+'</label></div>';		 		
			}

			if((parseInt(x,10) <= med)){
				leftStr+=_cadena;
			}else{
				rightStr+=_cadena;
			}
		 }
		 cadena+= '		<div class="ecoTool-theme-strat-left-info">'+leftStr+'</div>';
		 cadena+= '		<div class="ecoTool-theme-strat-right-info">'+rightStr+'</div>';
	 	 cadena+= '</div>';
	   
	 	 cadena+= '<div class="ecoTool-theme-normalInfo ecoTool-theme-info">';
		 cadena+= '		<div><b>Media:</b><label>'+obj.formatMoney(data.mean)+'<label></div>';
		 cadena+= '		<div><b>Mediana:</b><label>'+obj.formatMoney(data.median)+'<label></div>';
		 cadena+= '		<div><b>Moda:</b><label>'+obj.formatMoney(data.mode)+'<label></div>';
	 	 cadena+= '</div>';
		 
		 cadena+= '<div class="ecoTool-theme-mainInfo ecoTool-theme-info">';
	 	 cadena+= '		<div><b>Indicador:</b><label>'+obj.formatMoney(data.indicator)+'<label></div>';
		 cadena+= '		<div><b>Elementos:</b><label>'+obj.formatMoney(data.n)+'</label></div>';
		 cadena+= '		<div><b>D.Estd:</b><label>'+obj.formatMoney(data.sd)+'<label></div>';
	 	 cadena+= '</div>';
	
	$('#ecoTool_strats_data_container').html(cadena);
	 
  },
  adjustBlockSize:function(PO){ //Panel Open
  	var obj = this;
	
	var SSBan = !($('#ecoTool_block_ssector').attr('id') === undefined);
	var SBan = !($('#ecoTool_block_sector').attr('id') === undefined);
	
	var _s = $('#ecoTool_block_sector');
	var _ss = $('#ecoTool_block_ssector');
	var _var = $('#ecoTool_block_vars');
	
	
	$('.ecoTool-block').each(function(){
		$(this).removeClass('ecoTool-block-selected')	
	});
	
	switch (PO){
		case 's':
			if(SSBan){
				_s.css({bottom:'62px',height:''});
				_ss.css({top:'',bottom:'92px',height:'25px'});
			}else{
				_s.css({bottom:'95px',height:''});	
			}
			_var.css({top:'',bottom:'62px',height:'25px'});
		break;
		case 'ss':
				_s.css({bottom:'',height:'25px'});
				_ss.css({top:'31px',bottom:'',height:'',bottom:'95px'});
				_var.css({top:'',bottom:'62px',height:'25px'});
			
		break;
		case 'var':
			if(!SSBan && !SBan){
				_var.css({top:'0px',bottom:'62px',height:''});
			}else{
				if(SSBan){
					_s.css({bottom:'',height:'25px'});
					_ss.css({top:'31px',bottom:'',height:'25px'});
					_var.css({top:'62px',bottom:'62px',height:''});
				}else{
					_s.css({bottom:'',height:'25px'});
					_var.css({top:'31px',bottom:'62px',height:''});
				}
			}
		break;
	}
  },
  getVar:function(id){
	  var obj = this;
	  var vars = obj.options.var_vals;
	  vars = vars.var_eco.list.concat(vars.var_relan.list);
	  var r = null;
	  for(var x in vars){
		  var _var = vars[x];
		  if(_var.id == id){
			  r = _var;
			  break;
		  }
	  }
	  return r;
  },
  getSector:function(id){
	  var obj = this;
	  var r = null;
	  var sector = obj.serviceData.sector;
	  var ssector = obj.serviceData.ssector;
	  
	  for(var x in sector){
		  var item = sector[x];
			if(item.id == id){
				r = item;
				r.label = r.name;
				break;
			}  
	  }
	  if(!r)
	  for(var x in ssector){
		  var item = ssector[x];
			if(item.id == id){
				r = item;
				r.label = r.name;
				break;
			}  
	  }
	  return r;
  },
  getEcoVar:function(id){
	var obj = this;
	var vars = obj.options.var_vals;
	var r = null;
	for(var list in vars){
		var items = vars[list].list
		for(var x in items){
			var item = items[x];
			if(item.id == id){
				r = item;
				r.type = list;	
				break;
			}
		}
	}
	return r;
  },
  getRule:function(){
	var obj = this;  
	var data = obj.selectedData;
	
	var isNal = (parseInt(data.geo.id,10) == 0);
	var isGs = data.gs.id != '' || data.gs.id == 0;
	var isS =  data.s.id != '';
	
	return{
		showSS:((isNal)?true:(isGs && !isS)?true:false),
		showVE:((isNal)?true:(isGs && !isS)?true:false)
	}
	
  },
  refreshVarPanels:function(ban){
	var obj = this;
	var data = obj.selectedData;
	
	if(!obj.getRule().showSS){
		data.ss = {id: '',label: ''};
		obj.adjustBlockSize('s');
		$('#ecoTool_block_ssector').remove();
	}
	if(!obj.getRule().showVE){
		var tVar = obj.getEcoVar(data._var.id);
		if(tVar.type == 'var_eco'){
			var firstVar = obj.options.var_vals.var_relan.list[0];
			data._var = firstVar;
			obj.options.systemMessage('Se ha cambiado la relación analítica por '+firstVar.label);	
			obj.printVarEco(true);
		}
	}
	if(!ban){
		//obj.printVarPanels({id:data.gs.id,name:data.gs.name});
		var tabSel = $('.ecoTool-vars-category[selected=selected]');
		obj.printVarPanels({id:tabSel.attr('idref'),name:tabSel.attr('_name')},function(){
			if(obj.selectedData.s.id != '' && obj.getRule().showSS){
				obj.printVarPanelsSub(obj.selectedData.s.id);
			}
			obj.printVarEco(true);
		});
	}
		
	obj.printCurrentValues();
  },
  printVarEco:function(_refresh){
	obj = this; 
	var gs = obj.options.var_gs;
	var sdata = obj.selectedData; 
	var cadena = '';
	var vals = obj.options.var_vals.var_eco.list;
	
	if(!_refresh){
		cadena+='<div id="ecoTool_block_vars" class="ecoTool-block ecoTool-block-vars">';
		cadena+='	<div title="Seleccione indicador a consultar" type="var" class="ecoTool-var-title ecoTool-block-title">Información Económica';
		cadena+='	</div>';
		cadena+='	<div id="ecoTool_vars_container" class="ecoTool-vars-container">';
	}
	
	//solo en nacional o si no ha seleccionado un sector
	if(obj.getRule().showVE){
		cadena+='		<div class="ecoTool-vars-section-title">'+obj.options.var_vals.var_eco.label+'</div>';
		for(var x in vals){
			var val = vals[x];
			cadena+='<div '+((val.id == sdata._var.id)?'selected="selected"':'')+' idref="'+val.id+'" type="ECO" class="ecoTool-block-item ecoTool-var-item">';
			cadena+='	<div idref="'+val.id+'" class="ecoTool-var-info sprite-ecoTool sprite-ecoTool-info"></div><label>'+val.label+'</label>';
			cadena+='</div>';	
		}
	}
	
	var vals = obj.options.var_vals.var_relan.list;
	cadena+='	<div class="ecoTool-vars-section-title">'+obj.options.var_vals.var_relan.label+'</div>';
	for(var x in vals){
		var val = vals[x];
		cadena+='<div '+((val.id == sdata._var.id)?'selected="selected"':'')+' idref="'+val.id+'" type="REL" class="ecoTool-block-item ecoTool-var-item">';
		cadena+='	<div idref="'+val.id+'" class="ecoTool-var-info sprite-ecoTool sprite-ecoTool-info"></div><label>'+val.label+'</label>';
		cadena+='</div>';	
	}
	if(!_refresh){
		cadena+='	</div>';
		
		cadena+='</div>';
		
		$('#ecoTool_vars_panel1').append(cadena);	
		obj.adjustBlockSize('var');	
	}else{
		$('#ecoTool_vars_container').html(cadena);	
		obj.adjustBlockSize('var');
	}
	
	$('.ecoTool-block-title').each(function(){
		$(this).click(function(){
			obj.adjustBlockSize($(this).attr('type'));
		});
	});
	
	$('.ecoTool-var-info').each(function(index, element) {
		$(this).click(function(){
			obj.openDialogVar($(this).attr('idref'));		
		})
	});
	$('.ecoTool-var-item').each(function(index, element) {
		$(this).click(function(){
			var idref = $(this).attr('idref');
			obj.selectedData._var = obj.getVar(idref);
			var areAll = ($('.ecoTool-vars-category[selected=selected]').attr('idref') == '0');
			if(areAll){
				var gs = $('.ecoTool-vars-category[selected=selected]');
				gs = obj.getGsVar(gs.attr('idref'));
				
				obj.selectedData.gs = {id:gs.id,label:gs.name,title:gs.label};
				obj.selectedData.s = {id:'',label:''};
				obj.selectedData.ss = {id:'',label:''};
				
				obj.selectedData.total = '';
			}
			obj.setChanged();
			obj.printCurrentValues();
		});
	});
  },
  printVarPanels:function(sec,func){
		var obj = this;
		var gs = obj.options.var_gs;
		var sdata = obj.selectedData;
		//funcion para impresion general;
		var dataSource = $.extend(true,{},obj.options.dataSource.sectors);
			dataSource.url+= '/'+sec.id;
		if(sdata.gs.id != 0 || sdata.gs.id != '0'){
			obj.getData(dataSource,{},function(data){
				var cadena = '';
				if(data.response.success){
					var sectors = data.data.sectors;
					
						obj.serviceData.sector = $.extend(true,[],data.data.sectors);
						//impresion de sectores del Gran Sector
						cadena+='<div id="ecoTool_block_sector" class="ecoTool-block ecoTool-block-sector" idref="'+sec.id+'">';
						cadena+='	<div type="s" title="Filtre por sector" class="ecoTool-sector-title ecoTool-block-title">Sectores';
						cadena+='	</div>';
						cadena+='	<div class="ecoTool-sectors-container">';
						for(var x in sectors){
							var sector = sectors[x];
							cadena+='<div '+((sector.id == sdata.s.id)?'selected="selected"':'')+' idref="'+sector.id+'" type="'+sector.type+'" class="ecoTool-block-item ecoTool-sector-item" subsector="'+(sector.count > 0)+'">';
							cadena+='	<div>'+sector.name;
							cadena+='	</div>';
							cadena+='</div>';
						}
						cadena+='	</div>';
						cadena+='</div>';
						
						$('#ecoTool_vars_panel1').html(cadena);
						obj.printVarEco();
						obj.printPeriodSelection();
						
						obj.adjustBlockSize('s');
						$('.ecoTool-sector-item').each(function(){
							$(this).click(function(e){
								console.log('click');
								var idref = $(this).attr('idref');
								obj.selectedData.s = obj.getSector(idref);
								var gs = $('.ecoTool-vars-category[selected=selected]');
								gs = obj.getGsVar(gs.attr('idref'));
								obj.selectedData.gs = {id:gs.id,label:gs.name,title:gs.label};
								obj.selectedData.ss ={id:'',label:''};
								obj.selectedData.total = '';
								var haveSs = ($(this).attr('subsector') == 'true');
								//solo si esta en nacional maneja subsectores
								if((parseInt(obj.selectedData.geo.id,10) <= 0) && haveSs){
									var _sub = $(this).attr('idref');
									obj.printVarPanelsSub(_sub);
								}
								obj.setChanged();
								obj.refreshVarPanels();
								e.stopPropagation();
							});	
						});
						
						if($.isFunction(func)){
							func();
						}
						
					
				}else{
					obj.printVarEco();
					obj.printPeriodSelection();
				}
				
			});
		}else{
			obj.printVarEco();
			obj.printPeriodSelection();
		}
  },
  printVarPanelsSub:function(sec){
		var obj = this;
		var gs = obj.options.var_gs;
		var sdata = obj.selectedData;
		//funcion para impresion general;
		//si estamos imprimiendo sectores
			var dataSource = $.extend(true,{},obj.options.dataSource.sectors);
			dataSource.url+= '/'+sec;
			
			obj.getData(dataSource,{},function(data){
				var cadena = '';
				if(data.response.success){
					var sectors = data.data.sectors;
					
					obj.serviceData.ssector = $.extend(true,[],data.data.sectors);
					$('#ecoTool_block_ssector').remove();
					cadena = '';
					cadena+='<div id="ecoTool_block_ssector" class="ecoTool-block ecoTool-block-ssector" idref="'+sec+'">';
					cadena+='	<div type="ss" title="Filtre por subsector" class="ecoTool-ssector-title ecoTool-block-title">Subsectores';
					cadena+='	</div>';
					cadena+='	<div class="ecoTool-ssectors-container">';
					for(var x in sectors){
						var sector = sectors[x];
						cadena+='<div '+((sector.id == sdata.ss.id)?'selected="selected"':'')+' idref="'+sector.id+'" type="'+sector.type+'" class="ecoTool-block-item ecoTool-ssector-item">';
						cadena+='	<div>'+sector.name;
						cadena+='	</div>';
						cadena+='</div>';
					}
					cadena+='	</div>';
					cadena+='</div>';
					$('#ecoTool_vars_panel1').append(cadena);
					$('.ecoTool-ssector-title').click(function(){
						obj.adjustBlockSize('ss');
					});
					obj.adjustBlockSize('ss');
					$('.ecoTool-ssector-item').each(function(){
						$(this).click(function(){
							var idref = $(this).attr('idref');
							obj.selectedData.ss = obj.getSector(idref);
							obj.selectedData.total = '';
							obj.setChanged();
							obj.printCurrentValues();
							obj.adjustBlockSize('var');
						});	
					});
					
				}
			});
  },
  printPeriodSelection:function(){
		var obj = this;
		var val = obj.selectedData;
		var years = val.years;
		var cadena = '';
		cadena+='<div id="ecoTool_block_period" class="ecoTool-block ecoTool-block-period">';
		cadena+='	<div type="ss" title="Seleccione el año censal a consultar" class="ecoTool-period-title ecoTool-block-title">Eventos';
		cadena+='	</div>';
		cadena+='	<div class="ecoTool-period-container">';
		for(var x in years){
			cadena+='	<div idref="'+x+'" class="ecoTool-period-item '+((x == val.yearPos)?'selected':'')+'">'+years[x]+'</div>';
		}
		cadena+='	</div>';
		cadena+='</div>';
		$('#ecoTool_vars_panel1').append(cadena);
		$('.ecoTool-period-item').each(function(){
			$(this).click(function(e){
				if(!$(this).hasClass('selected')){
					var idref = parseInt($(this).attr('idref'),10);
					obj.selectedData.yearPos = idref;
					
					$('.ecoTool-period-item.selected').removeClass('selected');
					$(this).addClass('selected');
					obj.setChanged();
					e.stopPropagation();
				}
			})
		});
  },
  printCurrentValues:function(){
		var obj = this;
		var val = obj.currentData;
		var snum = obj.options.stratCount;
		var rcolors = obj.currentData.colors.colors;
		var cadena = '';
		
		if(obj.isCollapsed()){
			var total = (val.theme)?val.theme.indicator:0;
			var postfix = obj.getVar(val._var.id).postfix;
			total = (parseInt(total,10) > 0)?
					 (postfix)?total+postfix:total:'-------';
					 
			var gs = obj.getGsVar(val.gs.id);
			cadena+= '<div class="ecoTool-currentValues-min">';
			cadena+= '	<div class="ecoTool-cv-var">'+val._var.label+'</div>';
			cadena+= '	<div class="ecoTool-cv-var-val">'+obj.formatMoney(total)+'</div>';
			cadena+= '	<div class="ecoTool-cv-gs">'+gs.label+'</div>';
			cadena+= '	<ul class="ecoTool-cv-list">';
			if(val.s.label != ''){
			cadena+= '		<li class="ecoTool-cv-s">'+val.s.label+'</li>';
			if(val.ss.label != ''){
			cadena+= '			<ul><li class="ecoTool-cv-ss">'+val.ss.label+'</li></ul>';
			}
			cadena+= '		</li>';
			}
			cadena+= '	</ul>';
			cadena+= '	<div class="ecoTool-geo"><div class="sprite-ecoTool sprite-ecoTool-mexMap"></div><label>'+val.geo.label+'</label></div>';
			if(val.theme)
				cadena+= '	<div class="ecoTool-min-max"><div class="ecoTool-min-value">'+obj.formatMoney(val.theme.min)+'</div> <div class="ecoTool-max-value">'+obj.formatMoney(val.theme.max)+'</div></div>';
			
			cadena+= '	<div class="ecoTool-colorRamp">';
			for(var x=0;x <= snum;x++){
				var width = 100/snum;
				cadena+= '		<div class="ecoTool-colorRamp-item" style="background-color:'+rcolors[x]+';width:'+(width)+'%"></div>';		
			}
			cadena+= '	</div>';
			cadena+= '</div>';
			
		}else{
			val = obj.selectedData;
			var total = (val.theme)?val.theme.indicator:0;
			var gs = obj.getGsVar(val.gs.id);
			
			var postfix = obj.getVar(val._var.id).postfix;
			total = (parseInt(total,10) > 0)?
					 (postfix)?total+postfix:total:'';
			
			cadena+= '<div class="ecoTool-currentValues-ext">';
			cadena+= '	<div class="ecoTool-cv-var-max">'+val._var.label+'</div>';
			cadena+= '	<div class="ecoTool-cv-var-val">'+obj.formatMoney(total)+'</div>';
			cadena+= '	<div id="ecoTool_cv_gs_max" class="ecoTool-cv-gs-max">'+gs.label+'</div>';
			cadena+= '	<div class="ecoTool-cv-s">'+val.s.label+'</div>';
			cadena+= '	<div class="ecoTool-cv-ss">'+val.ss.label+'</div>';
			cadena+= '	<div class="ecoTool-geo-max">'+val.geo.label+'</div>';
			cadena+= '</div>';
			
			$('.ecoTool-block-item[selected=selected]').each(function(){$(this).removeAttr('selected')})
			if(val.s.id != '')$('.ecoTool-sector-item[idref='+val.s.id+']').attr('selected','selected');
			if(val.ss.id != '')$('.ecoTool-ssector-item[idref='+val.ss.id+']').attr('selected','selected');
			$('.ecoTool-var-item[idref='+val._var.id+']').attr('selected','selected');	
			
		}
		$('#ecoTool_content_header').html(cadena);
		if(!obj.isCollapsed()){
			$('#ecoTool_content_panels').css({top:($('#ecoTool_content_header').height()+10)+'px'})
		}
  },
  isCollapsed:function(){
		return this.collapsed;
  },
  extendPanel:function(){
		var obj = this;
		var element = obj.element;
		
		var wheight = ($(window).height() < (550+230))?
						$(window).height()-230:550;
						
		obj.configData.maxHeight = wheight;
		
		
		obj.selectedData = $.extend(true,{},obj.currentData);
		if(obj.canResize && obj.isCollapsed()){
			obj.canResize = false;
			element.animate({height:wheight+'px'},function(){
				obj.collapsed = false;
				obj.canResize = true;
				obj.createStructure();
				element.attr('collapsed','false');
				obj.printPanels();
				var tabSel = $('.ecoTool-vars-category[selected=selected]');
				obj.printVarPanels({id:tabSel.attr('idref'),name:tabSel.attr('_name')},function(){
					if(obj.selectedData.ss.id != '')
						obj.printVarPanelsSub(obj.selectedData.s.id);	
				});
				
			});
		}
  },
  rollBack:function(){
	var obj = this;
	if(obj.rollbackColor){
		obj.currentData.colors = $.extend(true,{},obj.rollbackColor);
		obj.changeColorMap();  
		obj.rollbackColor = null;
	}
  },
  collapsePanel:function(opc){
		var obj = this;
		var element = obj.element;
		
		if(opc === undefined){
			obj.currentData = $.extend(true,{},obj.selectedData);
			if(obj.hasChanged){
				obj.mapTheme();
			}
		}else{
			obj.rollBack();
		}
		if(obj.canResize && !obj.isCollapsed()){
			obj.canResize = false;
			element.animate({height:obj.configData.minHeight+'px'},function(){
				obj.collapsed = true;
				obj.canResize = true;
				obj.createStructure();
				element.attr('collapsed','true');
				var height = ($('#ecoTool_content_header').height()+10 > 120)?$('#ecoTool_content_header').height()+10:120;
				element.animate({height:height+'px'});
			});
		}
  },
  getData:function(source,params,callback,error,before,complete){
		var obj = this;
		var spinner = this.spinner;
		//Anexo de parametros que vengan definidos desde fuente de datos
		var s_params = source.params;
		var stringify = source.stringify;
		
		if (!(s_params === undefined)){
			for (var x in s_params){ //anexo de la conifuracion del origen de datos
				params[x] = s_params[x];
			};
		}
		if (!(stringify === undefined) && stringify){
			params = JSON.stringify(params);
		}
		//Estructura basica de peticion
		var dataObject = {
			   data: params,
			   success:function(json,estatus){callback(json,estatus);},
			   beforeSend: function(solicitudAJAX) {
					//$('#'+obj.id+'_spinner').addClass('ajax-loader');
					if ($.isFunction(before)){
						before(params);
					};
			   },
			   error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
					if ($.isFunction(error)){
						error(errorDescripcion,errorExcepcion);
					};
			   },
			   complete: function(solicitudAJAX,estatus) {
					//$('#'+obj.id+'_spinner').removeClass('ajax-loader');
					if ($.isFunction(complete)){
						complete(solicitudAJAX,estatus);
					};
			   }
		};
		//anexo de la conifuracion del origen de datos
		for (var x in source){ 
			if ( !(/field|name|id|params|stringify/.test(x)))dataObject[x] = source[x];
		};
		jQuery.support.cors = true;
		$.ajax(dataObject);
	},
  // the constructor
  _create: function() {
	 var obj = this;
	 obj.element
	  // add a class for theming
	  .addClass( "custom-ecoTool" ).attr('collapsed','true');
	  // prevent double click to select text
	 obj.currentData = obj.options.defaultData;
	 
	 obj.configData.colorRamps = obj.options.colorRamps;
	 obj.currentData.colors = obj.configData.colorRamps[0];
	 obj.configData.edos = obj.options.edos; 
	 
	 obj.id = this.element.attr('id');
	 obj.createStructure();
	 obj.mapTheme();
	 obj.getDataInfoVars();
	 var height = ($('#ecoTool_content_header').height()+10 > 120)?$('#ecoTool_content_header').height()+10:120;
	 obj.element.animate({height:height+'px'});
	 obj.options.onStart();
	 obj._refresh();
	 
	 obj.extentToCvegeo(obj.currentData.geo.id);
  },

  // called when created, and later when changing options
  _refresh: function() {
	// trigger a callback/event
  },
  setChanged:function(){
	var obj = this;
	obj.selectedData.theme.indicator = ''; 
	obj.hasChanged = true;
	$('#ecoTool_content').attr('changed','true');
  },
  // events bound via _on are removed automatically
  // revert other modifications here
  _destroy: function() {
	this.options.onClose();
	this.element
	  .removeClass( "custom-ecoTool" )
	  .enableSelection();
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
	// prevent invalid color values
	this._super( key, value );
  },
  formatMoney:function(nStr){
            nStr += '';
			x = nStr.split('.');
			x1 = x[0];
			x2 = x.length > 1 ? '.' + x[1] : '';
			var rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
			}
			return x1 + x2;
  },
  //COLOR FUNCTIONS
  hexToRgb:function(hex) { //#FFFFFF
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
  }

});