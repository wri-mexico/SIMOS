$.widget( "custom.recordCard", {
          image:{
                    width:85,
                    margin:10,
                    maxWidth:0,
                    path:'img/denue'
          },
          sections:{
                    title:0,
                    more:0,
                    images:0,
                    pleg:0,
                    tools:0
          },
          enableMove:true,
          id:null,
          request:null,
	  options:{
		  controler:null,
                  size:{
                    height:300,
                    width:300
                  },
                  detail:{
                    url:''
                  },
                  controller:null,
                  data:{
                    Label:{
                      detail:[
                             {label:"Razon social",value:'Pilar blanco'},
                             {label:"Codigo postal",value:'452'}
                      ],
                      info:[
                             {label:"Titulo",value:'Reparacion mecanica en general de automoviles y camiones'},
                             {label:"Codigo postal",value:'452'},
                             {label:'Id',value:'768579'},
                             {label:'Nombre de la clase de actividad',value:'Reparacion mecanica en general de atutomoviles y camiones'},
                             {label:'Personal ocupado',value:'00 a 5 personas'},
                             {label:'Ubicacion',value:'Av. Paseo del Moral #328, Jardines del moral'},
                      ]
                    }/*,
                      images:[
                              {label:'uno',path:''},
                              {label:'uno',path:''},
                              {label:'uno',path:''},
                              {label:'uno',path:''},
                              {label:'uno',path:''}
          
                            ]*/
                    }
          },
	  
	  show:function(){
		  
	  },
	  hide:function(){
		  
	  },

	  _init:function(){
		this.show();
		
	  },
          getRecords:function(o,showAll,printAfter){
                    printAfter =(printAfter)?printAfter:0;
                    showAll = (showAll)?showAll:false;
                    var obj=this;
                    var chain='';
                    for(var x in o){
                              if(x>printAfter){
                                        var i = o[x];
                                        if(i.label=='Imagenes'){
                                                 obj.options.data.Label.images=o[x]; 
                                        }else{
                                                  var segment= '<div class="Row">'+
                                                                      '<label class="option">'+i.label+': </label>'+
                                                                      '<label class="value">'+i.value+'</label>'+
                                                                   '</div>';
                                                  if(!showAll){
                                                        if(i.value.length==0){segment='';}    
                                                  }
                                                  chain+=segment;
                                        }
                              }
                    }
                           
                    return chain;
          },
          getSectionShare:function(e){
                    var obj=this;
                    var chain =  '<div title="Descargar ficha" class="btn_download"><div class="recordCard_template download_item"></div></div>'+
                                 '<div title="Imprimir ficha" class="btn_print"><div class="recordCard_template print_item"></div></div>';
                    
                    for(var x in e){
                              if(x=='id'){
                                                  obj.id=e[x];
                              }
                              var section='';
                              if((e[x]!=null)||(e[x]!='')){
                                        section='<div class="recordCard_template '+x+'_item"></div>';
                              }else{
                                        section='<a target="_blank" href="'+e[x]+'"><div class="recordCard_template '+x+'_item"></div></a>';
                              }
                              chain+='<div class="btn_'+x+'">'+section+'</div>';
                    }
                    return chain;
          },
          getImages:function(){
                    var o = this.options;
                    var image = this.image;
                    var chain='';
                    var count=0;
                    if(o.data.Label.images){
                              var items = o.data.Label.images.value.split(',');
                              for(var x in items){
                                        var i = items[x].replace('/img-denue','');
                                        chain+='<div class="item_image" style="width:'+image.width+'px;padding-right:'+image.margin+'px">'+
                                                  '<a class="imageDenue" rel="denueGallery" href="'+image.path+i+'"><img class="itemImageDenue" style="max-width:100%;max-height:100%;border:1px solid #B3B3B3" src="'+image.path+i+'"></a>'+
                                               '</div>';
                                        count+=(image.width+image.margin);
                              }
                              image.maxWidth=count;         
                    }
                    return {size:count,chain:chain};
          },
          getSectionPictures:function(){
                    var data = this.getImages();
                    var chain='';
                    if(data.size>0){
                              chain=    '<div class="images_recordCard">'+
                              
                                                  '<div class="left">'+
                                                            '<div class="recordCard_template left_row"></div>'+
                                                  '</div>'+
                                                    
                                                  '<div class="center">'+
                                                            '<div style="width:'+data.size+'px" class="container_image">'+data.chain+'</div>'+                                     
                    
                                                  '</div>'+
                                                  
                                                  '<div class="right">'+
                                                            '<div class="recordCard_template right_row"></div>'+
                                                  '</div>'+
                                        '</div>'+
                                        '<div class="pleg_images_recordCard" style="display:none">'+
                                                  '<label>Ver galeria</label>'+
                                        '</div>';
                    }
                    return chain;
          },
          defineRequest:function(){
                var obj = this;
                var c = this.options.controller;
                this.request = c.request.New({
                    url:c.dataSource.cluster.recordCard.url,
                    type:c.dataSource.cluster.recordCard.type,
                    format:c.dataSource.cluster.recordCard.dataType,
                    contentType:"application/json; charset=utf-8",
                    params:'',
                    events:{
                        success:function(data,extraFields){
                            
                            var messages=[];
                            if(data){
                                if(data.response.success){
                                    var showAll = (extraFields.event)?true:false;    
                                    var chain =obj.getRecords(data.data.Label.detail,showAll,-1);
                                    if(extraFields.event){
                                        extraFields.event(chain);
                                    }else{
                                        $("."+extraFields.item).html(chain);
                                    }
                                }else{
                                    messages.push(data.response.message);
                                }
                            }else{
                                messages.push('Servicio para detalle de ficha disponible');
                            }
                            if(messages.length>0){
                                for(var x=0;x<messages.length;x++){
                                    MDM6('newNotification',{message:messages[x],time:5000});
                                }
                            }
                        },
                        before:function(a,extraFields){
                            
                        },
                        error:function(a,b,extraFields){
                            
                        },
                        complete:function(a,b,extraFields){
                        }
                    }
                });
          },
          update:function(data){
                    this.buildStructure(data);
                    this.addEvents();
                    this.getProperties();
                    if(this.options.data.Label.images){
                              this.defineContainerData();
                    }
          },
	  buildStructure:function(i){
                    var o = this.options;
                    var data = i.Label;
                    this.element.css({height:o.size.height+'px',width:o.size.width+'px'});
                    this.element.css('text-align','-webkit-auto !important');
                    var color='E5B449';
                    /*
                    if(data.color){
                        color = data.color.substring(1,data.color.length);
                    }
                    color='C_'+color;
                    */
                    color=data.color;
                    var height = 35;
                    var chain='<div class="recordCardItem">'+
                                        '<div class="Title">'+
                                                  '<div class="section_icon">'+
                                                            //'<div class="circle_icon" style="position:absolute;left:4px;height:35px;width:35px;-webkit-border-radius: 150px;border-radius: 150px;background:'+color+'"></div>'+
                                                            '<div id="circle_icon_svg" style="position:absolute;left:4px;">'+
                                                                      '<svg height="'+height+'" width="'+height+'"><circle cx="'+(height/2)+'" cy="'+(height/2)+'" r="'+(height/2)+'" fill="'+color+'"></circle></svg>'+
                                                            '</div>'+
                                                            '<div id="circle_icon_mirror" style="position:absolute;left:4px;">'+
                                                                      '<canvas id="circle_icon_mirror_canvas"></canvas>'+
                                                            '</div>'+
                                                  '</div>'+
                                                  //'<div class="section_icon no-print"><div class="recordCard_template '+color+'"></div></div>'+
                                                  '<div class="section_label" title="'+data.info[0].value+'">'+data.info[0].value+'</div>'+
                                        '</div>'+
                                        '<div class="Info">'+
                                                  this.getRecords(data.info)+
                                                  
                                        '</div>'+
                                        '<div class="more_info" opc="more">'+
                                                  '<div style="float:right">'+
                                                            '<div class="recordCard_template more_item"></div>'+
                                                  '</div>'+
                                                  
                                        '</div>'+
                                        '<div class="section_pictures">'+
                                                  this.getSectionPictures()+
                                        '</div>'+
                                        '<div class="section_share">'+
                                                  this.getSectionShare(data.contact)+
                                        '</div>'+
                              '</div>';
                    this.element.html(chain);
	  },
          getProperties:function(){
                    var s = this.sections;
                    s.title = $(".recordCardItem .Title").height();
                    s.more = 35;
                    s.images = ($(".images_recordCard"))?$(".images_recordCard").height():0;
                    s.pleg = ($(".pleg_images_recordCard"))?$(".pleg_images_recordCard").height():0;
                    s.tools = $(".section_share").height();
          },
          defineContainerData:function(){
                    var parent = $(".recordCardItem .Info");
                    var s = this.sections;
                    if($(".images_recordCard").css('display')){
                              var aditional = ($(".images_recordCard").css('display')=='block')?s.images:s.pleg;
                    }else{
                              var aditional=s.pleg;
                    }
                    
                    var alto = this.options.size.height -(s.title+s.more+s.tools+aditional);
                    parent.css({'height':alto+'px'});
          },
          getDetail:function(id,item,event){
                    var r = this.request;
                    r.setUrl(this.options.controller.dataSource.cluster.recordCard.url+'/id/detail');
                    r.setParams(JSON.stringify({id:id}));
                    r.setExtraFields({item:item,event:event});
                    r.execute();
          },
          showInfoDetail:function(item){
                    var parent = $(".recordCardItem .Info");
                    var btn = item.children('div').children('div');
                    var imagesSection = $(".images_recordCard");
                    var shareSection = $(".section_share");
                    var titleSection = $(".recordCardItem .Title");
                    var pleg = $(".pleg_images_recordCard");
                    var option = item.attr('opc');
                    var newOption = 'more';
                    if(option=='more'){
                              var o = this.options;
                              var data = o.data.Label;
                              var chain='<div class="Detail_recordCard"></div>';
                              parent.append(chain);
                              newOption = 'less';
                              imagesSection.css('display','none');
                              pleg.css('display','');
                              this.defineContainerData();
                              this.getDetail(this.id,'Detail_recordCard');
                              item.prev().addClass('hideInfoInitial');
                              
                    }else{
                              parent.css('height','auto');
                              $(".Detail_recordCard").remove();
                              imagesSection.css('display','');
                              pleg.css('display','none');
                              item.prev().removeClass('hideInfoInitial');
                    }
                    item.attr('opc',newOption);
                    btn.removeClass('more_item').removeClass('less_item');
                    btn.addClass(newOption+'_item');
          },
          isMovingValid:function(side){
                    var w = this.image.maxWidth;
                    var section = this.image.width+this.image.margin;
                    var p = $( ".container_image" ).position();
                    var valid=true;
                    if(side=='right'){
                              valid = (p.left==0)?false:true;
                    }else{
                              valid = ((p.left<w)&&(p.left>((w-section)*-1)))?true:false;
                    }
                    return valid;
          },
          animationMove:function(side,move){
                    var obj=this;
                    var size = this.image.width+this.image.margin;
                    if((this.isMovingValid(side))&&(obj.enableMove)){
                              obj.enableMove=false;
                              $( ".container_image" ).animate(
                                        {left: move+size},
                                        300,
                                        function() {
                                                  obj.enableMove=true;     
                                        }
                              );
                    }
          },
	  addEvents:function(){
                   
                    var obj=this;
                    obj.defineRequest();
                    $(".left_row").click(function(){
                              obj.animationMove('right','+=');
                    });
                    $(".right_row").click(function(){
                              obj.animationMove('left','-=');
                    });
                    $(".more_info").click(function(){
                              obj.showInfoDetail($(this));
                              obj.defineContainerData();
                    });
                    $(".pleg_images_recordCard").click(function(){
                              var item = $(".more_info");
                              obj.showInfoDetail(item);
                              obj.defineContainerData();
                    });
                    
                    $(".imageDenue").fancybox({
                              openEffect	: 'none',
                              closeEffect	: 'none',
                              tpl               : {
                                                            next:  '<a title="Siguiente" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
                                                            prev:  '<a title="Anterior" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>',
                                                            closeBtn : '<a title="Cerrar" class="fancybox-item fancybox-close" href="javascript:;"></a>'
                                                  }
                    });
                    $(".section_share .print_item").click(function(){
                              obj.options.controller.printClusters(false);
                              var evento = function(detail){
                                        var title ='<div class="Title">'+$('.recordCardItem .Title').html()+'</div>';
                                        var html = '<div style="position:absolute;left:25%;width:50%;"><center><img src="img/logo_denue.png"></center><div class="PopupElementItem none"><div class="recordCardItem">'+title+'<div class="Info"><div class="Detail_recordCard">'+detail+'</div></div>'+'</div></div></div>';
                                        obj.options.controller.printer.printHtml(html);
                              }
                              obj.getDetail(obj.id,'',evento);
                              setTimeout(function(){
                                        obj.options.controller.printClusters(true);
                              },1000);
                              
                    });
                    
                    var text = $(".recordCardItem .section_label").html();
                    
                    var settings = {
                              fill: '...',
                              lines: 1,
                              side: 'right',
                              tooltip: true,
                              width: 'auto',
                              parseHTML: false,
                              onTruncate: function () {}
                    }
                    //$(".recordCardItem .section_label").trunk8(settings);
          },
	  //llenado de datos
	  fillData:function(data){
	 		for(var x in data){
			var i= data[x];
			$("#tracking-"+x+"-data").html(i);	
			}
	  },
      // the constructor
          _create: function() {
                     //var start = new Date().getTime();
            	var obj = this;
		obj.buildStructure(obj.options.data);
                obj.addEvents();
                obj.getProperties();
                obj.defineContainerData();
		//obj.fillData();
                        //var end = new Date().getTime();
                        //console.log('record card' + (end-start))
		
          },
	  
      // called when created, and later when changing options
      _refresh: function(){
        // trigger a callback/event
        this._trigger( "change" );
      },
      // revert other modifications here
      _destroy: function() {
        //this.options.close();
        //this.element.remove();
          //.removeClass( "custom-timeline" )
          //.enableSelection().removeAttr('style').html('').removeAttr('class');
          this.element.remove();
          //$.Widget.prototype.destroy.call(this);
          
          
      },
 
      // _setOptions is called with a hash of all options that are changing
      // always refresh when changing options
     /*
      _setOptions: function() {
        // _super and _superApply handle keeping the right this-context
        this._superApply( arguments );
        this._refresh();
      },
 */
      // _setOption is called for each individual option that is changing
	  //aquí pegué lo que me dijo many 
		   _setOption: function(key, value){
					this.options[key] = value;
					switch(key){
						case "data":
							 this.update(value);
                                                          
						break;
						
						}
					}
				});
			
		//fin de lo que pegué que many me dijo que pegara 	