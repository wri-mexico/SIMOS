define([],function() {
    var tutorialCE = {
	id:'tutorialCE',
	root:'body',
	active:false,
	totalIcons:9,
	path:'tutorial/css/',
	clockTimer:null,
	clockIcon:null,
	actualIcon:1,
	defineTimer:function(){
	    var obj = this;
	    setTimeout(function(){
		obj.hide();
	    },5000);
	},
	create:function(){
	    var chain = this.getStructure();
	    $(this.root).append(chain);
	    this.active = true;
	    this.events();
	},
	getStructure:function(){
	    var chain=''+
	    '<div id="'+this.id+'">'+
		'<div class="labels">'+
		    //'<div class="description">Encuentra hoteles, restaurantes...</div>'+
		    '<div class="reference">¡CONOCE EL DENUE!</div>'+
		'</div>'+
		'<div class="marker"><div class="template_tutorialCE ttd_marker"></div></div>'+
		'<div class="icon_marker"><div id="icons_tuturial_denue" class="template_tutorialCE ttd_icon1"></div></div>'+
		
	    '</div>';
	    
	    return chain;
	},
	hide:function(){
	    
	    if(this.active){
		clearInterval(this.clockIcon);
		$("#"+this.id).remove();
		this.active = false;
		
	    }
	    
	},
	events:function(){
	    var obj=this;
	    var item = $("#icons_tuturial_denue");
	    
	    
	    $(".layerManager_h_c_item_label").each(function(){
		$(this).click(function(){
		    obj.hide();
		});
		
	    });
	    $("#mdm6DinamicPanel").click(function(){
		obj.hide();
	    });
	    amplify.subscribe( "hideTutorialDenue", function() {
		obj.hide();
	    });
	},
	loadCss:function(){
	    var obj = this;
	     $.when(
                    $('<link>', {rel: 'stylesheet',type: 'text/css',href: this.path+'tutorialCE.css'}).appendTo('head'),
                    $.Deferred(function( deferred ){
                        $( deferred.resolve );
                    })
                ).done(function(){
			obj.create();
                });  
	},
	show:function(){
	    this.loadCss();
	}
    };
    
    return tutorialCE;
});