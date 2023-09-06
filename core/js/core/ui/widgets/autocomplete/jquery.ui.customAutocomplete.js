$.widget( "custom.customAutocomplete", {
      //Inner vars
      resultsTimer:2000,
      results:{index:-1,list:[]},
      lastSearch:'',
      id:'',
      searchTimer:0,
      // default options
      options: {
        itemValue:null,
        urlService:'',
        dataType:'JSONP',
		postType:'POST',
        jsonCallbackName:'callback',
        jsonDataSource:'',
        timeToSearch:200,
        labelField:'',
        idField:'id',
        numResults:10,
        resultWidth:'100%',
        placeholder:'',
        onSelect:function(){}
      },
      //dataProcess
      processData:function(data){
        var obj = this;
        if (typeof(data) != 'undefined' && typeof(data.response) != 'undefinded'){
           var cadena = '';
           //obtiene fuente de datos en estructura de respuesta
           listData = data;
           if (obj.options.jsonDataSource != ''){
                  var d_pos = obj.options.jsonDataSource.split('.');
                  for (x in d_pos){
                     listData = listData[d_pos[x]];
                  }
           }
           //
           
           var list = [];
           var count = 0;
           for (var item in listData){
                var gid = listData[count][obj.options.idField]
                var field = obj.options.labelField;
                var elem = $.extend({},listData[count]);
                text = elem[field];
                elem['highlight']=text;
                elem['value']= text;
                
                var elemText = text.split(',');
                var labelText = (elemText.length > 0)?'<label style="clear:both;width:100%">'+elemText[0]+'</label>':'';
                for (var x = 1; x < elemText.length; x++){
                    labelText+= '<label style="font-size:80%;">'+elemText[x]+((x < elemText.length-1)?',':'')+'</label>';
                }
                
                list.push(elem);
                cadena+= '<div id="'+obj.id+'_'+gid+'" pos="'+count+'" class="customAutocomplete-resultItem">';
                cadena+= labelText;
                cadena+= '</div>';
                count++;
           }
           obj.results.index = -1;
           obj.results.list = list;
           
           if (cadena != ''){
            
                var top = obj.element.position().top;
                var heightWin = $(window).height();
                var resultPos = (((heightWin-top) > 350) || (top < 200))?'bottom':'top';
                
                $('#'+obj.id+'_results').removeClass('customAutocomplete-bottom')
                .removeClass('customAutocomplete-top')
                .addClass('customAutocomplete-'+resultPos);
            
                $('#'+obj.id+'_results').css('display','none');
                $('#'+obj.id+'_results').html(cadena).removeClass('customAutocomplete-hidde');
                $('#'+obj.id+'_results .customAutocomplete-resultItem').each(function(){
                   $(this).click(function(e){
                        var pos = parseInt($(this).attr('pos'),10);
                        obj.showDetail(pos);
                        e.stopPropagation();
                    }) 
                });
                
                $('#'+obj.id+'_results').fadeIn('fast');
                
           }else{
                $('#'+obj.id+'_results').html(cadena).addClass('customAutocomplete-hidde');
           }
        }else{
            $('#'+obj.id+'_results').html(cadena).addClass('customAutocomplete-hidde');
        }
     },
      //Input Control
      hiddeResults:function(){
        var obj = this;
        obj.results.list = [];
        obj.results.index = -1;
        $('#'+obj.id+'_results').html('');    
      },
      showDetail:function(pos){
        var obj = this;
        var gid = obj.results.list[pos][obj.options.idField];
        var desc = obj.results.list[pos][obj.options.labelField];
        
        obj.options.itemValue = obj.results.list[pos];
        obj.options.onSelect(obj.results.list[pos]);
        
        $('#'+obj.id+'_inputSearch').val(desc).focus();
        setTimeout(function(){
            obj.hiddeResults();
        },50);
     },
      navResults:function(key){
        var obj = this;
        
        if (obj.results.list.length > 0){
            var index = obj.results.index;
            var list = obj.results.list;
            var ban = false;
            switch(key){
                case 40: //flecha abajo
                       ban = true;
                       if (index < (list.length-1)){
                            index = index+1;
                       }else{
                            index = 0;
                       }
                    break;
                case 38:
                        ban = true;
                        if (index > 0){
                            index = index-1;
                            
                        }else{
                            index = list.length-1;
                        }
                    break;
                case 13:
                        if (index >= 0){
                            obj.showDetail(index);
                        }
                    break;
            }
            obj.results.index = index;
            if (ban){
               $('#'+obj.id+'_results .customAutocomplete-resultSelected').each(function(){
                    $(this).removeClass('customAutocomplete-resultSelected');
                });
               $('#'+obj.id+'_'+list[index].gid).addClass('customAutocomplete-resultSelected');
            }
        }
        
     },
     initSearch:function(text){
        var obj = this;
        obj.getData(obj.options.urlService,
        { //Params----------------------
            hl:true,
            'hl.fl':'description_autocomplete',
            'hl.simple.post':'</strong>',
            'hl.simple.pre':'<strong>',
            q:text,
            rows:10,
            wt:'json'
         }, 
        function(data){ //success
            obj.processData(data);
        },
        function(){}, //error
        function(){
            }, //before
        function(){
            }  //complete
        );
     },
      trackInput:function(){
        var obj = this;
        clearTimeout(obj.searchTimer);
        obj.searchTimer = setTimeout(function(){
            var text = $('#'+obj.id+'_inputSearch').val();
            if (text.length > 2 && text != obj.lastSearch){
                obj.lastSearch = text;
                obj.initSearch(text);
            }
        },obj.options.timeToSearch);
      },
      spinnerOn:function(status){
            var obj = this;
            if (status){
                $('#'+obj.id+'_inputSearch').addClass('customAutocomplete-spinner');
            }else{
                $('#'+obj.id+'_inputSearch').removeClass('customAutocomplete-spinner');  
            }
      },
      setInputText:function(id,callback){
        var obj = this;
        $('#'+id).bind("keypress", function(evt){
            var otherresult = 12;
            if(window.event != undefined){
                otherresult = window.event.keyCode;
            }
            var charCode = (evt.which) ? evt.which : otherresult;  

            if(charCode == 13 || charCode == 12){
                if (charCode==13)/*$("#"+idClick).click();*/
                if (charCode ==12 && evt.keyCode == 27){  //atrapa esc y limpia
                    setTimeout(function(){$('#'+id).val('');},50);
                }
            }else{
                var keyChar = String.fromCharCode(charCode);
                var keyChar2 = keyChar.toLowerCase();
                var re =   /[\u00E0-\u00E6\u00E8-\u00EB\u00EC-\u00EF\u00F2-\u00F6\u00F9-\u00FC\u0061-\u007a\u00f10-9 \-\,\.]/
                var result = re.test(keyChar2);
                result = (charCode == 8)?true:result;
                if (result){
                    if ($.isFunction(callback))callback();  
                }
                return result; 
                
            }
                                            
        }).keydown(function(e){
           if(e.which == 46 && $.isFunction(callback)){
                callback();
           }
           if(e.which == 27){
              setTimeout(function(){$('#'+id).val('');},50);
              obj.hiddeResults();
           }
           if(e.which == 38 || e.which == 40 || e.which == 13){obj.navResults(e.which);};
        });
     },
      // the constructor
      _create: function() {
        var obj = this;
        
        var currText = (obj.options.itemValue != null)?obj.options.itemValue[obj.options.labelField]:'';
        //this.element.disableSelection();
        obj.id = obj.element.attr('id');
        obj.element.addClass('custom-customAutocomplete').focusout(function(){
            setTimeout(function(){
                  obj.hiddeResults();
            },500)
        });
        
        var width = obj.element.width();
        var height = obj.element.height();
        
        var cadena = '<div class="customAutocomplete-container">';
            cadena+= '  <input id="'+obj.id+'_inputSearch" type="text" value="'+currText+'" style="font-size:'+obj.options.fontSize+'px;width:'+width+'px;height:'+height+'px">';
            cadena+= '  <div id="'+obj.id+'_results" class="customAutocomplete-results customAutocomplete-bottom customAutocomplete-hidde"></div>';
            cadena+= '</div>';
        
        obj.element.html(cadena).bind('mouseleave',function(){
            obj.resultTimer = setTimeout(function(){
                    obj.hiddeResults();
            },2000);
        }).bind('mouseenter',function(){
            clearTimeout(obj.resultTimer)
        });
        
        obj.setInputText(obj.id+'_inputSearch',function(){obj.trackInput()});
        this._refresh();
      },
 
      // called when created, and later when changing options
      _refresh: function() {
        
        // trigger a callback/event
        this._trigger( "change" );
      },
 
      // events bound via _on are removed automatically
      // revert other modifications here
      _destroy: function() {
        this.element
          .unbind('customAutocomplete')
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
        if ( /content/.test(key)) {
            $.extend(this.list,value);
          return;
        }
        this._super( key, value );
      },
      getData:function(url,params,callback,error,before,complete){
			var obj = this;
            $.ajax({
                   type: 'POST',
                   dataType: "jsonp",
                   url: url,
                   jsonp:obj.options.jsonCallbackName,
                   data: params,
                   //jsonCallback:'json.wrf',
                   success:function(json,estatus){callback(json,estatus)},
                   beforeSend: function(solicitudAJAX) {
                        obj.spinnerOn(true);
                        if ($.isFunction(before)){
                            before(params);
                        }
                   },
                   error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
                        if ($.isFunction(error)){
                            error(errorDescripcion,errorExcepcion);
                        }
                   },
                   complete: function(solicitudAJAX,estatus) {
                        obj.spinnerOn(false);
                        if ($.isFunction(complete)){
                            complete(solicitudAJAX,estatus);
                        }
                   }
                 });	
     }
});