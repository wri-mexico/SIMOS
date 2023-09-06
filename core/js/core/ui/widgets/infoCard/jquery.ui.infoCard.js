$.widget("custom.infoCard", {
    options: {
        root: 'body',
        controler: null,
        prev: null,
		dataSources:null,
		edos:[],
		varActive:'',
		getGralValues:function(){
			return null;
		},
		getVarsData:function(){},
		printControl:null,
		anio:["2004","2009","2014"],
	},
	
	cont:0,
	databyYear:{},
		currentData:{
		geo:{},
		edoList:[],
		varData:{},
		jsonVar:null,
		headerData:[],
		year:""
		
		//type:"1"
	},
	timerTab:null,
	timerGraph:null,
	

	runTimerTab:function(params,idTab,contador, years){
		var obj=this;
		if (obj.timerTab){
			clearTimeout(obj.timerTab);
			obj.timerTab=null;
		}
		obj.timerTab=setTimeout(function(){
			obj.getdataTabulado(params,idTab, contador, years);
			},500);
	},
	
	runTimerGraph:function(a,b){
		var obj=this;
		if (obj.timerGraph){
			clearTimeout(obj.timerGraph);
			obj.timerGraph=null;
		}
		obj.timerGraph=setTimeout(function(){
			obj.creaGrafica(a,b);
			},500);
	},
	
	
	currentStatus:'',
	getCurrentData:function(){
		var obj = this;
		obj.currentData.status = obj.currentStatus;
		return obj.currentData;
	},
  	_init: function() {
     
		var obj=this;
	},
	getCveGeo:function(edo){
		var obj = this;
		var list = obj.currentData.edoList;
		var r = null;
		for(var x in list){
			var etiqueta=(list[x].label)?list[x].label:list[x].name;
			if(etiqueta == edo){
				r = list[x].cvegeo;
				break;	
			}
		}
		return r;
	},
	existGeo:function(id){
		var obj = this;
		var list = obj.currentData.edoList;
		var r = false;
		for(var x in list){
			if(list[x].cvegeo == id){
				r = true;
				break;	
			}
		}
		return r;
	},
	getEdos:function(){
		 		var obj = this;
				var list = obj.currentData.edoList;
				obj.edos = [];
				for (var x in list){
					obj.edos.push(list[x].cvegeo);	
				}
				obj.edos = obj.edos.join(',');
				return obj.edos;
	},
	addGeo:function(data){
		var obj = this;
		var tmp = $.extend([],obj.currentData.edoList);
	
		
		
		if((obj.currentData.status=='geo')&&(obj.currentData.edoList.length<=12)){
			
			
			if(!obj.existGeo(data.cvegeo)){
				
				
				obj.currentData.edoList.push(data);
			
				var edos = obj.getEdos();
				
				//codigo para tabulado
				var vals = obj.options.getGralValues();
				var idSector=obj.getIdSector();
				
				var clase ='option_menuBar_selected';
			    var idTab=$('.'+clase).attr('id');	
				
				var params={
				type:obj.currentData.type,
				ent: obj.currentData.geo.id,
				mun: edos,
				variable: vals.var.id,
			    id: idSector,
				year: obj.options.anio[0]
				
				};
				
				
				obj.runTimerTab(params,idTab, 0, obj.options.anio);
				//obj.getdataTabulado(params,idTab);
				//obj.tabular()
			 }
		 }
	},
	getType:function(varName){
		var type=1;
		varName = varName.toLowerCase();
		var e = varName.substring(0,1);
		type = (e=='r')?2:1;
		return type;
		
	},
	
	pintaPoligono:function(wkt){
		var obj=this;
		MDM6('goCoords',wkt);
		obj.deletePoligono();
		
		var params = {lSize:2,lColor:"blue"};
		MDM6('customPolygon',{action:'del'});
		MDM6('customPolygon',{action:'add',wkt:wkt,params:params});
		
	},
		
	deletePoligono:function(){
		MDM6('customPolygon',{action:'del'});  
	},	
	
	
	
	
	getFicha:function(){
		var obj = this;
		var vals = obj.options.getGralValues();
		var service =$.extend({}, obj.options.dataSources.ficha);
		service.url+='/gransector';
		var id_sector=obj.getIdSector();
		var national=(vals.geo.id == "00")?true:false;
		
		
		var params = {
				id:id_sector,
				point:vals.point,
				resolution:vals.resolution,
				year: obj.options.anio[obj.cont],
				national:national
			}
			
			
		obj.getData(service,params,function(data){
				if(data.geographical.length == 2){
					if(!obj.existGeo(data.geographical[0].value))
						obj.currentData.edoList.push({cvegeo:data.geographical[0].value,label:data.geographical[1].value});
					obj.currentData.geo = {id:'00',label:'Nacional'};	
				}else{
					if(!obj.existGeo(data.geographical[2].value))
						obj.currentData.edoList.push({cvegeo:data.geographical[2].value,label:data.geographical[3].value});
					obj.currentData.geo = {id:data.geographical[0].value,label:data.geographical[1].value};
				}
				obj.printFicha(data);	
				if(obj.cont<=obj.options.anio.length-1){
					obj.cont++; 
					obj.getFicha();
					}
		});
	},
	
	
	printFicha:function(data){
		var obj = this;
		var chain="";
		var bandera=0;
		/*
		if (data.geographical.length <=2){
			obj.currentData.edoList.push("00");
		}*/
		obj.headerData=null;
		obj.headerData=[];
		
		//alert(obj.currentData.year);
		
		for (var x in data.geographical){
			var i = data.geographical[x];
			if (bandera==0){
				var cvegeo=i.value;
			}
			else{
				var location=cvegeo+ ' '+i.value;
				obj.currentData.edo = i.value;
				
				//obj.currentData.edoList.push(cvegeo);
				obj.headerData.push({title:i.label,data:location});
				chain+='<div class="infoCard_dataRow" style="height:14px">'+
								'<div id="geographical_title" class="infoCard_option_title">'+i.label+'</div>'+
								'<div id="geographical_data" class="infoCard_data">'+location+'</div>'+
						  '</div>'
			}
			bandera =(bandera==1)?0:1;
			
			
		   
		}
		
		$('#geographical').html(chain);
			
	    chain="";
		var bandera=1;
		chain+='<div class="infoCard_titlesStyles">Variables econ&oacute;micas</div>'+
				   '<div class="infoCard_variableRow" style="height:15px">'+
				   	   '<div class="infoCard_titlesYears anio'+obj.options.anio[2]+'" style="width:12%">2014</div>'+
					   '<div class="infoCard_titlesYears anio'+obj.options.anio[1]+'" style="width:12%">2009</div>'+
					   '<div class="infoCard_titlesYears anio'+obj.options.anio[2]+'" style="width:12%">2004</div>'+
					   '<div class="infoCard_titlesYears" ></div>'+
					'</div>' 
					
			   
		var varType='';
		var addVar=false;
		for (var x in data.economical){
			var i= data.economical[x];
			varType=obj.getType(i.label);
			if((addVar==false)&&(varType==2)){
				chain+='<div class="infoCard_titlesStyles">Relaciones Anal&iacute;ticas</div>';
				addVar=true;
			}
			
			
										bandera=(bandera==0)?1:0;
										var type = obj.getType(i.label);
										var idVar = i.label;
										var varSelected = obj.getvarValues(type, i.label);
										var label = (varSelected!=null)?varSelected.nombre:i.label;
										var valor=obj.formatNumber(i.value);
										//var valor=(x >0)?obj.formatNumber(i.value):i.value;
										var hint = (varSelected!=null)?varSelected.id:'';
										//var simbolo=obj.addSuffix(etiqueta);
										var simbolo=obj.addSuffix(i.label);
										if(obj.cont==0){
											var value='<div id="varName" class="infoCard_varList_title"><div class=" sprite_infoCard spriteInformation" idVarName='+hint+'></div>'+label+simbolo+'</div>';
														var yearsColumn='';
														for(var x in obj.options.anio){
															var i=obj.options.anio[x];
															var selectedClass=(i == obj.currentData.year)?'selectedClass':'';
															yearsColumn+='<div id="varData'+idVar+i+'" class="infoCard_variableData '+selectedClass+'" >'+valor+'</div>';	
															if(i == obj.currentData.year){
																
															}
															
														}
														
											value+=yearsColumn; 		
														  
											if(bandera==0){
												chain+='<div class="infoCard_variableRow">'+value+'</div>';
												
											}else{
												chain+='<div class="infoCard_dataRow" style="background:#E2E2E2; height:15px;">'+value+'</div>';
											}
											
											
										}else{
											$('#varData'+idVar+obj.options.anio[obj.cont]).html(valor);
											var anio=obj.options.anio[obj.cont];
											if(anio  == obj.currentData.year){
												$('#varData'+idVar+obj.options.anio[obj.cont]).addClass('selectedClass');
											}
										}
										
									
			
		
		}
		
	
		if (obj.cont==0){
			$('#economical').html(chain);
			
			$(".spriteInformation").each(function() {
				$(this).click(function(){
					var id=$(this).attr("idVarName");
					obj.options.showVarInfo(id);	
				});
			});
			var altura=$('.infoCard_dataContainer').height();
			$('.infoCard_variables').css('top',(altura+15)+'px');
		}
	
	}, 
	
	
	getvarValues: function(type,variable){
		var branch=(type==1)?"var_eco":"var_relan";
		var response=null;
		var obj=this;
		for(var x in obj.currentData.jsonVar.vars_vals[branch].list){
				var i=obj.currentData.jsonVar.vars_vals[branch].list[x];
				var idjson=i.id2.toLowerCase();
				variable=variable.toLowerCase();
				if(idjson==variable){
					response=i;
					break;
				}
		}
	return response;
	},
	
	
    buildStructure: function() {
		var obj=this;
		var vals = obj.options.getGralValues();
		/*
		geo: Object
		gs: Object
		point: "POINT(-11377531.897569 2507589.7770202)"
		resolution: 19.109257067
		s: Object
		ss: Object
		var: Object*/

	
		obj.element.addClass();
		var chain = '<div class="infoCard_mainContainer">'+
						'<div class="infoCard_dataContainer">'+
								'<div class="infoCard_resumeContainer">'+
									
										'<div class="infoCard_varTitle">'+vals.var.label+'</div>'+
									
										'<div class="infoCard_sectores">'+
											'<div class="infoCard_granSector">'+((vals.gs.label=='Todos')?vals.gs.title:vals.gs.label)+'</div>'+
											'<div class="infocard_sectorData">'+
												'<div class="infoCard_sector">'+vals.s.label+'</div>'+
											'</div>'+
											'<div class="infocard_sectorData">'+	
												'<div class="infoCard_subsector">'+vals.ss.label+'</div>'+
											'</div>'+
										'</div>'+//fin sectores
								'</div>'+//fin resumen
							
								'<div id="geographical" class="infoCard_dataSelect">'+
									//'<div id="" class="infoCard_dataRow" style="height:14px">'+
	//									'<div id="geographical_title" class="infoCard_option_title"></div>'+
	//									'<div id="geographical_data" class="infoCard_data"></div>'+
	//								'</div>'+	
								'</div>'+ //fin data
						    
						'</div>'+
						
					   // '<div class="infoCard_bottomTools">'+
					   //		'<div class="infoCard_tools sprite_infoCard spriteOldCards" style="margin-top:4px"></div>'+
					   //'</div>'+
						
						'<div id="economical" class="infoCard_variables">'+
										
						'</div>'+
						
						'<div class="infoCard_toolBar">'+
							//'<div class="infoCard_tools sprite_infoCard spriteArrowDown" style="margin-top:7px"></div>'+
							'<div class="infoCard_tools sprite_infoCard spriteAnalysis"></div>'+
							//'<div class="infoCard_tools sprite_infoCard spritePrint" style="margin-left:14px; margin-top:7px" ></div>'+
							//'<div class="infoCard_tools sprite_infoCard spriteArrowDown" enable="false" style="margin-top:-79px"></div>'+
						'</div>'+
						'<div id="analysisCard" class="analysisCard_container" style="display:none">'+
										
						'</div>'+
						
					'</div>';
        obj.element.html(chain);
		$('body').append('<div id="'+obj.element.attr('id')+'_dialog" title="Censos Econ&oacute;micos 2014" ></div>');
		obj.element.appendTo('#'+obj.element.attr('id')+'_dialog');
		$('#'+obj.element.attr('id')+'_dialog').dialog({
			//items: '*:not(.ui-dialog-titlebar-close)',
			dialogClass:'dialogInfoCard',
			width:790,
			height:500,
			resizable :false,
			close: function(event, ui)
			{
				$(this).dialog('destroy').remove();
			},
			create:function () {
				$('#ecoInfoCard_dialog').prev().append('<div id="btn_ocultar"  style="cursor:pointer" class="ui-icon ui-icon-circle-triangle-n"></div><div id="btn_plegar"  style="display:none; cursor:pointer" class="ui-icon ui-icon-circle-triangle-s"></div>')
				if(!$('#btn_plegar').attr("active")){
					$('#btn_plegar').click(function(){obj.switchStatus('false','dialogInfoCard-Small')});
					$('#btn_plegar').attr('active','true');
					$('#btn_ocultar').click(function(){obj.switchStatus('true','dialogInfoCard-Small')});
				}
			}
		})
		setTimeout(function(){
			
			
			},1000)
		
		//obj.events();
		$('.spriteArrowDown').click(function(){
			obj.switchStatus('true','dialogInfoCard-Small');
		});
		
		
    },
	
	deletEdo:function(mpio){
		var obj=this;
		var temporal = [];
		var edos= obj.currentData.edoList;
		var position=null;
		for(var x in edos){
			var i = edos[x];
			var Item = (edos[x].label)?edos[x].label:edos[x].name;
			if(Item==mpio){
				//position=parseInt(x);
				
			}else{
				temporal.push(i);
			}
		}
		obj.currentData.edoList = temporal;
		if(position){
			//obj.currentData.edoList.splice(position,1);
		}
	},
	
	formatNumber : function(nStr){
		var bandera=(parseFloat(nStr)<0)?'*':null;
		if (bandera==null){
			nStr += '';
			x = nStr.split('.');
			x1 = x[0];
			//alert('antes');
			x2 = x.length > 1 ? '.' + x[1] : '';
			var rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
			}
			return x1 + x2;
		}else{
			return bandera;	
		}
		
	},

	//porcentaje:["R04","R07","R10","R11"],
//	unidades:["V01"],
//	personas:["V02", "V03", "V04", "V05"],
//	mdp:["V06", "V07", "V08", "V09", "V10", "V11", "V12", "R03", "R05", "R06", "R08", "R09"],
//	unidades_promedio:["R01"],
//	personas_promedio:["R02"],
	
	addSuffix:function(varName){
		var obj=this;	
		var varSuffix={};
			varSuffix={
					   porcentaje:[" (porcentaje)","R04","R07","R10","R11"],
					   unidades:[" (unidades)","V01"],
					   personas:[" (personas)","V02", "V03", "V04", "V05"],
					   mdp:[" (miles de pesos)","V06", "V07", "V08", "V09", "V10", "V11", "V12", "R03", "R05", "R06", "R08", "R09"],
					   unidades_promedio:[" (unidades promedio)","R01"],
					   personas_promedio:[" (personas promedio)","R02"],
			 		 };
		
		var sufijo="";
		
		for (var x in varSuffix){
		var i = varSuffix[x];	
			for (var y in varSuffix[x]){
				var compareItem=i[y].toLowerCase();
				varName=varName.toLowerCase();
				//var prueba=i[y].toLowerCase();
				if(varName==compareItem){
					sufijo=i[0];
				}
			}
		}
		return  sufijo;
		
		//for (var x in obj.itemPercent ){
//				var itemPercent=obj.itemPercent[x].toLowerCase();
//				varName=varName.toLowerCase();
//				if(itemPercent==varName){
//					symbol="%";
//					break;
//				}
//				else{
//					if((varName[0]=="r")&&(varName!="r01"))
//					{
//						if(varName!="r02"){
//				    		symbol=" mdp";
//							break;
//						}
//					}
//					}
//			}
//			return symbol;
	},
	
	buildTabulado:function(data,id_source){
		var obj=this;
		 
		$(".analysisCard_title").each(function(){
			 $(this).hide();
		});
		
		var datosMunicipio="";
		var datosParticipacion="";
		var datosPersonal="";
		var datosRelaciones="";
		var tempPersonal="";	
		var tempRelaciones="";		
		var tempTitles="";
		obj.currentData.varData=null;
		obj.currentData.varData={}; 
		
		for (var x in data){
			if (data[x].label != "elements"){
				var opcion=data[x].label+'';
				opcion=(opcion=='IndicaorNational')?" IndicatorNational":opcion;
				//var valorHeader=(opcion=="IndicatorNational")?obj.formatNumber(data[x].value):data[x].value;
				var valorHeader=obj.formatNumber(data[x].value);
				$('#'+opcion+' .analysisCard_datoComparativo').html(valorHeader);
				
				$('#'+opcion).show();	
			}
			else{
				var clase ="analysisCell_grey";
				for (var y in data[x].value){
					var idRow='analysis_row'+y;
						datosMunicipio+='<div class="analysisRow" refDelete="'+idRow+'">';
						datosParticipacion+='<div class="analysisRow" refDelete="'+idRow+'">';
						datosPersonal+='<div class="analysisRow" refDelete="'+idRow+'">';
						datosRelaciones+='<div class="analysisRow" refDelete="'+idRow+'">';
						if(y==0){
							tempPersonal+='<div class="analysisRow">';
							tempRelaciones+='<div class="analysisRow">';
							tempTitles+='<div class="analysisRow">';
						}
						
					
					var entidad="";
					clase=(clase=="")?"analysisCell_grey":"";
					for(var z in data[x].value[y].fields ){
						
						var etiqueta=data[x].value[y].fields[z].label;
						var Municipio = data[x].value[y].fields[z].value;
						var i=data[x].value[y].fields[z].value;
						if( z==0){
								
							var cveGeo=obj.getCveGeo(Municipio);
								datosMunicipio+= '<div class="analysisCell cveMpio '+clase+'" cveGeo="'+cveGeo+'"><div class=" sprite_infoCard spriteClose" selectDelete="'+idRow+'" Item="'+Municipio+'"></div><div class="analysisCell_textAlign">'+i+'</div></div>';
								entidad= i+'';
								if(y==0){
									tempTitles+= '<div class="analysisCell borderCell"></div>';
								}
								if(!obj.currentData.varData['Municipio']){
									obj.currentData.varData['Municipio']=[];
									
								}
								obj.currentData.varData['Municipio'].push([entidad,i]);
								
						}
						
						if (z==1){
								datosParticipacion+= '<div class="analysisCell analysisCellCenter '+clase+'">'+obj.formatNumber(i)+((i<0)?'':'%')+'</div>';
								if(!obj.currentData.varData['Participacion']){
											obj.currentData.varData['Participacion']=[];
											
								}
								obj.currentData.varData['Participacion'].push([entidad,obj.formatNumber(i)+((i<0)?'':'%')]);
								
						}
						
						if (z>1){
							    var TypeTemp=etiqueta.substring(0,1);
								var simbolo=obj.addSuffix(etiqueta);
								if(TypeTemp == "V"){
									datosPersonal+= '<div class="analysisCell '+clase+'" varName='+etiqueta+'>'+obj.formatNumber(i)+'</div>';
									if(y==0){
										var type = obj.getType(etiqueta);
										var varSelected = obj.getvarValues(type, etiqueta);
										tempPersonal+='<div class="analysisCell classGraphic borderCell" title="'+varSelected.nombre+'" varName='+etiqueta+' >'+etiqueta+'</div>';
										obj.currentData.varData[etiqueta]=[];
										
									
									}
									
								}else{
									 datosRelaciones+= '<div class="analysisCell '+clase+'" varName='+etiqueta+'>'+obj.formatNumber(i)+'</div>';
									 if(y==0){
										 var type = obj.getType(etiqueta);
										 var varSelected = obj.getvarValues(type, etiqueta);
									 	tempRelaciones+='<div class="analysisCell classGraphic borderCell" title="'+varSelected.nombre+'" varName='+etiqueta+'>'+etiqueta+'</div>';
										obj.currentData.varData[etiqueta]=[];
									 }
								}
								obj.currentData.varData[etiqueta].push([entidad,i]);
						
						}
					}
					    datosMunicipio+='</div>';
						datosParticipacion+='</div>';
						datosPersonal+='</div>';
						datosRelaciones+='</div>';
						if (y==0){
							tempPersonal+='</div>';
							tempRelaciones+='</div>';
							tempTitles+='</div>';
						}
					
					
				}
			}	
			
		}
		
		
		var tabTitle = obj.currentData.edoList[0].cvegeo;
		if(tabTitle.length <= 2){
			tabTitle="Estado";
			}
			else{
				tabTitle="Municipio";
				}
		//obj.headerData[0].data
		
		
		
		var chain = '<div class="tab-mpio-container">'+
							'<div class="tab-mpio-title analysisFontTitle">'+tabTitle+'</div>'+
							'<div class="tab-mpio-mainContainer analysisTable" style="width:100%;">'+tempTitles+datosMunicipio+'</div>'+
						'</div>'+
						'<div class="tab-participacion-container">'+
							'<div class="tab-participacion-title analysisCard_marginTitle analysisFontTitle">Participaci&oacute;n</div>'+
							'<div class="tab-participacion-mainContainer analysisTable" style="width:100%;">'+tempTitles+datosParticipacion+'</div>'+
						'</div>'+
						'<div class="tab-personal-container">'+
							'<div class="tab-personal-title analysisCard_marginTitle analysisFontTitle">Caracter&iacute;sticas de personal</div>'+
							'<div class="tab-personal-mainContainer analysisTable" style="width:100%;">'+tempPersonal+datosPersonal+'</div>'+
						'</div>'+
						'<div class="tab-analiticas-container">'+
							'<div class="tab-analiticas-title analysisCard_marginTitle analysisFontTitle">Relaciones anal&iacute;ticas de personal</div>'+
							'<div class="tab-analiticas-mainContainer analysisTable">'+tempRelaciones+datosRelaciones+'</div>'+
						'</div>';
			
		chain+='<div class="analysisCard_spaceRow"></div>';		
		
		$("#"+id_source+'_data').html(chain);
		
		var varInicial='';
		
		$(".classGraphic").each(function(){
			var ref2= $(this).attr("varName");
			if(varInicial==''){
						varInicial=ref2;
			}
			$(this).click(function(){
				var ref= $(this).attr("varName");
				$('.analysisCard_varSelected').each(function(){
					$(this).removeClass("analysisCard_varSelected");
					})
				$('div[varName="'+ref+'"]').addClass("analysisCard_varSelected");
				obj.varActive = ref;
				obj.runTimerGraph(obj.currentData.varData[ref],ref);
				//obj.creaGrafica(obj.currentData.varData[ref],ref);
		    });
		
		});
		
		$(".analysisCell .spriteClose").each(function(){
			$(this).click(function(event){
					var eliminar=$(this).attr('selectDelete');
					var Item = $(this).attr('Item');
					obj.deletEdo(Item);
					$('div[refDelete="'+eliminar+'"]').remove();
					obj.runTimerGraph(obj.currentData.varData[obj.varActive],obj.varActive);
					//obj.creaGrafica(obj.currentData.varData[obj.varActive],obj.varActive);
					event.preventDefault();
					obj.deletePoligono();
				});
			
		});
		
		$('.analysisCell.cveMpio').each(function(){
			$(this).click(function(){
					var cve=$(this).attr('cveGeo');
					obj.requestPoligono(cve);
				});
		})
		
		$('div[varName="'+varInicial+'"]').addClass("analysisCard_varSelected");
		obj.varActive = varInicial;
		obj.runTimerGraph(obj.currentData.varData[varInicial],varInicial);
		//obj.creaGrafica(obj.currentData.varData[varInicial],varInicial);
		
		var width=$("#"+id_source+'_data .tab-mpio-container').width()+
		$("#"+id_source+'_data .tab-participacion-container').width()+
		$("#"+id_source+'_data .tab-personal-container').width()+
		$("#"+id_source+'_data .tab-analiticas-container').width();
		$("#"+id_source+'_data').css('width', width+'px');
	},
	
	
	   verificaEdos:function(mpio){
		var obj=this;
		var edos= obj.currentData.edoList;
		var exist=false;
		for(var x in edos){
			var i = edos[x];
			var Item = (edos[x].label)?edos[x].label:edos[x].name;
			if(Item==mpio){
				exist=true;
				break;
				
			}
		}
		return exist;
	},
	
	
	//tempGrafica:function(){
	//	var obj=this;
	//	obj.runTimerGraph(obj.currentData.varData[obj.varActive],obj.varActive);	
	//		
	//	},
	
	
	creaGrafica:function(data, variableName){
		var obj=this;
		var temporal=[];
		var varActive=obj.varActive;
		var type = obj.getType(varActive);
		var varSelected=obj.getvarValues(type, varActive);
		var edosyMun=[];
		var infoGraph=[];
		
		for( var x in data){
			if(obj.verificaEdos(data[x][0])){
				if(parseFloat(data[x][1])>0){
					temporal.push(data[x]);
					edosyMun.push(data[x][0]);
				}
				
			}
		}
		
		for (var x in obj.options.anio){
			var currentYear=obj.options.anio[x];
			
			var tempData=[];
			
			for(var y in edosyMun){
				var currentEdos= edosyMun[y];	
				tempData.push(obj.databyYear[currentYear][currentEdos][variableName])
			}	
			infoGraph.push({name:currentYear, data:tempData});
			
		}
		
		$('.analysisCard_graphic').highcharts({
				chart: {
					type: 'column'
				},
				title: {
					text: varSelected.nombre,
					style:{ "color": "#333333", "fontSize": "12px" }
				},
				subtitle: {
					text: ''
				},
				xAxis: {
					categories: edosyMun,
					crosshair: true
				},
				yAxis: {
					min: 0,
					//max:50,
					title: {
						text: variableName
					}
				},
				credits:{
					enabled:false
				},
				legend: {
					enabled: false
				},
				//yAxis:{max:valor}

				tooltip: {
					headerFormat: '<table>',//'<span style="font-size:10px">{point.key}</span><table>',
					pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
						'<td style="padding:0"><b>{point.y}</b></td></tr>',
					footerFormat: '</table>',
					shared: true,
					useHTML: true
				},
				plotOptions: {
					column: {
						pointPadding: 0.2,
						borderWidth: 0
					}
				},
				series: infoGraph
			});
	
	
		/*
			$('.analysisCard_graphic').highcharts({
			chart: {
				type: 'column'
			},
			title: {
				text: varSelected.nombre,
				style:{ "color": "#333333", "fontSize": "12px" }
			},
			subtitle: {
				text: ''
			},
			credits:{
				enabled:false
			},
			xAxis: {
				type: 'category',
				labels: {
					
					style: {
						fontSize: '10px',
						fontFamily: 'Verdana, sans-serif'
					}
				}
			},
			yAxis: {
				min: 0,
				title: {
					text: variableName
				}
			},
			legend: {
				enabled: false
			},
			tooltip: {
				pointFormat: variableName+': <b>{point.y}</b>'
			},
			series: [{
				name: 'Population',
				data: temporal,
				dataLabels: {
					enabled: false,
					rotation: -90,
					color: '#FFFFFF',
					align: 'right',
					format: '{point.y:.1f}', // one decimal
					y: 10, // 10 pixels down from the top
					style: {
						fontSize: '10px',
						fontFamily: 'Verdana, sans-serif'
					}
				}
			}]
		});
	*/
	},
	
	contentTabulado:function(data){
		var obj=this;
	},
	
	
	
	buildAnalysisCard:function() {
		var obj=this;
		var vals= obj.options.getGralValues();
		var cadena = '';
		for (var x in obj.headerData){
				if(x<1){
				cadena+='<div class="infoCard_dataRow" style="height:14px">'+
								'<div id="geographical_title" class="infoCard_option_title">'+obj.headerData[x].title+'</div>'+
								'<div id="geographical_data" class="infoCard_data">'+obj.headerData[x].data+'</div>'+
						  '</div>';
				}	
		}
		var chain='<div class="analysisCard_geographic">'+
				  		
							'<div class="analysisCard_arrow sprite_infoCard spriteBackArrow"></div>'+
							'<div class="infoCard_resumeContainer">'+
									
										'<div class="infoCard_varTitle" style="  margin-left: 30px !important;">'+vals.var.label+'</div>'+
									
										'<div class="infoCard_sectores">'+
											'<div class="infoCard_granSector">'+((vals.gs.label=='Todos')?vals.gs.title:vals.gs.label)+'</div>'+
											'<div class="infocard_sectorData">'+
												'<div class="infoCard_sector">'+vals.s.label+'</div>'+
											'</div>'+
											'<div class="infocard_sectorData">'+	
												'<div class="infoCard_subsector">'+vals.ss.label+'</div>'+
											'</div>'+
										'</div>'+//fin sectores
										'<div id="geographicalAnalysis" class="infoCard_dataSelect">'+
											cadena+
										'</div>'+ //fin data
								'</div>'+//fin resumen	
					
							
				  '</div>'+
				  
				   '<div class="analysisCard_menuBar">'+
				  		'<div id="analysisCard_personal" class="item_analysisCard_menuBar" style="margin-left: 10px;"><div id="personal_ocupado" class="option_menuBar">Personal ocupado</div></div>'+
						'<div id="analysisCard_unidades" class="item_analysisCard_menuBar"><div id="unidades_economicas" class="option_menuBar">Unidades econ&oacute;micas</div></div>'+
						'<div class="item_analysisCard_menuBar"><div id="descargar_indicadores" style="display:none" class="option_menuBar">Variables e indicadores completos</div></div>'+
				  '</div>'+
				  
				  '<div class="analysisCard_datosComparativos">'+
				  		'<div id="IndicatorNational" class="analysisCard_title">Nacional:'+
							'<div id="analysisCard_nacional" class="analysisCard_datoComparativo">5,256,563.22</div>'+
						'</div>'+
						'<div id="IndicatorState" class="analysisCard_title">Estado:<div class="analysisCard_datoComparativo">43,000</div></div>'+
						'<div id="PositionState" class="analysisCard_title">Posici&oacute;n: <div id="analysisCard_participacion" class="analysisCard_datoComparativo"></div></div>'+
				  '</div>'+
				  
				 
				  
				  '<div class="analysisCard_graphic"></div>'+
				  
				  '<div class="analysisCard_table">'+
				  		'<div type="1" id="personal_ocupado_data" class="analysisCard_tab"></div>'+
						'<div type="2" id="unidades_economicas_data" class="analysisCard_tab"></div>'+
				  '</div>'+
				  '<div class=btnAddGeo_position>'+
				  	'<button class="btn_addGeo" enable="false">Agregar &aacute;rea geogr&aacute;fica a comparar</button>'+
				'</div>'+
				'<div class="btn_export sprite_infoCard spriteDownload"></div>';
				
				 
				  
		 
		 
		 $("#analysisCard").html(chain);
		 $(".spriteBackArrow").click(function(){
			$("#analysisCard").hide();
			
		});	
		
		 $(".btn_export").click(function(){
			obj.exportaXLS();
			
		});	
			 
		
		 $(".option_menuBar").each(function(){
			 
			 $(this).click(function(){
				 var id= $(this).attr("id");
				 obj.enableOptionTab(id);
			})
		});
		
		 $(".analysisCard_tab").each(function(){
			 $(this).hide();
		});
		obj.enableOptionTab('personal_ocupado');
		
		$(".btn_addGeo").click(function(){
			
		
			var texto="Agregar &aacute;rea geogr&aacute;fica a comparar";
			var btnStatus=$(this).attr("enable");
			if(btnStatus=="true"){
				
				btnStatus="false";
				obj.currentStatus='';
				obj.currentStatus='';
				}else{
					 obj.currentStatus='geo';
					 obj.currentData.status='geo';
					  btnStatus="true";
					  var texto="Finalizar selecci&oacute;n";
					  
				}
			obj.switchStatus(btnStatus,'dialogInfoCard-minimize');
			$(this).attr("enable",btnStatus);
			$(".btn_addGeo").children().html(texto);
			
		});
		$(".btn_addGeo").button();
		
		
	},
	

	
	exportaXLS:function(){
		var obj=this;
		var vals = obj.options.getGralValues();
		var tempColumns=[];
		var response={title:'',columns:[], values:[]};
		var tabTitle = obj.currentData.edoList[0].cvegeo;
		var cont=1;
		
	    for(var x in obj.currentData.varData){
		var headerTable=x;
				
			if(cont==1){
				if(tabTitle.length <= 2){
					tabTitle="Estado";
				}
				  else{
					tabTitle="Municipio";
				  }
				headerTable=tabTitle;
				cont++;
			}
					 
			if((headerTable!='Municipio')&&(headerTable!='Participacion')){
				if(headerTable!='Estado'){
				   var type = obj.getType(headerTable);
				   var varSelected = obj.getvarValues(type, headerTable);
				   headerTable=varSelected.nombre;
				}
			}
			
				if(headerTable=='Participacion'){
					headerTable='Participación';
				}
				
				response.columns.push(headerTable);
				tempColumns.push(x);	 
		}
				
				
		for(var y in obj.currentData.edoList){
		var temp=[];
		var currentEdo=obj.currentData.edoList[0].label;
			for( var z in tempColumns){
			    var valor=obj.currentData.varData[tempColumns[z]][parseInt(y)][1];
				
				if((tempColumns[z]!='Municipio')&&(tempColumns[z]!='Participacion')){
					valor=(parseFloat(valor)<0)?"*":valor;
				}
				
				temp.push(valor);
			}
			
				response.values.push(temp);
				
		}
		
		response.title=currentEdo+' Censos Económicos 2014';
		response.values.push([""]);
		response.values.push(['fuente: Censos Económicos 2014']);
		
		
		obj.exportFicha(response);
	},
		
	
	eventos:function(){
		var obj=this;
		$(".spriteAnalysis").click(function(){
			obj.cont=0;
			$("#analysisCard").show();
			obj.buildAnalysisCard();
		});
		
			$(".spritePrint").click(function(){
				$("#nodos,#background_nodes").addClass('no-print');
			var html='<div style="position:absolute;left:25%;width:50%;">jjj</div>';
			obj.options.printControl.printHtml(html);
		});
	},
	
	
		getIdSector:function(){
			var obj=this;
			var vals= obj.options.getGralValues();
			var sector = (vals.ss.id != '')?vals.ss.id:(vals.s.id != '')?vals.s.id:vals.gs.id;
			return sector;
			
		},
	
	
	enableOptionTab:function(id){
			var obj=this;
			var clase ='option_menuBar_selected';
			var idold=$('.'+clase).attr('id');
			$('.'+clase).removeClass(clase);
			$("#"+id).addClass(clase);
			
			if(idold){
				$('#'+idold+'_data').hide();  
				
			}                 
			$("#"+id+'_data').show();
			
			obj.currentData.type=$("#"+id+'_data').attr('type');
			
			
			var vals= obj.options.getGralValues();
			var idSector=obj.getIdSector();
			var edos = obj.getEdos();
			
			var params={
				type: $("#"+id+'_data').attr('type'),
				ent: obj.currentData.geo.id,
				mun: edos,
				variable: vals.var.id,
			    id: idSector,
			    year: obj.options.anio[0]
				};
			
			obj.runTimerTab(params,id, 0, obj.options.anio);
			//obj.getdataTabulado(params,id);
			
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
		
		
		
//Colapsar ventana 

	 switchStatus:function(status, clase){
		 var obj=this;
		 $('.dialogInfoCard').removeClass('dialogInfoCard-minimize');
		 $('.dialogInfoCard').removeClass('dialogInfoCard-Small');
		 
		
		 
		if(status=="true"){ 
		   if(clase=='dialogInfoCard-Small'){
			   $('#btn_plegar').show();
			   $('#btn_ocultar').hide();
			  
			}
			var mainContainer = $('.dialogInfoCard').addClass(clase);
			$('.analysisCard_geographic ').css('display', 'none');
			$('.analysisCard_datosComparativos ').css('display', 'none');
			$('.analysisCard_menuBar').css('display', 'none');
			$('.analysisCard_graphic').css('display', 'none');
			$('.analysisCard_table').addClass('analysisCard_collapseWindow');
			$('.btnAddGeo_position').addClass('analysisCard_btnPosition');
			if(clase=='dialogInfoCard-minimize'){
					$('#btn_ocultar').hide();
			}
		}else{
			if(clase=='dialogInfoCard-Small'){
				$('#btn_plegar').hide();
				$('#btn_ocultar').show();
			}
			var mainContainer = $('.dialogInfoCard').removeClass(clase);
			$('.analysisCard_geographic ').css('display', '');
			$('.analysisCard_datosComparativos ').css('display', '');
			$('.analysisCard_menuBar').css('display', '');
			$('.analysisCard_graphic').css('display', '');
			$('.analysisCard_table').removeClass('analysisCard_collapseWindow');
			$('.btnAddGeo_position').removeClass('analysisCard_btnPosition');
			if(clase=='dialogInfoCard-minimize'){
					$('#btn_ocultar').show();
				}
			obj.runTimerGraph(obj.currentData.varData[obj.varActive],obj.varActive);
		}
		
	},
	  
	  
//FIN colapasar
			

		
		
		
//*****************************peticion para el tabulado*****************************************************//
getdataTabulado:function(params,id, contador, years){
		 var obj= this;
		  var o=obj.options.dataSources.ficha;
		  var request = {
			  type: o.type,
			  dataType: o.dataType,
			  url: o.url+'/graph/gransector',
			  data:((o.stringify)?JSON.stringify(params):params),
			  contentType:o.contentType,
			  success:function(json,estatus){
				var error=false;
				if(json){
						
						//if(contador<=years.length-1){
							
							if(obj.currentData.year == years[contador]){
								obj.buildTabulado(json, id);	
							}
							
							var vals= obj.options.getGralValues();
							var idSector=obj.getIdSector();
							var edos = obj.getEdos();
							obj.saveYears(json,id,years[contador]);
							contador++; 
							
							if(contador<=years.length-1){
								
								var params={
									type: $("#"+id+'_data').attr('type'),
									ent: obj.currentData.geo.id,
									mun: edos,
									variable: vals.var.id,
									id: idSector,
									year: years[contador]
									};
							
							obj.getdataTabulado(params, id, contador, years);
							
							
							}
						
						
						
				}else{
					error=true
				}
				if(error){
					alert("no valido")
				}
			  },
			  beforeSend: function(solicitudAJAX) {
				
			  },
			  error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
				
			  },
			  complete: function(solicitudAJAX,estatus) {
			  }
		   };
		   
		   $.ajax(request);
		},

//*******************************Función para guardar los años para graficar****************************************************************************//		
	
saveYears:function(data,id_source, anio){
	
	var obj=this;
	var entidad="";
	var position=0;

	if(!obj.databyYear[anio]){
		obj.databyYear[anio]={};
	}	
	
	for(var x in data){
		if(data[x].label=="elements"){
			position=parseInt(x);
		}		
	}
	
	for (var x in data[position].value){
		    var fields=data[position].value[x].fields;
			for (var y in fields){
				if (y==0){
					entidad=fields[y].value;
					if(!obj.databyYear[anio][entidad]){
						obj.databyYear[anio][entidad]={};
					}	
				}
				if(y>=2){
					var varName=fields[y].label;
					var varValue=fields[y].value;
					if(!obj.databyYear[anio][entidad][varName]){
						obj.databyYear[anio][entidad][varName]=varValue;
					}	
				}
				
				
			}
	}
			
	

},	
		
		
		
//*****************************peticion para pintar el polígono*****************************************************//
requestPoligono:function(clave){
		  var obj= this;
		  var o=obj.options.dataSources.getGeo;
		  var request = {
			  type: o.type,
			  dataType: o.dataType,
			  url:o.url+'/'+clave,
			  data:((o.stringify)?JSON.stringify(params):params),
			  contentType:o.contentType,
			  success:function(json,estatus){
				var error=false;
				if(json){
						obj.pintaPoligono(json.data.geometry);
				}else{
					error=true
				}
				if(error){
					alert("no valido")
				}
			  },
			  beforeSend: function(solicitudAJAX) {
				
			  },
			  error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
				
			  },
			  complete: function(solicitudAJAX,estatus) {
			  }
		   };
		   
		   $.ajax(request);
		},

//***********************************************************************************************************//		
		
//*****************************peticion para el exportacion*****************************************************//
exportFicha:function(params){
		  var obj= this;
		  var o=obj.options.dataSources.exportFicha;
		  var a=obj.options.dataSources.descargaTabla;
		  var request = {
			  type: o.type,
			  dataType: o.dataType,
			  url: o.url,
			  data:((o.stringify)?JSON.stringify(params):params),
			  contentType:o.contentType,
			  success:function(json,estatus){
				var error=false;
				if(json.response.success){
					//$.get( o.url+'/xls/'+json.data.id);
						//window.open(o.url+'/xls/'+json.data.id);
						$('#descarga_tabulado').remove();
						var cadena = '<form id="descarga_tabulado" action="'+a.url+json.data.id+'" method="'+a.type+'" enctype="multipart/form-data" style="display:none">'+
											'<input type="submit" value="Submit">'+
									'</form>';
						$("body").append(cadena);
						$('#descarga_tabulado').submit();
						
				}else{
					error=true
				}
				if(error){
					alert("no valido")
				}
			  },
			  beforeSend: function(solicitudAJAX) {
				
			  },
			  error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
				
			  },
			  complete: function(solicitudAJAX,estatus) {
			  }
		   };
		   
		   $.ajax(request);
		},

//***********************************************************************************************************//		

		marker:function(){
			var obj=this;
			MDM6('hideMarkers','identify');
			var datos=obj.options.getGralValues();
			var punto=datos.point;
			punto=punto.replace('POINT(','');
			punto=punto.replace(')','');
			punto=punto.split(' ');
			var parametros = {lon:punto[0],lat:punto[1],type:'identify',params:{nom:'Censos Econ&oacute;micos 2014',desc:'',image:'CE2'}};
			MDM6('addMarker',parametros);
		},
	
		
		
// the constructor

    _create: function() {
		var obj = this;
        obj.buildStructure();
		obj.getFicha();
		obj.eventos();
		obj.currentData.jsonVar=obj.options.getVarsData();
		var vals = obj.options.getGralValues();
		obj.currentData.year=vals.years[vals.yearPos];
		
		
		obj.marker();
		
    },


    // called when created, and later when changing options
    _refresh: function() {
        // trigger a callback/event
        this._trigger("change");
    },
    // revert other modifications here
    _destroy: function() {
		var obj = this;
		obj.currentData.edoList=[];
		obj.varActive='';
		obj.currentData.varData=null;
		obj.currentData.varData={};
		obj.deletePoligono();
		$('#'+obj.element.attr('id')+'_dialog').dialog('destroy').remove();
		
        //this.options.close();
        //this.element.remove();
    },

    // _setOptions is called with a hash of all options that are changing
    // always refresh when changing options
    _setOptions: function() {
        // _super and _superApply handle keeping the right this-context
        this._superApply(arguments);
        this._refresh();
    },

    // _setOption is called for each individual option that is changing
    //aquí pegué lo que me dijo many 
    _setOption: function(key, value) {

        this.options[key] = value;
        switch (key) {
            case "data":
		
		}
    }
});

//fin de lo que pegué que many me dijo que pegara