define(['helperLabels'],function(helperLabels) {
$.widget( "custom.helper", {
	  options:{
                  rootMap:'panel-center',
                  rootHeader:'main'
                  
          },
	  _init:function(){
                    this.element.css({'display':''});
	  },
          prefix:'helper',
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
          getRowOptions:function(){
                    var chain = '';
                    chain +=  '<div class="helper_itemRow" style="bottom:50px;left:50px;">'+
                                        '<label></label>'+
                              '</div>'+
                              '<div class="helper_itemRow">'+
                                        '</div></div>'+
                              '</div>'+
                              '<div class="helper_itemRow">'+
                                        '</div></div>'+
                              '</div>'+
                              '<div class="helper_itemRow">'+
                                        '</div></div>'+
                              '</div>';
                              
                              
                    return chain;
          },
          
          getBlockTitles:function(){
                    var chain='';
                    for(var x in helperLabels.modal.options){
                              var item = x;
                              var options = helperLabels.modal.options[x];
                              
                              
                              chain+= '<div class="helper_block_'+item+'">';
                              for(var i in options){
                                        var align = ' align="center" ';
                                        if(i=='row'){
                                                  align = (options.row.position=='center')?' align="center" ':'';
                                        }
                                        
                                        chain+='<div class="'+i+'" '+align+' >'+
                                                  ((i=='row')?
                                                  '<div class="hti_template_images hti_'+options[i].sprite+'"></div>':
                                                  options[i]
                                                  )+
                                               '</div>';
                              }
                              chain+= '</div>';
                              
                    }
                    
                    
                    return chain;
          },
          getHeaders:function(){
                    var chain = '<div class="helper_headers" align="center">';
                    for(var x in helperLabels.modal.headers){
                              chain+='<div class="'+x+'">'+helperLabels.modal.headers[x]+'</div>';
                    }
                    
                    chain+='</div>';
                    return chain;        
          },
	  buildStructure:function(){
                    var o = this.options;
                    var p = this.prefix;
                    var cadenaHeader=   '<div class="Helper '+p+'_header">'+
                                                  '<div class="helper_veil '+p+'_header"></div>'+
                                        '</div>'+
                                        '<div class="Helper '+p+'_tools '+p+'_search">'+
                                                  '<div class="'+p+'_region '+p+'_right_corner">'+
                                                            '<div class="helper_item_search_tool helper_option_toSelect"></div>'+
                                                  '</div>'+
                                        '</div>'+
                                        '<div class="Helper '+p+'_tools '+p+'_items">'+
                                                  '<div class="'+p+'_region">'+
                                                            '<div class="helper_item_results_tool helper_option_toSelect"></div>'+
                                                            '<div class="helper_item_measure_tool helper_option_toSelect"></div>'+
                                                            '<div class="helper_item_analisis_tool helper_option_toSelect"></div>'+
                                                            '<div class="helper_item_legend_tool helper_option_toSelect"></div>'+
                                                            '<div class="helper_item_georeference_tool helper_option_toSelect"></div>'+
                                                            '<div class="helper_item_routing_tool helper_option_toSelect"></div>'+
                                                  '</div>'+
                                        '</div>'+
                                        '<div class="Helper '+p+'_tools '+p+'_scaleControl">'+
                                                  '<div class="'+p+'_region '+p+'_corner">'+
                                                            '<div class="helper_item_scaleControl_tool helper_option_toSelect"></div>'+
                                                  '</div>'+
                                        '</div>'+
                                        '<div class="Helper '+p+'_tools '+p+'_geolocation">'+
                                                  '<div class="'+p+'_region '+p+'_corner">'+
                                                            '<div class="helper_item_tracking_tool helper_option_toSelect"></div>'+
                                                            '<div class="helper_item_locateme_tool helper_option_toSelect"></div>'+
                                                  '</div>'+
                                        '</div>'+
                                        '<div class="Helper '+p+'_tools '+p+'_icon_help">'+
                                                  '<div class="'+p+'_region '+p+'_corner">'+
                                                            '<div class="helper_item_help_tool helper_option_toSelect"></div>'+
                                                  '</div>'+
                                        '</div>'+
                                        '<div class="Helper '+p+'_tools '+p+'_icon_print">'+
                                                  '<div class="'+p+'_region '+p+'_corner">'+
                                                            '<div class="helper_item_print_tool helper_option_toSelect"></div>'+
                                                  '</div>'+
                                        '</div>'+
                                        '<div class="Helper '+p+'_tools '+p+'_icon_share">'+
                                                  '<div class="'+p+'_region '+p+'_corner">'+
                                                            '<div class="helper_item_share_tool helper_option_toSelect"></div>'+
                                                  '</div>'+
                                        '</div>'+
                                        '<div class="Helper '+p+'_tools '+p+'_icon_download">'+
                                                  '<div class="'+p+'_region '+p+'_corner">'+
                                                            '<div class="helper_item_download_tool helper_option_toSelect"></div>'+
                                                  '</div>'+
                                        '</div>'+
                                        '<div class="Helper '+p+'_tools '+p+'_bottom_bar">'+
                                                  //'<div class="'+p+'_region" style="bottom:0px !important;"></div>'+
                                                  '<div class="helper_bottom_veil_first_section helper_veil"></div>'+
                                                  '<div class="helper_bottom_veil_second_section helper_veil"></div>'+
                                                  '<div class="helper_bottom_veil_third_section helper_veil"></div>'+
                                                  '<div class="helper_themes">'+
                                                            '<div class="'+p+'_region '+p+'_corner">'+
                                                                      '<div class="helper_item_themes_tool helper_option_toSelect"></div>'+
                                                            '</div>'+
                                                  '</div>'+
                                                  '<div class="helper_buttons_layers">'+
                                                            '<div class="'+p+'_region '+p+'_corner">'+
                                                                      '<div class="helper_item_layers_tool helper_option_toSelect"></div>'+
                                                                      '<div class="helper_item_baselayers_tool helper_option_toSelect"></div>'+
                                                            '</div>'+
                                                  '</div>'+
                                        '</div>';
                    var cadenaMap = '<div class="Helper '+p+'_map">'+
                                        '<div class="helper_veil" style="width:100%;top:0px;bottom:30px"></div>'+
                                        '<div class="helper_background" style="right:46px;"></div>'+
                                        '<div class="helper_background" style="right:17px;"></div>'+
                                        '<div class="helper_background" style="right:75px;"></div>'+
                                        '<div class="helper_background" style="right:104px;"></div>'+
                                        
                                 '</div>';
                    
                    cadenaMap+=this.getRowOptions();
                    $("#"+o.rootHeader).append(cadenaHeader);
                    $("#"+o.rootMap).append(cadenaMap);
                    $("#content").append(this.getBlockTitles());
                    $("#content").append(this.getHeaders());
                    
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
          
          events:function(){
                    
                    
          },
      
          _create: function() {
		this.buildStructure();
                this.events();
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
                                                  
                                        break;
                                        case 'title':
                                                  
                                        break;
                                                          
                              }
		    }
	  }
);
});