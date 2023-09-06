$.widget( "custom.detailCluster", {
	  options:{
                  sides:['right','left','top','bottom'],  
                  size:{
                    height:300,
                    width:250
                  },
                  data:null,
                  events:{
                    hover:$.noop,
                    out:$.noop
                  },
                  parent:null,
                  title:null
          },
	  _init:function(){
                    this.element.css({'display':''});
	  },
          getSections:function(){
                    var chain='';
                    for(var x in this.options.data){
                              var i = this.options.data[x];
                              var nom = i.name;
                              var title ='';
                              if(nom.length>50){
                                        nom = (nom.substring(0,50))+ '...';
                                        title ='title="'+i.name+'"';
                              }
                              var id = "detail_"+i.id+"i";
                              chain+='<div id="'+id+'" class="itemCluster" '+title+'>'+
                                        '<div class="icono" style="background:'+i.color+';" align="center"></div>'+
                                        '<p class="label">'+nom+'</p>'+
                                        '<div class="info">'+
                                                  '<div class="detailCluster_template info_cluster"></div>'+
                                        '</div>'+
                                     '</div>';
                    }
                    return chain;
          },
          getTitle:function(total,title){
                    var response = {title:title+''}
                    var limit=25;
                    var sufix='...';
                    var prefix = '('+total+') ';
                    if(title.length>limit){
                              response.alt=title+'';
                              response.title = title.substring(0,limit)+sufix;
                    }
                    response.title = prefix+response.title;
                    return response;
          },
          update:function(data){
                    var chain = this.getSections(data);
                   //$("#detailCluster .header").children('label').html('Establecimientos ('+data.length+')');
                   var infoTitle = this.getTitle(data.length,this.options.title);
                   var label = $("#detailCluster .header").children('label');
                   label.html(infoTitle.title);
                   if(infoTitle.alt){
                              label.attr('title',infoTitle.alt);
                   }else{
                              label.removeAttr('title');
                   }
                   $(".container .data").html(chain);
                   this.definePosition();
                   this.eventsToItems();
          },
	  buildStructure:function(){
                    var o = this.options;
                    var infoTitle = this.getTitle(this.options.data.length,o.title);
                    var chain='<div class="header" align="center">'+
                                        //'<label class="stablishments">Establecimientos ('+this.options.data.length+')</label>'+
                                        '<label class="stablishments" '+((infoTitle.alt)? ' title="'+infoTitle.alt+'" ':'')+'>'+infoTitle.title+'</label>'+
                                        '<div title="Cerrar" class="close_detail dinamicPanel-sprite dinamicPanel-close-short"></div>'+
                              '</div>'+
                              '<div class="container">'+
                                       '<div class="data">'+
                                                  this.getSections(o.data)+
                                        '</div>'+
                              '</div>';
                    this.element
                    .addClass('detailCluster')
                    .append(chain);
                    
                    this.definePosition();
	  },
          isValidPosition:function(params){
                    var map = $('body');
                    var limits = {left:0,right:map.width(),top:55,bottom:map.height()-26};
                    var valid = false;
                    if((params.left>=limits.left)&&(params.right<=limits.right)&&(params.top>=limits.top)&&(params.bottom<=limits.bottom)){
                              valid=true;
                    }
                    return valid;
          },
          definePosition:function(){
                    var obj = this;
                    var o = this.options;
                    var sides = o.sides;
                    var parent = $("#"+o.parent);
                    var itemSize = o.size;
                    var parentSize = {width:parent.width(),height:parent.height()};
                    var offsetParent=parent.offset();
                    var positions = {left:0,right:0,top:0,bottom:0};
                    var valid=true;
                    for(var x in sides){
                              switch(sides[x]){
                                        case 'right':
                                                  positions={
                                                            left:offsetParent.left+parentSize.width,
                                                            right:offsetParent.left+parentSize.width+o.size.width,
                                                            top:offsetParent.top,
                                                            bottom:offsetParent.top+o.size.height
                                                  };
                                                  break;
                                        case 'left':
                                                  positions={
                                                            left:offsetParent.left-o.size.width,
                                                            right:offsetParent.left,
                                                            top:offsetParent.top,
                                                            bottom:offsetParent.top+o.size.height
                                                  };
                                                  break;
                                        
                                        case 'top':
                                                  positions={
                                                            left:offsetParent.left+((parentSize.width-o.size.width)/2),
                                                            right:(offsetParent.left+parentSize.width)-((parentSize.width-o.size.width)/2),
                                                            top:offsetParent.top-o.size.height,
                                                            bottom:offsetParent.top
                                                  };
                                                  break;
                                        case 'bottom':
                                                  positions={
                                                            left:offsetParent.left+((parentSize.width-o.size.width)/2),
                                                            right:(offsetParent.left+parentSize.width)-((parentSize.width-o.size.width)/2),
                                                            top:offsetParent.top+parentSize.height,
                                                            bottom:offsetParent.top+parentSize.height+o.size.height
                                                  };
                                                  break;
                              }
                              valid = (this.isValidPosition(positions))?true:false;
                              if(valid){
                                      break;  
                              }
                    }
                    if(valid){
                              this.element.css({left:positions.left+'px',top:positions.top+'px',width:o.size.width+'px',height:o.size.height+'px'});
                    }
          },
          eventsToItems:function(){
                    var obj=this;
                    var data = this.options.data;
                    var cont=0;
                    $(".detailCluster .data .info").each(function(){
                              var item =  data[cont];
                              $(this).click(function(){
                                        MDM6('showRecordCard',{id:item.id,color:item.color});                                        
                              });
                              cont+=1;
                    });
                    cont=0;
                    $(".itemCluster").each(function(){
                              var item =  data[cont];
                              $(this).mouseenter(function(){
                                        $("#cluster_"+item.id).css('stroke','white').css('stroke-width',5);
                              }).mouseleave(function(){
                                        $("#cluster_"+item.id).css('stroke','').css('stroke-width','');
                              });
                              cont+=1;
                    });     
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
                    $('#detailCluster .header .close_detail').click(function(){
                              $("#detailCluster").css({'display':'none'});
                    });
                    
          },
      
          _create: function() {
		this.buildStructure();
                this.events();
                this.eventsToItems();
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
                                        case 'title':
                                                  this.options.title=value;
                                        break;
                                                          
                              }
		    }
	  }
);