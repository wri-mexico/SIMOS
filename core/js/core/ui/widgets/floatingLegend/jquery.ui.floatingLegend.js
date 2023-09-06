$.widget( "custom.floatingLegend", {
      id:'',
      // default options
      options: {
      },
      // the constructor
      _create: function() {
        var obj = this;
        obj.id = obj.element.attr('id');
        
        this.element
          // add a class for theming
          .addClass( "custom-floatingLegend floatingLegend-shadow" )
          // prevent double click to select text
          .disableSelection();
		  var 	cadena = '	<div id="'+obj.id+'closeBtn" class="floatingLegend-slideBtn" title="Cerrar"><span class="floatingLegend-sprite floatingLegend-slide"></span></div>';
				cadena+= '	<div id="'+obj.id+'_content" class="floatingLegend-container"></div>';
		
		 obj.element.html(cadena);
		 $('#'+obj.id+'closeBtn').click(function(){obj.close()});
        this._refresh();
      },
 
      // called when created, and later when changing options
      _refresh: function() {
        // trigger a callback/event
        this._trigger( "change" );
      },
 	  open:function(){
		var obj = this;
		//if (obj.element.position().left > $(window).width())
			obj.element.animate({'right':'0px'});
	  },
	  close:function(){
		var obj = this;
		//if (obj.element.position().left > $(window).width())
			obj.element.animate({'right':'-200px'});
	  },
	  bringToFront:function(){
		var obj = this;  
		obj.element.addClass('floatingLegend-bringToFront');
	  },
	  sendToNormalPosition:function(){
		var obj = this;  
		obj.element.removeClass('floatingLegend-bringToFront');
	  },
      // events bound via _on are removed automatically
      // revert other modifications here
	  changeContent:function(text){
		  var obj = this;
		  $('#'+obj.id+'_content').html(text);
	  },
      _destroy: function() {
        // remove generated elements
        this.changer.remove();
 
        this.element
          .removeClass( "custom-floatingLegend" )
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