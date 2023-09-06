define([],function() {
    var tutorialDenue = {
	id:'tutorialDenue',
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
		    '<div class="description">Encuentra hoteles, restaurantes...</div>'+
		    '<div class="reference">¡CONOCE EL DENUE!</div>'+
		'</div>'+
		'<div class="marker"><div class="template_tutorialDenue ttd_marker"></div></div>'+
		'<div class="icon_marker"><div id="icons_tuturial_denue" class="template_tutorialDenue ttd_icon1"></div></div>'+
		
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
	    this.clockIcon = setInterval(function(){
				    
				    obj.actualIcon+=1;
				    if(obj.actualIcon<=obj.totalIcons){
					var clase="ttd_icon";
					var prev = clase+ (obj.actualIcon-1);
					var next = clase+(obj.actualIcon);
					if(obj.actualIcon>0){
					    item.removeClass(prev);
					}
					
					item.addClass(next);
				    }else{
					obj.hide();
				    }
				    
			    },1000);
	    
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
                    $('<link>', {rel: 'stylesheet',type: 'text/css',href: this.path+'tutorialDenue.css'}).appendTo('head'),
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
    
    return tutorialDenue;
});