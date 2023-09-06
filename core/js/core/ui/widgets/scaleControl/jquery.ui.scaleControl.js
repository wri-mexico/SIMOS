$.widget( "custom.scaleControl", {
      id:'',
      // default options
      options: {
        // callbacks
        change: null,
        random: null,
        onZoomIn:function(){
            
        },
        onExtent:function(){
            
        },
        onZoomOut:function(){
            
        }
      },
 
      // the constructor
      _create: function() {
        var obj = this;
        obj.id = obj.element.attr('id');
        this.element
          // add a class for theming
          .addClass( "custom-scaleControl no-print" )
          // prevent double click to select text
          .disableSelection();
          
          var cadena ='<div id="'+obj.id+'_zoomIn" class="custom-scaleControl-zoomin"><span class="scaleControl-sprite scaleControl-icon-zoomin"></span></div>';
              cadena+='<div id="'+obj.id+'_extent" class="custom-scaleControl-extent"><span class="scaleControl-sprite scaleControl-icon-extent"></span></div>';
              cadena+='<div id="'+obj.id+'_zoomOut" class="custom-scaleControl-zoomout"><span class="scaleControl-sprite scaleControl-icon-zoomout"></span></div>';
              
		  if(obj.options.isMobile){
			cadena+='<div id="'+obj.id+'_gps" class="custom-scaleControl-gps"><span class="scaleControl-sprite scaleControl-icon-gps"></span></div>';
                  }
                        cadena+='<div id="'+obj.id+'_pos" title="Mi ubicaci&oacute;n" class="custom-scaleControl-pos '+((!obj.options.isMobile)?' custom-scaleControl-pos-aditional ':'')+'"><span class="scaleControl-sprite scaleControl-icon-pos"></span></div>';	
		  
				          
          obj.element.html(cadena);
          
          $('#'+obj.id+'_zoomIn').click(function(e){
                  obj.options.onZoomIn();      
                  e.stopPropagation();
            });
          $('#'+obj.id+'_extent').click(function(e){
                  obj.options.onExtent();      
                  e.stopPropagation();
            });
          $('#'+obj.id+'_zoomOut').click(function(e){
                  obj.options.onZoomOut();      
                  e.stopPropagation();
            });
		  $('#'+obj.id+'_gps').click(function(e){
                  obj.options.onGps();      
                  e.stopPropagation();
            });
          $('#'+obj.id+'_pos').click(function(e){
                  obj.options.onPos();      
                  e.stopPropagation();
            });
          
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
        // remove generated elements
        this.changer.remove();
 
        this.element
          .removeClass( "custom-scaleControl" )
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
        // prevent invalid color values
        this._super( key, value );
      }
    });