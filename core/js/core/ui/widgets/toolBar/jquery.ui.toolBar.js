$.widget( "custom.toolBar", {
      id:'',
	  buttons:[		
					// {id:'contact',
		  		// 	sprite:'mdm-toolBar mdm-toolBar-icon-contact',
					// title:'Atenci&oacute;n a usuarios',
			  	//   	},
	  				{id:'print',
		  			sprite:'mdm-toolBar mdm-toolBar-icon-print',
					title:'Imprimir la vista actual'
			  	  	},
					{id:'share',
		  			sprite:'mdm-toolBar mdm-toolBar-icon-share',
					title:'Compartir la vista actual'
			  	  	},
					{id:'download',
		  			sprite:'mdm-toolBar mdm-toolBar-icon-download',
					title:'Descarga'
			  	  	}
				   ],
      // default options
      options: {
		  btnStatus:{print:true,share:true,download:true},
		  onAction:function(id){}
      },
      // the constructor
      _create: function() {
        var obj = this;
        obj.id = obj.element.attr('id');
        
        this.element
          // add a class for theming
          .addClass("custom-toolBar no-print")
          // prevent double click to select text
          .disableSelection();
          
		var btns = obj.buttons;
		var cadena = '';
		var conf = obj.options.btnStatus;
		for (var x in btns){
			var btnConf = conf[btns[x].id];
			var enabled = (btnConf === undefined || btnConf == true);
			if (enabled)
				cadena+='<div id="'+obj.id+'_'+btns[x].id+'" idref="'+btns[x].id+'" class="custom-toolBar-btn"><span class="'+btns[x].sprite+'" title="'+btns[x].title+'"></span></div>';
		}
        obj.element.html(cadena);
		$('.custom-toolBar-btn').each(function(index, element) {
            $(this).click(function(){
				obj.options.onAction($(this).attr('idref'));
			});
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
          .removeClass( "custom-toolBar" )
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