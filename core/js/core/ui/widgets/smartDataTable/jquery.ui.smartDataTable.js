$.widget( "custom.smartDataTable", {
	  paintType:'clear',
      // default options
      options: {
		//admin
		canWrite:false,
		//recordCount
		recordCount:0,
        //title
        title:'Resultados',
        //sections
        displayHeader:true,
        displayFooter:true,
        //search params
        searchParams:{urlData:'',pageSize:20,page:1}, //parametros iniciales
		extraParams:{}, //parametros fijos que no se alteran en las peticiones
        data:null,
		dataType:'JSON',
		postType:'POST',
		pageParamLabel:'page',
		stringify:false,
        //buttons
        buttons:[],
        //style
        pagination:{active:true,pagesBlockNum:5},
        width:'fit', //fit
        height:'fit',//fit
        displayType:'list',
        tableType:{tableStyleClass:'smartTableDefault'},
		//json options
		successBan:'success',
		dataPos:'data',
        convertData:function(data){return data;},
		jsonXhrFields: null,
        //functions
        change: function(status,id){},
        dataBeforeQuery:function(){},
        dataCompleteQuery:function(){},
        dataSucess:function(data){},
        dataError:function(description, exeption){},
		buttonAction:function(name,value,opc){},
		spinnerImg:function(opc){}
      },
	  _recordCount:function(){
		return this.options.recordCount;
	  },
      _create: function() {
        var obj = this;
        obj.element.parent().css('position','absolute');
		obj.element.attr("assigned",true);
        var options = obj.options;
        var cWidth = (options.width == 'fit')?'left:0px;right:0px;':(typeof(options.width)=='string')?'width:'+(options.width+'%;'):'width:'+options.width+'px;';
        var cHeight = (options.height == 'fit')?'top:0px;bottom:0px;':(typeof(options.height)=='string')?'height:'+(options.height+'%;'):'height:'+options.width+'px;';
        obj.element.attr('style','position:absolute;'+cWidth+cHeight);
        
        //var container = '<div style="position:absolute;border:1px solid #999;left:0px;right:0px;top:0px;height:'+obj.element.height()+'px;">';
        var id = obj.element.attr('id');
        var header = (obj.options.displayHeader)?'<div id="'+id+'_header" class="smartTableHeader" style="position:absolute;left:0px;right:0px;top:0px;height:35px;"></div>':'';
        var footer = (obj.options.displayFooter)?'<div id="'+id+'_footer" style="position:absolute;left:5px;right:17px;bottom:0px;text-align:right;height:20px;"></div>':'';
        var body = '<div id="'+id+'_tableContainer" style="position:absolute;left:0px;right:0px;top:'+((obj.options.displayHeader)?'35':'0')+'px;bottom:'+((obj.options.displayFooter)?'22':'0')+'px;overflow:auto"></div>';
        obj.element.html(header+body+footer);
        
		 //inicia la busqueda desde pagina 1 limpiado resultados existentes
		obj.initSearch(); 
        this._refresh();
      },
	  getParams:function(){
		var obj = this;
		var params = obj.options.extraParams;
		//params['searchCriteria'] = obj.options.searchParams.searchCriteria;
		//params['limit'] = obj.options.searchParams.pageSize;
		params[obj.options.pageParamLabel] = obj.options.searchParams.page;
		return params;
	  },
	  initSearch:function(page,options){
		var obj = this;
		obj.options.searchParams.page = (typeof(page) != 'undefined')?page:obj.options.searchParams.page;
		obj.paintType = (/clear|append/.test(options))?options:'clear';
		obj.getData(obj.options.searchParams.urlData, obj.getParams());		
	  },
      // called when created, and later when changing options
      _refresh: function() {
        var obj = this;
        var tabla = '';
		var paginacion = '';
		var footer = '';
        if (obj.options.data != null){
            if (obj.dataType != 'array'){
				obj.options.searchParams.page = obj.options.data.currentPage;
				obj.options.searchParams.pageSize = obj.options.data.pageSize;
				
				tabla = obj.processData(obj.options.data);
				paginacion = (obj.options.displayHeader)?obj.createPagination(obj.options.data):'';
				footer = (obj.options.displayFooter)?obj.createFooter(obj.options.data):'';
            }else{
                
            }
        }
        if (obj.paintType == 'clear'){
			$("#"+obj.element.attr('id')+'_tableContainer').html(tabla);
		}else{
			$("#"+obj.element.attr('id')+'_tableContainer').append(tabla);
		}
		
		$("#"+obj.element.attr('id')+'_header').html(paginacion);
		$("#"+obj.element.attr('id')+'_footer').html(footer);
		
		obj.assignUI();
        this._trigger( "change" );
      },
	  assignUI:function(){
		var obj = this;
		//accion para botones en registros
		$(".smartbtn").each(function(){
			$(this).click(function(e){
				var idRef = $(this).attr('idref');
				var field = $(this).attr('name');
				var id = $("#menu_"+field+"_"+idRef+" option:selected").val();
				obj.options.buttonAction(id,field);
				e.stopPropagation();
			})
		})
		$(".smartTableUIButton").each(function(){
								if (typeof($(this).attr('assigned')) == 'undefined'){
									$(this).attr('assigned',true);
									$(this).click(function(e){
										var id = $(this).attr('idref');
										var action = $(this).attr('action');
										var field = $(this).attr('field');
										var opc = $(this).attr('opc');
										obj.options.buttonAction(id,action,opc);
										e.stopPropagation();	
									});
									
								}
		});
		
		$('.'+obj.element.attr('id')+'_record').each(function(){
			$(this).click(function(e){
				var idRef= $(this).attr('idref');
				obj.options.buttonAction(idRef,'record');
				e.stopPropagation();
			})	
		})
		$("#"+obj.element.attr('id')+" .comboSmartTable").each(function(){
			$(this).click(function(e){
				e.stopPropagation();	
			}).change(function(){
				var idRef= $(this).attr('idref');
				var label= $(this).attr('label');
				var opc = $(this).val();
				obj.options.buttonAction(idRef,label,opc);
			});
			
		});
		$('.smartTablePaginationItem').each(function(){
			if (typeof($(this).attr('asigned')) == 'undefined'){
				$(this).attr('asigned',true);
				var displayText = (typeof($(this).attr('notext')) != 'undefined');
				var icon = (typeof($(this).attr('icon')) != 'undefined')?{primary:$(this).attr('icon')}:{};
				$(this)//.button({icons:icon,text:displayText})
				       .click(function(e){
					if (!$(this).hasClass('ui-state-hover')){
						var page = parseInt($(this).attr('page'),10);
						obj.initSearch(page);
					}
					e.stopPropagation;
				});
			}
		});
		
		
	  },
      // events bound via _on are removed automatically
      // revert other modifications here
      _destroy: function() {
	   //this.changer.remove();
       this.element.html();
       this.element.attr('css','');
	   this.element.removeAttr('assigned');
	   this.element.removeAttr('recordCount');
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
        //this._super( key, value );
      },
	  createFooter:function(data){
		var obj = this;
		var idElement = obj.element.attr('id');
		var regIni = (data.recordCount > 0)?((data.currentPage*data.pageSize)-(data.pageSize-1)):0;
		var regFin = (regIni > 0)?regIni+(data.value.length-1):0;
		var cadena = regIni+'-'+regFin+'/<b>'+data.recordCount+'</b>';
		return cadena;
	  },
	  createPagination:function(data){
		var obj = this;
		var cadena = '';
		if(data.value){
			var idElement = obj.element.attr('id');
			var totalReg = data.recordCount;
			var currentRegNum = data.value.length;
			var pageNumReg = data.pageSize;
			var currentPage = data.currentPage;
			
			var cantPages = obj.options.pagination.pagesBlockNum;
			var middle = Math.ceil(cantPages/2);
			
			var numPages = ((totalReg % pageNumReg) == 0)?totalReg/pageNumReg:Math.floor(totalReg/pageNumReg)+1;
			var pageIni = (numPages > cantPages)?(currentPage > middle)?(currentPage-(middle-1)):1:1;
			var pageEnd = (numPages > cantPages)?(numPages-currentPage > (middle))?(currentPage <= (middle-1))?pageIni+(cantPages-1):currentPage+(middle-1):numPages:numPages;
			var regIni = (currentPage * pageNumReg-(pageNumReg-1));
			var regEnd = ((currentPage * pageNumReg)-pageNumReg)+currentRegNum;
			
			var prevSet = (pageIni > 1)?'<div page="'+(pageIni-1)+'"  notext="notext" id="'+idElement+'page'+(pageIni-1)+'" icon="" class="smartTablePaginationItem"><span class="ui-icon ui-icon-triangle-1-w"></span></div>':'';
			var nextSet = (numPages > pageEnd)?'<div  page="'+(pageEnd+1)+'"  notext="notext" id="'+idElement+'page'+(pageEnd)+'" icon="" class="smartTablePaginationItem"><span class="ui-icon ui-icon-triangle-1-e"></span></div>':'';
			
			
			for (var x = pageIni; x <= (pageEnd); x++){
				var sel = (x == currentPage)?'ui-state-hover':'';
				var viewed = (x == currentPage)?'viewed="true"':'';
				
				cadena+='<div  page="'+x+'" id="'+idElement+'page'+x+'" class="'+sel+' smartTablePaginationItem">'+x+'</div>';
			}
			
			cadena='<div style="position:absolute;left:5px;right:5px;bottom:6px;text-align:center;display:block; height:20px;"><span id="paginationSearch" numPages="'+numPages+'">'+prevSet+cadena+nextSet+'</span></div>'
		}
		return cadena;
	  },
      filterFields:function(fieldId,field){
		var obj = this;
		var idMain = obj.element.attr('id');
		var tipo = field.label.split('_')[1];
		var name = field.label.split('_')[2];
		var sprite = field.sprite;
		var result = {type:'',value:''};
		if (field.label != '_id'){
			var label = '';
			switch (tipo){
				case 'btn':
					  var value = {title:field.text,sprite:sprite,action:name,opc:field.value};
					  result = {type:'btn',value:value};
					break;
				case 'hidden':
					  var value = name+' = "'+field.value+'" ';
					  result = {type:'attr',value:value};
					break;
				case 'menu':
					  var text = field.text;
					  var label = field.label;
					  var list = field.list;
					  var combo = '';
					  if (list.length > 0){
						var btn = '';
						  
						  for(var x =0;x < list.length;x++){
							var sel = ''
							if (x == 0){
								sel = ' selected="selected" ';
								btn = (obj.options.canWrite)?'<button idref="'+fieldId+'" class="smartbtn" name="'+name+'" id="menubtn_'+name+'_'+fieldId+'">'+list[x].command+'</button>':'';
							}
							
							var lab = list[x].label;
							var val = list[x].value;
							combo+= '<option  '+sel+' value="'+val+'" >'+lab+'</option>';
						  }
						  btn = (btn == '')?text:btn;
						
						combo = '<select idref="'+fieldId+'" label="'+name+'" id="menu_'+name+'_'+fieldId+'" class="menuSmartTable">'+combo+'</select>';
						combo = '<div class="smartTableLabel">'+btn+'</div>'+combo;
					  }else{
						combo = '<div class="smartTableLabel">'+field.text+'</div>';
					  }
					  result = {type:'dom',value:combo};
					break;
				case 'list':
					  var value = field.value;
					  var text = field.text;
					  var label = field.label;
					  var list = field.list;
					  var combo = '';
					  if (obj.options.canWrite){
						for(var x =0;x < list.length;x++){
						  var lab = list[x].label;
						  var val = list[x].value;
						  
						  var sel = (val == value)?'selected="selected"':'';
						  combo+= '<option '+sel+' value="'+val+'" >'+lab+'</option>';
						}
						combo = '<select idref="'+fieldId+'" label="'+name+'" id="combo_'+name+'_'+fieldId+'" class="comboSmartTable">'+combo+'</select>';
					  }else{
						for(var x =0;x < list.length;x++){
						  var lab = list[x].label;
						  var val = list[x].value;
						  if (val == value)
						    combo = '<label style="margin-left:3px;">'+lab+'</label>';
						}
					  }
					  combo = '<div class="smartTableLabel">'+field.text+'</div>'+combo;
					  
					  result = {type:'dom',value:combo};
					break;
			}
			
		}
		return result;
      },
      processData:function(data){
		var obj = this;
        var id = obj.element.attr('id');
        var cadena = '';
        var records = data.value;
        var headers ='';
		
		obj.recordCount = data.recordCount;
		obj.element.attr('recordCount',obj.recordCount);
		
			obj.options.buttonAction('','data',data);
			if (records && records.length > 0){
				for (var x = 0; x < records.length; x++){
					var incomeButtons = [];
					var record = records[x].fields;
					//obtiene encabezados
					if (headers == ''){
						for (var y = 0; y < record.length; y++){
							var label = record[y].label;
							if (label.substr(0,1) != '_'){
								headers+= '<th>'+label+'</th>';
							}
						}
						headers = '<thead><tr>'+headers+'</tr></thead>';
					}
					//obtiene registro
					var field = '';
					var id = '';
					var attr = '';
					for (var y = 0; y < record.length; y++){
						var label = record[y].label;
						var value = record[y].value;

						//console.log("Este es el value" + value)
						//console.log("Este es el label" + label)

						id = (label == '_id')?record[y].value:id;
						if (label.substr(0,1) != '_' && label=='nombre'){ //Se agrego la condicion para que solo muestre el campo de nombre
							var divStruc = '<div class="smartTableField"><div class="smartTableLabel">'+label+'</div><div class="smartTableValue">'+value+'</div></div>';
							var tdStruc = '<td>'+value+'</td>';
							field+= ((obj.options.displayType == 'list')?divStruc:tdStruc);
						}else{
							var specialField = obj.filterFields(id,record[y]);
							
							switch (specialField.type){
								case 'btn':
									value = specialField.value;
									incomeButtons.push(value)
									break;
								case 'dom':
									field+='<div class="smartTableField">'+specialField.value+'</div>';
								break;
								case 'attr': //es un atributo para el elemento
									value = specialField.value;
									attr+= ' '+value;
								break;
							}//incomeButtons.push(record[y])
						}
					}
					
					if (obj.options.displayType == 'list' && (obj.options.buttons.length > 0 || incomeButtons.length > 0 )  ){
						var min_height = (incomeButtons.length+obj.options.buttons.length)*18+10;
						//calcula altura de area contenedora minima
						var min_height = (min_height > 0)?'min-height:'+(((incomeButtons.length+obj.options.buttons.length)*19)+19)+'px !important;':'';
						
						var stringButtons = obj.createButtons(id, incomeButtons);
						//var buttons = obj.options.buttons;
						//var _buttons = '';
						//for (var z=0; z < buttons.length; z++){
						//    _buttons+= '<button action="'+buttons[z].action+'" idRef="'+id+'" class="smartTableUIButton '+buttons[z].sprite+'" alt="'+buttons[z].title+'" alt="'+buttons[z].sprite+'" ></button>';
						//}
						field= '<div class="smartTableFields ui-corner-all" style="'+min_height+'">'+field+'</div><div class="smartTableBtnArea">'+stringButtons+'</div>';
					}else{
						field= '<div>'+field+'</div>';
					}
					
							 
					var registry = (obj.options.displayType == 'list')?'<div idref="'+id+'" '+attr+' class="'+obj.element.attr('id')+'_record '+obj.options.tableType.tableStyleClass+'">'+field+'</div>':field;
					cadena+= registry;
					//for(var propertie in record) {
					//    console.log(propertie);
					//    var value = record[propertie];
					//    console.log(value);
					//}
				}
				cadena=(obj.options.displayType != 'list')?'<table class="'+obj.options.tableType.tableStyleClass+'">'+headers+'<tbody>'+cadena+'</tbody></table>':cadena;
			}
		
        return cadena;
      },
	  createButtons:function(idRef,newButtons){
		var obj = this;
		var buttons = [];
		$.extend(buttons, obj.options.buttons);
		$.merge(buttons,newButtons);
		var _buttons = '';
		for (var z=0; z < buttons.length; z++){
			var text = (buttons[z].sprite =='')?buttons[z].title:'';
			var sprite = (buttons[z].sprite !='')?buttons[z].sprite:'';
			_buttons+= '<span action="'+buttons[z].action+'" idRef="'+idRef+'" opc = "'+buttons[z].opc+'" field="'+buttons[z].name+'" class="smartTableUIButton '+sprite+'" alt="'+buttons[z].title+'" title="'+buttons[z].title+'" >'+text+'</span>';
		}
		return _buttons;
	  },
      getData:function(url,params){
			var obj = this;
		    
			if (obj.options.stringify)
				params = JSON.stringify(params);
				
            var id = obj.element.attr('id');
			var jsonObj = {
					  contentType : "application/json; charset=utf-8",
					  type: obj.options.postType,
					  dataType: obj.options.dataType,
					  //xhrFields:obj.options.jsonXhrFields,
					  url: url,
					  data: params,
					  success: function(json,estatus){
						json = obj.options.convertData(json);
						var success = json;
						if (obj.options.successBan!= ''){
							   var d_pos = obj.options.successBan.split('.');
							   for (x in d_pos){
								  success = success[d_pos[x]];
							   }
						}
						if (!success){
							json = null;
							obj.options.data = json;
						}else{
							var tdat = json;
							if (obj.options.dataPos!= ''){
							   var d_pos = obj.options.dataPos.split('.');
							   for (x in d_pos){
								  tdat = tdat[d_pos[x]];
							   }
							}
							obj.options.data = tdat;
						}
						
						obj._refresh()
					  },
					  beforeSend: function(solicitudAJAX) {obj.options.spinnerImg(true);obj.options.dataBeforeQuery()},
					  error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {obj.options.dataError(errorDescripcion,errorExcepcion)},
					  complete: function(solicitudAJAX,estatus) {obj.options.spinnerImg(false);obj.options.dataCompleteQuery()}
					};
					
				   if (obj.options.jsonXhrFields != null)
				   	jsonObj.xhrFields = obj.options.jsonXhrFields;
					
				   $.ajax(jsonObj);	
      },
	  _setOptions: function() {
        // _super and _superApply handle keeping the right this-context
        this._superApply( arguments );
        this._refresh();
      },
      // _setOption is called for each individual option that is changing
      _setOption: function( key, value ) {
		if (/searchParams|extraParams/.test(key)) {
			this.initSearch();
		}
        this._super( key, value );
		this._refresh();
      }
    });