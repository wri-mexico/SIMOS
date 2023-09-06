$.widget( "custom.detailCluster", {
          nodes:{},
	  options:{
		  controler:null,
                  size:{
                    height:300,
                    width:300
                  },
                  data:null,
                  parent:null,
                  events:{
                    hover:$.noop,
                    out:$.noop
                  }
          },
	  
	  show:function(){
		  
	  },
	  hide:function(){
		  
	  },

	  _init:function(){
		this.show();
		
	  },
          update:function(data){
                    var parent = this.options.parent;
                    var status = this.options.status;
                    var id = "detail_"+parent+"i";
                    switch(status){
                              case 'update':
                                        this.buildNode(id,data);
                                        break;
                              case 'show':
                                        id+='_children';
                                        this.showNode(id);
                                        break;
                              case 'hide':
                                        id+='_children';
                                        this.hideNode(id);
                                        break;
                    }
          },
          buildNode:function(id,data){
                    var chain='<div id="'+id+'_nodes">'+
                                        this.getSections(data)+
                              '</div>';
                    $("#"+id+'_children').append(chain);
          },
          showNode:function(id){
                    $("#"+id).css('display','');        
          },
          hideNode:function(id){
                    $("#"+id).css('display','none');        
          },
          getSections:function(){
                    chain='';
                    for(var x in this.options.data.children){
                              var i = this.options.data.children[x];
                              var nom = i.name;
                              if(nom.length>50){
                                        nom = (nom.substring(0,50))+ '...';
                              }
                              var id = "detail_"+i.id+"i";
                              chain+='<div id="'+id+'" class="itemCluster" title="'+i.name+'">'+
                                        '<div class="icono" style="background:'+i.color+';" align="center"><label>'+((i.size>1)?i.size:'')+'</label></div>'+
                                        '<div class="label">'+nom+'</div>'+
                                     '</div>'+
                                     '<div id="'+id+'_children" style="position:relative;left:20px;right:0px;"></div>';
                    }
                    this.nodes[id]={visible:true,children:i.size};
                    return chain;
          },
	  buildStructure:function(){
                    var o = this.options;
                    var segments=this.getSections(o.data[x]);
                    var chain='<div class="header" align="center"><label>Establecimientos ('+this.options.data.size+')</label></div>'+
                              '<div class="container">'+
                                       '<div class="data">'+
                                                  segments+
                                        '</div>'+
                              '</div>'+
                              '<div class="pleg">'+
                                        '<div></div>'+
                              '</div>';
                    this.element
                    .addClass('detailCluster')
                    .append(chain)
                    .css({width:o.size.width+'px',height:o.size.height+'px'})
	  },
          events:function(){
                    var obj = this;
                    this.element
                    .mouseenter(function(){
                              obj.options.events.hover();
                    })
                    .mouseleave(function(){
                              obj.options.events.out();
                    });
          },
      
          _create: function() {
            	var obj = this;
		obj.buildStructure();
                //obj.addEvents();
		
          },
	  
      
          _refresh: function(){
            // trigger a callback/event
            this._trigger( "change" );
          },
         
          _destroy: function() {
              this.element.remove();
          },
    
          _setOptions: function() {
            // _super and _superApply handle keeping the right this-context
            this._superApply( arguments );
            this._refresh();
          },
 
      
          _setOption: function(key, value){
                    this.options[key] = value;
                              switch(key){
                                        case "data":
                                                  this.update(value);
                                        break;
                                                          
                              }
		    }
	  }
);