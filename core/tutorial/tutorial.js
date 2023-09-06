define(['tutorialDenue'],function(tutorialDenue) {
    var tutorial = {
	id:'tutorial',
    idCE:'tutorialCE',
	root:'body',
	path:'tutorial/css/',
    clockCE:null,
    defineTimerCE:function(){
	    var obj = this;
	    setTimeout(function(){
		obj.hideCE();
	    },5000);
	},
	isCookie : function(){
	    var exist = false;
	    var Cookie = $.cookie(this.id);
	    if(typeof(Cookie)!='undefined'){
		exist = true;
	    }
	    exist = false;//trick
	   return exist;
	},
	defineCookie : function(){
	    var value = ""+ Math.floor(Math.random()*11) + (Math.floor(Math.random()*101));
	    $.cookie(this.id,value);  
	},
	getCloseTutorial:function(){
	    var chain = ''+
		'<div class="Tutorial-close">'+
		    'Salir'+
		'</div>';
	    return chain;
	},
	getCenter:function(){
	    var clase = 'Mouse';
	    var icon = 'scroll'
	    if($.isMobile){
		clase = 'Hand';
		icon = 'drag'
	    }
	    var chain = ''+
		'<div class="Tutorial-center">'+
		    '<div class="Tutorial_template '+(clase.toLowerCase())+'"></div>'+
		    '<div class="icon'+clase+'">'+
			'<div class="Tutorial_template '+icon+'"></div>'+
		    '</div>'+
		    '<div class="fonts'+clase+'">'+
				'<div class="title">Aumentar</div>'+
				'<div class="options">Disminuir</div>'+
		    '</div>'+
		    
		'</div>';
	    return chain;
	},
	getTools:function(){
	    var chain = '<div class="Tutorial-panel-tools">'+
			    '<div style="left:40px" class="vSeparator line-vertical"></div>'+
				'<div style="left:100px" class="vSeparator line-vertical"></div>'+
			    '<div style="left:163px" class="vSeparator line-vertical"></div>'+
			    '<div style="left:226px" class="vSeparator line-vertical"></div>'+
			    '<div style="left:288px" class="vSeparator line-vertical"></div>'+
				'<div style="hSeparator" class="hSeparator line-horizontal"></div>'+
			    '<div style="left:120px" class="vSeparatorMidle line-vertical"></div>'+
			    '<div class="fonts">'+
				'<div class="title">Herramientas</div>'+
				'<div class="options">Medir<br>An&aacute;lisis espacial<br>Leyenda<br>Digitalizar</div>'+
				'</div>'+
				
				'<div style="left:346px; height:92px" class="vSeparator line-vertical"></div>'+//linea ruteo
				'<div style="hSeparator" class="ruteo-hSeparator line-horizontal"></div>'+    //linea ruteo
				'<div class="fonts">'+
				'<div style="margin-left:351px; margin-top: -82px" class="options">Encuentra la mejor ruta<br>para llegar a tu destino</div>'+ // textos
			    '</div>'+
				
			'</div>';
	    return chain;
	},
	getSearch:function(){
	     var chain = '<div class="Tutorial-search">'+
			    '<div class="hSeparator line-horizontal"></div>'+
			    '<div class="fonts">'+
				'<div class="title">Ubica lugares<br>en el territorio</div>'+
			    '</div>'+
			'</div>';
	    return chain;
	    
	},
	getBottomPanel:function(){
	    var chain = //'<div class="Tutorial-bottomPanel">'+
			    '<div class="thems">'+
				'<div style="left:0px" class="vSeparator line-vertical"></div>'+
				'<div style="right:0px" class="vSeparator line-vertical"></div>'+
				'<div style="hSeparator" class="hSeparator line-horizontal"></div>'+
				'<div style="left:120px" class="vSeparatorMidle line-vertical"></div>'+
				'<div class="fonts">'+
				    '<div class="title">Temas</div>'+
				'</div>'+
			    '</div>'+
			    '<div class="mapReference">'+
				'<div class="hSeparator line-horizontal"></div>'+
				'<div style="right:0px" class="vSeparator line-vertical"></div>'+
				'<div class="fonts">'+
				    '<div class="title">Habilita el mapa de referencia</div>'+
				'</div>'+
			    '</div>'+
			    '<div class="addLayers">'+
				'<div class="hSeparator line-horizontal"></div>'+
				'<div style="right:0px" class="vSeparator line-vertical"></div>'+
				'<div class="fonts">'+
				    '<div class="title">Agrega otras capas de informaci&oacute;n</div>'+
				'</div>'+
			    '</div>'+
			    '<div class="transparency">'+
				'<div class="hSeparator line-horizontal"></div>'+
				'<div style="right:0px" class="vSeparator line-vertical"></div>'+
				'<div class="fonts">'+
				    '<div class="title">Activa el control de transparencia</div>'+
				'</div>'+
			    '</div>'+
			    '<div class="otherMaps">'+
				'<div class="hSeparator line-horizontal"></div>'+
				'<div style="right:0px" class="vSeparator line-vertical"></div>'+
				'<div class="fonts">'+
				    '<div class="title">Clic para ver otros mapas</div>'+
				'</div>'+
			    '</div>'+
			'</div>';
	    return chain;
	    
	},
	getControlZoom:function(){
	    var chain = '<div class="Tutorial-controlZoom">'+
			    //'<div style="top:0px" class="hSeparator line-horizontal"></div>'+
			    //'<div style="bottom:0px" class="hSeparator line-horizontal"></div>'+
			    //'<div style="right:30px" class="vSeparator line-vertical"></div>'+
			    //'<div style="right:39px;top:50%;" class="hSeparator line-horizontal"></div>'+
			    '<div style="position:absolute;top:13px;right:-10px;" class="Tutorial_template zoomBottons"></div>'+
			    '<div class="fonts">'+
				    '<div style="position:absolute;top: 0px;right:-36px" class="title">Aumentar</div>'+
				    '<div style="position:absolute;top: 51px;right: -34px;" class="options">Disminuir</div>'+
			    '</div>'+
			'</div>';
	    return chain;
	},
	
	getTrackingTool:function(){
		if($.isMobile){
	   var chain = '<div class="Tutorial-tracking">'+
						'<div class="hSeparator line-horizontal"></div>'+
						'<div class="vSeparator line-vertical"></div>'+
						'<div style="width:30px; top:166px; right:-135px"  class="hSeparator line-horizontal"></div>'+
						'<div class="fonts">'+
							'<div style=" margin-left: 411px;  margin-top: 162px" class="options">tracking</div>'+
						'</div>'+
							'<div style="width:44px; top:157px; right:-203px"  class="hSeparator line-horizontal"></div>'+
							'<div style="width:50px; height:52px; top: 156px; right: -206px" class="vSeparator line-vertical"></div>'+
							'<div style="width: 74px; top: 205px; right: -159px"   class="hSeparator line-horizontal"></div>'+
							'<div class="fonts">'+
								'<div class="options">Ubicación</div>'+
							'</div>'+
					'</div>';
		}else{
			var chain = '<div class="Tutorial-tracking">'+
								'<div class="hSeparator line-horizontal"></div>'+
								'<div class="vSeparator line-vertical"></div>'+
								'<div style="width:30px; top:166px; right:-135px"  class="hSeparator line-horizontal"></div>'+
								'<div class="fonts">'+
									'<div style=" margin-left: 411px;  margin-top: 162px" class="options">Ubicación</div>'+
								'</div>'+
					    '</div>';
			}
	    return chain;
	},
	
	getRightTools:function(){
	   var chain = '<div class="Tutorial-rightTools">'+
						'<div style="position:absolute;top:74px; right:120px" class="Tutorial_template rightTools_arrow"></div>'+
						'<div class="fonts">'+
							'<div style="position: absolute; right:257px; top:102px" class="title">descarga el</div>'+
							'<div style="position:absolute; right:288px; top:132px" class="title"> Denue </div>'+
						'</div>'+
				   '</div>';
	    return chain;
	},
	
	
	getContent: function(){
	    var chain = ''+
	    '<div class="TutorialMDM6">'+
		'<div class="overlay"></div>'+
		'<div class="content">'+
		    this.getCenter()+
		    this.getCloseTutorial()+
		    this.getTools()+
		    this.getSearch()+
		    this.getBottomPanel()+
		    this.getControlZoom()+
			this.getTrackingTool()+
			this.getRightTools()+
		'</div>'+
	    '</div>';
	    return chain;
	},
	show:function(){
        var obj=this;
	    var chain = this.getContent();
	    $(this.root).append(chain);
	    $('.Tutorial-close').click(function(){
            $(".TutorialMDM6").remove(); 
            tutorialDenue.show();
            if ($("#ecoTool").attr('id')==undefined) {
               obj.showInfoCE();
            }
            
	    });
	    $('.TutorialMDM6').click(function(){
            $(this).remove();
            tutorialDenue.show();
            if ($("#ecoTool").attr('id')==undefined) {
               obj.showInfoCE();
            }
	    });
	},
    showInfoCE:function(){
      var obj = this;
      var chain = obj.getStructureCE();
      $(this.root).append(chain);
      obj.eventsCE();
    },
    eventsCE:function(){
        var obj=this;
        obj.defineTimerCE();
        $("#"+obj.idCE).click(function(){
            obj.hideCE();
	    });
        $("#mdm6DinamicPanel").click(function(){
            obj.hideCE();
	    });
        $("#mdm6Layers").click(function(){
            obj.hideCE();
        });
	    amplify.subscribe( "hideTutorialCE", function() {
            obj.hideCE();
	    });
    },
    getStructureCE:function(){
	    var chain=''+
	    '<div id="'+this.idCE+'">'+
            '<div class="labels">'+
                //'<div class="description">Encuentra hoteles, restaurantes...</div>'+
               // '<div class="reference">¡CONOCE LOS RESULTADOS OPORTUNOS!</div>'+
            '</div>'+
            '<div class="marker"><div class="template_tutorialCE ttce_logo"></div></div>'+
		
	    '</div>';
	    
	    return chain;
	},
	hideCE:function(){
        var obj=this;
		clearInterval(obj.clockCE);
		$("#"+this.idCE).remove();
	},
	loadCss:function(){
	    var obj = this;
	     $.when(
                    $('<link>', {rel: 'stylesheet',type: 'text/css',href: this.path+'tutorial.css'}).appendTo('head'),
                    $.Deferred(function( deferred ){
                        $( deferred.resolve );
                    })
                ).done(function(){
		    if(!obj.isCookie()){
			obj.show();
			obj.defineCookie();
		    }
                });  
	},
	load:function(){
	    this.loadCss();
	    
	}
    }
    return tutorial;
});